# Ficha técnica: medir e traduzir

1. **No começo do projeto**, anotar em `custos.json`: horário, % da sessão de 5 h e % semanal
   (ferramenta `get_usage` ou o cartão de uso do app) e os créditos das APIs.
2. **No fim:**
   - Tokens: `python3 ferramentas/conta_tokens.py <transcript.jsonl> <início>`.
   - % de sessão: a diferença no 5 h e no semanal.
   - Custo: somar as APIs (TTS + Lyria ≈ US$ 0,10; Veo ≈ US$ 0,40/s no padrão ou 0,15/s no fast), com a cotação do dia (economia.awesomeapi.com.br).
3. **Traduzir para leigo** (ele pediu explicitamente):
   - % do plano Pro: Max 5x → ×5; Max 20x → ×20. Guaraná: 38 pontos no Max 5x ≈ **190% de uma sessão do Pro ("quase 2 sessões")**.
   - Tokens escritos ≈ ×0,7 palavras ≈ páginas de livro (300 palavras por página).
   - Custo em reais, dizendo onde foi o dinheiro.
4. **Ressalvas honestas:** o medidor é da conta inteira (outra sessão em paralelo entra junto),
   e a conversão para palavras é média de português.

Modelo de texto: `exemplos/guarana-jesus/ficha-tecnica.md`.
