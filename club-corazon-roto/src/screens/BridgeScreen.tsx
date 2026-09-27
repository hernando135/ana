import { Button } from '../components/Button';
import { ScreenTitle } from '../components/Screen';
import { BRIDGE } from '../data/copy';
import { useScreenFocus } from '../hooks/useScreenFocus';

export function BridgeScreen({ onContinue }: { onContinue: () => void }) {
  const titleRef = useScreenFocus<HTMLHeadingElement>('bridge');
  return (
    <section className="bridge">
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
        <h2 className="bridge__highlight">{BRIDGE.highlight}</h2>
        <p className="card__text">{BRIDGE.clubText}</p>
      </div>
      <div className="actions">
        <Button className="btn--block" onClick={onContinue}>
          {BRIDGE.cta}
        </Button>
      </div>
    </section>
  );
}
