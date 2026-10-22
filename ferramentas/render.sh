#!/bin/zsh
# Prévia e final. Sempre a prévia primeiro (15–20 s em meia resolução, com o áudio), e só depois do "sim" o 4K.
# Uso: ./render.sh previa projeto.ecproj Comp mix.wav saida.mp4 [inicio=0] [fim=20]
#      ./render.sh final  projeto.ecproj Comp mix.wav saida.mp4
# 4K: "--resolution 2" no comp de 1080 (o comp colapsado de 2160 ignora a câmera 3D de dentro).
# Ritmo medido: 4K/60 fps em CPU, ~1 h para 12 s quando o Mac está sem memória. Feche apps pesados antes.
EC=~/Developer/artcraft/bin/effectcraft-cli-0.14.0-macos-universal/effectcraft-cli
MODO=$1; P=$2; C=$3; A=$4; OUT=$5; I=${6:-0}; F=${7:-20}
T=$(mktemp -d)/mudo.mp4
if [ "$MODO" = previa ]; then
  $EC render "$P" --comp "$C" --out $T --format h264 --start $I --end $F --resolution half --audio off
  ffmpeg -y -loglevel error -ss $I -i "$A" -i $T -t $((F-I)) -map 1:v -map 0:a -c:v copy -c:a aac -b:a 192k -shortest "$OUT"
else
  $EC render "$P" --comp "$C" --out $T --format h264 --resolution 2 --bitrate 60000 --audio off
  ffmpeg -y -loglevel error -i $T -i "$A" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -shortest "$OUT"
fi
ls -la "$OUT"
