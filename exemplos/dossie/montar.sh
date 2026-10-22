#!/bin/zsh
# junta cabeçalho + medidas + ficha + cenas no dossie.jsx e roda no EffectCraft
cd ${0:a:h}
/usr/bin/python3 dims.py
cat cabeca.jsx dims.jsx pal.jsx ficha.jsx cenas.jsx > dossie.jsx
~/Developer/artcraft/bin/effectcraft-cli-0.14.0-macos-universal/effectcraft-cli script "$PWD/dossie.jsx" --empty > saida_script.txt 2>&1; tail -5 saida_script.txt
