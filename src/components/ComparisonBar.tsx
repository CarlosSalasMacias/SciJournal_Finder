import React from 'react';
import { Journal } from '../types/journal';
import { Scale, X, ArrowRight } from 'lucide-react';

interface ComparisonBarProps {
  selectedJournals: Journal[];
  onOpenComparison: () => void;
  onClearSelection: () => void;
  onRemoveJournal: (id: string) => void;
}

export const ComparisonBar: React.FC<ComparisonBarProps> = ({
  selectedJournals,
  onOpenComparison,
  onClearSelection,
  onRemoveJournal
}) => {
  if (selectedJournals.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-3xl w-full px-4 animate-in slide-in-from-bottom-6 duration-200">
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700/80 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-white">
                {selectedJournals.length} {selectedJournals.length === 1 ? 'revista seleccionada' : 'revistas seleccionadas'}
              </span>
              <span className="text-[11px] text-slate-400">
                (Máximo 4)
              </span>
            </div>
            
            {/* Tags de revistas seleccionadas */}
            <div className="flex flex-wrap gap-1.5 mt-1 max-w-md truncate">
              {selectedJournals.map(j => (
                <span
                  key={j.id}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] bg-slate-800 text-slate-200 border border-slate-700"
                >
                  <span className="truncate max-w-[120px]">{j.title}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveJournal(j.id)}
                    className="ml-1 text-slate-400 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center space-x-2 shrink-0 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={onClearSelection}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Limpiar
          </button>
          
          <button
            type="button"
            onClick={onOpenComparison}
            disabled={selectedJournals.length < 2}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center cursor-pointer ${
              selectedJournals.length >= 2
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <span>Comparar Lado a Lado</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
