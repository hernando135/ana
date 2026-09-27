import type { ReactNode, RefObject } from 'react';

interface ScreenTitleProps {
  titleRef: RefObject<HTMLHeadingElement | null>;
  children: ReactNode;
  className?: string;
}

/** Título principal de cada pantalla: recibe el foco al navegar. */
export function ScreenTitle({ titleRef, children, className = '' }: ScreenTitleProps) {
  return (
    <h1 ref={titleRef} tabIndex={-1} className={`screen__title ${className}`.trim()}>
      {children}
    </h1>
  );
}

export function StickyActions({ children }: { children: ReactNode }) {
  return <div className="actions">{children}</div>;
}
