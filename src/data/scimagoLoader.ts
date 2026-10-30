import { Journal, Quartile, QuartileEntry } from '../types/journal';

/** Formato compacto generado por scripts/build-scimago-data.mjs */
export interface ScimagoDataset {
  source: string;
  year: number;
  generatedAt: string;
  categories: string[];
  areas: string[];
  journals: Array<[
    sourceId: number,
    title: string,
    issns: string,
    publisher: string,
    flags: number,
    sjr: number,
    hIndex: number,
    country: string,
    categories: number[],
    areas: number[],
  ]>;
}

/** Áreas temáticas de SCImago -> disciplinas de la app. */
const AREA_TO_DISCIPLINE: Record<string, string> = {
  'Medicine': 'Ciencias de la Vida y Medicina',
  'Nursing': 'Ciencias de la Vida y Medicina',
  'Dentistry': 'Ciencias de la Vida y Medicina',
  'Health Professions': 'Ciencias de la Vida y Medicina',
  'Veterinary': 'Ciencias de la Vida y Medicina',
  'Immunology and Microbiology': 'Ciencias de la Vida y Medicina',
  'Biochemistry, Genetics and Molecular Biology': 'Ciencias de la Vida y Medicina',
  'Neuroscience': 'Ciencias de la Vida y Medicina',
  'Pharmacology, Toxicology and Pharmaceutics': 'Ciencias de la Vida y Medicina',
  'Agricultural and Biological Sciences': 'Ciencias Exactas y Naturales',
  'Environmental Science': 'Ciencias Exactas y Naturales',
  'Earth and Planetary Sciences': 'Ciencias Exactas y Naturales',
  'Mathematics': 'Ciencias Exactas y Naturales',
  'Physics and Astronomy': 'Ciencias Exactas y Naturales',
  'Chemistry': 'Ciencias Exactas y Naturales',
  'Engineering': 'Ingeniería y Tecnología',
  'Computer Science': 'Ingeniería y Tecnología',
  'Materials Science': 'Ingeniería y Tecnología',
  'Chemical Engineering': 'Ingeniería y Tecnología',
  'Energy': 'Ingeniería y Tecnología',
  'Social Sciences': 'Ciencias Sociales',
  'Economics, Econometrics and Finance': 'Ciencias Sociales',
  'Business, Management and Accounting': 'Ciencias Sociales',
  'Psychology': 'Ciencias Sociales',
  'Decision Sciences': 'Ciencias Sociales',
  'Arts and Humanities': 'Humanidades y Arte',
};

const QUARTILES: Array<Quartile | null> = [null, 'Q1', 'Q2', 'Q3', null];

export const normalizeIssn = (issn: string) => issn.replace(/[^0-9X]/gi, '').toUpperCase();

