import { Journal, ManuscriptQuery } from '../types/journal';

export interface AffinityEvaluation {
  score: number; // 0 - 100
  level: 'high' | 'medium' | 'low';
  justification: string;
  /** Nº de términos del manuscrito que coinciden con la revista (null si no se dio texto). */
  matchedTerms: number | null;
}

/** Longitud de raíz usada para comparar palabras (education / educational -> «educat»). */
const STEM_LENGTH = 6;

const STOP_WORDS = new Set([
  'para', 'como', 'entre', 'sobre', 'desde', 'hasta', 'hacia', 'este', 'esta',
  'estos', 'estas', 'estudio', 'estudios', 'investigacion', 'analisis', 'articulo', 'paper',
  'mediante', 'segun', 'cual', 'cuales', 'donde', 'tambien', 'otros', 'otras', 'nuevo', 'nueva',
  'with', 'from', 'about', 'study', 'studies', 'analysis', 'using', 'based', 'approach',
  'journal', 'review', 'revista', 'research', 'international', 'general', 'miscellaneous',
  'other', 'and', 'the', 'del', 'las', 'los', 'una', 'uno', 'por', 'con', 'sin', 'que',
]);

/**
 * Glosario español -> inglés (clave: raíz de 6 letras sin tildes).
 * Permite que un manuscrito en español encaje con categorías de SCImago, que están en inglés.
 */
const ES_EN_GLOSSARY: Record<string, string> = {
  educac: 'education', aprend: 'learning', ensena: 'teaching', docenc: 'teaching', docent: 'teacher',
  pedago: 'pedagogy education', curric: 'curriculum', univer: 'university higher education',
  superi: 'higher', evalua: 'assessment evaluation', calida: 'quality',
  salud: 'health', medici: 'medicine', medico: 'medical', enferm: 'nursing disease',
  pediat: 'pediatrics', epidem: 'epidemiology', vacuna: 'vaccine vaccination',
  oncolo: 'oncology cancer', cardio: 'cardiology', psicol: 'psychology', psiqui: 'psychiatry',
  farmac: 'pharmacology pharmacy', odonto: 'dentistry', veteri: 'veterinary', nutric: 'nutrition',
  alimen: 'food', primar: 'primary', atenci: 'care', cuidad: 'care', hospit: 'hospital',
  diagno: 'diagnosis', terapi: 'therapy', tratam: 'treatment', respir: 'respiratory',
  infecc: 'infectious infection', diabet: 'diabetes', obesid: 'obesity', ansied: 'anxiety',
  depres: 'depression', conduc: 'behavior', cognit: 'cognitive', emocio: 'emotion',
  quirur: 'surgery', cirugi: 'surgery', rehabi: 'rehabilitation', deport: 'sport',
  ejerci: 'exercise', fisiot: 'physiotherapy physical therapy', public: 'public',
  agricu: 'agriculture', agrono: 'agronomy', cultiv: 'crop', suelo: 'soil', suelos: 'soil',
  agua: 'water', ambien: 'environmental environment', ecolog: 'ecology', biodiv: 'biodiversity',
  clima: 'climate', climat: 'climate', energi: 'energy', renova: 'renewable', quimic: 'chemistry',
  fisica: 'physics', matema: 'mathematics', estadi: 'statistics', biolog: 'biology',
  botani: 'botany plant', planta: 'plant', plantas: 'plant', zoolog: 'zoology', marino: 'marine',
  pesca: 'fisheries', acuicu: 'aquaculture', bosque: 'forest forestry', forest: 'forestry',
  geolog: 'geology', minera: 'mining', geneti: 'genetics', molecu: 'molecular', celula: 'cell',
  microb: 'microbiology', inmuno: 'immunology', neuron: 'neural neuroscience',
  comput: 'computer computing', inform: 'information informatics', inteli: 'intelligence',
  artifi: 'artificial', automa: 'automation', ingeni: 'engineering', materi: 'materials',
  constr: 'construction', electr: 'electrical electronic', mecani: 'mechanical',
  indust: 'industrial', tecnol: 'technology', digita: 'digital', redes: 'networks',
  algori: 'algorithm', datos: 'data', profun: 'deep',
  econom: 'economics', finanz: 'finance', empres: 'business management', gestio: 'management',
  admini: 'administration', contab: 'accounting', turism: 'tourism', sociol: 'sociology',
  politi: 'political politics policy', derech: 'law', juridi: 'law legal', histor: 'history',
  filoso: 'philosophy', lingui: 'linguistics', lengua: 'language', litera: 'literature',
  arte: 'arts', musica: 'music', arquit: 'architecture', comuni: 'communication',
  period: 'journalism', medios: 'media', cultur: 'cultural culture', antrop: 'anthropology',
  geogra: 'geography', ciudad: 'urban', urbano: 'urban', demogr: 'demography',
  migrac: 'migration', genero: 'gender', mujer: 'women', mujere: 'women', infanc: 'child children',
  nino: 'child', ninos: 'children', adoles: 'adolescent', joven: 'youth', jovene: 'youth',
  juvent: 'youth', famili: 'family', trabaj: 'work labor', empleo: 'employment',
  pobrez: 'poverty', desarr: 'development', sosten: 'sustainability sustainable',
  cienci: 'science', cienti: 'science scientific', biblio: 'library bibliometrics',
  estudi: 'student students', alumno: 'student students', gamifi: 'gamification game games',
  lectur: 'reading', escrit: 'writing', metodo: 'methods', psicop: 'psychopathology',
};

