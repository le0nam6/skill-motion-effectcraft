"""Mixagem do Marketing da Ilha #02 (Grupo Mateus): voz (Gemini TTS) + trilha (Lyria) com ducking + efeitos nos eventos."""
import os, subprocess
P = os.path.dirname(os.path.abspath(__file__))
SFX = os.path.expanduser("~/Developer/fanloop-video/public/sfx")
OFF, FIM = 0.3, 83.0
V = lambda s: s + OFF
ev = []
for t in [V(8.30), V(12.34), V(23.60), V(28.41), V(37.60), V(45.00), V(58.31), V(67.50), V(73.3)]: ev.append(("whoosh.mp3", t - 0.3, 0.5))  # trocas de cena
for t in [V(1.05), V(5.40), V(13.62), V(15.40), V(20.85), V(24.87), V(33.10), V(40.45), V(50.62), V(53.45), V(59.62), V(67.50), V(70.09)]: ev.append(("pop.mp3", t, 0.3))
for i in range(17): ev.append(("bip.mp3", V(26.55) + i * 0.045, 0.06))  # as 17 lojas se espalhando
for t in [V(1.05), V(39.77), V(47.31), V(53.19), V(56.37)]: ev.append(("impacto.mp3", t, 0.38))
ev.append(("clique.mp3", V(43.95), 0.4)); ev.append(("clique.mp3", V(66.2), 0.4))
ev.append(("riser.mp3", V(44.0), 0.25))
ev.append(("whoosh2.mp3", 78.5, 0.3)); ev.append(("impacto.mp3", 78.5 + 1.55 + 0.32, 0.5))
ent = ["-i", f"{P}/voz.wav", "-i", f"{P}/trilha.mp3"]
for f, _, _ in ev: ent += ["-i", f if f.startswith("/") else f"{SFX}/{f}"]
fl = [f"[0:a]aresample=48000,adelay={int(OFF*1000)}|{int(OFF*1000)},apad=whole_dur={FIM},volume=1.2[voz]", "[voz]asplit=2[v1][chave]",
      f"[1:a]aresample=48000,apad=whole_dur={FIM},atrim=0:{FIM},volume=0.5,afade=t=in:d=0.05,afade=t=out:st={FIM-3}:d=3[m0]",
      "[m0][chave]sidechaincompress=threshold=0.035:ratio=7:attack=12:release=300[mus]"]
nomes = []
for i, (f, t, vol) in enumerate(ev):
    fl.append(f"[{i+2}:a]aresample=48000,volume={vol},adelay={int(t*1000)}|{int(t*1000)}[s{i}]"); nomes.append(f"[s{i}]")
fl.append(f"{''.join(nomes)}amix=inputs={len(nomes)}:normalize=0[sfx]")
fl.append(f"[v1][mus][sfx]amix=inputs=3:normalize=0,atrim=0:{FIM},loudnorm=I=-14:TP=-1.5:LRA=11[saida]")
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", *ent, "-filter_complex", ";".join(fl), "-map", "[saida]", "-ar", "48000", P + "/mix.wav"], check=True)
print("ok", len(ev), "efeitos")
