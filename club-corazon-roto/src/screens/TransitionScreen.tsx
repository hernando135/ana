import { Button } from '../components/Button';
import { Illustration } from '../components/Illustration';
import { ScreenTitle } from '../components/Screen';
import type { TransitionContent } from '../data/transitions';
import { useScreenFocus } from '../hooks/useScreenFocus';

interface Props {
  id: string;
  content: TransitionContent;
  onContinue: () => void;
}

export function TransitionScreen({ id, content, onContinue }: Props) {
  const titleRef = useScreenFocus<HTMLHeadingElement>(id);
  return (
    <section className="transition">
      <ScreenTitle titleRef={titleRef}>{content.title}</ScreenTitle>
      <div className="prose">
        {content.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <Illustration variant={id === 'T1' ? 'time' : 'actions'} />
      <div className="actions">
        <Button className="btn--block" onClick={onContinue}>
          {content.cta}
        </Button>
      </div>
    </section>
  );
}
