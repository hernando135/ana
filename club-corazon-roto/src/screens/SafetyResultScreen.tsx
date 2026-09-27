import { Button } from '../components/Button';
import { ScreenTitle } from '../components/Screen';
import { SAFETY_RESULT } from '../data/results';
import { useScreenFocus } from '../hooks/useScreenFocus';

interface Props {
  onClear: () => void;
}

/** R0: nunca muestra ruta normal ni contenido de reconquista, ni el Club. */
export function SafetyResultScreen({ onClear }: Props) {
  const titleRef = useScreenFocus<HTMLHeadingElement>('result-r0');
  return (
    <section className="result result--safety" data-route="R0">
      <ScreenTitle titleRef={titleRef} className="result__title">
        {SAFETY_RESULT.title}
      </ScreenTitle>
      <div className="prose">
        {SAFETY_RESULT.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <aside className="card card--emphasis" role="note">
        <p className="card__text">{SAFETY_RESULT.emergency}</p>
      </aside>
      <div className="actions">
        <Button variant="ghost" className="btn--block" onClick={onClear}>
          Borrar mis respuestas de este dispositivo
        </Button>
      </div>
    </section>
  );
}
