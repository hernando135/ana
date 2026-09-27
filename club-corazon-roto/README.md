# Club del Corazón Roto — Quiz de entrada (V1)

React + TypeScript + Vite. Mobile-first. **Sin IA**: la ruta se asigna con reglas booleanas deterministas.

## Comandos

```bash
npm install
npm run dev      # desarrollo (incluye panel DEV abajo a la derecha)
npm test         # tests (Vitest)
npm run build    # build de producción en dist/ (sin panel DEV)
npm run build:test  # build de prueba en dist-test/ (con panel DEV para ensayar rutas)
npm run lint
```

## Estructura

| Carpeta | Contenido |
| --- | --- |
| `src/types/quiz.ts` | Tipos: respuestas, rutas, pantallas, estados de pago futuros |
| `src/data/questions.ts` | Configuración de Q1–Q14 (IDs y valores conceptuales) |
| `src/data/results.ts` | Copy de R0–R5, R5 EARLY, profundización y personalización Q1 |
| `src/data/copy.ts`, `transitions.ts` | Landing, transiciones, puente, Club, checkout |
| `src/logic/determineRoute.ts` | Clasificador: R0 → R1 → R4 → R3 → R5 → R2 |
| `src/logic/answers.ts` | Limpieza de dependencias (Q4→Q5-Q8, Q9→Q10), seguridad, nombre |
| `src/logic/flow.ts` | Saltos condicionales, siguiente/anterior, progreso |
| `src/logic/quizReducer.ts` | Estado del quiz (puro, testeable) |
| `src/storage/persistence.ts` | localStorage (`ccr.quiz.v1`) con validación y rehidratación |
| `src/config/pricing.ts` | `CLUB_PRICE_COP` (null = "Precio por definir") |
| `src/screens/`, `src/components/` | UI |
| `src/dev/` | Panel DEV y presets por ruta (solo `import.meta.env.DEV`) |
| `src/tests/` | Tests |

## Pagos

ePayco aún no está integrado. El estado guarda `billing.payment_status = unpaid`,
`subscription_status = inactive`, `access_status = locked`, junto a `answers.case_id`.
