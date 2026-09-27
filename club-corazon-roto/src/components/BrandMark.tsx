import { BRAND_NAME } from '../data/copy';

interface BrandMarkProps {
  size?: 'sm' | 'lg';
}

export function BrandMark({ size = 'sm' }: BrandMarkProps) {
  return (
    <div className={`brand brand--${size}`}>
      <svg className="brand__icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path
          d="M16 27.5s-10.5-6.3-10.5-14A6 6 0 0 1 16 9.8a6 6 0 0 1 10.5 3.7c0 7.7-10.5 14-10.5 14Z"
          fill="currentColor"
        />
        <path
          d="M16.6 9.6 14.2 14.4l3.4 2-2.8 5.4"
          fill="none"
          stroke="var(--color-cream)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="brand__name">{BRAND_NAME}</span>
    </div>
  );
}
