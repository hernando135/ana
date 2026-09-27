import { Button } from '../components/Button';
import { OptionCard } from '../components/OptionCard';
import { ScreenTitle } from '../components/Screen';
import { SAFETY_QUESTION } from '../data/questions';
import { useScreenFocus } from '../hooks/useScreenFocus';
import type { SafetyOption } from '../types/quiz';

interface Props {
  selected: SafetyOption[];
  onToggle: (option: SafetyOption) => void;
  onContinue: () => void;
}

export function SafetyScreen({ selected, onToggle, onContinue }: Props) {
  const titleRef = useScreenFocus<HTMLHeadingElement>('Q13');
  const q = SAFETY_QUESTION;
  const canContinue = selected.length > 0;

  return (
    <section className="question">
      <p className="question__intro">{q.intro}</p>
      <ScreenTitle titleRef={titleRef}>
        <span id="Q13-title">{q.title}</span>
      </ScreenTitle>
      <p className="question__hint">Puedes marcar varias.</p>
      <div className="options" role="group" aria-labelledby="Q13-title">
        {q.options.map((o) => (
          <OptionCard
            key={o.id}
            mode="checkbox"
            label={o.label}
            selected={selected.includes(o.value)}
            onSelect={() => onToggle(o.value)}
          />
        ))}
      </div>
      <div className="actions">
        <Button className="btn--block" onClick={onContinue} disabled={!canContinue}>
          CONTINUAR
        </Button>
      </div>
    </section>
  );
}
