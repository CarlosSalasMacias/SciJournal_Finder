import { Journal, ManuscriptQuery, BudgetEligibility } from '../types/journal';

export interface CostCalculationResult {
  effectiveCostUSD: number;
  appliedDiscountName?: string;
  appliedDiscountPercent: number;
  isCostConditional: boolean;
  budgetEligibility: BudgetEligibility;
  costBreakdownNotes: string;
}

/**
 * Calcula de manera transparente y verificable el coste final estimado en USD para un manuscrito.
 * Regla central: Coste final estimado = APC aplicable − descuentos confirmados − exenciones confirmadas + cargos adicionales.
 */
export function calculateEffectiveCost(
  journal: Journal,
  query: Pick<ManuscriptQuery, 'accessPreference' | 'maxBudgetUSD' | 'authorRegion'>
): CostCalculationResult {
  const maxBudget = query.maxBudgetUSD ?? 500;
  const authorRegion = query.authorRegion || 'none';

  // 1. Caso: Revista Tradicional sin cargos obligatorios
  if (journal.publicationModel === 'traditional_no_mandatory_fee') {
    const totalMandatory = journal.listAPC.mandatoryOtherFeesUSD || 0;
    return {
      effectiveCostUSD: totalMandatory,
      appliedDiscountPercent: 0,
      isCostConditional: false,
      budgetEligibility: totalMandatory <= maxBudget ? 'under_500_confirmed' : 'over_500',
      costBreakdownNotes: totalMandatory === 0
        ? 'Publicación por suscripción tradicional: 0 USD de APC obligatorio sin cargos ocultos comprobados.'
        : `Publicación tradicional con cargos obligatorios verificados de ${totalMandatory} USD (página/envío).`
    };
  }

  // 2. Caso: Revista Diamante (Acceso Abierto 100% financiado por institución/consorcio)
  if (journal.isDiamondOA) {
    const totalMandatory = journal.listAPC.mandatoryOtherFeesUSD || 0;
    return {
      effectiveCostUSD: totalMandatory,
      appliedDiscountName: 'Acceso Abierto Diamante (Institucional)',
      appliedDiscountPercent: 100,
      isCostConditional: false,
      budgetEligibility: totalMandatory <= maxBudget ? 'under_500_confirmed' : 'over_500',
      costBreakdownNotes: 'Acceso Abierto Diamante (Diamond OA): 0 USD de APC para autores, financiado íntegramente por la entidad editora o consorcio académico.'
    };
  }

  // 3. Caso: Revista Híbrida
  // Si el usuario no exige "full_open_access", la vía de suscripción tradicional es 0 USD
  if (journal.publicationModel === 'hybrid' && query.accessPreference !== 'full_open_access') {
    const totalMandatory = journal.listAPC.mandatoryOtherFeesUSD || 0;
    return {
      effectiveCostUSD: totalMandatory,
      appliedDiscountPercent: 0,
      isCostConditional: false,
      budgetEligibility: totalMandatory <= maxBudget ? 'under_500_confirmed' : 'over_500',
      costBreakdownNotes: `Modelo Híbrido: La publicación por vía tradicional de suscripción no tiene cargos de APC obligatorios (0 USD). Si se deseara la opción Open Choice (OA), el APC de lista sería de ${journal.listAPC.amount} ${journal.listAPC.currency} (~$${journal.listAPC.usdEquivalent} USD).`
    };
  }

  // 4. Caso: Acceso Abierto requerido (o revista Full OA)
  // Evaluamos descuentos según el perfil del autor
  const baseAPC_USD = journal.listAPC.usdEquivalent || 0;
  const otherMandatoryUSD = journal.listAPC.mandatoryOtherFeesUSD || 0;

  let bestDiscountPercent = 0;
  let bestDiscountName: string | undefined = undefined;
  let isConditional = false;

  for (const discount of journal.availableDiscounts) {
    let qualifies = false;
    let conditional = !discount.isAutomatic;

    if (discount.type === 'research4life') {
      if (authorRegion === 'research4life_a' && discount.discountPercentage === 100) {
        qualifies = true;
      } else if (authorRegion === 'research4life_b' && discount.discountPercentage >= 50) {
        qualifies = true;
      }
    } else if (discount.type === 'institutional_agreement') {
      if (authorRegion === 'institutional_agreement_spain') {
        qualifies = true;
      }
    } else if (discount.type === 'society_member') {
      if (authorRegion === 'society_member') {
        qualifies = true;
      }
    } else if (discount.type === 'general_discount') {
      qualifies = true;
    } else if (discount.type === 'discretionary_waiver') {
      // Exención previa solicitud (no automática)
      qualifies = true;
      conditional = true;
    }

    if (qualifies && discount.discountPercentage > bestDiscountPercent) {
      bestDiscountPercent = discount.discountPercentage;
      bestDiscountName = discount.title;
      isConditional = conditional;
    }
  }

  const finalCost = Math.round(baseAPC_USD * (1 - bestDiscountPercent / 100) + otherMandatoryUSD);

  let eligibility: BudgetEligibility;
  if (journal.verificationStatus === 'pending_confirmation') {
    eligibility = 'cost_unknown';
  } else if (finalCost <= maxBudget) {
    eligibility = isConditional ? 'under_500_conditioned' : 'under_500_confirmed';
  } else {
    eligibility = 'over_500';
  }

  let notes = `APC de lista: ${journal.listAPC.amount} ${journal.listAPC.currency} (cambio: ${journal.listAPC.usdEquivalent} USD).`;
  if (bestDiscountName) {
    notes += ` Descuento aplicado: ${bestDiscountName} (-${bestDiscountPercent}%).`;
    if (isConditional) {
      notes += ' ATENCIÓN: Descuento condicionado a solicitud o verificación institucional.';
    }
  }

  return {
    effectiveCostUSD: finalCost,
    appliedDiscountName: bestDiscountName,
    appliedDiscountPercent: bestDiscountPercent,
    isCostConditional: isConditional,
    budgetEligibility: eligibility,
    costBreakdownNotes: notes
  };
}
