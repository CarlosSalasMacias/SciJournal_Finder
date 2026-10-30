import { Journal, ManuscriptQuery, TopicProfile, TopicWeight } from '../types/journal';
import { toStems, toStemList } from './textStems';

/**
 * Modelo de temas.
 *
 * Cada categoría de SCImago se describe con su propio nombre y con el vocabulario de los títulos de
 * todas sus revistas (unas 24.000). Así «Music» queda asociada a jazz, opera, musicology, song…,
 * aunque esas palabras no estén en el nombre de la categoría.
 *
 * Para una búsqueda se calcula qué categorías se parecen más al manuscrito (TF-IDF + coseno) y después
 * cada revista recibe la relevancia de sus categorías, más un extra si su título comparte términos.
 */

export interface TopicIndex {
  categories: string[];
  /** Nombre en minúsculas -> nombre canónico. */
  canonical: Map<string, string>;
  /** Vector TF-IDF normalizado de cada categoría. */
  vectors: Map<string, Map<string, number>>;
  /** IDF de cada raíz entre categorías. */
  idf: Map<string, number>;
  /** IDF de cada raíz entre títulos de revistas. */
  titleIdf: Map<string, number>;
  maxTitleIdf: number;
}

/** Número máximo de temas que se conservan por búsqueda. */
const MAX_TOPICS = 6;
/** Un tema se conserva si su similitud es al menos este porcentaje de la del mejor. */
const RELATIVE_CUTOFF = 0.45;
/** Similitud mínima del mejor tema para considerar que se detectó algo. */
const MIN_SIMILARITY = 0.03;

/** Las categorías genéricas («… (miscellaneous)», «Multidisciplinary») cuentan menos: son poco específicas. */
const GENERIC_CATEGORY_FACTOR = 0.6;
const isGenericCategory = (c: string) => /miscellaneous|^multidisciplinary$/i.test(c);

const GENERIC_CATEGORY_WORDS = new Set(['miscellaneous', 'general', 'other', 'and']);

/** Categorías de una revista (las de SCImago si existen; si no, las de sus cuartiles de Scopus). */
export function journalCategories(journal: Journal): string[] {
  if (journal.topicCategories?.length) return journal.topicCategories;
  // Solo categorías de Scopus/SCImago: las de Clarivate (JCR) usan otra clasificación.
  return journal.quartiles.filter(q => !q.source.includes('JCR')).map(q => q.category);
}

function journalText(journal: Journal): string {
  return [journal.title, journal.scopeDescription, ...journal.sampleTopics].join(' ');
}

const indexCache = new WeakMap<Journal[], TopicIndex>();

/** Construye (una sola vez por lista de revistas) el índice de temas. */
export function getTopicIndex(journals: Journal[]): TopicIndex {
  let index = indexCache.get(journals);
  if (!index) {
    index = buildTopicIndex(journals);
    indexCache.set(journals, index);
  }
  return index;
}

export function buildTopicIndex(journals: Journal[]): TopicIndex {
  const canonical = new Map<string, string>();
  const counts = new Map<string, Map<string, number>>();
  const journalsPerCategory = new Map<string, number>();
  const titleDf = new Map<string, number>();

  const canon = (name: string) => {
    const key = name.toLowerCase();
    let c = canonical.get(key);
    if (!c) { c = name; canonical.set(key, c); }
    return c;
  };

  for (const journal of journals) {
    const stems = toStems(journalText(journal));
    for (const s of stems) titleDf.set(s, (titleDf.get(s) ?? 0) + 1);
    const cats = [...new Set(journalCategories(journal).map(canon))];
    for (const cat of cats) {
      journalsPerCategory.set(cat, (journalsPerCategory.get(cat) ?? 0) + 1);
      let tf = counts.get(cat);
      if (!tf) { tf = new Map(); counts.set(cat, tf); }
      for (const s of stems) tf.set(s, (tf.get(s) ?? 0) + 1);
    }
  }

  // El nombre de la categoría pesa como si apareciera en buena parte de sus títulos.
  for (const [cat, tf] of counts) {
    const nameWeight = 2 + 0.3 * (journalsPerCategory.get(cat) ?? 0);
    const words = cat.toLowerCase().replace(/[()]/g, ' ').split(/[\s,]+/).filter(w => !GENERIC_CATEGORY_WORDS.has(w));
    for (const s of toStems(words.join(' '))) tf.set(s, (tf.get(s) ?? 0) + nameWeight);
  }

  const categories = [...counts.keys()];
  const df = new Map<string, number>();
  for (const tf of counts.values()) for (const s of tf.keys()) df.set(s, (df.get(s) ?? 0) + 1);
  const idf = new Map<string, number>();
  for (const [s, n] of df) idf.set(s, Math.log(categories.length / n));

  const vectors = new Map<string, Map<string, number>>();
  for (const [cat, tf] of counts) {
    const v = new Map<string, number>();
    let norm = 0;
    for (const [s, n] of tf) {
      const w = (1 + Math.log(n)) * (idf.get(s) ?? 0);
      if (w > 0) { v.set(s, w); norm += w * w; }
    }
    norm = Math.sqrt(norm) || 1;
    for (const [s, w] of v) v.set(s, w / norm);
    vectors.set(cat, v);
  }

  const titleIdf = new Map<string, number>();
  let maxTitleIdf = 0;
  for (const [s, n] of titleDf) {
    const w = Math.log(1 + journals.length / n);
    titleIdf.set(s, w);
    if (w > maxTitleIdf) maxTitleIdf = w;
  }

  return { categories: categories.sort((a, b) => a.localeCompare(b)), canonical, vectors, idf, titleIdf, maxTitleIdf };
}

