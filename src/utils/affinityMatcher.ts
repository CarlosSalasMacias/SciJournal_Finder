import { Journal, ManuscriptQuery } from '../types/journal';

export interface AffinityEvaluation {
  score: number; // 0 - 100
  level: 'high' | 'medium' | 'low';
  justification: string;
}

/**
 * Normaliza y tokeniza texto para comparaciones semánticas simples pero sólidas
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar tildes
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);
}

const STOP_WORDS = new Set([
  'para', 'como', 'entre', 'sobre', 'desde', 'hasta', 'hacia', 'este', 'esta',
  'estos', 'estas', 'estudio', 'investigacion', 'analisis', 'articulo', 'paper',
  'with', 'from', 'about', 'study', 'analysis', 'using', 'based', 'approach'
]);

/**
 * Evalúa la afinidad temática multifactorial:
 * 1. Coincidencia disciplinar principal y subdisciplinas
 * 2. Correspondencia entre tipo de artículo y los tipos aceptados por la revista
 * 3. Coincidencia contextual entre título, resumen y palabras clave frente al alcance (scope) y temas de la revista
 * 4. Ajuste por tipo de alcance (multidisciplinar vs especializada vs hiperespecializada)
 */
export function evaluateThematicAffinity(
  journal: Journal,
  query: ManuscriptQuery
): AffinityEvaluation {
  // Si no hay ninguna información de manuscrito provista, devolver media neutra
  const hasTitle = Boolean(query.title?.trim());
  const hasAbstract = Boolean(query.abstract?.trim());
  const hasKeywords = Boolean(query.keywords && query.keywords.length > 0 && query.keywords.some(k => k.trim()));
  const hasDiscipline = Boolean(
    query.primaryDiscipline &&
    query.primaryDiscipline !== 'all' &&
    query.primaryDiscipline !== 'Todas las disciplinas'
  );

  if (!hasTitle && !hasAbstract && !hasKeywords && !hasDiscipline) {
    return {
      score: 50,
      level: 'medium',
      justification: 'Búsqueda general: sin datos específicos de manuscrito provistos.'
    };
  }

  let totalScore = 0;
  const reasons: string[] = [];

  // Factor 1: Disciplina principal y subdisciplinas (Peso 40%)
  if (hasDiscipline) {
    if (journal.primaryDiscipline.toLowerCase() === query.primaryDiscipline.toLowerCase()) {
      totalScore += 35;
      reasons.push(`Alineada con la disciplina principal (${journal.primaryDiscipline})`);
    } else if (journal.scopeType === 'general_multidisciplinary') {
      totalScore += 25;
      reasons.push('Revista multidisciplinar que acepta contribuciones de esta área');
    } else if (
      query.subDiscipline &&
      journal.subDisciplines.some(sub => sub.toLowerCase().includes(query.subDiscipline!.toLowerCase()))
    ) {
      totalScore += 30;
      reasons.push(`Alineada en subárea temática (${query.subDiscipline})`);
    } else {
      reasons.push('Disciplina tangencial o secundaria');
    }
  } else {
    // Si el usuario no especificó disciplina o seleccionó "Todas las disciplinas", asignamos base proporcional
    totalScore += 25;
    reasons.push('Búsqueda multitemática (Todas las disciplinas)');
  }

  // Factor 2: Tipo de artículo (Peso 20%)
  if (query.articleType) {
    const acceptsArticleType = journal.acceptedArticleTypes.some(
      t => t.toLowerCase().includes(query.articleType.toLowerCase()) || query.articleType.toLowerCase().includes(t.toLowerCase())
    );

    if (acceptsArticleType) {
      totalScore += 20;
      reasons.push(`Acepta el formato de manuscrito: ${query.articleType}`);
    } else {
      reasons.push(`Revisar si acepta formato: ${query.articleType}`);
    }
  } else {
    totalScore += 15;
  }

  // Factor 3: Text match (Título, Abstract, Keywords vs Scope y SampleTopics) (Peso 40%)
  const queryTokens = new Set([
    ...tokenize(query.title || ''),
    ...tokenize(query.abstract || ''),
    ...((query.keywords || []).flatMap(k => tokenize(k)))
  ].filter(t => !STOP_WORDS.has(t)));

  const journalTokens = new Set([
    ...tokenize(journal.title),
    ...tokenize(journal.scopeDescription),
    ...(journal.subDisciplines.flatMap(s => tokenize(s))),
    ...(journal.sampleTopics.flatMap(t => tokenize(t)))
  ].filter(t => !STOP_WORDS.has(t)));

  let intersectionCount = 0;
  for (const token of queryTokens) {
    if (journalTokens.has(token)) {
      intersectionCount++;
    }
  }

  const tokenOverlapScore = Math.min(35, intersectionCount * 7);
  totalScore += tokenOverlapScore;

  if (intersectionCount >= 3) {
    reasons.push(`Alta concordancia semántica con palabras clave y alcance editorial (${intersectionCount} términos clave concordantes)`);
  } else if (intersectionCount >= 1) {
    reasons.push(`Concordancia moderada con el alcance temático (${intersectionCount} términos coincidentes)`);
  }

  // Ajuste según especialización
  if (journal.scopeType === 'highly_focused' && intersectionCount >= 2) {
    totalScore += 5; // Premio por encaje en revista especializada
  }

  const finalScore = Math.min(100, Math.max(10, Math.round(totalScore)));

  let level: 'high' | 'medium' | 'low';
  if (finalScore >= 70) {
    level = 'high';
  } else if (finalScore >= 45) {
    level = 'medium';
  } else {
    level = 'low';
  }

  const justification = reasons.join('. ') + '.';

  return {
    score: finalScore,
    level,
    justification
  };
}
