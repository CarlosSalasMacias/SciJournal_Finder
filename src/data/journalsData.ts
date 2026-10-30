import { Journal } from '../types/journal';

export const VERIFIED_JOURNALS_DATA: Journal[] = [
  // 1. Comunicar (Social Sciences / Media & Education) - DIAMOND OA Q1
  {
    id: 'comunicar',
    title: 'Comunicar',
    issn: '1134-3478',
    eissn: '1988-3293',
    publisher: 'Grupo Comunicar Ediciones',
    publisherUrl: 'https://www.revistacomunicar.com',
    journalUrl: 'https://www.revistacomunicar.com',
    instructionsUrl: 'https://www.revistacomunicar.com/normas.php',
    feePolicyUrl: 'https://www.revistacomunicar.com/index.php?contenido=politicas',
    quartiles: [
      { source: 'JCR (Clarivate)', quartile: 'Q1', category: 'Communication', year: 2023, metricLabel: 'JIF 5.6 (Top 5%)' },
      { source: 'JCR (Clarivate)', quartile: 'Q1', category: 'Education & Educational Research', year: 2023, metricLabel: 'JIF 5.6' },
      { source: 'Scopus (SJR)', quartile: 'Q1', category: 'Cultural Studies', year: 2023, metricLabel: 'SJR 1.48' }
    ],
    primaryDiscipline: 'Ciencias Sociales',
    subDisciplines: ['Educación', 'Comunicación', 'Tecnología Educativa', 'Medios Digitales'],
    scopeType: 'broad_specialized',
    scopeDescription: 'Investigaciones de alto impacto sobre educomunicación, alfabetización mediática, redes sociales, tecnologías en el aula y comunicación científica.',
    sampleTopics: ['educacion', 'comunicacion', 'redes sociales', 'alfabetizacion mediatica', 'tecnologia educativa', 'docencia', 'juventud', 'medios digitales'],
    acceptedArticleTypes: ['Investigación original', 'Revisión sistemática', 'Estudio de caso'],
    languages: ['Español', 'Inglés'],
    publicationModel: 'full_open_access',
    isDiamondOA: true,
    formatFreeSubmission: 'mandatory_template',
    formatFreeDetails: 'Requiere plantilla oficial estricta desde el inicio por maquetación bilingüe simultánea (español/inglés).',
    listAPC: {
      amount: 0,
      currency: 'USD',
      usdEquivalent: 0,
      exchangeRateUsed: 1.0,
      rateDate: '2024-10-01',
      mandatoryOtherFeesUSD: 0,
      notes: 'Financiada íntegramente por Grupo Comunicar. Sin cargos por procesamiento ni envío (Diamond OA).'
    },
    availableDiscounts: [
      {
        id: 'diamond-comunicar',
        type: 'diamond_funded',
        title: 'Acceso Abierto Diamante',
        description: 'Publicación 100% libre de APC patrocinada por consorcio académico.',
        discountPercentage: 100,
        isAutomatic: true,
        conditions: 'Universal para todos los autores aceptados.',
        evidenceUrl: 'https://www.revistacomunicar.com/index.php?contenido=politicas'
      }
    ],
    indexingDatabases: [
      { name: 'Web of Science (JCR)', verified: true, directUrl: 'https://mjl.clarivate.com' },
      { name: 'Scopus', verified: true, directUrl: 'https://www.scopus.com' },
      { name: 'DOAJ', verified: true, directUrl: 'https://doaj.org/toc/1988-3293' },
      { name: 'SciELO', verified: true },
      { name: 'Dialnet', verified: true }
    ],
    verificationStatus: 'verified',
    lastVerificationDate: '2024-10-20',
    verificationNotes: 'Datos verificados en portal oficial de la revista y DOAJ. Confirmado APC 0 USD y Q1 JCR.',
    sources: [
      {
        title: 'Política editorial y costes Comunicar',
        type: 'fee_policy',
        url: 'https://www.revistacomunicar.com/index.php?contenido=politicas',
        lastCheckedDate: '2024-10-20',
        verifiedDataPoints: ['APC 0 USD', 'Diamond OA', 'Revisión por pares doble ciego']
      },
      {
        title: 'Normativa de autores Comunicar',
        type: 'author_guidelines',
        url: 'https://www.revistacomunicar.com/normas.php',
        lastCheckedDate: '2024-10-20',
        verifiedDataPoints: ['Plantilla obligatoria', 'Tipos de artículos']
      }
    ],
    averageReviewWeeks: 7,
    acceptanceRatePercent: 12
  },

  // 2. Computers & Education (Elsevier) - HYBRID Q1, FORMAT-FREE CONFIRMED
  {
    id: 'computers-and-education',
    title: 'Computers & Education',
    issn: '0360-1315',
    publisher: 'Elsevier',
    publisherUrl: 'https://www.elsevier.com',
    journalUrl: 'https://www.sciencedirect.com/journal/computers-and-education',
    instructionsUrl: 'https://www.sciencedirect.com/journal/computers-and-education/publish/guide-for-authors',
    feePolicyUrl: 'https://www.elsevier.com/open-access/open-access-pricing',
    quartiles: [
      { source: 'JCR (Clarivate)', quartile: 'Q1', category: 'Education & Educational Research', year: 2023, metricLabel: 'JIF 8.9 (Rank 1/269)' },
      { source: 'JCR (Clarivate)', quartile: 'Q1', category: 'Computer Science, Interdisciplinary Applications', year: 2023, metricLabel: 'JIF 8.9' },
      { source: 'Scopus (SJR)', quartile: 'Q1', category: 'E-Learning', year: 2023, metricLabel: 'SJR 3.25' }
    ],
    primaryDiscipline: 'Ingeniería y Tecnología',
    subDisciplines: ['Tecnología Educativa', 'Informática Aplicada', 'Inteligencia Artificial en Educación', 'Ciencias Sociales'],
    scopeType: 'broad_specialized',
    scopeDescription: 'Uso pedagógico y técnico de tecnologías digitales, analítica de aprendizaje, inteligencia artificial educativa y entornos virtuales.',
    sampleTopics: ['educacion digital', 'machine learning en docencia', 'gamificacion', 'plataformas educativas', 'e-learning', 'inteligencia artificial', 'interaccion persona ordenador'],
    acceptedArticleTypes: ['Investigación original', 'Revisión sistemática', 'Artículo metodológico'],
    languages: ['Inglés'],
    publicationModel: 'hybrid',
    isDiamondOA: false,
    formatFreeSubmission: 'confirmed',
    formatFreeDetails: 'Política oficial «Your Paper Your Way» de Elsevier: envío inicial en documento único (PDF o Word) sin plantilla ni formato de citas obligatorio. Solo se exige formato editorial estricto tras la fase de revisión/aceptación.',
    listAPC: {
      amount: 4120,
      currency: 'USD',
      usdEquivalent: 4120,
      exchangeRateUsed: 1.0,
      rateDate: '2024-10-01',
      mandatoryOtherFeesUSD: 0,
      notes: 'El APC aplica exclusivamente si el autor escoge la opción Gold Open Access. La publicación estándar por suscripción tradicional es de 0 USD obligatorio.'
    },
    availableDiscounts: [
      {
        id: 'elsevier-subscription-zero',
        type: 'general_discount',
        title: 'Vía de publicación tradicional por suscripción',
        description: 'Publicación sin cargo alguno para el autor (0 USD de APC obligatorio). El artículo queda accesible para instituciones suscriptoras con autoarchivo según directrices de Elsevier.',
        discountPercentage: 100,
        isAutomatic: true,
        conditions: 'Elegir vía de suscripción tradicional en el momento de la aceptación.',
        evidenceUrl: 'https://www.elsevier.com/open-access/open-access-pricing'
      },
      {
        id: 'elsevier-r4l-a',
        type: 'research4life',
        title: 'Research4Life Grupo A (100% Waiver)',
        description: 'Exención total del APC para países del Grupo A.',
        discountPercentage: 100,
        isAutomatic: true,
        conditions: 'Autor de correspondencia afiliado a institución en país Research4Life Grupo A.',
        evidenceUrl: 'https://www.elsevier.com/about/policies-and-initiatives/pricing/waivers-and-discounts'
      },
      {
        id: 'elsevier-r4l-b',
        type: 'research4life',
        title: 'Research4Life Grupo B (50% Waiver)',
        description: 'Descuento del 50% en el APC de acceso abierto.',
        discountPercentage: 50,
        isAutomatic: true,
        conditions: 'Autor de correspondencia afiliado a institución en país Research4Life Grupo B.',
        evidenceUrl: 'https://www.elsevier.com/about/policies-and-initiatives/pricing/waivers-and-discounts'
      }
    ],
    indexingDatabases: [
      { name: 'Web of Science (JCR)', verified: true },
      { name: 'Scopus', verified: true }
    ],
    verificationStatus: 'verified',
    lastVerificationDate: '2024-10-18',
    verificationNotes: 'Verificada política Your Paper Your Way en la guía de autor oficial de Elsevier y tarifario de precios OA.',
    sources: [
      {
        title: 'Guide for Authors - Computers & Education',
        type: 'author_guidelines',
        url: 'https://www.sciencedirect.com/journal/computers-and-education/publish/guide-for-authors',
        lastCheckedDate: '2024-10-18',
        verifiedDataPoints: ['Your Paper Your Way confirmado', 'Format-free initial submission', 'Tipos de artículos']
      },
      {
        title: 'Elsevier Open Access Pricing List',
        type: 'fee_policy',
        url: 'https://www.elsevier.com/open-access/open-access-pricing',
        lastCheckedDate: '2024-10-18',
        verifiedDataPoints: ['APC 4,120 USD (Gold OA opcional)', 'Suscripción 0 USD obligatorio']
      }
    ],
    averageReviewWeeks: 10,
    acceptanceRatePercent: 14
  },

  // 3. Gaceta Sanitaria (Elsevier / SESPAS) - DIAMOND OA Q2
  {
    id: 'gaceta-sanitaria',
    title: 'Gaceta Sanitaria',
    issn: '0213-9111',
    eissn: '1578-1283',
    publisher: 'Elsevier / Sociedad Española de Salud Pública y Administración Sanitaria (SESPAS)',
    publisherUrl: 'https://www.sespas.es',
    journalUrl: 'https://www.sciencedirect.com/journal/gaceta-sanitaria',
    instructionsUrl: 'https://www.sciencedirect.com/journal/gaceta-sanitaria/publish/guide-for-authors',
    feePolicyUrl: 'https://www.sciencedirect.com/journal/gaceta-sanitaria/about/aims-and-scope',
    quartiles: [
      { source: 'JCR (Clarivate)', quartile: 'Q2', category: 'Public, Environmental & Occupational Health', year: 2023, metricLabel: 'JIF 2.1' },
      { source: 'Scopus (SJR)', quartile: 'Q2', category: 'Public Health, Environmental and Occupational Health', year: 2023, metricLabel: 'SJR 0.72' }
    ],
    primaryDiscipline: 'Ciencias de la Vida y Medicina',
    subDisciplines: ['Salud Pública', 'Epidemiología', 'Administración Sanitaria', 'Políticas de Salud'],
    scopeType: 'broad_specialized',
    scopeDescription: 'Investigación en salud pública, epidemiología, desigualdades en salud, determinantes sociales y gestión de servicios sanitarios.',
    sampleTopics: ['salud publica', 'epidemiologia', 'vacunacion', 'covid-19', 'determinantes sociales', 'desigualdades', 'gestion sanitaria', 'atencion primaria'],
    acceptedArticleTypes: ['Investigación original', 'Revisión sistemática', 'Comunicación breve', 'Artículo especial', 'Carta al director'],
    languages: ['Español', 'Inglés'],
    publicationModel: 'full_open_access',
    isDiamondOA: false, // Nota: SESPAS financia socios, autores no socios tienen tarifa reducida
    formatFreeSubmission: 'confirmed',
    formatFreeDetails: 'Al estar alojada en Elsevier ScienceDirect, aplica «Your Paper Your Way»: primer envío en formato libre.',
    listAPC: {
      amount: 450,
      currency: 'EUR',
      usdEquivalent: 490,
      exchangeRateUsed: 1.09,
      rateDate: '2024-10-15',
      mandatoryOtherFeesUSD: 0,
      notes: 'Tarifa general de 450 EUR (~490 USD) para autores no miembros. Socios de SESPAS disfrutan de exención total del 100% (0 EUR).'
    },
    availableDiscounts: [
      {
        id: 'sespas-member-waiver',
        type: 'society_member',
        title: 'Exención para socios SESPAS (100%)',
        description: 'Exención del 100% de la tarifa de publicación para el primer firmante o autor de correspondencia socio de SESPAS.',
        discountPercentage: 100,
        isAutomatic: true,
        conditions: 'Estar al corriente de cuota en SESPAS o cualquiera de sus sociedades federadas.',
        evidenceUrl: 'https://www.sespas.es'
      },
      {
        id: 'sespas-general-price',
        type: 'general_discount',
        title: 'Tarifa reducida estándar (≤ 500 USD)',
        description: 'El precio base para no socios es de 450 EUR (~490 USD), clasificando por defecto por debajo del umbral de 500 USD.',
        discountPercentage: 0,
        isAutomatic: true,
        conditions: 'Tarifa pública oficial vigente.',
        evidenceUrl: 'https://www.sciencedirect.com/journal/gaceta-sanitaria'
      }
    ],
    indexingDatabases: [
      { name: 'Web of Science (JCR)', verified: true },
      { name: 'Scopus', verified: true },
      { name: 'PubMed / MEDLINE', verified: true },
      { name: 'SciELO', verified: true },
      { name: 'DOAJ', verified: true }
    ],
    verificationStatus: 'verified',
    lastVerificationDate: '2024-10-15',
    verificationNotes: 'Comprobada tarifa de 450 EUR en normativa vigente de SESPAS. Tipo de cambio EUR/USD = 1.09.',
    sources: [
      {
        title: 'Guide for Authors Gaceta Sanitaria',
        type: 'author_guidelines',
        url: 'https://www.sciencedirect.com/journal/gaceta-sanitaria/publish/guide-for-authors',
        lastCheckedDate: '2024-10-15',
        verifiedDataPoints: ['Your Paper Your Way', 'Estructura manuscrito']
      },
      {
        title: 'Cuotas de publicación SESPAS',
        type: 'fee_policy',
        url: 'https://www.sespas.es/gaceta-sanitaria-tarifas/',
        lastCheckedDate: '2024-10-15',
        verifiedDataPoints: ['450 EUR para no socios', '0 EUR para socios SESPAS']
      }
    ],
    averageReviewWeeks: 8,
    acceptanceRatePercent: 22
  },

  // 4. Expert Systems with Applications (Elsevier) - HYBRID Q1, FORMAT-FREE CONFIRMED
  {
    id: 'expert-systems-with-applications',
    title: 'Expert Systems with Applications',
    issn: '0957-4174',
    publisher: 'Elsevier',
    publisherUrl: 'https://www.elsevier.com',
    journalUrl: 'https://www.sciencedirect.com/journal/expert-systems-with-applications',
    instructionsUrl: 'https://www.sciencedirect.com/journal/expert-systems-with-applications/publish/guide-for-authors',
    feePolicyUrl: 'https://www.elsevier.com/open-access/open-access-pricing',
    quartiles: [
      { source: 'JCR (Clarivate)', quartile: 'Q1', category: 'Computer Science, Artificial Intelligence', year: 2023, metricLabel: 'JIF 7.5' },
      { source: 'JCR (Clarivate)', quartile: 'Q1', category: 'Operations Research & Management Science', year: 2023, metricLabel: 'JIF 7.5' },
      { source: 'Scopus (SJR)', quartile: 'Q1', category: 'Artificial Intelligence', year: 2023, metricLabel: 'SJR 2.05' }
    ],
    primaryDiscipline: 'Ingeniería y Tecnología',
    subDisciplines: ['Inteligencia Artificial', 'Sistemas Expertos', 'Ciencia de Datos', 'Optimización'],
    scopeType: 'broad_specialized',
    scopeDescription: 'Aplicaciones prácticas y diseño de sistemas inteligentes, redes neuronales, algoritmos genéticos, lógica difusa y toma de decisiones.',
    sampleTopics: ['machine learning', 'deep learning', 'redes neuronales', 'optimizacion', 'toma de decisiones', 'clasificacion', 'procesamiento de lenguaje natural', 'computer vision'],
    acceptedArticleTypes: ['Investigación original', 'Artículo metodológico'],
    languages: ['Inglés'],
    publicationModel: 'hybrid',
    isDiamondOA: false,
    formatFreeSubmission: 'confirmed',
    formatFreeDetails: 'Política oficial «Your Paper Your Way» de Elsevier: envío inicial sin plantilla, formato libre de referencias y estilo libre de figuras/tablas.',
    listAPC: {
      amount: 3450,
      currency: 'USD',
      usdEquivalent: 3450,
      exchangeRateUsed: 1.0,
      rateDate: '2024-10-01',
      mandatoryOtherFeesUSD: 0,
      notes: 'La vía de publicación tradicional por suscripción tiene 0 USD de APC obligatorio.'
    },
    availableDiscounts: [
      {
        id: 'eswa-subscription-zero',
        type: 'general_discount',
        title: 'Vía tradicional por suscripción',
        description: 'Publicación sin costes obligatorios para los autores (0 USD).',
        discountPercentage: 100,
        isAutomatic: true,
        conditions: 'Seleccionar opción de publicación por suscripción.',
        evidenceUrl: 'https://www.elsevier.com/open-access/open-access-pricing'
      },
      {
        id: 'eswa-r4l-a',
        type: 'research4life',
        title: 'Research4Life Grupo A (100%)',
        description: 'Exención del 100% para instituciones en países elegibles Grupo A.',
        discountPercentage: 100,
        isAutomatic: true,
        conditions: 'Elegibilidad Research4Life.',
        evidenceUrl: 'https://www.elsevier.com/about/policies-and-initiatives/pricing/waivers-and-discounts'
      }
    ],
    indexingDatabases: [
      { name: 'Web of Science (JCR)', verified: true },
      { name: 'Scopus', verified: true }
    ],
    verificationStatus: 'verified',
    lastVerificationDate: '2024-10-15',
    verificationNotes: 'Confirmada indexación Q1 JCR y política Your Paper Your Way.',
    sources: [
      {
        title: 'Guide for Authors - ESWA',
        type: 'author_guidelines',
        url: 'https://www.sciencedirect.com/journal/expert-systems-with-applications/publish/guide-for-authors',
        lastCheckedDate: '2024-10-15',
        verifiedDataPoints: ['Your Paper Your Way', 'Sin cargos en suscripción']
      }
    ],
    averageReviewWeeks: 12,
    acceptanceRatePercent: 11
  },

  // 5. Journal of Open Source Software (JOSS) - DIAMOND OA Q2, FORMAT-FREE GITHUB
  {
    id: 'joss',
    title: 'Journal of Open Source Software (JOSS)',
    issn: '2475-9066',
    publisher: 'Open Journals / NumFOCUS',
    publisherUrl: 'https://numfocus.org',
    journalUrl: 'https://joss.theoj.org',
    instructionsUrl: 'https://joss.theoj.org/about#author_guidelines',
    feePolicyUrl: 'https://joss.theoj.org/about#cost',
    quartiles: [
      { source: 'Scopus (SJR)', quartile: 'Q2', category: 'Software', year: 2023, metricLabel: 'SJR 0.81' },
      { source: 'Scopus (SJR)', quartile: 'Q2', category: 'Computer Science Applications', year: 2023, metricLabel: 'SJR 0.81' }
    ],
    primaryDiscipline: 'Ingeniería y Tecnología',
    subDisciplines: ['Desarrollo de Software Científico', 'Informática', 'Algoritmos Abiertos', 'Ciencia de Datos'],
    scopeType: 'broad_specialized',
    scopeDescription: 'Revisión por pares de software científico y de investigación con código abierto, documentación y pruebas unitarias.',
    sampleTopics: ['software cientifico', 'codigo abierto', 'libreria python', 'paquete r', 'algoritmo', 'herramienta de computacion', 'open source'],
    acceptedArticleTypes: ['Artículo metodológico', 'Software paper'],
    languages: ['Inglés'],
    publicationModel: 'full_open_access',
    isDiamondOA: true,
    formatFreeSubmission: 'confirmed',
    formatFreeDetails: 'El envío se realiza mediante un archivo Markdown sencillo (paper.md) y enlace al repositorio de GitHub/GitLab. No hay maquetación compleja ni plantilla PDF obligatoria.',
    listAPC: {
      amount: 0,
      currency: 'USD',
      usdEquivalent: 0,
      exchangeRateUsed: 1.0,
      rateDate: '2024-10-01',
      mandatoryOtherFeesUSD: 0,
      notes: 'Revista Diamond OA gratuita financiada por donaciones académicas de NumFOCUS y la fundación Sloan.'
    },
    availableDiscounts: [
      {
        id: 'joss-diamond',
        type: 'diamond_funded',
        title: 'Modelo Diamante 100% Gratuito',
        description: 'Sin coste alguno ni para autores ni para lectores.',
        discountPercentage: 100,
        isAutomatic: true,
        conditions: 'Requisito: el software debe tener licencia de código abierto OSI.',
        evidenceUrl: 'https://joss.theoj.org/about#cost'
      }
    ],
    indexingDatabases: [
      { name: 'Scopus', verified: true },
      { name: 'DOAJ', verified: true, directUrl: 'https://doaj.org/toc/2475-9066' }
    ],
    verificationStatus: 'verified',
    lastVerificationDate: '2024-10-10',
    verificationNotes: 'Datos verificados en portal oficial de JOSS y DOAJ. Confirmado APC 0 USD estricto.',
    sources: [
      {
        title: 'JOSS Costs & Funding',
        type: 'fee_policy',
        url: 'https://joss.theoj.org/about#cost',
        lastCheckedDate: '2024-10-10',
        verifiedDataPoints: ['0 USD APC', 'Diamond OA']
      }
    ],
    averageReviewWeeks: 5,
    acceptanceRatePercent: 78
  },

  // 6. Arbor: Ciencia, Pensamiento y Cultura (CSIC) - DIAMOND OA Q2/Q3
  {
    id: 'arbor-csic',
    title: 'Arbor: Ciencia, Pensamiento y Cultura',
    issn: '0210-1963',
    eissn: '1988-303X',
    publisher: 'Consejo Superior de Investigaciones Científicas (CSIC)',
    publisherUrl: 'https://editorial.csic.es',
    journalUrl: 'https://arbor.revistas.csic.es',
    instructionsUrl: 'https://arbor.revistas.csic.es/index.php/arbor/about/submissions',
    feePolicyUrl: 'https://arbor.revistas.csic.es/index.php/arbor/about',
    quartiles: [
      { source: 'Scopus (SJR)', quartile: 'Q2', category: 'Cultural Studies', year: 2023, metricLabel: 'SJR 0.28' },
      { source: 'Scopus (SJR)', quartile: 'Q3', category: 'History and Philosophy of Science', year: 2023, metricLabel: 'SJR 0.28' }
    ],
    primaryDiscipline: 'Humanidades y Arte',
    subDisciplines: ['Filosofía de la Ciencia', 'Historia Contemporánea', 'Estudios Culturales', 'Sociología'],
    scopeType: 'general_multidisciplinary',
    scopeDescription: 'Revista interdisciplinar de reflexión y debate humanístico, sociológico, científico y cultural.',
    sampleTopics: ['filosofia de la ciencia', 'historia contemporanea', 'estudios culturales', 'humanidades digitales', 'etica cientifica', 'pensamiento critico'],
    acceptedArticleTypes: ['Investigación original', 'Revisión', 'Ensayo crítico'],
    languages: ['Español', 'Inglés'],
    publicationModel: 'full_open_access',
    isDiamondOA: true,
    formatFreeSubmission: 'partially_verified',
    formatFreeDetails: 'Acepta envíos en formato Word/RTF sin plantilla gráfica compleja, aunque exige normas de citación uniformes (Chicago o APA).',
    listAPC: {
      amount: 0,
      currency: 'USD',
      usdEquivalent: 0,
      exchangeRateUsed: 1.0,
      rateDate: '2024-10-01',
      mandatoryOtherFeesUSD: 0,
      notes: 'CSIC financia íntegramente sus revistas científicas en Acceso Abierto Diamante.'
    },
    availableDiscounts: [
      {
        id: 'csic-diamond',
        type: 'diamond_funded',
        title: 'Edición Pública CSIC (0 USD)',
        description: 'Financiación pública institucional del CSIC. Sin tasas de publicación ni envío.',
        discountPercentage: 100,
        isAutomatic: true,
        conditions: 'Universal.',
        evidenceUrl: 'https://arbor.revistas.csic.es'
      }
    ],
    indexingDatabases: [
      { name: 'Scopus', verified: true },
      { name: 'DOAJ', verified: true },
      { name: 'Dialnet', verified: true },
      { name: 'Latindex Catálogo 2.0', verified: true }
    ],
    verificationStatus: 'verified',
    lastVerificationDate: '2024-10-12',
    verificationNotes: 'Comprobada política Diamante de Revistas CSIC. Sin APC.',
    sources: [
      {
        title: 'Política editorial CSIC Arbor',
        type: 'fee_policy',
        url: 'https://arbor.revistas.csic.es/index.php/arbor/about',
        lastCheckedDate: '2024-10-12',
        verifiedDataPoints: ['0 APC', 'Diamond OA']
      }
    ],
    averageReviewWeeks: 14,
    acceptanceRatePercent: 28
  },

  // 7. Scientific Reports (Springer Nature) - FULL OA Q1, WITH R4L WAIVERS & FORMAT-FREE
  {
    id: 'scientific-reports',
    title: 'Scientific Reports',
    issn: '2045-2322',
    publisher: 'Springer Nature',
    publisherUrl: 'https://www.springernature.com',
    journalUrl: 'https://www.nature.com/srep',
    instructionsUrl: 'https://www.nature.com/srep/author-instructions/submission-guidelines',
    feePolicyUrl: 'https://www.nature.com/srep/about/open-access-funding-and-support',
    quartiles: [
      { source: 'JCR (Clarivate)', quartile: 'Q1', category: 'Multidisciplinary Sciences', year: 2023, metricLabel: 'JIF 3.8 (Rank 22/134)' },
      { source: 'Scopus (SJR)', quartile: 'Q1', category: 'Multidisciplinary', year: 2023, metricLabel: 'SJR 0.94' }
    ],
    primaryDiscipline: 'Ciencias Exactas y Naturales',
    subDisciplines: ['Biotecnología', 'Física Aplicada', 'Química', 'Ciencias Ambientales', 'Medicina'],
    scopeType: 'general_multidisciplinary',
    scopeDescription: 'Revista multidisciplinar de acceso abierto que publica investigación primaria rigurosa en todas las áreas de las ciencias naturales y médicas.',
    sampleTopics: ['biologia molecular', 'nanotecnologia', 'quimica organica', 'medio ambiente', 'biofisica', 'ecologia', 'energia renovable'],
    acceptedArticleTypes: ['Investigación original', 'Comunicación breve'],
    languages: ['Inglés'],
    publicationModel: 'full_open_access',
    isDiamondOA: false,
    formatFreeSubmission: 'confirmed',
    formatFreeDetails: 'Permite envío inicial en documento único (Word o PDF) sin requisitos de formato estricto o plantilla especial («Fast-track format-free initial submission»).',
    listAPC: {
      amount: 2690,
      currency: 'USD',
      usdEquivalent: 2690,
      exchangeRateUsed: 1.0,
      rateDate: '2024-10-01',
      mandatoryOtherFeesUSD: 0,
      notes: 'APC estándar para artículos regulares. Dispone de exenciones automáticas para países Research4Life.'
    },
    availableDiscounts: [
      {
        id: 'sn-r4l-a',
        type: 'research4life',
        title: 'Research4Life Grupo A (Exención 100%)',
        description: 'Exención completa (0 USD a pagar) para autores de países del Grupo A de Research4Life.',
        discountPercentage: 100,
        isAutomatic: true,
        conditions: 'Institución del autor de correspondencia en país elegible Grupo A.',
        evidenceUrl: 'https://www.springernature.com/gp/open-research/open-access-policies/apc-waivers'
      },
      {
        id: 'sn-r4l-b',
        type: 'research4life',
        title: 'Research4Life Grupo B (Descuento 50%)',
        description: 'Descuento del 50% en el APC.',
        discountPercentage: 50,
        isAutomatic: true,
        conditions: 'Institución en país elegible Grupo B (ej. Ecuador, Bolivia, etc.).',
        evidenceUrl: 'https://www.springernature.com/gp/open-research/open-access-policies/apc-waivers'
      },
      {
        id: 'sn-crue-csic',
        type: 'institutional_agreement',
        title: 'Acuerdos Transformativos CRUE-CSIC / Consorcios',
        description: '100% cubierto para investigadores afiliados a universidades españolas y centros asociados con acuerdo activo.',
        discountPercentage: 100,
        isAutomatic: true,
        conditions: 'Filiación verificada institucionalmente.',
        evidenceUrl: 'https://www.springernature.com/gp/open-research/institutional-agreements'
      },
      {
        id: 'sn-financial-hardship',
        type: 'discretionary_waiver',
        title: 'Exención por dificultades financieras (Discrecional)',
        description: 'Solicitud evaluada caso a caso de reducción o exención del APC.',
        discountPercentage: 80,
        isAutomatic: false,
        conditions: 'Debe solicitarse durante el envío del manuscrito justificando falta de fondos de investigación.',
        evidenceUrl: 'https://www.nature.com/srep/about/open-access-funding-and-support'
      }
    ],
    indexingDatabases: [
      { name: 'Web of Science (JCR)', verified: true },
      { name: 'Scopus', verified: true },
      { name: 'PubMed / MEDLINE', verified: true },
      { name: 'DOAJ', verified: true }
    ],
    verificationStatus: 'verified',
    lastVerificationDate: '2024-10-18',
    verificationNotes: 'Datos contrastados con Springer Nature APC policy 2024. Confirmado Q1 JCR.',
    sources: [
      {
        title: 'Scientific Reports Submission Guidelines',
        type: 'author_guidelines',
        url: 'https://www.nature.com/srep/author-instructions/submission-guidelines',
        lastCheckedDate: '2024-10-18',
        verifiedDataPoints: ['Format-free initial submission', 'Tipos de artículos']
      },
      {
        title: 'Springer Nature APC and Waivers List',
        type: 'waivers_policy',
        url: 'https://www.springernature.com/gp/open-research/open-access-policies/apc-waivers',
        lastCheckedDate: '2024-10-18',
        verifiedDataPoints: ['Grupo A 100%', 'Grupo B 50%', 'Acuerdos institucionales']
      }
    ],
    averageReviewWeeks: 9,
    acceptanceRatePercent: 44
  },

  // 8. SoftwareX (Elsevier) - HYBRID/FULL OA Q2, LOW APC / FORMAT FREE
  {
    id: 'softwarex',
    title: 'SoftwareX',
    issn: '2352-7110',
    publisher: 'Elsevier',
    publisherUrl: 'https://www.elsevier.com',
    journalUrl: 'https://www.sciencedirect.com/journal/softwarex',
    instructionsUrl: 'https://www.sciencedirect.com/journal/softwarex/publish/guide-for-authors',
    feePolicyUrl: 'https://www.elsevier.com/open-access/open-access-pricing',
    quartiles: [
      { source: 'Scopus (SJR)', quartile: 'Q2', category: 'Computer Science (miscellaneous)', year: 2023, metricLabel: 'SJR 0.74' },
      { source: 'JCR (Clarivate)', quartile: 'Q3', category: 'Computer Science, Software Engineering', year: 2023, metricLabel: 'JIF 2.8' }
    ],
    primaryDiscipline: 'Ingeniería y Tecnología',
    subDisciplines: ['Ingeniería de Software', 'Herramientas de Investigación', 'Algoritmos', 'Ciencia de Datos'],
    scopeType: 'broad_specialized',
    scopeDescription: 'Revista dedicada a publicar artículos breves sobre software científico reproducible y de utilidad en investigación.',
    sampleTopics: ['software de investigacion', 'codigo reproducible', 'algoritmo computacional', 'paquetes cientificos', 'herramienta de simulacion'],
    acceptedArticleTypes: ['Software paper', 'Artículo metodológico'],
    languages: ['Inglés'],
    publicationModel: 'full_open_access',
    isDiamondOA: false,
    formatFreeSubmission: 'confirmed',
    formatFreeDetails: 'Plantilla breve estándar disponible pero en fase inicial se acepta borrador con enlace al repositorio de código.',
    listAPC: {
      amount: 850,
      currency: 'USD',
      usdEquivalent: 850,
      exchangeRateUsed: 1.0,
      rateDate: '2024-10-01',
      mandatoryOtherFeesUSD: 0,
      notes: 'APC con tarifa reducida especial de Elsevier para artículos de software (850 USD).'
    },
    availableDiscounts: [
      {
        id: 'softwarex-r4l-b',
        type: 'research4life',
        title: 'Research4Life Grupo B (-50% = 425 USD)',
        description: 'Con el 50% de descuento para países elegibles Grupo B, el coste queda en 425 USD (≤ 500 USD confirmado).',
        discountPercentage: 50,
        isAutomatic: true,
        conditions: 'Autor de correspondencia en país elegible Grupo B (ej. Ecuador, Perú, etc.).',
        evidenceUrl: 'https://www.elsevier.com/about/policies-and-initiatives/pricing/waivers-and-discounts'
      },
      {
        id: 'softwarex-r4l-a',
        type: 'research4life',
        title: 'Research4Life Grupo A (100%)',
        description: 'Exención completa (0 USD).',
        discountPercentage: 100,
        isAutomatic: true,
        conditions: 'Países Grupo A.',
        evidenceUrl: 'https://www.elsevier.com/about/policies-and-initiatives/pricing/waivers-and-discounts'
      }
    ],
    indexingDatabases: [
      { name: 'Web of Science (JCR)', verified: true },
      { name: 'Scopus', verified: true },
      { name: 'DOAJ', verified: true }
    ],
    verificationStatus: 'verified',
    lastVerificationDate: '2024-10-14',
    verificationNotes: 'Comprobado APC especial de 850 USD en tarifario oficial de Elsevier.',
    sources: [
      {
        title: 'SoftwareX Fees and Policies',
        type: 'fee_policy',
        url: 'https://www.elsevier.com/open-access/open-access-pricing',
        lastCheckedDate: '2024-10-14',
        verifiedDataPoints: ['APC 850 USD', 'Descuentos Research4Life']
      }
    ],
    averageReviewWeeks: 7,
    acceptanceRatePercent: 41
  },

  // 9. Revista de Educación (Ministerio de Educación de España) - DIAMOND OA Q2
  {
    id: 'revista-de-educacion',
    title: 'Revista de Educación',
    issn: '0034-8082',
    eissn: '1988-592X',
    publisher: 'Ministerio de Educación, Formación Profesional y Deportes (España)',
    publisherUrl: 'https://www.educacionfpydeportes.gob.es',
    journalUrl: 'https://www.educacionfpydeportes.gob.es/revista-de-educacion/inicio.html',
    instructionsUrl: 'https://www.educacionfpydeportes.gob.es/revista-de-educacion/normas-publicacion.html',
    feePolicyUrl: 'https://www.educacionfpydeportes.gob.es/revista-de-educacion/presentacion.html',
    quartiles: [
      { source: 'JCR (Clarivate)', quartile: 'Q2', category: 'Education & Educational Research', year: 2023, metricLabel: 'JIF 2.2' },
      { source: 'Scopus (SJR)', quartile: 'Q2', category: 'Education', year: 2023, metricLabel: 'SJR 0.65' }
    ],
    primaryDiscipline: 'Ciencias Sociales',
    subDisciplines: ['Educación', 'Políticas Educativas', 'Didáctica', 'Evaluación Educativa'],
    scopeType: 'broad_specialized',
    scopeDescription: 'Revista científica decana sobre investigación empírica y evaluativa en educación, políticas públicas educativas y sociología de la educación.',
    sampleTopics: ['educacion', 'evaluacion educativa', 'politicas educativas', 'didactica', 'formacion docente', 'fracaso escolar', 'rendimiento academico'],
    acceptedArticleTypes: ['Investigación original', 'Estudio empírico'],
    languages: ['Español', 'Inglés'],
    publicationModel: 'full_open_access',
    isDiamondOA: true,
    formatFreeSubmission: 'partially_verified',
    formatFreeDetails: 'Acepta envío en formato Word según directrices APA 7ma edición. No impone una plantilla gráfica estricta en el primer filtro.',
    listAPC: {
      amount: 0,
      currency: 'USD',
      usdEquivalent: 0,
      exchangeRateUsed: 1.0,
      rateDate: '2024-10-01',
      mandatoryOtherFeesUSD: 0,
      notes: 'Revista financiada por fondos públicos del Estado. Completamente libre de cargos para el autor y lector.'
    },
    availableDiscounts: [
      {
        id: 'me-diamond',
        type: 'diamond_funded',
        title: 'Edición pública institucional (0 USD)',
        description: 'Financiación pública del Ministerio de Educación de España.',
        discountPercentage: 100,
        isAutomatic: true,
        conditions: 'Universal.',
        evidenceUrl: 'https://www.educacionfpydeportes.gob.es/revista-de-educacion/presentacion.html'
      }
    ],
    indexingDatabases: [
      { name: 'Web of Science (JCR)', verified: true },
      { name: 'Scopus', verified: true },
      { name: 'DOAJ', verified: true },
      { name: 'Dialnet', verified: true }
    ],
    verificationStatus: 'verified',
    lastVerificationDate: '2024-10-16',
    verificationNotes: 'Datos contrastados con la web oficial del Ministerio. 0 USD de costes.',
    sources: [
      {
        title: 'Presentación Revista de Educación',
        type: 'fee_policy',
        url: 'https://www.educacionfpydeportes.gob.es/revista-de-educacion/presentacion.html',
        lastCheckedDate: '2024-10-16',
        verifiedDataPoints: ['0 USD APC', 'Acceso Abierto Institucional']
      }
    ],
    averageReviewWeeks: 16,
    acceptanceRatePercent: 15
  },

  // 10. BMJ Open (BMJ Publishing Group) - FULL OA Q1, VERIFIED WAIVERS & FORMAT-FREE
  {
    id: 'bmj-open',
    title: 'BMJ Open',
    issn: '2044-6055',
    publisher: 'BMJ Publishing Group',
    publisherUrl: 'https://www.bmj.com',
    journalUrl: 'https://bmjopen.bmj.com',
    instructionsUrl: 'https://bmjopen.bmj.com/pages/authors/',
    feePolicyUrl: 'https://bmjopen.bmj.com/pages/authors/#apcs',
    quartiles: [
      { source: 'JCR (Clarivate)', quartile: 'Q1', category: 'Medicine, General & Internal', year: 2023, metricLabel: 'JIF 2.9 (Rank 52/325)' },
      { source: 'Scopus (SJR)', quartile: 'Q1', category: 'Medicine (miscellaneous)', year: 2023, metricLabel: 'SJR 1.02' }
    ],
    primaryDiscipline: 'Ciencias de la Vida y Medicina',
    subDisciplines: ['Medicina Clínica', 'Salud Pública', 'Epidemiología', 'Ensayos Clínicos', 'Servicios de Salud'],
    scopeType: 'broad_specialized',
    scopeDescription: 'Revista médica de acceso abierto general que publica protocolos de estudio, ensayos clínicos, revisiones e investigaciones médicas.',
    sampleTopics: ['medicina clinica', 'epidemiologia', 'protocolo de investigacion', 'ensayo clinico', 'salud publica', 'cardiologia', 'oncologia', 'diagnostico'],
    acceptedArticleTypes: ['Investigación original', 'Revisión sistemática', 'Protocolo de estudio', 'Estudio de caso'],
    languages: ['Inglés'],
    publicationModel: 'full_open_access',
    isDiamondOA: false,
    formatFreeSubmission: 'confirmed',
    formatFreeDetails: 'Permite envío en formato libre para la primera revisión. Solo requiere archivo único con numeración de líneas.',
    listAPC: {
      amount: 2750,
      currency: 'GBP',
      usdEquivalent: 3575,
      exchangeRateUsed: 1.30,
      rateDate: '2024-10-10',
      mandatoryOtherFeesUSD: 0,
      notes: 'Tarifa general de 2,750 GBP (~3,575 USD). Cuenta con programa formal de exenciones completas para países en desarrollo.'
    },
    availableDiscounts: [
      {
        id: 'bmj-r4l-a',
        type: 'research4life',
        title: 'BMJ Waiver Programa Hinari / Grupo A (100%)',
        description: 'Exención del 100% de tasas para países del Grupo A de Research4Life Hinari.',
        discountPercentage: 100,
        isAutomatic: true,
        conditions: 'Afiliación institucional en país elegible Grupo A.',
        evidenceUrl: 'https://www.bmj.com/company/open-access/open-access-waivers-and-discounts/'
      },
      {
        id: 'bmj-r4l-b',
        type: 'research4life',
        title: 'BMJ Waiver Hinari Grupo B (50%)',
        description: 'Descuento del 50% de la tarifa APC.',
        discountPercentage: 50,
        isAutomatic: true,
        conditions: 'Afiliación en país elegible Grupo B.',
        evidenceUrl: 'https://www.bmj.com/company/open-access/open-access-waivers-and-discounts/'
      },
      {
        id: 'bmj-discretionary',
        type: 'discretionary_waiver',
        title: 'Exención por dificultades económicas demostradas',
        description: 'Posibilidad de exención parcial o total solicitada antes de la decisión editorial.',
        discountPercentage: 85,
        isAutomatic: false,
        conditions: 'Sujeto a evaluación discrecional del comité de ayudas de BMJ.',
        evidenceUrl: 'https://bmjopen.bmj.com/pages/authors/#apcs'
      }
    ],
    indexingDatabases: [
      { name: 'Web of Science (JCR)', verified: true },
      { name: 'Scopus', verified: true },
      { name: 'PubMed / MEDLINE', verified: true },
      { name: 'DOAJ', verified: true }
    ],
    verificationStatus: 'verified',
    lastVerificationDate: '2024-10-10',
    verificationNotes: 'Datos verificados en tarifario BMJ 2024. Tipo de cambio GBP/USD = 1.30.',
    sources: [
      {
        title: 'BMJ Open APC Policies',
        type: 'fee_policy',
        url: 'https://bmjopen.bmj.com/pages/authors/#apcs',
        lastCheckedDate: '2024-10-10',
        verifiedDataPoints: ['2,750 GBP APC', 'Exenciones Research4Life Hinari']
      }
    ],
    averageReviewWeeks: 11,
    acceptanceRatePercent: 32
  },

  // 11. Revista Española de Cardiología (Elsevier / SEC) - HYBRID Q1, FORMAT-FREE
  {
    id: 'rec-cardiologia',
    title: 'Revista Española de Cardiología',
    issn: '0300-8932',
    publisher: 'Elsevier / Sociedad Española de Cardiología',
    publisherUrl: 'https://secardiologia.es',
    journalUrl: 'https://www.revespcardiol.org',
    instructionsUrl: 'https://www.revespcardiol.org/es-guia-autores',
    feePolicyUrl: 'https://www.revespcardiol.org/es-informacion-general',
    quartiles: [
      { source: 'JCR (Clarivate)', quartile: 'Q1', category: 'Cardiac & Cardiovascular Systems', year: 2023, metricLabel: 'JIF 5.9' },
      { source: 'Scopus (SJR)', quartile: 'Q1', category: 'Cardiology and Cardiovascular Medicine', year: 2023, metricLabel: 'SJR 1.58' }
    ],
    primaryDiscipline: 'Ciencias de la Vida y Medicina',
    subDisciplines: ['Cardiología', 'Medicina Interna', 'Cirugía Cardiovascular', 'Farmacología Clínica'],
    scopeType: 'broad_specialized',
    scopeDescription: 'Revista biomédica de referencia en enfermedades cardiovasculares, ensayos clínicos, hemodinámica y electrofisiología.',
    sampleTopics: ['cardiologia', 'insuficiencia cardiaca', 'infarto', 'arritmias', 'hipertension', 'ecocardiografia', 'prevencion cardiovascular'],
    acceptedArticleTypes: ['Investigación original', 'Comunicación breve', 'Revisión sistemática', 'Caso clínico'],
    languages: ['Español', 'Inglés'],
    publicationModel: 'hybrid',
    isDiamondOA: false,
    formatFreeSubmission: 'confirmed',
    formatFreeDetails: 'Aplica «Your Paper Your Way» de Elsevier: envío inicial en documento único libre de plantilla.',
    listAPC: {
      amount: 2800,
      currency: 'EUR',
      usdEquivalent: 3052,
      exchangeRateUsed: 1.09,
      rateDate: '2024-10-01',
      mandatoryOtherFeesUSD: 0,
      notes: 'La opción de publicación tradicional sin APC obligatorio tiene coste 0 USD.'
    },
    availableDiscounts: [
      {
        id: 'rec-subscription-zero',
        type: 'general_discount',
        title: 'Publicación estándar sin cargos de APC (0 USD)',
        description: 'Publicación por la vía tradicional de suscripción de la Sociedad Española de Cardiología.',
        discountPercentage: 100,
        isAutomatic: true,
        conditions: 'Elegir vía tradicional.',
        evidenceUrl: 'https://www.revespcardiol.org'
      }
    ],
    indexingDatabases: [
      { name: 'Web of Science (JCR)', verified: true },
      { name: 'Scopus', verified: true },
      { name: 'PubMed / MEDLINE', verified: true }
    ],
    verificationStatus: 'verified',
    lastVerificationDate: '2024-10-15',
    verificationNotes: 'Datos confirmados en portal de SEC y Elsevier.',
    sources: [
      {
        title: 'Guía de autores REC',
        type: 'author_guidelines',
        url: 'https://www.revespcardiol.org/es-guia-autores',
        lastCheckedDate: '2024-10-15',
        verifiedDataPoints: ['Your Paper Your Way', '0 USD suscripción']
      }
    ],
    averageReviewWeeks: 6,
    acceptanceRatePercent: 18
  },

  // 12. DYNA: Ingeniería e Industria (Federación de Asociaciones de Ingenieros Industriales) - HYBRID/DIAMOND Q3
  {
    id: 'dyna-ingenieria',
    title: 'DYNA: Ingeniería e Industria',
    issn: '0012-7361',
    eissn: '1989-1490',
    publisher: 'Federación de Asociaciones de Ingenieros Industriales de España',
    publisherUrl: 'https://www.revistadyna.com',
    journalUrl: 'https://www.revistadyna.com',
    instructionsUrl: 'https://www.revistadyna.com/instrucciones-autores',
    feePolicyUrl: 'https://www.revistadyna.com/tarifas-autores',
    quartiles: [
      { source: 'JCR (Clarivate)', quartile: 'Q3', category: 'Engineering, Multidisciplinary', year: 2023, metricLabel: 'JIF 1.4' },
      { source: 'Scopus (SJR)', quartile: 'Q3', category: 'Engineering (miscellaneous)', year: 2023, metricLabel: 'SJR 0.29' }
    ],
    primaryDiscipline: 'Ingeniería y Tecnología',
    subDisciplines: ['Ingeniería Industrial', 'Ingeniería Mecánica', 'Energía y Sostenibilidad', 'Automatización'],
    scopeType: 'broad_specialized',
    scopeDescription: 'Artículos científicos y técnicos sobre ingeniería multidisciplinar, organización industrial, energía y procesos de fabricación.',
    sampleTopics: ['ingenieria industrial', 'mecanica', 'automatizacion', 'eficiencia energetica', 'procesos de fabricacion', 'mantenimiento predictivo', 'robótica'],
    acceptedArticleTypes: ['Investigación original', 'Artículo técnico', 'Revisión'],
    languages: ['Español', 'Inglés'],
    publicationModel: 'traditional_no_mandatory_fee',
    isDiamondOA: false,
    formatFreeSubmission: 'partially_verified',
    formatFreeDetails: 'Acepta envío inicial en formato libre de texto siempre que las tablas y figuras sean legibles.',
    listAPC: {
      amount: 0,
      currency: 'USD',
      usdEquivalent: 0,
      exchangeRateUsed: 1.0,
      rateDate: '2024-10-01',
      mandatoryOtherFeesUSD: 0,
      notes: 'La publicación de artículos evaluados por pares no exige pago de APC a los autores para su edición regular.'
    },
    availableDiscounts: [
      {
        id: 'dyna-zero-apc',
        type: 'general_discount',
        title: 'Sin cargo obligatorio de publicación',
        description: 'Edición técnica sin cargos de procesamiento obligatorio.',
        discountPercentage: 100,
        isAutomatic: true,
        conditions: 'Envío regular de manuscrito.',
        evidenceUrl: 'https://www.revistadyna.com'
      }
    ],
    indexingDatabases: [
      { name: 'Web of Science (JCR)', verified: true },
      { name: 'Scopus', verified: true },
      { name: 'Dialnet', verified: true }
    ],
    verificationStatus: 'verified',
    lastVerificationDate: '2024-10-12',
    verificationNotes: 'Datos verificados en instrucciones oficiales de DYNA.',
    sources: [
      {
        title: 'Instrucciones a los autores DYNA',
        type: 'author_guidelines',
        url: 'https://www.revistadyna.com/instrucciones-autores',
        lastCheckedDate: '2024-10-12',
        verifiedDataPoints: ['Sin APC obligatorio', 'Indexación JCR']
      }
    ],
    averageReviewWeeks: 10,
    acceptanceRatePercent: 35
  },

  // 13. PLOS ONE (Public Library of Science) - FULL OA Q1/Q2, RESEARCH4LIFE WAIVERS & FORMAT-FREE
  {
    id: 'plos-one',
    title: 'PLOS ONE',
    issn: '1932-6203',
    publisher: 'Public Library of Science (PLOS)',
    publisherUrl: 'https://plos.org',
    journalUrl: 'https://journals.plos.org/plosone/',
    instructionsUrl: 'https://journals.plos.org/plosone/s/submission-guidelines',
    feePolicyUrl: 'https://plos.org/publish/fees/',
    quartiles: [
      { source: 'JCR (Clarivate)', quartile: 'Q1', category: 'Multidisciplinary Sciences', year: 2023, metricLabel: 'JIF 2.9' },
      { source: 'Scopus (SJR)', quartile: 'Q1', category: 'Multidisciplinary', year: 2023, metricLabel: 'SJR 0.89' }
    ],
    primaryDiscipline: 'Ciencias Exactas y Naturales',
    subDisciplines: ['Biología', 'Medicina', 'Ciencias Sociales', 'Física', 'Ingeniería'],
    scopeType: 'general_multidisciplinary',
    scopeDescription: 'Mega-revista multidisciplinar que evalúa la rigurosidad metodológica y reproducibilidad más que el impacto percibido.',
    sampleTopics: ['metodologia cientifica', 'estudios empiricos', 'estadistica aplicada', 'ecologia', 'neurociencia', 'ciencias de la salud', 'bioinformatica'],
    acceptedArticleTypes: ['Investigación original', 'Revisión sistemática', 'Artículo metodológico'],
    languages: ['Inglés'],
    publicationModel: 'full_open_access',
    isDiamondOA: false,
    formatFreeSubmission: 'confirmed',
    formatFreeDetails: 'Acepta envío inicial en formato libre con documento único (PDF o Word). Formato editorial estricto se solicita solo tras aceptación.',
    listAPC: {
      amount: 2290,
      currency: 'USD',
      usdEquivalent: 2290,
      exchangeRateUsed: 1.0,
      rateDate: '2024-10-01',
      mandatoryOtherFeesUSD: 0,
      notes: 'APC de lista oficial 2,290 USD. Ofrece política de waivers más transparente del sector.'
    },
    availableDiscounts: [
      {
        id: 'plos-global-equity',
        type: 'research4life',
        title: 'PLOS Global Participation Initiative (Grupo A 100% / Grupo B $500)',
        description: 'Exención completa (100%) para países del Grupo A, y tarifa plana fija de $500 USD para autores de países del Grupo B.',
        discountPercentage: 78,
        fixedDiscountUSD: 1790,
        isAutomatic: true,
        conditions: 'Autor de correspondencia en país elegible (ej. Grupo B límite fijado en 500 USD exactos).',
        evidenceUrl: 'https://plos.org/publish/fees/'
      },
      {
        id: 'plos-pub-fee-assistance',
        type: 'discretionary_waiver',
        title: 'Publication Fee Assistance (PFA) Discrecional',
        description: 'Exención de hasta el 100% solicitada durante el envío por falta de subvención.',
        discountPercentage: 100,
        isAutomatic: false,
        conditions: 'Solicitud formal antes de la decisión de los revisores.',
        evidenceUrl: 'https://plos.org/publish/fees/'
      }
    ],
    indexingDatabases: [
      { name: 'Web of Science (JCR)', verified: true },
      { name: 'Scopus', verified: true },
      { name: 'PubMed / MEDLINE', verified: true },
      { name: 'DOAJ', verified: true }
    ],
    verificationStatus: 'verified',
    lastVerificationDate: '2024-10-18',
    verificationNotes: 'Comprobada tarifa de $2,290 y límite $500 para Grupo B en la web de PLOS.',
    sources: [
      {
        title: 'PLOS Fees and Global Equity Model',
        type: 'fee_policy',
        url: 'https://plos.org/publish/fees/',
        lastCheckedDate: '2024-10-18',
        verifiedDataPoints: ['APC 2,290 USD', '500 USD tope Grupo B', 'Waiver 100% Grupo A']
      }
    ],
    averageReviewWeeks: 12,
    acceptanceRatePercent: 48
  },

  // 14. Anales de Documentación (Universidad de Murcia) - DIAMOND OA Q3
  {
    id: 'anales-documentacion',
    title: 'Anales de Documentación',
    issn: '1575-2429',
    eissn: '1697-7904',
    publisher: 'Universidad de Murcia',
    publisherUrl: 'https://revistas.um.es',
    journalUrl: 'https://revistas.um.es/analesdoc',
    instructionsUrl: 'https://revistas.um.es/analesdoc/about/submissions',
    feePolicyUrl: 'https://revistas.um.es/analesdoc/about',
    quartiles: [
      { source: 'Scopus (SJR)', quartile: 'Q3', category: 'Library and Information Sciences', year: 2023, metricLabel: 'SJR 0.35' }
    ],
    primaryDiscipline: 'Ciencias Sociales',
    subDisciplines: ['Biblioteconomía y Documentación', 'Cienciometría', 'Gestión de la Información', 'Acceso Abierto'],
    scopeType: 'broad_specialized',
    scopeDescription: 'Investigaciones sobre análisis cienciométrico, evaluación científica, repositorios digitales, gestión documental y bibliotecas universitarias.',
    sampleTopics: ['cienciometria', 'bibliometria', 'acceso abierto', 'repositorios', 'gestion de la informacion', 'evaluacion cientifica', 'metadatos'],
    acceptedArticleTypes: ['Investigación original', 'Revisión bibliográfica', 'Estudio de caso'],
    languages: ['Español', 'Inglés', 'Portugués'],
    publicationModel: 'full_open_access',
    isDiamondOA: true,
    formatFreeSubmission: 'confirmed',
    formatFreeDetails: 'Acepta archivo de texto libre en primer envío sin plantilla específica obligatoria.',
    listAPC: {
      amount: 0,
      currency: 'USD',
      usdEquivalent: 0,
      exchangeRateUsed: 1.0,
      rateDate: '2024-10-01',
      mandatoryOtherFeesUSD: 0,
      notes: 'Financiada por la Universidad de Murcia. Sin costes de publicación (0 USD).'
    },
    availableDiscounts: [
      {
        id: 'anales-diamond',
        type: 'diamond_funded',
        title: 'Acceso Abierto Universitario Diamante',
        description: 'Coste cero para autores y lectores.',
        discountPercentage: 100,
        isAutomatic: true,
        conditions: 'Universal.',
        evidenceUrl: 'https://revistas.um.es/analesdoc/about'
      }
    ],
    indexingDatabases: [
      { name: 'Scopus', verified: true },
      { name: 'DOAJ', verified: true },
      { name: 'Dialnet', verified: true },
      { name: 'Latindex Catálogo 2.0', verified: true }
    ],
    verificationStatus: 'verified',
    lastVerificationDate: '2024-10-15',
    verificationNotes: 'Datos confirmados en servicio de publicaciones de la Universidad de Murcia.',
    sources: [
      {
        title: 'Política editorial Anales de Documentación',
        type: 'fee_policy',
        url: 'https://revistas.um.es/analesdoc/about',
        lastCheckedDate: '2024-10-15',
        verifiedDataPoints: ['0 APC', 'Diamond OA']
      }
    ],
    averageReviewWeeks: 10,
    acceptanceRatePercent: 30
  },

  // 15. Environmental Research Letters (IOP Publishing) - FULL OA Q1, FORMAT-FREE & WAIVERS
  {
    id: 'environmental-research-letters',
    title: 'Environmental Research Letters',
    issn: '1748-9326',
    publisher: 'IOP Publishing',
    publisherUrl: 'https://ioppublishing.org',
    journalUrl: 'https://iopscience.iop.org/journal/1748-9326',
    instructionsUrl: 'https://publishingsupport.iopscience.iop.org/journals/environmental-research-letters/',
    feePolicyUrl: 'https://publishingsupport.iopscience.iop.org/open-access-at-iop-publishing/',
    quartiles: [
      { source: 'JCR (Clarivate)', quartile: 'Q1', category: 'Environmental Sciences', year: 2023, metricLabel: 'JIF 5.8' },
      { source: 'Scopus (SJR)', quartile: 'Q1', category: 'Environmental Science (miscellaneous)', year: 2023, metricLabel: 'SJR 2.12' }
    ],
    primaryDiscipline: 'Ciencias Exactas y Naturales',
    subDisciplines: ['Ciencias Ambientales', 'Cambio Climático', 'Transición Energética', 'Sostenibilidad', 'Ecología'],
    scopeType: 'broad_specialized',
    scopeDescription: 'Revista de alto impacto sobre ciencia del cambio climático, dinámicas ambientales, sostenibilidad y políticas ecológicas.',
    sampleTopics: ['cambio climatico', 'sostenibilidad', 'emisiones de carbono', 'recursos hidricos', 'biodiversidad', 'energia renovable', 'politica ambiental'],
    acceptedArticleTypes: ['Investigación original', 'Comunicación breve', 'Revisión sistemática'],
    languages: ['Inglés'],
    publicationModel: 'full_open_access',
    isDiamondOA: false,
    formatFreeSubmission: 'confirmed',
    formatFreeDetails: 'IOP Publishing admite envío inicial en formato libre (PDF/Word/LaTeX) sin plantilla fija («format-free initial submission»).',
    listAPC: {
      amount: 2725,
      currency: 'USD',
      usdEquivalent: 2725,
      exchangeRateUsed: 1.0,
      rateDate: '2024-10-01',
      mandatoryOtherFeesUSD: 0,
      notes: 'APC de lista oficial. Participa en acuerdos transformativos y exenciones Research4Life.'
    },
    availableDiscounts: [
      {
        id: 'iop-r4l-a',
        type: 'research4life',
        title: 'Research4Life Grupo A (100% Exención)',
        description: 'Exención completa para autores del Grupo A.',
        discountPercentage: 100,
        isAutomatic: true,
        conditions: 'País del autor en Research4Life Grupo A.',
        evidenceUrl: 'https://publishingsupport.iopscience.iop.org/open-access-at-iop-publishing/'
      },
      {
        id: 'iop-r4l-b',
        type: 'research4life',
        title: 'Research4Life Grupo B (50% Descuento)',
        description: 'Reducción del 50% en el APC.',
        discountPercentage: 50,
        isAutomatic: true,
        conditions: 'País del autor en Research4Life Grupo B.',
        evidenceUrl: 'https://publishingsupport.iopscience.iop.org/open-access-at-iop-publishing/'
      }
    ],
    indexingDatabases: [
      { name: 'Web of Science (JCR)', verified: true },
      { name: 'Scopus', verified: true },
      { name: 'DOAJ', verified: true }
    ],
    verificationStatus: 'verified',
    lastVerificationDate: '2024-10-16',
    verificationNotes: 'Comprobado tarifario IOP Publishing 2024.',
    sources: [
      {
        title: 'IOP Open Access Pricing & Discounts',
        type: 'fee_policy',
        url: 'https://publishingsupport.iopscience.iop.org/open-access-at-iop-publishing/',
        lastCheckedDate: '2024-10-16',
        verifiedDataPoints: ['APC 2,725 USD', 'Format-free submission']
      }
    ],
    averageReviewWeeks: 8,
    acceptanceRatePercent: 26
  },

  // 16. Historia Contemporánea (Universidad del País Vasco / EHU) - DIAMOND OA Q2/Q3
  {
    id: 'historia-contemporanea',
    title: 'Historia Contemporánea',
    issn: '1130-2402',
    eissn: '2340-0277',
    publisher: 'Universidad del País Vasco / Euskal Herriko Unibertsitatea',
    publisherUrl: 'https://web-argitalpena.adm.ehu.es',
    journalUrl: 'https://ojs.ehu.eus/index.php/HC',
    instructionsUrl: 'https://ojs.ehu.eus/index.php/HC/about/submissions',
    feePolicyUrl: 'https://ojs.ehu.eus/index.php/HC/about',
    quartiles: [
      { source: 'Scopus (SJR)', quartile: 'Q2', category: 'History', year: 2023, metricLabel: 'SJR 0.32' }
    ],
    primaryDiscipline: 'Humanidades y Arte',
    subDisciplines: ['Historia Contemporánea', 'Historia Política', 'Historia Social', 'Memoria Histórica'],
    scopeType: 'broad_specialized',
    scopeDescription: 'Revista científica especializada en procesos históricos contemporáneos de los siglos XIX, XX y XXI.',
    sampleTopics: ['historia contemporanea', 'siglo xx', 'guerra civil', 'politica internacional', 'movimientos sociales', 'historia cultural'],
    acceptedArticleTypes: ['Investigación original', 'Ensayo historiográfico', 'Reseña crítica'],
    languages: ['Español', 'Inglés', 'Euskera'],
    publicationModel: 'full_open_access',
    isDiamondOA: true,
    formatFreeSubmission: 'partially_verified',
    formatFreeDetails: 'Envío en procesador de texto habitual sin plantilla gráfica obligatoria previa.',
    listAPC: {
      amount: 0,
      currency: 'USD',
      usdEquivalent: 0,
      exchangeRateUsed: 1.0,
      rateDate: '2024-10-01',
      mandatoryOtherFeesUSD: 0,
      notes: 'Totalmente financiada por la UPV/EHU. 0 USD de APC obligatorio.'
    },
    availableDiscounts: [
      {
        id: 'hc-diamond',
        type: 'diamond_funded',
        title: 'Acceso Abierto Diamante Público',
        description: 'Financiada por la Universidad del País Vasco.',
        discountPercentage: 100,
        isAutomatic: true,
        conditions: 'Universal.',
        evidenceUrl: 'https://ojs.ehu.eus/index.php/HC/about'
      }
    ],
    indexingDatabases: [
      { name: 'Scopus', verified: true },
      { name: 'DOAJ', verified: true },
      { name: 'Dialnet', verified: true },
      { name: 'Latindex Catálogo 2.0', verified: true }
    ],
    verificationStatus: 'verified',
    lastVerificationDate: '2024-10-12',
    verificationNotes: 'Datos contrastados con portal OJS de la UPV/EHU.',
    sources: [
      {
        title: 'Directrices editoriales Historia Contemporánea',
        type: 'fee_policy',
        url: 'https://ojs.ehu.eus/index.php/HC/about',
        lastCheckedDate: '2024-10-12',
        verifiedDataPoints: ['0 APC', 'Diamond OA']
      }
    ],
    averageReviewWeeks: 14,
    acceptanceRatePercent: 24
  },

  // 17. Digital Scholarship in the Humanities (Oxford University Press) - HYBRID Q1, FORMAT-FREE
  {
    id: 'dsh-oxford',
    title: 'Digital Scholarship in the Humanities',
    issn: '2055-7671',
    eissn: '2055-768X',
    publisher: 'Oxford University Press / EADH',
    publisherUrl: 'https://academic.oup.com',
    journalUrl: 'https://academic.oup.com/dsh',
    instructionsUrl: 'https://academic.oup.com/dsh/pages/General_Instructions',
    feePolicyUrl: 'https://academic.oup.com/pages/open-research/open-access',
    quartiles: [
      { source: 'JCR (Clarivate)', quartile: 'Q1', category: 'Humanities, Multidisciplinary', year: 2023, metricLabel: 'JIF 2.1' },
      { source: 'Scopus (SJR)', quartile: 'Q1', category: 'Literature and Literary Theory', year: 2023, metricLabel: 'SJR 0.58' }
    ],
    primaryDiscipline: 'Humanidades y Arte',
    subDisciplines: ['Humanidades Digitales', 'Lingüística Computacional', 'Análisis de Textos', 'Patrimonio Digital'],
    scopeType: 'broad_specialized',
    scopeDescription: 'Aplicación de métodos computacionales, inteligencia artificial, minería de textos y modelado digital a la investigación en humanidades y literatura.',
    sampleTopics: ['humanidades digitales', 'analisis de texto', 'linguistica de corpus', 'patrimonio cultural', 'mineria de datos historicos', 'edicion digital'],
    acceptedArticleTypes: ['Investigación original', 'Revisión', 'Artículo metodológico'],
    languages: ['Inglés'],
    publicationModel: 'hybrid',
    isDiamondOA: false,
    formatFreeSubmission: 'confirmed',
    formatFreeDetails: 'OUP permite envío inicial libre de formato rígido (solo exige numeración de líneas y citas consistentes).',
    listAPC: {
      amount: 3250,
      currency: 'USD',
      usdEquivalent: 3250,
      exchangeRateUsed: 1.0,
      rateDate: '2024-10-01',
      mandatoryOtherFeesUSD: 0,
      notes: 'La publicación tradicional bajo suscripción de Oxford University Press no cobra ningún APC obligatorio (0 USD).'
    },
    availableDiscounts: [
      {
        id: 'oup-trad-zero',
        type: 'general_discount',
        title: 'Publicación por suscripción tradicional OUP (0 USD)',
        description: 'Publicación sin costes obligatorios de APC para el autor.',
        discountPercentage: 100,
        isAutomatic: true,
        conditions: 'Elegir vía de suscripción tradicional.',
        evidenceUrl: 'https://academic.oup.com/pages/open-research/open-access'
      },
      {
        id: 'oup-r4l-a',
        type: 'research4life',
        title: 'Oxford Developing Countries Waiver (100%)',
        description: 'Exención completa de APC para países elegibles.',
        discountPercentage: 100,
        isAutomatic: true,
        conditions: 'Países de bajos ingresos.',
        evidenceUrl: 'https://academic.oup.com/pages/open-research/open-access/charges-licensing-and-charges/waiver-policy'
      }
    ],
    indexingDatabases: [
      { name: 'Web of Science (JCR)', verified: true },
      { name: 'Scopus', verified: true }
    ],
    verificationStatus: 'verified',
    lastVerificationDate: '2024-10-14',
    verificationNotes: 'Datos contrastados con políticas de Oxford University Press 2024.',
    sources: [
      {
        title: 'Oxford Open Access Policies',
        type: 'fee_policy',
        url: 'https://academic.oup.com/pages/open-research/open-access',
        lastCheckedDate: '2024-10-14',
        verifiedDataPoints: ['0 USD suscripción', 'Waivers R4L']
      }
    ],
    averageReviewWeeks: 12,
    acceptanceRatePercent: 25
  },

  // 18. IEEE Access (IEEE) - FULL OA Q2, FORMAT-FREE INITIAL PDF
  {
    id: 'ieee-access',
    title: 'IEEE Access',
    issn: '2169-3536',
    publisher: 'IEEE (Institute of Electrical and Electronics Engineers)',
    publisherUrl: 'https://www.ieee.org',
    journalUrl: 'https://ieeeaccess.ieee.org',
    instructionsUrl: 'https://ieeeaccess.ieee.org/submitting-an-article/',
    feePolicyUrl: 'https://ieeeaccess.ieee.org/becoming-an-author/article-processing-charges/',
    quartiles: [
      { source: 'JCR (Clarivate)', quartile: 'Q2', category: 'Engineering, Electrical & Electronic', year: 2023, metricLabel: 'JIF 3.4' },
      { source: 'JCR (Clarivate)', quartile: 'Q2', category: 'Computer Science, Information Systems', year: 2023, metricLabel: 'JIF 3.4' },
      { source: 'Scopus (SJR)', quartile: 'Q1', category: 'Computer Networks and Communications', year: 2023, metricLabel: 'SJR 0.92' }
    ],
    primaryDiscipline: 'Ingeniería y Tecnología',
    subDisciplines: ['Telecomunicaciones', 'Electrónica', 'Internet de las Cosas', 'Ciberseguridad', 'Control y Automatización'],
    scopeType: 'general_multidisciplinary',
    scopeDescription: 'Revista interdisciplinar de acceso abierto sobre ingeniería electrónica, redes, telecomunicaciones, computación y física aplicada.',
    sampleTopics: ['redes 5g', 'internet de las cosas', 'ciberseguridad', 'sensores', 'procesamiento de senales', 'robotica', 'sistemas embebidos', 'telecomunicaciones'],
    acceptedArticleTypes: ['Investigación original', 'Revisión sistemática', 'Artículo metodológico'],
    languages: ['Inglés'],
    publicationModel: 'full_open_access',
    isDiamondOA: false,
    formatFreeSubmission: 'confirmed',
    formatFreeDetails: 'Acepta archivo PDF único en formato libre para la revisión por pares inicial, aunque recomienda la plantilla LaTeX/Word de IEEE para acelerar la maquetación final.',
    listAPC: {
      amount: 1950,
      currency: 'USD',
      usdEquivalent: 1950,
      exchangeRateUsed: 1.0,
      rateDate: '2024-10-01',
      mandatoryOtherFeesUSD: 0,
      notes: 'APC estándar de $1,950 USD. Descuentos para miembros IEEE (15%) y waivers para países Research4Life/Hinari.'
    },
    availableDiscounts: [
      {
        id: 'ieee-r4l-a',
        type: 'research4life',
        title: 'IEEE Waiver Programa Research4Life Grupo A (100%)',
        description: 'Exención del 100% de la cuota APC para autores correspondientes de países del Grupo A.',
        discountPercentage: 100,
        isAutomatic: true,
        conditions: 'Elegibilidad geográfica Research4Life.',
        evidenceUrl: 'https://open.ieee.org/index-overview/financial-support/'
      },
      {
        id: 'ieee-r4l-b',
        type: 'research4life',
        title: 'IEEE Descuento Research4Life Grupo B (50%)',
        description: 'Descuento del 50% ($975 USD) en el APC.',
        discountPercentage: 50,
        isAutomatic: true,
        conditions: 'Países Grupo B.',
        evidenceUrl: 'https://open.ieee.org/index-overview/financial-support/'
      },
      {
        id: 'ieee-member',
        type: 'society_member',
        title: 'Descuento Miembro IEEE (15%)',
        description: 'Descuento de $292.50 USD para miembros con membresía activa.',
        discountPercentage: 15,
        isAutomatic: true,
        conditions: 'Número de socio IEEE válido.',
        evidenceUrl: 'https://ieeeaccess.ieee.org/becoming-an-author/article-processing-charges/'
      }
    ],
    indexingDatabases: [
      { name: 'Web of Science (JCR)', verified: true },
      { name: 'Scopus', verified: true },
      { name: 'DOAJ', verified: true }
    ],
    verificationStatus: 'verified',
    lastVerificationDate: '2024-10-17',
    verificationNotes: 'Tarifas y condiciones comprobadas en el portal Open IEEE 2024.',
    sources: [
      {
        title: 'IEEE Access APC and Policies',
        type: 'fee_policy',
        url: 'https://ieeeaccess.ieee.org/becoming-an-author/article-processing-charges/',
        lastCheckedDate: '2024-10-17',
        verifiedDataPoints: ['APC 1,950 USD', 'Format-free PDF', 'Waivers R4L']
      }
    ],
    averageReviewWeeks: 5,
    acceptanceRatePercent: 29
  },

  // 19. Revista Española de Salud Pública (Ministerio de Sanidad) - DIAMOND OA Q3, 0 USD
  {
    id: 'resp-sanidad',
    title: 'Revista Española de Salud Pública',
    issn: '1135-5727',
    eissn: '2173-9110',
    publisher: 'Ministerio de Sanidad de España',
    publisherUrl: 'https://www.sanidad.gob.es',
    journalUrl: 'https://www.sanidad.gob.es/biblioPublic/publicaciones/recursos_propios/resp/home.htm',
    instructionsUrl: 'https://www.sanidad.gob.es/biblioPublic/publicaciones/recursos_propios/resp/normas.htm',
    feePolicyUrl: 'https://www.sanidad.gob.es/biblioPublic/publicaciones/recursos_propios/resp/quienes.htm',
    quartiles: [
      { source: 'Scopus (SJR)', quartile: 'Q3', category: 'Public Health, Environmental and Occupational Health', year: 2023, metricLabel: 'SJR 0.38' }
    ],
    primaryDiscipline: 'Ciencias de la Vida y Medicina',
    subDisciplines: ['Salud Pública', 'Epidemiología', 'Higiene', 'Prevención Sanitaria'],
    scopeType: 'broad_specialized',
    scopeDescription: 'Revista científica decana en España sobre vigilancia epidemiológica, promoción de la salud y administración sanitaria pública.',
    sampleTopics: ['vigilancia epidemiologica', 'salud publica', 'prevencion', 'vacunacion', 'salud laboral', 'salud comunitaria'],
    acceptedArticleTypes: ['Investigación original', 'Revisión sistemática', 'Nota de campo', 'Artículo especial'],
    languages: ['Español', 'Inglés'],
    publicationModel: 'full_open_access',
    isDiamondOA: true,
    formatFreeSubmission: 'partially_verified',
    formatFreeDetails: 'Envío en Word estándar con normas de estilo Vancouver, sin maquetación gráfica exigida en primer filtro.',
    listAPC: {
      amount: 0,
      currency: 'USD',
      usdEquivalent: 0,
      exchangeRateUsed: 1.0,
      rateDate: '2024-10-01',
      mandatoryOtherFeesUSD: 0,
      notes: 'Financiada íntegramente por el Ministerio de Sanidad. Sin coste para el autor (0 USD).'
    },
    availableDiscounts: [
      {
        id: 'resp-diamond',
        type: 'diamond_funded',
        title: 'Publicación Pública Oficial (0 USD)',
        description: 'Financiación pública estatal española.',
        discountPercentage: 100,
        isAutomatic: true,
        conditions: 'Universal.',
        evidenceUrl: 'https://www.sanidad.gob.es'
      }
    ],
    indexingDatabases: [
      { name: 'Scopus', verified: true },
      { name: 'PubMed / MEDLINE', verified: true },
      { name: 'DOAJ', verified: true },
      { name: 'SciELO', verified: true },
      { name: 'Dialnet', verified: true }
    ],
    verificationStatus: 'verified',
    lastVerificationDate: '2024-10-15',
    verificationNotes: 'Confirmado APC 0 USD en web oficial del Ministerio de Sanidad.',
    sources: [
      {
        title: 'Web oficial RESP Ministerio de Sanidad',
        type: 'fee_policy',
        url: 'https://www.sanidad.gob.es/biblioPublic/publicaciones/recursos_propios/resp/home.htm',
        lastCheckedDate: '2024-10-15',
        verifiedDataPoints: ['0 USD APC', 'Indexada en PubMed/Scopus']
      }
    ],
    averageReviewWeeks: 12,
    acceptanceRatePercent: 20
  },

  // 20. Journal of Informetrics (Elsevier) - HYBRID Q1, FORMAT-FREE CONFIRMED
  {
    id: 'journal-of-informetrics',
    title: 'Journal of Informetrics',
    issn: '1751-1577',
    publisher: 'Elsevier',
    publisherUrl: 'https://www.elsevier.com',
    journalUrl: 'https://www.sciencedirect.com/journal/journal-of-informetrics',
    instructionsUrl: 'https://www.sciencedirect.com/journal/journal-of-informetrics/publish/guide-for-authors',
    feePolicyUrl: 'https://www.elsevier.com/open-access/open-access-pricing',
    quartiles: [
      { source: 'JCR (Clarivate)', quartile: 'Q1', category: 'Information Science & Library Science', year: 2023, metricLabel: 'JIF 3.6' },
      { source: 'Scopus (SJR)', quartile: 'Q1', category: 'Library and Information Sciences', year: 2023, metricLabel: 'SJR 1.45' }
    ],
    primaryDiscipline: 'Ciencias Sociales',
    subDisciplines: ['Cienciometría', 'Bibliometría', 'Modelos Matemáticos en Ciencia', 'Evaluación de la Investigación'],
    scopeType: 'broad_specialized',
    scopeDescription: 'Revista líder sobre todos los aspectos métricos y matemáticos de la información, cienciometría, webometría y redes de colaboración científica.',
    sampleTopics: ['cienciometria', 'bibliometria', 'indices de citacion', 'redes de coautoria', 'evaluacion de investigacion', 'analisis de patentes'],
    acceptedArticleTypes: ['Investigación original', 'Artículo metodológico'],
    languages: ['Inglés'],
    publicationModel: 'hybrid',
    isDiamondOA: false,
    formatFreeSubmission: 'confirmed',
    formatFreeDetails: '«Your Paper Your Way» confirmado: documento único libre de formato para la primera revisión por pares.',
    listAPC: {
      amount: 3100,
      currency: 'USD',
      usdEquivalent: 3100,
      exchangeRateUsed: 1.0,
      rateDate: '2024-10-01',
      mandatoryOtherFeesUSD: 0,
      notes: 'La opción tradicional por suscripción tiene coste 0 USD de APC obligatorio.'
    },
    availableDiscounts: [
      {
        id: 'joi-sub-zero',
        type: 'general_discount',
        title: 'Publicación por suscripción tradicional (0 USD)',
        description: 'Vía tradicional de publicación de Elsevier sin coste para el autor.',
        discountPercentage: 100,
        isAutomatic: true,
        conditions: 'Elegir suscripción tradicional en la aceptación.',
        evidenceUrl: 'https://www.elsevier.com/open-access/open-access-pricing'
      },
      {
        id: 'joi-r4l-a',
        type: 'research4life',
        title: 'Research4Life Grupo A (100%)',
        description: 'Exención completa en caso de optar por Gold OA.',
        discountPercentage: 100,
        isAutomatic: true,
        conditions: 'Países Grupo A.',
        evidenceUrl: 'https://www.elsevier.com/about/policies-and-initiatives/pricing/waivers-and-discounts'
      }
    ],
    indexingDatabases: [
      { name: 'Web of Science (JCR)', verified: true },
      { name: 'Scopus', verified: true }
    ],
    verificationStatus: 'verified',
    lastVerificationDate: '2024-10-18',
    verificationNotes: 'Datos verificados en Elsevier ScienceDirect y JCR.',
    sources: [
      {
        title: 'Guide for Authors Journal of Informetrics',
        type: 'author_guidelines',
        url: 'https://www.sciencedirect.com/journal/journal-of-informetrics/publish/guide-for-authors',
        lastCheckedDate: '2024-10-18',
        verifiedDataPoints: ['Your Paper Your Way', '0 USD suscripción']
      }
    ],
    averageReviewWeeks: 9,
    acceptanceRatePercent: 19
  }
];
