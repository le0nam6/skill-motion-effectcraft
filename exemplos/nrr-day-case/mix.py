"""Mixagem do case NRR Day v5: abertura nova (hook em fundo branco + ponte) e o resto do v4 deslocado de DESL = XC − 8,27.
Voz: audio/abertura.wav (hook + ponte, Gemini TTS Charon) até XC; depois voz3.wav a partir de 8,27 s (com o respiro SH da vitrine).
Trilha (Lyria 3 Pro) entra no impacto do hook (6,33 s), emendada com o final dela; antes disso só o riser, a voz e os efeitos.
Efeitos da abertura: riser até "que eu tive", glitch só nas palavras de destaque e no apagar da seleção, swoosh nos ícones
e nas trocas de tela, clique do cursor. Os efeitos do v4 a partir de 8 s entram deslocados."""
import os, subprocess
D = os.path.dirname(os.path.abspath(__file__))
A = D + "/audio"
SFX = os.path.expanduser("~/Developer/fanloop-video/public/sfx")
BRILHO = os.path.expanduser("~/Downloads/KV Telles & Co/NRR Day/Top Performers/motion/sons/brilho.mp3")
FIM, SH, CORTE = 59.6, 9.4, 37.6
bordas = [3.91, 8.52, 11.93, 15.0, 18.57, 23.09, 28.71, 33.15, 37.4, 47.6, 50.45, 53.3]
ev = []
for t in bordas: ev.append((f"{SFX}/whoosh.mp3", t - 0.3, 0.5))
for t in [3.91, 5.04, 26.7, 38.34 + SH, 43.1 + SH]: ev.append((f"{SFX}/pop.mp3", t, 0.3))      # ícones grandes (ideias)
ev.append((f"{SFX}/impacto.mp3", 6.96, 0.42))                                                     # momento WOW
ev.append((f"{SFX}/clique.mp3", 27.08, 0.5))                                                      # o cursor clica
for t in [15.16, 16.98, 28.71, 30.82]: ev.append((f"{SFX}/impacto.mp3", t, 0.3))                             # ferramentas grandes
for t in [17.2, 30.95]: ev.append((f"{SFX}/whoosh.mp3", t - 0.1, 0.3))                                         # o ícone abre espaço
for t in [0.0, 8.52, 9.45, 10.36]: ev.append((f"{SFX}/obturador.mp3", t, 0.3))                                    # cartões
for q in range(8): ev.append((BRILHO, 0.31 + q * 0.2, 0.3 + 0.05 * q))                                            # abertura: as 8 estrelas da Nathália acendem
for i in range(0, 33, 2): ev.append((f"{SFX}/bip.mp3", 18.62 + i * 0.045, 0.05))                                # grade dos 33
for t in [18.57, 23.09, 38.64 + SH, 42.94 + SH]: ev.append((f"{SFX}/impacto.mp3", t, 0.38))                    # números e "aprovar"
ev.append((f"{SFX}/whoosh.mp3", 27.45, 0.3))                                                       # risco no cursor
# vitrine: entrada, troca de vídeo e os efeitos de cada reveal (tempo do vídeo -> tempo do case)
ev.append((f"{SFX}/obturador.mp3", 37.5, 0.4))
for t in [42.35, 45.15]: ev.append((f"{SFX}/whoosh.mp3", t, 0.45))
for ini, src0, est in [(37.5, 9.4, 7), (42.5, 11.8, 8), (45.3, 11.8, 3)]:
    if 12.56 >= src0: ev.append((f"{SFX}/impacto.mp3", ini + 12.56 - src0, 0.4))                       # corte seco para a foto real
    for q in range(est): ev.append((BRILHO, ini + 12.91 + q * 0.2 - src0, 0.3 + 0.05 * q))   # estrelas acendem
