"""Mixagem do Marketing da Ilha #01: voz (Gemini 3.8 TTS) + trilha (Lyria 3.5) com ducking + efeitos nos eventos."""
import os, subprocess
A = os.path.dirname(os.path.abspath(__file__)) + "/audio"
SFX = os.path.expanduser("~/Developer/fanloop-video/public/sfx")
OFF, FIM = 0.3, 55.6
V = lambda s: s + OFF
ev = []
for t in [5.66, 10.70, 17.68, 22.18, 29.29, 33.28, 38.32, 47.15]: ev.append(("whoosh.mp3", t - 0.3, 0.5))  # trocas de cena (voo da câmera)
for t in [V(0.21), V(6.95), V(7.65), V(10.03), V(12.30), V(16.25), V(19.55), V(22.9), V(31.62), V(34.3), V(38.74), V(42.85), V(43.47), V(46.4)]: ev.append(("pop.mp3", t, 0.32))
for i in range(12): ev.append(("bip.mp3", V(17.49) + i * 0.075, 0.08))
for t in [V(4.69), V(9.06), V(19.55), V(23.40), V(27.22), V(37.05), V(42.77), V(45.04)]: ev.append(("impacto.mp3", t, 0.4))
ev.append(("clique.mp3", V(13.0), 0.4)); ev.append(("clique.mp3", V(35.4), 0.4))
ev.append(("riser.mp3", 46.0, 0.3))
ev.append(("whoosh2.mp3", 1.75, 0.25)); ev.append((A + "/glitch_curto.wav", V(1.98), 0.3))  # mapa e Maranhão
ev.append((A + "/liquido_fizz.wav", 16.70, 0.9))  # som do próprio clipe do Veo: o guaraná subindo
for i in range(7): ev.append(("pop.mp3", 47.5 + i * 0.09, 0.18))
ev.append(("whoosh2.mp3", 51.7, 0.3)); ev.append(("impacto.mp3", 51.7 + 1.55 + 0.32, 0.5))
ent = ["-i", f"{A}/take_a.wav", "-i", f"{A}/trilha_lyria-3.5.mp3"]
for f, _, _ in ev: ent += ["-i", f if f.startswith("/") else f"{SFX}/{f}"]
fl = [f"[0:a]aresample=48000,adelay={int(OFF*1000)}|{int(OFF*1000)},apad=whole_dur={FIM},volume=1.2[voz]", "[voz]asplit=2[v1][chave]",
      f"[1:a]aresample=48000,atrim=0:{FIM},volume=0.5,afade=t=in:d=0.05,afade=t=out:st={FIM-2.2}:d=2.2[m0]",
      "[m0][chave]sidechaincompress=threshold=0.035:ratio=7:attack=12:release=300[mus]"]
nomes = []
for i, (f, t, vol) in enumerate(ev):
    fl.append(f"[{i+2}:a]aresample=48000,volume={vol},adelay={int(t*1000)}|{int(t*1000)}[s{i}]"); nomes.append(f"[s{i}]")
fl.append(f"{''.join(nomes)}amix=inputs={len(nomes)}:normalize=0[sfx]")
fl.append(f"[v1][mus][sfx]amix=inputs=3:normalize=0,atrim=0:{FIM},loudnorm=I=-14:TP=-1.5:LRA=11[saida]")
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", *ent, "-filter_complex", ";".join(fl), "-map", "[saida]", "-ar", "48000", os.path.dirname(os.path.abspath(__file__)) + "/mix.wav"], check=True)
print("ok", len(ev), "efeitos")
