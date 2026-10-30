import { Journal, ManuscriptQuery, EvaluatedJournal, ScoringWeights, Quartile } from '../types/journal';
import { evaluateJournal, DEFAULT_WEIGHTS } from './rankingScorer';

export type CostPriorityMode =
  | 'zero_apc_first'    // 1º Sin APC (0 USD), 2º dentro del presupuesto, 3º coste sin verificar (predeterminado)
  | 'only_zero_apc'     // Solo revistas Sin APC (0 USD obligatorio / Diamante)
  | 'under_500_all';    // Sin prioridad por tramos: todas las que caben en el presupuesto

export interface FilterOptions {
  searchQuery?: string;
  selectedQuartiles: Quartile[];
  selectedDiscipline: string;
  selectedPublicationModels: string[];
  onlyFormatFree: boolean;
  onlyFreeOrUnder500: boolean;
  costPriorityMode: CostPriorityMode;
  selectedPublishers: string[];
  selectedIndexDatabases: string[];
  selectedVerificationStatuses: string[];
  strictCriteriaOnly: boolean;
  /** Incluir revistas sin ningún término en común con el manuscrito. */
  includeUnrelated: boolean;
  /** Incluir revistas cuyo coste no está verificado (fichas automáticas de SCImago). */
  includeUnknownCost: boolean;
  sortBy: 'score' | 'cost_asc' | 'affinity' | 'quartile' | 'format_free' | 'verification';
}

export const DEFAULT_FILTER_OPTIONS: FilterOptions = {
  searchQuery: '',
  selectedQuartiles: ['Q1', 'Q2', 'Q3'],
  selectedDiscipline: 'all',
  selectedPublicationModels: [],
  onlyFormatFree: false,
  onlyFreeOrUnder500: false,
  costPriorityMode: 'zero_apc_first',
  selectedPublishers: [],
  selectedIndexDatabases: [],
  selectedVerificationStatuses: [],
  strictCriteriaOnly: false,
  includeUnrelated: false,
  includeUnknownCost: true,
  sortBy: 'score'
};

const isAllDisciplines = (d?: string) => !d || d === 'all' || d === 'Todas las disciplinas';

/**
 * Tramo económico usado para ordenar:
 * 0 = Sin APC confirmado, 1 = dentro del presupuesto, 2 = dentro solo si conceden una exención,
 * 3 = coste sin verificar, 4 = supera el presupuesto.
 */
export function getEconomicTier(item: EvaluatedJournal, maxBudgetUSD: number): number {
  if (item.effectiveCostUSD === null) return 3;
  if (item.effectiveCostUSD > maxBudgetUSD) return item.budgetEligibility === 'under_500_conditioned' ? 2 : 4;
  if (item.isCostConditional) return 2;
  if (item.effectiveCostUSD === 0) return 0;
  return 1;
}

const QUARTILE_RANK = (item: EvaluatedJournal) =>
  item.journal.quartiles.some(q => q.quartile === 'Q1') ? 1 : item.journal.quartiles.some(q => q.quartile === 'Q2') ? 2 : 3;
const FORMAT_RANK = (item: EvaluatedJournal) =>
  item.journal.formatFreeSubmission === 'confirmed' ? 1 : item.journal.formatFreeSubmission === 'partially_verified' ? 2 : item.journal.formatFreeSubmission === 'unverified' ? 3 : 4;
const VERIFICATION_RANK = (item: EvaluatedJournal) =>
  item.journal.verificationStatus === 'verified' ? 1 : item.journal.verificationStatus === 'partially_verified' ? 2 : 3;

/** Normaliza nombres de editoriales con variantes («Elsevier B.V.», «Elsevier Ltd» -> «Elsevier»). */
export function publisherGroup(publisher: string): string {
  const groups = ['Elsevier', 'Springer', 'Wiley', 'Taylor', 'SAGE', 'MDPI', 'Oxford', 'Cambridge', 'IEEE', 'BMJ', 'CSIC', 'PLOS', 'Frontiers', 'De Gruyter', 'Emerald', 'Routledge'];
  const found = groups.find(g => publisher.toLowerCase().includes(g.toLowerCase()));
  if (found === 'Springer') return 'Springer Nature';
  if (found === 'Taylor') return 'Taylor & Francis';
  if (found === 'Oxford') return 'Oxford University Press';
  if (found === 'Cambridge') return 'Cambridge University Press';
  if (found === 'Wiley') return 'Wiley';
  return found ?? publisher;
}

/**
 * Filtra y ordena las revistas evaluadas. Por defecto prioriza:
 * 1º Sin APC, 2º dentro del presupuesto, 3º coste sin verificar, 4º fuera de presupuesto,
 * y dentro de cada tramo ordena por la puntuación global (afinidad, cuartil, coste…).
 */
