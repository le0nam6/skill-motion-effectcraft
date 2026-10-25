---
name: motion-effectcraft
description: 'Motion design de vídeo vertical feito do zero por script no EffectCraft (o "After Effects" open source), sem rosto, com narração por IA: texto cinético, ícones na frase, câmera 3D só nas trocas de cena, fotos reais em moldura de glossário, mapa de satélite que mergulha num estado e vídeo de IA integrado (Veo). Use quando o pedido for criar ou refazer um motion, explainer, case animado, convite ou reels em motion; "faz um motion no EffectCraft"; animar um roteiro; Marketing da Ilha; corrigir easing, mola, transição, grifo, câmera ou ritmo de um motion; ou montar a ficha técnica com tokens, custo e % de sessão. NÃO use para pôr motion sobre um corte com pessoa falando (isso é a motion-vox).'
---

# Motion design por script no EffectCraft

O resultado tem de parecer feito por um bom motion designer, não por um programa. A ferramenta
é o meio; o que ele avalia é **ritmo, easing, hierarquia e fidelidade à referência**. Tudo aqui
saiu de reprovações reais: cada regra tem o motivo em `GUIA.md`.

Leia antes de começar:
- `GUIA.md`: os princípios de motion, o que foi reprovado e por quê, e o processo.
- `referencias/receitas.md`: o código de cada efeito aprovado (linha, câmera, transição, mapa, líquido…).
- `referencias/pegadinhas-effectcraft.md`: o que quebra no EffectCraft e o contorno.
- `referencias/ficha-tecnica.md`: como medir tokens, custo e % de sessão para o fim do vídeo.
- `exemplos/guarana-jesus/`: o vídeo inteiro aprovado (Marketing da Ilha #01), para copiar padrões.

## As regras que não se negociam

1. **Estudar a referência antes de animar.** Extrair os quadros (4 fps para a estrutura; 15 fps nas
   transições) e montar uma folha de contato. Escrever o que acontece: como a palavra entra, como a
   cena sai, quanto dura, onde fica o destaque. Só depois abrir o código. Ele já disse: "você é ruim
   demais de observar referência".
2. **Mola de verdade e ease in-out, nada linear.** Texto: mola amortecida com ζ≈0,7 (passa ~5% e
   assenta). Ícone: nasce de 55% da escala com ζ≈0,5 e um giro de ~9° que assenta. Entrada em
   350–600 ms; saída mais curta (~260 ms) e acelerando (ease-in). Escalonar palavras em 50–100 ms.
3. **Câmera 3D só na troca de cena.** Parada exata durante a cena; voo de ~0,6 s com ease in-out
   forte, borrão de velocidade no meio do voo, e a cena que sai apagando em ~0,3 s.
4. **Destaque é cor + brilho.** Nunca caixa ou grifo atrás da palavra cortando as letras. Risco
   (tachado) passa no meio das letras, cobre as palavras inteiras e acompanha a linha.
5. **A linha fica centralizada e se recentraliza a cada palavra nova**, que entra desfocando.
6. **Ícone de ideia é palavra da frase:** mesma altura, mesma linha, entra com a palavra que ilustra. Nunca solto.
   **Ferramenta ou marca citada é o contrário:** ícone grande e animado no centro, com a fala numa legenda de uma linha embaixo.
7. **Número sempre com a frase literal** ("Em março, fez **99** anos."), nunca o número sozinho.
8. **Prova visual real:** foto de verdade (com crédito) na moldura de glossário; mapa de satélite (sem repetir em episódios seguidos);
   vídeo de IA que interage com o texto; diagrama que precisa parecer real vem de ilustração gerada (Gemini Image), não de retângulos.
   Marca citada = logo em branco e grande; app citado = ícone oficial.
9. **SF Pro**, tracking −25, Semibold no corpo e Bold no destaque, entrelinha ~1,18×. Ícones de traço (Tabler) que se desenham com Trim Path, em destaque com brilho. Marca citada = a logo dela, em branco.
12. **O roteiro passa pela aprovação dele antes de produzir.** Mostrar as falas, ajustar, e só então gerar voz. Variar o CTA entre episódios; gancho com o case nos 3 primeiros segundos.
10. **Nada de prévia renderizada no chat.** Quando a montagem terminar e os quadros-chave estiverem conferidos, abra o projeto no EffectCraft para a pessoa ver o preview no próprio app (`pkill -TERM -f "EffectCraft.app/Contents/MacOS/EffectCraft"; open -a /Applications/EffectCraft.app projeto.ecproj`: com o app aberto, sem fechar e reabrir ele mostra o projeto antigo). Ela assiste, pede ajustes e renderiza. Só renderize se ela pedir.
11. Sem rosto dele, sem rótulos decorativos que ele não pediu e sem "assinatura". Responder em português.

## Processo

1. **Roteiro e voz.** Narração no Gemini TTS (voz Charon), trilha no Lyria; timestamps por palavra
   (`audio/palavras.json`). Cada palavra entra no tempo em que é dita (+ o deslocamento `OFF`).
2. **Mapa de cenas.** Dividir pelo início da primeira palavra de cada bloco (`bordas`). Uma ideia por
   cena; cada cena começa quase vazia e se constrói.
3. **Animar** copiando de `exemplos/guarana-jesus/guarana.jsx` e `lib/base.jsx`
   (`linha`, `iconeFlat`, `glossario`, `cena`, câmera por expressão, `brilho`, `glitch`).
4. **Conferir quadros** com `ferramentas/folha.py` nos momentos críticos: entrada de cada cena, meio
   de cada transição, cada destaque. Ver os quadros e corrigir antes de qualquer vídeo.
5. **Mixar** (`exemplos/guarana-jesus/mix.py`): voz + trilha com ducking + whoosh em cada troca, pop
   nos ícones, impacto nos destaques, glitch curto (0,45 s), som do próprio clipe de IA; loudnorm −14.
6. **Abrir no EffectCraft** para a pessoa ver o preview (regra 10). Aplicar o retorno rápido, montar de novo e reabrir.
7. **Render:** a pessoa renderiza no app. Só se ela pedir: `ferramentas/render.sh final …` (4K = `--resolution 2`, 60 fps).
8. **Ficha técnica** com `ferramentas/conta_tokens.py` e o % de sessão (ver `referencias/ficha-tecnica.md`).
9. Entregar em `~/Downloads/<projeto>/` (vídeo, legenda, ficha) e no WhatsApp dele (`ferramentas/enviar_whatsapp.sh`). Nada de artefato publicado.

Ferramentas novas: `render_partes.sh` (4K em pedaços de 4 s), `enviar_whatsapp.sh` (documento sem compressão pela Evolution),
`imagem_gemini.py` (ilustração de diagrama, como a planta do supermercado). Exemplos: **`exemplos/diverno` (o motor atual: telas alternando tema claro e escuro, fotos em cartão, glitch só no destaque; copie daqui)**, `exemplos/guarana-jesus`, `exemplos/grupo-mateus` e `exemplos/nrr-day-case` (case para Instagram: vitrine flat, abertura branca no estilo Neto Editor, montagem em duas comps com emenda invisível).
