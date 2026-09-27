import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  DEEPEN,
  GOAL_PERSONALIZATION,
  WHO_ENDED_PERSONALIZATION,
  getResultContent,
  type NormalRouteId,
} from '../data/results';
import { ResultScreen } from '../screens/ResultScreen';
import type { GoalNow, WhoEnded } from '../types/quiz';

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

  it.each(Object.entries(WHO_ENDED_PERSONALIZATION) as [WhoEnded, string][])(
    'personalización Q2 %s junto a la de Q1',
    (whoEnded, text) => {
      render(<ResultScreen route="R3" timing="LONG" firstName="Ana" goal="wasting_time" whoEnded={whoEnded} onContinue={noop} />);
      expect(screen.getByText(text)).toBeInTheDocument();
      expect(screen.getByText(GOAL_PERSONALIZATION.wasting_time)).toBeInTheDocument();
    },
  );

  it.each(ROUTES)('%s muestra sus 3 puntos en la misma pantalla del resultado', (route) => {
    render(<ResultScreen route={route} timing="LONG" firstName="Ana" goal="wasting_time" onContinue={noop} />);
    expect(screen.getByRole('heading', { level: 2, name: DEEPEN[route].title })).toBeInTheDocument();
    for (const item of DEEPEN[route].items) expect(screen.getByText(item)).toBeInTheDocument();
  });

  it('el CTA primero lleva a los 3 puntos y después avanza', () => {
    let advanced = 0;
    render(<ResultScreen route="R4" timing="LONG" firstName="Ana" onContinue={() => advanced++} />);
    fireEvent.click(screen.getByRole('button', { name: '¿QUÉ DEBERÍA MIRAR AHORA?' }));
    expect(advanced).toBe(0);
    expect(screen.getByRole('heading', { level: 2, name: DEEPEN.R4.title })).toHaveFocus();
    fireEvent.click(screen.getByRole('button', { name: 'SEGUIR' }));
    expect(advanced).toBe(1);
  });

  it('ningún texto afirma lo que siente él o probabilidades', () => {
    const all = JSON.stringify({ DEEPEN, GOAL_PERSONALIZATION, WHO_ENDED_PERSONALIZATION, r: ROUTES.map((r) => getResultContent(r)) });
    for (const banned of ['te ama', 'va a volver.', '%']) {
      expect(all.toLowerCase()).not.toContain(banned);
    }
  });
});
