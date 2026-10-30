import { Journal, ManuscriptQuery, EvaluatedJournal, ScoringWeights, Quartile } from '../types/journal';
import { evaluateJournal, DEFAULT_WEIGHTS } from './rankingScorer';

export type CostPriorityMode = 
  | 'zero_apc_first'    // 1º Prioriza Revistas Sin APC (0 USD), luego las de < 500 USD (Predeterminado)
  | 'only_zero_apc'     // Solo revistas Sin APC (0 USD obligatorio / Diamante)
  | 'under_500_all';    // Todas las que tengan coste <= 500 USD

export interface FilterOptions {
  searchQuery?: string;
  selectedQuartiles: Quartile[];
  selectedDiscipline: string;
  selectedPublicationModels: string[];
  onlyFormatFree: boolean;
  onlyFreeOrUnder500: boolean;
  maxCostUSD: number;
  costPriorityMode: CostPriorityMode;
  selectedPublishers: string[];
  selectedIndexDatabases: string[];
  selectedVerificationStatuses: string[];
  strictCriteriaOnly: boolean;
  sortBy: 'score' | 'cost_asc' | 'affinity' | 'quartile' | 'format_free' | 'verification';
}

export const DEFAULT_FILTER_OPTIONS: FilterOptions = {
  searchQuery: '',
  selectedQuartiles: ['Q1', 'Q2', 'Q3'],
  selectedDiscipline: 'all',
  selectedPublicationModels: [],
  onlyFormatFree: false,
  onlyFreeOrUnder500: false,
  maxCostUSD: 500,
  costPriorityMode: 'zero_apc_first',
  selectedPublishers: [],
  selectedIndexDatabases: [],
  selectedVerificationStatuses: [],
  strictCriteriaOnly: false,
  sortBy: 'score'
};

/**
 * Filtra y ordena las revistas evaluadas priorizando estrictamente:
 * 1º Revistas sin APC (0 USD de cargos obligatorios o Diamante)
 * 2º Revistas con coste estimado menor a 500 USD
 * 3º Revistas que superan el presupuesto
 */
