interface ProgressBarProps {
  value: number; // 0-1
}

export function ProgressBar({ value }: ProgressBarProps) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div
      className="progress"
      role="progressbar"
      aria-label="Progreso del quiz"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
    >
      <div className="progress__fill" style={{ transform: `scaleX(${pct / 100})` }} />
    </div>
  );
}
