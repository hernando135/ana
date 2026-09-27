import { useEffect, useRef, useState } from 'react';
import { Button } from '../components/Button';
import { OptionCard } from '../components/OptionCard';
import { ScreenTitle } from '../components/Screen';
import type { SingleChoiceQuestion } from '../data/questions';
import { useScreenFocus } from '../hooks/useScreenFocus';

/** Pausa breve para que se vea la selección antes de avanzar. */
export const AUTO_ADVANCE_MS = 280;

interface Props {
  question: SingleChoiceQuestion;
  value?: string;
  onAnswer: (value: string) => void;
  onAdvance: () => void;
}

export function SingleChoiceScreen({ question, value, onAnswer, onAdvance }: Props) {
  const titleRef = useScreenFocus<HTMLHeadingElement>(question.screen);
  const [locked, setLocked] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const select = (v: string) => {
    if (locked) return; // evita dobles avances por toques repetidos
    setLocked(true);
    onAnswer(v);
    timer.current = window.setTimeout(onAdvance, AUTO_ADVANCE_MS);
  };

  const labelId = `${question.screen}-title`;

  return (
    <section className="question">
      {question.intro && <p className="question__intro">{question.intro}</p>}
      <ScreenTitle titleRef={titleRef}>
        <span id={labelId}>{question.title}</span>
      </ScreenTitle>
      <div className="options" role="radiogroup" aria-labelledby={labelId}>
        {question.options.map((o) => (
          <OptionCard
            key={o.id}
            mode="radio"
            label={o.label}
            selected={value === o.value}
            onSelect={() => select(o.value)}
            disabled={locked && value !== o.value}
          />
        ))}
      </div>
      {value !== undefined && !locked && (
        <div className="actions">
          <Button variant="secondary" className="btn--block" onClick={onAdvance}>
            CONTINUAR
          </Button>
        </div>
      )}
    </section>
  );
}
