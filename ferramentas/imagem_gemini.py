"""Gera uma ilustração no Gemini 3 Pro Image (ex.: a planta do supermercado do #02).
Uso: GEMINI_API_KEY=... python3 imagem_gemini.py "prompt" saida.png [proporcao=1:1]
Dica: termine o prompt com "no text, no letters, no logos, no people" para não vir texto inventado."""
import json, os, sys, base64, urllib.request
prompt, saida = sys.argv[1], sys.argv[2]; prop = sys.argv[3] if len(sys.argv) > 3 else "1:1"
k = os.environ["GEMINI_API_KEY"]
body = {"contents": [{"parts": [{"text": prompt}]}], "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": prop}}}
r = json.load(urllib.request.urlopen(urllib.request.Request("https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image:generateContent",
    data=json.dumps(body).encode(), headers={"x-goog-api-key": k, "Content-Type": "application/json"}), timeout=300))
for p in r["candidates"][0]["content"]["parts"]:
    if "inlineData" in p: open(saida, "wb").write(base64.b64decode(p["inlineData"]["data"])); print("ok", saida); break
print(r.get("usageMetadata"))
