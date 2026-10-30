import React, { useState } from 'react';
import { Journal, ManuscriptQuery } from '../types/journal';
import { calculateEffectiveCost } from '../utils/costCalculator';
import {
  X,
  ExternalLink,
  ShieldCheck,
  DollarSign,
  FileText,
  Layers,
  Calendar,
  Building,
  CheckCircle2,
  AlertTriangle,
  Scale
} from 'lucide-react';

interface JournalDetailModalProps {
  journal: Journal | null;
  onClose: () => void;
  query: ManuscriptQuery;
  onToggleCompare: (id: string) => void;
  isCompared: boolean;
}

export const JournalDetailModal: React.FC<JournalDetailModalProps> = ({
  journal,
  onClose,
  query,
  onToggleCompare,
  isCompared
}) => {
  if (!journal) return null;

  const costResult = calculateEffectiveCost(journal, query);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-start justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-500 text-white">
                {journal.primaryDiscipline}
              </span>
              {journal.isDiamondOA && (
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-teal-400 text-teal-950">
                  Acceso Abierto Diamante (0 USD)
                </span>
              )}
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300">
                ISSN: {journal.issn} {journal.eissn ? `• eISSN: ${journal.eissn}` : ''}
              </span>
            </div>
            <h2 id="modal-title" className="text-xl font-bold tracking-tight text-white">
              {journal.title}
            </h2>
            <div className="text-xs text-slate-300 flex items-center space-x-2 mt-1">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>Editorial: <strong>{journal.publisher}</strong></span>
              <span className="text-slate-500">•</span>
              <a
                href={journal.journalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-300 hover:text-white underline inline-flex items-center"
              >
                Web oficial <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Cerrar ficha de revista"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          
          {/* 1. Métricas de Indexación y Cuartiles Oficiales */}
          <section className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center">
              <Layers className="w-4 h-4 mr-1.5 text-indigo-600" />
              Clasificación y Cuartiles Verificados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {journal.quartiles.map((q, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        q.quartile === 'Q1'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : q.quartile === 'Q2'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {q.quartile}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-700">
                      {q.metricLabel}
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <div className="text-xs font-semibold text-slate-800">{q.category}</div>
                    <div className="text-[11px] text-slate-500">
                      Fuente: {q.source} • Edición: {q.year}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bases de datos indexadas */}
            <div className="mt-3 pt-3 border-t border-slate-200">
              <span className="text-xs font-semibold text-slate-600 mr-2">Indexada en:</span>
              <div className="inline-flex flex-wrap gap-1.5 mt-1">
                {journal.indexingDatabases.map((db, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-slate-200 text-slate-700"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 mr-1" />
                    {db.name}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* 2. Desglose Económico y Transparencia de Costes */}
          <section className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center">
              <DollarSign className="w-4 h-4 mr-1.5 text-emerald-600" />
              Condiciones Económicas y Cálculo de Coste Final
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-xs text-slate-500 block">APC de Lista Oficial</span>
                <span className="text-base font-bold text-slate-900">
                  {journal.listAPC.amount} {journal.listAPC.currency}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Equivalente: ~${journal.listAPC.usdEquivalent} USD (Cambio {journal.listAPC.exchangeRateUsed} a {journal.listAPC.rateDate})
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-xs text-slate-500 block">Cargos Adicionales Obligatorios</span>
                <span className="text-base font-bold text-slate-900">
                  ${journal.listAPC.mandatoryOtherFeesUSD} USD
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Páginas, figuras a color o tasa de envío
                </span>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="text-xs text-emerald-800 font-medium block">Coste Final Estimado Manuscrito</span>
                <span className="text-lg font-black text-emerald-900">
                  ${costResult.effectiveCostUSD} USD
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
                  {costResult.budgetEligibility === 'under_500_confirmed'
                    ? '✓ ≤ 500 USD confirmado'
                    : costResult.budgetEligibility === 'under_500_conditioned'
                    ? '⚠️ ≤ 500 USD condicionado a solicitud'
                    : '> 500 USD'}
                </span>
              </div>
            </div>

            {/* Explicación de cálculo */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
              <p className="font-medium text-slate-800">{costResult.costBreakdownNotes}</p>
              
              {/* Programas de exenciones y descuentos disponibles */}
              {journal.availableDiscounts.length > 0 && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-700 block mb-1">
                    Exenciones y Descuentos Documentados para esta Revista:
                  </span>
                  <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
                    {journal.availableDiscounts.map(d => (
                      <li key={d.id}>
                        <strong className="text-slate-800">{d.title}</strong>: {d.description}
                        <div className="text-[11px] text-slate-500">
                          Condición: {d.conditions} •{' '}
                          <a
                            href={d.evidenceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline inline-flex items-center"
                          >
                            Ver política oficial de exenciones <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* 3. Requisitos de Envío y Política de Formato Libre */}
          <section className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-1.5 text-indigo-600" />
              Política de Envío Inicial y Formato Libre
            </h3>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-600">Estado de Formato Libre:</span>
                {journal.formatFreeSubmission === 'confirmed' ? (
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    ✓ Confirmado («Your Paper Your Way»)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                    Requiere plantilla editorial obligatoria
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {journal.formatFreeDetails}
              </p>
              <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <span className="block font-medium text-slate-700">Revisión estimada:</span>
                  <span>{journal.averageReviewWeeks || '8-12'} semanas</span>
                </div>
                <div>
                  <span className="block font-medium text-slate-700">Tasa aceptación:</span>
                  <span>{journal.acceptanceRatePercent ? `${journal.acceptanceRatePercent}%` : 'No pública'}</span>
                </div>
                <div>
                  <span className="block font-medium text-slate-700">Idiomas:</span>
                  <span>{journal.languages.join(', ')}</span>
                </div>
                <div>
                  <span className="block font-medium text-slate-700">Tipo de alcance:</span>
                  <span className="capitalize">{journal.scopeType.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Trazabilidad y Fuentes Primarias de Verificación */}
          <section className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1.5 text-indigo-600" />
                Fuentes Primarias y Evidencia Verificada
              </h3>
              <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Última comprobación: <strong>{journal.lastVerificationDate}</strong></span>
              </div>
            </div>

            <div className="space-y-2">
              {journal.sources.map((src, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between text-xs">
                  <div>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-indigo-700 hover:text-indigo-900 underline inline-flex items-center"
                    >
                      {src.title}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Datos contrastados: {src.verifiedDataPoints.join(', ')}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Comprobado
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 mt-2 italic">
              {journal.verificationNotes}
            </p>
          </section>

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => onToggleCompare(journal.id)}
            className={`px-3 py-1.5 rounded-lg font-semibold border transition-colors cursor-pointer inline-flex items-center ${
              isCompared
                ? 'bg-indigo-600 text-white border-indigo-700'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            <Scale className="w-3.5 h-3.5 mr-1.5" />
            {isCompared ? 'Quitar del comparador' : 'Añadir al comparador'}
          </button>

          <div className="flex items-center space-x-2">
            <a
              href={journal.instructionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors inline-flex items-center"
            >
              Directrices para Autores
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
