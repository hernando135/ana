/**
 * Ilustración abstracta de marca (sin fotos ni personas inventadas).
 * Las variantes solo cambian la composición, no el significado.
 */
interface IllustrationProps {
  variant: 'landing' | 'time' | 'actions';
}

export function Illustration({ variant }: IllustrationProps) {
  return (
    <div className={`illustration illustration--${variant}`} aria-hidden="true">
      <svg viewBox="0 0 320 180" focusable="false" preserveAspectRatio="xMidYMid slice">
        <rect width="320" height="180" fill="var(--color-nude-soft)" />
        {variant === 'landing' && (
          <>
            <circle cx="92" cy="96" r="58" fill="var(--color-nude)" />
            <circle cx="236" cy="72" r="40" fill="var(--color-cream)" />
            <path
              d="M160 150s-44-26-44-58a24 24 0 0 1 44-14 24 24 0 0 1 44 14c0 32-44 58-44 58Z"
              fill="var(--color-wine)"
            />
            <path d="M162 78l-9 18 13 8-10 20" fill="none" stroke="var(--color-cream)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M24 150c60-30 90 10 140-10s90-40 132-18" fill="none" stroke="var(--color-mauve)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="2 8" />
          </>
        )}
        {variant === 'time' && (
          <>
            <circle cx="160" cy="92" r="62" fill="var(--color-cream)" />
            <circle cx="160" cy="92" r="62" fill="none" stroke="var(--color-nude)" strokeWidth="10" />
            <path d="M160 92V54M160 92l26 16" stroke="var(--color-wine)" strokeWidth="6" strokeLinecap="round" />
            <circle cx="160" cy="92" r="7" fill="var(--color-wine)" />
            <circle cx="52" cy="46" r="14" fill="var(--color-nude)" />
            <circle cx="276" cy="140" r="20" fill="var(--color-nude)" />
          </>
        )}
        {variant === 'actions' && (
          <>
            <rect x="46" y="48" width="118" height="44" rx="22" fill="var(--color-cream)" />
            <rect x="62" y="64" width="70" height="12" rx="6" fill="var(--color-nude)" />
            <rect x="156" y="102" width="118" height="44" rx="22" fill="var(--color-wine)" />
            <rect x="174" y="118" width="54" height="12" rx="6" fill="var(--color-mauve)" />
            <path d="M104 100c0 26 20 24 44 24" fill="none" stroke="var(--color-mauve)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="2 7" />
          </>
        )}
      </svg>
    </div>
  );
}
