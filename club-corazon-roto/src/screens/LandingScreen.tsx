import { BrandMark } from '../components/BrandMark';
import { Button } from '../components/Button';
import { ScreenTitle } from '../components/Screen';
import { LANDING } from '../data/copy';
import { useScreenFocus } from '../hooks/useScreenFocus';

export function LandingScreen({ onStart }: { onStart: () => void }) {
  const titleRef = useScreenFocus<HTMLHeadingElement>('landing');
  return (
    <section className="landing">
      <BrandMark size="lg" />
      <ScreenTitle titleRef={titleRef} className="landing__headline">
        {LANDING.headline}
      </ScreenTitle>
      <p className="landing__text">{LANDING.text}</p>
      <ul className="landing__meta" aria-label="Detalles del quiz">
        {LANDING.meta.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
      <Button onClick={onStart} className="btn--block">
        {LANDING.cta}
      </Button>
    </section>
  );
}
