#!/bin/zsh
# Manda um vídeo como documento (sem compressão) para um WhatsApp pela Evolution da VPS.
# Uso: ./enviar_whatsapp.sh arquivo.mp4 55DDDNUMERO "legenda"
# A chave da Evolution é lida dentro da VPS (docker exec) e nunca passa por esta máquina.
F="$1"; NUM="$2"; CAP="${3:-}"; N=$(basename "$F")
alias ssh="ssh -i $HOME/.ssh/sua_chave_ssh"; alias scp="scp -i $HOME/.ssh/sua_chave_ssh"   # a chave padrão deixou de ser aceita em 20/10
ssh root@SEU_IP_DA_VPS 'mkdir -p /tmp/envio' && scp -q "$F" root@SEU_IP_DA_VPS:/tmp/envio/"$N" || exit 1
ssh root@SEU_IP_DA_VPS "cd /tmp/envio && (timeout 900 python3 -m http.server 8099 --bind 172.18.0.1 >/tmp/envio/http.log 2>&1 &) ; sleep 1; K=\$(docker exec evolution printenv AUTHENTICATION_API_KEY); curl -s -m 880 -X POST -H \"apikey: \$K\" -H 'Content-Type: application/json' http://127.0.0.1:8080/message/sendMedia/leonam -d '{\"number\":\"$NUM\",\"mediatype\":\"document\",\"mimetype\":\"video/mp4\",\"fileName\":\"$N\",\"caption\":\"$CAP\",\"media\":\"http://172.18.0.1:8099/$N\"}' | head -c 160; echo; rm -rf /tmp/envio"
