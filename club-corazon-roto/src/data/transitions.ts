import type { TransitionScreenId } from '../types/quiz';

export interface TransitionContent {
  title: string;
  paragraphs: string[];
  cta: string;
}

export const TRANSITIONS: Record<TransitionScreenId, TransitionContent> = {
  T1: {
    title: 'El tiempo importa, pero no decide solo.',
    paragraphs: [
      'Pueden haber pasado tres días y estar completamente terminados.',
      'O tres meses y seguir dentro de la misma historia.',
      'Ahora necesitamos ver qué está pasando entre ustedes hoy.',
    ],
    cta: 'SEGUIR',
  },
  T2: {
    title: 'Que te extrañe no significa automáticamente que quiera volver.',
    paragraphs: [
      'Y que sigan hablando tampoco.',
      'Por eso estamos mirando algo más importante:',
      'qué está haciendo realmente.',
    ],
    cta: 'SEGUIR',
  },
};
