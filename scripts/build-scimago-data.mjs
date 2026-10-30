#!/usr/bin/env node
/**
 * Convierte el CSV de SCImago (data/raw/scimagojr_2025.csv) en un JSON compacto
 * que la app carga en el navegador (public/data/scimago-2025.json).
 *
 * Solo se conservan revistas (Type = journal) con mejor cuartil Q1, Q2 o Q3.
 * Uso: npm run data
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const INPUT = resolve(root, process.argv[2] ?? 'data/raw/scimagojr_2025.csv');
const OUTPUT = resolve(root, 'public/data/scimago-2025.json');
const SJR_YEAR = 2025;

/** Parser CSV mínimo: separador «;», campos entre comillas con "" escapadas. */
function parseCsv(text, sep = ';') {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === sep) { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.length > 1 || row[0] !== '') rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const formatIssn = s => (s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4)}` : s);
const toNumber = s => {
  const n = Number(String(s).replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
};
const QUARTILE_CODE = { Q1: 1, Q2: 2, Q3: 3, Q4: 4 };

const raw = readFileSync(INPUT, 'utf8').replace(/^﻿/, '');
const [header, ...records] = parseCsv(raw);

// La columna «Publisher» aparece dos veces; usamos la primera aparición de cada nombre.
const col = name => {
  const idx = header.indexOf(name);
  if (idx === -1) throw new Error(`Columna no encontrada en el CSV: ${name}`);
  return idx;
};
const C = {
  sourceId: col('Sourceid'), title: col('Title'), type: col('Type'), issn: col('Issn'),
  publisher: col('Publisher'), oa: col('Open Access'), diamond: col('Open Access Diamond'),
  sjr: col('SJR'), best: col('SJR Best Quartile'), h: col('H index'), country: col('Country'),
  categories: col('Categories'), areas: col('Areas'),
};

const categoryIndex = new Map();
const areaIndex = new Map();
const indexOf = (map, key) => {
  if (!map.has(key)) map.set(key, map.size);
  return map.get(key);
};

const journals = [];
for (const r of records) {
  if (r[C.type] !== 'journal') continue;
  if (!['Q1', 'Q2', 'Q3'].includes(r[C.best])) continue;

  const issns = r[C.issn].split(',').map(s => s.trim()).filter(s => s && s !== '-').map(formatIssn);

  // «Hematology (Q1); Oncology (Q2)» -> [catIdx * 10 + cuartil]
  const cats = r[C.categories].split(';').map(s => s.trim()).filter(Boolean).map(entry => {
    const m = entry.match(/^(.*?)\s*\((Q[1-4])\)$/);
    const name = m ? m[1] : entry;
    return indexOf(categoryIndex, name) * 10 + (m ? QUARTILE_CODE[m[2]] : 0);
  });
  const areas = r[C.areas].split(';').map(s => s.trim()).filter(Boolean).map(a => indexOf(areaIndex, a));

  const flags = (r[C.oa] === 'Yes' ? 1 : 0) | (r[C.diamond] === 'Yes' ? 2 : 0);
  journals.push([
    Number(r[C.sourceId]),
    r[C.title],
    issns.join(','),
    r[C.publisher],
    flags,
    toNumber(r[C.sjr]),
    toNumber(r[C.h]),
    r[C.country],
    cats,
    areas,
  ]);
}

const out = {
  source: 'SCImago Journal & Country Rank',
  year: SJR_YEAR,
  generatedAt: new Date().toISOString().slice(0, 10),
  fields: ['sourceId', 'title', 'issns', 'publisher', 'flags(1=OA,2=Diamante)', 'sjr', 'hIndex', 'country', 'categories(idx*10+cuartil)', 'areas'],
  categories: [...categoryIndex.keys()],
  areas: [...areaIndex.keys()],
  journals,
};

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, JSON.stringify(out));
console.log(`OK: ${journals.length} revistas Q1–Q3 -> ${OUTPUT}`);
