import type { GoalNow, RouteId, Timing, WhoEnded } from '../types/quiz';

export interface ResultBlock {
  label: string;
  text: string;
}

export interface ResultContent {
  title: (firstName: string) => string;
  paragraphs: string[];
  blocks: ResultBlock[];
}

export interface DeepenContent {
  title: string;
  items: [string, string, string];
}

export type NormalRouteId = Exclude<RouteId, 'R0'>;

const RESULTS: Record<NormalRouteId, ResultContent> = {
  R1: {
    title: (n) => `${n}, hay señales de que los dos están intentando reconstruir.`,
    paragraphs: [
      'No significa que todo esté arreglado.',
      'Pero hoy no eres tú sola intentando mantener esta historia viva.',
    ],
    blocks: [
      {
        label: 'LO QUE VEMOS',
        text: 'Hay contacto de ambos lados, han hablado claramente de volver y ya existen algunas acciones concretas para intentar cambiar lo que los llevó a terminar.',
      },
      {
        label: 'LO IMPORTANTE AHORA',
        text: 'Volver porque se extrañan es fácil. Lo difícil es no volver exactamente a la relación que terminó.',
      },
    ],
  },
  R2: {
    title: (n) =>
      `${n}, todavía hay vínculo entre ustedes. Pero hoy no hay una reconciliación en marcha.`,
    paragraphs: [
      'Hay contacto.',
      'Puede existir cariño, nostalgia, deseo o incluso encuentros.',
      'Lo que todavía no vemos son suficientes acciones para decir que realmente están reconstruyendo una relación.',
    ],
    blocks: [{ label: 'LO QUE NECESITAS SEPARAR', text: 'Contacto no es lo mismo que reconciliación.' }],
  },
  R3: {
    title: (n) =>
      `${n}, ahora mismo eres tú quien está haciendo la mayor parte del esfuerzo por mantener esta historia viva.`,
    paragraphs: [
      'Cuando tú mueves las cosas, existe contacto.',
      'Pero cuando dejas de hacerlo, gran parte del vínculo se detiene.',
    ],
    blocks: [
      { label: 'ESTO NO SIGNIFICA', text: 'No significa que sepamos lo que siente por dentro.' },
      {
        label: 'LO QUE SÍ SABEMOS',
        text: 'Hoy no está haciendo el mismo esfuerzo que tú por mantener esta conexión.',
      },
    ],
  },
  R4: {
    title: (n) => `${n}, terminaron, pero entre ustedes la historia sigue reiniciándose.`,
    paragraphs: [
      'Cada nuevo acercamiento vuelve a abrir algo que nunca termina de cambiar del todo.',
    ],
    blocks: [
      {
        label: 'EL PROBLEMA NO ES SOLO QUE TODAVÍA SE EXTRAÑEN',
        text: 'El problema es que cada regreso vuelve a traer esperanza antes de comprobar si algo realmente cambió.',
      },
    ],
  },
  R5: {
    title: (n) =>
      `${n}, hoy la relación está detenida en los hechos, aunque emocionalmente tú todavía sigas ahí.`,
    paragraphs: [
      'Ahora necesitamos empezar a conseguir que tu vida deje de quedar pendiente de lo que él haga o deje de hacer.',
    ],
    blocks: [
      { label: 'ESTO NO SIGNIFICA', text: 'No significa que sepamos qué va a ocurrir en el futuro.' },
      { label: 'LO QUE SÍ SABEMOS', text: 'Hoy no hay una relación que se esté reconstruyendo.' },
    ],
  },
};

/** Variante de R5 cuando la ruptura tiene menos de 7 días (timing EARLY). */
const R5_EARLY: ResultContent = {
  title: (n) => `${n}, ahora mismo no hay una reconciliación en marcha.`,
  paragraphs: [
    'Como terminaron hace muy pocos días, todavía es demasiado pronto para convertir el silencio o la distancia en una conclusión definitiva.',
    'Lo que sí podemos trabajar desde hoy es qué hacer tú mientras todo está tan reciente.',
  ],
  blocks: [],
};

export function getResultContent(route: NormalRouteId, timing?: Timing): ResultContent {
  if (route === 'R5' && timing === 'EARLY') return R5_EARLY;
  return RESULTS[route];
}

