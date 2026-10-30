import { useEffect } from 'react';

/** Ejecuta `onEscape` al pulsar la tecla Escape (para cerrar ventanas emergentes). */
export function useEscapeKey(onEscape: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onEscape(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onEscape]);
}
