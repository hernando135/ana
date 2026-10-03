"""Agente 3 - Diseñador: convierte el plan en imágenes (PNG 1080x1350) con la marca."""
import html
import json
from pathlib import Path

from llm import ask_json

W, H = 1080, 1350

SYSTEM = """Eres un director de arte de Instagram. Dado el copy de una pieza, defines la dirección
visual de cada lámina usando SOLO la paleta y tipografías de la marca. Eres minimalista: texto
legible a tamaño móvil, jerarquía clara, máximo ~35 palabras por lámina. No inventes datos."""

LAYOUTS = ["cover", "text", "quote", "cta"]


def slide_html(brand, s, idx, total):
    c = brand["colors"]
    layout = s.get("layout", "text")
    title = html.escape(s.get("title", ""))
    body = html.escape(s.get("body", "")).replace("\n", "<br>")
    big = layout in ("cover", "quote")
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
*{{box-sizing:border-box;margin:0}}
body{{width:{W}px;height:{H}px;background-color:{c['background']};background-image:radial-gradient(circle at 20% 10%,{s.get('glow', c['primary'])}40,transparent 60%);
color:{c['text']};font-family:{brand['fonts']};display:flex;flex-direction:column;justify-content:center;padding:110px;position:relative}}
.tag{{position:absolute;top:70px;left:110px;color:{c['accent']};letter-spacing:6px;font-size:26px;text-transform:uppercase}}
h1{{font-size:{86 if big else 64}px;line-height:1.1;color:{c['accent'] if layout!='text' else c['primary']};margin-bottom:40px}}
p{{font-size:{44 if big else 46}px;line-height:1.4;opacity:.95}}
.foot{{position:absolute;bottom:70px;left:110px;right:110px;display:flex;justify-content:space-between;font-size:26px;opacity:.7}}
.cta{{margin-top:50px;display:inline-block;border:3px solid {c['accent']};color:{c['accent']};padding:22px 40px;border-radius:60px;font-size:34px}}
</style></head><body>
<div class="tag">{html.escape(brand['name'])} ✦ {html.escape(brand['tagline'])}</div>
<h1>{title}</h1><p>{body}</p>
{f'<div class="cta">{html.escape(brand["cta"])}</div>' if layout == 'cta' else ''}
<div class="foot"><span>@{html.escape(brand['name'].lower())}</span><span>{idx}/{total}</span></div>
</body></html>"""


def render(pages, out_dir: Path):
    from playwright.sync_api import sync_playwright

    paths = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": W, "height": H})
        for name, content in pages:
            pg.set_content(content)
            f = out_dir / name
            pg.screenshot(path=str(f))
            paths.append(str(f))
        b.close()
    return paths


def run(cfg, plan, out_dir: Path):
    brand = cfg["brand"]
    img_dir = out_dir / "3_designs"
    img_dir.mkdir(exist_ok=True)
    manifest = []
    for piece in plan["pieces"]:
        if piece["format"] == "reel":
            slides = [{"title": piece["hook"], "body": piece.get("topic", ""), "layout": "cover"}]  # portada
        else:
            slides = piece["slides"]
        user = f"""Marca: {json.dumps(brand, ensure_ascii=False)}
Pieza: {json.dumps(piece, ensure_ascii=False)}
Para cada lámina devuelve {{"layout":"{'|'.join(LAYOUTS)}","glow":"#hex de la paleta","title":"","body":""}}
(puedes acortar el texto; primera lámina=cover, última=cta en carruseles). JSON: {{"slides":[...]}}
Láminas base: {json.dumps(slides, ensure_ascii=False)}"""
        designed = ask_json(cfg["model"], SYSTEM, user)["slides"]
        pages = [
            (f"{piece['id']}_{i:02d}.png", slide_html(brand, s, i, len(designed)))
            for i, s in enumerate(designed, 1)
        ]
        manifest.append({"piece": piece["id"], "images": render(pages, img_dir)})
    (out_dir / "3_design_manifest.json").write_text(json.dumps(manifest, indent=2))
    return manifest
