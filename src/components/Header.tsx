import React from 'react';
import { BookOpen, ShieldCheck, Sliders } from 'lucide-react';

interface HeaderProps {
  onOpenMethodology: () => void;
  onOpenWeights: () => void;
  totalJournals: number;
  filteredCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMethodology,
  onOpenWeights,
  totalJournals,
  filteredCount
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Minimalist Title */}
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight">
                SciJournal Finder
              </h1>
              <p className="text-xs text-slate-500">
                revistas Q1-Q3 de bajo costo
              </p>
            </div>
          </div>

          {/* Quick Actions & Navigation */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Configurar ponderaciones */}
            <button
              type="button"
              onClick={onOpenWeights}
              className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              Ponderaciones
            </button>

            {/* Guía de Verificación */}
            <button
              type="button"
              onClick={onOpenMethodology}
              className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              Criterios & Fuentes
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
