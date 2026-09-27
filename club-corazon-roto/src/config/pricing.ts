/**
 * Precio mensual del Club en pesos colombianos.
 * `null` muestra "Precio por definir". Cambia SOLO este valor
 * (p. ej. 49900) para mostrar un precio en todo el producto.
 */
export const CLUB_PRICE_COP: number | null = null;

export const PRICE_TBD_LABEL = 'Precio por definir';

export function formatClubPrice(price: number | null = CLUB_PRICE_COP): string {
  if (price === null) return PRICE_TBD_LABEL;
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(price);
}
