import test from 'node:test';
import assert from 'node:assert/strict';
import { ManuscriptQuery, Journal } from '../types/journal';
import { scimagoRowToJournal, buildScimagoJournals, ScimagoDataset } from '../data/scimagoLoader';
import { calculateEffectiveCost } from './costCalculator';
import { evaluateThematicAffinity, prepareAffinityContext } from './affinityMatcher';
import { getTopicIndex, inferTopicsLexical } from './topicModel';
import { parseAiAnswer } from './aiTopics';
import { stemWord } from './textStems';
import { evaluateJournal } from './rankingScorer';
import { filterAndRankJournals, DEFAULT_FILTER_OPTIONS, getEconomicTier } from './filterJournals';
import { bestQuartile } from './labels';

const dataset: ScimagoDataset = {
  source: 'test',
  year: 2025,
  generatedAt: '2025-01-01',
  categories: ['Education', 'Oncology', 'Hematology'],
  areas: ['Social Sciences', 'Medicine'],
  journals: [
    // Diamante, Educación Q2
    [1, 'Revista de Docencia Universitaria', '1887-4592', 'Universidad X', 3, 0.5, 20, 'Spain', [0 * 10 + 2], [0]],
    // OA con APC, Oncología Q1 + Hematología Q3
    [2, 'Open Oncology Reports', '1111-2222,3333-4444', 'Big Publisher', 1, 2.1, 80, 'United Kingdom', [1 * 10 + 1, 2 * 10 + 3], [1]],
    // Suscripción, Educación Q1
    [3, 'Journal of Teacher Education', '0022-4871', 'SAGE Publications Inc.', 0, 3.2, 120, 'United States', [0 * 10 + 1], [0]],
  ],
};

const baseQuery: ManuscriptQuery = {
  title: '',
  abstract: '',
  keywords: [],
  primaryDiscipline: 'Todas las disciplinas',
  articleType: 'Investigación original',
  language: 'Español',
  accessPreference: 'all',
  acceptableQuartiles: ['Q1', 'Q2', 'Q3'],
  maxBudgetUSD: 500,
  preferFormatFree: true,
  excludeOverBudget: false,
  excludeUnverifiedCosts: false,
  strictRequirementsOnly: false,
  authorRegion: 'none',
};

const [diamond, openAccess, subscription] = dataset.journals.map(r => scimagoRowToJournal(r, dataset));

test('SCImago: convierte filas en fichas con disciplina, cuartiles y modalidad', () => {
  assert.equal(diamond.dataSource, 'scimago');
  assert.equal(diamond.primaryDiscipline, 'Ciencias Sociales');
  assert.equal(diamond.isDiamondOA, true);
  assert.equal(openAccess.publicationModel, 'full_open_access');
  assert.equal(openAccess.eissn, '3333-4444');
  assert.equal(subscription.publicationModel, 'subscription_or_hybrid_unverified');
  assert.equal(bestQuartile(openAccess), 'Q1');
  assert.deepEqual(openAccess.quartiles.map(q => q.category), ['Oncology', 'Hematology']);
});

test('SCImago: Diamante cuesta 0 USD; el resto queda como coste sin verificar (null)', () => {
  assert.equal(calculateEffectiveCost(diamond, baseQuery).effectiveCostUSD, 0);
  const oa = calculateEffectiveCost(openAccess, baseQuery);
  assert.equal(oa.effectiveCostUSD, null);
  assert.equal(oa.budgetEligibility, 'cost_unknown');
  assert.equal(calculateEffectiveCost(subscription, baseQuery).effectiveCostUSD, null);
});

test('SCImago: descarta revistas que ya están en la base curada (mismo ISSN)', () => {
  const curated = [{ ...subscription, id: 'curated', dataSource: 'curated', issn: '0022-4871' } as Journal];
  const list = buildScimagoJournals(dataset, curated);
  assert.equal(list.length, 2);
  assert.ok(!list.some(j => j.title === 'Journal of Teacher Education'));
});

