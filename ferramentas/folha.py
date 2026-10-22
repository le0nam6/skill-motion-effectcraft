"""Renderiza quadros de conferência e monta uma folha de contato (uma imagem só para olhar de uma vez).
Uso: python3 folha.py projeto.ecproj Comp saida.png 2.6 5.3 7.2 ...   (precisa de Pillow)"""
import subprocess, sys, os, tempfile
from PIL import Image, ImageDraw
EC = os.path.expanduser("~/Developer/artcraft/bin/effectcraft-cli-0.14.0-macos-universal/effectcraft-cli")
proj, comp, saida, ts = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4:]
tmp = tempfile.mkdtemp(); ims = []
for t in ts:  # um por vez: em laço de shell o zsh não separa a lista dentro de uma variável
    f = os.path.join(tmp, f"{t}.png")
    subprocess.run([EC, "render-frame", proj, "--comp", comp, "--time", t, "--max-side", "640", "--out", f], capture_output=True)
    ims.append((t, Image.open(f)))
w, h = ims[0][1].size; col = min(6, len(ims)); lin = (len(ims) + col - 1) // col
S = Image.new("RGB", (w * col, h * lin))
for i, (t, im) in enumerate(ims):
    S.paste(im, ((i % col) * w, (i // col) * h)); ImageDraw.Draw(S).text(((i % col) * w + 8, (i // col) * h + 8), t, fill="yellow")
S.save(saida); print(saida)
