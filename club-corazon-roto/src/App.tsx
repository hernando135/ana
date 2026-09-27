import { lazy, Suspense } from 'react';
import { AppShell } from './components/AppShell';
import { getQuestion } from './data/questions';
import { TRANSITIONS } from './data/transitions';
import { useQuiz } from './hooks/useQuiz';
import { getPrevScreen, getProgress, isQuizScreen } from './logic/flow';
import { clearState } from './storage/persistence';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { ClubScreen } from './screens/ClubScreen';
import { LandingScreen } from './screens/LandingScreen';
import { NameScreen } from './screens/NameScreen';
import { ProcessingScreen } from './screens/ProcessingScreen';
import { ResultScreen } from './screens/ResultScreen';
import { SafetyResultScreen } from './screens/SafetyResultScreen';
import { SafetyScreen } from './screens/SafetyScreen';
import { SingleChoiceScreen } from './screens/SingleChoiceScreen';
import { TransitionScreen } from './screens/TransitionScreen';
import type { QuizAnswers } from './types/quiz';

// El panel de depuración no se incluye en el build de producción,
// salvo en builds de prueba con VITE_TEST_PANEL=true.
const SHOW_DEV_PANEL = import.meta.env.DEV || import.meta.env.VITE_TEST_PANEL === 'true';
const DevPanel = SHOW_DEV_PANEL ? lazy(() => import('./dev/DevPanel')) : null;

export default function App() {
  const { state, dispatch } = useQuiz();
  const { screen, answers } = state;

  const next = () => dispatch({ type: 'NEXT' });
  const back = () => dispatch({ type: 'BACK' });
  const canGoBack = getPrevScreen(screen, answers) !== null;
  const reset = () => {
    clearState();
    dispatch({ type: 'RESET' });
  };

  const content = renderScreen();

  return (
    <>
      <AppShell
        screenKey={screen}
        onBack={canGoBack ? back : undefined}
        progress={isQuizScreen(screen) ? getProgress(screen, answers) : undefined}
        showBrand={screen !== 'landing'}
      >
        {content}
      </AppShell>
      {DevPanel && (
        <Suspense fallback={null}>
          <DevPanel state={state} dispatch={dispatch} />
        </Suspense>
      )}
    </>
  );

  function renderScreen() {
    switch (screen) {
      case 'landing':
        return <LandingScreen onStart={() => dispatch({ type: 'START' })} />;

      case 'T1':
      case 'T2':
        return <TransitionScreen id={screen} content={TRANSITIONS[screen]} onContinue={next} />;

      case 'Q13':
        return (
          <SafetyScreen
            selected={answers.safety ?? []}
            onToggle={(option) => dispatch({ type: 'TOGGLE_SAFETY', option })}
            onContinue={next}
          />
        );

      case 'Q14':
        return (
          <NameScreen
            value={answers.first_name ?? ''}
            onChange={(name) => dispatch({ type: 'SET_NAME', name })}
            onSubmit={next}
          />
        );

      case 'processing':
        return <ProcessingScreen onFinalize={() => dispatch({ type: 'FINALIZE' })} onDone={next} />;

      case 'result':
        if (answers.route === 'R0') return <SafetyResultScreen onClear={reset} />;
        if (!answers.route) return null;
        return (
          <ResultScreen
            route={answers.route}
            timing={answers.timing}
            firstName={(answers.first_name ?? '').trim()}
            goal={answers.goal_now}
            onContinue={next}
          />
        );

      case 'club':
        return <ClubScreen onContinue={next} />;

      case 'checkout':
        return <CheckoutScreen />;

      default: {
        const question = getQuestion(screen);
        if (question.kind !== 'single') return null;
        return (
          <SingleChoiceScreen
            question={question}
            value={answers[question.field as keyof QuizAnswers] as string | undefined}
            onAnswer={(value) => dispatch({ type: 'ANSWER', field: question.field, value })}
            onAdvance={next}
          />
        );
      }
    }
  }
}
