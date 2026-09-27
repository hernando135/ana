import { useState, type FormEvent } from 'react';
import { Button } from '../components/Button';
import { ScreenTitle } from '../components/Screen';
import { NAME_QUESTION } from '../data/questions';
import { useScreenFocus } from '../hooks/useScreenFocus';
import { isValidName } from '../logic/answers';

interface Props {
  value: string;
  onChange: (name: string) => void;
  onSubmit: () => void;
}

export function NameScreen({ value, onChange, onSubmit }: Props) {
  const titleRef = useScreenFocus<HTMLHeadingElement>('Q14');
  const [touched, setTouched] = useState(false);
  const valid = isValidName(value);
  const showError = touched && !valid;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (valid) onSubmit();
  };

  return (
    <section className="question">
      <form onSubmit={handleSubmit} noValidate>
        <ScreenTitle titleRef={titleRef}>
          <label htmlFor="first-name">{NAME_QUESTION.title}</label>
        </ScreenTitle>
        <input
          id="first-name"
          className={`input${showError ? ' input--error' : ''}`}
          type="text"
          name="first_name"
          autoComplete="given-name"
          autoCapitalize="words"
          maxLength={40}
          placeholder={NAME_QUESTION.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setTouched(true)}
          aria-invalid={showError}
          aria-describedby="first-name-help"
        />
        <p id="first-name-help" className={`field-help${showError ? ' field-help--error' : ''}`} aria-live="polite">
          {showError
            ? `Escribe al menos ${NAME_QUESTION.minLength} caracteres.`
            : 'Solo lo usamos para tu resultado.'}
        </p>
        <div className="actions">
          <Button type="submit" className="btn--block" aria-disabled={!valid}>
            {NAME_QUESTION.cta}
          </Button>
        </div>
      </form>
    </section>
  );
}