function normalize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));
}

/** Convierte un texto en un conjunto de raíces comparables, traduciendo términos españoles conocidos. */
export function toStems(text: string): Set<string> {
  const stems = new Set<string>();
  for (const word of normalize(text)) {
    const stem = word.slice(0, STEM_LENGTH);
    stems.add(stem);
    const translation = ES_EN_GLOSSARY[stem] ?? ES_EN_GLOSSARY[word];
    if (translation) {
      for (const en of translation.split(' ')) {
        if (en && !STOP_WORDS.has(en)) stems.add(en.slice(0, STEM_LENGTH));
      }
    }
  }
  return stems;
}

// Las raíces de cada revista no cambian entre búsquedas: se calculan una sola vez.
const journalStemsCache = new WeakMap<Journal, Set<string>>();
function getJournalStems(journal: Journal): Set<string> {
  let stems = journalStemsCache.get(journal);
  if (!stems) {
    stems = toStems([
      journal.title,
      journal.scopeDescription,
      ...journal.subDisciplines,
      ...journal.sampleTopics,
    ].join(' '));
    journalStemsCache.set(journal, stems);
  }
  return stems;
}

// La consulta se tokeniza una vez por búsqueda, no una vez por revista.
let lastQueryKey = '';
let lastQueryStems = new Set<string>();
function getQueryStems(query: ManuscriptQuery): Set<string> {
  const key = `${query.title}\u0000${query.abstract}\u0000${(query.keywords || []).join('\u0001')}`;
  if (key !== lastQueryKey) {
    lastQueryKey = key;
    lastQueryStems = toStems(`${query.title || ''} ${query.abstract || ''} ${(query.keywords || []).join(' ')}`);
  }
  return lastQueryStems;
}

const isAllDisciplines = (d?: string) => !d || d === 'all' || d === 'Todas las disciplinas';

/**
 * Evalúa la afinidad temática multifactorial:
 * 1. Coincidencia disciplinar principal y secundaria (máx. 35)
 * 2. Tipo de artículo aceptado (máx. 20; 10 si la revista no lo informa)
 * 3. Coincidencia de título, resumen y palabras clave con el alcance y categorías (máx. 35)
 * 4. Ajustes: revista especializada (+5) e idioma de publicación (−10 si no coincide)
 */
