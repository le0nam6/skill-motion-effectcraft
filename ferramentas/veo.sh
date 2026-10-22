#!/bin/zsh
# Gera um clipe no Veo 3.1 pela API do Gemini e baixa o mp4 quando ficar pronto.
# Uso: GEMINI_API_KEY=... ./veo.sh "prompt" saida.mp4 [modelo=veo-3.1-generate-preview] [segundos=8]
# 1080p só sai com 8 s. Se o "fast" der "high demand" (código 14), tente o modelo padrão.
# Preço de referência (out/2026): padrão ≈ US$ 0,40/s, fast ≈ US$ 0,15/s. Anote no custos.json.
set -e
P="$1"; OUT="$2"; M="${3:-veo-3.1-generate-preview}"; S="${4:-8}"
[ -z "$GEMINI_API_KEY" ] && { echo "defina GEMINI_API_KEY"; exit 1; }
B=https://generativelanguage.googleapis.com/v1beta
REQ=$(python3 -c "import json,sys;print(json.dumps({'instances':[{'prompt':sys.argv[1]}],'parameters':{'aspectRatio':'9:16','durationSeconds':int(sys.argv[2]),'resolution':'1080p'}}))" "$P" "$S")
OP=$(curl -s -X POST "$B/models/$M:predictLongRunning" -H "x-goog-api-key: $GEMINI_API_KEY" -H "Content-Type: application/json" -d "$REQ" | python3 -c "import json,sys;d=json.load(sys.stdin);print(d.get('name') or d)")
echo "operação: $OP"
for i in {1..80}; do
  ST=$(curl -s "$B/$OP" -H "x-goog-api-key: $GEMINI_API_KEY")
  U=$(echo "$ST" | python3 -c "
import json,sys;d=json.load(sys.stdin)
if not d.get('done'): print('PEND')
elif 'error' in d: print('ERR '+d['error']['message'])
else: print(d['response']['generateVideoResponse']['generatedSamples'][0]['video']['uri'])")
  case "$U" in PEND) sleep 15;; ERR*) echo "$U"; exit 1;; *) curl -sL -H "x-goog-api-key: $GEMINI_API_KEY" -o "$OUT" "$U"; echo "ok: $OUT"; exit 0;; esac
done
echo "tempo esgotado"; exit 1
