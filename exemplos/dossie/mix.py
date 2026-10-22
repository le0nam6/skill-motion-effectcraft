"""Mixagem do Reel do dossiê (21/10): voz (Gemini 3.8 TTS, Charon) + riser até o fim do gancho + trilha que entra no impacto,
com ducking + whoosh nas trocas de tela, swoosh nas entradas, glitch só nos destaques e impacto no carimbo. Tempos vêm da saída do medemiti.jsx."""
import os, subprocess, re
P = os.path.dirname(os.path.abspath(__file__))
A = os.path.expanduser("~/Downloads/Estudio/2026-10-21 - Dossiê do cliente/audio")
SFX = os.path.expanduser("~/Developer/fanloop-video/public/sfx")
TRILHA = os.path.expanduser("~/Developer/artcraft/diverno/trilha.mp3")
FIM, GANCHO = 67.0, 5.98
s = open(f"{P}/saida_script.txt").read()
lista = lambda k: [float(x) for x in re.search(k + r" ([-\d.,]+)", s).group(1).split(",") if x]
GLITCH, ENTR, SAIDAS = lista("glitches"), lista("entradas"), lista("saidas")
ev = [(f"{SFX}/riser.mp3", GANCHO - 4.03, 0.45), (f"{SFX}/impacto.mp3", GANCHO, 0.5), (f"{SFX}/impacto.mp3", 14.36, 0.5), (f"{SFX}/impacto.mp3", 25.11, 0.5), (f"{SFX}/impacto.mp3", 56.47, 0.55)]
for t in SAIDAS: ev.append((f"{SFX}/whoosh.mp3", t - 0.05, 0.32))
for t in ENTR:
    if t not in SAIDAS and all(abs(t - b) > 0.2 for b in SAIDAS): ev.append((f"{SFX}/whoosh2.mp3", t - 0.06, 0.2))
for t in GLITCH:
    if t > 0.1 and abs(t - 0.48) > 0.05: ev.append((f"{SFX}/glitch.mp3", t, 0.26))
for t in [32.64, 36.84, 45.46, 46.56, 47.6, 49.0, 58.67]: ev.append((f"{SFX}/pop.mp3", t, 0.3))
ent = ["-i", f"{A}/voz.wav", "-i", TRILHA]
for f, _, _ in ev: ent += ["-i", f]
fl = [f"[0:a]aresample=48000,apad=whole_dur={FIM},volume=1.25[voz]", "[voz]asplit=2[v1][chave]",
      f"[1:a]aresample=48000,atrim=0:{FIM - GANCHO},volume=0.5,afade=t=in:d=0.05,afade=t=out:st={FIM - GANCHO - 1.5}:d=1.5,adelay={int(GANCHO*1000)}|{int(GANCHO*1000)},apad=whole_dur={FIM}[m0]",
      "[m0][chave]sidechaincompress=threshold=0.035:ratio=7:attack=12:release=300[mus]"]
nomes = []
for i, (f, t, vol) in enumerate(ev):
    cut = ",atrim=0:0.22,afade=t=out:st=0.14:d=0.08" if f.endswith("glitch.mp3") else ""
    fl.append(f"[{i+2}:a]aresample=48000{cut},volume={vol},adelay={int(max(0,t)*1000)}|{int(max(0,t)*1000)}[s{i}]"); nomes.append(f"[s{i}]")
fl.append(f"{''.join(nomes)}amix=inputs={len(nomes)}:normalize=0[sfx]")
fl.append(f"[v1][mus][sfx]amix=inputs=3:normalize=0,atrim=0:{FIM},loudnorm=I=-14:TP=-1.5:LRA=11[saida]")
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", *ent, "-filter_complex", ";".join(fl), "-map", "[saida]", "-ar", "48000", f"{P}/mix.wav"], check=True)
print("ok", len(ev), "efeitos")
