import { useEffect, useRef, useState } from 'react';
import { ScreenTitle } from '../components/Screen';
import { PROCESSING_MESSAGES } from '../data/copy';
import { useScreenFocus } from '../hooks/useScreenFocus';

export const PROCESSING_STEP_MS = 1100;

interface Props {
  onFinalize: () => void;
  onDone: () => void;
}

export function ProcessingScreen({ onFinalize, onDone }: Props) {
  const titleRef = useScreenFocus<HTMLHeadingElement>('processing');
  const [step, setStep] = useState(0);
  // Refs para que el temporizador corra una sola vez aunque cambien los callbacks.
  const callbacks = useRef({ onFinalize, onDone });

  useEffect(() => {
    const { onFinalize, onDone } = callbacks.current;
    // Calcula timing + ruta y los persiste (idempotente).
    onFinalize();
    const timers = PROCESSING_MESSAGES.map((_, i) =>
      window.setTimeout(() => setStep(i), i * PROCESSING_STEP_MS),
    );
    timers.push(window.setTimeout(onDone, PROCESSING_MESSAGES.length * PROCESSING_STEP_MS));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  return (
    <section className="processing">
      <div className="processing__pulse" aria-hidden="true" />
      <ScreenTitle titleRef={titleRef} className="visually-hidden">
        Preparando tu resultado
      </ScreenTitle>
      <ol className="processing__steps" aria-live="polite">
        {PROCESSING_MESSAGES.map((m, i) => (
          <li
            key={m}
            className={i < step ? 'is-done' : i === step ? 'is-active' : 'is-pending'}
            aria-hidden={i > step}
          >
            {m}
          </li>
        ))}
      </ol>
    </section>
  );
}
