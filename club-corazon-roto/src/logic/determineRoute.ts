import type { QuizAnswers, RouteId } from '../types/quiz';

/**
 * Clasificador DETERMINISTA del quiz.
 *
 * Solo usa reglas booleanas predefinidas: sin puntajes, sin porcentajes,
 * sin IA. Las mismas respuestas producen siempre la misma ruta.
 *
 * Orden obligatorio de evaluación: R0 → R1 → R4 → R3 → R5 → R2 (fallback).
 */

type RouteInput = Pick<
  QuizAnswers,
  | 'safety_flag'
  | 'contact_level'
  | 'contact_initiator'
  | 'without_user_initiating'
  | 'return_conversation'
  | 'repair_actions'
  | 'cycle_count'
  | 'after_reconnection'
>;

function isOneOf<T extends string>(value: T | undefined, allowed: readonly T[]): boolean {
  return value !== undefined && allowed.includes(value);
}

export function isR0(a: RouteInput): boolean {
  return a.safety_flag === true;
}

export function isR1(a: RouteInput): boolean {
  return (
    isOneOf(a.contact_level, ['frequent', 'occasional']) &&
    isOneOf(a.contact_initiator, ['mostly_him', 'both']) &&
    a.return_conversation === 'both_want_return' &&
    isOneOf(a.repair_actions, ['concrete_sustained', 'some_concrete'])
  );
}

export function isR4(a: RouteInput): boolean {
  return (
    isOneOf(a.cycle_count, ['two_three', 'many']) &&
    isOneOf(a.after_reconnection, ['sex_confusion', 'intense_then_cold', 'return_then_breakup'])
  );
}

export function isR3(a: RouteInput): boolean {
  return (
    isOneOf(a.contact_initiator, ['user_more', 'mostly_user']) &&
    isOneOf(a.without_user_initiating, ['small_contact', 'nothing', 'user_contacts_first']) &&
    isOneOf(a.repair_actions, ['mostly_words', 'none', 'cause_not_discussed', 'unclear_change'])
  );
}

export function isR5(a: RouteInput): boolean {
  // Caso A: no hay contacto.
  if (a.contact_level === 'none') return true;

  // Caso B: contacto mínimo sostenido por ella, sin acciones concretas de él.
  return (
    a.contact_level === 'very_little' &&
    isOneOf(a.contact_initiator, ['user_more', 'mostly_user']) &&
    isOneOf(a.without_user_initiating, ['nothing', 'user_contacts_first', 'small_contact']) &&
    !isOneOf(a.repair_actions, ['concrete_sustained', 'some_concrete'])
  );
}

export function determineRoute(answers: RouteInput): RouteId {
  if (isR0(answers)) return 'R0';
  if (isR1(answers)) return 'R1';
  if (isR4(answers)) return 'R4';
  if (isR3(answers)) return 'R3';
  if (isR5(answers)) return 'R5';
  return 'R2';
}
