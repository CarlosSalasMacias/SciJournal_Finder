import { Journal, ManuscriptQuery, BudgetEligibility } from '../types/journal';

export interface CostCalculationResult {
  /** null = coste desconocido (no verificado). */
  effectiveCostUSD: number | null;
  appliedDiscountName?: string;
  appliedDiscountPercent: number;
  isCostConditional: boolean;
  budgetEligibility: BudgetEligibility;
  costBreakdownNotes: string;
  /** Exención discrecional (previa solicitud): NO se resta del coste estimado. */
  conditionalWaiver?: ConditionalWaiver;
}

export interface ConditionalWaiver {
  name: string;
  percent: number;
  costIfGrantedUSD: number;
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

  // 0. Revistas importadas de SCImago: solo se conoce si son OA y si son Diamante.
  if (journal.dataSource === 'scimago' && !journal.isDiamondOA) {
    const isOA = journal.publicationModel === 'full_open_access';
    return {
      effectiveCostUSD: null,
      appliedDiscountPercent: 0,
      isCostConditional: false,
      budgetEligibility: 'cost_unknown',
      costBreakdownNotes: isOA
        ? 'Acceso abierto según SCImago/DOAJ, pero el importe del APC no está verificado. Consulte la web de la revista.'
        : 'No es de acceso abierto según SCImago: suele publicarse sin APC por la vía de suscripción, pero pueden existir cargos por página o color. No verificado.'
    };
  }

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
  let bestWaiver: (typeof journal.availableDiscounts)[number] | undefined;

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
      // La editorial la concede o la niega caso a caso: no se da por hecha.
      if (!bestWaiver || discount.discountPercentage > bestWaiver.discountPercentage) {
        bestWaiver = discount;
      }
      continue;
    }

    if (qualifies && discount.discountPercentage > bestDiscountPercent) {
      bestDiscountPercent = discount.discountPercentage;
      bestDiscountName = discount.title;
      isConditional = conditional;
    }
  }

  const finalCost = Math.round(baseAPC_USD * (1 - bestDiscountPercent / 100) + otherMandatoryUSD);

  // Exención discrecional: solo informativa, pero si la concedieran podría entrar en presupuesto
  let conditionalWaiver: ConditionalWaiver | undefined;
  if (bestWaiver && bestWaiver.discountPercentage > bestDiscountPercent) {
    conditionalWaiver = {
      name: bestWaiver.title,
      percent: bestWaiver.discountPercentage,
      costIfGrantedUSD: Math.round(baseAPC_USD * (1 - bestWaiver.discountPercentage / 100) + otherMandatoryUSD)
    };
  }

  let eligibility: BudgetEligibility;
  if (journal.verificationStatus === 'pending_confirmation') {
    eligibility = 'cost_unknown';
  } else if (finalCost <= maxBudget) {
    eligibility = isConditional ? 'under_500_conditioned' : 'under_500_confirmed';
  } else if (conditionalWaiver && conditionalWaiver.costIfGrantedUSD <= maxBudget) {
    eligibility = 'under_500_conditioned';
    isConditional = true;
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
  if (conditionalWaiver) {
    notes += ` Posible exención previa solicitud: ${conditionalWaiver.name} (-${conditionalWaiver.percent}%), que dejaría el coste en ${conditionalWaiver.costIfGrantedUSD} USD si la editorial la concede. No se resta del coste estimado.`;
  }

  return {
    effectiveCostUSD: finalCost,
    appliedDiscountName: bestDiscountName,
    appliedDiscountPercent: bestDiscountPercent,
    isCostConditional: isConditional,
    budgetEligibility: eligibility,
    costBreakdownNotes: notes,
    conditionalWaiver
  };
}
