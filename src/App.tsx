import React, { useState, useMemo, useEffect, useDeferredValue } from 'react';
import { Header } from './components/Header';
import { SearchPanel } from './components/SearchPanel';
import { FilterSidebar } from './components/FilterSidebar';
import { JournalsTable } from './components/JournalsTable';
import { JournalDetailModal } from './components/JournalDetailModal';
import { ComparisonModal } from './components/ComparisonModal';
import { PrioritizationWeightsModal } from './components/PrioritizationWeightsModal';
import { MethodologyModal } from './components/MethodologyModal';
import { ComparisonBar } from './components/ComparisonBar';
import { TopicPanel } from './components/TopicPanel';
import { AiSettingsModal } from './components/AiSettingsModal';

import { VERIFIED_JOURNALS_DATA } from './data/journalsData';
import { loadScimagoDataset, buildAllJournals } from './data/scimagoLoader';
import { ManuscriptQuery, Journal, ScoringWeights, EvaluatedJournal, TopicProfile, TopicWeight } from './types/journal';
import { filterAndRankJournals, FilterOptions, DEFAULT_FILTER_OPTIONS } from './utils/filterJournals';
import { DEFAULT_WEIGHTS } from './utils/rankingScorer';
import { exportToCSV, generateMarkdownReport } from './utils/exportUtils';
import { getTopicIndex, inferTopicsLexical, hasManuscriptText } from './utils/topicModel';
import { inferTopicsWithAI } from './utils/aiTopics';
import { loadAiSettings, saveAiSettings, StoredAiSettings } from './utils/aiSettingsStore';
import { Copy, Check, FileSpreadsheet, Search, AlertCircle } from 'lucide-react';

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

type DataStatus = 'loading' | 'ready' | 'error';

/**
 * Interpretación con IA (Gemini). Desactivada por defecto hasta validarla;
 * se activa al compilar con VITE_ENABLE_AI=true.
 */
const AI_FEATURE = import.meta.env.VITE_ENABLE_AI === 'true';

