"""Mede, quadro a quadro, a altura da superfície de um líquido subindo num clipe (fundo escuro acima).
Saída: JSON com a fração da altura (0 = topo, 1 = base) por quadro. Use para prender a máscara de trilha.
Uso: python3 medir_superficie.py clipe.mp4 [limiar=30] > superficie.json   (só precisa de ffmpeg)"""
import subprocess, sys, json
arq, lim = sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 30
W, H = 90, 160
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", arq, "-vf", f"scale={W}:{H}", "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True).stdout
ys = []
for k in range(len(raw) // (W * H)):
    f = raw[k * W * H:(k + 1) * W * H]
    lum = [sum(f[r * W:(r + 1) * W]) / W for r in range(H)]
    ys.append(next((r for r in range(H) if min(lum[r:r + 8]) > lim), H) / H)
json.dump([round(v, 4) for v in ys], sys.stdout)