export function manuscriptText(query: ManuscriptQuery): string {
  return `${query.title || ''} ${query.abstract || ''} ${(query.keywords || []).join(' ')}`;
}

export function hasManuscriptText(query: ManuscriptQuery): boolean {
  return manuscriptText(query).trim().length > 0;
}

/**
 * Detecta los temas del manuscrito comparando su texto con el vocabulario de cada categoría.
 * El título y las palabras clave cuentan el doble que el resumen.
 */
export function inferTopicsLexical(query: ManuscriptQuery, index: TopicIndex): TopicProfile {
  const weights = new Map<string, number>();
  const add = (text: string, factor: number) => {
    for (const s of toStemList(text)) {
      const idf = index.idf.get(s);
      if (idf) weights.set(s, Math.max(weights.get(s) ?? 0, idf * factor));
    }
  };
  add(query.abstract || '', 1);
  add(`${query.title || ''} ${(query.keywords || []).join(' ')}`, 2);

  let norm = 0;
  for (const w of weights.values()) norm += w * w;
  norm = Math.sqrt(norm);

  const scored: TopicWeight[] = [];
  if (norm > 0) {
    for (const [cat, vec] of index.vectors) {
      let dot = 0;
      for (const [s, w] of weights) dot += w * (vec.get(s) ?? 0);
      if (dot > 0) scored.push({ category: cat, weight: (dot / norm) * (isGenericCategory(cat) ? GENERIC_CATEGORY_FACTOR : 1) });
    }
  }
  scored.sort((a, b) => b.weight - a.weight);
  const best = scored[0]?.weight ?? 0;
  const topics = best < MIN_SIMILARITY
    ? []
    : scored
      .filter(t => t.weight >= best * RELATIVE_CUTOFF)
      .slice(0, MAX_TOPICS)
      .map(t => ({ category: t.category, weight: round2(t.weight / best) }));

  return { source: 'lexical', topics, extraTerms: [] };
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Grupos de raíces que se comparan con el título de cada revista: el texto del manuscrito y, aparte,
 * los términos sugeridos por la IA (se usa la mejor de las dos coincidencias).
 */
export function queryTitleStems(query: ManuscriptQuery): Set<string>[] {
  const groups = [toStems(manuscriptText(query))];
  const extra = query.topicProfile?.extraTerms ?? [];
  if (extra.length > 0) groups.push(toStems(extra.join(' ')));
  return groups.filter(g => g.size > 0);
}

const journalStemsCache = new WeakMap<Journal, Set<string>>();
export function journalStems(journal: Journal): Set<string> {
  let stems = journalStemsCache.get(journal);
  if (!stems) {
    stems = toStems(journalText(journal));
    journalStemsCache.set(journal, stems);
  }
  return stems;
}

const journalCategoryStemsCache = new WeakMap<Journal, Set<string>>();
function journalStemsWithCategories(journal: Journal): Set<string> {
  let stems = journalCategoryStemsCache.get(journal);
  if (!stems) {
    stems = new Set([...journalStems(journal), ...toStems(journalCategories(journal).join(' '))]);
    journalCategoryStemsCache.set(journal, stems);
  }
  return stems;
}

export interface TopicMatch {
  /** 0–1: relevancia temática combinada. */
  relevance: number;
  /** Temas del manuscrito que comparte la revista, de mayor a menor peso. */
  sharedTopics: TopicWeight[];
  /** Raíces del manuscrito presentes en el título o alcance de la revista. */
  titleTerms: string[];
}

/**
 * Relevancia de una revista para el perfil temático del manuscrito:
 * 75 % por compartir categorías (según su peso) y hasta 35 % por compartir términos en el título.
 * Si no hay temas, solo cuenta la coincidencia de términos.
 */
export function matchJournal(
  journal: Journal,
  profile: TopicProfile,
  queryStemGroups: Set<string>[],
  index: TopicIndex | null
): TopicMatch {
  const cats = new Set(journalCategories(journal).map(c => c.toLowerCase()));
  const sharedTopics = profile.topics.filter(t => cats.has(t.category.toLowerCase()));
  const best = sharedTopics.reduce((m, t) => Math.max(m, t.weight), 0);
  const others = sharedTopics.reduce((m, t) => m + t.weight, 0) - best;
  const topicScore = Math.min(1, best + 0.1 * others);

  // Sin temas detectados (p. ej. base muy pequeña), la coincidencia de términos también mira las categorías.
  const noTopics = profile.topics.length === 0;
  const jStems = noTopics ? journalStemsWithCategories(journal) : journalStems(journal);
  let titleScore = 0;
  let titleTerms: string[] = [];
  for (const group of queryStemGroups) {
    const terms: string[] = [];
    let hit = 0;
    let total = 0;
    for (const s of group) {
      const w = index?.titleIdf.get(s) ?? (index && index.maxTitleIdf > 0 ? index.maxTitleIdf : 1);
      total += w;
      if (jStems.has(s)) { hit += w; terms.push(s); }
    }
    const score = total > 0 ? hit / total : 0;
    if (score > titleScore) { titleScore = score; titleTerms = terms; }
  }

  const relevance = noTopics ? titleScore : Math.min(1, 0.75 * topicScore + 0.35 * titleScore);
  return { relevance, sharedTopics, titleTerms };
}
