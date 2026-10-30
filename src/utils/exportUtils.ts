import { EvaluatedJournal } from '../types/journal';
import {
  bestQuartile, budgetLabel, costLabel, dataSourceLabel, formatFreeLabel,
  publicationModelLabel, verificationLabel
} from './labels';

/** Neutraliza fórmulas de Excel (=, +, -, @) y escapa comillas. */
function escapeCSV(val: string | number | undefined | null): string {
  if (val === undefined || val === null) return '""';
  let str = String(val);
  if (typeof val === 'string' && /^[=+\-@\t\r]/.test(str)) str = `'${str}`;
  return `"${str.replace(/"/g, '""')}"`;
}

/**
 * Genera y descarga un archivo CSV compatible con Excel (con BOM UTF-8)
 */
export function exportToCSV(results: EvaluatedJournal[], filename = 'revistas_cientificas_seleccion.csv') {
  const headers = [
    'Posición',
    'Revista',
    'ISSN',
    'Editorial',
    'Mejor Cuartil',
    'Cuartiles Registrados (Fuente / Categoría / Año)',
    'SJR',
    'Modalidad Publicación',
    'Coste Final Estimado (USD)',
    'Presupuesto',
    'Formato Envío Inicial',
    'Afinidad Temática',
    'Puntuación Global (0-100)',
    'Descuentos/Exenciones',
    'Origen de la ficha',
    'Estado Verificación',
    'Fecha Verificación',
    'Enlace Revista',
    'Enlace Guía de Autores',
    'Enlace Política de Tarifas'
  ];

  const rows = results.map((item, index) => {
    const j = item.journal;
    const quartilesSummary = j.quartiles
      .map(q => `${q.quartile} [${q.source} - ${q.category} (${q.year})]`)
      .join('; ');
    const discountSummary = item.appliedDiscountName
      ? `${item.appliedDiscountName} (-${item.appliedDiscountPercent}%)`
      : 'Ninguno aplicado';

    return [
      escapeCSV(index + 1),
      escapeCSV(j.title),
      escapeCSV(j.issn + (j.eissn ? ` / ${j.eissn}` : '')),
      escapeCSV(j.publisher),
      escapeCSV(bestQuartile(j) ?? 'N/A'),
      escapeCSV(quartilesSummary),
      escapeCSV(j.sjrScore !== undefined ? j.sjrScore.toFixed(3) : ''),
      escapeCSV(publicationModelLabel(j)),
      escapeCSV(item.effectiveCostUSD === null ? 'Sin verificar' : item.effectiveCostUSD),
      escapeCSV(budgetLabel(item)),
      escapeCSV(formatFreeLabel(j)),
      escapeCSV(`${item.thematicAffinity.toUpperCase()} (${item.thematicAffinityScore}/100)`),
      escapeCSV(item.overallScore),
      escapeCSV(discountSummary),
      escapeCSV(dataSourceLabel(j)),
      escapeCSV(verificationLabel(j)),
      escapeCSV(j.lastVerificationDate),
      escapeCSV(j.journalUrl),
      escapeCSV(j.instructionsUrl),
      escapeCSV(j.feePolicyUrl)
    ].join(',');
  });

  const csvContent = '﻿' + [headers.join(','), ...rows].join('\r\n');
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
 * Genera un informe Markdown con las primeras `limit` revistas del ranking.
 */
export function generateMarkdownReport(results: EvaluatedJournal[], maxBudgetUSD: number, limit = 25): string {
  const top = results.slice(0, limit);
  let md = `# Informe de selección de revistas científicas Q1–Q3\n`;
  md += `*Generado el ${new Date().toLocaleDateString('es-ES')} · Presupuesto máximo: ${maxBudgetUSD} USD · `;
  md += `Mostrando ${top.length} de ${results.length} revistas*\n\n`;

  top.forEach((item, index) => {
    const j = item.journal;
    md += `### ${index + 1}. [${j.title}](${j.journalUrl})\n`;
    md += `- **Editorial**: ${j.publisher}\n`;
    md += `- **Puntuación global**: ${item.overallScore}/100 | **Afinidad**: ${item.thematicAffinity.toUpperCase()} (${item.thematicAffinityScore}/100)\n`;
    md += `- **Cuartil(es)**: ${j.quartiles.map(q => `**${q.quartile}** en ${q.source} (${q.category})`).join(', ')}\n`;
    md += `- **Modalidad**: ${publicationModelLabel(j)}\n`;
    md += `- **Coste final estimado**: **${costLabel(item)}** (${budgetLabel(item)})\n`;
    md += `- **Formato de envío inicial**: ${formatFreeLabel(j)}\n`;
    md += `- **Justificación temática**: ${item.thematicJustification}\n`;
    md += `- **Guía de autores**: [Instrucciones](${j.instructionsUrl}) | **Tarifas**: [Costes](${j.feePolicyUrl})\n`;
    md += `- **Origen y verificación**: ${dataSourceLabel(j)} · ${verificationLabel(j)} (${j.lastVerificationDate})\n\n`;
  });

  return md;
}
