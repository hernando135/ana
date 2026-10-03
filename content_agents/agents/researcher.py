"""Agente 1 - Investigador: detecta qué funciona en la competencia."""
import json
import os
from pathlib import Path

import requests

from llm import ask_json

ROOT = Path(__file__).resolve().parents[2]

SYSTEM = """Eres un analista de tendencias de contenido de Instagram. Recibes publicaciones
recientes de cuentas competidoras con sus métricas. Identifica qué patrones generan más
engagement para poder MODELARLOS (no copiarlos): formatos, ganchos (hooks), temas, estructura
de copy, longitud, uso de emojis/hashtags, CTA y horarios. Prioriza por engagement relativo
(likes+comentarios sobre el promedio de la cuenta)."""


def fetch_apify(accounts, limit):
    token = os.environ["APIFY_TOKEN"]
    url = f"https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token={token}"
    payload = {
        "directUrls": [f"https://www.instagram.com/{a}/" for a in accounts],
        "resultsType": "posts",
        "resultsLimit": limit,
    }
    r = requests.post(url, json=payload, timeout=600)
    r.raise_for_status()
    return [
        {
            "account": p.get("ownerUsername"),
            "type": p.get("type"),
            "caption": (p.get("caption") or "")[:600],
            "likes": p.get("likesCount"),
            "comments": p.get("commentsCount"),
            "views": p.get("videoViewCount"),
            "posted_at": p.get("timestamp"),
            "hashtags": p.get("hashtags"),
        }
        for p in r.json()
    ]


def run(cfg, out_dir: Path):
    r = cfg["research"]
    if r["source"] == "apify":
        posts = fetch_apify(cfg["competitors"], r["posts_per_competitor"])
    else:
        posts = json.loads((ROOT / "data/manual_competitor_posts.json").read_text())
    (out_dir / "competitor_posts.json").write_text(json.dumps(posts, ensure_ascii=False, indent=2))

    user = f"""Marca propia: {json.dumps(cfg['brand'], ensure_ascii=False)}

Publicaciones de la competencia:
{json.dumps(posts, ensure_ascii=False)[:60000]}

Devuelve JSON con: {{"top_formats":[...], "winning_hooks":[{{"pattern":"","example":"","why_it_works":""}}],
"hot_topics":[...], "copy_patterns":[...], "hashtag_clusters":[...], "gaps_and_opportunities":[...],
"recommendations_for_today":[...]}}"""
    report = ask_json(cfg["model"], SYSTEM, user)
    (out_dir / "1_trends.json").write_text(json.dumps(report, ensure_ascii=False, indent=2))
    return report
