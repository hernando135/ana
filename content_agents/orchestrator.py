"""Orquestador: investigador -> estratega -> diseñador. Ejecutar a diario."""
import datetime as dt
import json
import sys
from pathlib import Path

import yaml

sys.path.insert(0, str(Path(__file__).parent))
from agents import designer, researcher, strategist  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
HISTORY = ROOT / "data/history.json"


def main():
    cfg = yaml.safe_load((Path(__file__).parent / "config.yaml").read_text())
    today = dt.date.today().isoformat()
    out_dir = ROOT / "output" / today
    out_dir.mkdir(parents=True, exist_ok=True)
    history = json.loads(HISTORY.read_text()) if HISTORY.exists() else []

    print("1/3 Investigando competencia...")
    trends = researcher.run(cfg, out_dir)
    print("2/3 Creando contenido...")
    plan = strategist.run(cfg, trends, out_dir, history[-30:])
    print("3/3 Diseñando piezas...")
    designer.run(cfg, plan, out_dir)

    history += [{"date": today, "topic": p["topic"]} for p in plan["pieces"]]
    HISTORY.write_text(json.dumps(history, ensure_ascii=False, indent=2))
    print(f"Listo -> {out_dir}")


if __name__ == "__main__":
    main()
