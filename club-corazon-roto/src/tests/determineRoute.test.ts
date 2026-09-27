import { describe, expect, it } from 'vitest';
import { determineRoute } from '../logic/determineRoute';
import type { QuizAnswers } from '../types/quiz';

type RouteAnswers = Parameters<typeof determineRoute>[0];

describe('determineRoute — casos obligatorios', () => {
  it('TEST 1 → R1', () => {
    expect(
      determineRoute({
        contact_level: 'frequent',
        contact_initiator: 'both',
        without_user_initiating: 'he_contacts',
        return_conversation: 'both_want_return',
        repair_actions: 'concrete_sustained',
        cycle_count: 'never',
        after_reconnection: 'not_applicable',
        safety_flag: false,
      }),
    ).toBe('R1');
  });

  it('TEST 2 → R2', () => {
    expect(
      determineRoute({
        contact_level: 'frequent',
        contact_initiator: 'both',
        without_user_initiating: 'he_contacts',
        return_conversation: 'misses_no_return',
        repair_actions: 'mostly_words',
        cycle_count: 'never',
        after_reconnection: 'not_applicable',
        safety_flag: false,
      }),
    ).toBe('R2');
  });

  it('TEST 3 → R3', () => {
    expect(
      determineRoute({
        contact_level: 'occasional',
        contact_initiator: 'mostly_user',
        without_user_initiating: 'nothing',
        return_conversation: 'doesnt_know',
        repair_actions: 'none',
        cycle_count: 'never',
        after_reconnection: 'not_applicable',
        safety_flag: false,
      }),
    ).toBe('R3');
  });

  it('TEST 4 → R4', () => {
    expect(
      determineRoute({
        contact_level: 'occasional',
        contact_initiator: 'both',
        without_user_initiating: 'eventually_appears',
        return_conversation: 'misses_no_return',
        repair_actions: 'none',
        cycle_count: 'many',
        after_reconnection: 'sex_confusion',
        safety_flag: false,
      }),
    ).toBe('R4');
  });

  it('TEST 5 → R5', () => {
    expect(
      determineRoute({
        contact_level: 'none',
        contact_initiator: 'no_contact',
        without_user_initiating: 'not_applicable',
        return_conversation: 'not_talking',
        repair_actions: 'none',
        cycle_count: 'never',
        after_reconnection: 'not_applicable',
        safety_flag: false,
      }),
    ).toBe('R5');
  });

  it('TEST 6 → R4 (R4 tiene prioridad sobre R5)', () => {
    expect(
      determineRoute({
        contact_level: 'none',
        contact_initiator: 'no_contact',
        without_user_initiating: 'not_applicable',
        return_conversation: 'not_talking',
        repair_actions: 'none',
        cycle_count: 'many',
        after_reconnection: 'return_then_breakup',
        safety_flag: false,
      }),
    ).toBe('R4');
  });

  it('TEST 7 → R0 con cualquier combinación y safety_flag true', () => {
    const combos: RouteAnswers[] = [
      // Cumple R1
      {
        contact_level: 'frequent',
        contact_initiator: 'both',
        without_user_initiating: 'he_contacts',
        return_conversation: 'both_want_return',
        repair_actions: 'concrete_sustained',
        cycle_count: 'never',
        after_reconnection: 'not_applicable',
        safety_flag: true,
      },
      // Cumple R4
      {
        contact_level: 'occasional',
        contact_initiator: 'both',
        without_user_initiating: 'eventually_appears',
        return_conversation: 'misses_no_return',
        repair_actions: 'none',
        cycle_count: 'many',
        after_reconnection: 'sex_confusion',
        safety_flag: true,
      },
      // Cumple R5
      {
        contact_level: 'none',
        contact_initiator: 'no_contact',
        without_user_initiating: 'not_applicable',
        return_conversation: 'not_talking',
        repair_actions: 'none',
        cycle_count: 'never',
        after_reconnection: 'not_applicable',
        safety_flag: true,
      },
    ];
    for (const c of combos) expect(determineRoute(c)).toBe('R0');
  });
});