/** Convierte una fila compacta de SCImago en una ficha Journal utilizable por el motor de ranking. */
export function scimagoRowToJournal(
  row: ScimagoDataset['journals'][number],
  dataset: Pick<ScimagoDataset, 'categories' | 'areas' | 'year'>
): Journal {
  const [sourceId, title, issnsRaw, publisher, flags, sjr, hIndex, country, cats, areaIdx] = row;
  const isOA = (flags & 1) === 1;
  const isDiamond = (flags & 2) === 2;
  const issns = issnsRaw ? issnsRaw.split(',') : [];

  const categories = cats.map(code => ({
    name: dataset.categories[Math.floor(code / 10)],
    quartile: QUARTILES[code % 10],
  }));
  const areas = areaIdx.map(i => dataset.areas[i]);
  const isMultidisciplinary = areas.includes('Multidisciplinary');

  // Disciplina principal = la más repetida entre sus áreas; el resto pasan a subdisciplinas.
  const disciplineCounts = new Map<string, number>();
  for (const a of areas) {
    const d = AREA_TO_DISCIPLINE[a];
    if (d) disciplineCounts.set(d, (disciplineCounts.get(d) ?? 0) + 1);
  }
  const disciplines = [...disciplineCounts.entries()].sort((a, b) => b[1] - a[1]).map(([d]) => d);
  const primaryDiscipline = disciplines[0] ?? 'Multidisciplinar';

  const quartiles: QuartileEntry[] = categories
    .filter((c): c is { name: string; quartile: Quartile } => c.quartile !== null)
    .map(c => ({
      source: 'Scopus (SJR)',
      quartile: c.quartile,
      category: c.name,
      year: dataset.year,
      metricLabel: `SJR ${sjr.toFixed(2)}`,
    }));

  const scimagoUrl = `https://www.scimagojr.com/journalsearch.php?q=${sourceId}&tip=sid`;
  const searchUrl = (extra: string) =>
    `https://www.google.com/search?q=${encodeURIComponent(`"${title}" ${extra}`)}`;
  const today = `${dataset.year}`;

  return {
    id: `sjr-${sourceId}`,
    dataSource: 'scimago',
    title,
    issn: issns[0] ?? '',
    eissn: issns[1],
    publisher: publisher || 'Editorial no informada',
    publisherUrl: scimagoUrl,
    journalUrl: scimagoUrl,
    instructionsUrl: searchUrl('author guidelines'),
    feePolicyUrl: isOA && issns[0] ? `https://doaj.org/toc/${issns[0]}` : searchUrl('article processing charge'),
    quartiles,
    primaryDiscipline,
    subDisciplines: [...disciplines.slice(1), ...areas, ...categories.map(c => c.name)],
    scopeType: isMultidisciplinary ? 'general_multidisciplinary' : categories.length >= 4 ? 'broad_specialized' : 'highly_focused',
    scopeDescription: `Categorías SCImago: ${categories.map(c => c.name).join('; ')}. Áreas: ${areas.join('; ')}.`,
    sampleTopics: categories.map(c => c.name),
    acceptedArticleTypes: [],
    languages: [],
    publicationModel: isOA ? 'full_open_access' : 'subscription_or_hybrid_unverified',
    isDiamondOA: isDiamond,
    formatFreeSubmission: 'unverified',
    formatFreeDetails: 'Sin verificar: consulte las instrucciones para autores de la revista.',
    listAPC: {
      amount: 0,
      currency: 'USD',
      usdEquivalent: 0,
      exchangeRateUsed: 1,
      rateDate: today,
      mandatoryOtherFeesUSD: 0,
      notes: isDiamond
        ? 'Acceso Abierto Diamante según SCImago (sin APC para autores).'
        : 'Importe del APC no disponible en SCImago.',
    },
    availableDiscounts: [],
    indexingDatabases: [
      { name: 'Scopus', verified: true, directUrl: scimagoUrl },
      ...(isOA ? [{ name: 'DOAJ', verified: true }] : []),
    ],
    verificationStatus: isDiamond ? 'partially_verified' : 'pending_confirmation',
    lastVerificationDate: dataset.year.toString(),
    verificationNotes: isDiamond
      ? 'Ficha generada automáticamente desde SCImago. Cuartil, SJR y condición de Diamante proceden de SCImago/DOAJ; formato de envío y tipos de artículo sin verificar.'
      : 'Ficha generada automáticamente desde SCImago. Solo cuartil, SJR, área y acceso abierto están respaldados; el coste y el formato de envío no están verificados.',
    sources: [
      {
        title: `SCImago Journal & Country Rank ${dataset.year}`,
        type: 'indexing_database',
        url: scimagoUrl,
        lastCheckedDate: today,
        verifiedDataPoints: ['Cuartil por categoría', 'SJR', 'Índice H', 'Acceso abierto / Diamante (DOAJ)'],
      },
    ],
    sjrScore: sjr,
    hIndex,
    country,
    scimagoAreas: areas,
  };
}

/**
 * Convierte el dataset completo y descarta las revistas que ya están en la base curada
 * (coincidencia por ISSN), para que la ficha revisada a mano tenga prioridad.
 */
export function buildScimagoJournals(dataset: ScimagoDataset, curated: Journal[]): Journal[] {
  const curatedIssns = new Set<string>();
  for (const j of curated) {
    if (j.issn) curatedIssns.add(normalizeIssn(j.issn));
    if (j.eissn) curatedIssns.add(normalizeIssn(j.eissn));
  }
  const result: Journal[] = [];
  for (const row of dataset.journals) {
    const issns = row[2] ? row[2].split(',').map(normalizeIssn) : [];
    if (issns.some(i => curatedIssns.has(i))) continue;
    result.push(scimagoRowToJournal(row, dataset));
  }
  return result;
}

export async function loadScimagoJournals(curated: Journal[]): Promise<Journal[]> {
  const res = await fetch(`${import.meta.env.BASE_URL}data/scimago-2025.json`);
  if (!res.ok) throw new Error(`No se pudo cargar la base SCImago (HTTP ${res.status})`);
  const dataset = (await res.json()) as ScimagoDataset;
  return buildScimagoJournals(dataset, curated);
}
