import test from 'node:test';
import assert from 'node:assert/strict';
import { Journal, ManuscriptQuery } from '../types/journal';
import { calculateEffectiveCost } from './costCalculator';
import { evaluateThematicAffinity } from './affinityMatcher';
import { evaluateJournal, DEFAULT_WEIGHTS } from './rankingScorer';
import { filterAndRankJournals, DEFAULT_FILTER_OPTIONS } from './filterJournals';

// Revista mock: Tradicional sin cargos
const traditionalJournal: Journal = {
  id: 'test-trad',
  title: 'Journal of Academic Research',
  issn: '1234-5678',
  publisher: 'Academic Press',
  publisherUrl: 'https://example.com/publisher',
  journalUrl: 'https://example.com/journal',
  instructionsUrl: 'https://example.com/guide',
  feePolicyUrl: 'https://example.com/fees',
  quartiles: [
    { source: 'JCR (Clarivate)', quartile: 'Q1', category: 'Education', year: 2023, metricLabel: 'JIF 3.4' },
    { source: 'Scopus (SJR)', quartile: 'Q1', category: 'Education', year: 2023, metricLabel: 'SJR 1.2' }
  ],
  primaryDiscipline: 'Ciencias Sociales',
  subDisciplines: ['Educación', 'Tecnología Educativa'],
  scopeType: 'broad_specialized',
  scopeDescription: 'Revista especializada en investigación educativa superior y metodologías activas.',
  sampleTopics: ['educacion', 'docencia', 'aprendizaje', 'tecnologia', 'evaluacion'],
  acceptedArticleTypes: ['Investigación original', 'Revisión sistemática'],
  languages: ['Español', 'Inglés'],
  publicationModel: 'traditional_no_mandatory_fee',
  isDiamondOA: false,
  formatFreeSubmission: 'confirmed',
  formatFreeDetails: 'Envío inicial sin formato rígido. Estilo obligatorio solo tras aceptación.',
  listAPC: {
    amount: 0,
    currency: 'USD',
    usdEquivalent: 0,
    exchangeRateUsed: 1,
    rateDate: '2024-10-01',
    mandatoryOtherFeesUSD: 0
  },
  availableDiscounts: [],
  indexingDatabases: [
    { name: 'Web of Science (JCR)', verified: true },
    { name: 'Scopus', verified: true }
  ],
  verificationStatus: 'verified',
  lastVerificationDate: '2024-10-15',
  verificationNotes: 'Datos contrastados con guía oficial de autores.',
  sources: [
    {
      title: 'Guía oficial de autores',
      type: 'author_guidelines',
      url: 'https://example.com/guide',
      lastCheckedDate: '2024-10-15',
      verifiedDataPoints: ['Formato libre', 'Sin APC obligatorio']
    }
  ]
};

// Revista mock: OA Completo con APC alto y exenciones Research4Life
const openAccessJournal: Journal = {
  id: 'test-oa',
  title: 'Global Health Frontiers',
  issn: '8765-4321',
  publisher: 'Global Open',
  publisherUrl: 'https://example.com/publisher',
  journalUrl: 'https://example.com/journal',
  instructionsUrl: 'https://example.com/guide',
  feePolicyUrl: 'https://example.com/fees',
  quartiles: [
    { source: 'JCR (Clarivate)', quartile: 'Q2', category: 'Public Health', year: 2023, metricLabel: 'JIF 2.8' }
  ],
  primaryDiscipline: 'Ciencias de la Vida y Medicina',
  subDisciplines: ['Salud Pública', 'Epidemiología'],
  scopeType: 'broad_specialized',
  scopeDescription: 'Artículos de epidemiología y salud comunitaria.',
  sampleTopics: ['salud', 'epidemiologia', 'covid', 'vacunas', 'comunidad'],
  acceptedArticleTypes: ['Investigación original'],
  languages: ['Inglés'],
  publicationModel: 'full_open_access',
  isDiamondOA: false,
  formatFreeSubmission: 'confirmed',
  formatFreeDetails: 'Formato libre permitido en envío inicial.',
  listAPC: {
    amount: 1800,
    currency: 'USD',
    usdEquivalent: 1800,
    exchangeRateUsed: 1,
    rateDate: '2024-10-01',
    mandatoryOtherFeesUSD: 0
  },
  availableDiscounts: [
    {
      id: 'r4l-a',
      type: 'research4life',
      title: 'Research4Life Grupo A (100% Waiver)',
      description: 'Exención del 100% para autores de países Grupo A.',
      discountPercentage: 100,
      isAutomatic: true,
      conditions: 'País del autor principal en lista Research4Life Grupo A.',
      evidenceUrl: 'https://example.com/waivers'
    },
    {
      id: 'r4l-b',
      type: 'research4life',
      title: 'Research4Life Grupo B (50% Waiver)',
      description: 'Descuento del 50% para autores de países Grupo B.',
      discountPercentage: 50,
      isAutomatic: true,
      conditions: 'País del autor principal en lista Research4Life Grupo B.',
      evidenceUrl: 'https://example.com/waivers'
    }
  ],
  indexingDatabases: [
    { name: 'Web of Science (JCR)', verified: true },
    { name: 'PubMed / MEDLINE', verified: true }
  ],
  verificationStatus: 'verified',
  lastVerificationDate: '2024-10-15',
  verificationNotes: 'Precios comprobados en tarifa 2024.',
  sources: []
};