describe('determineRoute — casos de borde', () => {
  const r1Base: RouteAnswers = {
    contact_level: 'occasional',
    contact_initiator: 'mostly_him',
    without_user_initiating: 'he_contacts',
    return_conversation: 'both_want_return',
    repair_actions: 'some_concrete',
    cycle_count: 'never',
    after_reconnection: 'not_applicable',
    safety_flag: false,
  };

  it('R1 gana aunque haya muchos ciclos con patrón de R4 si hoy están reconstruyendo', () => {
    expect(
      determineRoute({ ...r1Base, cycle_count: 'many', after_reconnection: 'intense_then_cold' }),
    ).toBe('R1');
  });

  it('R1 exige acciones concretas: solo palabras no alcanza', () => {
    expect(determineRoute({ ...r1Base, repair_actions: 'mostly_words' })).toBe('R2');
  });

  it('R1 exige contacto frecuente u ocasional (very_little no alcanza)', () => {
    expect(determineRoute({ ...r1Base, contact_level: 'very_little' })).toBe('R2');
  });

  it('R1 no aplica si es ella quien busca más', () => {
    expect(determineRoute({ ...r1Base, contact_initiator: 'user_more' })).toBe('R2');
  });

  it('R4 requiere dos o más ciclos: "once" no activa R4', () => {
    expect(
      determineRoute({
        ...r1Base,
        return_conversation: 'misses_no_return',
        cycle_count: 'once',
        after_reconnection: 'sex_confusion',
      }),
    ).toBe('R2');
  });

  it('R4 requiere un patrón de reinicio: try_rebuild no activa R4', () => {
    expect(
      determineRoute({
        ...r1Base,
        return_conversation: 'misses_no_return',
        cycle_count: 'two_three',
        after_reconnection: 'try_rebuild',
      }),
    ).toBe('R2');
  });

  it('R4 gana sobre R3', () => {
    expect(
      determineRoute({
        contact_level: 'occasional',
        contact_initiator: 'mostly_user',
        without_user_initiating: 'nothing',
        return_conversation: 'doesnt_know',
        repair_actions: 'none',
        cycle_count: 'two_three',
        after_reconnection: 'intense_then_cold',
        safety_flag: false,
      }),
    ).toBe('R4');
  });

  it('R2 fallback: contacto sostenido por ambos, sin reconstrucción', () => {
    expect(
      determineRoute({
        contact_level: 'occasional',
        contact_initiator: 'both',
        without_user_initiating: 'only_meet',
        return_conversation: 'avoids_topic',
        repair_actions: 'cause_not_discussed',
        cycle_count: 'once',
        after_reconnection: 'contact_no_clarity',
        safety_flag: false,
      }),
    ).toBe('R2');
  });

  it('R2 fallback: ella busca más pero él termina apareciendo (no es R3)', () => {
    expect(
      determineRoute({
        contact_level: 'occasional',
        contact_initiator: 'user_more',
        without_user_initiating: 'eventually_appears',
        return_conversation: 'asks_for_time',
        repair_actions: 'none',
        cycle_count: 'never',
        after_reconnection: 'not_applicable',
        safety_flag: false,
      }),
    ).toBe('R2');
  });

  describe('R3 versus R5', () => {
    const veryLittle: RouteAnswers = {
      contact_level: 'very_little',
      contact_initiator: 'mostly_user',
      without_user_initiating: 'nothing',
      return_conversation: 'never_discussed_return',
      repair_actions: 'none',
      cycle_count: 'never',
      after_reconnection: 'not_applicable',
      safety_flag: false,
    };

    it('con contacto muy escaso sostenido por ella, R3 se evalúa antes que R5 caso B', () => {
      expect(determineRoute(veryLittle)).toBe('R3');
    });

    it('sin contacto (R5 caso A) nunca es R3, aunque se hubiera respondido distinto antes', () => {
      expect(
        determineRoute({
          ...veryLittle,
          contact_level: 'none',
          contact_initiator: 'no_contact',
          without_user_initiating: 'not_applicable',
          return_conversation: 'not_talking',
        }),
      ).toBe('R5');
    });

    it('contacto muy escaso pero él lo busca → no es R3 ni R5, es R2', () => {
      expect(
        determineRoute({ ...veryLittle, contact_initiator: 'mostly_him', without_user_initiating: 'he_contacts' }),
      ).toBe('R2');
    });

    it('R5 caso B (sin repair_actions definido) → R5', () => {
      const withoutRepair = { ...veryLittle };
      delete withoutRepair.repair_actions;
      expect(determineRoute(withoutRepair)).toBe('R5');
    });
  });

  it('es determinista: las mismas respuestas siempre dan la misma ruta', () => {
    const answers: RouteAnswers = { ...r1Base, repair_actions: 'none' };
    const first = determineRoute(answers);
    for (let i = 0; i < 50; i++) expect(determineRoute({ ...answers })).toBe(first);
  });

  it('ignora campos que no determinan ruta (Q1, Q2, Q3, Q11, Q12)', () => {
    const full: QuizAnswers = {
      ...r1Base,
      goal_now: 'start_letting_go',
      who_ended: 'user_ended',
      time_since_breakup: 'less_7_days',
      main_pain: 'stuck',
      return_position: 'dont_want_return',
      case_id: 'x',
      created_at: '',
      updated_at: '',
    };
    expect(determineRoute(full)).toBe('R1');
  });
});