export function filterAndRankJournals(
  journals: Journal[],
  query: ManuscriptQuery,
  filters: FilterOptions,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): EvaluatedJournal[] {
  // 1. Evaluar cada revista según los datos del manuscrito y costes calculados
  const evaluated = journals.map(j => evaluateJournal(j, query, weights));

  // 2. Aplicar filtros interactivos
  const filtered = evaluated.filter(item => {
    const { journal, effectiveCostUSD, budgetEligibility, thematicAffinityScore } = item;

    // Filtro de prioridad económica estricta si se selecciona "only_zero_apc"
    if (filters.costPriorityMode === 'only_zero_apc') {
      if (effectiveCostUSD !== 0) return false;
    }

    // Filtro de texto general (busca en título, editorial, issn, alcance)
    if (filters.searchQuery?.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchTitle = journal.title.toLowerCase().includes(q);
      const matchPublisher = journal.publisher.toLowerCase().includes(q);
      const matchScope = journal.scopeDescription.toLowerCase().includes(q);
      const matchIssn = journal.issn.toLowerCase().includes(q) || (journal.eissn && journal.eissn.toLowerCase().includes(q));
      const matchTopics = journal.sampleTopics.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchPublisher && !matchScope && !matchIssn && !matchTopics) {
        return false;
      }
    }

    // Filtro de Cuartil (la revista debe tener al menos un cuartil en los seleccionados)
    if (filters.selectedQuartiles.length > 0) {
      const hasSelectedQuartile = journal.quartiles.some(q => filters.selectedQuartiles.includes(q.quartile));
      if (!hasSelectedQuartile) return false;
    }

    // Filtro de Disciplina
    if (
      filters.selectedDiscipline &&
      filters.selectedDiscipline !== 'all' &&
      filters.selectedDiscipline !== 'Todas las disciplinas'
    ) {
      const matchMain = journal.primaryDiscipline.toLowerCase() === filters.selectedDiscipline.toLowerCase();
      const matchMulti = journal.scopeType === 'general_multidisciplinary';
      const matchSub = journal.subDisciplines.some(s => s.toLowerCase().includes(filters.selectedDiscipline.toLowerCase()));
      if (!matchMain && !matchMulti && !matchSub) return false;
    }

    // Filtro de Modalidad editorial
    if (filters.selectedPublicationModels.length > 0) {
      let matchesModel = false;
      if (filters.selectedPublicationModels.includes('traditional') && journal.publicationModel === 'traditional_no_mandatory_fee') {
        matchesModel = true;
      }
      if (filters.selectedPublicationModels.includes('hybrid') && journal.publicationModel === 'hybrid') {
        matchesModel = true;
      }
      if (filters.selectedPublicationModels.includes('diamond') && journal.isDiamondOA) {
        matchesModel = true;
      }
      if (filters.selectedPublicationModels.includes('full_oa') && journal.publicationModel === 'full_open_access' && !journal.isDiamondOA) {
        matchesModel = true;
      }
      if (!matchesModel) return false;
    }

    // Filtro Formato Libre confirmado
    if (filters.onlyFormatFree && journal.formatFreeSubmission !== 'confirmed') {
      return false;
    }

    // Filtro Coste final confirmado <= 500 USD (o sin cargos)
    if (filters.onlyFreeOrUnder500) {
      if (budgetEligibility !== 'under_500_confirmed') {
        return false;
      }
    }

    // Filtro Presupuesto Máximo (slider / input)
    if (effectiveCostUSD > filters.maxCostUSD) {
      return false;
    }

    // Filtro Editorial
    if (filters.selectedPublishers.length > 0) {
      const pubMatch = filters.selectedPublishers.some(p =>
        journal.publisher.toLowerCase().includes(p.toLowerCase())
      );
      if (!pubMatch) return false;
    }

    // Filtro Bases de Indexación
    if (filters.selectedIndexDatabases.length > 0) {
      const dbMatch = filters.selectedIndexDatabases.every(dbName =>
        journal.indexingDatabases.some(idb => idb.name.toLowerCase().includes(dbName.toLowerCase()) && idb.verified)
      );
      if (!dbMatch) return false;
    }

    // Filtro Estado de Verificación
    if (filters.selectedVerificationStatuses.length > 0) {
      if (!filters.selectedVerificationStatuses.includes(journal.verificationStatus)) {
        return false;
      }
    }

    // Modo Estricto: Excluye revistas no verificadas plenamente o con costes condicionados
    if (filters.strictCriteriaOnly) {
      if (journal.verificationStatus !== 'verified') return false;
      if (item.isCostConditional) return false;
      if (thematicAffinityScore < 40) return false;
    }

    return true;
  });

  // 3. Ordenar resultados según jerarquía económica y criterio seleccionado
  return filtered.sort((a, b) => {
    // Función de clasificación por niveles de coste:
    // Nivel 0: Sin APC (0 USD obligatorio / Diamante) -> MÁXIMA PRIORIDAD
    // Nivel 1: Cobran pero con coste <= 500 USD (> 0 y <= 500 USD) -> SEGUNDA PRIORIDAD
    // Nivel 2: Cobran más de 500 USD o desconocido -> TERCERA PRIORIDAD
    const getEconomicTier = (item: EvaluatedJournal) => {
      if (item.effectiveCostUSD === 0) return 0;
      if (item.effectiveCostUSD <= 500) return 1;
      return 2;
    };

    switch (filters.sortBy) {
      case 'cost_asc':
        return a.effectiveCostUSD - b.effectiveCostUSD;
      case 'affinity':
        // Si la prioridad económica está activada, primero separa los tramos de coste
        if (filters.costPriorityMode === 'zero_apc_first') {
          const tierDiff = getEconomicTier(a) - getEconomicTier(b);
          if (tierDiff !== 0) return tierDiff;
        }
        return b.thematicAffinityScore - a.thematicAffinityScore;
      case 'quartile': {
        if (filters.costPriorityMode === 'zero_apc_first') {
          const tierDiff = getEconomicTier(a) - getEconomicTier(b);
          if (tierDiff !== 0) return tierDiff;
        }
        const getRank = (item: EvaluatedJournal) => {
          if (item.journal.quartiles.some(q => q.quartile === 'Q1')) return 1;
          if (item.journal.quartiles.some(q => q.quartile === 'Q2')) return 2;
          return 3;
        };
        return getRank(a) - getRank(b);
      }
      case 'format_free': {
        if (filters.costPriorityMode === 'zero_apc_first') {
          const tierDiff = getEconomicTier(a) - getEconomicTier(b);
          if (tierDiff !== 0) return tierDiff;
        }
        const getFormatRank = (item: EvaluatedJournal) => {
          if (item.journal.formatFreeSubmission === 'confirmed') return 1;
          if (item.journal.formatFreeSubmission === 'unverified') return 2;
          return 3;
        };
        return getFormatRank(a) - getFormatRank(b);
      }
      case 'verification': {
        if (filters.costPriorityMode === 'zero_apc_first') {
          const tierDiff = getEconomicTier(a) - getEconomicTier(b);
          if (tierDiff !== 0) return tierDiff;
        }
        const getVerifRank = (item: EvaluatedJournal) => {
          if (item.journal.verificationStatus === 'verified') return 1;
          if (item.journal.verificationStatus === 'partially_verified') return 2;
          return 3;
        };
        return getVerifRank(a) - getVerifRank(b);
      }
      case 'score':
      default: {
        // En la puntuación recomendada por defecto:
        // SIEMPRE prioriza 1º Sin APC (0 USD), luego < 500 USD, luego > 500 USD
        if (filters.costPriorityMode === 'zero_apc_first') {
          const tierDiff = getEconomicTier(a) - getEconomicTier(b);
          if (tierDiff !== 0) return tierDiff;
        }
        return b.overallScore - a.overallScore;
      }
    }
  });
}
