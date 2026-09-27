import { describe, expect, it } from 'vitest';
import {
  applySafety,
  applySingleAnswer,
  computeSafetyFlag,
  isValidName,
  toggleSafetyOption,
} from '../logic/answers';
import { createInitialAnswers } from '../logic/quizReducer';
import { deriveTiming } from '../logic/timing';
import type { QuizAnswers } from '../types/quiz';

const withContact = (): QuizAnswers => ({
  ...createInitialAnswers('2026-01-01T00:00:00.000Z'),
  contact_level: 'frequent',
  contact_initiator: 'mostly_him',
  without_user_initiating: 'he_contacts',
  return_conversation: 'both_want_return',
  repair_actions: 'some_concrete',
});

describe('timing', () => {
  it.each([
    ['less_7_days', 'EARLY'],
    ['1_4_weeks', 'RECENT'],
    ['1_3_months', 'MEDIUM'],
    ['3_6_months', 'LONG'],
    ['6_12_months', 'LONG'],
    ['more_1_year', 'LONG'],
  ] as const)('%s → %s', (time, timing) => {
    expect(deriveTiming(time)).toBe(timing);
  });

  it('se deriva al responder Q3 y se actualiza al cambiarla', () => {
    let a = applySingleAnswer(createInitialAnswers(), 'time_since_breakup', 'less_7_days');
    expect(a.timing).toBe('EARLY');
    a = applySingleAnswer(a, 'time_since_breakup', '3_6_months');
    expect(a.timing).toBe('LONG');
  });
});

describe('Q4 limpia/asigna Q5-Q8', () => {
  it('cambiar Q4 a none borra Q5-Q8 y asigna valores automáticos', () => {
    const a = applySingleAnswer(withContact(), 'contact_level', 'none');
    expect(a).toMatchObject({
      contact_level: 'none',
      contact_initiator: 'no_contact',
      without_user_initiating: 'not_applicable',
      return_conversation: 'not_talking',
      repair_actions: 'none',
    });
  });

  it('volver de none a una opción con contacto elimina los valores automáticos', () => {
    const none = applySingleAnswer(withContact(), 'contact_level', 'none');
    const back = applySingleAnswer(none, 'contact_level', 'occasional');
    expect(back.contact_level).toBe('occasional');
    expect(back.contact_initiator).toBeUndefined();
    expect(back.without_user_initiating).toBeUndefined();
    expect(back.return_conversation).toBeUndefined();
    expect(back.repair_actions).toBeUndefined();
  });

  it('cambiar entre opciones con contacto conserva Q5-Q8', () => {
    const a = applySingleAnswer(withContact(), 'contact_level', 'very_little');
    expect(a.contact_initiator).toBe('mostly_him');
    expect(a.repair_actions).toBe('some_concrete');
  });

  it('cualquier cambio invalida la ruta calculada', () => {
    const a = applySingleAnswer({ ...withContact(), route: 'R1' }, 'contact_level', 'none');
    expect(a.route).toBeUndefined();
  });
});

describe('Q9 limpia/asigna Q10', () => {
  const cycled = (): QuizAnswers => ({
    ...createInitialAnswers(),
    cycle_count: 'many',
    after_reconnection: 'sex_confusion',
  });

  it('cambiar Q9 a never borra Q10 y asigna not_applicable', () => {
    const a = applySingleAnswer(cycled(), 'cycle_count', 'never');
    expect(a.after_reconnection).toBe('not_applicable');
  });

  it('cambiar de never a una opción con acercamientos elimina not_applicable', () => {
    const never = applySingleAnswer(cycled(), 'cycle_count', 'never');
    const once = applySingleAnswer(never, 'cycle_count', 'once');
    expect(once.after_reconnection).toBeUndefined();
  });

  it('cambiar entre opciones con acercamientos conserva Q10', () => {
    const a = applySingleAnswer(cycled(), 'cycle_count', 'two_three');
    expect(a.after_reconnection).toBe('sex_confusion');
  });
});

describe('Q13 seguridad', () => {
  it('"Ninguna de estas" desmarca A-E', () => {
    expect(toggleSafetyOption(['threatened', 'fear_of_reaction'], 'none_of_these')).toEqual([
      'none_of_these',
    ]);
  });

  it('marcar A-E desmarca "Ninguna de estas"', () => {
    expect(toggleSafetyOption(['none_of_these'], 'control_surveillance')).toEqual([
      'control_surveillance',
    ]);
  });

  it('permite varias opciones A-E y desmarcar', () => {
    let s = toggleSafetyOption([], 'threatened');
    s = toggleSafetyOption(s, 'physical_harm');
    expect(s).toEqual(['threatened', 'physical_harm']);
    s = toggleSafetyOption(s, 'threatened');
    expect(s).toEqual(['physical_harm']);
  });

  it('safety_flag es true con cualquier A-E y false con F o vacío', () => {
    expect(computeSafetyFlag(['sexual_coercion'])).toBe(true);
    expect(computeSafetyFlag(['none_of_these'])).toBe(false);
    expect(computeSafetyFlag([])).toBe(false);
    expect(applySafety(createInitialAnswers(), ['fear_of_reaction']).safety_flag).toBe(true);
  });
});

describe('nombre', () => {
  it('requiere mínimo 2 caracteres sin contar espacios', () => {
    expect(isValidName('A')).toBe(false);
    expect(isValidName('  A  ')).toBe(false);
    expect(isValidName('Al')).toBe(true);
  });
});
