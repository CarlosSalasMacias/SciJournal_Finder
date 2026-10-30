/**
 * Utilidades de texto: normalización, raíces de 6 letras y glosario español -> inglés.
 * Las categorías de SCImago y la mayoría de títulos de revistas están en inglés; el glosario permite
 * que un manuscrito en español encuentre su vocabulario equivalente.
 */

/** Longitud máxima de una raíz tras quitar sufijos. */
export const STEM_LENGTH = 7;

// Sufijos frecuentes en inglés y español, del más largo al más corto.
const SUFFIXES = [
  'izations', 'ization', 'aciones', 'iciones', 'amiento', 'imiento', 'ational', 'fulness', 'ousness', 'iveness',
  'idades', 'ations', 'ically', 'acion', 'icion', 'ation', 'ments', 'mente', 'ities', 'idad', 'ment', 'ness',
  'ings', 'ists', 'isms', 'istas', 'ista', 'ismos', 'ismo', 'ables', 'able', 'ibles', 'ible', 'ical', 'ally',
  'icos', 'icas', 'ales', 'ores', 'ing', 'ist', 'ism', 'ics', 'ies', 'ied', 'ers', 'ico', 'ica', 'ity', 'ive',
  'ous', 'ic', 'er', 'ed', 'es', 'os', 'as', 'al', 'or', 'ly', 's', 'a', 'o', 'e', 'y',
];

/** Raíz ligera común a inglés y español: education, educational, educación -> «educ». */
export function stemWord(word: string): string {
  let w = word;
  for (let pass = 0; pass < 2; pass++) {
    const suffix = SUFFIXES.find(s => w.endsWith(s) && w.length - s.length >= 4);
    if (!suffix) break;
    w = w.slice(0, -suffix.length);
  }
  return w.slice(0, STEM_LENGTH);
}

export const STOP_WORDS = new Set([
  // español
  'para', 'como', 'entre', 'sobre', 'desde', 'hasta', 'hacia', 'este', 'esta', 'estos', 'estas', 'esto',
  'estudio', 'estudios', 'investigacion', 'investigaciones', 'analisis', 'articulo', 'mediante', 'segun',
  'cual', 'cuales', 'donde', 'tambien', 'otros', 'otras', 'otro', 'otra', 'nuevo', 'nueva', 'nuevos', 'nuevas',
  'del', 'las', 'los', 'una', 'uno', 'unos', 'unas', 'por', 'con', 'sin', 'que', 'sus', 'mas', 'muy', 'ante',
  'bajo', 'tras', 'durante', 'cada', 'caso', 'casos', 'efecto', 'efectos', 'impacto', 'papel', 'uso',
  'propuesta', 'revision', 'sistematica', 'aplicacion', 'evaluacion', 'desarrollo', 'factores', 'relacion',
  'influencia', 'contexto', 'perspectiva', 'hacia', 'partir', 'traves', 'parte', 'sus', 'han', 'ser', 'son',
  'revista', 'revistas', 'ciencia', 'ciencias', 'cientifica', 'cientifico',
  // inglés
  'with', 'from', 'about', 'study', 'studies', 'analysis', 'using', 'based', 'approach', 'into', 'their',
  'this', 'that', 'these', 'those', 'between', 'among', 'through', 'during', 'under', 'over', 'its',
  'and', 'the', 'for', 'are', 'was', 'were', 'has', 'have', 'been', 'not', 'but', 'how', 'why', 'what',
  'effect', 'effects', 'impact', 'role', 'case', 'new', 'review', 'evaluation', 'assessment', 'application',
  'applications', 'toward', 'towards', 'evidence', 'perspective', 'perspectives', 'proposal',
  'journal', 'revue', 'zeitschrift', 'research', 'international', 'general', 'miscellaneous',
  'other', 'annals', 'archives', 'bulletin', 'proceedings', 'transactions', 'letters', 'reports',
  'advances', 'frontiers', 'current', 'open', 'acta', 'science', 'sciences', 'scientific', 'studies',
]);

/**
 * Glosario español -> inglés (clave: palabra sin tildes o sus 6 primeras letras).
 * Vocabulario general por áreas; no está ajustado a ninguna búsqueda concreta.
 */
