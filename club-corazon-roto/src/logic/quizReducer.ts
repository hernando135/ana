import type {
  BillingState,
  QuizAnswers,
  QuizState,
  SafetyOption,
  ScreenId,
  SingleChoiceField,
} from '../types/quiz';
import { applySafety, applySingleAnswer, toggleSafetyOption } from './answers';
import { determineRoute } from './determineRoute';
import {
  POST_QUIZ_SCREENS,
  firstIncompleteScreen,
  getFlow,
  getNextScreen,
  getPrevScreen,
  isQuizComplete,
  isScreenComplete,
} from './flow';
import { deriveTiming } from './timing';
import { createId } from '../utils/id';

export const STATE_VERSION = 1;

export const INITIAL_BILLING: BillingState = {
  payment_status: 'unpaid',
  subscription_status: 'inactive',
  access_status: 'locked',
};

export function createInitialAnswers(now: string = new Date().toISOString()): QuizAnswers {
  return {
    safety_flag: false,
    case_id: createId(),
    created_at: now,
    updated_at: now,
  };
}

export function createInitialState(now?: string): QuizState {
  return {
    version: STATE_VERSION,
    screen: 'landing',
    answers: createInitialAnswers(now),
    billing: { ...INITIAL_BILLING },
  };
}

export type QuizAction =
  | { type: 'START' }
  | { type: 'ANSWER'; field: SingleChoiceField; value: string }
  | { type: 'TOGGLE_SAFETY'; option: SafetyOption }
  | { type: 'SET_SAFETY'; safety: SafetyOption[] }
  | { type: 'SET_NAME'; name: string }
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'FINALIZE' }
  | { type: 'GOTO'; screen: ScreenId }
  | { type: 'RESET' }
  | { type: 'LOAD'; state: QuizState };

/**
 * Pasos de procesamiento tras Q14:
 * 1. calcular timing; 2. calcular route; 3. guardar route; 4. updated_at.
 * (La persistencia y la navegación se hacen fuera del reducer.)
 */
export function finalizeAnswers(a: QuizAnswers, now: string = new Date().toISOString()): QuizAnswers {
  const withTiming: QuizAnswers = { ...a, timing: deriveTiming(a.time_since_breakup) };
  return { ...withTiming, route: determineRoute(withTiming), updated_at: now };
}

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'START':
      return { ...state, screen: 'Q1' };

    case 'ANSWER':
      return { ...state, answers: applySingleAnswer(state.answers, action.field, action.value) };

    case 'SET_SAFETY':
      return { ...state, answers: applySafety(state.answers, action.safety) };

    case 'TOGGLE_SAFETY':
      return {
        ...state,
        answers: applySafety(state.answers, toggleSafetyOption(state.answers.safety ?? [], action.option)),
      };

    case 'SET_NAME': {
      const answers: QuizAnswers = {
        ...state.answers,
        first_name: action.name,
        updated_at: new Date().toISOString(),
      };
      delete answers.route;
      return { ...state, answers };
    }

    case 'NEXT': {
      // No se permite avanzar sin responder.
      if (!isScreenComplete(state.screen, state.answers)) return state;
      const next = getNextScreen(state.screen, state.answers);
      if (!next) return state;
      if (next === 'processing' && !isQuizComplete(state.answers)) {
        return { ...state, screen: firstIncompleteScreen(state.answers) };
      }
      return { ...state, screen: next };
    }

    case 'BACK': {
      const prev = getPrevScreen(state.screen, state.answers);
      return prev ? { ...state, screen: prev } : state;
    }

    case 'FINALIZE': {
      if (!isQuizComplete(state.answers)) {
        return { ...state, screen: firstIncompleteScreen(state.answers) };
      }
      return { ...state, answers: finalizeAnswers(state.answers) };
    }

    case 'GOTO':
      return getFlow(state.answers).includes(action.screen) ? { ...state, screen: action.screen } : state;

    case 'RESET':
      return { ...createInitialState(), screen: 'landing' };

    case 'LOAD':
      return normalizeState(action.state);

    default:
      return state;
  }
}

/**
 * Garantiza que un estado rehidratado sea navegable: la pantalla existe en el
 * flujo actual y las pantallas de resultado tienen una ruta calculada.
 */
export function normalizeState(state: QuizState): QuizState {
  let { answers, screen } = state;

  if (POST_QUIZ_SCREENS.includes(screen) && !answers.route) {
    if (isQuizComplete(answers)) {
      answers = finalizeAnswers(answers);
    } else {
      screen = firstIncompleteScreen(answers);
    }
  }
  if (!getFlow(answers).includes(screen)) {
    screen = answers.route ? 'result' : 'landing';
  }
  return { ...state, answers, screen };
}