test('CostCalculator: traditional journal has 0 USD effective cost and under_500_confirmed', () => {
  const query: ManuscriptQuery = {
    title: 'Estudio de Tecnologías Educativas',
    abstract: 'Evaluación del impacto de plataformas interactivas en la educación universitaria.',
    keywords: ['educacion', 'tecnologia', 'aprendizaje'],
    primaryDiscipline: 'Ciencias Sociales',
    articleType: 'Investigación original',
    language: 'Español',
    accessPreference: 'all',
    acceptableQuartiles: ['Q1', 'Q2'],
    maxBudgetUSD: 500,
    preferFormatFree: true,
    excludeOverBudget: false,
    excludeUnverifiedCosts: false,
    strictRequirementsOnly: false
  };

  const cost = calculateEffectiveCost(traditionalJournal, query);
  assert.equal(cost.effectiveCostUSD, 0);
  assert.equal(cost.budgetEligibility, 'under_500_confirmed');
  assert.equal(cost.isCostConditional, false);
});

test('CostCalculator: Open Access journal with Research4Life Grupo A gets 100% waiver', () => {
  const query: ManuscriptQuery = {
    title: 'Epidemiologia comunitaria',
    abstract: 'Impacto de la vacunacion en salud publica',
    keywords: ['salud', 'vacunas'],
    primaryDiscipline: 'Ciencias de la Vida y Medicina',
    articleType: 'Investigación original',
    language: 'Inglés',
    accessPreference: 'full_open_access',
    acceptableQuartiles: ['Q1', 'Q2', 'Q3'],
    maxBudgetUSD: 500,
    preferFormatFree: false,
    excludeOverBudget: false,
    excludeUnverifiedCosts: false,
    strictRequirementsOnly: false,
    authorRegion: 'research4life_a'
  };

  const cost = calculateEffectiveCost(openAccessJournal, query);
  assert.equal(cost.effectiveCostUSD, 0);
  assert.equal(cost.appliedDiscountPercent, 100);
  assert.equal(cost.budgetEligibility, 'under_500_confirmed');
});

test('CostCalculator: Open Access journal without waiver exceeds 500 USD', () => {
  const query: ManuscriptQuery = {
    title: 'Epidemiologia comunitaria',
    abstract: 'Impacto de la vacunacion en salud publica',
    keywords: ['salud'],
    primaryDiscipline: 'Ciencias de la Vida y Medicina',
    articleType: 'Investigación original',
    language: 'Inglés',
    accessPreference: 'full_open_access',
    acceptableQuartiles: ['Q1', 'Q2', 'Q3'],
    maxBudgetUSD: 500,
    preferFormatFree: false,
    excludeOverBudget: false,
    excludeUnverifiedCosts: false,
    strictRequirementsOnly: false,
    authorRegion: 'none'
  };

  const cost = calculateEffectiveCost(openAccessJournal, query);
  assert.equal(cost.effectiveCostUSD, 1800);
  assert.equal(cost.budgetEligibility, 'over_500');
});

test('AffinityMatcher: High match for matching discipline, article type and keywords', () => {
  const query: ManuscriptQuery = {
    title: 'Evaluación del aprendizaje y docencia universitaria',
    abstract: 'Un estudio empírico sobre metodologías docentes y tecnologías en educación.',
    keywords: ['educacion', 'docencia', 'aprendizaje'],
    primaryDiscipline: 'Ciencias Sociales',
    subDiscipline: 'Educación',
    articleType: 'Investigación original',
    language: 'Español',
    accessPreference: 'all',
    acceptableQuartiles: ['Q1'],
    maxBudgetUSD: 500,
    preferFormatFree: true,
    excludeOverBudget: false,
    excludeUnverifiedCosts: false,
    strictRequirementsOnly: false
  };

  const affinity = evaluateThematicAffinity(traditionalJournal, query);
  assert.equal(affinity.level, 'high');
  assert.ok(affinity.score >= 70);
  assert.ok(affinity.justification.length > 20);
});

