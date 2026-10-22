#!/bin/zsh
# junta cabeçalho + medidas + ficha + cenas no nubank.jsx e roda no EffectCraft
cd ${0:a:h}
/usr/bin/python3 dims.py
cat cabeca.jsx dims.jsx ficha.jsx cenas.jsx > nubank.jsx
~/Developer/artcraft/bin/effectcraft-cli-0.14.0-macos-universal/effectcraft-cli script "$PWD/nubank.jsx" --empty > saida_script.txt 2>&1; tail -5 saida_script.txt
