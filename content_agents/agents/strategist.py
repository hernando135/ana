"""Agente 2 - Estratega de contenido: ideas, copys, guiones y hashtags."""
import json

from llm import ask_json

SYSTEM = """Eres el estratega de contenido y copywriter de una marca en Instagram. Con el informe
de tendencias creas contenido ORIGINAL que modele los patrones ganadores sin copiar textos de la
competencia. Respeta estrictamente la voz de marca, el CTA y las palabras prohibidas. Nunca
prometas resultados garantizados ni des consejos médicos/legales/financieros como certeza."""


def run(cfg, trends, out_dir, history):
    d = cfg["daily_output"]
    user = f"""Marca: {json.dumps(cfg['brand'], ensure_ascii=False)}
Tendencias de la competencia: {json.dumps(trends, ensure_ascii=False)}
Temas ya publicados recientemente (evita repetir): {json.dumps(history, ensure_ascii=False)}

Crea el plan de hoy: {d['carousels']} carrusel(es), {d['reels_scripts']} guion(es) de reel,
{d['single_posts']} post(s) único(s). JSON:
{{"date_theme":"",
 "pieces":[{{"id":"p1","format":"carousel|reel|single","topic":"","hook":"",
   "slides":[{{"title":"","body":""}}],      // carrusel: 6-8 slides; post único: 1; reel: []
   "reel_script":[{{"time":"0-3s","visual":"","voiceover":"","on_screen_text":""}}],  // solo reel
   "caption":"", "hashtags":["" ], "cta":"", "best_time":"HH:MM", "inspired_by_pattern":""}}]}}"""
    plan = ask_json(cfg["model"], SYSTEM, user)
    (out_dir / "2_content_plan.json").write_text(json.dumps(plan, ensure_ascii=False, indent=2))
    return plan
