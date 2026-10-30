import React from 'react';
import { EvaluatedJournal, Journal } from '../types/journal';
import { 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  FileCheck, 
  Eye, 
  ArrowUpDown, 
  Sparkles,
  Info,
  Layers,
  ShieldCheck,
  Scale
} from 'lucide-react';

interface JournalsTableProps {
  results: EvaluatedJournal[];
  selectedToCompare: string[];
  onToggleCompare: (id: string) => void;
  onOpenDetails: (journal: Journal) => void;
  sortBy: string;
  onSortChange: (newSort: any) => void;
  hasSearched: boolean;
}

export const JournalsTable: React.FC<JournalsTableProps> = ({
  results,
  selectedToCompare,
  onToggleCompare,
  onOpenDetails,
  sortBy,
  onSortChange,
  hasSearched
}) => {
  if (!hasSearched) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-2xs">
        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-3 text-indigo-600">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">
          Listo para analizar su manuscrito
        </h3>
        <p className="text-xs text-slate-600 max-w-lg mx-auto mb-4">
          Aún no se ha ejecutado ninguna búsqueda. Introduzca el título provisional, palabras clave o resumen de su investigación en el panel superior y pulse <strong className="text-indigo-700">«Buscar Revistas»</strong> para evaluar la afinidad temática, costes y cuartiles Q1–Q3.
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-2xs">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">
          No se encontraron revistas con los criterios actuales
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
          Prueba a relajar los filtros de cuartil, ampliar el presupuesto máximo o desactivar el modo de exclusión estricta.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      {/* Table Toolbar Header */}
      <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-slate-800">
            {results.length} {results.length === 1 ? 'revista encontrada' : 'revistas encontradas'}
          </span>
          <span className="text-slate-300">•</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            1º Sin APC: {results.filter(r => r.effectiveCostUSD === 0).length} revistas (0 USD)
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-100 text-blue-800 border border-blue-200">
            2º &lt; 500 USD: {results.filter(r => r.effectiveCostUSD > 0 && r.effectiveCostUSD <= 500).length} revistas
          </span>
        </div>

        {/* Sort selector */}
        <div className="flex items-center space-x-2">
          <span className="text-slate-500 font-medium flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 mr-1" />
            Ordenar por:
          </span>
          <select
            value={sortBy}
            onChange={e => onSortChange(e.target.value)}
            className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"
          >
            <option value="score">1º Sin APC (0 USD) → 2º &lt; $500 USD (Predeterminado)</option>
            <option value="cost_asc">Menor Coste Final Estimado (USD)</option>
            <option value="affinity">Mayor Afinidad Temática</option>
            <option value="quartile">Mejor Cuartil (Q1 → Q2 → Q3)</option>
            <option value="format_free">Facilidad de Envío (Formato Libre)</option>
            <option value="verification">Grado de Verificación de Fuentes</option>
          </select>
        </div>
      </div>

      {/* Main Interactive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/80 text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-200 text-[11px]">
              <th scope="col" className="py-3 px-3 text-center w-10">
                <span className="sr-only">Comparar</span>
                <span title="Seleccionar para comparar">
                  <Scale className="w-3.5 h-3.5 mx-auto text-slate-400" />
                </span>
              </th>
              <th scope="col" className="py-3 px-3 min-w-[200px]">
                Revista / Editorial
              </th>
              <th scope="col" className="py-3 px-3 min-w-[155px]">
                Cuartil Oficial (Scopus / WoS)
              </th>
              <th scope="col" className="py-3 px-3 min-w-[130px]">
                Modalidad
              </th>
              <th scope="col" className="py-3 px-3 min-w-[135px]">
                Formato de Envío
              </th>
              <th scope="col" className="py-3 px-3 min-w-[140px]">
                Coste Estimado
              </th>
              <th scope="col" className="py-3 px-3 min-w-[140px]">
                Elegibilidad Presupuesto
              </th>
              <th scope="col" className="py-3 px-3 min-w-[130px]">
                Afinidad Temática
              </th>
              <th scope="col" className="py-3 px-3 min-w-[100px] text-center">
                Puntuación
              </th>
              <th scope="col" className="py-3 px-3 min-w-[120px] text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {results.map(item => {
              const j = item.journal;
              const isCompared = selectedToCompare.includes(j.id);
              const bestQ = j.quartiles[0]?.quartile || 'Q3';

              return (
                <tr
                  key={j.id}
                  className={`hover:bg-indigo-50/40 transition-colors ${
                    isCompared ? 'bg-indigo-50/60' : ''
                  }`}
                >
                  {/* Comparar Checkbox */}
                  <td className="py-3.5 px-3 text-center align-middle">
                    <input
                      type="checkbox"
                      checked={isCompared}
                      onChange={() => onToggleCompare(j.id)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 border-slate-300 cursor-pointer"
                      title={
                        selectedToCompare.length >= 4 && !isCompared
                          ? 'Máximo 4 revistas a comparar al mismo tiempo'
                          : 'Seleccionar para comparar lado a lado'
                      }
                      disabled={selectedToCompare.length >= 4 && !isCompared}
                    />
                  </td>

                  {/* Revista & Editorial */}
                  <td className="py-3.5 px-3 align-top">
                    <div className="font-bold text-slate-900 hover:text-indigo-700 transition-colors">
                      <a
                        href={j.journalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center group font-semibold text-slate-900 hover:text-indigo-700"
                        title="Abrir página oficial de la revista"
                      >
                        {j.title}
                        <ExternalLink className="w-3 h-3 ml-1 text-slate-400 group-hover:text-indigo-600 inline" />
                      </a>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center space-x-1.5 mt-0.5">
                      <span>{j.publisher}</span>
                      <span className="text-slate-300">•</span>
                      <span className="font-mono text-[10px] text-slate-400">ISSN {j.issn}</span>
                    </div>
                    <div className="mt-1">
                      <span className="text-[10px] font-medium px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                        {j.primaryDiscipline}
                      </span>
                    </div>
                  </td>

                  {/* Cuartil Oficial (Scopus / Clarivate WoS) */}
                  <td className="py-3.5 px-3 align-top space-y-1.5">
                    {j.quartiles.map((q, idx) => (
                      <div key={idx} className="flex flex-col">
                        <div className="flex items-center space-x-1.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              q.quartile === 'Q1'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : q.quartile === 'Q2'
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            {q.quartile}
                          </span>
                          <span className="text-[10px] font-bold text-slate-800 truncate max-w-[130px]">
                            {q.source}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 truncate max-w-[140px] mt-0.5" title={`${q.category} (${q.year}) - ${q.metricLabel}`}>
                          {q.category} • <strong className="font-semibold text-slate-700">{q.metricLabel}</strong>
                        </span>
                      </div>
                    ))}
                  </td>

                  {/* Modalidad de Publicación */}
                  <td className="py-3.5 px-3 align-top">
                    {j.isDiamondOA ? (
                      <div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-300">
                          Acceso Abierto Diamante
                        </span>
                        <p className="text-[10px] text-teal-700 mt-0.5 font-medium">0 USD financiado</p>
                      </div>
                    ) : j.publicationModel === 'traditional_no_mandatory_fee' ? (
                      <div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Tradicional (Sin APC)
                        </span>
                        <p className="text-[10px] text-slate-500 mt-0.5">Vía suscripción</p>
                      </div>
                    ) : j.publicationModel === 'hybrid' ? (
                      <div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                          Híbrida
                        </span>
                        <p className="text-[10px] text-slate-500 mt-0.5">0 USD suscripción / APC opcional</p>
                      </div>
                    ) : (
                      <div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          Acceso Abierto (Gold)
                        </span>
                        <p className="text-[10px] text-slate-500 mt-0.5">APC obligatorio con waivers</p>
                      </div>
                    )}
                  </td>

                  {/* Formato de Envío Inicial */}
                  <td className="py-3.5 px-3 align-top">
                    {j.formatFreeSubmission === 'confirmed' ? (
                      <div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                          <FileCheck className="w-3 h-3 mr-1 text-indigo-600" />
                          Formato Libre
                        </span>
                        <p className="text-[10px] text-indigo-900/80 mt-0.5 font-medium">Your Paper Your Way</p>
                      </div>
                    ) : j.formatFreeSubmission === 'mandatory_template' ? (
                      <div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                          Plantilla obligatoria
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">Requiere maquetación inicial</p>
                      </div>
                    ) : (
                      <div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                          Directrices estándar
                        </span>
                        <p className="text-[10px] text-slate-500 mt-0.5">Consultar guía de autor</p>
                      </div>
                    )}
                  </td>

                  {/* Coste Final Estimado */}
                  <td className="py-3.5 px-3 align-top">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-sm text-slate-900">
                        ${item.effectiveCostUSD} <span className="text-[10px] font-normal text-slate-500">USD</span>
                      </span>
                    </div>

                    <div className="mt-1">
                      {item.effectiveCostUSD === 0 ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          1º Sin APC (0 USD)
                        </span>
                      ) : item.effectiveCostUSD <= 500 ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800 border border-blue-300">
                          2º &lt; 500 USD
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                          3º &gt; 500 USD
                        </span>
                      )}
                    </div>

                    {item.appliedDiscountName ? (
                      <div className="text-[10px] text-emerald-700 font-medium truncate max-w-[130px] mt-0.5" title={item.appliedDiscountName}>
                        Desc: -{item.appliedDiscountPercent}% ({item.appliedDiscountName})
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Lista: {j.listAPC.amount} {j.listAPC.currency}
                      </div>
                    )}
                  </td>


                  {/* Elegibilidad Presupuesto */}
                  <td className="py-3.5 px-3 align-top">
                    {item.budgetEligibility === 'under_500_confirmed' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                        ≤ $500 Confirmado
                      </span>
                    ) : item.budgetEligibility === 'under_500_conditioned' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300" title="Condicionado a aprobación de waiver por dificultad económica o solicitud formal">
                        <AlertCircle className="w-3 h-3 mr-1 text-amber-600" />
                        ≤ $500 Condicionado
                      </span>
                    ) : item.budgetEligibility === 'cost_unknown' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                        Coste desconocido
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                        &gt; $500 USD
                      </span>
                    )}
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Verificado: {j.lastVerificationDate}
                    </div>
                  </td>

                  {/* Afinidad Temática */}
                  <td className="py-3.5 px-3 align-top">
                    <div className="flex items-center space-x-1">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          item.thematicAffinity === 'high'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.thematicAffinity === 'medium'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.thematicAffinity.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-700">
                        {item.thematicAffinityScore}%
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-2" title={item.thematicJustification}>
                      {item.thematicJustification}
                    </p>
                  </td>

                  {/* Puntuación Multicriterio Global */}
                  <td className="py-3.5 px-3 text-center align-middle">
                    <div className="inline-flex flex-col items-center justify-center p-1.5 rounded-lg bg-indigo-50 border border-indigo-200">
                      <span className="font-extrabold text-sm text-indigo-700">
                        {item.overallScore}
                      </span>
                      <span className="text-[9px] text-indigo-500 font-medium">/ 100</span>
                    </div>
                  </td>

                  {/* Acciones */}
                  <td className="py-3.5 px-3 text-right align-middle space-y-1">
                    <button
                      type="button"
                      onClick={() => onOpenDetails(j)}
                      className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer w-full justify-center"
                      title="Ver ficha ampliada de requisitos y enlaces verificados"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      Ficha
                    </button>
                    
                    <a
                      href={j.instructionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors w-full justify-center"
                      title="Ver directrices oficiales para autores"
                    >
                      Guía autor
                      <ExternalLink className="w-2.5 h-2.5 ml-1" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
