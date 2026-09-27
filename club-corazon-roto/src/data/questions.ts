import type {
  QuestionScreenId,
  SafetyOption,
  SingleChoiceField,
} from '../types/quiz';
import { NAME_MIN_LENGTH } from '../logic/answers';

export interface ChoiceOption<V extends string = string> {
  /** ID conceptual de la opción, p. ej. "Q1_A". */
  id: string;
  label: string;
  value: V;
}

export interface SingleChoiceQuestion {
  kind: 'single';
  screen: QuestionScreenId;
  field: SingleChoiceField;
  title: string;
  intro?: string;
  options: ChoiceOption[];
}

export interface SafetyQuestion {
  kind: 'safety';
  screen: 'Q13';
  field: 'safety';
  intro: string;
  title: string;
  options: ChoiceOption<SafetyOption>[];
  exclusiveValue: SafetyOption;
}

export interface NameQuestion {
  kind: 'name';
  screen: 'Q14';
  field: 'first_name';
  title: string;
  placeholder: string;
  cta: string;
  minLength: number;
}

export type Question = SingleChoiceQuestion | SafetyQuestion | NameQuestion;

export const SINGLE_CHOICE_QUESTIONS: SingleChoiceQuestion[] = [
  {
    kind: 'single',
    screen: 'Q1',
    field: 'goal_now',
    title: '¿Qué quieres saber de verdad?',
    options: [
      { id: 'Q1_A', label: 'Si todavía hay posibilidad de volver.', value: 'possible_return' },
      { id: 'Q1_B', label: 'Si debería buscarlo o dejar de hacerlo.', value: 'contact_or_not' },
      { id: 'Q1_C', label: 'Si él todavía siente algo por mí.', value: 'still_feels' },
      { id: 'Q1_D', label: 'Si vale la pena esperar.', value: 'worth_waiting' },
      { id: 'Q1_E', label: 'Si estoy perdiendo el tiempo.', value: 'wasting_time' },
      { id: 'Q1_F', label: 'Cómo empezar a soltarlo.', value: 'start_letting_go' },
      { id: 'Q1_G', label: 'No sé. Solo quiero dejar de sentirme así.', value: 'stop_feeling_this_way' },
    ],
  },
  {
    kind: 'single',
    screen: 'Q2',
    field: 'who_ended',
    title: '¿Quién terminó la relación?',
    options: [
      { id: 'Q2_A', label: 'Él terminó conmigo.', value: 'he_ended' },
      { id: 'Q2_B', label: 'Yo terminé con él.', value: 'user_ended' },
      { id: 'Q2_C', label: 'Fue una decisión de los dos.', value: 'mutual' },
      { id: 'Q2_D', label: 'Nunca quedó del todo claro quién terminó.', value: 'unclear' },
    ],
  },
  {
    kind: 'single',
    screen: 'Q3',
    field: 'time_since_breakup',
    title: '¿Hace cuánto terminaron?',
    options: [
      { id: 'Q3_A', label: 'Menos de 7 días.', value: 'less_7_days' },
      { id: 'Q3_B', label: 'Entre 1 y 4 semanas.', value: '1_4_weeks' },
      { id: 'Q3_C', label: 'Entre 1 y 3 meses.', value: '1_3_months' },
      { id: 'Q3_D', label: 'Entre 3 y 6 meses.', value: '3_6_months' },
      { id: 'Q3_E', label: 'Entre 6 meses y 1 año.', value: '6_12_months' },
      { id: 'Q3_F', label: 'Más de un año.', value: 'more_1_year' },
    ],
  },
  {
    kind: 'single',
    screen: 'Q4',
    field: 'contact_level',
    title: '¿Cuánto contacto tienen actualmente?',
    options: [
      { id: 'Q4_A', label: 'Hablamos casi todos los días.', value: 'frequent' },
      { id: 'Q4_B', label: 'Hablamos de vez en cuando.', value: 'occasional' },
      { id: 'Q4_C', label: 'Muy poco. Algún mensaje o contacto aislado.', value: 'very_little' },
      { id: 'Q4_D', label: 'Nada. No estamos hablando.', value: 'none' },
    ],
  },
  {
    kind: 'single',
    screen: 'Q5',
    field: 'contact_initiator',
    title: '¿Quién suele iniciar el contacto?',
    options: [
      { id: 'Q5_A', label: 'Él me busca más a mí.', value: 'mostly_him' },
      { id: 'Q5_B', label: 'Los dos nos buscamos.', value: 'both' },
      { id: 'Q5_C', label: 'Yo lo busco un poco más.', value: 'user_more' },
      { id: 'Q5_D', label: 'Casi siempre soy yo.', value: 'mostly_user' },
    ],
  },
  {
    kind: 'single',
    screen: 'Q6',
    field: 'without_user_initiating',
    title: 'Cuando tú no lo buscas, ¿qué pasa?',
    options: [
      { id: 'Q6_A', label: 'Él termina buscándome.', value: 'he_contacts' },
      { id: 'Q6_B', label: 'Tarda, pero termina apareciendo.', value: 'eventually_appears' },
      { id: 'Q6_C', label: 'Solo reacciona a historias o manda cualquier bobada.', value: 'small_contact' },
      { id: 'Q6_D', label: 'Solo aparece cuando quiere verme.', value: 'only_meet' },
      { id: 'Q6_E', label: 'Principalmente aparece cuando quiere sexo.', value: 'only_sex' },
      { id: 'Q6_F', label: 'No pasa nada.', value: 'nothing' },
      { id: 'Q6_G', label: 'No lo sé porque termino buscándolo yo antes.', value: 'user_contacts_first' },
    ],
  },
  {
    kind: 'single',
    screen: 'Q7',
    field: 'return_conversation',
    title: 'Actualmente, ¿han hablado claramente de volver?',
    options: [
      { id: 'Q7_A', label: 'Sí. Los dos hemos dicho que queremos intentarlo.', value: 'both_want_return' },
      { id: 'Q7_B', label: 'Me dice que me quiere o me extraña, pero no habla de volver.', value: 'misses_no_return' },
      { id: 'Q7_C', label: 'Dice que no sabe qué quiere.', value: 'doesnt_know' },
      { id: 'Q7_D', label: 'Me pide tiempo.', value: 'asks_for_time' },
      { id: 'Q7_E', label: 'Me ha dicho que no quiere una relación.', value: 'doesnt_want_relationship' },
      { id: 'Q7_F', label: 'Evita hablar del tema.', value: 'avoids_topic' },
      { id: 'Q7_G', label: 'Dice una cosa y después hace otra.', value: 'words_actions_conflict' },
      { id: 'Q7_H', label: 'Nunca hemos hablado claramente de volver.', value: 'never_discussed_return' },
    ],
  },
  {
    kind: 'single',
    screen: 'Q8',
    field: 'repair_actions',
    title:
      'Más allá de lo que dice, ¿está haciendo algo concreto para arreglar lo que los llevó a terminar?',
    options: [
      { id: 'Q8_A', label: 'Sí. Y esos cambios se están manteniendo.', value: 'concrete_sustained' },
      { id: 'Q8_B', label: 'Sí, he visto algunas acciones concretas.', value: 'some_concrete' },
      { id: 'Q8_C', label: 'Habla de cambiar, pero veo muy poco.', value: 'mostly_words' },
      { id: 'Q8_D', label: 'No.', value: 'none' },
      { id: 'Q8_E', label: 'Ni siquiera hemos hablado realmente de lo que nos hizo terminar.', value: 'cause_not_discussed' },
      { id: 'Q8_F', label: 'No sé qué tendría que cambiar para que esto funcionara.', value: 'unclear_change' },
    ],
  },
  {
    kind: 'single',
    screen: 'Q9',
    field: 'cycle_count',
    title:
      '¿Cuántas veces han terminado o se han alejado y después vuelto a acercarse?',
    options: [
      { id: 'Q9_A', label: 'Nunca.', value: 'never' },
      { id: 'Q9_B', label: 'Una vez.', value: 'once' },
      { id: 'Q9_C', label: 'Dos o tres veces.', value: 'two_three' },
      { id: 'Q9_D', label: 'Muchas veces. Ya perdí la cuenta.', value: 'many' },
    ],
  },
  {
    kind: 'single',
    screen: 'Q10',
    field: 'after_reconnection',
    title: 'Cuando vuelven a acercarse, ¿qué suele pasar después?',
    options: [
      { id: 'Q10_A', label: 'Hablamos de lo que pasó e intentamos arreglar la relación.', value: 'try_rebuild' },
      { id: 'Q10_B', label: 'Nos vemos y seguimos hablando, pero nada queda claro.', value: 'contact_no_clarity' },
      { id: 'Q10_C', label: 'Tenemos sexo y después vuelvo a quedar confundida.', value: 'sex_confusion' },
      { id: 'Q10_D', label: 'Durante unos días todo es intenso y después vuelve a ponerse frío.', value: 'intense_then_cold' },
      { id: 'Q10_E', label: 'Volvemos oficialmente y después terminamos otra vez.', value: 'return_then_breakup' },
    ],
  },
  {
    kind: 'single',
    screen: 'Q11',
    field: 'main_pain',
    title: '¿Qué es lo que más te está doliendo ahora mismo?',
    options: [
      { id: 'Q11_A', label: 'No saber si va a volver.', value: 'will_he_return' },
      { id: 'Q11_B', label: 'No saber si todavía me quiere.', value: 'does_he_love_me' },
      { id: 'Q11_C', label: 'Pensar que puede estar con otra.', value: 'another_person' },
      { id: 'Q11_D', label: 'Sentir que él siguió con su vida y yo sigo aquí.', value: 'he_moved_on' },
      { id: 'Q11_E', label: 'Tener ganas de escribirle todo el tiempo.', value: 'urge_to_contact' },
      { id: 'Q11_F', label: 'Que aparezca y después vuelva a desaparecer.', value: 'appears_disappears' },
      { id: 'Q11_G', label: 'No saber si esperar o seguir con mi vida.', value: 'wait_or_move' },
      { id: 'Q11_H', label: 'Saber que no me conviene y aun así quererlo.', value: 'know_not_good' },
      { id: 'Q11_I', label: 'Sentir que llevo demasiado tiempo atrapada en esto.', value: 'stuck' },
    ],
  },
  {
    kind: 'single',
    screen: 'Q12',
    field: 'return_position',
    title: 'Si mañana apareciera y te dijera ‘volvamos’, ¿qué harías?',
    options: [
      { id: 'Q12_A', label: 'Volvería sin pensarlo mucho.', value: 'return_now' },
      { id: 'Q12_B', label: 'Volvería, pero necesito ver cambios de verdad.', value: 'return_with_changes' },
      { id: 'Q12_C', label: 'Primero tendría que hablar con él de muchas cosas.', value: 'talk_first' },
      { id: 'Q12_D', label: 'No sé. Una parte quiere volver y otra sabe que quizá no debería.', value: 'ambivalent' },
      { id: 'Q12_E', label: 'Ya no quiero volver. Solo quiero dejar de extrañarlo.', value: 'dont_want_return' },
    ],
  },
];

