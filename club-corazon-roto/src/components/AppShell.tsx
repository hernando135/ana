import type { ReactNode } from 'react';
import { BrandMark } from './BrandMark';
import { ProgressBar } from './ProgressBar';

interface AppShellProps {
  screenKey: string;
  onBack?: () => void;
  progress?: number;
  showBrand?: boolean;
  children: ReactNode;
}

export function AppShell({ screenKey, onBack, progress, showBrand = true, children }: AppShellProps) {
  return (
    <div className="shell">
      <header className="shell__header">
        <div className="shell__bar">
          {onBack ? (
            <button type="button" className="back" onClick={onBack} aria-label="Volver a la pantalla anterior">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M15 5 8 12l7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Atrás</span>
            </button>
          ) : (
            <span className="back-placeholder" />
          )}
          {showBrand && <BrandMark />}
          <span className="back-placeholder" />
        </div>
        {progress !== undefined && <ProgressBar value={progress} />}
      </header>
      <main className="shell__main">
        <div key={screenKey} className="screen">
          {children}
        </div>
      </main>
    </div>
  );
}
