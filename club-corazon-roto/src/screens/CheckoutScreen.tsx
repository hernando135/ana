import { useState } from 'react';
import { Button } from '../components/Button';
import { ScreenTitle } from '../components/Screen';
import { formatClubPrice } from '../config/pricing';
import { CHECKOUT } from '../data/copy';
import { useScreenFocus } from '../hooks/useScreenFocus';

export function CheckoutScreen() {
  const titleRef = useScreenFocus<HTMLHeadingElement>('checkout');
  const [pending, setPending] = useState(false);

  return (
    <section className="checkout">
      <ScreenTitle titleRef={titleRef}>{CHECKOUT.title}</ScreenTitle>
      <p className="lead">{CHECKOUT.text}</p>
      <div className="card card--price">
        <p className="price__label">Membresía mensual</p>
        <p className="price__value" data-testid="club-price">
          {formatClubPrice()}
        </p>
      </div>
      <div className="prose prose--small">
        {CHECKOUT.renewal.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <div className="actions">
        <Button className="btn--block" onClick={() => setPending(true)}>
          {CHECKOUT.cta}
        </Button>
        <p className="notice" role="status" aria-live="polite">
          {pending ? CHECKOUT.pending : ''}
        </p>
      </div>
    </section>
  );
}