export const SAFETY_QUESTION: SafetyQuestion = {
  kind: 'safety',
  screen: 'Q13',
  field: 'safety',
  intro: 'Antes de mostrarte tu resultado, necesitamos preguntarte algo importante.',
  title: '¿Ha pasado alguna de estas cosas en esta relación?',
  exclusiveValue: 'none_of_these',
  options: [
    { id: 'Q13_A', label: 'Me ha amenazado.', value: 'threatened' },
    { id: 'Q13_B', label: 'Me ha golpeado o lastimado físicamente.', value: 'physical_harm' },
    { id: 'Q13_C', label: 'Me ha obligado o presionado sexualmente.', value: 'sexual_coercion' },
    { id: 'Q13_D', label: 'Me controla, persigue o vigila.', value: 'control_surveillance' },
    { id: 'Q13_E', label: 'Tengo miedo de cómo podría reaccionar.', value: 'fear_of_reaction' },
    { id: 'Q13_F', label: 'Ninguna de estas.', value: 'none_of_these' },
  ],
};

export const NAME_QUESTION: NameQuestion = {
  kind: 'name',
  screen: 'Q14',
  field: 'first_name',
  title: '¿Cómo te llamas?',
  placeholder: 'Tu nombre',
  cta: 'VER MI RESULTADO',
  minLength: NAME_MIN_LENGTH,
};

const BY_SCREEN = new Map<QuestionScreenId, Question>([
  ...SINGLE_CHOICE_QUESTIONS.map((q) => [q.screen, q] as const),
  [SAFETY_QUESTION.screen, SAFETY_QUESTION],
  [NAME_QUESTION.screen, NAME_QUESTION],
]);

export function getQuestion(screen: QuestionScreenId): Question {
  const q = BY_SCREEN.get(screen);
  if (!q) throw new Error(`Pregunta desconocida: ${screen}`);
  return q;
}
