import { describe, expect, it } from 'vitest';
import { PRICE_TBD_LABEL, formatClubPrice, formatClubPricePerDay } from '../config/pricing';

describe('precio del Club', () => {
  it('sin precio muestra "Precio por definir" y no calcula precio por día', () => {
    expect(formatClubPrice(null)).toBe(PRICE_TBD_LABEL);
    expect(formatClubPricePerDay(null)).toBeNull();
  });

  it('con precio formatea en COP y calcula el precio aproximado por día (30 días)', () => {
    expect(formatClubPrice(49900).replace(/\s/g, ' ')).toMatch(/49\.900/);
    expect(formatClubPricePerDay(49900)?.replace(/\s/g, ' ')).toMatch(/1\.663/);
  });
});
