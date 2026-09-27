# Club del Corazón Roto — guía para trabajar en este proyecto

Lee `docs/CONTEXTO.md` antes de cambiar diseño, copy, preguntas, navegación o reglas.
Si un pedido contradice ese contexto, señala la inconsistencia antes de cambiar la
arquitectura central.

Reglas que no se rompen:
- El quiz es determinista: `src/logic/determineRoute.ts` usa solo reglas booleanas
  (orden R0 → R1 → R4 → R3 → R5 → R2). Nada de IA, puntajes ni porcentajes.
- Nada de promesas sobre el ex, manipulación, urgencia falsa, testimonios o
  estadísticas inventadas.
- R0 (seguridad) nunca lleva a contenido de reconquista ni a la oferta del Club.
- Paleta obligatoria en `src/styles/tokens.css`. Mobile-first.
- El precio vive solo en `src/config/pricing.ts`.

Comandos (desde esta carpeta): `npm test`, `npm run lint`, `npm run build`,
`npm run build:test` (build de prueba con panel DEV).
