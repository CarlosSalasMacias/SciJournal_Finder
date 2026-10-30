import React from 'react';
import { useEscapeKey } from '../utils/useEscapeKey';
import { ScoringWeights } from '../types/journal';
import { DEFAULT_WEIGHTS } from '../utils/rankingScorer';
import { X, Sliders, RotateCcw, Info, Check } from 'lucide-react';

interface PrioritizationWeightsModalProps {
  weights: ScoringWeights;
  onChangeWeights: (newWeights: ScoringWeights) => void;
  onClose: () => void;
}

export const PrioritizationWeightsModal: React.FC<PrioritizationWeightsModalProps> = ({
  weights,
  onChangeWeights,
  onClose
}) => {
  useEscapeKey(onClose);
  const total =
    weights.thematicAffinity +
    weights.quartilePrestige +
    weights.costAdvantage +
    weights.formatFree +
    weights.verificationTrust;

  const handleReset = () => {
    onChangeWeights({ ...DEFAULT_WEIGHTS });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-labelledby="weights-modal-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <h2 id="weights-modal-title" className="text-base font-bold text-white">
              Ajuste de Ponderaciones del Algoritmo
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm text-slate-700">
          <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 flex items-start space-x-2 text-xs text-indigo-900">
            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed">
              El algoritmo de priorización calcula una puntuación normalizada de 0 a 100 para cada revista.
              No se ordena únicamente por cuartil: una revista Q1 poco afín al tema o con costes prohibitivos cede el puesto a una Q2 con alta afinidad temática y formato libre garantizado.
            </p>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            {/* 1. Correspondencia Temática */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="font-semibold text-slate-800">
                  1. Correspondencia Temática y Tipo de Manuscrito
                </span>
                <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {Math.round((weights.thematicAffinity / total) * 100)}% ({weights.thematicAffinity} pts)
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={weights.thematicAffinity}
                onChange={e => onChangeWeights({ ...weights, thematicAffinity: Number(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <span className="text-[11px] text-slate-500">
                Evalúa si la revista encaja con el alcance, palabras clave y tipo de artículo.
              </span>
            </div>

            {/* 2. Cuartil e Indexación */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="font-semibold text-slate-800">
                  2. Cuartil e Indexación Verificada (JCR / Scopus / Dialnet)
                </span>
                <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {Math.round((weights.quartilePrestige / total) * 100)}% ({weights.quartilePrestige} pts)
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={weights.quartilePrestige}
                onChange={e => onChangeWeights({ ...weights, quartilePrestige: Number(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <span className="text-[11px] text-slate-500">
                Ponderación del impacto bibliométrico verificado oficial (Q1 = 100, Q2 = 75, Q3 = 50).
              </span>
            </div>

            {/* 3. Ahorro Económico */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="font-semibold text-slate-800">
                  3. Ausencia de Cargos o Coste Dentro del Presupuesto
                </span>
                <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {Math.round((weights.costAdvantage / total) * 100)}% ({weights.costAdvantage} pts)
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={weights.costAdvantage}
                onChange={e => onChangeWeights({ ...weights, costAdvantage: Number(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <span className="text-[11px] text-slate-500">
                Premia revistas de 0 USD (suscripción tradicional o Diamante) o con coste final comprobado bajo.
              </span>
            </div>

            {/* 4. Formato Libre Inicial */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="font-semibold text-slate-800">
                  4. Formato Libre en Envío Inicial («Your Paper Your Way»)
                </span>
                <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {Math.round((weights.formatFree / total) * 100)}% ({weights.formatFree} pts)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="5"
                value={weights.formatFree}
                onChange={e => onChangeWeights({ ...weights, formatFree: Number(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <span className="text-[11px] text-slate-500">
                Ahorro de tiempo para el investigador al evitar adaptar maquetación previa a la revisión.
              </span>
            </div>

            {/* 5. Confiabilidad y Verificación */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="font-semibold text-slate-800">
                  5. Grado de Verificación y Fuentes Primarias
                </span>
                <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {Math.round((weights.verificationTrust / total) * 100)}% ({weights.verificationTrust} pts)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="5"
                value={weights.verificationTrust}
                onChange={e => onChangeWeights({ ...weights, verificationTrust: Number(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <span className="text-[11px] text-slate-500">
                Premia a las revistas cuyos datos económicos y normativas se han comprobado recientemente en fuentes primarias.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Restablecer por Defecto
          </button>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 mr-1.5" />
            Aplicar Ponderaciones
          </button>
        </div>
      </div>
    </div>
  );
};
