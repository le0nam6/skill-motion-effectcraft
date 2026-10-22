#!/bin/zsh
# Uso: PASTA=~/Developer/artcraft/mateus PROJ=mateus.ecproj COMP=Mateus FIM=83 ./render_partes.sh > partes/log_a.txt
# 4K em pedaços (rode dois ao mesmo tempo: cada um pega um pedaço livre pela trava em partes/lockN) de 4 s (processo novo a cada pedaço: a memória não acumula; retoma de onde parou).
EC=~/Developer/artcraft/bin/effectcraft-cli-0.14.0-macos-universal/effectcraft-cli
cd "${PASTA:-$PWD}"
FIM=${FIM:?defina FIM em segundos}; PASSO=4; MEIO=$(python3 -c "print(0.5/60)")
python3 -c "
import math
n=math.ceil($FIM/$PASSO)
for i in range(n): print(i, i*$PASSO, min($FIM, (i+1)*$PASSO) - $MEIO)" | while read i a b; do
  f=partes/p$(printf %02d $i).mp4
  if ffprobe -v error "$f" >/dev/null 2>&1; then continue; fi
  mkdir partes/lock$i 2>/dev/null || continue   # outro trabalhador já pegou este pedaço
  rm -f "$f"; t0=$(date +%s)
  $EC render "${PROJ:?defina PROJ}" --comp "${COMP:?defina COMP}" --out "$PWD/$f" --format h264 --start $a --end $b --resolution 2 --bitrate 60000 --audio off >/dev/null 2>&1
  n=$(ffprobe -v error -count_frames -select_streams v -show_entries stream=nb_read_frames -of csv=p=0 "$f" 2>/dev/null)
  echo "$f [$a–$b] quadros=$n em $(( $(date +%s)-t0 ))s $(top -l 1 -n 0 | grep PhysMem)"
done
echo FIM
