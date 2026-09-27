import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../App';
import { STORAGE_KEY, loadState } from '../storage/persistence';

const LONG = { timeout: 6000 };

async function pick(user: ReturnType<typeof userEvent.setup>, label: string) {
  await user.click(await screen.findByRole('radio', { name: label }));
}

async function heading(text: string | RegExp) {
  return screen.findByRole('heading', { level: 1, name: text }, LONG);
}

async function answerUntilContact(user: ReturnType<typeof userEvent.setup>, time: string) {
  await user.click(screen.getByRole('button', { name: 'EMPEZAR' }));
  await heading('¿Qué quieres saber de verdad?');
  await pick(user, 'Si estoy perdiendo el tiempo.');
  await heading('¿Quién terminó la relación?');
  await pick(user, 'Él terminó conmigo.');
  await heading('¿Hace cuánto terminaron?');
  await pick(user, time);
  await heading('El tiempo importa, pero no decide solo.');
  await user.click(screen.getByRole('button', { name: 'SEGUIR' }));
  await heading('¿Cuánto contacto tienen actualmente?');
}

async function finishFromQ11(user: ReturnType<typeof userEvent.setup>, safety: string, name: string) {
  await heading('¿Qué es lo que más te está doliendo ahora mismo?');
  await pick(user, 'Sentir que llevo demasiado tiempo atrapada en esto.');
  await heading(/Si mañana apareciera/);
  await pick(user, 'No sé. Una parte quiere volver y otra sabe que quizá no debería.');
  await heading('¿Ha pasado alguna de estas cosas en esta relación?');
  const cont = screen.getByRole('button', { name: 'CONTINUAR' });
  expect(cont).toBeDisabled();
  await user.click(screen.getByRole('checkbox', { name: safety }));
  await user.click(cont);
  await heading('¿Cómo te llamas?');
  await user.type(screen.getByPlaceholderText('Tu nombre'), name);
  await user.click(screen.getByRole('button', { name: 'VER MI RESULTADO' }));
}

describe('App — recorrido completo', () => {
  it('sin contacto + menos de 7 días → R5 EARLY, profundización, puente, Club y checkout', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      '¿Todavía hay algo que hacer entre ustedes… o ya estás perdiendo el tiempo?',
    );
    await answerUntilContact(user, 'Menos de 7 días.');
    await pick(user, 'Nada. No estamos hablando.');
    // Q5-Q8 y T2 se saltan
    await heading('¿Cuántas veces han terminado o se han alejado y después vuelto a acercarse?');
    await pick(user, 'Nunca.');
    // Q10 se salta
    await finishFromQ11(user, 'Ninguna de estas.', 'Valentina');

    await heading('Valentina, ahora mismo no hay una reconciliación en marcha.');
    expect(screen.getByText('Lo que necesitas ahora es distinguir esperanza de hechos.')).toBeInTheDocument();
    expect(screen.getByText(/Como fue él quien terminó/)).toBeInTheDocument();
    expect(screen.queryByText(/se acabó definitivamente/i)).not.toBeInTheDocument();
    expect(loadState()?.answers.route).toBe('R5');

    expect(screen.getByRole('heading', { level: 2, name: 'Ahora mismo hay 3 cosas que necesitas mirar' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '¿QUÉ DEBERÍA MIRAR AHORA?' }));
    await user.click(screen.getByRole('button', { name: 'SEGUIR' }));
    await heading('Tu resultado es una foto de lo que está pasando hoy.');
    expect(screen.getByText('Descubres que hay otra persona.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Haz parte del Club del Corazón Roto' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'EMPEZAR MIS 30 DÍAS' }));
    await heading('Tus primeros 30 días en el Club');
    expect(screen.getByTestId('club-price')).toHaveTextContent('Precio por definir');
    await user.click(screen.getByRole('button', { name: 'CONTINUAR AL PAGO' }));
    expect(screen.getByRole('status')).toHaveTextContent('Integración con ePayco pendiente.');
    expect(loadState()?.billing.payment_status).toBe('unpaid');
  }, 20000);

  it('seguridad marcada → R0 sin contenido de reconquista ni Club', async () => {
    const user = userEvent.setup();
    render(<App />);
    await answerUntilContact(user, 'Entre 1 y 3 meses.');
    await pick(user, 'Hablamos casi todos los días.');
    await heading('¿Quién suele iniciar el contacto?');
    await pick(user, 'Los dos nos buscamos.');
    await heading('Cuando tú no lo buscas, ¿qué pasa?');
    await pick(user, 'Él termina buscándome.');
    await heading('Actualmente, ¿han hablado claramente de volver?');
    await pick(user, 'Sí. Los dos hemos dicho que queremos intentarlo.');
    await heading(/Más allá de lo que dice/);
    await pick(user, 'Sí. Y esos cambios se están manteniendo.');
    await heading('Que te extrañe no significa automáticamente que quiera volver.');
    await user.click(screen.getByRole('button', { name: 'SEGUIR' }));
    await heading(/¿Cuántas veces/);
    await pick(user, 'Una vez.');
    await heading('Cuando vuelven a acercarse, ¿qué suele pasar después?');
    await pick(user, 'Hablamos de lo que pasó e intentamos arreglar la relación.');
    await finishFromQ11(user, 'Tengo miedo de cómo podría reaccionar.', 'Sofía');

    await heading('Antes de pensar en volver, hay algo más importante.');
    expect(screen.getByText(/busca ayuda de emergencia en tu país/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '¿QUÉ DEBERÍA MIRAR AHORA?' })).not.toBeInTheDocument();
    expect(screen.queryByText('Para eso existe el Club.')).not.toBeInTheDocument();
    expect(loadState()?.answers.route).toBe('R0');
  }, 20000);

  it('atrás funciona y un cambio en Q4 obliga a responder Q5 otra vez', async () => {
    const user = userEvent.setup();
    render(<App />);
    await answerUntilContact(user, 'Entre 1 y 4 semanas.');
    await pick(user, 'Nada. No estamos hablando.');
    await heading(/¿Cuántas veces/);
    await user.click(screen.getByRole('button', { name: 'Volver a la pantalla anterior' }));
    await heading('¿Cuánto contacto tienen actualmente?');
    expect(screen.getByRole('radio', { name: 'Nada. No estamos hablando.' })).toHaveAttribute('aria-checked', 'true');
    await pick(user, 'Hablamos de vez en cuando.');
    await heading('¿Quién suele iniciar el contacto?');
    expect(screen.getAllByRole('radio').every((r) => r.getAttribute('aria-checked') === 'false')).toBe(true);
    expect(screen.queryByRole('button', { name: 'CONTINUAR' })).not.toBeInTheDocument();
  }, 20000);

  it('recargar conserva la pantalla y las respuestas', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);
    await answerUntilContact(user, 'Más de un año.');
    unmount();
    expect(window.localStorage.getItem(STORAGE_KEY)).toContain('more_1_year');
    render(<App />);
    await heading('¿Cuánto contacto tienen actualmente?');
    await waitFor(() => expect(loadState()?.answers.timing).toBe('LONG'));
  }, 20000);
});
