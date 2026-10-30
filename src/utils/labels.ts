import { BudgetEligibility, EvaluatedJournal, Journal, Quartile } from '../types/journal';

/** Textos compartidos por la tabla, las fichas y las exportaciones. */

export function bestQuartile(journal: Journal): Quartile | null {
  for (const q of ['Q1', 'Q2', 'Q3'] as Quartile[]) {
    if (journal.quartiles.some(entry => entry.quartile === q)) return q;
  }
  return null;
}

export function publicationModelLabel(journal: Journal): string {
  if (journal.isDiamondOA) return 'Acceso Abierto Diamante';
  switch (journal.publicationModel) {
    case 'traditional_no_mandatory_fee': return 'Tradicional sin APC';
    case 'hybrid': return 'Híbrida (suscripción u OA con APC)';
    case 'full_open_access': return 'Acceso Abierto (con APC)';
    case 'subscription_or_hybrid_unverified': return 'Suscripción / híbrida (sin verificar)';
  }
}

export function costLabel(item: EvaluatedJournal): string {
  return item.effectiveCostUSD === null ? 'Sin verificar' : `${item.effectiveCostUSD} USD`;
}

export function budgetLabel(item: { budgetEligibility: BudgetEligibility }): string {
  switch (item.budgetEligibility) {
    case 'under_500_confirmed': return 'Dentro del presupuesto (confirmado)';
    case 'under_500_conditioned': return 'Dentro del presupuesto (condicionado a solicitud)';
    case 'cost_unknown': return 'Coste no verificado';
    case 'over_500': return 'Supera el presupuesto';
  }
}

export function formatFreeLabel(journal: Journal): string {
  switch (journal.formatFreeSubmission) {
    case 'confirmed': return 'Formato libre (Your Paper Your Way)';
    case 'partially_verified': return 'Formato libre con normas básicas';
    case 'mandatory_template': return 'Plantilla obligatoria';
    case 'unverified': return 'Sin verificar';
  }
}

export function verificationLabel(journal: Journal): string {
  switch (journal.verificationStatus) {
    case 'verified': return 'Verificada';
    case 'partially_verified': return 'Parcialmente verificada';
    case 'pending_confirmation': return 'Pendiente de confirmar';
  }
}

export function dataSourceLabel(journal: Journal): string {
  return journal.dataSource === 'scimago' ? 'Ficha automática (SCImago)' : 'Ficha revisada';
}
