import type {
  ContactLevel,
  CycleCount,
  QuizAnswers,
  SafetyOption,
  SingleChoiceField,
} from '../types/quiz';
import { deriveTiming } from './timing';

/** Valores automáticos cuando no hay contacto (Q4 = none). */
export const NO_CONTACT_DEFAULTS = {
  contact_initiator: 'no_contact',
  without_user_initiating: 'not_applicable',
  return_conversation: 'not_talking',
  repair_actions: 'none',
} as const satisfies Partial<QuizAnswers>;

/** Valor automático cuando nunca se han vuelto a acercar (Q9 = never). */
export const NO_CYCLE_DEFAULTS = {
  after_reconnection: 'not_applicable',
} as const satisfies Partial<QuizAnswers>;

function applyContactLevel(
  prev: QuizAnswers,
  next: QuizAnswers,
  value: ContactLevel,
): QuizAnswers {
  if (value === 'none') {
    // Borra cualquier respuesta previa de Q5-Q8 y asigna los valores automáticos.
    return { ...next, ...NO_CONTACT_DEFAULTS };
  }
  if (prev.contact_level === 'none') {
    // Veníamos de "none": los valores de Q5-Q8 eran automáticos.
    // Se eliminan para obligar a responder Q5-Q8 de nuevo.
    const cleaned = { ...next };
    delete cleaned.contact_initiator;
    delete cleaned.without_user_initiating;
    delete cleaned.return_conversation;
    delete cleaned.repair_actions;
    return cleaned;
  }
  return next;
}

function applyCycleCount(prev: QuizAnswers, next: QuizAnswers, value: CycleCount): QuizAnswers {
  if (value === 'never') {
    return { ...next, ...NO_CYCLE_DEFAULTS };
  }
  if (prev.cycle_count === 'never' || next.after_reconnection === 'not_applicable') {
    const cleaned = { ...next };
    delete cleaned.after_reconnection;
    return cleaned;
  }
  return next;
}

/**
 * Registra una respuesta de opción única y limpia/asigna las dependencias
 * condicionales. Cualquier cambio invalida la ruta calculada previamente.
 */
export function applySingleAnswer(
  prev: QuizAnswers,
  field: SingleChoiceField,
  value: string,
  now: string = new Date().toISOString(),
): QuizAnswers {
  let next = { ...prev, [field]: value, updated_at: now } as QuizAnswers;
  delete next.route;

  if (field === 'time_since_breakup') {
    next.timing = deriveTiming(next.time_since_breakup);
  }
  if (field === 'contact_level') {
    next = applyContactLevel(prev, next, value as ContactLevel);
  }
  if (field === 'cycle_count') {
    next = applyCycleCount(prev, next, value as CycleCount);
  }
  return next;
}

export const EXCLUSIVE_SAFETY: SafetyOption = 'none_of_these';

/**
 * Q13_F ("Ninguna de estas") es excluyente con A-E.
 */
export function toggleSafetyOption(current: SafetyOption[], option: SafetyOption): SafetyOption[] {
  if (current.includes(option)) {
    return current.filter((o) => o !== option);
  }
  if (option === EXCLUSIVE_SAFETY) {
    return [EXCLUSIVE_SAFETY];
  }
  return [...current.filter((o) => o !== EXCLUSIVE_SAFETY), option];
}

export function computeSafetyFlag(safety: SafetyOption[] | undefined): boolean {
  return (safety ?? []).some((o) => o !== EXCLUSIVE_SAFETY);
}

export function applySafety(
  prev: QuizAnswers,
  safety: SafetyOption[],
  now: string = new Date().toISOString(),
): QuizAnswers {
  const next: QuizAnswers = {
    ...prev,
    safety,
    safety_flag: computeSafetyFlag(safety),
    updated_at: now,
  };
  delete next.route;
  return next;
}

export const NAME_MIN_LENGTH = 2;

export function isValidName(name: string | undefined): boolean {
  return (name ?? '').trim().length >= NAME_MIN_LENGTH;
}