export function filterAndRankJournals(
  journals: Journal[],
  query: ManuscriptQuery,
  filters: FilterOptions,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): EvaluatedJournal[] {
  const maxBudget = query.maxBudgetUSD ?? 500;
  const discipline = !isAllDisciplines(filters.selectedDiscipline)
    ? filters.selectedDiscipline
    : query.primaryDiscipline;
  const textQuery = filters.searchQuery?.toLowerCase().trim();

  const results: EvaluatedJournal[] = [];

  for (const journal of journals) {
    // --- Filtros baratos (no requieren evaluar la revista) ---

    if (textQuery) {
      const matches =
        journal.title.toLowerCase().includes(textQuery) ||
        journal.publisher.toLowerCase().includes(textQuery) ||
        journal.issn.toLowerCase().includes(textQuery) ||
        (journal.eissn?.toLowerCase().includes(textQuery) ?? false) ||
        journal.scopeDescription.toLowerCase().includes(textQuery);
      if (!matches) continue;
    }

    if (filters.selectedQuartiles.length > 0 &&
      !journal.quartiles.some(q => filters.selectedQuartiles.includes(q.quartile))) continue;

    if (!isAllDisciplines(discipline)) {
      const wanted = discipline.toLowerCase();
      const matchMain = journal.primaryDiscipline.toLowerCase() === wanted;
      const matchMulti = journal.scopeType === 'general_multidisciplinary';
      const matchSub = journal.subDisciplines.some(s => s.toLowerCase() === wanted);
      if (!matchMain && !matchMulti && !matchSub) continue;
    }

    if (filters.selectedPublicationModels.length > 0) {
      const m = filters.selectedPublicationModels;
      const matchesModel =
        (m.includes('traditional') && journal.publicationModel === 'traditional_no_mandatory_fee') ||
        (m.includes('hybrid') && journal.publicationModel === 'hybrid') ||
        (m.includes('subscription_unverified') && journal.publicationModel === 'subscription_or_hybrid_unverified') ||
        (m.includes('diamond') && journal.isDiamondOA) ||
        (m.includes('full_oa') && journal.publicationModel === 'full_open_access' && !journal.isDiamondOA);
      if (!matchesModel) continue;
    }

    if (filters.onlyFormatFree && journal.formatFreeSubmission !== 'confirmed') continue;

    if (filters.selectedPublishers.length > 0 &&
      !filters.selectedPublishers.includes(publisherGroup(journal.publisher))) continue;

    if (filters.selectedIndexDatabases.length > 0) {
      const dbMatch = filters.selectedIndexDatabases.every(dbName =>
        journal.indexingDatabases.some(idb => idb.verified && idb.name.toLowerCase().includes(dbName.toLowerCase()))
      );
      if (!dbMatch) continue;
    }

    if (filters.selectedVerificationStatuses.length > 0 &&
      !filters.selectedVerificationStatuses.includes(journal.verificationStatus)) continue;

    if (filters.strictCriteriaOnly && journal.verificationStatus !== 'verified') continue;

    // --- Filtros que dependen de la evaluación ---
    const item = evaluateJournal(journal, query, weights);
    const cost = item.effectiveCostUSD;

    if (filters.costPriorityMode === 'only_zero_apc' && cost !== 0) continue;
    if (cost === null && !filters.includeUnknownCost) continue;
    if (cost !== null && cost > maxBudget && item.budgetEligibility !== 'under_500_conditioned') continue;
    if (filters.onlyFreeOrUnder500 && item.budgetEligibility !== 'under_500_confirmed') continue;
    if (!filters.includeUnrelated && item.thematicMatchedTerms === 0) continue;
    if (filters.strictCriteriaOnly && (item.isCostConditional || item.thematicAffinityScore < 40)) continue;

    results.push(item);
  }

  const useTiers = filters.costPriorityMode !== 'under_500_all';
  const byTier = (a: EvaluatedJournal, b: EvaluatedJournal) =>
    useTiers ? getEconomicTier(a, maxBudget) - getEconomicTier(b, maxBudget) : 0;

  return results.sort((a, b) => {
    switch (filters.sortBy) {
      case 'cost_asc':
        // Coste desconocido al final
        return (a.effectiveCostUSD ?? Infinity) - (b.effectiveCostUSD ?? Infinity) || b.overallScore - a.overallScore;
      case 'affinity':
        return byTier(a, b) || b.thematicAffinityScore - a.thematicAffinityScore || b.overallScore - a.overallScore;
      case 'quartile':
        return byTier(a, b) || QUARTILE_RANK(a) - QUARTILE_RANK(b) || (b.journal.sjrScore ?? 0) - (a.journal.sjrScore ?? 0);
      case 'format_free':
        return byTier(a, b) || FORMAT_RANK(a) - FORMAT_RANK(b) || b.overallScore - a.overallScore;
      case 'verification':
        return byTier(a, b) || VERIFICATION_RANK(a) - VERIFICATION_RANK(b) || b.overallScore - a.overallScore;
      case 'score':
      default:
        return byTier(a, b) || b.overallScore - a.overallScore || b.thematicAffinityScore - a.thematicAffinityScore ||
          (a.effectiveCostUSD ?? Infinity) - (b.effectiveCostUSD ?? Infinity);
    }
  });
}
