# Agentes de contenido para Instagram

Pipeline diario: **Investigador → Estratega/Copywriter → Diseñador**.

| Agente | Qué hace | Salida (`output/AAAA-MM-DD/`) |
|---|---|---|
| `researcher` | Obtiene posts de competidores (Apify o JSON manual) y extrae hooks, formatos, temas | `1_trends.json` |
| `strategist` | Ideas, copys, guiones de reel, hashtags, horario sugerido | `2_content_plan.json` |
| `designer` | Dirección visual + render PNG 1080x1350 con tu paleta | `3_designs/*.png` |

## Puesta en marcha
1. Edita `content_agents/config.yaml` (competidores, marca, colores).
2. En GitHub → Settings → Secrets: `ANTHROPIC_API_KEY` y `APIFY_TOKEN` (opcional; sin él usa `source: manual`).
3. El workflow `.github/workflows/daily-content.yml` corre cada día (ajusta el cron) o manualmente con *Run workflow*.
4. Local: `pip install -r content_agents/requirements.txt && playwright install chromium && python content_agents/orchestrator.py`

## Notas
- No publica automáticamente: revisas el contenido y lo subes (o conectas Meta Graph API después).
- Modela patrones de la competencia, no copia sus textos.
- El scraping de Instagram puede ir contra sus términos; Apify es la vía más estable. Alternativa: pega posts en `data/manual_competitor_posts.json`.
