import { Journal, Quartile, ScoringWeights, EvaluatedJournal, ManuscriptQuery } from '../types/journal';
import { calculateEffectiveCost } from './costCalculator';
import { evaluateThematicAffinity } from './affinityMatcher';

export const DEFAULT_WEIGHTS: ScoringWeights = {
  thematicAffinity: 35,
  quartilePrestige: 25,
  costAdvantage: 20,
  formatFree: 10,
  verificationTrust: 10
};

/**
 * Obtiene la puntuación de cuartil (mejor cuartil entre las fuentes registradas)
 */
function getQuartileScore(quartiles: Journal['quartiles']): { score: number; bestQuartile: Quartile } {
  let hasQ1 = false;
  let hasQ2 = false;
  let hasQ3 = false;

  for (const q of quartiles) {
    if (q.quartile === 'Q1') hasQ1 = true;
    if (q.quartile === 'Q2') hasQ2 = true;
    if (q.quartile === 'Q3') hasQ3 = true;
  }

  if (hasQ1) return { score: 100, bestQuartile: 'Q1' };
  if (hasQ2) return { score: 75, bestQuartile: 'Q2' };
  if (hasQ3) return { score: 50, bestQuartile: 'Q3' };
  return { score: 30, bestQuartile: 'Q3' };
}

/**
 * Puntuación económica: premia 0 USD obligatorio y costes <= 500 USD
 */
function getCostScore(effectiveCostUSD: number | null, maxBudgetUSD: number): number {
  if (effectiveCostUSD === null) return 40; // Coste desconocido: puntuación intermedia-baja
  if (effectiveCostUSD === 0) return 100;
  if (effectiveCostUSD <= 200) return 85;
  if (effectiveCostUSD <= maxBudgetUSD) return 65;
  if (effectiveCostUSD <= maxBudgetUSD * 1.5) return 30;
  return 10;
}

/**
 * Puntuación de facilidad de formato libre
 */
function getFormatScore(formatFree: Journal['formatFreeSubmission']): number {
  if (formatFree === 'confirmed') return 100;
  if (formatFree === 'unverified') return 45;
  return 20; // mandatory_template
}

/**
 * Puntuación de confiabilidad de la verificación
 */
function getVerificationScore(status: Journal['verificationStatus']): number {
  if (status === 'verified') return 100;
  if (status === 'partially_verified') return 60;
  return 30; // pending_confirmation
}

/**
 * Evalúa y calcula la puntuación multicriterio transparente para una revista
 */
export function evaluateJournal(
  journal: Journal,
  query: ManuscriptQuery,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): EvaluatedJournal {
  // «Priorizar formato libre» desmarcado = el formato no cuenta en la puntuación.
  if (query.preferFormatFree === false) {
    weights = { ...weights, formatFree: 0 };
  }
  const costRes = calculateEffectiveCost(journal, query);
  const affinityRes = evaluateThematicAffinity(journal, query);
  const quartileRes = getQuartileScore(journal.quartiles);
  const costScore = getCostScore(costRes.effectiveCostUSD, query.maxBudgetUSD);
  const formatScore = getFormatScore(journal.formatFreeSubmission);
  const verifScore = getVerificationScore(journal.verificationStatus);

  // Si todas las ponderaciones son 0 se evita dividir entre cero.
  const totalWeight =
    weights.thematicAffinity +
    weights.quartilePrestige +
    weights.costAdvantage +
    weights.formatFree +
    weights.verificationTrust || 1;

  const weightedThematic = (affinityRes.score * weights.thematicAffinity) / totalWeight;
  const weightedQuartile = (quartileRes.score * weights.quartilePrestige) / totalWeight;
  const weightedCost = (costScore * weights.costAdvantage) / totalWeight;
  const weightedFormat = (formatScore * weights.formatFree) / totalWeight;
  const weightedVerif = (verifScore * weights.verificationTrust) / totalWeight;

  const overallScore = Math.round(
    weightedThematic + weightedQuartile + weightedCost + weightedFormat + weightedVerif
  );

  return {
    journal,
    effectiveCostUSD: costRes.effectiveCostUSD,
    costNotes: costRes.costBreakdownNotes,
    conditionalWaiver: costRes.conditionalWaiver,
    appliedDiscountName: costRes.appliedDiscountName,
    appliedDiscountPercent: costRes.appliedDiscountPercent,
    isCostConditional: costRes.isCostConditional,
    budgetEligibility: costRes.budgetEligibility,
    thematicAffinity: affinityRes.level,
    thematicAffinityScore: affinityRes.score,
    thematicJustification: affinityRes.justification,
    thematicMatchedTerms: affinityRes.matchedTerms,
    overallScore,
    scoreBreakdown: {
      thematic: Math.round(weightedThematic * 10) / 10,
      quartile: Math.round(weightedQuartile * 10) / 10,
      cost: Math.round(weightedCost * 10) / 10,
      format: Math.round(weightedFormat * 10) / 10,
      verification: Math.round(weightedVerif * 10) / 10
    }
  };
}
