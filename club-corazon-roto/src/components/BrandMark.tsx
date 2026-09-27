import { BRAND_NAME } from '../data/copy';

interface BrandMarkProps {
  size?: 'sm' | 'lg';
}

export function BrandMark({ size = 'sm' }: BrandMarkProps) {
  return (
    <div className={`brand brand--${size}`}>
      <span className="brand__badge" aria-hidden="true">
        <svg viewBox="0 0 32 32" focusable="false">
          <path
            d="M16 26.5s-9.5-5.7-9.5-12.7A5.4 5.4 0 0 1 16 10.5a5.4 5.4 0 0 1 9.5 3.3c0 7-9.5 12.7-9.5 12.7Z"
            fill="currentColor"
          />
          <path
            d="M16.5 10.4 14.3 14.8l3.1 1.8-2.5 4.9"
            fill="none"
            stroke="var(--color-wine)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="brand__name">{BRAND_NAME}</span>
    </div>
  );
}
