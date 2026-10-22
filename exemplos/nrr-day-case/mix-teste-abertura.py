"""Áudio do teste da abertura (v3, ref. Neto Editor): voz do hook + riser até "que eu tive" + impacto; glitch só nas palavras de destaque
e no apagar da seleção; swoosh nos ícones e nas trocas de tela; clique do cursor."""
import subprocess, os
D = os.path.dirname(os.path.abspath(__file__)); A = D + "/audio"; SFX = os.path.expanduser("~/Developer/fanloop-video/public/sfx")
GLITCH = [0.21, 0.87, 1.55, 2.25, 3.33, 3.57, 5.26]          # aposentei, de vez, Figma, Photoshop, After, Effects, resultado
ev = [(A + "/riser-hook.wav", 0.23, 0.55), (SFX + "/impacto.mp3", 6.33, 0.5), (SFX + "/whoosh.mp3", 6.45, 0.35)]
for t in GLITCH: ev.append((SFX + "/glitch.mp3", t, 0.32))
ev.append((SFX + "/glitch.mp3", 4.12, 0.5))                                   # a seleção é apagada
for t in [1.55, 2.25, 3.33]: ev.append((SFX + "/whoosh2.mp3", t - 0.08, 0.22))   # cada ícone voa até o leque
for t in [1.18, 4.34]: ev.append((SFX + "/whoosh.mp3", t, 0.3))                 # a tela sai voando / a próxima entra
ev.append((SFX + "/clique.mp3", 3.64, 0.45)); ev.append((SFX + "/clique.mp3", 4.04, 0.35))   # clica e solta a seleção
ins = ["-i", A + "/abertura.wav"]
f = ["[0:a]aresample=48000,atrim=0:6.7,afade=t=out:st=6.55:d=0.15,apad=whole_dur=7.2,volume=1.25[v]"]
for i, (fn, t, vol) in enumerate(ev):
    ins += ["-i", fn]; cut = ",atrim=0:0.22,afade=t=out:st=0.14:d=0.08" if "glitch" in fn else ""
    f.append(f"[{i+1}:a]aresample=48000{cut},volume={vol},adelay={int(t*1000)}|{int(t*1000)}[s{i}]")
f.append("[v]" + "".join(f"[s{i}]" for i in range(len(ev))) + f"amix=inputs={len(ev)+1}:normalize=0,atrim=0:7.2,loudnorm=I=-14:TP=-1.5:LRA=11[o]")
subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", ";".join(f), "-map", "[o]", "-ar", "48000", A + "/teste-abertura.wav"], check=True)
print("ok", len(ev))
