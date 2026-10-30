/**
 * Evalúa la afinidad temática con el banco eval/queries.json.
 *
 *   npm run eval                 -> conjunto de ajuste (dev), detección por vocabulario
 *   npm run eval -- --set test   -> conjunto reservado (úselo solo para validar, no para ajustar)
 *   GEMINI_API_KEY=... npm run eval -- --ai   -> además, interpretación con IA (Gemini)
 *
 * Métricas por búsqueda:
 *   Tema@3  = alguno de los 3 primeros temas detectados es correcto.
 *   P@20 af = proporción de las 20 revistas más afines que pertenece a una categoría correcta.
 *   P@20 app= lo mismo con el orden que ve el usuario (tramos de coste + puntuación global).
 */
import fs from 'node:fs';
import { buildAllJournals, ScimagoDataset } from '../src/data/scimagoLoader';
import { VERIFIED_JOURNALS_DATA } from '../src/data/journalsData';
import { filterAndRankJournals, DEFAULT_FILTER_OPTIONS } from '../src/utils/filterJournals';
import { getTopicIndex, inferTopicsLexical, journalCategories } from '../src/utils/topicModel';
import { inferTopicsWithAI } from '../src/utils/aiTopics';
import { ManuscriptQuery, TopicProfile } from '../src/types/journal';

const args = process.argv.slice(2);
const set = args.includes('--set') ? args[args.indexOf('--set') + 1] : 'dev';
const useAI = args.includes('--ai');
const verbose = args.includes('--verbose');
const inGitHub = Boolean(process.env.GITHUB_ACTIONS);
/** En GitHub, los avisos se ven en la página del flujo sin abrir el registro. */
const annotate = (level: 'notice' | 'warning', msg: string) => { if (inGitHub) console.log(`::${level}::${msg}`); };
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

/** Llama a la IA con reintentos: el plan gratuito de Gemini limita las peticiones por minuto. */
async function aiProfile(query: ManuscriptQuery): Promise<TopicProfile> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await inferTopicsWithAI(query, index.categories, {
        apiKey: process.env.GEMINI_API_KEY!, model: process.env.GEMINI_MODEL || undefined,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      // Errores de configuración (clave o modelo): no tiene sentido reintentar.
      if (attempt >= 3 || /no es válida|permiso|no existe/i.test(msg)) throw err;
      const wait = /límite/i.test(msg) ? 20000 : 3000;
      console.log(`   reintento ${attempt} en ${wait / 1000} s: ${msg}`);
      await sleep(wait);
    }
  }
}

const dataset = JSON.parse(fs.readFileSync('public/data/scimago-2025.json', 'utf8')) as ScimagoDataset;
const journals = buildAllJournals(dataset, VERIFIED_JOURNALS_DATA);
const index = getTopicIndex(journals);
const { queries } = JSON.parse(fs.readFileSync('eval/queries.json', 'utf8'));

const base: ManuscriptQuery = {
  title: '', abstract: '', keywords: [], primaryDiscipline: 'Todas las disciplinas', articleType: 'Investigación original',
  language: 'Ambos', accessPreference: 'all', acceptableQuartiles: ['Q1', 'Q2', 'Q3'], maxBudgetUSD: 500,
  preferFormatFree: true, excludeOverBudget: false, excludeUnverifiedCosts: false, strictRequirementsOnly: false, authorRegion: 'none',
};

async function run(mode: 'lexical' | 'ai') {
  let hit = 0, pAff = 0, pApp = 0, n = 0, failed = 0;
  for (const q of queries.filter((x: { set: string }) => x.set === set)) {
    const gold = new Set<string>(q.gold.map((g: string) => g.toLowerCase()));
    const query: ManuscriptQuery = { ...base, title: q.title, abstract: q.abstract ?? '' };
    let profile: TopicProfile;
    if (mode === 'ai') {
      try {
        profile = await aiProfile(query);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.log(`${q.id} ERROR IA: ${msg}`);
        annotate('warning', `${q.id}: ${msg}`);
        failed++;
        // Si las dos primeras fallan, el problema es la clave, el modelo o la cuota: no vale la pena seguir.
        if (failed >= 2 && failed === n + 1) {
          annotate('warning', 'Se detiene la evaluación con IA: las primeras búsquedas fallaron.');
          throw new Error(`Evaluación con IA detenida: ${msg}`);
        }
        // Cuenta como fallo (0) para no inflar el resultado.
        n++;
        continue;
      }
      await sleep(4500); // ~13 peticiones por minuto como máximo
    } else {
      profile = inferTopicsLexical(query, index);
    }
    const withProfile = { ...query, topicProfile: profile };
    const isRel = (cats: string[]) => cats.some(c => gold.has(c.toLowerCase()));

    const byAffinity = filterAndRankJournals(journals, withProfile, {
      ...DEFAULT_FILTER_OPTIONS, costPriorityMode: 'under_500_all', sortBy: 'affinity',
    }).slice(0, 20);
    const app = filterAndRankJournals(journals, withProfile, DEFAULT_FILTER_OPTIONS).slice(0, 20);

    const h = profile.topics.slice(0, 3).some(t => gold.has(t.category.toLowerCase())) ? 1 : 0;
    const a = byAffinity.filter(r => isRel(journalCategories(r.journal))).length / 20;
    const b = app.filter(r => isRel(journalCategories(r.journal))).length / 20;
    hit += h; pAff += a; pApp += b; n++;
    const line = `${q.id} tema@3=${h} P@20app=${b.toFixed(2)} | ${profile.topics.slice(0, 3).map(t => t.category).join('; ')}`;
    console.log(line.replace(' P@20app', ` P@20af=${a.toFixed(2)} P@20app`));
    if (mode === 'ai') annotate('notice', `${line}${profile.interpretation ? ` | ${profile.interpretation}` : ''}`);
    if (verbose) console.log('   ', app.slice(0, 5).map(r => r.journal.title).join(' | '));
  }
  const summary = `[${mode}] ${set} (${n} búsquedas${failed ? `, ${failed} con error de IA` : ''}): Tema@3 ${(hit / n * 100).toFixed(0)} %  P@20 afinidad ${(pAff / n * 100).toFixed(0)} %  P@20 app ${(pApp / n * 100).toFixed(0)} %`;
  console.log(`\n${summary}\n`);
  annotate('notice', summary);
}

await run('lexical');
if (useAI) {
  if (!process.env.GEMINI_API_KEY) throw new Error('Falta GEMINI_API_KEY');
  await run('ai');
}
