import React, { useState } from 'react';
import { ManuscriptQuery } from '../types/journal';
import { Search, Tag, Sparkles, Settings } from 'lucide-react';

interface SearchPanelProps {
  query: ManuscriptQuery;
  onChangeQuery: (newQuery: ManuscriptQuery) => void;
  onExecuteSearch: () => void;
  onResetSearch: () => void;
  isSearching: boolean;
  hasUnappliedChanges: boolean;
  aiEnabled: boolean;
  aiConfigured: boolean;
  onToggleAi: (enabled: boolean) => void;
  onOpenAiSettings: () => void;
  /** Mostrar la opción de IA (desactivada mientras no esté validada). */
  showAi?: boolean;
}

const DISCIPLINES = [
  { value: 'Todas las disciplinas', label: 'Todas las disciplinas' },
  { value: 'Ciencias de la Vida y Medicina', label: 'Ciencias de la Vida y Medicina' },
  { value: 'Ingeniería y Tecnología', label: 'Ingeniería y Tecnología' },
  { value: 'Ciencias Exactas y Naturales', label: 'Ciencias Exactas y Naturales' },
  { value: 'Ciencias Sociales', label: 'Ciencias Sociales' },
  { value: 'Humanidades y Arte', label: 'Humanidades y Arte' }
];

const ARTICLE_TYPES = [
  'Investigación original',
  'Revisión sistemática',
  'Comunicación breve',
  'Artículo metodológico',
  'Estudio de caso',
  'Software paper / Herramienta',
  'Ensayo crítico'
];

