import { useEffect, useRef, useState } from 'react';
import { Button } from '../components/Button';
import { ScreenTitle } from '../components/Screen';
import { RESULT_CONTINUE_CTA, RESULT_CTA } from '../data/copy';
import { DEEPEN, getPersonalization, getResultContent, type NormalRouteId } from '../data/results';
import { useScreenFocus } from '../hooks/useScreenFocus';
import type { GoalNow, Timing } from '../types/quiz';

interface Props {
  route: NormalRouteId;
  timing?: Timing;
  firstName: string;
  goal?: GoalNow;
  onContinue: () => void;
}

/**
 * Resultado + profundización de 3 puntos en una sola pantalla.
 * El CTA "¿QUÉ DEBERÍA MIRAR AHORA?" baja a los 3 puntos; cuando ya
 * están a la vista, el CTA pasa a "SEGUIR" y avanza al Club.
 */
export function ResultScreen({ route, timing, firstName, goal, onContinue }: Props) {
  const titleRef = useScreenFocus<HTMLHeadingElement>('result');
  const deepenRef = useRef<HTMLHeadingElement>(null);
  const [deepenSeen, setDeepenSeen] = useState(false);
  const content = getResultContent(route, timing);
  const deepen = DEEPEN[route];
  const personalization = getPersonalization(goal);

  // Si la usuaria llega a los 3 puntos haciendo scroll, el CTA ya puede avanzar.
  useEffect(() => {
    const el = deepenRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setDeepenSeen(true);
      },
      { rootMargin: '0px 0px -30% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleCta = () => {
    if (deepenSeen) {
      onContinue();
      return;
    }
    setDeepenSeen(true);
    deepenRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
    deepenRef.current?.focus({ preventScroll: true });
  };

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

      <div className="deepen">
        <h2 ref={deepenRef} tabIndex={-1} className="deepen__title">
          {deepen.title}
        </h2>
        <ol className="numbered">
          {deepen.items.map((item, i) => (
            <li key={item} className="numbered__item">
              <span className="numbered__n" aria-hidden="true">
                {i + 1}
              </span>
              <p>{item}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="actions">
        <Button className="btn--block" onClick={handleCta}>
          {deepenSeen ? RESULT_CONTINUE_CTA : RESULT_CTA}
        </Button>
      </div>
    </section>
  );
}