export const ES_EN_GLOSSARY: Record<string, string> = {
  // Educación
  educac: 'education', aprend: 'learning', ensena: 'teaching', docenc: 'teaching', docent: 'teacher teaching',
  profes: 'teacher teachers', pedago: 'pedagogy education', didact: 'didactics teaching', curric: 'curriculum',
  escola: 'school', escuel: 'school', univer: 'university higher education', superi: 'higher',
  estudi: 'student students', alumno: 'student students', aula: 'classroom', virtua: 'virtual online',
  gamifi: 'gamification game games', juego: 'game games play', juegos: 'games', lectur: 'reading literacy',
  escrit: 'writing', alfabe: 'literacy', infant: 'early childhood child children', inclus: 'inclusion inclusive',
  compet: 'competence competencies skills', habili: 'skills', formac: 'training education', tutori: 'tutoring',
  calida: 'quality', evalua: 'assessment evaluation',
  // Salud
  salud: 'health', medici: 'medicine medical', medico: 'medical', clinic: 'clinical', pacien: 'patient patients',
  enferm: 'nursing nurse', enfermedad: 'disease', enfermedades: 'diseases disease', pediat: 'pediatrics pediatric', epidem: 'epidemiology',
  vacuna: 'vaccine vaccination', oncolo: 'oncology cancer', cancer: 'cancer oncology', tumor: 'tumor cancer',
  tumore: 'tumors cancer', cardio: 'cardiology cardiovascular heart', corazo: 'heart cardiac',
  hipert: 'hypertension blood pressure', arteri: 'arterial vascular', psicol: 'psychology psychological',
  psiqui: 'psychiatry psychiatric mental', mental: 'mental', farmac: 'pharmacology pharmacy drug',
  medicamento: 'drug medication', medicamentos: 'drugs medication', odonto: 'dentistry dental', dental: 'dental dentistry', caries: 'caries dental',
  bucal: 'oral dental', veteri: 'veterinary', nutric: 'nutrition', dieta: 'diet nutrition',
  alimen: 'food nutrition', primar: 'primary', atenci: 'care', cuidad: 'care caregivers',
  hospit: 'hospital', diagno: 'diagnosis diagnostic', terapi: 'therapy', tratam: 'treatment therapy',
  respir: 'respiratory', pulmon: 'pulmonary lung', infecc: 'infectious infection',
  diabet: 'diabetes', obesid: 'obesity', ansied: 'anxiety', depres: 'depression', estres: 'stress',
  conducta: 'behavior behaviour', conductas: 'behaviors behaviour', cognit: 'cognitive cognition', emocio: 'emotion emotional',
  quirur: 'surgery surgical', cirugi: 'surgery surgical', rehabi: 'rehabilitation', deport: 'sport sports',
  ejerci: 'exercise', entren: 'training exercise', fuerza: 'strength',
  futbol: 'football soccer sport', atleta: 'athletes sport', fisiot: 'physiotherapy physical therapy',
  public: 'public', renal: 'kidney renal', rinon: 'kidney renal', higado: 'liver hepatic', hepati: 'hepatic liver',
  cerebr: 'brain cerebral', neurol: 'neurology neurological', demenc: 'dementia', alzhei: 'alzheimer dementia',
  parkin: 'parkinson', sangre: 'blood', piel: 'skin dermatology', ojo: 'eye', ocular: 'eye ophthalmology',
  embara: 'pregnancy pregnant', materna: 'maternal', matern: 'maternal', parto: 'birth childbirth obstetric',
  neonat: 'neonatal newborn', ancian: 'older elderly aging',
  mayore: 'older adults', ortope: 'orthopedic', hueso: 'bone', oseo: 'bone',
  muscul: 'muscle muscular', dolor: 'pain', anesti: 'anesthesia', urgenc: 'emergency', emerge: 'emergency',
  intens: 'intensive', virus: 'virus viral', viral: 'viral virus', bacter: 'bacteria bacterial',
  antimi: 'antimicrobial', antibi: 'antibiotic', resist: 'resistance', toxic: 'toxicity toxic',
  ocupac: 'occupational', laboral: 'occupational work labour', sanita: 'health care',
  // Psicología y sociedad
  psicop: 'psychopathology', persona: 'personality', bienes: 'wellbeing well-being', felici: 'happiness',
  autoes: 'self-esteem', violen: 'violence', acoso: 'bullying harassment', suicid: 'suicide',
  adicci: 'addiction', drogas: 'drugs substance', alcoho: 'alcohol', sociol: 'sociology social',
  social: 'social', socied: 'society social', politi: 'political politics policy', polici: 'police policing',
  derech: 'law rights legal', juridi: 'law legal', justic: 'justice', tribun: 'court courts',
  penal: 'criminal penal', crimin: 'criminology crime', delito: 'crime',
  elecci: 'elections electoral', democr: 'democracy democratic', poblac: 'population',
  indige: 'indigenous', etnico: 'ethnic', racism: 'racism', migrac: 'migration migrants', migran: 'migrants migration',
  genero: 'gender', mujer: 'women gender', mujere: 'women gender', femini: 'feminist gender', sexual: 'sexual sexuality',
  infanc: 'child children childhood', nino: 'child children', ninos: 'children', ninas: 'girls children',
  adoles: 'adolescent adolescents youth', joven: 'youth young', jovene: 'youth young', juvent: 'youth',
  famili: 'family', trabaj: 'work labor', empleo: 'employment labour', pobrez: 'poverty',
  desigu: 'inequality', desarr: 'development', sosten: 'sustainability sustainable', rural: 'rural',
  urbano: 'urban', urbana: 'urban', ciudad: 'urban city cities', territ: 'territory territorial regional',
  region: 'regional', demogr: 'demography demographic', religi: 'religion religious', iglesi: 'church religion',
  teolog: 'theology religion', catoli: 'catholic religion', etica: 'ethics', moral: 'moral ethics',
  redes: 'networks social media', comuni: 'communication community', period: 'journalism',
  medios: 'media', publici: 'advertising marketing', propag: 'propaganda',
  cultur: 'cultural culture', identi: 'identity', antrop: 'anthropology', etnogr: 'ethnography',
  geogra: 'geography', paisaj: 'landscape', patrim: 'heritage', turism: 'tourism tourist', turist: 'tourism tourist',
  hotel: 'hospitality hotel', gastro: 'gastronomy food culinary', ocio: 'leisure',
  // Economía y empresa
  econom: 'economics economic economy', financ: 'finance financial', finanz: 'finance financial',
  banco: 'bank banking', bancar: 'banking', credit: 'credit', microf: 'microfinance finance credit',
  empres: 'business firms management', empren: 'entrepreneurship',
  gestio: 'management', admini: 'administration management', contab: 'accounting', audito: 'auditing',
  tribut: 'tax taxation', impues: 'tax taxation', fiscal: 'fiscal tax', merca: 'market marketing',
  mercad: 'market marketing', consum: 'consumer consumption', compra: 'purchase consumer', ventas: 'sales',
  marca: 'brand', clien: 'customer', client: 'customer', innova: 'innovation',
  organi: 'organizational organization', lidera: 'leadership', recurs: 'resources', humano: 'human',
  comerc: 'trade commerce', export: 'export trade', indust: 'industrial industry',
  sumini: 'supply chain', logist: 'logistics', cadena: 'chain', agroal: 'agri-food food', telet: 'telework remote work',
  // Humanidades y artes
  histor: 'history historical', filoso: 'philosophy', lingui: 'linguistics', lengua: 'language',
  idioma: 'language', traduc: 'translation', litera: 'literature literary',
  novela: 'novel fiction literature', poesia: 'poetry', poeta: 'poet poetry', teatro: 'theatre theater drama',
  dramat: 'drama theatre', arte: 'art arts', artes: 'arts', artist: 'artist art', pintur: 'painting art',
  mural: 'mural painting art', museo: 'museum', musica: 'music musical', music: 'music', cancio: 'song songs music',
  banda: 'band music', rock: 'rock music', metal: 'metal', danza: 'dance', baile: 'dance', cine: 'film cinema',
  pelicu: 'film cinema', audiov: 'audiovisual', fotogr: 'photography', arquit: 'architecture',
  arqueo: 'archaeology archeology', funera: 'funerary burial', ritual: 'ritual', mitolo: 'mythology',
  clasic: 'classical', medieval: 'medieval', mediev: 'medieval', colonia: 'colonial',
  revolu: 'revolution', guerra: 'war', nacion: 'nation national', escena: 'stage theatre performance',
  // Agro, biología y ambiente
  agricu: 'agriculture agricultural', agrono: 'agronomy', cultiv: 'crop crops cultivation', cosech: 'harvest crop',
  suelo: 'soil', suelos: 'soil soils', riego: 'irrigation', fertil: 'fertilizer fertility', semill: 'seed seeds',
  maiz: 'maize corn', trigo: 'wheat', arroz: 'rice', cafe: 'coffee', cacao: 'cocoa', frutal: 'fruit',
  fruta: 'fruit', hortal: 'vegetables horticulture', ganado: 'cattle livestock', bovino: 'cattle bovine',
  porcin: 'pig swine', aviar: 'poultry avian', pollo: 'chicken poultry', pollos: 'chickens poultry broiler',
  gallin: 'hens poultry', leche: 'milk dairy', lacteo: 'dairy', carne: 'meat', pesca: 'fisheries fishing',
  peces: 'fish', pez: 'fish', acuicu: 'aquaculture', agua: 'water', aguas: 'water', rio: 'river', rios: 'rivers',
  lago: 'lake', mar: 'sea marine', marino: 'marine', marina: 'marine', oceano: 'ocean', costa: 'coastal',
  coster: 'coastal', ambien: 'environmental environment', contam: 'pollution contamination', residu: 'waste',
  ecolog: 'ecology ecological', ecosis: 'ecosystem', biodiv: 'biodiversity', especi: 'species',
  conser: 'conservation', bosque: 'forest forestry', forest: 'forestry forest', selva: 'forest tropical',
  clima: 'climate', climat: 'climate', glacia: 'glacier', lluvia: 'rainfall precipitation',
  sequia: 'drought', incend: 'fire wildfire', polini: 'pollinators pollination', insect: 'insects insect',
  abeja: 'bees', plaga: 'pest pests', planta: 'plant plants', plantas: 'plant plants', botani: 'botany plant',
  arbol: 'tree trees', zoolog: 'zoology', animal: 'animal animals', aves: 'birds', mamife: 'mammals',
  biolog: 'biology biological', geneti: 'genetics genetic', genomi: 'genomics genomic', gen: 'gene genes',
  molecu: 'molecular', celula: 'cell cellular', microb: 'microbiology microbial', inmuno: 'immunology immune',
  neuron: 'neural neuroscience', evoluc: 'evolution evolutionary', marcad: 'markers',
  // Ciencias exactas y tierra
  energi: 'energy', renova: 'renewable', solar: 'solar', eolica: 'wind', quimic: 'chemistry chemical',
  fisica: 'physics', matema: 'mathematics mathematical', estadi: 'statistics statistical', probab: 'probability',
  geolog: 'geology geological', minera: 'mining mineral', mineri: 'mining', mercur: 'mercury', oro: 'gold',
  aurife: 'gold mining', petrol: 'petroleum oil', sismo: 'earthquake seismic', sismic: 'seismic earthquake',
  volcan: 'volcano volcanic', astron: 'astronomy astrophysics', planet: 'planetary planet', estrel: 'stars stellar',
  galaxi: 'galaxies', espaci: 'space', optica: 'optics optical', cuanti: 'quantum',
  // Ingeniería y computación
  comput: 'computer computing computational', inform: 'information informatics', inteli: 'intelligence',
  artifi: 'artificial', automa: 'automation automatic', ingeni: 'engineering',
  materi: 'materials', constr: 'construction building', edific: 'building buildings', estruc: 'structural structures',
  puente: 'bridge bridges', hormig: 'concrete', concre: 'concrete', acero: 'steel', hierro: 'iron',
  electr: 'electrical electronic electric', mecani: 'mechanical', robot: 'robotics robot', robotic: 'robotics',
  tecnol: 'technology technological', digita: 'digital', algori: 'algorithm algorithms', datos: 'data',
  profun: 'deep', imagen: 'image imaging', imagenes: 'images imaging', vision: 'vision',
  seguri: 'security safety', cibers: 'cybersecurity security', softwa: 'software', red: 'network',
  sensor: 'sensor sensors', senal: 'signal', transp: 'transport transportation', vehicu: 'vehicle vehicles',
  trafic: 'traffic', biblio: 'library bibliometrics',
  biblioteca: 'library', archivo: 'archives', document: 'documentation information',
};

export function normalizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));
}

/** Raíces de un texto, con repeticiones y con las traducciones del glosario añadidas. */
export function toStemList(text: string): string[] {
  const stems: string[] = [];
  for (const word of normalizeWords(text)) {
    stems.push(stemWord(word));
    const translation = ES_EN_GLOSSARY[word] ?? ES_EN_GLOSSARY[word.slice(0, 6)];
    if (translation) {
      for (const en of translation.split(' ')) {
        if (en && !STOP_WORDS.has(en)) stems.push(stemWord(en));
      }
    }
  }
  return stems;
}

/** Conjunto de raíces comparables de un texto. */
export function toStems(text: string): Set<string> {
  return new Set(toStemList(text));
}
