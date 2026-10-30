import React, { useState } from 'react';
import { X, Sparkles, ExternalLink, ShieldAlert } from 'lucide-react';
import { useEscapeKey } from '../utils/useEscapeKey';
import { StoredAiSettings } from '../utils/aiSettingsStore';
import { DEFAULT_GEMINI_MODEL } from '../utils/aiTopics';

interface AiSettingsModalProps {
  settings: StoredAiSettings;
  onSave: (settings: StoredAiSettings) => void;
  onClose: () => void;
}

export const AiSettingsModal: React.FC<AiSettingsModalProps> = ({ settings, onSave, onClose }) => {
  useEscapeKey(onClose);
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [model, setModel] = useState(settings.model);

  const handleSave = () => {
    onSave({ enabled: apiKey.trim() !== '', apiKey: apiKey.trim(), model: model.trim() });
    onClose();
  };

  const handleRemove = () => {
    onSave({ enabled: false, apiKey: '', model: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden"
        role="dialog"
        aria-labelledby="ai-settings-title"
        aria-modal="true"
      >
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <h2 id="ai-settings-title" className="text-sm font-bold">Interpretación con IA (Gemini)</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
          <p>
            Sin IA, la app detecta los temas por el vocabulario del título y el resumen. Con IA, Gemini lee el
            manuscrito, entiende su significado (por ejemplo, que «Iron Maiden» es una banda de heavy metal y no un
            tema de metalurgia) y elige las categorías de SCImago. El ranking de revistas se sigue calculando en su
            navegador y usted puede corregir los temas.
          </p>

          <ol className="list-decimal pl-4 space-y-1">
            <li>
              Cree una clave gratuita en{' '}
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-700 underline inline-flex items-center">
                Google AI Studio <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>.
            </li>
            <li>Péguela aquí y guarde.</li>
          </ol>

          <label className="block">
            <span className="font-semibold text-slate-800">Clave de API de Gemini</span>
            <input
              type="password"
              autoComplete="off"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="AIza…"
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs focus:ring-1 focus:ring-slate-800"
            />
          </label>

          <label className="block">
            <span className="font-semibold text-slate-800">Modelo (opcional)</span>
            <input
              type="text"
              value={model}
              onChange={e => setModel(e.target.value)}
              placeholder={DEFAULT_GEMINI_MODEL}
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs focus:ring-1 focus:ring-slate-800"
            />
          </label>

          <div className="flex gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p>
                El título, el resumen y las palabras clave se envían a Google en cada búsqueda. En el plan gratuito,
                Google puede usar ese texto para mejorar sus productos: no active la IA con manuscritos confidenciales.
              </p>
              <p>La clave se guarda solo en este navegador. No se envía a ningún otro servidor.</p>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between">
          <button type="button" onClick={handleRemove} className="text-xs text-slate-500 hover:text-red-700 underline cursor-pointer">
            Borrar clave
          </button>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 cursor-pointer">
              Cancelar
            </button>
            <button type="button" onClick={handleSave} className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 cursor-pointer">
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
