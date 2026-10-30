import React from 'react';
import { EvaluatedJournal } from '../types/journal';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Scale, 
  Trash2, 
  FileCheck, 
  DollarSign, 
  Award,
  Layers
} from 'lucide-react';

interface ComparisonModalProps {
  comparedJournals: EvaluatedJournal[];
  onClose: () => void;
  onRemoveFromCompare: (id: string) => void;
  onOpenDetails: (journal: any) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  comparedJournals,
  onClose,
  onRemoveFromCompare,
  onOpenDetails
}) => {
  if (comparedJournals.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-6xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-labelledby="comparison-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-md bg-indigo-600">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 id="comparison-title" className="text-lg font-bold tracking-tight text-white">
                Comparativa Editorial Lado a Lado
              </h2>
              <p className="text-xs text-slate-300">
                Comparando {comparedJournals.length} revistas científicas candidatas bajo los mismos criterios evaluados
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Cerrar comparativa"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Matrix Table */}
        <div className="p-6 overflow-y-auto overflow-x-auto text-xs text-slate-700">
          <table className="w-full border-collapse border border-slate-200 text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-3 w-44 font-bold text-slate-800 border-r border-slate-200 uppercase tracking-wider text-[11px]">
                  Criterio / Atributo
                </th>
                {comparedJournals.map(item => {
                  const j = item.journal;
                  return (
                    <th key={j.id} className="p-3 min-w-[220px] max-w-[280px] border-r border-slate-200 align-top">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-bold text-sm text-slate-900 block leading-tight">
                            {j.title}
                          </span>
                          <span className="text-[11px] text-slate-500 font-normal">
                            {j.publisher}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveFromCompare(j.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                          title="Eliminar de la comparativa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center space-x-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          Puntuación: {item.overallScore}/100
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              
              {/* Cuartil y Categorías */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-semibold text-slate-700 border-r border-slate-200 bg-slate-50/80">
                  <div className="flex items-center space-x-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>Cuartil Oficial</span>
                  </div>
                </td>
                {comparedJournals.map(item => (
                  <td key={item.journal.id} className="p-3 border-r border-slate-200 space-y-1">
                    {item.journal.quartiles.map((q, idx) => (
                      <div key={idx} className="flex items-center space-x-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          q.quartile === 'Q1' ? 'bg-emerald-100 text-emerald-800' :
                          q.quartile === 'Q2' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {q.quartile}
                        </span>
                        <span className="font-medium text-slate-800">{q.source.split(' ')[0]}</span>
                        <span className="text-slate-400 text-[10px]">({q.metricLabel})</span>
                      </div>
                    ))}
                  </td>
                ))}
              </tr>

              {/* Modalidad Económica */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-semibold text-slate-700 border-r border-slate-200 bg-slate-50/80">
                  <div className="flex items-center space-x-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Modalidad Editorial</span>
                  </div>
                </td>
                {comparedJournals.map(item => (
                  <td key={item.journal.id} className="p-3 border-r border-slate-200">
                    {item.journal.isDiamondOA ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                        Acceso Abierto Diamante (0 USD)
                      </span>
                    ) : item.journal.publicationModel === 'hybrid' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800">
                        Híbrida (0 USD suscripción / APC opcional)
                      </span>
                    ) : item.journal.publicationModel === 'traditional_no_mandatory_fee' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800">
                        Tradicional sin APC obligatorio
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-800">
                        Acceso Abierto Completo con APC
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Coste Final Estimado */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-semibold text-slate-700 border-r border-slate-200 bg-slate-50/80">
                  <div className="flex items-center space-x-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coste Final Estimado</span>
                  </div>
                </td>
                {comparedJournals.map(item => (
                  <td key={item.journal.id} className="p-3 border-r border-slate-200">
                    <div className="font-extrabold text-base text-slate-900">
                      ${item.effectiveCostUSD} <span className="text-xs font-normal text-slate-500">USD</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Lista: {item.journal.listAPC.amount} {item.journal.listAPC.currency}
                    </div>
                    {item.appliedDiscountName && (
                      <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                        {item.appliedDiscountName} (-{item.appliedDiscountPercent}%)
                      </div>
                    )}
                    <div className="mt-1">
                      {item.budgetEligibility === 'under_500_confirmed' ? (
                        <span className="inline-flex items-center text-[10px] font-bold text-emerald-700">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          ≤ $500 Confirmado
                        </span>
                      ) : item.budgetEligibility === 'under_500_conditioned' ? (
                        <span className="inline-flex items-center text-[10px] font-semibold text-amber-700">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Condicionado a solicitud
                        </span>
                      ) : (
                        <span className="text-[10px] text-rose-600 font-medium">
                          Supera presupuesto
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Formato Libre Inicial */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-semibold text-slate-700 border-r border-slate-200 bg-slate-50/80">
                  <div className="flex items-center space-x-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Formato Libre («YPYW»)</span>
                  </div>
                </td>
                {comparedJournals.map(item => (
                  <td key={item.journal.id} className="p-3 border-r border-slate-200">
                    {item.journal.formatFreeSubmission === 'confirmed' ? (
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                          ✓ Permitido en 1er envío
                        </span>
                        <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                          {item.journal.formatFreeDetails}
                        </p>
                      </div>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                        Plantilla editorial requerida desde el inicio
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Correspondencia Temática */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-semibold text-slate-700 border-r border-slate-200 bg-slate-50/80">
                  Afinidad Temática
                </td>
                {comparedJournals.map(item => (
                  <td key={item.journal.id} className="p-3 border-r border-slate-200">
                    <div className="font-bold text-slate-900 mb-0.5">
                      {item.thematicAffinity.toUpperCase()} ({item.thematicAffinityScore}%)
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      {item.thematicJustification}
                    </p>
                  </td>
                ))}
              </tr>

              {/* Tiempos de Revisión y Aceptación */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-semibold text-slate-700 border-r border-slate-200 bg-slate-50/80">
                  Tiempos y Métricas
                </td>
                {comparedJournals.map(item => (
                  <td key={item.journal.id} className="p-3 border-r border-slate-200 space-y-1">
                    <div>
                      <span className="text-slate-500 font-medium">Revisión estimada: </span>
                      <strong className="text-slate-800">{item.journal.averageReviewWeeks || '8-12'} semanas</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Tasa aceptación: </span>
                      <strong className="text-slate-800">{item.journal.acceptanceRatePercent ? `${item.journal.acceptanceRatePercent}%` : 'No informada'}</strong>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Fuentes y Enlaces */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-semibold text-slate-700 border-r border-slate-200 bg-slate-50/80">
                  Enlaces Verificados
                </td>
                {comparedJournals.map(item => (
                  <td key={item.journal.id} className="p-3 border-r border-slate-200 space-y-1.5">
                    <a
                      href={item.journal.instructionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline block text-[11px] font-medium"
                    >
                      Guía para Autores <ExternalLink className="w-2.5 h-2.5 inline ml-0.5" />
                    </a>
                    <a
                      href={item.journal.feePolicyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline block text-[11px] font-medium"
                    >
                      Tarifario Oficial <ExternalLink className="w-2.5 h-2.5 inline ml-0.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => onOpenDetails(item.journal)}
                      className="mt-2 w-full py-1 px-2 rounded text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer"
                    >
                      Ver Ficha Técnica
                    </button>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cerrar Comparador
          </button>
        </div>

      </div>
    </div>
  );
};
