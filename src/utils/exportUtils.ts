import { EvaluatedJournal } from '../types/journal';

/**
 * Genera y descarga un archivo CSV compatible con Excel (con BOM UTF-8)
 */
export function exportToCSV(results: EvaluatedJournal[], filename = 'revistas_cientificas_seleccion.csv') {
  const headers = [
    'Revista',
    'ISSN',
    'Editorial',
    'Mejor Cuartil',
    'Cuartiles Registrados (Fuente / Cat / Año)',
    'Modalidad Publicación',
    'Coste Final Estimado (USD)',
    'Elegibilidad Presupuesto (<=500 USD)',
    'Formato Libre Envío Inicial',
    'Afinidad Temática',
    'Puntuación Global (0-100)',
    'APC de Lista',
    'Descuentos/Exenciones',
    'Estado Verificación',
    'Fecha Verificación',
    'Enlace Directo Editorial',
    'Enlace Guía de Autores',
    'Enlace Política Tarifas'
  ];

  const escapeCSV = (val: string | number | undefined | null) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = results.map(item => {
    const j = item.journal;
    const quartilesSummary = j.quartiles
      .map(q => `${q.quartile} [${q.source} - ${q.category} (${q.year})]`)
      .join('; ');

    const apcSummary = `${j.listAPC.amount} ${j.listAPC.currency} (~${j.listAPC.usdEquivalent} USD)`;
    const discountSummary = item.appliedDiscountName
      ? `${item.appliedDiscountName} (-${item.appliedDiscountPercent}%)`
      : 'Ninguno aplicado';

    return [
      escapeCSV(j.title),
      escapeCSV(j.issn + (j.eissn ? ` / ${j.eissn}` : '')),
      escapeCSV(j.publisher),
      escapeCSV(j.quartiles[0]?.quartile || 'N/A'),
      escapeCSV(quartilesSummary),
      escapeCSV(
        j.isDiamondOA
          ? 'Acceso Abierto Diamante (0 USD)'
          : j.publicationModel === 'hybrid'
          ? 'Híbrida (Suscripción o APC)'
          : j.publicationModel === 'traditional_no_mandatory_fee'
          ? 'Tradicional sin APC'
          : 'Acceso Abierto Completo'
      ),
      escapeCSV(item.effectiveCostUSD),
      escapeCSV(
        item.budgetEligibility === 'under_500_confirmed'
          ? 'Confirmado <= 500 USD'
          : item.budgetEligibility === 'under_500_conditioned'
          ? 'Condicionado a solicitud'
          : item.budgetEligibility === 'cost_unknown'
          ? 'Coste no verificado'
          : 'Supera 500 USD'
      ),
      escapeCSV(
        j.formatFreeSubmission === 'confirmed'
          ? 'Sí (Your Paper Your Way)'
          : j.formatFreeSubmission === 'mandatory_template'
          ? 'Plantilla obligatoria'
          : 'No verificado'
      ),
      escapeCSV(`${item.thematicAffinity.toUpperCase()} (${item.thematicAffinityScore}/100)`),
      escapeCSV(item.overallScore),
      escapeCSV(apcSummary),
      escapeCSV(discountSummary),
      escapeCSV(j.verificationStatus),
      escapeCSV(j.lastVerificationDate),
      escapeCSV(j.journalUrl),
      escapeCSV(j.instructionsUrl),
      escapeCSV(j.feePolicyUrl)
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Genera un informe Markdown formateado para portapapeles
 */
export function generateMarkdownReport(results: EvaluatedJournal[]): string {
  let md = `# Informe de Selección y Comparación de Revistas Científicas Q1-Q3\n`;
  md += `*Generado el ${new Date().toLocaleDateString('es-ES')} - Criterios: Formato libre, costes <= 500 USD o sin APC*\n\n`;

  results.forEach((item, index) => {
    const j = item.journal;
    md += `### ${index + 1}. [${j.title}](${j.journalUrl})\n`;
    md += `- **Editorial**: [${j.publisher}](${j.publisherUrl})\n`;
    md += `- **Puntuación Global**: ${item.overallScore}/100 | **Afinidad**: ${item.thematicAffinity.toUpperCase()} (${item.thematicAffinityScore}%)\n`;
    md += `- **Cuartil(es)**: ${j.quartiles.map(q => `**${q.quartile}** en ${q.source} (${q.category})`).join(', ')}\n`;
    md += `- **Modalidad**: ${j.isDiamondOA ? 'Acceso Abierto Diamante (0 USD)' : j.publicationModel}\n`;
    md += `- **Coste Final Estimado**: **$${item.effectiveCostUSD} USD** (${item.budgetEligibility === 'under_500_confirmed' ? '≤ $500 confirmado' : item.budgetEligibility})\n`;
    md += `- **Formato de Envío Inicial**: ${j.formatFreeSubmission === 'confirmed' ? '✓ Formato libre («Your Paper Your Way»)' : 'Plantilla requerida'}\n`;
    md += `- **Justificación Temática**: ${item.thematicJustification}\n`;
    md += `- **Guía de Autores**: [Instrucciones](${j.instructionsUrl}) | **Tarifario Oficial**: [Costes](${j.feePolicyUrl})\n`;
    md += `- **Fecha Comprobación**: ${j.lastVerificationDate} (${j.verificationStatus})\n\n`;
  });

  return md;
}
