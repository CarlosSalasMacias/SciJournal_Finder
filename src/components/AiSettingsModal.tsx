import React, { useState } from 'react';
import { X, Sparkles, ExternalLink, ShieldAlert, CheckCircle2, AlertTriangle, Loader2, ClipboardPaste } from 'lucide-react';
import { useEscapeKey } from '../utils/useEscapeKey';
import { StoredAiSettings } from '../utils/aiSettingsStore';
import { DEFAULT_GEMINI_MODEL, testGeminiKey } from '../utils/aiTopics';

interface AiSettingsModalProps {
  settings: StoredAiSettings;
  onSave: (settings: StoredAiSettings) => void;
  onClose: () => void;
}

const AI_STUDIO_URL = 'https://aistudio.google.com/apikey';

type Status = { kind: 'idle' } | { kind: 'testing' } | { kind: 'ok' } | { kind: 'error'; message: string };

/** Guía para crear una clave gratuita de Gemini, pegarla y comprobarla. */
export const AiSettingsModal: React.FC<AiSettingsModalProps> = ({ settings, onSave, onClose }) => {
  useEscapeKey(onClose);
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [model, setModel] = useState(settings.model);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const key = apiKey.trim().replace(/\s+/g, '');
  const looksOdd = key !== '' && !key.startsWith('AIza');

  const paste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) { setApiKey(text.trim()); setStatus({ kind: 'idle' }); }
    } catch {
      setStatus({ kind: 'error', message: 'El navegador no permitió pegar automáticamente. Haga clic en el recuadro y pulse Ctrl+V (o Cmd+V en Mac).' });
    }
  };

  const testAndSave = async () => {
    if (!key) return;
    setStatus({ kind: 'testing' });
    const error = await testGeminiKey(key, model.trim() || DEFAULT_GEMINI_MODEL);
    if (error) { setStatus({ kind: 'error', message: error }); return; }
    setStatus({ kind: 'ok' });
    onSave({ enabled: true, apiKey: key, model: model.trim() });
    setTimeout(onClose, 1200);
  };

  const handleRemove = () => {
    onSave({ enabled: false, apiKey: '', model: '' });
    onClose();
  };

  const step = (n: number, title: string, body: React.ReactNode) => (
    <li className="flex gap-3">
      <span className="shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">{n}</span>
      <div className="pt-0.5">
        <p className="font-semibold text-slate-900">{title}</p>
        <div className="text-slate-600 mt-0.5">{body}</div>
      </div>
    </li>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden"
        role="dialog"
        aria-labelledby="ai-settings-title"
        aria-modal="true"
      >
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <h2 id="ai-settings-title" className="text-sm font-bold">Activar la interpretación con IA</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
          <p>
            La IA lee el título y el resumen y entiende su significado (por ejemplo, que «Iron Maiden» es una banda de
            música y no un tema de metales). Es <strong>opcional y gratuita</strong>: la app funciona sin ella.
          </p>
          <p className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            Solo hay que hacerlo <strong>una vez</strong> (unos 2 minutos). Necesita una cuenta de Google (sirve su
            Gmail). <strong>No se pide tarjeta de crédito.</strong>
          </p>

          <ol className="space-y-3">
            {step(1, 'Abra Google AI Studio', (
              <>
                <a
                  href={AI_STUDIO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center px-3 py-1.5 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Abrir Google AI Studio <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>
                <span className="block mt-1">Se abre en otra pestaña. Inicie sesión con su cuenta de Google si se lo pide.</span>
              </>
            ))}
            {step(2, 'Acepte las condiciones (solo la primera vez)', 'Marque la casilla y pulse «Continuar» o «Accept».')}
            {step(3, 'Pulse «Create API key» (Crear clave de API)', 'Si le pide elegir un proyecto, acepte el que aparece o cree uno con cualquier nombre.')}
            {step(4, 'Copie la clave', 'Pulse el botón de copiar junto a la clave. Es un texto largo que suele empezar por «AIza».')}
            {step(5, 'Vuelva a esta pestaña, péguela y pulse «Comprobar y guardar»', null)}
          </ol>

          <div>
            <label htmlFor="gemini-key" className="font-semibold text-slate-800">Su clave de Gemini</label>
            <div className="mt-1 flex gap-2">
              <input
                id="gemini-key"
                type="password"
                autoComplete="off"
                spellCheck={false}
                value={apiKey}
                onChange={e => { setApiKey(e.target.value); setStatus({ kind: 'idle' }); }}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); testAndSave(); } }}
                placeholder="Pegue aquí la clave (AIza…)"
                className="flex-1 min-w-0 px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs focus:ring-1 focus:ring-slate-800"
              />
              <button
                type="button"
                onClick={paste}
                className="shrink-0 inline-flex items-center px-3 py-2 rounded-lg font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 cursor-pointer"
              >
                <ClipboardPaste className="w-3.5 h-3.5 mr-1" /> Pegar
              </button>
            </div>
            {looksOdd && status.kind === 'idle' && (
              <p className="mt-1 text-amber-700">Esta clave no empieza por «AIza». Compruebe que copió la clave completa.</p>
            )}
            {status.kind === 'testing' && (
              <p className="mt-2 flex items-center text-slate-600"><Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> Comprobando con Google…</p>
            )}
            {status.kind === 'ok' && (
              <p role="status" className="mt-2 flex items-center text-emerald-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 mr-1" /> ¡Listo! La IA quedó activada en este navegador.
              </p>
            )}
            {status.kind === 'error' && (
              <p role="alert" className="mt-2 flex items-start text-red-700">
                <AlertTriangle className="w-3.5 h-3.5 mr-1 mt-0.5 shrink-0" /> {status.message}
              </p>
            )}
          </div>

          <details className="text-slate-600">
            <summary className="cursor-pointer font-semibold text-slate-700">Preguntas frecuentes</summary>
            <ul className="mt-2 space-y-1.5 list-disc pl-4">
              <li><strong>¿Cuesta dinero?</strong> No. El plan gratuito de Google alcanza de sobra para buscar revistas. Si se alcanza el límite, espere unos minutos o siga sin IA.</li>
              <li><strong>¿Dónde se guarda la clave?</strong> Solo en este navegador. No se envía a ningún servidor salvo a Google. Si usa otro equipo o navegador, deberá pegarla de nuevo.</li>
              <li><strong>¿Puedo desactivarla?</strong> Sí, con la casilla «Interpretar con IA», o borrando la clave aquí abajo.</li>
            </ul>
            <label className="block mt-3">
              <span className="font-semibold text-slate-800">Modelo (avanzado, opcional)</span>
              <input
                type="text"
                value={model}
                onChange={e => setModel(e.target.value)}
                placeholder={DEFAULT_GEMINI_MODEL}
                className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs focus:ring-1 focus:ring-slate-800"
              />
            </label>
          </details>

          <div className="flex gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              Con la IA activada, el título, el resumen y las palabras clave se envían a Google. En el plan gratuito,
              Google puede usar ese texto para mejorar sus productos: no la use con manuscritos confidenciales.
            </p>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between gap-2">
          {settings.apiKey ? (
            <button type="button" onClick={handleRemove} className="text-xs text-slate-500 hover:text-red-700 underline cursor-pointer">
              Borrar clave
            </button>
          ) : <span />}
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 cursor-pointer">
              Cancelar
            </button>
            <button
              type="button"
              onClick={testAndSave}
              disabled={!key || status.kind === 'testing'}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Comprobar y guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
