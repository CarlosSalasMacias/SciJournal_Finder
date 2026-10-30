import React from 'react';
import { useEscapeKey } from '../utils/useEscapeKey';
import { X, ShieldCheck, HelpCircle, DollarSign, FileCheck, Layers, BookOpen, ExternalLink, CheckCircle2 } from 'lucide-react';

interface MethodologyModalProps {
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ onClose }) => {
  useEscapeKey(onClose);
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-labelledby="methodology-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 id="methodology-title" className="text-base font-bold text-white">
              Metodología, Fuentes y Guía de Verificación Editorial
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Cerrar guía"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
          
          {/* 1. Modalidades Económicas */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center">
              <DollarSign className="w-4 h-4 mr-1.5 text-emerald-600" />
              1. Clasificación Económica Rigurosa de las Revistas
            </h3>
            <p>
              En el ámbito editorial científico es un error calificar una revista simplemente como «gratuita».
              Esta herramienta distingue con exactitud las tres modalidades existentes:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">
                  Vía Tradicional por Suscripción
                </span>
                <p className="text-slate-600">
                  El autor <strong>no paga ningún APC obligatorio (0 USD)</strong>. Los lectores acceden mediante suscripción institucional. No es de acceso abierto directo, aunque permite el autoarchivo (Green OA) en repositorios institucionales según la política del editor.
                </p>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200">
                <span className="font-bold text-blue-900 block mb-1">
                  Revista Híbrida
                </span>
                <p className="text-blue-950/80">
                  Ofrece <strong>doble vía</strong>: publicar sin coste alguno por suscripción tradicional (0 USD) o pagar un APC voluntario (Open Choice) para que el artículo sea de acceso abierto inmediato.
                </p>
              </div>

              <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200">
                <span className="font-bold text-teal-900 block mb-1">
                  Acceso Abierto Diamante (0 USD)
                </span>
                <p className="text-teal-950/80">
                  Revistas 100% de Acceso Abierto <strong>financiadas por universidades, ministerios o consorcios públicos</strong> (CSIC, universidades públicas, fundaciones). Ni el autor paga APC ni el lector paga suscripción.
                </p>
              </div>
            </div>
          </section>

          {/* 2. ¿Qué significa "Formato Libre" en Envío Inicial? */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center">
              <FileCheck className="w-4 h-4 mr-1.5 text-indigo-600" />
              2. Formato Libre en Envío Inicial («Your Paper Your Way»)
            </h3>
            <p>
              Muchos investigadores invierten días maquetando un manuscrito en plantillas específicas (.dotx, LaTeX) para ser rechazados antes de la revisión por pares.
              Las revistas marcadas con <strong className="text-indigo-700">Formato Libre Confirmado</strong> aplican políticas como <em>Your Paper Your Way</em> (Elsevier), <em>Format-free submission</em> (Springer Nature, IOP Publishing, PLOS):
            </p>
            <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-200 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-indigo-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>¿Qué se permite en el envío inicial?</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>Presentar el manuscrito en un único archivo (Word o PDF) sin importar márgenes o tipografía.</li>
                <li>Referencias en cualquier formato estándar y legible (APA, Vancouver, Harvard, IEEE), sin exigir estilo editorial exacto en esta etapa.</li>
                <li>Figuras y tablas incrustadas en el texto o al final.</li>
                <li><strong>Requisito estricto:</strong> Solo cuando el manuscrito supera la revisión y pasa a fase de aceptación se solicita adaptar el texto a la plantilla y maquetación final.</li>
              </ul>
            </div>
          </section>

          {/* 3. Cálculo de Costes y Exenciones */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center">
              <DollarSign className="w-4 h-4 mr-1.5 text-emerald-600" />
              3. Regla de Cálculo y Presupuesto Máximo
            </h3>
            <div className="p-3 bg-slate-900 text-white rounded-xl font-mono text-[11px]">
              Coste Final = APC Aplicable − Descuentos Confirmados − Exenciones Confirmadas + Tasas Adicionales
            </div>
            <p>
              Una revista solo se clasifica como <strong>«dentro del presupuesto (confirmado)»</strong> cuando, con el presupuesto elegido en el buscador:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>El APC de lista es menor o igual al presupuesto (ej. revistas de sociedades como SESPAS o cuotas reducidas).</li>
              <li>O es una revista de suscripción / Diamante donde el coste obligatorio comprobado es de 0 USD.</li>
              <li>O el autor pertenece a un país con exención automática verificada (ej. Research4Life Grupo A: 100% exención, Grupo B: 50% de descuento o tarifa plana en PLOS/Elsevier).</li>
              <li><strong>Condicionado a solicitud:</strong> las exenciones discrecionales (la editorial las concede o las niega caso a caso) <strong>no se restan del coste estimado</strong>. Si con ella la revista cabría en el presupuesto, se muestra como «condicionado» y se ordena después de las que caben sin condiciones.</li>
              <li><strong>Coste sin verificar:</strong> las fichas automáticas de SCImago no incluyen el importe del APC. Se muestran aparte y pueden ocultarse desde los filtros.</li>
            </ul>
          </section>

          {/* 4. Fuentes Primarias y Verificabilidad */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center">
              <Layers className="w-4 h-4 mr-1.5 text-indigo-600" />
              4. Fuentes Primarias Consultadas
            </h3>
            <p>
              La base combina dos tipos de fichas:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li><strong>Cuartiles Oficiales:</strong> Scopus (SJR y CiteScore de Elsevier) y Journal Citation Reports (Clarivate JCR). Dialnet se incluye únicamente como base de indexación bibliográfica española/iberoamericana, dado que <strong>no calcula Factor de Impacto (JIF) ni cuartiles internacionales oficiales</strong>.</li>
              <li><strong>Fichas revisadas a mano:</strong> un grupo reducido de revistas con APC, descuentos, formato de envío y enlaces comprobados en las webs oficiales, con fecha de verificación.</li>
              <li><strong>Fichas automáticas (SCImago Journal &amp; Country Rank 2025):</strong> todas las revistas con mejor cuartil Q1–Q3 de Scopus. Solo están respaldados el cuartil por categoría, el SJR, el índice H, el país, el área temática y la condición de acceso abierto / Diamante (procedente de DOAJ). El coste, el formato de envío, los idiomas y los tipos de artículo <strong>no están verificados</strong>.</li>
              <li><strong>Normas y formato:</strong> Guías oficiales de autores (Guide for Authors) alojadas en los dominios de los comités editoriales de cada revista.</li>
              <li><strong>Tarifarios y exenciones:</strong> Listados de APC de Elsevier, Springer Nature, Oxford University Press, IEEE, BMJ y DOAJ.</li>
            </ul>
          </section>

          {/* 5. Afinidad temática */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center">
              <Layers className="w-4 h-4 mr-1.5 text-indigo-600" />
              5. Cómo se Calcula la Afinidad Temática
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Se comparan las palabras del título, resumen y palabras clave con el título, alcance y categorías de cada revista, por raíz de palabra (education ≈ educational).</li>
              <li>Un glosario de términos académicos traduce del español al inglés para que un manuscrito en español encaje con las categorías de SCImago, que están en inglés.</li>
              <li>Suman puntos la disciplina (principal o secundaria), el tipo de artículo aceptado y el idioma de publicación cuando la revista lo informa.</li>
              <li>Por defecto se ocultan las revistas sin ningún término en común con el manuscrito; puede mostrarlas desde los filtros.</li>
              <li>Es una comparación de palabras, no un análisis semántico: revise siempre el alcance (Aims &amp; Scope) de la revista antes de enviar.</li>
            </ul>
          </section>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
