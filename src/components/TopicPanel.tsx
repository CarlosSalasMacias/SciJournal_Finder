import React, { useState } from 'react';
import { Sparkles, Tags, X, Plus, RotateCcw, AlertTriangle } from 'lucide-react';
import { TopicProfile, TopicWeight } from '../types/journal';

interface TopicPanelProps {
  profile: TopicProfile;
  /** Perfil detectado originalmente (para deshacer las ediciones). */
  detected: TopicProfile;
  categories: string[];
  onChangeTopics: (topics: TopicWeight[]) => void;
  onRestore: () => void;
  aiError?: string | null;
  /** Si se indica, se ofrece activar la IA cuando los temas no vienen de ella. */
  onSuggestAi?: () => void;
}

const SOURCE_LABEL: Record<TopicProfile['source'], string> = {
  ai: 'Interpretados por IA',
  lexical: 'Detectados por vocabulario',
  manual: 'Editados por usted',
};

/** Temas detectados en el manuscrito: el usuario puede ver por qué salen esas revistas y corregirlos. */
export const TopicPanel: React.FC<TopicPanelProps> = ({ profile, detected, categories, onChangeTopics, onRestore, aiError, onSuggestAi }) => {
  const [newTopic, setNewTopic] = useState('');
  const listId = 'topic-category-list';

  const remove = (category: string) => onChangeTopics(profile.topics.filter(t => t.category !== category));

  const add = () => {
    const match = categories.find(c => c.toLowerCase() === newTopic.trim().toLowerCase());
    if (!match || profile.topics.some(t => t.category === match)) return;
    onChangeTopics([...profile.topics, { category: match, weight: 1 }]);
    setNewTopic('');
  };

  const edited = profile.source === 'manual';

  return (
    <section aria-label="Temas del manuscrito" className="mb-6 bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {profile.source === 'ai' || (edited && detected.source === 'ai')
            ? <Sparkles className="w-4 h-4 text-amber-500" aria-hidden="true" />
            : <Tags className="w-4 h-4 text-indigo-600" aria-hidden="true" />}
          <h2 className="text-sm font-bold text-slate-900">Temas del manuscrito</h2>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {SOURCE_LABEL[profile.source]}{profile.source === 'ai' && profile.model ? ` · ${profile.model}` : ''}
          </span>
        </div>
        {edited && (
          <button type="button" onClick={onRestore} className="inline-flex items-center text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer">
            <RotateCcw className="w-3 h-3 mr-1" /> Volver a los detectados
          </button>
        )}
      </div>

      {aiError && (
        <p role="alert" className="flex items-start gap-2 text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>No se pudo usar la IA: {aiError} Se muestran los temas detectados por vocabulario.</span>
        </p>
      )}

      {onSuggestAi && !aiError && profile.source === 'lexical' && (
        <p className="flex flex-wrap items-center gap-1 text-xs text-slate-600 bg-amber-50/60 border border-amber-200 rounded-lg px-3 py-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
          ¿Los temas no corresponden a su manuscrito? La IA entiende el significado del texto.
          <button type="button" onClick={onSuggestAi} className="font-semibold text-indigo-700 hover:text-indigo-900 underline cursor-pointer">
            Activarla gratis
          </button>
        </p>
      )}

      {profile.interpretation && (
        <p className="text-xs text-slate-700 leading-relaxed bg-amber-50/40 border-l-2 border-amber-300 pl-3 py-1">
          {profile.interpretation}
        </p>
      )}

      {profile.topics.length === 0 ? (
        <p className="text-xs text-slate-500">
          No se detectó ningún tema. Añada uno abajo o escriba un título o resumen más descriptivo.
        </p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {profile.topics.map(t => (
            <li key={t.category} className="inline-flex items-center gap-1.5 pl-2.5 pr-1 py-1 rounded-full text-xs bg-indigo-50 text-indigo-900 border border-indigo-200">
              <span className="font-semibold">{t.category}</span>
              <span className="text-indigo-500 tabular-nums">{Math.round(t.weight * 100)} %</span>
              <button
                type="button"
                onClick={() => remove(t.category)}
                aria-label={`Quitar el tema ${t.category}`}
                className="p-0.5 rounded-full hover:bg-indigo-200 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          list={listId}
          value={newTopic}
          onChange={e => setNewTopic(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder="Añadir una categoría de SCImago…"
          aria-label="Añadir una categoría de SCImago"
          className="flex-1 min-w-[200px] max-w-sm px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-800"
        />
        <datalist id={listId}>
          {categories.map(c => <option key={c} value={c} />)}
        </datalist>
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> Añadir
        </button>
        <span className="text-[11px] text-slate-500">
          Las revistas se ordenan según estos temas. Quite los que no correspondan.
        </span>
      </div>
    </section>
  );
};
