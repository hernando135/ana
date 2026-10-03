import json
import os
import re

import anthropic

_client = None


def client():
    global _client
    if _client is None:
        _client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
    return _client


def ask_json(model: str, system: str, user: str, max_tokens: int = 8000):
    """Llama a Claude y devuelve el JSON de la respuesta ya parseado."""
    msg = client().messages.create(
        model=model,
        max_tokens=max_tokens,
        system=system + "\n\nResponde ÚNICAMENTE con JSON válido, sin texto adicional ni markdown.",
        messages=[{"role": "user", "content": user}],
    )
    text = "".join(b.text for b in msg.content if b.type == "text").strip()
    text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text)
    return json.loads(text)
