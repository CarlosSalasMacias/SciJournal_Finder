# SciJournal Finder

Recomendador de revistas científicas Q1–Q3 para un manuscrito. Prioriza la **afinidad temática** y el
**menor coste de publicación (APC)** sin bajar de Q3, y explica cada posición del ranking.

## Qué hace

1. El investigador escribe el título (y, si quiere, el resumen y las palabras clave), la disciplina,
   el tipo de artículo, el idioma y su presupuesto máximo.
2. La app evalúa todas las revistas de la base y calcula para cada una:
   - **Afinidad temática**: disciplina, tipo de artículo, idioma y coincidencia de términos con el
     alcance y las categorías de la revista (con glosario español→inglés).
   - **Coste final estimado**: APC − descuentos automáticos + cargos obligatorios. Las exenciones que
     hay que solicitar se muestran aparte y no se restan.
   - **Puntuación global** ponderada (afinidad, cuartil, coste, formato libre y verificación). Los pesos
     se pueden cambiar en «Ponderaciones».
3. Ordena por tramos de coste (sin APC → dentro del presupuesto → solo con exención → coste sin
   verificar) y, dentro de cada tramo, por puntuación.

## Datos

| Fuente | Revistas | Qué está verificado |
|---|---|---|
| `src/data/journalsData.ts` (fichas revisadas a mano) | 20 | APC, descuentos, formato de envío, idiomas, enlaces |
| SCImago Journal & Country Rank 2025 (fichas automáticas) | ~24.000 (Q1–Q3) | Cuartil por categoría, SJR, índice H, país, área, acceso abierto / Diamante |

Si una revista está en las dos fuentes, se usa la ficha revisada (coincidencia por ISSN).

### Actualizar SCImago

1. Descargue el CSV desde <https://www.scimagojr.com/journalrank.php> (botón «Download data»).
2. Guárdelo como `data/raw/scimagojr_2025.csv` (o pase otra ruta al script).
3. Ejecute:

```bash
npm run data
```

Esto regenera `public/data/scimago-2025.json`, el archivo que descarga la app. Si cambia de año,
actualice también el nombre del archivo en `scripts/build-scimago-data.mjs` y `src/data/scimagoLoader.ts`.

## Desarrollo

Requisitos: Node.js 22 o superior.

```bash
npm install
```

```bash
npm run dev
```

Otros comandos:

- `npm test`: pruebas de las reglas de coste, afinidad, filtros y orden.
- `npm run lint`: comprobación de tipos con TypeScript.
- `npm run build`: genera la versión publicable en `dist/`.

## Publicación en GitHub Pages

El flujo `.github/workflows/deploy.yml` instala, ejecuta las pruebas, compila y publica en cada push a
`main`. En el repositorio, active **Settings → Pages → Source: GitHub Actions** la primera vez.

## Estructura

```
scripts/build-scimago-data.mjs   CSV de SCImago -> JSON compacto
src/data/journalsData.ts         Fichas revisadas a mano
src/data/scimagoLoader.ts        Carga el JSON y lo convierte en fichas
src/utils/costCalculator.ts      Coste final estimado
src/utils/affinityMatcher.ts     Afinidad temática
src/utils/rankingScorer.ts       Puntuación global ponderada
src/utils/filterJournals.ts      Filtros y orden
src/components/                  Interfaz (React + Tailwind)
```
