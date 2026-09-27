import { useEffect, useReducer } from 'react';
import type { QuizState } from '../types/quiz';
import { createInitialState, quizReducer } from '../logic/quizReducer';
import { loadState, saveState } from '../storage/persistence';

function init(): QuizState {
  return loadState() ?? createInitialState();
}

/** Estado del quiz con persistencia automática en localStorage. */
export function useQuiz() {
  const [state, dispatch] = useReducer(quizReducer, undefined, init);

  useEffect(() => {
    saveState(state);
  }, [state]);

  return { state, dispatch };
}
