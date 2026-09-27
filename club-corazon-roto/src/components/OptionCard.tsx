interface OptionCardProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
  /** "radio" para opción única, "checkbox" para selección múltiple. */
  mode: 'radio' | 'checkbox';
  disabled?: boolean;
}

export function OptionCard({ label, selected, onSelect, mode, disabled }: OptionCardProps) {
  return (
    <button
      type="button"
      role={mode}
      aria-checked={selected}
      className={`option${selected ? ' option--selected' : ''}`}
      onClick={onSelect}
      disabled={disabled}
    >
      <span className={`option__marker option__marker--${mode}`} aria-hidden="true">
        {selected && (
          <svg viewBox="0 0 16 16" focusable="false">
            <path d="M3.5 8.5 6.5 11.5 12.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="option__label">{label}</span>
    </button>
  );
}