test('RankingScorer: Weights correctly prioritize multi-criteria score', () => {
  const query: ManuscriptQuery = {
    title: 'Evaluación de tecnologías en educación',
    abstract: 'Estudio empírico de docencia universitaria y herramientas digitales.',
    keywords: ['educacion', 'docencia', 'tecnologia'],
    primaryDiscipline: 'Ciencias Sociales',
    articleType: 'Investigación original',
    language: 'Español',
    accessPreference: 'all',
    acceptableQuartiles: ['Q1', 'Q2'],
    maxBudgetUSD: 500,
    preferFormatFree: true,
    excludeOverBudget: false,
    excludeUnverifiedCosts: false,
    strictRequirementsOnly: false
  };

  const evalResult = evaluateJournal(traditionalJournal, query, DEFAULT_WEIGHTS);
  assert.ok(evalResult.overallScore >= 80);
  assert.equal(evalResult.budgetEligibility, 'under_500_confirmed');
  assert.ok(evalResult.scoreBreakdown.thematic > 0);
  assert.ok(evalResult.scoreBreakdown.cost > 0);
  assert.ok(evalResult.scoreBreakdown.quartile > 0);
});

test('FilterAndRankJournals: Correctly filters by format free and budget <= 500', () => {
  const sampleQuery: ManuscriptQuery = {
    title: 'Educacion superior',
    abstract: 'Estudio de metodologia',
    keywords: ['educacion'],
    primaryDiscipline: 'Ciencias Sociales',
    articleType: 'Investigación original',
    language: 'Español',
    accessPreference: 'all',
    acceptableQuartiles: ['Q1', 'Q2'],
    maxBudgetUSD: 500,
    preferFormatFree: true,
    excludeOverBudget: true,
    excludeUnverifiedCosts: false,
    strictRequirementsOnly: false
  };

  const results = filterAndRankJournals([traditionalJournal, openAccessJournal], sampleQuery, {
    ...DEFAULT_FILTER_OPTIONS,
    onlyFormatFree: true,
    onlyFreeOrUnder500: true
  });

  // Only traditionalJournal satisfies <= 500 without region waiver
  assert.equal(results.length, 1);
  assert.equal(results[0].journal.id, 'test-trad');
});

test('FilterAndRankJournals: Strictly prioritizes 0 APC journals first, then < 500 USD journals', () => {
  // Mock journal with 450 USD cost
  const lowCostJournal: Journal = {
    ...openAccessJournal,
    id: 'test-low-cost',
    title: 'Low Cost Health Journal',
    listAPC: {
      amount: 400,
      currency: 'USD',
      usdEquivalent: 400,
      exchangeRateUsed: 1,
      rateDate: '2024-10-01',
      mandatoryOtherFeesUSD: 0
    },
    availableDiscounts: []
  };

  const sampleQuery: ManuscriptQuery = {
    title: 'Educacion superior',
    abstract: 'Estudio de metodologia',
    keywords: ['educacion'],
    primaryDiscipline: 'Todas las disciplinas',
    articleType: 'Investigación original',
    language: 'Español',
    accessPreference: 'all',
    acceptableQuartiles: ['Q1', 'Q2'],
    maxBudgetUSD: 2000,
    preferFormatFree: false,
    excludeOverBudget: false,
    excludeUnverifiedCosts: false,
    strictRequirementsOnly: false
  };

  // We pass:
  // 1) lowCostJournal ($400 USD)
  // 2) traditionalJournal ($0 USD)
  // 3) openAccessJournal ($1800 USD)
  const results = filterAndRankJournals(
    [lowCostJournal, traditionalJournal, openAccessJournal],
    sampleQuery,
    { ...DEFAULT_FILTER_OPTIONS, includeUnrelated: true }
  );

  assert.equal(results.length, 3);
  assert.equal(results[0].journal.id, 'test-trad', 'Tier 1 must be 0 APC journal');
  assert.equal(results[0].effectiveCostUSD, 0);

  assert.equal(results[1].journal.id, 'test-low-cost', 'Tier 2 must be < 500 USD journal');
  assert.equal(results[1].effectiveCostUSD, 400);

  assert.equal(results[2].journal.id, 'test-oa', 'Then the more expensive journal within budget');
  assert.equal(results[2].effectiveCostUSD, 1800);
});

test('FilterAndRankJournals: Correctly handles completely blank search fields with Todas las disciplinas', () => {
  const blankQuery: ManuscriptQuery = {
    title: '',
    abstract: '',
    keywords: [],
    primaryDiscipline: 'Todas las disciplinas',
    subDiscipline: '',
    articleType: 'Investigación original',
    language: 'Español',
    accessPreference: 'all',
    acceptableQuartiles: ['Q1', 'Q2', 'Q3'],
    maxBudgetUSD: 2000,
    preferFormatFree: false,
    excludeOverBudget: false,
    excludeUnverifiedCosts: false,
    strictRequirementsOnly: false,
    authorRegion: 'none'
  };

  const results = filterAndRankJournals(
    [traditionalJournal, openAccessJournal],
    blankQuery,
    DEFAULT_FILTER_OPTIONS
  );

  assert.equal(results.length, 2);
  assert.ok(results[0].overallScore > 0);
  assert.ok(results[1].overallScore > 0);
});