test('Afinidad: un título en español encaja con categorías en inglés', () => {
  const query = { ...baseQuery, title: 'Evaluación de la educación superior y la formación docente' };
  const ctx = prepareAffinityContext(query, [diamond, openAccess, subscription]);
  assert.equal(ctx.profile.topics[0]?.category, 'Education', 'educación debe llevar a Education');
  const edu = evaluateThematicAffinity(subscription, query, ctx);
  const onco = evaluateThematicAffinity(openAccess, query, ctx);
  assert.ok((edu.relevance ?? 0) > 0.5);
  assert.equal(onco.relevance, 0);
  assert.ok(edu.score > onco.score);
});

test('Afinidad: penaliza revistas que no publican en el idioma del manuscrito', () => {
  const english: Journal = { ...subscription, languages: ['Inglés'] };
  const spanish: Journal = { ...subscription, languages: ['Español', 'Inglés'] };
  const query = { ...baseQuery, title: 'Educación superior' };
  assert.ok(evaluateThematicAffinity(spanish, query).score > evaluateThematicAffinity(english, query).score);
  assert.equal(
    evaluateThematicAffinity(english, { ...query, language: 'Ambos' }).score,
    evaluateThematicAffinity(spanish, { ...query, language: 'Ambos' }).score
  );
});

test('Filtro: excluye revistas sin coincidencia temática salvo que se pida lo contrario', () => {
  const query = { ...baseQuery, title: 'Educación superior' };
  const journals = [diamond, openAccess, subscription];
  const related = filterAndRankJournals(journals, query, DEFAULT_FILTER_OPTIONS);
  assert.ok(!related.some(r => r.journal.id === openAccess.id));
  const all = filterAndRankJournals(journals, query, { ...DEFAULT_FILTER_OPTIONS, includeUnrelated: true });
  assert.equal(all.length, 3);
});

test('Filtro: la disciplina elegida en el buscador limita los resultados', () => {
  const query = { ...baseQuery, primaryDiscipline: 'Ciencias de la Vida y Medicina' };
  const results = filterAndRankJournals([diamond, openAccess, subscription], query, DEFAULT_FILTER_OPTIONS);
  assert.deepEqual(results.map(r => r.journal.id), [openAccess.id]);
});

test('Orden: Sin APC primero, luego coste sin verificar; se pueden excluir los no verificados', () => {
  const query = { ...baseQuery, title: 'Educación' };
  const results = filterAndRankJournals([subscription, diamond], query, DEFAULT_FILTER_OPTIONS);
  assert.equal(results[0].journal.id, diamond.id);
  assert.equal(getEconomicTier(results[1], 500), 3);
  const verifiedOnly = filterAndRankJournals([subscription, diamond], query, { ...DEFAULT_FILTER_OPTIONS, includeUnknownCost: false });
  assert.deepEqual(verifiedOnly.map(r => r.journal.id), [diamond.id]);
});

test('Presupuesto: el máximo del buscador excluye revistas más caras', () => {
  const paid: Journal = {
    ...diamond,
    id: 'paid',
    dataSource: 'curated',
    isDiamondOA: false,
    publicationModel: 'full_open_access',
    verificationStatus: 'verified',
    listAPC: { ...diamond.listAPC, amount: 400, usdEquivalent: 400 },
  };
  const within = filterAndRankJournals([paid], { ...baseQuery, maxBudgetUSD: 500 }, DEFAULT_FILTER_OPTIONS);
  const over = filterAndRankJournals([paid], { ...baseQuery, maxBudgetUSD: 300 }, DEFAULT_FILTER_OPTIONS);
  assert.equal(within.length, 1);
  assert.equal(over.length, 0);
});

test('Puntuación: si no se prioriza el formato libre, el formato no suma puntos', () => {
  const withFormat = evaluateJournal(diamond, { ...baseQuery, preferFormatFree: true });
  const withoutFormat = evaluateJournal(diamond, { ...baseQuery, preferFormatFree: false });
  assert.ok(withFormat.scoreBreakdown.format > 0);
  assert.equal(withoutFormat.scoreBreakdown.format, 0);
});

