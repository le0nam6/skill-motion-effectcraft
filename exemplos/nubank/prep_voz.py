"""Prepara a narração: Whisper (tempos por palavra), encurta as pausas longas e corrige o início das palavras que caem em silêncio.
  prep_voz.py entrada.wav saida.wav palavras.json"""
import json, re, subprocess, sys, os
ent, sai, pal = sys.argv[1:4]
os.environ["HF_HUB_OFFLINE"] = "1"
from faster_whisper import WhisperModel
m = WhisperModel("mobiuslabsgmbh/faster-whisper-large-v3-turbo", device="cpu", compute_type="int8")
s, _ = m.transcribe(ent, language="pt", word_timestamps=True)
ws = [[w.word.strip(), w.start, w.end] for seg in s for w in seg.words]
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", ent], capture_output=True, text=True).stdout)
out = subprocess.run(["ffmpeg", "-hide_banner", "-i", ent, "-af", "silencedetect=n=-40dB:d=0.2", "-f", "null", "-"], capture_output=True, text=True).stderr
sil = list(zip([float(x) for x in re.findall(r"silence_start: ([\d.]+)", out)], [float(x) for x in re.findall(r"silence_end: ([\d.]+)", out)]))
fim_gancho = next((b for w, a, b in ws if w.endswith(".")), 5.0)
cortes = []
for a, b in sil:
    if a <= 0.01: continue
    gap = 0.5 if a <= fim_gancho + 0.3 < b + 0.5 else 0.32
    if b - a > gap + 0.05:
        meio = (a + b) / 2; cortes.append((meio - (b - a - gap) / 2, meio + (b - a - gap) / 2))
def mapa(t):
    return t - sum(min(max(t - a, 0), b - a) for a, b in cortes)
partes, ultimo = [], 0
for a, b in cortes: partes.append((ultimo, a)); ultimo = b
partes.append((ultimo, dur))
f = [f"[0:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.01,afade=t=out:st={max(0, b - a - 0.012):.3f}:d=0.012[p{i}]" for i, (a, b) in enumerate(partes)]
f.append("".join(f"[p{i}]" for i in range(len(partes))) + f"concat=n={len(partes)}:v=0:a=1[o]")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", ent, "-filter_complex", ";".join(f), "-map", "[o]", sai], check=True)
def corrige(t):
    for a, b in sil:
        if a <= t < b: return b
    return t
novo = [[w, round(mapa(corrige(a)), 2), round(mapa(b), 2)] for w, a, b in ws]
json.dump(novo, open(pal, "w"), ensure_ascii=False)
print("duração", round(mapa(dur), 2))
print(" ".join(f"{w}@{a}" for w, a, b in novo))
