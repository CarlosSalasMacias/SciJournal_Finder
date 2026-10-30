import React, { useState, useEffect } from 'react';
import { FilterOptions } from '../utils/filterJournals';
import { Quartile, Journal } from '../types/journal';
import { Filter, RotateCcw, Check, Sparkles } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterOptions;
  onChangeFilters: (newFilters: FilterOptions) => void;
  journals: Journal[];
  totalResultsCount: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChangeFilters,
  journals,
  totalResultsCount
}) => {
  const [draftFilters, setDraftFilters] = useState<FilterOptions>(filters);

  // Sincronizar si cambian externamente (ej. reset general)
  useEffect(() => {
    setDraftFilters(filters);
  }, [filters]);

  const hasUnappliedFilters = JSON.stringify(draftFilters) !== JSON.stringify(filters);

  const toggleQuartile = (q: Quartile) => {
    const current = draftFilters.selectedQuartiles;
    const exists = current.includes(q);
    const updated = exists ? current.filter(item => item !== q) : [...current, q];
    setDraftFilters({ ...draftFilters, selectedQuartiles: updated });
  };

  const togglePublicationModel = (modelKey: string) => {
    const current = draftFilters.selectedPublicationModels;
    const exists = current.includes(modelKey);
    const updated = exists ? current.filter(m => m !== modelKey) : [...current, modelKey];
    setDraftFilters({ ...draftFilters, selectedPublicationModels: updated });
  };

  const togglePublisher = (publisherName: string) => {
    const current = draftFilters.selectedPublishers;
    const exists = current.includes(publisherName);
    const updated = exists ? current.filter(p => p !== publisherName) : [...current, publisherName];
    setDraftFilters({ ...draftFilters, selectedPublishers: updated });
  };

  const toggleDatabase = (dbName: string) => {
    const current = draftFilters.selectedIndexDatabases;
    const exists = current.includes(dbName);
    const updated = exists ? current.filter(d => d !== dbName) : [...current, dbName];
    setDraftFilters({ ...draftFilters, selectedIndexDatabases: updated });
  };

  const handleApply = () => {
    onChangeFilters(draftFilters);
  };

  const resetAllFilters = () => {
    const resetVal: FilterOptions = {
      searchQuery: '',
      selectedQuartiles: ['Q1', 'Q2', 'Q3'],
      selectedDiscipline: 'all',
      selectedPublicationModels: [],
      onlyFormatFree: false,
      onlyFreeOrUnder500: false,
      maxCostUSD: 500,
      costPriorityMode: 'zero_apc_first',
      selectedPublishers: [],
      selectedIndexDatabases: [],
      selectedVerificationStatuses: [],
      strictCriteriaOnly: false,
      sortBy: 'score'
    };
    setDraftFilters(resetVal);
    onChangeFilters(resetVal);
  };

  // Extraer editoriales únicas
  const allPublishers = Array.from(
    new Set(
      journals.map(j => {
        if (j.publisher.includes('Elsevier')) return 'Elsevier';
        if (j.publisher.includes('Springer')) return 'Springer Nature';
        if (j.publisher.includes('Oxford')) return 'Oxford University Press';
        if (j.publisher.includes('IEEE')) return 'IEEE';
        if (j.publisher.includes('BMJ')) return 'BMJ';
        if (j.publisher.includes('CSIC')) return 'CSIC';
        if (j.publisher.includes('PLOS')) return 'PLOS';
        return j.publisher;
      })
    )
  ).slice(0, 7);

  return (
    <aside className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-5 text-sm">
      {/* Header Sidebar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-800" />
          <h3 className="font-bold text-slate-800 text-sm tracking-tight">Filtros Avanzados</h3>
        </div>
        <button
          type="button"
          onClick={resetAllFilters}
          className="inline-flex items-center text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          title="Restablecer todos los filtros"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Limpiar
        </button>
      </div>

      {/* Botón Aplicar Destacado si hay cambios */}
      {hasUnappliedFilters && (
        <div className="p-2 bg-amber-50 rounded-lg border border-amber-200 text-center">
          <button
            type="button"
            onClick={handleApply}
            className="w-full py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-md shadow-2xs transition-all cursor-pointer flex items-center justify-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            <span>Aplicar Filtros Avanzados</span>
          </button>
        </div>
      )}

      {/* Toggle Cumplimiento Estricto vs Candidatas Potenciales */}
      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
        <label className="flex items-start space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={draftFilters.strictCriteriaOnly}
            onChange={e => setDraftFilters({ ...draftFilters, strictCriteriaOnly: e.target.checked })}
            className="mt-0.5 rounded text-slate-800 focus:ring-slate-800 border-slate-300 w-4 h-4"
          />
          <div>
            <span className="block text-xs font-semibold text-slate-900">
              Modo Estricto de Verificación
            </span>
            <span className="block text-[11px] text-slate-600 leading-snug">
              Mostrar solo revistas 100% verificadas sin exenciones dudosas ni condicionales.
            </span>
          </div>
        </label>
      </div>

      {/* 1. Cuartiles */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Cuartil (Q1–Q3)
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {(['Q1', 'Q2', 'Q3'] as Quartile[]).map(q => {
            const isSelected = draftFilters.selectedQuartiles.includes(q);
            const count = journals.filter(j => j.quartiles.some(item => item.quartile === q)).length;
            return (
              <button
                key={q}
                type="button"
                onClick={() => toggleQuartile(q)}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors flex flex-col items-center justify-center cursor-pointer ${
                  isSelected
                    ? q === 'Q1'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : q === 'Q2'
                      ? 'bg-blue-50 text-blue-800 border-blue-300'
                      : 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{q}</span>
                <span className="text-[10px] font-normal opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Prioridad Económica Requerida */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Prioridad de Coste
          </label>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
            1º Sin APC
          </span>
        </div>

        <div className="space-y-1.5 text-xs">
          <label className={`flex items-start space-x-2 p-2 rounded-lg cursor-pointer transition-colors border ${
            draftFilters.costPriorityMode === 'zero_apc_first'
              ? 'bg-slate-100 border-slate-300 text-slate-900'
              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}>
            <input
              type="radio"
              name="costPriorityMode"
              checked={draftFilters.costPriorityMode === 'zero_apc_first'}
              onChange={() => setDraftFilters({ ...draftFilters, costPriorityMode: 'zero_apc_first' })}
              className="mt-0.5 text-slate-800 focus:ring-slate-800 w-3.5 h-3.5"
            />
            <div>
              <span className="font-bold text-slate-900 block leading-tight">
                1º Sin APC (0 USD) → luego dentro de presupuesto
              </span>
              <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                Ubica primero las revistas sin pago obligatorio y en segundo lugar las que se ajustan al presupuesto.
              </span>
            </div>
          </label>

          <label className={`flex items-start space-x-2 p-2 rounded-lg cursor-pointer transition-colors border ${
            draftFilters.costPriorityMode === 'only_zero_apc'
              ? 'bg-slate-100 border-slate-300 text-slate-900'
              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}>
            <input
              type="radio"
              name="costPriorityMode"
              checked={draftFilters.costPriorityMode === 'only_zero_apc'}
              onChange={() => setDraftFilters({ ...draftFilters, costPriorityMode: 'only_zero_apc' })}
              className="mt-0.5 text-slate-800 focus:ring-slate-800 w-3.5 h-3.5"
            />
            <div>
              <span className="font-semibold text-slate-800 block leading-tight">
                Solo revistas Sin APC (0 USD)
              </span>
              <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                Filtra estrictamente para mostrar únicamente revistas sin ningún cargo obligatorio de publicación.
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* 2. Criterios Adicionales */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
          Criterios Adicionales
        </label>

        {/* Formato Libre */}
        <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer hover:text-slate-900">
          <input
            type="checkbox"
            checked={draftFilters.onlyFormatFree}
            onChange={e => setDraftFilters({ ...draftFilters, onlyFormatFree: e.target.checked })}
            className="rounded text-slate-800 focus:ring-slate-800 border-slate-300 w-4 h-4"
          />
          <span className="font-medium text-slate-800">
            Formato libre confirmado (YPYW)
          </span>
        </label>
      </div>

      {/* 3. Modalidad Editorial */}
      <div className="space-y-1.5 pt-2 border-t border-slate-100">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
          Modalidad de Publicación
        </label>

        <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={draftFilters.selectedPublicationModels.includes('traditional')}
              onChange={() => togglePublicationModel('traditional')}
              className="rounded text-slate-800 border-slate-300 w-3.5 h-3.5"
            />
            <span>Tradicional (Sin APC obligatorio)</span>
          </div>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-medium">0 $</span>
        </label>

        <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={draftFilters.selectedPublicationModels.includes('diamond')}
              onChange={() => togglePublicationModel('diamond')}
              className="rounded text-slate-800 border-slate-300 w-3.5 h-3.5"
            />
            <span>Acceso Abierto Diamante</span>
          </div>
          <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded font-medium">0 $ OA</span>
        </label>

        <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={draftFilters.selectedPublicationModels.includes('hybrid')}
              onChange={() => togglePublicationModel('hybrid')}
              className="rounded text-slate-800 border-slate-300 w-3.5 h-3.5"
            />
            <span>Híbrida (Vía suscripción / OA)</span>
          </div>
          <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-medium">Dual</span>
        </label>

        <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={draftFilters.selectedPublicationModels.includes('full_oa')}
              onChange={() => togglePublicationModel('full_oa')}
              className="rounded text-slate-800 border-slate-300 w-3.5 h-3.5"
            />
            <span>Acceso Abierto Completo con APC</span>
          </div>
          <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded font-medium">Gold OA</span>
        </label>
      </div>

      {/* 4. Filtro por Editorial */}
      <div className="space-y-1 pt-2 border-t border-slate-100">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
          Editorial
        </label>
        {allPublishers.map(pub => {
          const isChecked = draftFilters.selectedPublishers.includes(pub);
          return (
            <label key={pub} className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => togglePublisher(pub)}
                className="rounded text-slate-800 border-slate-300 w-3.5 h-3.5"
              />
              <span className="truncate">{pub}</span>
            </label>
          );
        })}
      </div>

      {/* 5. Bases de Indexación */}
      <div className="space-y-1 pt-2 border-t border-slate-100">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
          Indexación Verificada
        </label>
        {['Web of Science (JCR)', 'Scopus', 'DOAJ', 'PubMed', 'Dialnet', 'SciELO'].map(db => {
          const isChecked = draftFilters.selectedIndexDatabases.includes(db);
          return (
            <label key={db} className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleDatabase(db)}
                className="rounded text-slate-800 border-slate-300 w-3.5 h-3.5"
              />
              <span>{db}</span>
            </label>
          );
        })}
      </div>

      {/* Botón de Aplicar Filtros al final */}
      <div className="pt-3 border-t border-slate-200">
        <button
          type="button"
          onClick={handleApply}
          className={`w-full py-2 px-4 rounded-lg font-bold text-xs text-white transition-all shadow-sm cursor-pointer flex items-center justify-center space-x-1.5 ${
            hasUnappliedFilters
              ? 'bg-slate-900 hover:bg-slate-800 ring-2 ring-slate-400'
              : 'bg-slate-900 hover:bg-slate-800'
          }`}
        >
          <Check className="w-4 h-4 mr-1 text-emerald-400" />
          <span>Aplicar Filtros Avanzados</span>
        </button>

        <div className="text-xs text-slate-500 text-center mt-2">
          Mostrando <strong className="text-slate-900">{totalResultsCount}</strong> de {journals.length} revistas
        </div>
      </div>
    </aside>
  );
};
