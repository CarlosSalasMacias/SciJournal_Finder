import { ManuscriptQuery, TopicProfile, TopicWeight } from '../types/journal';

/**
 * Interpretación del manuscrito con IA (Google Gemini, con la clave del propio usuario).
 *
 * La IA lee título, resumen y palabras clave, explica de qué trata el trabajo y elige las categorías
 * de SCImago más adecuadas (solo de la lista que se le entrega). El ranking de revistas sigue siendo
 * local y transparente: la IA solo decide los temas, que el usuario puede revisar y corregir.
 */

export interface AiSettings {
  apiKey: string;
  /** Modelo de Gemini. Por defecto, el alias «flash» más reciente. */
  model?: string;
}

export const DEFAULT_GEMINI_MODEL = 'gemini-flash-lite-latest';
const MAX_TOPICS = 6;

function buildPrompt(query: ManuscriptQuery, categories: string[]): string {
  const keywords = (query.keywords || []).filter(Boolean).join(', ');
  return [
    'You help researchers choose journals. Read the manuscript below and decide which Scopus/SCImago subject',
    'categories best describe its topic, as a journal editor would. Think about what the words MEAN in context:',
    'names of people, bands, artworks, places, organisms or technologies must be interpreted (e.g. a rock band is',
    'about music, not metallurgy). Consider the discipline, the object of study and the methods.',
    '',
    'Rules:',
    `- Choose 1 to ${MAX_TOPICS} categories, ONLY from the list below, copied exactly.`,
    '- weight: 1.0 for the core field, lower (0.3–0.9) for secondary or methodological fields.',
    '- Avoid "(miscellaneous)" categories unless nothing more specific fits.',
    '- keywords: 5 to 10 short English terms that would appear in the titles of suitable journals.',
    '- interpretation: one or two sentences in Spanish explaining what the manuscript is about and its field.',
    '',
    `Manuscript title: ${query.title || '(none)'}`,
    query.abstract ? `Abstract: ${query.abstract}` : '',
    keywords ? `Keywords: ${keywords}` : '',
    query.primaryDiscipline && query.primaryDiscipline !== 'Todas las disciplinas'
      ? `Broad discipline chosen by the author: ${query.primaryDiscipline}` : '',
    '',
    'Category list:',
    categories.join('; '),
  ].filter(line => line !== '').join('\n');
}

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    interpretation: { type: 'STRING' },
    categories: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: { name: { type: 'STRING' }, weight: { type: 'NUMBER' } },
        required: ['name', 'weight'],
      },
    },
    keywords: { type: 'ARRAY', items: { type: 'STRING' } },
  },
  required: ['interpretation', 'categories', 'keywords'],
};

interface RawAnswer {
  interpretation?: unknown;
  categories?: Array<{ name?: unknown; weight?: unknown }>;
  keywords?: unknown[];
}

/** Valida la respuesta: descarta categorías que no existen y normaliza pesos (el mayor = 1). */
export function parseAiAnswer(raw: RawAnswer, categories: string[], model: string): TopicProfile {
  const byLower = new Map(categories.map(c => [c.toLowerCase(), c]));
  const seen = new Set<string>();
  const topics: TopicWeight[] = [];
  for (const item of raw.categories ?? []) {
    const name = typeof item.name === 'string' ? byLower.get(item.name.trim().toLowerCase()) : undefined;
    if (!name || seen.has(name)) continue;
    seen.add(name);
    const w = typeof item.weight === 'number' && item.weight > 0 ? Math.min(1, item.weight) : 0.5;
    topics.push({ category: name, weight: w });
  }
  topics.sort((a, b) => b.weight - a.weight);
  const top = topics[0]?.weight ?? 1;
  return {
    source: 'ai',
    model,
    topics: topics.slice(0, MAX_TOPICS).map(t => ({ ...t, weight: Math.round((t.weight / top) * 100) / 100 })),
    extraTerms: (raw.keywords ?? []).filter((k): k is string => typeof k === 'string').slice(0, 12),
    interpretation: typeof raw.interpretation === 'string' ? raw.interpretation.trim() : undefined,
  };
}

export async function inferTopicsWithAI(
  query: ManuscriptQuery,
  categories: string[],
  settings: AiSettings,
  signal?: AbortSignal
): Promise<TopicProfile> {
  const model = settings.model?.trim() || DEFAULT_GEMINI_MODEL;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  // Si Gemini no responde en 60 s se cancela la petición.
  const timeout = AbortSignal.timeout(60000);
  const res = await fetch(url, {
    method: 'POST',
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': settings.apiKey.trim() },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: buildPrompt(query, categories) }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
      },
    }),
  });

  if (!res.ok) {
    let detail = '';
    try { detail = (await res.json())?.error?.message ?? ''; } catch { /* sin cuerpo */ }
    if (res.status === 400 && /api key/i.test(detail)) throw new Error('La clave de Gemini no es válida.');
    if (res.status === 403) throw new Error('La clave de Gemini no tiene permiso para este modelo.');
    if (res.status === 404) throw new Error(`El modelo «${model}» no existe o no está disponible.${detail ? ` (${detail.slice(0, 300)})` : ''}`);
    if (res.status === 429) {
      throw new Error(`Se alcanzó el límite de uso de Gemini para «${model}». Espere un minuto o pruebe otro modelo.${detail ? ` (${detail.slice(0, 300)})` : ''}`);
    }
    throw new Error(`Gemini respondió con un error (HTTP ${res.status})${detail ? `: ${detail}` : ''}.`);
  }

  const data = await res.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts
    ?.map((p: { text?: string }) => p.text ?? '').join('');
  if (!text) throw new Error('Gemini no devolvió ninguna respuesta.');
  let raw: RawAnswer;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error('La respuesta de Gemini no tiene el formato esperado.');
  }
  const profile = parseAiAnswer(raw, categories, model);
  if (profile.topics.length === 0) throw new Error('Gemini no propuso ninguna categoría válida.');
  return profile;
}
