"""Mixagem do Diverno v4 (voz_f): voz (voz_c, Gemini TTS Charon, pausas encurtadas) + riser até o fim do gancho + trilha (Lyria) que
entra no impacto, com ducking + efeitos: whoosh nas trocas de tela, swoosh nas fotos e ícones, glitch só nos destaques,
impacto em co-branding, 2010 e "maiores". Os tempos dos efeitos vêm do diverno2.jsx (saída do script)."""
import os, subprocess, sys
P = os.path.dirname(os.path.abspath(__file__))
A = os.path.expanduser("~/Downloads/marketing-da-ilha/03-diverno/audio")
SFX = os.path.expanduser("~/Developer/fanloop-video/public/sfx")
FIM, GANCHO = 84.0, 4.35
SAIDAS = [4.5, 9.3, 16.95, 27.45, 33.7, 43.2, 58.95, 65.3, 73.3, 76.85, 80.75]
ENTRADAS_FOTO = [10.36, 11.58, 17.81, 20.34, 27.69, 33.92, 41.39, 61.94, 46.19, 46.51, 70.52, 71.74, 72.47, 52.95, 54.1, 54.93]
GLITCH = [2.8,3.54,5.68,5.83,7.03,12.04,16.5,18.15,20.51,24.41,26.62,28.32,30.9,31.31,33.2,34.74,34.99,36.42,36.76,38.32,41.39,42.84,44.82,57.09,58.5,59.79,61.28,63.87,64.78,67.1,69.52,74.02,75.35]
ev = [(f"{SFX}/riser.mp3", GANCHO - 4.03, 0.5), (f"{SFX}/impacto.mp3", GANCHO, 0.5)]
for t in SAIDAS: ev.append((f"{SFX}/whoosh.mp3", t - 0.05, 0.32))
for t in ENTRADAS_FOTO: ev.append((f"{SFX}/whoosh2.mp3", t - 0.06, 0.2))
for t in GLITCH: ev.append((f"{SFX}/glitch.mp3", t, 0.28))
for t in [44.82, 52.06, 34.74, 80.9]: ev.append((f"{SFX}/impacto.mp3", t, 0.4))
ev.append((f"{SFX}/pop.mp3", 0.0, 0.25)); ev.append((f"{SFX}/pop.mp3", 0.12, 0.25)); ev.append((f"{SFX}/pop.mp3", 0.24, 0.25))
ent = ["-i", f"{A}/voz_f.wav", "-i", f"{A}/trilha.mp3"]
for f, _, _ in ev: ent += ["-i", f]
fl = [f"[0:a]aresample=48000,apad=whole_dur={FIM},volume=1.25[voz]", "[voz]asplit=2[v1][chave]",
      f"[1:a]aresample=48000,asplit=2[ta][tb]", "[ta]atrim=0:60,asetpts=PTS-STARTPTS[t1]", "[tb]atrim=40,asetpts=PTS-STARTPTS[t2]",
      f"[t1][t2]acrossfade=d=2:c1=tri:c2=tri,atrim=0:{FIM - GANCHO},volume=0.5,afade=t=in:d=0.05,afade=t=out:st={FIM - GANCHO - 1.5}:d=1.5,adelay={int(GANCHO*1000)}|{int(GANCHO*1000)},apad=whole_dur={FIM}[m0]",
      "[m0][chave]sidechaincompress=threshold=0.035:ratio=7:attack=12:release=300[mus]"]
nomes = []
for i, (f, t, vol) in enumerate(ev):
    cut = ",atrim=0:0.22,afade=t=out:st=0.14:d=0.08" if f.endswith("glitch.mp3") else ""
    fl.append(f"[{i+2}:a]aresample=48000{cut},volume={vol},adelay={int(max(0,t)*1000)}|{int(max(0,t)*1000)}[s{i}]"); nomes.append(f"[s{i}]")
fl.append(f"{''.join(nomes)}amix=inputs={len(nomes)}:normalize=0[sfx]")
fl.append(f"[v1][mus][sfx]amix=inputs=3:normalize=0,atrim=0:{FIM},loudnorm=I=-14:TP=-1.5:LRA=11[saida]")
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", *ent, "-filter_complex", ";".join(fl), "-map", "[saida]", "-ar", "48000", f"{P}/mix2.wav"], check=True)
print("ok", len(ev), "efeitos")