export const DEEPEN: Record<NormalRouteId, DeepenContent> = {
  R1: {
    title: 'Antes de volver del todo, mira estas 3 cosas',
    items: [
      'Si pueden hablar de lo que los hizo terminar sin barrerlo debajo de la alfombra.',
      'Si los cambios prometidos realmente se están sosteniendo.',
      'Si los dos están haciendo el trabajo o poco a poco vuelve a caer sobre uno solo.',
    ],
  },
  R2: {
    title: 'Mira estas 3 cosas',
    items: [
      'Quién está sosteniendo realmente el contacto.',
      'Si cuando habla contigo también habla de construir algo.',
      'Si después de las palabras aparecen acciones.',
    ],
  },
  R3: {
    title: 'Antes de volver a buscarlo, mira estas 3 cosas',
    items: [
      'Qué ocurre cuando tú dejas de iniciar siempre.',
      'Si él solamente responde o también propone, busca y sostiene.',
      'Cuánto de esta relación seguiría existiendo si tú dejaras de hacer el trabajo por los dos.',
    ],
  },
  R4: {
    title: 'Antes de volver otra vez, mira estas 3 cosas',
    items: [
      'Qué cambió realmente desde la última vez.',
      'Qué suele pasar después de que vuelven a acercarse.',
      'Si están construyendo algo nuevo o simplemente reiniciando lo anterior.',
    ],
  },
  R5: {
    title: 'Ahora mismo hay 3 cosas que necesitas mirar',
    items: [
      'Cuánto de tu día sigue girando alrededor de si aparece o no.',
      'Qué cosas de tu vida quedaron paradas después de la ruptura.',
      'Qué necesitas empezar a recuperar aunque todavía lo extrañes.',
    ],
  },
};

/** Línea secundaria de personalización según Q1 (solo R1-R5). */
export const GOAL_PERSONALIZATION: Record<GoalNow, string> = {
  possible_return: 'Entendemos que una parte de ti todavía quiere saber si pueden volver.',
  contact_or_not:
    'Tu duda principal ahora es si buscarlo otra vez realmente te acercaría a una respuesta.',
  still_feels:
    'Entendemos que quieras saber qué siente, pero este resultado se basa en lo que está ocurriendo, no en intentar leer su mente.',
  worth_waiting:
    'Tu pregunta no es solo si lo quieres. Es si seguir esperando tiene sentido para ti.',
  wasting_time: 'Lo que necesitas ahora es distinguir esperanza de hechos.',
  start_letting_go:
    'Tu objetivo ya está empezando a cambiar: no buscas solo entenderlo a él, también quieres empezar a salir de esta historia.',
  stop_feeling_this_way:
    'Ahora mismo quizá ni siquiera tengas una decisión clara. Solo sabes que no quieres seguir sintiéndote así.',
};

export function getPersonalization(goal?: GoalNow): string | null {
  return goal ? GOAL_PERSONALIZATION[goal] : null;
}

/**
 * Línea de contexto según Q2 (quién terminó), solo R1-R5.
 * Describe el punto de partida sin culpar ni predecir.
 */
export const WHO_ENDED_PERSONALIZATION: Record<WhoEnded, string> = {
  he_ended:
    'Como fue él quien terminó, es natural que ahora estés pendiente de cada cosa que hace. Por eso este resultado se fija en hechos, no en señales sueltas.',
  user_ended:
    'Fuiste tú quien terminó. Eso no te obliga a estar segura de tu decisión, pero sí vale la pena recordar por qué lo hiciste antes de mover algo.',
  mutual:
    'Lo decidieron entre los dos, y aun así duele. Que haya sido mutuo no significa que tengas que tenerlo todo resuelto.',
  unclear:
    'Nunca quedó claro quién terminó. Cuando el final es confuso, es fácil quedarse esperando una respuesta; por eso aquí miramos lo que sí está pasando.',
};

export function getWhoEndedLine(whoEnded?: WhoEnded): string | null {
  return whoEnded ? WHO_ENDED_PERSONALIZATION[whoEnded] : null;
}

export const SAFETY_RESULT = {
  title: 'Antes de pensar en volver, hay algo más importante.',
  paragraphs: [
    'Por lo que nos contaste, en esta relación han ocurrido situaciones que pueden afectar tu seguridad.',
    'Este resultado no va a darte estrategias para recuperar la relación.',
    'Lo más importante ahora es que puedas pensar en tu seguridad y buscar apoyo adecuado.',
  ],
  emergency:
    'Si sientes que estás en peligro inmediato, busca ayuda de emergencia en tu país o contacta a una persona de confianza que pueda acompañarte.',
};
