import type { QuizState } from '../types/quiz';
import { STATE_VERSION, normalizeState } from '../logic/quizReducer';

export const STORAGE_KEY = 'ccr.quiz.v1';

function getStorage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

function isQuizState(value: unknown): value is QuizState {
  if (!value || typeof value !== 'object') return false;
  const v = value as Partial<QuizState>;
  return (
    v.version === STATE_VERSION &&
    typeof v.screen === 'string' &&
    !!v.answers &&
    typeof v.answers === 'object' &&
    typeof v.answers.case_id === 'string' &&
    typeof v.answers.safety_flag === 'boolean' &&
    !!v.billing &&
    typeof v.billing === 'object'
  );
}

/** Devuelve el estado guardado, o null si no existe o no es válido. */
export function loadState(storage: Storage | null = getStorage()): QuizState | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isQuizState(parsed) ? normalizeState(parsed) : null;
  } catch {
    return null;
  }
}

export function saveState(state: QuizState, storage: Storage | null = getStorage()): void {
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Almacenamiento lleno o bloqueado: la app sigue funcionando en memoria.
  }
}

export function clearState(storage: Storage | null = getStorage()): void {
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // ignorar
  }
}
