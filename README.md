# motion-effectcraft

Skill do Claude Code e guia de **motion design por script no EffectCraft**: vídeo vertical feito do zero,
sem câmera, com narração por IA, texto cinético, câmera 3D nas trocas de cena, fotos reais, mapa de
satélite e vídeo de IA integrado.

- [`GUIA.md`](GUIA.md): princípios de motion, o que foi reprovado e por quê, e o processo. **Comece aqui.**
- [`SKILL.md`](SKILL.md): a skill (regras e passo a passo para o Claude).
- [`referencias/`](referencias): receitas de código, pegadinhas do EffectCraft e ficha técnica.
- [`lib/`](lib): funções comuns (mola, entrada, saída, texto, ícones Phosphor).
- [`ferramentas/`](ferramentas): mapa de satélite, Veo, medição de superfície, folha de quadros, tokens, render.
- [`exemplos/guarana-jesus/`](exemplos/guarana-jesus): o Marketing da Ilha #01 completo (script, mixagem, legenda, ficha).

## Instalar a skill
```bash
ln -s ~/Developer/motion-effectcraft ~/.claude/skills/motion-effectcraft
```
Precisa da CLI do EffectCraft em `~/Developer/artcraft/bin/`, de ffmpeg e de Pillow. As chaves de API
(Gemini) ficam em variável de ambiente e nunca no repositório.

Créditos dos dados: satélite NASA Blue Marble (domínio público), malha do IBGE, ícones Phosphor (MIT).