test('Coste: una exención discrecional no se da por hecha', () => {
  const plosLike: Journal = {
    ...diamond,
    id: 'plos-like',
    dataSource: 'curated',
    isDiamondOA: false,
    publicationModel: 'full_open_access',
    verificationStatus: 'verified',
    listAPC: { ...diamond.listAPC, amount: 2000, usdEquivalent: 2000 },
    availableDiscounts: [{
      id: 'pfa', type: 'discretionary_waiver', title: 'Fee Assistance', description: '',
      discountPercentage: 100, isAutomatic: false, conditions: 'Previa solicitud', evidenceUrl: ''
    }],
  };
  const cost = calculateEffectiveCost(plosLike, baseQuery);
  assert.equal(cost.effectiveCostUSD, 2000, 'el coste estimado es el de lista');
  assert.equal(cost.budgetEligibility, 'under_500_conditioned');
  assert.equal(cost.conditionalWaiver?.costIfGrantedUSD, 0);

  const [item] = filterAndRankJournals([plosLike], { ...baseQuery, title: 'Educación' }, DEFAULT_FILTER_OPTIONS);
  assert.equal(getEconomicTier(item, 500), 2, 'va después de las que caben sin condiciones');
  const onlyFree = filterAndRankJournals([plosLike], baseQuery, { ...DEFAULT_FILTER_OPTIONS, costPriorityMode: 'only_zero_apc' });
  assert.equal(onlyFree.length, 0);
});

test('Raíces: inglés y español comparten raíz y no se confunden prefijos', () => {
  assert.equal(stemWord('education'), stemWord('educacion'));
  assert.equal(stemWord('music'), stemWord('musica'));
  assert.notEqual(stemWord('microfinance'), stemWord('microfluidics'));
  assert.notEqual(stemWord('organizational'), stemWord('organic'));
});

test('Temas: se detectan por el vocabulario de las revistas de cada categoría', () => {
  const journals = [diamond, openAccess, subscription];
  const profile = inferTopicsLexical({ ...baseQuery, title: 'Oncology outcomes in hematology patients' }, getTopicIndex(journals));
  assert.equal(profile.source, 'lexical');
  assert.deepEqual(profile.topics.map(t => t.category).sort(), ['Hematology', 'Oncology']);
  assert.equal(profile.topics[0].weight, 1);
});

test('Temas: los temas indicados (IA o edición manual) mandan sobre el vocabulario', () => {
  const journals = [diamond, openAccess, subscription];
  const query: ManuscriptQuery = {
    ...baseQuery,
    title: 'Educación superior',
    topicProfile: { source: 'manual', topics: [{ category: 'Oncology', weight: 1 }], extraTerms: [] },
  };
  const results = filterAndRankJournals(journals, query, DEFAULT_FILTER_OPTIONS);
  assert.deepEqual(results.map(r => r.journal.id), [openAccess.id]);
  assert.deepEqual(results[0].sharedTopics.map(t => t.category), ['Oncology']);
});

test('IA: la respuesta se valida contra la lista de categorías y se normaliza', () => {
  const profile = parseAiAnswer({
    interpretation: 'Trabajo sobre docencia universitaria.',
    categories: [
      { name: 'education', weight: 0.8 },
      { name: 'Categoría inventada', weight: 1 },
      { name: 'Oncology', weight: 0.4 },
      { name: 'Education', weight: 0.2 },
    ],
    keywords: ['higher education', 42, 'teaching'],
  }, dataset.categories, 'modelo-prueba');
  assert.equal(profile.source, 'ai');
  assert.deepEqual(profile.topics, [{ category: 'Education', weight: 1 }, { category: 'Oncology', weight: 0.5 }]);
  assert.deepEqual(profile.extraTerms, ['higher education', 'teaching']);
  assert.equal(profile.interpretation, 'Trabajo sobre docencia universitaria.');
});
