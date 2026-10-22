# Case NRR Day (Instagram, 9:16), 17/10/2026

Vídeo de portfólio do Leonam: o Claude montou os slides e os vídeos do NRR Day da V4 Telles & Co direto no Google Slides.
A mídia (clipes, imagens, áudio) fica em `~/Downloads/NRR Day - Case/` e não vem para o repositório.

**Arquivos:**
- `case.jsx` monta três comps:
  - "Corpo do case": o vídeo com os tempos da voz antiga;
  - "Abertura": hook branco mais a ponte;
  - "Case NRR Day": as duas juntas.
- `abertura_branca.jsx` é a abertura no estilo Neto Editor. A função `tela()` faz o zoom contínuo, a entrada por baixo e a saída voando. A função `palavra()` faz a entrada cinza que escurece e o glitch de piscar. Também estão aqui o cursor e a caixa de seleção do Figma, e os ícones do Kling em leque, aplicados em multiply.
- `teste-abertura.jsx` monta só a abertura, para aprovar antes do vídeo inteiro.
- `mix.py` faz a voz nova até o corte e depois a voz antiga deslocada. A trilha entra no impacto do hook. Os efeitos do vídeo antigo vêm deslocados.
- `icones_case.jsx` tem os ícones Phosphor e simple-icons usados.

**A emenda invisível:** trocar a abertura sem reescrever os tempos de 60 s de animação.
1. O vídeo antigo vira uma precomp.
2. A abertura nova é outra precomp, que reconstrói a cena de destino com o mesmo desenho, a mesma câmera parada e as mesmas luzes. As luzes usam um `TOFF` no `time` da expressão.
3. A comp final mostra a Abertura até XC e o Corpo com `startTime = XC − 8,27`.
4. No corte, as duas mostram o mesmo quadro. Para conferir, renderize a Abertura em XC − 0,02 e o Corpo em 8,29.
