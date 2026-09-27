import { Button } from '../components/Button';
import { ScreenTitle } from '../components/Screen';
import { BRIDGE, CLUB } from '../data/copy';
import { useScreenFocus } from '../hooks/useScreenFocus';

/** Puente hacia el Club + presentación del Club en una sola pantalla. */
export function ClubScreen({ onContinue }: { onContinue: () => void }) {
  const titleRef = useScreenFocus<HTMLHeadingElement>('club');
  return (
    <section className="club">
      <div className="bridge">
        <ScreenTitle titleRef={titleRef}>{BRIDGE.title}</ScreenTitle>
        <p className="lead">{BRIDGE.text}</p>
        <ul className="chips" aria-label="Cosas que pueden pasar">
          {BRIDGE.chips.map((c) => (
            <li key={c} className="chip">
              {c}
            </li>
          ))}
        </ul>
        <div className="prose">
          <p>{BRIDGE.questionLead}</p>
          <p className="bridge__question">{BRIDGE.question}</p>
        </div>
        <div className="card card--feature">
          <p className="bridge__highlight">{BRIDGE.highlight}</p>
          <p className="card__text">{BRIDGE.clubText}</p>
        </div>
      </div>

      <div className="club__offer">
        <h2 className="club__title">{CLUB.title}</h2>
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
        <div className="quote">
          {CLUB.text.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>

      <div className="actions">
        <Button className="btn--block" onClick={onContinue}>
          {CLUB.cta}
        </Button>
      </div>
    </section>
  );
}