export default function App() {
  // Base curada (cargada al instante) + base SCImago (se descarga al abrir la app)
  const [loadedJournals, setLoadedJournals] = useState<Journal[] | null>(null);
  const [dataStatus, setDataStatus] = useState<DataStatus>('loading');
  useEffect(() => {
    let cancelled = false;
    loadScimagoDataset()
      .then(dataset => {
        if (cancelled) return;
        setLoadedJournals(buildAllJournals(dataset, VERIFIED_JOURNALS_DATA));
        setDataStatus('ready');
      })
      .catch(err => { console.error(err); if (!cancelled) setDataStatus('error'); });
    return () => { cancelled = true; };
  }, []);
  const allJournals = loadedJournals ?? VERIFIED_JOURNALS_DATA;
  const scimagoCount = allJournals.length - VERIFIED_JOURNALS_DATA.length;
  // Vocabulario de cada categoría (se calcula una vez cuando termina la carga).
  const topicIndex = useMemo(() => getTopicIndex(allJournals), [allJournals]);

  // IA opcional (clave del usuario, guardada solo en su navegador)
  const [aiSettings, setAiSettings] = useState<StoredAiSettings>(loadAiSettings);
  const [isAiSettingsOpen, setIsAiSettingsOpen] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const updateAiSettings = (next: StoredAiSettings) => { setAiSettings(next); saveAiSettings(next); };
  // Temas detectados en la última búsqueda (antes de que el usuario los edite)
  const [detectedProfile, setDetectedProfile] = useState<TopicProfile | null>(null);

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
    const { topicProfile: _ignored, ...applied } = appliedQuery;
    return JSON.stringify(draftQuery) !== JSON.stringify(applied);
  }, [draftQuery, appliedQuery]);

  // Ejecutar búsqueda: 1) detectar temas (con IA si está activada), 2) aplicar la búsqueda
  const handleExecuteSearch = async () => {
    setIsSearching(true);
    setAiError(null);
    const query: ManuscriptQuery = { ...draftQuery };
    let profile: TopicProfile | undefined;
    if (hasManuscriptText(query)) {
      if (AI_FEATURE && aiSettings.enabled && aiSettings.apiKey) {
        try {
          profile = await inferTopicsWithAI(query, topicIndex.categories, { apiKey: aiSettings.apiKey, model: aiSettings.model });
        } catch (err) {
          setAiError(err instanceof Error ? err.message : 'Error desconocido.');
        }
      }
      // setTimeout permite que se pinte el indicador «Buscando…» antes del cálculo
      await new Promise(resolve => setTimeout(resolve, 0));
      profile ??= inferTopicsLexical(query, topicIndex);
    }
    setDetectedProfile(profile ?? null);
    setAppliedQuery({ ...query, topicProfile: profile });
    setHasSearched(true);
    setIsSearching(false);
  };

  const handleChangeTopics = (topics: TopicWeight[]) => {
    setAppliedQuery(prev => prev.topicProfile
      ? { ...prev, topicProfile: { ...prev.topicProfile, source: 'manual', topics } }
      : prev);
  };
  const handleRestoreTopics = () => {
    if (detectedProfile) setAppliedQuery(prev => ({ ...prev, topicProfile: detectedProfile }));
  };

  // Evaluación y filtrado reactivo a partir de la búsqueda aplicada
  // useDeferredValue mantiene fluida la escritura en el buscador mientras se recalcula
  const deferredFilters = useDeferredValue(filters);
  const evaluatedResults: EvaluatedJournal[] = useMemo(() => {
    if (!hasSearched) return [];
    return filterAndRankJournals(allJournals, appliedQuery, deferredFilters, weights);
  }, [allJournals, appliedQuery, deferredFilters, weights, hasSearched]);

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
    const resetQ: ManuscriptQuery = { ...INITIAL_QUERY };
    setDraftQuery(resetQ);
    setAppliedQuery(resetQ);
    setHasSearched(false);
    setDetectedProfile(null);
    setAiError(null);
    setFilters(DEFAULT_FILTER_OPTIONS);
  };

  // Exportar a CSV
  const handleExportCSV = () => {
    exportToCSV(evaluatedResults, `revistas_seleccion_${new Date().toISOString().slice(0, 10)}.csv`);
  };


  // Copiar informe Markdown
  const handleCopyMarkdown = async () => {
    const report = generateMarkdownReport(evaluatedResults, appliedQuery.maxBudgetUSD);
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
        totalJournals={allJournals.length}
        filteredCount={evaluatedResults.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {dataStatus !== 'ready' && (
          <div
            role="status"
            className={`mb-4 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
              dataStatus === 'error'
                ? 'border-red-200 bg-red-50 text-red-800'
                : 'border-indigo-200 bg-indigo-50 text-indigo-800'
            }`}
          >
            {dataStatus === 'error' ? (
              <>
                <AlertCircle className="w-4 h-4 shrink-0" />
                No se pudo cargar la base SCImago. Se muestran solo las {VERIFIED_JOURNALS_DATA.length} revistas revisadas a mano. Recargue la página para reintentar.
              </>
            ) : (
              <>
                <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin shrink-0" />
                Cargando la base SCImago (más de 24.000 revistas Q1–Q3)…
              </>
            )}
          </div>
        )}

        {/* Buscador y Perfil del Manuscrito con Botón de Búsqueda */}
        <SearchPanel
          query={draftQuery}
          onChangeQuery={setDraftQuery}
          onExecuteSearch={handleExecuteSearch}
          onResetSearch={handleResetSearch}
          isSearching={isSearching}
          hasUnappliedChanges={hasUnappliedChanges}
          aiEnabled={aiSettings.enabled && aiSettings.apiKey !== ''}
          aiConfigured={aiSettings.apiKey !== ''}
          onToggleAi={enabled => updateAiSettings({ ...aiSettings, enabled })}
          onOpenAiSettings={() => setIsAiSettingsOpen(true)}
          showAi={AI_FEATURE}
        />

        {hasSearched && appliedQuery.topicProfile && detectedProfile && (
          <TopicPanel
            profile={appliedQuery.topicProfile}
            detected={detectedProfile}
            categories={topicIndex.categories}
            onChangeTopics={handleChangeTopics}
            onRestore={handleRestoreTopics}
            aiError={aiError}
          />
        )}


        {/* Grid de 2 columnas: Filtros laterales + Tabla Central */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Columna Filtros (4 cols en desktop) */}
          <div className="lg:col-span-3">
            <FilterSidebar
              filters={filters}
              onChangeFilters={setFilters}
              journals={allJournals}
              totalResultsCount={evaluatedResults.length}
            />
          </div>

          {/* Columna Resultados (9 cols en desktop) */}
          <div className="lg:col-span-9 space-y-4">
            
            {/* Barra de utilidades superiores de la tabla */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" aria-hidden="true" />
                <input
                  type="search"
                  aria-label="Filtrar resultados por nombre, ISSN o editorial"
                  value={filters.searchQuery ?? ''}
                  onChange={e => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                  placeholder="Filtrar por nombre, ISSN o editorial…"
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-800"
                />
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
              maxBudgetUSD={appliedQuery.maxBudgetUSD}
              manuscriptTitle={appliedQuery.title}
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

      {isAiSettingsOpen && (
        <AiSettingsModal
          settings={aiSettings}
          onSave={updateAiSettings}
          onClose={() => setIsAiSettingsOpen(false)}
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
            <span>• {VERIFIED_JOURNALS_DATA.length} revistas revisadas a mano + {scimagoCount.toLocaleString('es-ES')} revistas Q1–Q3 de SCImago 2025</span>
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
