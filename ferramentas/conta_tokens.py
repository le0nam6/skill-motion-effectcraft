"""Ficha técnica: soma o uso do Claude no transcript da sessão a partir de um horário.
Uso: python3 conta_tokens.py <transcript.jsonl> <inicio ISO, ex. 2026-10-15T10:03:52>
O transcript fica em ~/.claude/projects/<pasta>/<id-da-sessão>.jsonl.
Para o % de sessão: anote o "5-hour limit" e o "Weekly" no início e no fim (get_usage ou o cartão de uso do app).
Comparação com o Pro: Max 5x = 5 sessões do Pro, Max 20x = 20. Ex.: 38 pontos no Max 5x ≈ 190% de uma sessão do Pro."""
import json, sys, datetime
arq, ini = sys.argv[1], datetime.datetime.fromisoformat(sys.argv[2]).astimezone()
tot = dict.fromkeys(["input_tokens", "output_tokens", "cache_read_input_tokens", "cache_creation_input_tokens"], 0); vistos = set()
for linha in open(arq):
    try: d = json.loads(linha)
    except Exception: continue
    if d.get("type") != "assistant" or not d.get("timestamp"): continue
    if datetime.datetime.fromisoformat(d["timestamp"].replace("Z", "+00:00")) < ini: continue
    m = d.get("message", {})
    if m.get("id") in vistos: continue
    vistos.add(m.get("id")); u = m.get("usage") or {}
    for k in tot: tot[k] += u.get(k) or 0
usd = tot["input_tokens"] * 4e-6 + tot["output_tokens"] * 20e-6 + tot["cache_read_input_tokens"] * 0.2e-6 + tot["cache_creation_input_tokens"] * 5e-6
print(f"respostas: {len(vistos)}")
for k, v in tot.items(): print(f"{k}: {v:,}")
print(f"escritos ≈ {tot['output_tokens'] * 0.7:,.0f} palavras (0,7 palavra/token em português; código conta junto)")
print(f"preço de API equivalente (Opus 5.5): US$ {usd:.2f}")
