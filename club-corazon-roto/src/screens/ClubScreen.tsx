import { BrandMark } from '../components/BrandMark';
import { Button } from '../components/Button';
import { ScreenTitle } from '../components/Screen';
import { CLUB } from '../data/copy';
import { useScreenFocus } from '../hooks/useScreenFocus';

export function ClubScreen({ onContinue }: { onContinue: () => void }) {
  const titleRef = useScreenFocus<HTMLHeadingElement>('club');
  return (
    <section className="club">
      <BrandMark size="lg" />
      <ScreenTitle titleRef={titleRef}>{CLUB.title}</ScreenTitle>
      <p className="lead">{CLUB.subtitle}</p>
      <ul className="features">
        {CLUB.features.map((f) => (
          <li key={f} className="features__item">
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M3.5 8.5 6.5 11.5 12.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="prose">
        {CLUB.text.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <div className="actions">
        <Button className="btn--block" onClick={onContinue}>
          {CLUB.cta}
        </Button>
      </div>
    </section>
  );
}
