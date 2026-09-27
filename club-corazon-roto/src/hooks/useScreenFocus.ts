import { useEffect, useRef } from 'react';

/**
 * Al cambiar de pantalla: scroll arriba y foco en el título principal,
 * para que lectores de pantalla anuncien la nueva pantalla.
 */
export function useScreenFocus<T extends HTMLElement>(screenKey: string) {
  const ref = useRef<T>(null);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    ref.current?.focus({ preventScroll: true });
  }, [screenKey]);
  return ref;
}
