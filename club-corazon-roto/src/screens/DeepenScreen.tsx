import { Button } from '../components/Button';
import { ScreenTitle } from '../components/Screen';
import { DEEPEN, type NormalRouteId } from '../data/results';
import { useScreenFocus } from '../hooks/useScreenFocus';

interface Props {
  route: NormalRouteId;
  onContinue: () => void;
}

export function DeepenScreen({ route, onContinue }: Props) {
  const titleRef = useScreenFocus<HTMLHeadingElement>('deepen');
  const content = DEEPEN[route];
  return (
    <section className="deepen" data-route={route}>
      <ScreenTitle titleRef={titleRef}>{content.title}</ScreenTitle>
      <ol className="numbered">
        {content.items.map((item, i) => (
          <li key={item} className="numbered__item">
            <span className="numbered__n" aria-hidden="true">
              {i + 1}
            </span>
            <p>{item}</p>
          </li>
        ))}
      </ol>
      <div className="actions">
        <Button className="btn--block" onClick={onContinue}>
          SEGUIR
        </Button>
      </div>
    </section>
  );
}
