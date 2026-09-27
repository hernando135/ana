import { useState, type Dispatch } from 'react';
import { determineRoute } from '../logic/determineRoute';
import { createInitialState, finalizeAnswers, type QuizAction } from '../logic/quizReducer';
import { clearState } from '../storage/persistence';
import type { QuizState } from '../types/quiz';
import { ROUTE_PRESETS } from './presets';

interface Props {
  state: QuizState;
  dispatch: Dispatch<QuizAction>;
}

/** Panel de depuración. Solo se monta cuando import.meta.env.DEV es true. */
export default function DevPanel({ state, dispatch }: Props) {
  const [open, setOpen] = useState(false);
  const liveRoute = determineRoute(state.answers);

  const loadPreset = (key: keyof typeof ROUTE_PRESETS) => {
    const base = createInitialState();
    const answers = finalizeAnswers({ ...base.answers, ...ROUTE_PRESETS[key] });
    dispatch({ type: 'LOAD', state: { ...base, answers, screen: 'result' } });
  };

  return (
    <div className="devpanel">
      <button type="button" className="devpanel__toggle" onClick={() => setOpen((o) => !o)}>
        {open ? 'DEV ×' : 'DEV'}
      </button>
      {open && (
        <div className="devpanel__body">
          <p>
            <strong>Pantalla:</strong> {state.screen} · <strong>Ruta guardada:</strong>{' '}
            {state.answers.route ?? '—'} · <strong>Ruta con respuestas actuales:</strong> {liveRoute}
          </p>
          <div className="devpanel__row">
            <button
              type="button"
              onClick={() => {
                clearState();
                dispatch({ type: 'RESET' });
              }}
            >
              Reiniciar quiz
            </button>
          </div>
          <div className="devpanel__row">
            {(Object.keys(ROUTE_PRESETS) as (keyof typeof ROUTE_PRESETS)[]).map((k) => (
              <button type="button" key={k} onClick={() => loadPreset(k)}>
                {k}
              </button>
            ))}
          </div>
          <pre>{JSON.stringify({ answers: state.answers, billing: state.billing }, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
