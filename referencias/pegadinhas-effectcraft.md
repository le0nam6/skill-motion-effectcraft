# EffectCraft: o que quebra e o contorno

CLI do Mac: `~/Developer/artcraft/bin/effectcraft-cli-0.14.0-macos-universal/effectcraft-cli`
(release em github.com/storytold/effectcraft, asset `effectcraft-cli-*-macos-universal.zip`; o .app não traz a CLI).
Desde 21/10/2026 é a 0.14.0 (quadros do reveal de um colega idênticos aos da 0.9.2). O que mudou e serve:
`render --progress` (progresso no stderr), render que falha dentro de `run`/`exec` sai com 1, export com menos
memória de GPU (ajuda no 137 do 4K), MP4 do Kling com duração em ms entra na taxa certa, fontes variáveis
(SF Pro) com as instâncias como estilos, script de câmera do Google Earth Studio cria as chaves, `saveFrameToPng`
e o efeito Object Matte. Opção desconhecida ou `--control` inválido agora impedem o app de abrir.

| Problema | Contorno |
|---|---|
| `#include` não acha o arquivo | rodar com caminho absoluto: `script "$PWD/x.jsx" --empty` |
| script não lê arquivo fora da pasta dele | embutir SVG num `.jsx` gerado (`var X_SVG = "…"`) |
| SVG colado em pt (×4/3) | depende do SVG: o da logo veio em pt, o do mapa veio em px. Conferir com um quadro antes |
| nulo nasce com âncora (50,50) | `tr(nulo,"anc").setValue([0,0])`, senão os filhos ficam 50 px fora |
| nulo não passa opacidade aos filhos | animar a opacidade de cada camada visível |
| câmera "parada" com duas chaves iguais passeia | a curva espacial automática faz barriga: usar **expressão por partes** |
| chave de posição depois das chaves de mola faz o objeto escapar | sair com escala e opacidade |
| máscara de trilha não casa com camadas 3D | clipe e máscara em 2D, registrados na cena para apagarem juntos |
| comp 4K colapsado (2160, 200%) ignora a câmera 3D de dentro | `render --resolution 2` direto no comp de 1080 |
| `render-frame --scale` não passa de 1 | idem: `render … --resolution 2` |
| camada nova vai para o comp do visor | `comp.openInViewer()` antes de `layer.newCamera` etc. |
| comando `layer.props` não existe | `effectcraft-cli props <proj> <comp> <camada>` |
| estrela de 3 pontas vira estrela de 6 | `star/points` = 3 |
| em laço do zsh, `for t in $LISTA` não separa | escrever a lista literal ou usar `ferramentas/folha.py` |
| no zsh, `rm partes/lock* && ./render…` com o glob vazio dá "no matches found" e **o render nem começa** (perdemos uma noite assim) | `setopt null_glob` antes, ou `rm -rf partes/lock*(N)`; e conferir em 1 min que o primeiro pedaço apareceu |
| **efeito (Glow, blur) numa camada ampliada pela escala da camada** (ícone de 24 px a 300%): no 4K o quadro pede dezenas de GB e o render morre com código 137 | ampliar **por dentro** (escala de cada grupo do desenho) e deixar a camada em 100%; achar o culpado com `effectcraft-cli bench --time T` em vários tempos (o custo salta onde a camada entra) e `/usr/bin/time -l` (peak memory footprint) |
| render 4K/60 lento (Mac de 16 GB) | é falta de memória (compressor alto, CPU parada); fechar apps; não paralelizar |

Efeitos úteis (nomes do AE funcionam em `addProperty`): `ADBE Gaussian Blur 2`, `ADBE Glo2`,
`CC Radial Fast Blur` (center, amount, zoom). Lista completa: `effectcraft-cli exec effect.list --params '{"filter":"blur"}' --empty`.

Comandos usados: `layer.newText`, `layer.newShape`, `layer.newNull`, `layer.newCamera` (twoNode),
`layer.newAdjustment`, `edit.pasteSvg`, `layer.addShapeItem` (stroke, trim), `prop.set`, `prop.moveGroup`
(trim acima de fill/stroke), `layer.addMask`, `layer.setTrackMatte`.

## Prender a um grupo animado compensa escala e giro (Diverno v2, 17/10/2026)
`layer.parent = pai` guarda a posição, a escala e o giro que a camada tem no mundo **no instante 0**. Se o pai tem expressão de escala ou giro (por exemplo, uma entrada que começa em 60% e girada −24°), o filho recebe a compensação contrária: 166% e +24°. O resultado foi borda e máscara da foto gigantes e tortas em relação à foto.
**Contorno:** depois de prender, zere: `filho(l, pai) { l.parent = pai; esc = [100,100]; rot = 0 }`, e só então defina posição e escala. Isso está em `diverno2.jsx`.
