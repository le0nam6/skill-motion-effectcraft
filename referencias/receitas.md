# Receitas de código (todas aprovadas no Guaraná Jesus)

Código completo em `exemplos/guarana-jesus/guarana.jsx`; funções comuns em `lib/base.jsx`.
O sistema é o do After Effects: `setValueAtTime`, `KeyframeEase`, expressões em JS.

## Mola amortecida (uma chave por quadro)
```js
// lib/base.jsx → mola(prop, t, de, para, {z: amortecimento, w: frequência})
mola(tr(l, "pos"), t, [x, y + 34], [x, y], { z: 0.7, w: 14.5 });            // texto
mola(tr(g, "esc"), t, [55, 55], [100, 100], { z: 0.5, w: 15 });             // ícone ("pop")
```

## Linha centralizada que se recentraliza a cada palavra
A largura de cada palavra sai de `sourceRectAtTime`. Para cada palavra k, calcula-se o início da linha
como se só as k primeiras existissem; a expressão soma os deslocamentos com ease-out quando cada palavra entra.
```js
"var T=[t0,t1,…], S=[s0,s1,…]; var s=S[0];" +
"for (var i=1;i<T.length;i++){var p=Math.min(1,Math.max(0,(time-T[i])/0.38)); p=1-Math.pow(1-p,3); s+=(S[i]-S[i-1])*p;}" +
"value+[s,0]"
```
Tudo que acompanha a linha (risco, ícone) recebe **a mesma expressão**.

## Câmera: parada exata + voo só na troca (sem keyframes)
```js
"var B=[bordas], P=[[x,y,z] por cena], A=0.25, D=0.35;" +
"var i=0; while (i<B.length && time>=B[i]+D) i++;" +
"if (i>=B.length || time<B[i]-A) P[i]; else { var p=(time-(B[i]-A))/(A+D);" +
" p = p<0.5 ? 16*p*p*p*p*p : 1-Math.pow(-2*p+2,5)/2;" +           // ease in-out quíntico
" var a=P[i], b=P[i+1]; [a[0]+(b[0]-a[0])*p, a[1]+(b[1]-a[1])*p, a[2]+(b[2]-a[2])*p]; }"
```
A mesma expressão vai na posição (olho) e no ponto de interesse (âncora da câmera de dois nós).

## A cena que sai apaga
Toda camada criada dentro de uma cena é registrada (`prender()` em `lib/base.jsx`). No fim do script:
```js
tr(camada, "op").expression = "var p=Math.min(1,Math.max(0,(time-INICIO_DO_VOO)/0.3)); value*(1-p*p)";
```

## Borrão de velocidade
```js
app.run("layer.newAdjustment", { name: "velocidade" });
var rb = comp.layer("velocidade").property("ADBE Effect Parade").addProperty("CC Radial Fast Blur");
// amount: 0 em (borda−0,25) → 72 em (borda+0,02) → 0 em (borda+0,35), suavizado
```

## Brilho no destaque
```js
var g = l.property("ADBE Effect Parade").addProperty("ADBE Glo2");
g.property(2).setValue(18); g.property(3).setValue(tamanho * 0.4); g.property(4).setValue(0.8);
```

## Glitch (tremor por quadro + separação de cor)
Ruído determinístico por quadro (`sin(n*12.9898)*43758.5453`), 24 saltos por segundo, que decai até zero
em 0,36 s; a opacidade pisca no começo. Uma cópia ciano deslocada −18 px some no mesmo tempo. Ver `glitch()` no exemplo.

## Contador com frase literal
```js
["99", t, { marca: true, size: 300, conta: [10, 99, 0.9] }]   // na linha "fez 99 anos."
// expressão do texto: Math.round(10 + 89*easeOut(p))  — começa em 10 para não "pular" de largura
```

## Mapa em paradas
`ferramentas/gera_mapa.py` gera o satélite e os SVGs. No script, um nulo pai com expressões em âncora,
posição e escala interpolando paradas `[tempo, focoX, focoY, telaY, escala]`, com escala geométrica
(`a*pow(b/a, p)`) e ×0,97 no x (cosseno da latitude). Paradas aprovadas: continente (33%) →
Brasil (46–49%, segura ~0,7 s) → estado (~132%).

## Vídeo de IA cobrindo o texto (líquido subindo)
```js
// clipe em 2D, esticado: tempo do clipe = (time − LT0) * KV
// A = superfície medida (fração da altura) a 12 amostras por segundo do clipe
// S(t) = curva desejada (1,03 → −0,07 com ease in-out)
pos:  S>=C ? [540, 1920+(S-C)*1920] : [540, 1920]          // âncora em [540, 1920] (base)
esc:  S>=C ? 100 : 100*(1-S)/(1-C)                           // estica a partir da base quando precisa
matte (retângulo 2D, âncora na borda de cima): [540, S*1920 - 4]
app.run("layer.setTrackMatte", { layer: clipe, matte: retangulo, kind: "alpha" });
```

## Moldura de glossário (PrimoCast)
`janela()` e `glossario()` no exemplo: borda #111 de 6 px, corpo branco, cabeçalho de 54 px com três
bolinhas brancas, cópia deslocada +18 px atrás, foto com máscara retangular, legenda em janela própria
(título Bold 64, subtítulo Medium 46) que entra 0,35 s depois, girando em 3D e assentando com mola.
