export type Quartile = 'Q1' | 'Q2' | 'Q3';

export type IndexSource = 'JCR (Clarivate)' | 'Scopus (SJR)' | 'Dialnet Métrica' | 'SciELO';

export interface QuartileEntry {
  source: IndexSource;
  quartile: Quartile;
  category: string;
  year: number;
  metricLabel: string; // e.g. "JIF: 4.8" or "SJR: 1.12"
}

export type PublicationModel = 
  | 'traditional_no_mandatory_fee' 
  | 'hybrid' 
  | 'full_open_access'
  | 'subscription_or_hybrid_unverified'; // SCImago: no es OA, sin saber si es suscripción pura o híbrida

export type FormatFreeStatus = 
  | 'confirmed'           // Permite formato libre en primer envío (Your Paper Your Way)
  | 'partially_verified'  // Formato libre aceptado pero con normas básicas
  | 'mandatory_template'  // Requiere plantilla editorial específica desde el inicio
  | 'unverified';         // Información no concluyente

export type VerificationStatus = 
  | 'verified' 
  | 'partially_verified' 
  | 'pending_confirmation';

export type BudgetEligibility = 
  | 'under_500_confirmed'   // <= 500 USD confirmado sin condiciones dudosas
  | 'under_500_conditioned' // <= 500 USD pero sujeto a aprobación de waiver / afiliación
  | 'over_500'              // Supera los 500 USD
  | 'cost_unknown';         // Coste no verificado suficientemente

export interface APCInfo {
  amount: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'CHF' | 'BRL';
  usdEquivalent: number;
  exchangeRateUsed: number;
  rateDate: string;
  mandatoryOtherFeesUSD: number; // Cargos obligatorios adicionales (envío, páginas, etc.)
  notes?: string;
}

export interface DiscountOrWaiver {
  id: string;
  type: 
    | 'diamond_funded' 
    | 'research4life' 
    | 'institutional_agreement' 
    | 'society_member' 
    | 'discretionary_waiver' 
    | 'general_discount';
  title: string;
  description: string;
  discountPercentage: number; // 0 to 100
  fixedDiscountUSD?: number;
  isAutomatic: boolean; // Si no requiere solicitud ni evaluación subjetiva
  conditions: string;
  evidenceUrl: string;
}

export interface VerificationSource {
  title: string;
  type: 'author_guidelines' | 'apc_pricing' | 'fee_policy' | 'waivers_policy' | 'indexing_database' | 'journal_homepage';
  url: string;
  lastCheckedDate: string;
  verifiedDataPoints: string[];
}


export interface Journal {
  id: string;
  /** 'curated': ficha revisada a mano. 'scimago': generada automáticamente desde el CSV de SCImago. */
  dataSource?: 'curated' | 'scimago';
  title: string;
  issn: string;
  eissn?: string;
  publisher: string;
  publisherUrl: string;
  journalUrl: string;
  instructionsUrl: string;
  feePolicyUrl: string;
  
  // Clasificación
  quartiles: QuartileEntry[];
  primaryDiscipline: string;
  subDisciplines: string[];
  scopeType: 'general_multidisciplinary' | 'broad_specialized' | 'highly_focused';
  scopeDescription: string;
  sampleTopics: string[];
  acceptedArticleTypes: string[];
  languages: string[];

  // Modalidad económica
  publicationModel: PublicationModel;
  isDiamondOA: boolean; // Si es OA 100% financiado institucionalmente (APC = 0 USD)
  formatFreeSubmission: FormatFreeStatus;
  formatFreeDetails: string;
  
  // Costes
  listAPC: APCInfo;
  availableDiscounts: DiscountOrWaiver[];
  
  // Indexación
  indexingDatabases: Array<{
    name: string;
    verified: boolean;
    directUrl?: string;
  }>;

  // Verificación y auditoría
  verificationStatus: VerificationStatus;
  lastVerificationDate: string;
  verificationNotes: string;
  sources: VerificationSource[];

  // Métricas editoriales adicionales
  averageReviewWeeks?: number;
  acceptanceRatePercent?: number;

  // Métricas SCImago (solo revistas importadas del CSV)
  sjrScore?: number;
  hIndex?: number;
  country?: string;
  scimagoAreas?: string[];
}

export interface ManuscriptQuery {
  title: string;
  abstract: string;
  keywords: string[];
  primaryDiscipline: string;
  subDiscipline?: string;
  articleType: string;
  language: string;
  
  // Preferencias editoriales
  accessPreference: 'all' | 'traditional_no_mandatory_fee' | 'hybrid' | 'full_open_access';
  acceptableQuartiles: Quartile[];
  maxBudgetUSD: number;
  preferFormatFree: boolean;
  excludeOverBudget: boolean;
  excludeUnverifiedCosts: boolean;
  strictRequirementsOnly: boolean;

  // Perfil del autor para cálculo de exenciones reales
  authorRegion?: 'none' | 'research4life_a' | 'research4life_b' | 'institutional_agreement_spain' | 'society_member';
}

export interface ScoringWeights {
  thematicAffinity: number; // Default: 35
  quartilePrestige: number; // Default: 25
  costAdvantage: number;    // Default: 20
  formatFree: number;       // Default: 10
  verificationTrust: number;// Default: 10
}

export interface EvaluatedJournal {
  journal: Journal;
  /** null cuando el coste no se conoce (p. ej. revistas OA de SCImago sin APC verificado). */
  effectiveCostUSD: number | null;
  costNotes: string;
  appliedDiscountName?: string;
  appliedDiscountPercent: number;
  isCostConditional: boolean;
  budgetEligibility: BudgetEligibility;
  /** Exención discrecional disponible previa solicitud (no incluida en effectiveCostUSD). */
  conditionalWaiver?: { name: string; percent: number; costIfGrantedUSD: number };
  thematicAffinity: 'high' | 'medium' | 'low';
  thematicAffinityScore: number; // 0 - 100
  thematicJustification: string;
  /** Términos del manuscrito que coinciden con la revista (null si no se escribió título/resumen/palabras clave). */
  thematicMatchedTerms: number | null;
  overallScore: number; // 0 - 100
  scoreBreakdown: {
    thematic: number;
    quartile: number;
    cost: number;
    format: number;
    verification: number;
  };
}
