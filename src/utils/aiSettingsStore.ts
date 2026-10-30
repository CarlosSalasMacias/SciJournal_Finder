/** Preferencias de IA guardadas solo en este navegador. */
export interface StoredAiSettings {
  enabled: boolean;
  apiKey: string;
  model: string;
}

const KEY = 'scijournal.ai.v1';
export const EMPTY_AI_SETTINGS: StoredAiSettings = { enabled: false, apiKey: '', model: '' };

export function loadAiSettings(): StoredAiSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY_AI_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      enabled: Boolean(parsed.enabled),
      apiKey: typeof parsed.apiKey === 'string' ? parsed.apiKey : '',
      model: typeof parsed.model === 'string' ? parsed.model : '',
    };
  } catch {
    return EMPTY_AI_SETTINGS;
  }
}

export function saveAiSettings(settings: StoredAiSettings): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    /* navegación privada o almacenamiento bloqueado: se usa solo durante la sesión */
  }
}
