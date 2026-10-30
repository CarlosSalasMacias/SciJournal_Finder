import { Journal, ManuscriptQuery, TopicProfile, TopicWeight } from '../types/journal';
import {
  TopicIndex, getTopicIndex, hasManuscriptText, inferTopicsLexical, matchJournal, queryTitleStems,
} from './topicModel';

export { toStems } from './textStems';

export interface AffinityEvaluation {
  score: number; // 0 - 100
  level: 'high' | 'medium' | 'low';
  justification: string;
  /** Relevancia temática 0–1 (null si no se dio texto del manuscrito). */
  relevance: number | null;
  sharedTopics: TopicWeight[];
}

/** Datos de la búsqueda que se calculan una vez y se reutilizan para todas las revistas. */
export interface AffinityContext {
  profile: TopicProfile;
  queryStemGroups: Set<string>[];
  index: TopicIndex | null;
  hasText: boolean;
}

/** Prepara la búsqueda: temas del manuscrito (los indicados o los detectados) y sus raíces. */
export function prepareAffinityContext(query: ManuscriptQuery, journals: Journal[]): AffinityContext {
  const hasText = hasManuscriptText(query);
  const index = journals.length > 0 ? getTopicIndex(journals) : null;
  const profile = query.topicProfile
    ?? (hasText && index ? inferTopicsLexical(query, index) : { source: 'lexical' as const, topics: [], extraTerms: [] });
  return { profile, queryStemGroups: queryTitleStems({ ...query, topicProfile: profile }), index, hasText };
}

const isAllDisciplines = (d?: string) => !d || d === 'all' || d === 'Todas las disciplinas';

const pct = (w: number) => `${Math.round(w * 100)} %`;

/**
 * Afinidad temática (0–100):
 * - Hasta 85 puntos por relevancia temática: categorías compartidas con los temas del manuscrito
 *   y términos del manuscrito presentes en el título o alcance de la revista.
 * - Hasta 10 por aceptar el tipo de artículo (5 si la revista no lo informa).
 * - 5 de base; −10 si la revista no publica en el idioma del manuscrito.
 */
export function evaluateThematicAffinity(
  journal: Journal,
  query: ManuscriptQuery,
  context?: AffinityContext
): AffinityEvaluation {
  const ctx = context ?? prepareAffinityContext(query, [journal]);
  const hasDiscipline = !isAllDisciplines(query.primaryDiscipline);
  const hasTopics = ctx.profile.topics.length > 0;

  if (!ctx.hasText && !hasTopics) {
    const inDiscipline = hasDiscipline && journal.primaryDiscipline.toLowerCase() === query.primaryDiscipline.toLowerCase();
    return {
      score: inDiscipline ? 60 : 50,
      level: 'medium',
      justification: hasDiscipline
        ? `Búsqueda por disciplina (${query.primaryDiscipline}) sin título ni resumen.`
        : 'Búsqueda general: sin datos específicos de manuscrito provistos.',
      relevance: null,
      sharedTopics: [],
    };
  }

  const reasons: string[] = [];
  const match = matchJournal(journal, ctx.profile, ctx.queryStemGroups, ctx.index);
  let total = 5 + 85 * match.relevance;

  if (match.sharedTopics.length > 0) {
    const list = match.sharedTopics.slice(0, 3).map(t => `${t.category} (${pct(t.weight)})`).join(', ');
    reasons.push(`Comparte temas del manuscrito: ${list}`);
  } else if (hasTopics) {
    reasons.push('No pertenece a ninguno de los temas detectados');
  }
  if (match.titleTerms.length > 0) {
    reasons.push(`Su título o alcance coincide en ${match.titleTerms.length} ${match.titleTerms.length === 1 ? 'término' : 'términos'}`);
  }

  // Tipo de artículo
  if (query.articleType) {
    if (journal.acceptedArticleTypes.length === 0) {
      total += 5;
    } else {
      const wanted = query.articleType.toLowerCase();
      const accepts = journal.acceptedArticleTypes.some(
        t => t.toLowerCase().includes(wanted) || wanted.includes(t.toLowerCase())
      );
      if (accepts) {
        total += 10;
        reasons.push(`Acepta el formato de manuscrito: ${query.articleType}`);
      } else {
        reasons.push(`Revisar si acepta formato: ${query.articleType}`);
      }
    }
  }

  // Idioma (solo si la revista informa sus idiomas)
  if (query.language && query.language !== 'Ambos' && journal.languages.length > 0) {
    if (!journal.languages.some(l => l.toLowerCase() === query.language.toLowerCase())) {
      total -= 10;
      reasons.push(`No publica en ${query.language.toLowerCase()} (idiomas: ${journal.languages.join(', ')})`);
    }
  }

  const score = Math.min(100, Math.max(0, Math.round(total)));
  const level: AffinityEvaluation['level'] = score >= 70 ? 'high' : score >= 45 ? 'medium' : 'low';

  return {
    score,
    level,
    justification: reasons.join('. ') + '.',
    relevance: Math.round(match.relevance * 100) / 100,
    sharedTopics: match.sharedTopics,
  };
}
