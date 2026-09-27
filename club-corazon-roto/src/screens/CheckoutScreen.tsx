import { useState } from 'react';
import { Button } from '../components/Button';
import { ScreenTitle } from '../components/Screen';
import { formatClubPrice, formatClubPricePerDay } from '../config/pricing';
import { CHECKOUT } from '../data/copy';
import { useScreenFocus } from '../hooks/useScreenFocus';

export function CheckoutScreen() {
  const titleRef = useScreenFocus<HTMLHeadingElement>('checkout');
  const [pending, setPending] = useState(false);
  const price = formatClubPrice();
  const perDay = formatClubPricePerDay();

  return (
    <section className="checkout">
      <ScreenTitle titleRef={titleRef}>{CHECKOUT.title}</ScreenTitle>
      <p className="lead">{CHECKOUT.text}</p>

      <div className="plan">
        <div className="plan__card plan__card--selected">
          <span className="plan__radio" aria-hidden="true">
            <span />
          </span>
          <div className="plan__info">
            <p className="plan__name">{CHECKOUT.planName}</p>
            <p className="plan__period">{CHECKOUT.planPeriod}</p>
            {perDay && <p className="plan__price">{price}</p>}
          </div>
          <div className="plan__tag" data-testid="club-price">
            {perDay ? (
              <>
                <span className="plan__tag-value">{perDay}</span>
                <span className="plan__tag-unit">{CHECKOUT.perDay}</span>
              </>
            ) : (
              <span className="plan__tag-unit">{price}</span>
            )}
          </div>
        </div>
      </div>

      <div className="checkout__cta">
        <Button className="btn--block btn--halo" onClick={() => setPending(true)}>
          {CHECKOUT.cta}
        </Button>
        <p className="notice" role="status" aria-live="polite">
          {pending ? CHECKOUT.pending : ''}
        </p>
      </div>

      <div className="secure">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="15.5" r="1.4" fill="currentColor" />
        </svg>
        <span>{CHECKOUT.secure}</span>
      </div>

      <div className="fineprint">
        {CHECKOUT.renewal.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      <h2 className="section-title">{CHECKOUT.highlightsTitle}</h2>
      <ol className="chevrons">
        {CHECKOUT.highlights.map((h) => (
          <li key={h.label} className="chevrons__item">
            <span className="chevrons__step">{h.step}</span>
            <span className="chevrons__label">{h.label}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
