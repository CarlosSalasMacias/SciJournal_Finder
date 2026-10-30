import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { SearchPanel } from './components/SearchPanel';
import { FilterSidebar } from './components/FilterSidebar';
import { JournalsTable } from './components/JournalsTable';
import { JournalDetailModal } from './components/JournalDetailModal';
import { ComparisonModal } from './components/ComparisonModal';
import { PrioritizationWeightsModal } from './components/PrioritizationWeightsModal';
import { MethodologyModal } from './components/MethodologyModal';
import { ComparisonBar } from './components/ComparisonBar';

import { VERIFIED_JOURNALS_DATA } from './data/journalsData';
import { ManuscriptQuery, Journal, ScoringWeights, EvaluatedJournal } from './types/journal';
import { filterAndRankJournals, FilterOptions, DEFAULT_FILTER_OPTIONS } from './utils/filterJournals';
import { DEFAULT_WEIGHTS } from './utils/rankingScorer';
import { exportToCSV, generateMarkdownReport } from './utils/exportUtils';
import { Download, Copy, Check, Sparkles, AlertCircle, FileSpreadsheet } from 'lucide-react';

const INITIAL_QUERY: ManuscriptQuery = {
  title: '',
  abstract: '',
  keywords: [],
  primaryDiscipline: 'Todas las disciplinas',
  subDiscipline: '',
  articleType: 'Investigación original',
  language: 'Español',
  accessPreference: 'all',
  acceptableQuartiles: ['Q1', 'Q2', 'Q3'],
  maxBudgetUSD: 500,
  preferFormatFree: true,
  excludeOverBudget: false,
  excludeUnverifiedCosts: false,
  strictRequirementsOnly: false,
  authorRegion: 'none'
};

