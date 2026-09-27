import type { QuestionScreenId, QuizAnswers, ScreenId } from '../types/quiz';
import { isValidName } from './answers';

/**
 * Secuencia de pantallas del quiz (Q1 → Q14) según las respuestas actuales.
 * Los saltos condicionales se resuelven aquí:
 *  - Q4 = none   → se omiten Q5-Q8 y la transición 2.
 *  - Q9 = never  → se omite Q10.
 */
export function getQuizScreens(a: Partial<QuizAnswers>): ScreenId[] {
  const screens: ScreenId[] = ['Q1', 'Q2', 'Q3', 'T1', 'Q4'];
  if (a.contact_level !== 'none') {
    screens.push('Q5', 'Q6', 'Q7', 'Q8', 'T2');
  }
  screens.push('Q9');
  if (a.cycle_count !== 'never') {
    screens.push('Q10');
  }
  screens.push('Q11', 'Q12', 'Q13', 'Q14');
  return screens;
}

export function getPostQuizScreens(a: Partial<QuizAnswers>): ScreenId[] {
  // R0 (seguridad) nunca se dirige hacia contenido de reconquista ni hacia el Club.
  if (a.route === 'R0') return ['result'];
  // Resultado (con sus 3 puntos) → Club (con el puente) → checkout.
  return ['result', 'club', 'checkout'];
}

export function getFlow(a: Partial<QuizAnswers>): ScreenId[] {
  return ['landing', ...getQuizScreens(a), 'processing', ...getPostQuizScreens(a)];
}

export function isQuestionScreen(screen: ScreenId): screen is QuestionScreenId {
  return /^Q\d+$/.test(screen);
}

export function isQuizScreen(screen: ScreenId): boolean {
  return isQuestionScreen(screen) || screen === 'T1' || screen === 'T2';
}

export const POST_QUIZ_SCREENS: readonly ScreenId[] = ['result', 'club', 'checkout'];

const FIELD_BY_SCREEN: Partial<Record<QuestionScreenId, keyof QuizAnswers>> = {
  Q1: 'goal_now',
  Q2: 'who_ended',
  Q3: 'time_since_breakup',
  Q4: 'contact_level',
  Q5: 'contact_initiator',
  Q6: 'without_user_initiating',
  Q7: 'return_conversation',
  Q8: 'repair_actions',
  Q9: 'cycle_count',
  Q10: 'after_reconnection',
  Q11: 'main_pain',
  Q12: 'return_position',
};

/** ¿La pantalla tiene una respuesta válida para poder avanzar? */
export function isScreenComplete(screen: ScreenId, a: Partial<QuizAnswers>): boolean {
  if (screen === 'Q13') return (a.safety ?? []).length > 0;
  if (screen === 'Q14') return isValidName(a.first_name);
  if (isQuestionScreen(screen)) {
    const field = FIELD_BY_SCREEN[screen];
    return field !== undefined && a[field] !== undefined;
  }
  return true;
}

/** Todas las preguntas visibles del flujo actual están respondidas. */
export function isQuizComplete(a: Partial<QuizAnswers>): boolean {
  return getQuizScreens(a).every((s) => isScreenComplete(s, a));
}

/** Primera pantalla del quiz sin responder (o Q14 si todo está respondido). */
export function firstIncompleteScreen(a: Partial<QuizAnswers>): ScreenId {
  return getQuizScreens(a).find((s) => !isScreenComplete(s, a)) ?? 'Q14';
}

export function getNextScreen(current: ScreenId, a: Partial<QuizAnswers>): ScreenId | null {
  const flow = getFlow(a);
  const idx = flow.indexOf(current);
  if (idx === -1 || idx === flow.length - 1) return null;
  return flow[idx + 1];
}

export function getPrevScreen(current: ScreenId, a: Partial<QuizAnswers>): ScreenId | null {
  // Desde el resultado no se vuelve al quiz: el resultado es una foto cerrada.
  if (current === 'result' || current === 'processing' || current === 'landing') return null;
  const flow = getFlow(a);
  const idx = flow.indexOf(current);
  if (idx <= 0) return null;
  return flow[idx - 1];
}

/**
 * Progreso (0-1) calculado sobre el flujo real, que ya excluye las
 * pantallas saltadas. No mostramos "X de Y" porque el total cambia.
 */
export function getProgress(current: ScreenId, a: Partial<QuizAnswers>): number {
  const screens = getQuizScreens(a);
  const idx = screens.indexOf(current);
  if (idx === -1) return 0;
  return (idx + 1) / screens.length;
}
