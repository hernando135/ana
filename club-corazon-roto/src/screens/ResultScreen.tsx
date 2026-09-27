import { Button } from '../components/Button';
import { ScreenTitle } from '../components/Screen';
import { RESULT_CTA } from '../data/copy';
import { getPersonalization, getResultContent, type NormalRouteId } from '../data/results';
import { useScreenFocus } from '../hooks/useScreenFocus';
import type { GoalNow, Timing } from '../types/quiz';

interface Props {
  route: NormalRouteId;
  timing?: Timing;
  firstName: string;
  goal?: GoalNow;
  onContinue: () => void;
}

export function ResultScreen({ route, timing, firstName, goal, onContinue }: Props) {
  const titleRef = useScreenFocus<HTMLHeadingElement>('result');
  const content = getResultContent(route, timing);
  const personalization = getPersonalization(goal);

  return (
    <section className="result" data-route={route}>
      <p className="eyebrow">Tu resultado</p>
      <ScreenTitle titleRef={titleRef} className="result__title">
        {content.title(firstName)}
      </ScreenTitle>
      <div className="prose">
        {content.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      {content.blocks.map((b) => (
        <aside key={b.label} className="card">
          <h2 className="card__label">{b.label}</h2>
          <p className="card__text">{b.text}</p>
        </aside>
      ))}
      {personalization && <p className="personalization">{personalization}</p>}
      <div className="actions">
        <Button className="btn--block" onClick={onContinue}>
          {RESULT_CTA}
        </Button>
      </div>
    </section>
  );
}
