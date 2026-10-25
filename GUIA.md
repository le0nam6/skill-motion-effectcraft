# Guia de motion design: o que aprendemos fazendo

Este guia junta as orientações do Leonam e o que aprendi errando em três motions feitos no EffectCraft
em outubro de 2026: o convite do YouTube, a vinheta da logo e o **Marketing da Ilha #01, sobre o Guaraná Jesus**.
Cada regra vem com o motivo, porque quase todas nasceram de uma versão reprovada.

---

## 0. Roteiro: ele aprova antes de produzir

- **Mostrar as falas antes de gerar voz.** No #02 o roteiro passou por quatro versões até ele aprovar, e foi ele quem escreveu a final.
- **Gancho com o case nos 3 primeiros segundos.** Abrir com Amazon ou com uma cena genérica foi recusado: "esses 3 primeiros segundos estão ruins demais. Precisa chamar logo a atenção falando do case".
- **Pegada de curiosidade:** pergunta ou fato estranho na abertura, mecanismo no meio, a origem como virada no fim.
- **Explicar o que o espectador não conhece** (no #02: o que é o app Mateus Mais).
- **Variar o CTA entre episódios.** YouTube em todo vídeo "parece que eu quero empurrar o meu canal a todo custo". Alterne: comenta + segue, a palavra de um vídeo longo e IA → comunidade.
- Passar o texto pela skill **humanizer**: sem travessão, sem frases curtas empilhadas, no máximo um "não é X, é Y", e nada de fórmula repetida de um episódio para o outro (o "Isso tem nome:" do #01 não volta no #02).
- Mais falas = vídeo mais longo: o #02 aprovado deu 73 s de voz (83 s com a ficha). Avisar antes de produzir.
- **Retenção, para ele, é o tempo médio de visualização do PERFIL** (case NRR Day, 17/10/2026): o quadro 1 já cheio e
  dizendo alguma coisa ("abrir com o slide principal não diz muita coisa"), nenhum trecho morto, vitrine enxuta e fim curto
  (ficha de 4 s e logo de 2 s; a ficha longa derruba a média).
- **Gancho tem de ser provocativo, verdadeiro e conversar com quem assiste.** Ele recusou o que já usou no perfil ("nenhum
  frame editado à mão"), o telegráfico ("1.241 comandos. Zero cliques meus"), o que não conecta ("não abri o Google Slides")
  e o esquisito ("demiti o PowerPoint": a V4 nem usa e ferramenta não se demite). O formato que ele gostou: "Eu aposentei X".
  **O gancho final foi dele** ("Eu aposentei de vez o Figma, Photoshop e o After Effects e esse foi o resultado que eu tive").
  Lição: propor poucos (3 a 4), dizer o porquê de cada um e deixar ele reescrever. Pesquisar biblioteca de ganchos rendeu
  pouco (não há acervo público de infoprodutor BR com dado de tempo médio; os repositórios pt-BR de copy são pequenos).
- **Gancho que substitui a frase de abertura precisa de uma ponte curta** para emendar no roteiro aprovado
  (no case: "Um evento interno precisa de identidade, apresentação e um momento WOW").

## 1. Antes de animar: a referência manda

O erro que mais custou caro foi animar "de cabeça" em vez de copiar a gramática da referência.

**Como estudar uma referência:**
- Extrair quadros a 4 fps para ver a estrutura e a 15 fps nas transições (`ffmpeg -vf fps=15,tile=…`).
- Responder por escrito, antes de codar:
  - Como uma palavra entra? (no Guaraná: desfoca e assenta, uma por vez)
  - Como a linha se comporta? (fica centralizada e se recentraliza a cada palavra)
  - Como o destaque aparece? (cor e brilho; caixa só uma vez no vídeo inteiro, e sempre maior que o texto)
  - Como a cena sai? (a tela inteira borra, cresce um pouco e apaga em ~4 quadros)
  - A câmera se move durante a cena? (não: a cena fica quase parada)
  - Onde entra o 3D? (em objetos: cartões, mapa, logo; não numa câmera que passeia o tempo todo)
- Montar uma folha de contato e olhar de verdade.

> "Você é ruim demais de observar referência né? Observe com um pouco mais de cautela."

## 2. Movimento: mola, easing e tempo

| O quê | Valor aprovado | Por quê |
|---|---|---|
| Texto entrando | mola amortecida ζ≈0,7, ω≈14,5; sobe ~34 px; desfoque 14→0 em 0,28 s; opacidade 0→100 em 0,22 s | passa ~5% e assenta: tem vida sem parecer gelatina |
| Ícone entrando | escala de 55% para 100% com ζ≈0,5; giro de ~9° que assenta | "pop" com sobra elástica: chama o olho para o ícone |
| Saída de texto | 0,26 s; desfoca 0→26; sobe 36 px; acelera (ease-in) | saída mais curta que a entrada e acelerando, como na referência |
| Escalonamento | 20–100 ms entre palavras e itens; total menor que 0,5 s | o olho lê como um gesto só |
| Entrada "premium" | 350–600 ms, cubic-bezier(0,4, 0, 0,2, 1) | pesquisa de skills de motion no GitHub (Lottie, Remotion) |
| Saída | 30–50% mais curta que a entrada | entrada desacelera, saída acelera |

- **Mola de verdade** é uma chave por quadro, calculada pela equação do oscilador amortecido (`mola()` em `lib/base.jsx`).
  Easing de dois keyframes não tem a sobra que ele pediu ("animações muito duras, adiciona bounce e ease in-out").
- **Nunca linear** em posição ou escala.
- **Peça séria/cinematográfica (vinheta de premiação, abertura estilo F1): sem mola.** No reveal do NRR Day (17/10/2026)
  ele reprovou mola com sobra, "pop" de estrela girando, medalha em pêndulo, glitch tremendo e bip/pop: "não tá com cara
  de animação séria, não tem a fluidez necessária... tá muito fun". O que serve: **ease-out exponencial longo**
  (`1-2^(-10p)`, 1,0–1,6 s), deslocamento curto (40–110 px), opacidade e desfoque saindo juntos, inclinação que se desfaz
  devagar (medalha 9°→0 em 2 s), câmera que só se aproxima. A mola ζ0,7 continua valendo para explainer e reels.

## 3. Câmera 3D: só na transição

**Reprovado:** a câmera voando e derivando durante as cenas.
> "Esse efeito de câmera 3D era pra funcionar só quando tivesse fazendo transição e nesse momento precisa ter um efeito de borrão de velocidade. Quando for fazer a transição, o conteúdo atual da tela precisa ir diminuindo a opacidade."

**Aprovado:**
- Cada cena é um nulo 3D num ponto do espaço (z de −3200 em −3200).
- A câmera fica **exatamente parada** em cada cena e voa só entre (borda − 0,25 s) e (borda + 0,35 s), com ease in-out quíntico.
- **Borrão de velocidade:** uma camada de ajuste com zoom radial (CC Radial Fast Blur) que vai de 0 a 72 no meio do voo.
- **A cena que sai apaga:** opacidade × (1 − p²) em 0,3 s a partir do início do voo.
- A troca acontece no início da primeira palavra da cena seguinte. Se a última palavra da cena anterior
  for dita em cima da troca, ela entra um pouco antes da fala (tudo bem o texto adiantar ~0,2 s).

## 4. Texto e destaque

- **Linha centralizada que se recentraliza** a cada palavra nova (a linha anda junto, com ease-out de 0,38 s).
- **Destaque = cor + brilho** (Glow com limiar 18, raio ~0,4× o tamanho). **Nada de caixa atrás da palavra.**
  > "Tem vários grifos atrás do texto cortando as palavras e deixando ela esquisita de ler."
- **Risco** (tachado em "campanha genérica"): na altura do meio das letras minúsculas (baseline − 0,26 do tamanho),
  cobrindo as palavras inteiras com o espaço entre elas, e preso à mesma expressão de recentralização da linha.
  > "O grifo aqui tá errado também."
- **Colchetes** nos cantos de um termo-chave ("[ativo distintivo]"), como na referência.
- **Número com a frase literal.** "fez **99** anos." (o 99 conta de 10 a 99 enquanto a voz diz "noventa e nove").
  > "Quando fala dos anos, só o número aparecendo não traz a literalidade que precisa ter."
- **Tipografia:** SF Pro Display, tracking −25, Semibold no corpo e Bold no destaque.
- **Entrelinha apertada:** a distância entre linhas de um bloco é cerca de 1,18 × o tamanho da fonte (média das duas linhas). Com mais que isso ele reclamou: "o espaçamento entre linha tá muito alto".

## 5. Ícones

**O estilo é o da referência: ícone de traço fino que se desenha** (Trim Path no traço, ease-out em ~0,55 s), na cor de destaque com brilho. Usamos os Tabler Icons (outline, MIT), cada `<path>` vira um grupo com traço e um Trim na raiz desenha todos juntos (`iconeFlat` em `exemplos/grupo-mateus/corpo.jsx`). Em diagrama, o mesmo traço vai escuro sobre um disco cheio.
- Ele pediu LottieFiles, e eu testei. Os gratuitos misturam estilos (sino com carinha, megafone 3D, servidor isométrico), metade não importa no EffectCraft, e o que importou ficou fora da referência. Os ícones de traço que se desenham são o que a referência tem, e dá para exportar o resultado como Lottie (`file.exportLottie`).
- Se for usar Lottie: `file.importLottie` troca o comp ativo (chame `comp.openInViewer()` depois), defina `startTime` **antes** de criar chaves (mudar depois empurra as chaves) e repita a animação com Time Remap (`(time - t) % duração`).

- **Ícone de IDEIA é palavra da frase:** mesma linha, ~1,1× o tamanho do texto, entra com a palavra que ilustra.
  Ícone solto pela tela foi reprovado no convite ("ícones meio deslocados"), e o confete solto saiu do Guaraná.
- **Ícone de FERRAMENTA ou marca citada NÃO vai no meio da frase** (case NRR Day, 17/10): "tem que aparecer grande na tela"
  e a fala vira **legenda de uma linha embaixo**. O ícone grande é o protagonista e tem vida própria (o do Claude gira, o do
  Kling se desenha pelo traço, o do EffectCraft vira em 3D, o do Slides abre as folhas em leque) e "parear" liga dois ícones
  por uma linha com um pulso (`iconeGrande` e `parear` em `exemplos/nrr-day-case/case.jsx`).
- **Ícone de app animado por IA:** desenhar o ícone como imagem de partida e animar no Kling 2.5 (720p, 140 créditos) com
  fundo branco; aplicar em multiply sobre fundo claro e o branco some. Ficar com o trecho limpo (o Kling trocou as formas do
  Figma por espirais no começo) e acelerar 2× para caber no tempo do nome. Em leque sobre o texto: ~1/3 da largura ("muito
  gritante" com metade).
- Phosphor (fill), num círculo da cor de destaque com o símbolo escuro.
- Logo de terceiro (Coca-Cola, Grupo Mateus): **branca e grande**, e **sempre a logo** quando a narração cita a marca, não o nome escrito. Na cor original, sobre fundo escuro, "tá ruim".

## 6. Prova visual: foto, mapa e vídeo de IA

**Foto real em moldura de glossário** (referência: o glossário dos vídeos de 24 h do PrimoCast):
uma janela com cabeçalho na cor de destaque e três bolinhas brancas, borda preta grossa, cantos retos
e uma cópia branca deslocada atrás; legenda numa segunda janela igual; crédito pequeno embaixo.
- Procurar a foto **do lugar de verdade**. A Farmácia Sanitária (1959, Arquivo Central do Iphan) estava
  num post do São Luís Memória no Facebook. O Firecrawl não lê o Facebook, mas o navegador do app lê.
- A janela sai como bloco: encolhe para 88% e apaga. Sem chave de posição (ver as pegadinhas).

**Mapa de satélite** (referência: reels do @fatoscomfativa):
- Satélite escuro (NASA Blue Marble, domínio público) e linhas finas dos estados (malha do IBGE) no mesmo sistema de coordenadas.
- A aproximação vai em paradas: **continente → o Brasil inteiro, que segura → mergulho no estado**.
  > "Não dá nem pra ver o resto do Brasil." (a primeira versão mergulhava direto)
- O estado acende com preenchimento translúcido, contorno com brilho e glitch com separação ciano/rosa.
- A borda da imagem dissolve sobre um fundo opaco; texto por cima com uma vinheta leve.
- Tudo pronto em `ferramentas/gera_mapa.py <pasta> <código IBGE da UF>`.

**Diagrama que precisa parecer real: gere a ilustração, não desenhe com retângulos.**
- A planta do supermercado feita com retângulos (gôndolas cinzas e um "CAIXA" escrito) foi recusada: "não parece nada com uma planta de um mercado".
- A aprovada veio do **Gemini 3 Pro Image** (mesma chave do Gemini; ~US$ 0,13): planta vista de cima, modo escuro, hortifrúti, frios com luz azul, padaria, gôndolas com produtos, caixas com esteira e porta automática, com **"no text, no letters, no logos, no people"** no prompt.
- A animação vai por cima: uma função `U(u, v)` converte o pixel da imagem em ponto da tela, e o cliente anda por pontos da imagem (porta → hortifrúti → fundo → corredor do meio). O corredor acende com um retângulo translúcido na cor de destaque.

**Pessoa citada = foto dela.** "Onde tiver falando de pessoas, tem que aparecer as fotos… no vídeo do Mateus você nem colocou a foto do fundador. Precisa usar mais desses artefatos." Fundador, parceiro, chef, nutricionista: foto real na moldura de glossário, com nome e crédito. Onde achar: matérias (Sebrae, O Imparcial), site da pessoa e posts públicos do Instagram. O navegador do app lê a página e o `og:image` do post traz a foto em 640 px; as fotos de perfil vêm em 100 px e só servem como selo.

**Marca e app do case:** quando a narração cita a marca, entra a **logo** dela em branco (vetor do Grupo Mateus tirado da página de case da Pricefy, com o fill trocado para branco). Quando cita um app, entra o **ícone oficial** (o do Mateus Mais veio do Google Play, 512 px). O ícone do app também vai dentro da notificação do celular.

**Vídeo de IA de fundo:** o Veo 3.1 pode vir com faixas pretas em cima e embaixo. Confira numa folha de quadros e amplie ~22% para cortar.

**Vídeo de IA que interage com o texto** (pedido dele: o guaraná rosa sobe e o texto some):
- Clipe do Veo 3.1 (fundo preto, o líquido sobe e enche o quadro, câmera fixa).
- Medir a superfície quadro a quadro (`ferramentas/medir_superficie.py`). A camada desce ou estica para
  a superfície seguir uma curva S(t), e uma **máscara de trilha 2D** corta tudo acima da superfície.
  O texto só some quando o líquido passa por ele.
- O som do próprio clipe (borbulhas) entra na mixagem.

## 7. Som

- Whoosh em cada troca de cena (0,3 s antes da borda), pop nos ícones, impacto nos destaques, bips nos cartões em sequência.
- Glitch: **cortado em 0,45 s com fade**. O arquivo inteiro tem 2,6 s e a cauda fica alta ("muito alto depois de um tempo").
- Trilha a 0,5 com ducking pela voz (sidechain); final em loudnorm −14 LUFS.

## 8. Processo de entrega

1. Folha de quadros dos momentos críticos e conserto antes de gerar vídeo.
2. **Abrir o projeto no EffectCraft para a pessoa ver o preview no app.** Feche o app antes (`pkill -TERM -f "EffectCraft.app/Contents/MacOS/EffectCraft"`) e reabra com `open -a /Applications/EffectCraft.app projeto.ecproj`, senão ele mostra a versão antiga. Nada de prévia em mp4 no chat.
3. Aplicar o retorno rápido, montar de novo e reabrir no app.
4. O render final a pessoa faz no app. Só se ela pedir: final em 4K/60 (`--resolution 2`), avisando que demora e fechando apps pesados.
   - **Render em pedaços de 4 s** (`ferramentas/render_partes.sh`), cada um num processo novo. O render de 55 s numa tacada só morreu depois de 4h21 (memória), sem fechar o arquivo. Pedaços emendados com o concat do ffmpeg, sem recomprimir.
   - **Um render por vez num Mac de 16 GB.** Dois em paralelo funcionaram enquanto sobrava memória, depois entraram em troca e ficaram mais lentos que um só.
   - Ritmo medido: 13 a 27 min por pedaço de 4 s, ou seja, ~4 a 6 min por segundo de vídeo.
5. **Entregar no WhatsApp dele** como documento, sem compressão (`ferramentas/enviar_whatsapp.sh`): o arquivo vai para a VPS, a Evolution busca por um http temporário na rede do Docker e manda pela instância `leonam`. A chave fica na VPS e nunca sai de lá.
6. **A API do Instagram não aceita 4K** (máximo de 1920 px de largura). O 4K ele posta pelo app, com "Enviar em alta qualidade". A automação de comentário do Fanloop vale para posts feitos por fora.
7. Junto do vídeo: legenda do post e ficha técnica. Na legenda, abrir com a cena (o celular vibrando), não com a pergunta do vídeo, e repetir a pergunta do fim para puxar comentário.

## 9. Ficha técnica

Ele quer mostrar que domina as ferramentas de IA. Por isso o vídeo termina com a ficha técnica:
ferramentas, tokens, custo e tempo. E os números precisam de **comparação que um leigo entenda**:
- Tokens escritos → palavras → páginas de livro.
- **O que mais importa para ele: o % de sessão.** No Max 5x o vídeo gastou 38% de uma sessão de 5 h,
  o que dá ~190% de uma sessão do plano Pro: "comeria quase 2 sessões".
- Custo de API em reais, dizendo onde foi o dinheiro.
- Os dois episódios até aqui:

| | #01 Guaraná | #02 Mateus |
|---|---|---|
| Tokens lidos / escritos | 81 mi / 162 mil | 67 mi / 111 mil |
| Sessão de 5 h no Max 5x | 38 pontos (~190% de uma do Pro) | 9 pontos (~45% de uma do Pro) |
| APIs do Google | ~R$ 23 | ~R$ 17 |
| Tempo até a última prévia | 1h40 | 1h25 |

Ver `referencias/ficha-tecnica.md`.

---

## Diverno v2 e v3 (17 e 18/10/2026): o motor atual dos cases e bastidores

O Diverno foi refeito no motor da abertura do NRR Day (referência Neto Editor) e é **o modelo a copiar** para case e bastidor no Instagram (`exemplos/diverno/diverno2.jsx`). O que ele pediu e como ficou:

- **Alternar tema claro e escuro a cada tela, nas cores da marca** ("sinto falta de mudar o tema do background para um tema claro e um tema escuro"). No Diverno: creme com grade clara e vinho, vinho escuro com grade e dourado. Cada tema tem fundo, grade, luz que anda devagar, tinta, cinza (para a palavra que ainda vai escurecer), cor da marca, borda do cartão, sombra e etiqueta (objeto `TEMA`).
- **Cada tela:** o fundo novo sobe por baixo cobrindo o anterior (ease-out expo 0,42 s); o conteúdo antigo sai voando para cima (0,2 s, aceleração quadrática); zoom lento contínuo com teto de 8%; a tela do gancho já começa cheia e encolhe de 118% (quadro 1 nunca vazio).
- **Palavra comum entra cinza e escurece; destaque pisca** (glitch simples, 0,3 s) na cor da marca, com som de glitch só nele.
- **Fotos:** "as imagens estão todas cagadas". Use foto em alta do Instagram da marca (sem print com botão de play), em **cartão arredondado** com borda, sombra e máscara, **recortada no foco** (`foco: [x, y]`) e entrando em voo com giro que assenta (`cartao()`). O Gelato Matilda continuou "bugado" até zerar a escala e o giro ao prender ao grupo (`filho()`, ver as pegadinhas).
- **Pessoa e parceiro citados:** foto + etiqueta com nome e papel (`etiqueta()`).
- **Resultado de uma ideia em ícones:** "o resultado disso é mais seguidores, mais vendas e mais alcance" virou três ícones em disco da marca com uma seta que sobe em ciclo (`iconeSobe()`).
- **Confira o fato atual da marca antes de produzir.** A parceria com o chef era antiga ("irrelevante"); o que estava acontecendo era a campanha dos 10 anos. Faltava a La Mia Dolce Vita.
- **Gancho que enaltece a marca e para o scroll** quando a marca segue o perfil e vai ser marcada: "Se eu tivesse uma gelateria, eu copiaria tudo que a Diverno faz."
- **Não renderize.** Deixe o projeto salvo com o áudio e a fila de render prontos e abra o EffectCraft para ele renderizar.
- Fim: ficha técnica curta (painel branco, ícones em disco) e a vinheta da logo dele escrita à mão (`vinhetaLogo`).

## Linha do tempo das reprovações (para não repetir)

| Versão | O que ele disse | O que mudou |
|---|---|---|
| Convite v2 | fonte ruim; animação dura; ícone deslocado | SF Pro, mola de verdade, ícone dentro da frase, prévia curta |
| Guaraná prévia 1 | câmera 3D horrível; grifo cortando palavras; 99 sem literalidade; "observe a referência" | câmera só na troca, com borrão, e a cena apagando; destaque por cor e brilho; frase literal |
| Guaraná prévia 2 | risco errado; faltava a foto da farmácia; mapa do Brasil; líquido rosa em "a sua cor" | risco no meio das letras; foto de 1959; mapa; Veo com máscara |
| Guaraná prévia 3 | "não dá nem pra ver o resto do Brasil"; Coca-Cola vermelha e pequena | mapa de satélite em paradas; logo branca e grande |
| Guaraná prévia 4 | glitch alto depois de um tempo; "tá muito foda" | glitch cortado; 4K |
| Mateus (roteiro) | CTA sempre no YouTube parece empurrar o canal; explicar o app; humanizer; pegada de curiosidade; gancho fala do case nos 3 primeiros segundos | CTA varia por episódio (comenta + segue); roteiro aprovado por ele antes de produzir |
| Mateus (motion) | mapa de satélite repetiria o #01; ícones devem seguir a referência; logo do Mateus ao citar a marca; entrelinha alta | sem mapa; ícones de traço que se desenham; logo branca; entrelinha 1,18× |
| Case NRR Day v2 (17/10) | ícone de ferramenta no meio da frase; mostrar o resultado de verdade; ícones grandes parados; "momento de palco" | ícone grande com legenda de uma linha; vitrine flat dos reveals com a linha do tempo da geração; cada ícone com gesto próprio; "momento WOW" |
| Case NRR Day abertura (17/10) | quadro 1 sem informação; gancho fraco (4 + 6 propostas recusadas); glitch RGB; glitch em todas as palavras; texto colado na borda; entrelinha grande; ícone gritante; "começo tá bem parado" | gancho dele; fundo branco com grade; glitch só piscar e só nos destaques, com som; margem 110 px; entrelinha 0,98; ícone a 1/3; referência Neto Editor (zoom contínuo, tela que sai voando, ícones em leque, cursor e seleção do Figma) |
| Diverno v2/v3 (17–18/10) | imagens "cagadas"; faltava alternar tema claro e escuro; gancho fraco; Matilda bugado; faltou a La Mia Dolce Vita; chef irrelevante; mostrar o resultado do co-branding | motor Neto Editor com temas da marca, fotos em alta em cartão com foco, `filho()` zerando escala e giro, fatos atuais, três ícones de resultado subindo |
| NRR Day reveal (17/10) | coração pulsando na imagem; giro da logo; asa que não parecia F1; giro da pessoa parado; "tá muito fun" | coração só no som (Mixkit); câmera só se aproxima até a linha do 4; asa e traseira geradas no Nano Banana Pro com a asa passando na frente como na abertura da F1; giro cortado e com rampa de tempo; ease-out expo em tudo, sem mola |

## Abertura com texto grande e glitch (case NRR Day, 17/10/2026)
- **Glitch "simples" é só piscar:** a palavra some e aparece rápido (~0,3 s) e fica. Ele recusou RGB e tremor.
- **Glitch e som de glitch só nas palavras de destaque.** As outras palavras entram com fade curto.
- **Texto grande respeita a margem:** 110 px de cada lado em 1080. "Tu preencheu com força."
- **Entrelinha justa:** empilhe as linhas pelo tamanho real depois do encaixe, ~0,98 do tamanho da fonte entre os centros. Posições fixas deixaram buraco.
- **Ícone de ferramenta sobre o texto:** ~1/3 da largura. Metade da largura foi "muito gritante".
- **Vídeo de IA com fundo branco:** use modo multiply sobre a grade e o branco some.

## Referência Neto Editor (@onetoeditor no TikTok, dono da Edit Class), 17/10/2026
Ele pediu essa referência porque achou a abertura "bem parada". Estudei os vídeos de antes e depois dele, recortando só o lado "DEPOIS" em 15 qps. O que dá a fluidez:
- **Nada fica parado.** Cada tela tem um zoom lento e contínuo (~3%/s). O quadro 1 abre com o elemento grande encolhendo, com borrão de movimento.
- **Troca de tela:** o bloco sai voando para cima em ~0,2 s (aceleração quadrática, com borrão) enquanto o próximo entra por baixo com ease-out exponencial em ~0,45 s.
- **Ícones de app** voam de baixo à esquerda girando e assentam em leque, sobrepostos.
- **Palavra comum** entra cinza e escurece. O destaque pisca ou muda de cor.
- **Elementos de interface:** cursor, caixa de seleção do Figma (borda azul #0D99FF e alças brancas) e seta desenhada à mão.
- **Fundo:** luz colorida suave que anda atrás do texto.
- **Som:** swoosh em cada entrada e clique no cursor.
Código: `~/Downloads/NRR Day - Case/teste-abertura.jsx` (tela, palavra, cursor e seleção).

## Lições do Reel do Nubank (20/10/2026)

- **Gancho entra palavra por palavra, no tempo da voz.** Ele reclamou quando a frase inteira apareceu já no quadro 1. O quadro 1 fica cheio pela foto e pela primeira palavra, não pela frase toda.
- **A linha se recentraliza a cada palavra nova.** O motor do Diverno centralizava pela frase inteira e a primeira palavra nascia colada na esquerda. Agora `linhas` põe um nulo por linha que anda conforme as palavras entram (`exemplos/nubank/cabeca.jsx`).
- **Variar as animações ao longo do vídeo.** "Dá uma variada pra não ficar enjoativo." Cada tela escolhe como as palavras entram (`MODO`: sobe, escala com mola, lado, desfoque) e como o grupo entra e sai (`grupo(..., { entra: "lado"|"zoom", sai: "lado"|"zoom" })`), e o fundo pode cobrir vindo da direita (`fundo(tema, a, b, true)`). Não repita o mesmo par em telas seguidas.
- **Serifada itálica nas palavras-chave.** Playfair Display Bold Italic (Fontsource, instalada em ~/Library/Fonts) com `{ pf: true }` na palavra; mede com a mesma fonte e sai 12% maior pra casar a altura com a SF Pro.
- **Metáfora visual tem de ser a coisa.** "Isso não parece um iceberg": uma linha d'água com a palavra embaixo não basta. Gerar a ilustração (Gemini Image) e fazer a câmera começar na ponta e recuar até a massa submersa no tempo da palavra.
- **Espaço entre foto e texto.** No gancho, foto, pílula e texto ficam juntos (uns 30 px), sem buraco no meio.
- **Sem prévia, em qualquer vídeo.** Vale para todo motion: depois de conferir os quadros, abrir o projeto no app (`open -a /Applications/EffectCraft.app projeto.ecproj`) e ele renderiza. Se o app já estiver aberto, feche (kill -TERM) e reabra, senão ele mostra o projeto antigo.

## Lições do Reel do dossiê (21/10/2026)

- **O visual de referência é o do Diverno.** Ele recusou a versão de palavra solta gigante ("muito texto sem ícones e sem equilíbrio visual"). Cada tela tem um bloco visual em cima (ícones em círculo com rótulo, cartões de foto ou peça) e 2 ou 3 linhas da fala embaixo, com tamanhos que variam pouco (80 a 150). Playfair só numa palavra por tela.
- **Legendinha pequena embaixo.** A fala inteira, em pedaços de até 6 palavras no tempo da voz, em 40 px perto do rodapé (`legenda()` em `exemplos/dossie/cenas.jsx`, lendo o `pal.jsx` gerado do palavras.json).
- **Ícones Phosphor fill** que faltarem: `https://unpkg.com/@phosphor-icons/core@2.1.1/assets/fill/<nome>-fill.svg`, juntados em `icones_extra.jsx` (o `iconeSobe` precisa do `arrow-up`).
- **A grade do fundo não pode subir sem fim:** o deslocamento é `-((time*14)%90)` (passo da grade de 90 px), senão do meio pro fim a grade só cobre metade da tela.
- **Ficha do fim = tempo de produção e crédito gasto** (conta_tokens.py desde o pedido do roteiro + custo das APIs em reais), não a lista de ferramentas.