export const SearchPanel: React.FC<SearchPanelProps> = ({
  query,
  onChangeQuery,
  onExecuteSearch,
  onResetSearch,
  isSearching,
  hasUnappliedChanges,
  aiEnabled,
  aiConfigured,
  onToggleAi,
  onOpenAiSettings,
  showAi = false
}) => {
  const [showAdvancedAbstract, setShowAdvancedAbstract] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !query.keywords.includes(keywordInput.trim().toLowerCase())) {
      onChangeQuery({
        ...query,
        keywords: [...query.keywords, keywordInput.trim().toLowerCase()]
      });
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (kwToRemove: string) => {
    onChangeQuery({
      ...query,
      keywords: query.keywords.filter(k => k !== kwToRemove)
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden mb-6 p-5 space-y-4">
      
      {/* Título y Disciplina principal */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8">
          <label htmlFor="manuscript-title" className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-1">
            Título del Manuscrito
          </label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              id="manuscript-title"
              type="text"
              value={query.title}
              onChange={e => onChangeQuery({ ...query, title: e.target.value })}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onExecuteSearch();
                }
              }}
              placeholder="Ej.: Evaluación de metodologías activas en educación superior..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-800 focus:border-slate-800 bg-white"
            />
          </div>
        </div>

        <div className="md:col-span-4">
          <label htmlFor="primary-discipline" className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-1">
            Disciplina
          </label>
          <select
            id="primary-discipline"
            value={query.primaryDiscipline === 'all' ? 'Todas las disciplinas' : (query.primaryDiscipline || 'Todas las disciplinas')}
            onChange={e => onChangeQuery({ ...query, primaryDiscipline: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-800 bg-white"
          >
            {DISCIPLINES.map(d => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tipo de Artículo e Idioma */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-6">
          <label htmlFor="article-type" className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-1">
            Tipo de Artículo
          </label>
          <select
            id="article-type"
            value={query.articleType}
            onChange={e => onChangeQuery({ ...query, articleType: e.target.value })}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-800 bg-white"
          >
            {ARTICLE_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-6">
          <label htmlFor="publication-lang" className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-1">
            Idioma de Envío
          </label>
          <select
            id="publication-lang"
            value={query.language}
            onChange={e => onChangeQuery({ ...query, language: e.target.value })}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-800 bg-white"
          >
            <option value="Español">Español</option>
            <option value="Inglés">Inglés</option>
            <option value="Ambos">Español o Inglés</option>
          </select>
        </div>
      </div>

      {/* Checkbox para alternar Resumen/Abstract y palabras clave */}
      <div className="pt-1">
        <label className="inline-flex items-center space-x-2 text-xs text-slate-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showAdvancedAbstract}
            onChange={e => setShowAdvancedAbstract(e.target.checked)}
            className="rounded text-slate-800 focus:ring-slate-800 w-4 h-4 border-slate-300"
          />
          <span className="font-medium">Incluir resumen / abstract y palabras clave (opcional para análisis semántico)</span>
        </label>
      </div>

      {showAdvancedAbstract && (
        <div className="space-y-4 pt-2 border-t border-slate-100 animate-in fade-in duration-150">
          <div>
            <label htmlFor="manuscript-abstract" className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-1">
              Resumen / Abstract del Manuscrito
            </label>
            <textarea
              id="manuscript-abstract"
              rows={2}
              value={query.abstract}
              onChange={e => onChangeQuery({ ...query, abstract: e.target.value })}
              placeholder="Introduce un extracto del resumen, objetivos o metodología..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-800 bg-white"
            />
          </div>

          <div>
            <label htmlFor="keyword-input" className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-1">
              Palabras Clave (Keywords)
            </label>
            <div className="flex items-center space-x-2 mb-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  id="keyword-input"
                  type="text"
                  value={keywordInput}
                  onChange={e => setKeywordInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddKeyword();
                    }
                  }}
                  placeholder="Escribe un término y pulsa Enter..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-800"
                />
              </div>
              <button
                type="button"
                onClick={handleAddKeyword}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg cursor-pointer"
              >
                Añadir
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {query.keywords.map(kw => (
                <span
                  key={kw}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
                >
                  {kw}
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(kw)}
                    className="ml-1 text-slate-400 hover:text-slate-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Opciones compactas de Presupuesto y Formato Libre */}
      <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center text-xs">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium text-slate-700">Presupuesto Máximo APC:</span>
            <span className="font-bold text-slate-900">${query.maxBudgetUSD} USD</span>
          </div>
          <input
            type="range"
            min="0"
            max="3000"
            step="50"
            value={query.maxBudgetUSD}
            onChange={e => onChangeQuery({ ...query, maxBudgetUSD: Number(e.target.value) })}
            className="w-full accent-slate-800 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
        </div>

        <div className="flex items-center sm:justify-end">
          <label className="inline-flex items-center space-x-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={query.preferFormatFree}
              onChange={e => onChangeQuery({ ...query, preferFormatFree: e.target.checked })}
              className="rounded text-slate-800 focus:ring-slate-800 w-4 h-4 border-slate-300"
            />
            <span className="text-slate-700 font-medium">Priorizar formato libre</span>
          </label>
        </div>
      </div>

      {/* Botón Buscar */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="text-xs">
          {hasUnappliedChanges ? (
            <span className="text-amber-700 font-medium flex items-center">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block mr-1.5"></span>
              Cambios sin buscar
            </span>
          ) : (
            <span className="text-slate-500">
              Criterios listos
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {showAi && (
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-700">
            <Sparkles className={`w-3.5 h-3.5 ${aiEnabled ? 'text-amber-500' : 'text-slate-400'}`} aria-hidden="true" />
            {aiConfigured ? (
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={aiEnabled}
                  onChange={e => onToggleAi(e.target.checked)}
                  className="rounded border-slate-300"
                />
                Interpretar con IA
              </label>
            ) : (
              <span>Interpretar con IA</span>
            )}
            <button
              type="button"
              onClick={onOpenAiSettings}
              className="inline-flex items-center text-indigo-700 hover:text-indigo-900 underline cursor-pointer"
              aria-label="Configurar la interpretación con IA"
            >
              {aiConfigured ? <Settings className="w-3.5 h-3.5" /> : 'Configurar'}
            </button>
          </div>
          )}

          <button
            type="button"
            onClick={onResetSearch}
            className="text-slate-500 hover:text-slate-800 text-xs underline cursor-pointer"
          >
            Restablecer
          </button>

          <button
            type="button"
            onClick={onExecuteSearch}
            disabled={isSearching}
            className="px-5 py-2 rounded-lg font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm inline-flex items-center justify-center cursor-pointer min-w-[160px]"
          >
            {isSearching ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                <span>Buscando...</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5 mr-2" />
                <span>Buscar Revistas</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};