ev.append((f"{SFX}/riser.mp3", 53.3 - 4.0, 0.25))
for i in range(7): ev.append((f"{SFX}/pop.mp3", 53.65 + i * 0.09, 0.16))
ev.append((f"{SFX}/whoosh2.mp3", 57.3, 0.3)); ev.append((f"{SFX}/impacto.mp3", 57.55, 0.45))
XC, CANT = 12.05, 8.27
DESL = XC - CANT
FIM_F = FIM + DESL
ev = [(f, t + DESL, v) for (f, t, v) in ev if t >= 8.0]          # o v4 a partir do voo para "Slides, vídeos e dinâmica"
# abertura branca (mesmos tempos do teste aprovado)
ev.append((A + "/riser-hook.wav", 0.23, 0.55)); ev.append((f"{SFX}/impacto.mp3", 6.33, 0.5)); ev.append((f"{SFX}/whoosh.mp3", 6.45, 0.35))
for t in [0.21, 0.87, 1.55, 2.25, 3.33, 3.57, 5.26]: ev.append((f"{SFX}/glitch.mp3", t, 0.32))
ev.append((f"{SFX}/glitch.mp3", 4.12, 0.5))
for t in [1.55, 2.25, 3.33]: ev.append((f"{SFX}/whoosh2.mp3", t - 0.08, 0.22))
for t in [1.18, 4.34]: ev.append((f"{SFX}/whoosh.mp3", t, 0.3))
ev.append((f"{SFX}/clique.mp3", 3.64, 0.45)); ev.append((f"{SFX}/clique.mp3", 4.04, 0.35))
# ponte na cena escura: os dois ícones e o WOW
for t in [8.30, 9.28]: ev.append((f"{SFX}/pop.mp3", t, 0.3))
ev.append((f"{SFX}/impacto.mp3", 10.98, 0.42))
L1 = round(FIM_F - 6.33 - 8.3 + 0.6, 2)                           # quanto da trilha vai antes da emenda com o final
ent = ["-i", f"{A}/abertura.wav", "-i", f"{A}/voz3.wav", "-i", f"{A}/voz3.wav", "-i", f"{A}/trilha.mp3", "-i", f"{A}/trilha.mp3"]
for f, _, _ in ev: ent += ["-i", f]
fl = [f"[0:a]aresample=48000,atrim=0:{XC - 0.15},afade=t=out:st={XC - 0.3}:d=0.15[v0]",
      f"[1:a]aresample=48000,atrim={CANT}:{CORTE},asetpts=PTS-STARTPTS,adelay={int(XC*1000)}|{int(XC*1000)}[va]",
      f"[2:a]aresample=48000,atrim={CORTE},asetpts=PTS-STARTPTS,adelay={int((CORTE+SH+DESL)*1000)}|{int((CORTE+SH+DESL)*1000)}[vb]",
      f"[v0][va][vb]amix=inputs=3:normalize=0,apad=whole_dur={FIM_F},volume=1.25[voz]", "[voz]asplit=2[v1][chave]",
      f"[3:a]aresample=48000,atrim=0:{L1},asetpts=PTS-STARTPTS[ma]",
      "[4:a]aresample=48000,atrim=72.0:80.3,asetpts=PTS-STARTPTS[mb]",
      f"[ma][mb]acrossfade=d=0.6:c1=tri:c2=tri,volume=0.5,afade=t=in:d=0.05,adelay=6330|6330,apad=whole_dur={FIM_F},atrim=0:{FIM_F},afade=t=out:st={FIM_F-1.2}:d=1.2[m0]",
      "[m0][chave]sidechaincompress=threshold=0.035:ratio=7:attack=12:release=300[mus]"]
nomes = []
for i, (f, t, vol) in enumerate(ev):
    cut = ",atrim=0:0.22,afade=t=out:st=0.14:d=0.08" if f.endswith("glitch.mp3") else ""
    fl.append(f"[{i+5}:a]aresample=48000{cut},volume={vol},adelay={int(max(0,t)*1000)}|{int(max(0,t)*1000)}[s{i}]"); nomes.append(f"[s{i}]")
fl.append(f"{''.join(nomes)}amix=inputs={len(nomes)}:normalize=0[sfx]")
fl.append(f"[v1][mus][sfx]amix=inputs=3:normalize=0,atrim=0:{FIM_F},loudnorm=I=-14:TP=-1.5:LRA=11[saida]")
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", *ent, "-filter_complex", ";".join(fl), "-map", "[saida]", "-ar", "48000", A + "/mix.wav"], check=True)
print("ok", len(ev), "efeitos", round(FIM_F, 2), "s")