export function evaluateThematicAffinity(
  journal: Journal,
  query: ManuscriptQuery
): AffinityEvaluation {
  const hasTitle = Boolean(query.title?.trim());
  const hasAbstract = Boolean(query.abstract?.trim());
  const hasKeywords = Boolean(query.keywords?.some(k => k.trim()));
  const hasDiscipline = !isAllDisciplines(query.primaryDiscipline);

  if (!hasTitle && !hasAbstract && !hasKeywords && !hasDiscipline) {
    return {
      score: 50,
      level: 'medium',
      justification: 'Búsqueda general: sin datos específicos de manuscrito provistos.',
      matchedTerms: null
    };
  }

  let totalScore = 0;
  const reasons: string[] = [];

  // Factor 1: Disciplina
  if (hasDiscipline) {
    const wanted = query.primaryDiscipline.toLowerCase();
    if (journal.primaryDiscipline.toLowerCase() === wanted) {
      totalScore += 35;
      reasons.push(`Alineada con la disciplina principal (${journal.primaryDiscipline})`);
    } else if (
      query.subDiscipline &&
      journal.subDisciplines.some(sub => sub.toLowerCase().includes(query.subDiscipline!.toLowerCase()))
    ) {
      totalScore += 30;
      reasons.push(`Alineada en subárea temática (${query.subDiscipline})`);
    } else if (journal.subDisciplines.some(sub => sub.toLowerCase() === wanted)) {
      totalScore += 25;
      reasons.push(`Cubre ${query.primaryDiscipline} como disciplina secundaria`);
    } else if (journal.scopeType === 'general_multidisciplinary') {
      totalScore += 25;
      reasons.push('Revista multidisciplinar que acepta contribuciones de esta área');
    } else {
      reasons.push('Disciplina tangencial o secundaria');
    }
  } else {
    totalScore += 25;
    reasons.push('Búsqueda multitemática (Todas las disciplinas)');
  }

  // Factor 2: Tipo de artículo
  if (query.articleType) {
    if (journal.acceptedArticleTypes.length === 0) {
      totalScore += 10;
      reasons.push('Tipos de artículo aceptados sin verificar');
    } else {
      const wanted = query.articleType.toLowerCase();
      const accepts = journal.acceptedArticleTypes.some(
        t => t.toLowerCase().includes(wanted) || wanted.includes(t.toLowerCase())
      );
      if (accepts) {
        totalScore += 20;
        reasons.push(`Acepta el formato de manuscrito: ${query.articleType}`);
      } else {
        reasons.push(`Revisar si acepta formato: ${query.articleType}`);
      }
    }
  } else {
    totalScore += 15;
  }

  // Factor 3: Coincidencia de contenido
  const queryStems = getQueryStems(query);
  const journalStems = getJournalStems(journal);
  let intersectionCount = 0;
  for (const stem of queryStems) {
    if (journalStems.has(stem)) intersectionCount++;
  }
  totalScore += Math.min(35, intersectionCount * 7);

  if (intersectionCount >= 3) {
    reasons.push(`Alta concordancia con el alcance y las categorías de la revista (${intersectionCount} términos coincidentes)`);
  } else if (intersectionCount >= 1) {
    reasons.push(`Concordancia moderada con el alcance temático (${intersectionCount} ${intersectionCount === 1 ? 'término coincidente' : 'términos coincidentes'})`);
  } else if (hasTitle || hasAbstract || hasKeywords) {
    reasons.push('Sin términos coincidentes con el alcance de la revista');
  }

  if (journal.scopeType === 'highly_focused' && intersectionCount >= 2) {
    totalScore += 5;
  }

  // Ajuste por idioma (solo si la revista informa sus idiomas)
  if (query.language && query.language !== 'Ambos' && journal.languages.length > 0) {
    if (!journal.languages.some(l => l.toLowerCase() === query.language.toLowerCase())) {
      totalScore -= 10;
      reasons.push(`No publica en ${query.language.toLowerCase()} (idiomas: ${journal.languages.join(', ')})`);
    }
  }

  const finalScore = Math.min(100, Math.max(10, Math.round(totalScore)));
  const level: AffinityEvaluation['level'] = finalScore >= 70 ? 'high' : finalScore >= 45 ? 'medium' : 'low';

  return {
    score: finalScore,
    level,
    justification: reasons.join('. ') + '.',
    matchedTerms: hasTitle || hasAbstract || hasKeywords ? intersectionCount : null
  };
}