export default function App() {
  const [draftQuery, setDraftQuery] = useState<ManuscriptQuery>(INITIAL_QUERY);
  const [appliedQuery, setAppliedQuery] = useState<ManuscriptQuery>(INITIAL_QUERY);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTER_OPTIONS);
  const [weights, setWeights] = useState<ScoringWeights>(DEFAULT_WEIGHTS);

  // Modales
  const [selectedJournalForDetail, setSelectedJournalForDetail] = useState<Journal | null>(null);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isWeightsOpen, setIsWeightsOpen] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  // Revistas seleccionadas para comparar
  const [selectedToCompare, setSelectedToCompare] = useState<string[]>([]);
  const [copiedReport, setCopiedReport] = useState(false);

  // Detectar cambios no aplicados
  const hasUnappliedChanges = useMemo(() => {
    return JSON.stringify(draftQuery) !== JSON.stringify(appliedQuery);
  }, [draftQuery, appliedQuery]);

  // Ejecutar búsqueda al pulsar el botón
  const handleExecuteSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setAppliedQuery({ ...draftQuery });
      setHasSearched(true);
      setIsSearching(false);
    }, 200);
  };

  // Evaluación y filtrado reactivo a partir de la búsqueda aplicada
  const evaluatedResults: EvaluatedJournal[] = useMemo(() => {
    return filterAndRankJournals(VERIFIED_JOURNALS_DATA, appliedQuery, filters, weights);
  }, [appliedQuery, filters, weights]);

  // Lista de revistas en comparativa
  const comparedEvaluatedJournals = useMemo(() => {
    return evaluatedResults.filter(item => selectedToCompare.includes(item.journal.id));
  }, [evaluatedResults, selectedToCompare]);

  // Toggle de selección en comparador (máximo 4)
  const handleToggleCompare = (id: string) => {
    if (selectedToCompare.includes(id)) {
      setSelectedToCompare(prev => prev.filter(item => item !== id));
    } else {
      if (selectedToCompare.length < 4) {
        setSelectedToCompare(prev => [...prev, id]);
      }
    }
  };

  // Restablecer búsqueda
  const handleResetSearch = () => {
    const resetQ: ManuscriptQuery = {
      title: '',
      abstract: '',
      keywords: [],
      primaryDiscipline: 'Todas las disciplinas',
      subDiscipline: '',
      articleType: 'Investigación original',
      language: 'Español',
      accessPreference: 'all',
      acceptableQuartiles: ['Q1', 'Q2', 'Q3'],
      maxBudgetUSD: 500,
      preferFormatFree: false,
      excludeOverBudget: false,
      excludeUnverifiedCosts: false,
      strictRequirementsOnly: false,
      authorRegion: 'none'
    };
    setDraftQuery(resetQ);
    setAppliedQuery(resetQ);
    setHasSearched(false);
    setFilters(DEFAULT_FILTER_OPTIONS);
  };

  // Exportar a CSV
  const handleExportCSV = () => {
    exportToCSV(evaluatedResults, `revistas_seleccion_${new Date().toISOString().slice(0, 10)}.csv`);
  };


  // Copiar informe Markdown
  const handleCopyMarkdown = async () => {
    const report = generateMarkdownReport(evaluatedResults);
    try {
      await navigator.clipboard.writeText(report);
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 3000);
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header institucional */}
      <Header
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        onOpenWeights={() => setIsWeightsOpen(true)}
        totalJournals={VERIFIED_JOURNALS_DATA.length}
        filteredCount={evaluatedResults.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Buscador y Perfil del Manuscrito con Botón de Búsqueda */}
        <SearchPanel
          query={draftQuery}
          onChangeQuery={setDraftQuery}
          onExecuteSearch={handleExecuteSearch}
          onResetSearch={handleResetSearch}
          isSearching={isSearching}
          hasUnappliedChanges={hasUnappliedChanges}
        />


        {/* Grid de 2 columnas: Filtros laterales + Tabla Central */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Columna Filtros (4 cols en desktop) */}
          <div className="lg:col-span-3">
            <FilterSidebar
              filters={filters}
              onChangeFilters={setFilters}
              journals={VERIFIED_JOURNALS_DATA}
              totalResultsCount={evaluatedResults.length}
            />
          </div>

          {/* Columna Resultados (9 cols en desktop) */}
          <div className="lg:col-span-9 space-y-4">
            
            {/* Barra de utilidades superiores de la tabla */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-xs text-slate-600">
                Mostrando <strong className="text-slate-900 font-bold">{evaluatedResults.length}</strong> revistas elegibles 
                {appliedQuery.title ? (
                  <span> ajustadas al manuscrito: <em className="text-indigo-700">«{appliedQuery.title.slice(0, 50)}...»</em></span>
                ) : ''}

              </div>

              {/* Botones de Exportación */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  disabled={evaluatedResults.length === 0}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors disabled:opacity-50 cursor-pointer"
                  title="Descargar selección en formato CSV compatible con Microsoft Excel"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  Exportar CSV / Excel
                </button>

                <button
                  type="button"
                  onClick={handleCopyMarkdown}
                  disabled={evaluatedResults.length === 0}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors disabled:opacity-50 cursor-pointer"
                  title="Copiar informe de resultados en formato Markdown estructurado"
                >
                  {copiedReport ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                      ¡Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                      Copiar Informe
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Tabla Principal */}
            <JournalsTable
              results={evaluatedResults}
              selectedToCompare={selectedToCompare}
              onToggleCompare={handleToggleCompare}
              onOpenDetails={setSelectedJournalForDetail}
              sortBy={filters.sortBy}
              onSortChange={newSort => setFilters(prev => ({ ...prev, sortBy: newSort }))}
              hasSearched={hasSearched}
            />

          </div>
        </div>

      </main>

      {/* Barra flotante para comparar cuando hay selecciones */}
      <ComparisonBar
        selectedJournals={comparedEvaluatedJournals.map(i => i.journal)}
        onOpenComparison={() => setIsComparisonOpen(true)}
        onClearSelection={() => setSelectedToCompare([])}
        onRemoveJournal={handleToggleCompare}
      />

      {/* Modal Ficha Técnica Ampliada */}
      {selectedJournalForDetail && (
        <JournalDetailModal
          journal={selectedJournalForDetail}
          onClose={() => setSelectedJournalForDetail(null)}
          query={appliedQuery}
          onToggleCompare={handleToggleCompare}
          isCompared={selectedToCompare.includes(selectedJournalForDetail.id)}
        />
      )}

      {/* Modal Comparativa Lado a Lado */}
      {isComparisonOpen && (
        <ComparisonModal
          comparedJournals={comparedEvaluatedJournals}
          onClose={() => setIsComparisonOpen(false)}
          onRemoveFromCompare={handleToggleCompare}
          onOpenDetails={setSelectedJournalForDetail}
        />
      )}

      {/* Modal Configuración de Ponderaciones */}
      {isWeightsOpen && (
        <PrioritizationWeightsModal
          weights={weights}
          onChangeWeights={setWeights}
          onClose={() => setIsWeightsOpen(false)}
        />
      )}

      {/* Modal Metodología y Verificación */}
      {isMethodologyOpen && (
        <MethodologyModal
          onClose={() => setIsMethodologyOpen(false)}
        />
      )}

      {/* Footer Académico */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">SciJournal Finder</span>
            <span>• Base de datos de revistas científicas Q1–Q3 con verificación primaria</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setIsMethodologyOpen(true)}
              className="hover:text-indigo-600 transition-colors cursor-pointer underline"
            >
              Fuentes & Criterios
            </button>
            <button
              type="button"
              onClick={() => setIsWeightsOpen(true)}
              className="hover:text-indigo-600 transition-colors cursor-pointer underline"
            >
              Algoritmo de Priorización
            </button>
            <a
              href="https://doaj.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600 transition-colors"
            >
              DOAJ
            </a>
            <a
              href="https://www.scimagojr.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600 transition-colors"
            >
              Scopus/SJR
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
