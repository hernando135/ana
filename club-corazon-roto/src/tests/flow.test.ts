import { describe, expect, it } from 'vitest';
import { getFlow, getNextScreen, getPrevScreen, getProgress, getQuizScreens } from '../logic/flow';
import { createInitialState, quizReducer, type QuizAction } from '../logic/quizReducer';
import type { QuizState } from '../types/quiz';

const run = (actions: QuizAction[], from: QuizState = createInitialState()) =>
  actions.reduce(quizReducer, from);

const answer = (field: Extract<QuizAction, { type: 'ANSWER' }>['field'], value: string): QuizAction[] => [
  { type: 'ANSWER', field, value },
  { type: 'NEXT' },
];

describe('flujo condicional', () => {
  it('con contacto muestra Q5-Q8 y T2', () => {
    expect(getQuizScreens({ contact_level: 'frequent', cycle_count: 'once' })).toEqual([
      'Q1', 'Q2', 'Q3', 'T1', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'T2', 'Q9', 'Q10', 'Q11', 'Q12', 'Q13', 'Q14',
    ]);
  });

  it('sin contacto salta Q5-Q8 y T2; Q9 never salta Q10', () => {
    expect(getQuizScreens({ contact_level: 'none', cycle_count: 'never' })).toEqual([
      'Q1', 'Q2', 'Q3', 'T1', 'Q4', 'Q9', 'Q11', 'Q12', 'Q13', 'Q14',
    ]);
  });

  it('Q4 = none avanza directamente a Q9', () => {
    expect(getNextScreen('Q4', { contact_level: 'none' })).toBe('Q9');
  });

  it('Q9 = never avanza directamente a Q11', () => {
    expect(getNextScreen('Q9', { cycle_count: 'never' })).toBe('Q11');
  });

  it('atrás desde Q9 sin contacto vuelve a Q4', () => {
    expect(getPrevScreen('Q9', { contact_level: 'none' })).toBe('Q4');
  });

  it('R0 no continúa hacia profundización ni Club', () => {
    expect(getFlow({ route: 'R0' }).slice(-2)).toEqual(['processing', 'result']);
    expect(getFlow({ route: 'R3' }).slice(-4)).toEqual(['processing', 'result', 'club', 'checkout']);
  });

  it('el progreso se calcula sobre las pantallas reales (sin saltadas)', () => {
    expect(getProgress('Q14', { contact_level: 'none', cycle_count: 'never' })).toBe(1);
    expect(getProgress('Q9', { contact_level: 'none', cycle_count: 'never' })).toBeCloseTo(6 / 10);
  });
});

describe('reducer', () => {
  it('no permite avanzar sin responder', () => {
    const s = run([{ type: 'START' }, { type: 'NEXT' }]);
    expect(s.screen).toBe('Q1');
  });

  it('Q14 no avanza con nombre inválido', () => {
    const s = run([{ type: 'SET_NAME', name: 'A' }, { type: 'NEXT' }], { ...createInitialState(), screen: 'Q14' });
    expect(s.screen).toBe('Q14');
  });

  it('recorrido completo sin contacto llega a R5 EARLY', () => {
    let s = run([
      { type: 'START' },
      ...answer('goal_now', 'wasting_time'),
      ...answer('who_ended', 'he_ended'),
      ...answer('time_since_breakup', 'less_7_days'),
      { type: 'NEXT' }, // T1
      ...answer('contact_level', 'none'),
    ]);
    expect(s.screen).toBe('Q9');
    s = run(
      [
        ...answer('cycle_count', 'never'),
        ...answer('main_pain', 'stuck'),
        ...answer('return_position', 'ambivalent'),
        { type: 'TOGGLE_SAFETY', option: 'none_of_these' },
        { type: 'NEXT' },
        { type: 'SET_NAME', name: 'Ana' },
        { type: 'NEXT' },
      ],
      s,
    );
    expect(s.screen).toBe('processing');
    s = run([{ type: 'FINALIZE' }, { type: 'NEXT' }], s);
    expect(s.screen).toBe('result');
    expect(s.answers.route).toBe('R5');
    expect(s.answers.timing).toBe('EARLY');
    expect(s.billing).toEqual({ payment_status: 'unpaid', subscription_status: 'inactive', access_status: 'locked' });
  });

  it('volver a Q4 y pasar de none a contacto obliga a responder Q5 de nuevo', () => {
    let s = run([
      { type: 'START' },
      ...answer('goal_now', 'wasting_time'),
      ...answer('who_ended', 'he_ended'),
      ...answer('time_since_breakup', '1_3_months'),
      { type: 'NEXT' },
      ...answer('contact_level', 'none'),
      { type: 'BACK' },
    ]);
    expect(s.screen).toBe('Q4');
    s = run(answer('contact_level', 'occasional'), s);
    expect(s.screen).toBe('Q5');
    expect(s.answers.contact_initiator).toBeUndefined();
    // No puede avanzar sin responder Q5
    s = run([{ type: 'NEXT' }], s);
    expect(s.screen).toBe('Q5');
  });

  it('FINALIZE con respuestas incompletas vuelve a la primera pantalla sin responder', () => {
    const s = run([{ type: 'FINALIZE' }], { ...createInitialState(), screen: 'processing' });
    expect(s.screen).toBe('Q1');
    expect(s.answers.route).toBeUndefined();
  });

  it('desde el resultado no se puede volver al quiz', () => {
    expect(getPrevScreen('result', { route: 'R2' })).toBeNull();
    expect(getPrevScreen('club', { route: 'R2' })).toBe('result');
  });
});
