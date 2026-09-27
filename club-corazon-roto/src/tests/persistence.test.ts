import { describe, expect, it } from 'vitest';
import { ROUTE_PRESETS } from '../dev/presets';
import { createInitialState, finalizeAnswers } from '../logic/quizReducer';
import { STORAGE_KEY, clearState, loadState, saveState } from '../storage/persistence';
import type { QuizState } from '../types/quiz';

describe('persistencia en localStorage', () => {
  it('guarda y rehidrata el estado completo', () => {
    const state: QuizState = {
      ...createInitialState(),
      screen: 'Q5',
      answers: { ...createInitialState().answers, goal_now: 'worth_waiting', contact_level: 'frequent' },
    };
    saveState(state);
    expect(loadState()).toEqual(state);
  });

  it('genera un case_id con formato UUID', () => {
    expect(createInitialState().answers.case_id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });

  it('devuelve null con JSON corrupto o versión distinta', () => {
    window.localStorage.setItem(STORAGE_KEY, '{no-json');
    expect(loadState()).toBeNull();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...createInitialState(), version: 999 }));
    expect(loadState()).toBeNull();
  });

  it('clearState elimina el estado', () => {
    saveState(createInitialState());
    clearState();
    expect(loadState()).toBeNull();
  });

  it('una pantalla de resultado sin ruta se recalcula al rehidratar', () => {
    const base = createInitialState();
    const answers = { ...base.answers, ...ROUTE_PRESETS.R4 };
    saveState({ ...base, answers, screen: 'club' });
    const loaded = loadState();
    expect(loaded?.screen).toBe('club');
    expect(loaded?.answers.route).toBe('R4');
  });

  it('una pantalla guardada de una versión anterior (deepen/bridge) vuelve al resultado', () => {
    const base = createInitialState();
    const answers = finalizeAnswers({ ...base.answers, ...ROUTE_PRESETS.R2 });
    for (const legacy of ['deepen', 'bridge']) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...base, answers, screen: legacy }));
      expect(loadState()?.screen).toBe('result');
    }
  });

  it('una pantalla que ya no existe en el flujo se corrige', () => {
    const base = createInitialState();
    const answers = finalizeAnswers({ ...base.answers, ...ROUTE_PRESETS.R0 });
    saveState({ ...base, answers, screen: 'club' });
    expect(loadState()?.screen).toBe('result');
  });
});
