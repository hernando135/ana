/**
 * Precio mensual del Club en pesos colombianos.
 * `null` muestra "Precio por definir". Cambia SOLO este valor
 * (p. ej. 49900) para mostrar un precio en todo el producto.
 */
export const CLUB_PRICE_COP: number | null = null;

/** Días del periodo de la membresía (para el precio aproximado por día). */
export const CLUB_PERIOD_DAYS = 30;

export const PRICE_TBD_LABEL = 'Precio por definir';

const COP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export function formatClubPrice(price: number | null = CLUB_PRICE_COP): string {
  return price === null ? PRICE_TBD_LABEL : COP.format(price);
}

/** Precio aproximado por día, o null si el precio no está definido. */
export function formatClubPricePerDay(price: number | null = CLUB_PRICE_COP): string | null {
  return price === null ? null : COP.format(Math.round(price / CLUB_PERIOD_DAYS));
}
