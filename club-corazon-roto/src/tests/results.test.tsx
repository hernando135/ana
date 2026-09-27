import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DEEPEN, GOAL_PERSONALIZATION, getResultContent, type NormalRouteId } from '../data/results';
import { DeepenScreen } from '../screens/DeepenScreen';
import { ResultScreen } from '../screens/ResultScreen';
import type { GoalNow } from '../types/quiz';

const ROUTES: NormalRouteId[] = ['R1', 'R2', 'R3', 'R4', 'R5'];
const noop = () => {};

describe('pantallas de resultado', () => {
  it.each(ROUTES)('%s tiene título propio con el nombre y su profundización de 3 puntos', (route) => {
    render(<ResultScreen route={route} timing="MEDIUM" firstName="Laura" goal="possible_return" onContinue={noop} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(getResultContent(route, 'MEDIUM').title('Laura'));
    expect(screen.getByRole('heading', { level: 1 }).textContent?.startsWith('Laura, ')).toBe(true);
    expect(DEEPEN[route].items).toHaveLength(3);
  });

  it('los títulos de las 5 rutas son distintos', () => {
    const titles = new Set(ROUTES.map((r) => getResultContent(r, 'LONG').title('X')));
    expect(titles.size).toBe(5);
  });

  it('R5 normal vs R5 EARLY', () => {
    expect(getResultContent('R5', 'LONG').title('Ana')).toBe(
      'Ana, hoy la relación está detenida en los hechos, aunque emocionalmente tú todavía sigas ahí.',
    );
    for (const t of ['RECENT', 'MEDIUM', 'LONG'] as const) {
      expect(getResultContent('R5', t).title('Ana')).toContain('detenida en los hechos');
    }
    expect(getResultContent('R5', 'EARLY').title('Ana')).toBe('Ana, ahora mismo no hay una reconciliación en marcha.');
    // EARLY solo afecta a R5
    expect(getResultContent('R3', 'EARLY')).toBe(getResultContent('R3', 'LONG'));
  });

  it.each(Object.entries(GOAL_PERSONALIZATION) as [GoalNow, string][])(
    'personalización Q1 %s',
    (goal, text) => {
      render(<ResultScreen route="R2" timing="LONG" firstName="Ana" goal={goal} onContinue={noop} />);
      expect(screen.getByText(text)).toBeInTheDocument();
    },
  );

  it('la profundización muestra 3 puntos numerados', () => {
    render(<DeepenScreen route="R4" onContinue={noop} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Antes de volver otra vez, mira estas 3 cosas');
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('ningún texto afirma lo que siente él o probabilidades', () => {
    const all = JSON.stringify({ DEEPEN, GOAL_PERSONALIZATION, r: ROUTES.map((r) => getResultContent(r)) });
    for (const banned of ['te ama', 'va a volver.', '%']) {
      expect(all.toLowerCase()).not.toContain(banned);
    }
  });
});
