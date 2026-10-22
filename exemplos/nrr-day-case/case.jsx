// Case NRR Day (Instagram, 9:16), v5 (17/10): abertura nova (hook dele) no estilo do Neto Editor, em fundo branco (abertura_branca.jsx),
// e a ponte "Um evento interno precisa de identidade, apresentação e um momento WOW" já no fundo escuro.
// Montagem: "Corpo do case" é o vídeo v4 com os tempos antigos (a partir de 8,27 s, o voo para "Slides, vídeos e dinâmica");
// "Abertura" tem o hook e a ponte; "Case NRR Day" junta as duas: a Abertura até XC e o Corpo deslocado de D = XC − 8,27.
// No corte, as duas mostram o mesmo quadro (a cena 1 parada, com a mesma câmera e as mesmas luzes).
// v3 (17/10): "momento WOW", nenhum ícone no meio da frase, ícones grandes animados,
// abertura com os slides passando no cartão e corte mais enxuto (retenção: tempo médio de visualização). v2: o Claude montou slides e vídeos direto no Google Slides.
// Motor do Guaraná Jesus: cenas no espaço 3D, câmera parada que só voa na troca (com borrão), mola, destaque por cor + brilho.
// v2 (pedido dele, 17/10): ferramenta citada = ícone GRANDE na tela, com a fala virando legenda de uma linha embaixo;
// os reveals aparecem de verdade (Karine, Nathália, Kauã) numa vitrine flat: fundo branco, grade cinza quase invisível,
// vídeo com cantos arredondados e sombra, e a linha do tempo da geração embaixo com o cursor andando junto.
// Voz: audio/voz3.wav (tempos em audio/palavras3.json); depois de "foi esse:" a voz espera a vitrine (SH = 9,4 s).
// Rodar: effectcraft-cli script "$PWD/case.jsx" --empty
#include "base.jsx"
#include "icones_svg.jsx"
#include "icones_case.jsx"
#include "kling_svg.jsx"

PASTA = "~/Downloads/NRR Day - Case/";
var FPS = 60;
W1 = 1080; H1 = 1920; FIM = 59.6;
function V(s) { return s; }
var DEST = "#E0252F", CREME = "#F3EFEF", CINZA = "#9C9395", FUNDO = "#0B0708";
var TINTA = "#1B1617", CINZA_F = "#8A8486";
COR.vermelho = DEST;
for (var kc in ICONES_CASE) ICONES_SVG[kc] = ICONES_CASE[kc];

comp = app.project.items.addComp("Corpo do case", W1, H1, 1, FIM, FPS);
comp.bgColor = [0.043, 0.027, 0.031];
comp.motionBlur = true;
comp.openInViewer();

// chaves suavizadas só nas novas (não mexe nas chaves de mola que já existem na propriedade)
function K2(prop, pares, inf) {
  for (var i = 0; i < pares.length; i++) {
    prop.setValueAtTime(pares[i][0], pares[i][1]);
    var k = prop.nearestKeyIndex(pares[i][0]), n = dims(prop), a = [], b = [];
    for (var d = 0; d < n; d++) { a.push(new KeyframeEase(0, inf || 80)); b.push(new KeyframeEase(0, inf || 80)); }
    try { prop.setTemporalEaseAtKey(k, a, b); } catch (e) { try { prop.setTemporalEaseAtKey(k, [a[0]], [b[0]]); } catch (e2) {} }
  }
}

// ---------- fundo escuro: luzes vermelhas suaves que respiram ----------
var TOFF = 0;   // deslocamento do tempo das luzes (a Abertura usa o mesmo desenho do Corpo no instante do corte)
function luz(cor, w, h, x, y, op, vel, fase) {
  var l = forma("ellipse", w, h, cor, { nome: "luz" });
  borra(l, [[0, 170]]);
  tr(l, "pos").setValue([x, y]); tr(l, "op").setValue(op);
  tr(l, "pos").expression = "var t=time+(" + TOFF + "); value + [Math.sin(t * " + vel + " + " + fase + ") * 120, Math.cos(t * " + vel * 0.8 + " + " + fase + ") * 90]";
  vida(l, 0, FIM);
  return l;
}
luz(DEST, 1300, 900, 900, 1950, 30, 0.33, 0);
luz("#7A0D14", 1100, 800, 100, 100, 34, 0.27, 2);
luz("#B3121C", 900, 700, 1050, 380, 14, 0.21, 4);

// ---------- cenas no espaço ----------
var CENAS = [];
function cena(i, x, y, z) {
  CENA_ATUAL = null;
  var n = nulo(0, 0);
  n.threeDLayer = true;
  tr(n, "pos").setValue([x, y, z]);
  CENAS[i] = { nulo: n, x: x, y: y, z: z };
  CENA_ATUAL = n; CENA_IDX = i;
  return n;
}
function brilho(l, raio, forca) {
  var g = l.property("ADBE Effect Parade").addProperty("ADBE Glo2");
  g.property(2).setValue(18); g.property(3).setValue(raio || 38); g.property(4).setValue(forca || 0.9);
  return g;
}
// ícone Phosphor num disco vermelho (só para ideias: troféu, relógio, check; ferramenta não entra na frase)
function iconeFlat(nomeIc, x, y, diam, t, o) {
  o = o || {};
  var g = nulo(x, y);
  var bola = forma("ellipse", diam, diam, o.fundo || DEST, { nome: "bola" });
  bola.parent = g; tr(bola, "pos").setValue([0, 0]);
  var svg = ICONES_SVG[nomeIc].replace('fill="currentColor"', 'fill="' + (o.glifo || "#140B0C") + '"');
  var nn = nome("ic");
  app.run("edit.pasteSvg", { svg: svg, name: nn });
  var gl = prender(comp.layer(nn));
  gl.parent = g;
  tr(gl, "anc").setValue([128, 128]);
  tr(gl, "esc").setValue([diam * 0.56 / 256 * 100, diam * 0.56 / 256 * 100]);
  tr(gl, "pos").setValue([0, 0]);
  gl.motionBlur = true;
  pop(g, t, 100, { giro: o.giro === undefined ? -12 : o.giro });
  var vis = [bola, gl];
  for (var v = 0; v < 2; v++) K(tr(vis[v], "op"), [[t, 0], [t + 0.1, 100]], 50);
  var fim = o.fim || FIM;
  vida(g, t, fim); vida(bola, t, fim); vida(gl, t, fim);
  return g;
}
// ---------- ferramenta = ícone GRANDE no centro da tela, com aura ----------
function svgCor(svg, cor) { return svg.replace(/<path /g, '<path fill="' + cor + '" '); }
function iconeGrande(tipo, x, y, alt, t, fim) {
  var l, base;
  if (tipo === "effectcraft") {
    l = imagem("imagens/logos/effectcraft.png"); base = 1024 * 0.82; // o ícone do app tem margem transparente
  } else {
    var svg = tipo === "kling" ? KLING_SVG : svgCor(ICONES_SVG[tipo], tipo === "claude" ? "#D97757" : "#F4B400");
    var nn = nome("marca");
    app.run("edit.pasteSvg", { svg: svg, name: nn });
    l = prender(comp.layer(nn));
    var r = l.sourceRectAtTime(0, false);
    tr(l, "anc").setValue([r.left + r.width / 2, r.top + r.height / 2]);
    base = Math.max(r.width, r.height);
  }
  var e = alt / base * 100;
  l.motionBlur = true;
  tr(l, "pos").setValue([x, y]);
  // aura atrás (luz na cor da marca, bem difusa)
  var aura = forma("ellipse", alt * 1.5, alt * 1.5, tipo === "claude" ? "#D97757" : tipo === "googleslides" ? "#F4B400" : DEST, { nome: "auraIc" });
  tr(aura, "pos").setValue([x, y]); borra(aura, [[0, 110]]);
  K(tr(aura, "op"), [[t, 0], [t + 0.5, 30]], 60);
  aura.moveAfter(l);
  mola(tr(l, "esc"), t, [e * 0.55, e * 0.55], [e, e], { z: 0.5, w: 13 });
  K(tr(l, "op"), [[t, 0], [t + 0.12, 100]], 50);
  borra(l, [[t, 16], [t + 0.3, 0]]);
  // vida própria depois de entrar: cada marca com um gesto dela
  var dt = (t + 0.25).toFixed(2), rampa = "Math.min(1,Math.max(0,(time-" + dt + ")/0.6))";
  if (tipo === "claude") tr(l, "rot").expression = "var r=" + rampa + "; (time-" + dt + ")*38*r";            // o asterisco gira devagar
  else if (tipo === "kling") tr(l, "rot").expression = "var r=" + rampa + "; Math.sin((time-" + dt + ")*1.6)*7*r";
  else mola(tr(l, "rot"), t, -10, 0, { z: 0.5, w: 11 });
  if (tipo !== "effectcraft") tr(l, "pos").expression = "value + [0, Math.sin((time-" + dt + ")*2.2)*9*" + rampa + "]";
  tr(aura, "op").expression = "value * (0.8 + 0.25*Math.sin((time-" + dt + ")*3.1))";       // a luz respira
  if (tipo === "kling") {                       // a marca se desenha pelo traço e depois preenche
    var gK = l.property("ADBE Root Vectors Group").property(1).property("ADBE Vectors Group").property(1).property("ADBE Vectors Group");
    app.run("layer.addShapeItem", { layer: l.name, kind: "stroke", group: "contents/group/contents/group" });
    var tmK = app.run("layer.addShapeItem", { layer: l.name, kind: "trim", group: "contents/group/contents/group" });
    app.run("prop.moveGroup", { layer: l.name, prop: tmK.uid, index: 7 });
    app.run("prop.set", { layer: l.name, path: "contents/group/contents/group/contents/stroke/width", value: 14 });
    app.run("prop.set", { layer: l.name, path: "contents/group/contents/group/contents/stroke/color", value: "#FFFFFF" });
    var trK = gK.property("ADBE Vector Filter - Trim"), fK = gK.property("ADBE Vector Graphic - Fill"), sK = gK.property("ADBE Vector Graphic - Stroke");
    K(trK.property("ADBE Vector Trim End"), [[t, 0], [t + 0.85, 100]], 70);
    K(fK.property("ADBE Vector Fill Opacity"), [[t + 0.55, 0], [t + 1.0, 100]], 60);
    K(sK.property("ADBE Vector Stroke Opacity"), [[t + 0.95, 100], [t + 1.3, 0]], 60);
  }
  if (tipo === "effectcraft") {                 // o ícone do app entra virando em 3D
    l.threeDLayer = true;
    mola(l.property("ADBE Transform Group").property("ADBE Rotate Y"), t, 95, 0, { z: 0.55, w: 10 });
    tr(l, "pos").expression = "value + [0, Math.sin((time-" + dt + ")*2.2)*9*" + rampa + ", 0]";
  }
  if (tipo === "googleslides") {                // os slides se abrem em leque atrás do ícone
    for (var q = 0; q < 2; q++) {
      var nq = nome("folha");
      app.run("edit.pasteSvg", { svg: svgCor(ICONES_SVG.googleslides, q ? "#C99300" : "#E0A800"), name: nq });
      var lq = prender(comp.layer(nq)), rq0 = lq.sourceRectAtTime(0, false);
      tr(lq, "anc").setValue([rq0.left + rq0.width / 2, rq0.top + rq0.height * 0.9]);
      tr(lq, "pos").setValue([x, y + alt * 0.4]); tr(lq, "esc").setValue([e, e]);
      tr(lq, "pos").expression = "value + [0, Math.sin((time-" + dt + ")*2.2)*9*" + rampa + "]";
      lq.moveAfter(l);
      K(tr(lq, "rot"), [[t + 0.35, 0], [t + 0.9, q ? 16 : -16]], 75);
      K(tr(lq, "op"), [[t + 0.3, 0], [t + 0.45, q ? 45 : 70]], 50);
      vida(lq, t + 0.3, fim || FIM);
      l.folhas = (l.folhas || []).concat([lq]);
    }
  }
  vida(l, t, fim || FIM); vida(aura, t, fim || FIM);
  l.e = e; l.aura = aura;
  return l;
}
// o primeiro ícone abre espaço para o segundo: desliza para a esquerda e encolhe; uma linha liga os dois (o "conector")
function parear(l1, t, y, fim) {
  var e = l1.e;
  K2(tr(l1, "pos"), [[t, [540, y]], [t + 0.45, [300, y]]], 80);
  K2(tr(l1, "esc"), [[t, [e, e]], [t + 0.45, [e * 0.66, e * 0.66]]], 80);
  K2(tr(l1.aura, "pos"), [[t, [540, y]], [t + 0.45, [300, y]]], 80);
  var lin = forma("rect", 240, 6, CREME, { nome: "conector", raio: 3 });
  tr(lin, "anc").setValue([-120, 0]); tr(lin, "pos").setValue([420, y]);
  K(tr(lin, "esc"), [[t + 0.35, [0, 100]], [t + 0.75, [100, 100]]], 75);
  tr(lin, "op").setValue(55);
  var dot = forma("ellipse", 22, 22, DEST, { nome: "pulso" });
  tr(dot, "pos").expression = "var p=((time-" + (t + 0.8) + ")%0.9)/0.9; time<" + (t + 0.8) + " ? [-200," + y + "] : [420+240*p, " + y + "]";
  brilho(dot, 14, 1.2);
  vida(lin, t + 0.3, fim); vida(dot, t + 0.8, fim);
}
// ---------- linha de palavras centralizada que se recentraliza ----------
function linha(ws, y, o) {
  o = o || {};
  var size = o.size || 80, esp = size * 0.26;
  var ls = [], total = 0;
  for (var i = 0; i < ws.length; i++) {
    var c = ws[i][2] || {}, l, sz = c.size || size;
    if (ws[i][0].charAt(0) === "@") { l = { icone: ws[i][0].substr(1), largura: sz * 1.1 }; }
    else {
      l = texto(ws[i][0], { size: sz, cor: c.marca ? DEST : (c.cor || o.cor || CREME), style: c.marca ? "Bold" : (c.style || o.style || "Regular") });
      if (c.marca) brilho(l, sz * 0.4, 0.8);
    }
    l.sz = sz;
    ls.push(l); total += l.largura + (i ? esp : 0);
  }
  var x0 = (W1 - total) / 2, x = x0;
  var acum = 0, inicios = [], tempos = [];
  for (var k = 0; k < ls.length; k++) { acum += ls[k].largura + (k ? esp : 0); inicios.push((W1 - acum) / 2 - x0); tempos.push(V(ws[k][1])); }
  var ex = null;
  if (ls.length > 1 && o.reflow !== false) {
    ex = "var T=[" + tempos.join(",") + "], S=[" + inicios.join(",") + "]; var s=S[0];" +
      "for (var i=1;i<T.length;i++){var p=Math.min(1,Math.max(0,(time-T[i])/0.38)); p=1-Math.pow(1-p,3); s+=(S[i]-S[i-1])*p;}" +
      "value+[s,0]";
  }
  for (var j = 0; j < ls.length; j++) {
    var cx = x + ls[j].largura / 2, t = V(ws[j][1]), cj = ws[j][2] || {};
    var yj = y + 0.36 * (size - ls[j].sz);
    var fim = o.saida ? o.saida + 0.3 + j * 0.02 : (o.fim || FIM);
    if (ls[j].icone) {
      var lw = ls[j].largura;
      ls[j] = iconeFlat(ls[j].icone, cx, y - size * 0.02, size * 1.1, t, { fim: fim });
      ls[j].largura = lw;
    } else {
      entra(ls[j], t, cx, yj, { dy: o.dy === undefined ? 34 : o.dy, escala: o.escala });
      if (cj.conta) {
        var cc = cj.conta;
        var fmt = cj.milhar ? "var n=Math.round(" + cc[0] + "+(" + (cc[1] - cc[0]) + ")*p); Math.floor(n/1000)+'.'+('00'+(n%1000)).slice(-3)" : "'' + Math.round(" + cc[0] + "+(" + (cc[1] - cc[0]) + ")*p)";
        ls[j].property("ADBE Text Properties").property("ADBE Text Document").expression =
          "var p=Math.min(1,Math.max(0,(time-" + (t + 0.05) + ")/" + cc[2] + ")); p=1-Math.pow(1-p,3); " + fmt;
      }
      if (o.saida) sai(ls[j], o.saida + j * 0.02, cx, yj);
      vida(ls[j], t - 0.05, fim);
    }
    if (ex) tr(ls[j], "pos").expression = ex;
    ls[j].cx = cx; ls[j].cy = yj;
    x += ls[j].largura + esp;
  }
  return ls;
}
// legenda de uma linha embaixo da tela (quando o ícone grande é o protagonista)
function legenda(ws, o) { o = o || {}; o.size = (o.size || 44) + 6; o.dy = 18; return linha(ws, o.y || 1640, o); }
// cartão com imagem ou vídeo real (cenas escuras)
function cartao(arq, wImg, hImg, cx, cy, w, t, o) {
  o = o || {};
  var g = nulo(cx, cy);
  var h = w * hImg / wImg, fim = o.fim || FIM;
  var aura = forma("ellipse", w * 1.1, h * 1.2, DEST, { nome: "aura" });
  aura.parent = g; tr(aura, "pos").setValue([0, 30]); borra(aura, [[0, 90]]);
  K(tr(aura, "op"), [[t, 0], [t + 0.5, o.aura === undefined ? 26 : o.aura]], 60);
  var m = imagem(arq);
  m.parent = g; tr(m, "pos").setValue([0, 0]);
  var e = w / wImg * 100; tr(m, "esc").setValue([e, e]);
  if (o.inicio !== undefined) { m.startTime = t - o.inicio; }
  if (o.troca) for (var tq = 0; tq < o.troca.length; tq++) {      // as outras imagens entram em corte seco por cima
    var tx = o.troca[tq], mt = imagem(tx[0]);
    mt.parent = g; tr(mt, "pos").setValue([0, 0]); var et = w / tx[1] * 100; tr(mt, "esc").setValue([et, et]);
    vida(mt, tx[2], fim);
  }
  var bor = forma("rect", w + 3, h + 3, CREME, { nome: "borda", stroke: CREME, strokeWidth: 2 });
  bor.parent = g; tr(bor, "pos").setValue([0, 0]);
  K(tr(bor, "op"), [[t, 0], [t + 0.2, 22]], 50);
  K(tr(m, "op"), [[t, 0], [t + 0.15, 100]], 50);
  var rz = o.rotY === undefined ? -6 : o.rotY;
  mola(tr(g, "pos"), t, [cx + (o.dx || 160), cy + (o.dy || 220), 650], [cx, cy, 0], { z: 0.62, w: 10 });
  mola(g.property("ADBE Transform Group").property("ADBE Rotate Y"), t, rz - 34, rz, { z: 0.6, w: 9 });
  mola(g.property("ADBE Transform Group").property("ADBE Rotate X"), t, 14, o.rotX || 2, { z: 0.6, w: 9 });
  vida(g, t, fim); vida(aura, t, fim); vida(m, t, fim); vida(bor, t, fim);
  return g;
}

// =============== CENA 0 — gancho (0 – 3,97 s) ===============
cena(0, 0, 0, 0);
// (o gancho antigo saiu: a abertura nova fica na comp Abertura)

// =============== CENA 1 — identidade, apresentação e palco (3,97 – 7,97 s) ===============
cena(1, 1700, -500, -3200);
// três peças lado a lado: ícone grande em cima, nome embaixo; a terceira (WOW) é a maior e acende em vermelho
iconeFlat("palette", 255, 740, 240, 3.91, { giro: -12, fundo: "#2A1416", glifo: CREME });
iconeFlat("presentation", 825, 740, 240, 5.04, { giro: 12, fundo: "#2A1416", glifo: CREME });
var wow = iconeFlat("confetti", 540, 1180, 300, 6.96, { giro: -16 });
tr(wow, "rot").expression = "value + (time>" + (6.96 + 0.6) + " ? Math.sin((time-" + (6.96 + 0.6) + ")*2.4)*6 : 0)";
linha([["identidade", 3.91, { style: "Bold" }]], 960, { size: 64, reflow: false }).forEach(function (l) { tr(l, "pos").expression = "value + [-285, 0]"; });
linha([["apresentação", 5.04, { style: "Bold" }]], 960, { size: 64, reflow: false }).forEach(function (l) { tr(l, "pos").expression = "value + [285, 0]"; });
linha([["momento", 6.46, { style: "Bold" }], ["WOW", 6.96, { marca: true, size: 150 }]], 1460, { size: 90 });

// =============== CENA 2 — slides, vídeos e dinâmica (7,97 – 10,74 s) ===============
cena(2, -300, -1100, -6400);
linha([["Slides,", 8.52, { style: "Bold" }], ["vídeos", 9.45, { style: "Bold" }], ["e", 9.8], ["dinâmica.", 10.36, { marca: true }]], 330, { size: 78 });
cartao("imagens/aquisicao-2k.png", 2000, 1125, 470, 650, 700, 8.52, { rotY: 8 });
cartao("clipes/sus-03.mp4", 640, 360, 610, 1060, 700, 9.45, { rotY: -8, inicio: 0 });
cartao("imagens/dinamica-2k.png", 2000, 1125, 470, 1470, 700, 10.36, { rotY: 8 });

// =============== CENA 3 — NRR Day da V4 Telles & Co (10,74 – 13,51 s) ===============
cena(3, 1500, -1600, -9600);
var nrr = imagem("imagens/logos/logo-nrr.png");
tr(nrr, "pos").setValue([540, 760]); pop(nrr, 11.95, 9.5, { giro: 0 });
K(tr(nrr, "op"), [[11.95, 0], [12.1, 100]], 50); vida(nrr, 11.9, 15.4);
linha([["No", 11.93], ["NRR", 12.1, { style: "Bold" }], ["Day", 12.82, { style: "Bold" }], ["da", 13.06]], 1120, { size: 80 });
linha([["V4", 13.26, { style: "Bold" }], ["Telles", 13.88, { style: "Bold" }], ["&", 14.36, { style: "Bold" }], ["Co,", 14.48, { style: "Bold" }]], 1235, { size: 80 });

// =============== CENA 4 — Claude → Google Slides, ícones grandes (13,51 – 17,21 s) ===============
cena(4, -200, -2300, -12800);
var icC = iconeGrande("claude", 540, 860, 380, 15.16, 19.0);
var icS = iconeGrande("googleslides", 780, 860, 260, 16.98, 19.0);
parear(icC, 16.85, 860, 19.0);
legenda([["o", 15.0], ["Claude", 15.16, { style: "Bold" }], ["montou", 15.42], ["tudo", 15.98], ["direto", 16.2], ["no", 16.72], ["meu", 16.84], ["Google", 16.98, { style: "Bold" }], ["Slides.", 17.22, { style: "Bold" }]], { size: 42 });

// =============== CENA 5 — 33 slides (17,21 – 21,88 s) ===============
cena(5, 1300, -3200, -16000);
linha([["33", 18.57, { marca: true, size: 300, conta: [10, 33, 0.9] }], ["slides", 19.1, { style: "Bold", size: 130 }]], 470, { size: 130 });
var GX = 5, TW = 184, TH = 103.5, GAP = 10, gx0 = 540 - (GX * TW + (GX - 1) * GAP) / 2 + TW / 2, gy0 = 640;
for (var gi = 0; gi < 33; gi++) {
  var col = gi % GX, lin = Math.floor(gi / GX);
  var px = gx0 + col * (TW + GAP), py = gy0 + lin * (TH + GAP);
  var tl = imagem("imagens/grade/" + (gi < 9 ? "0" : "") + (gi + 1) + ".jpg");
  tr(tl, "esc").setValue([50, 50]);
  var t0 = 18.62 + gi * 0.045;
  mola(tr(tl, "pos"), t0, [px, py + 40, 500], [px, py, 0], { z: 0.62, w: 12 });
  K(tr(tl, "op"), [[t0, 0], [t0 + 0.12, 100]], 50);
  vida(tl, t0, 23.5);
}
linha([["com", 19.68], ["texto", 19.9, { style: "Bold" }], ["editável,", 20.24, { style: "Bold" }]], 1560, { size: 80 });
linha([["sem", 21.2], ["eu", 21.28], ["abrir", 21.44], ["o", 21.76], ["editor.", 21.9]], 1670, { size: 80 });

// =============== CENA 6 — 1.241 comandos, nenhum clique (21,88 – 27,66 s) ===============
cena(6, 0, -4100, -19200);
var cod = imagem("imagens/codigo.png");
tr(cod, "anc").setValue([1000, 0]); tr(cod, "esc").setValue([50, 50]);
K(tr(cod, "pos"), [[23.0, [540, 1500]], [29.0, [540, -1000]]], 20);
K(tr(cod, "op"), [[23.0, 0], [23.4, 30]], 60);
vida(cod, 23.0, 29.1);
var veuC = forma("rect", 1080, 900, FUNDO, { nome: "veuCod" });
tr(veuC, "pos").setValue([540, 900]); borra(veuC, [[0, 120]]); tr(veuC, "op").setValue(70); vida(veuC, 23.0, 29.1);
linha([["1.241", 23.09, { marca: true, size: 280, conta: [1000, 1241, 1.4], milhar: true }]], 640, { size: 280 });
linha([["comandos", 24.52, { style: "Bold" }], ["pelo", 25.32], ["conector,", 25.5, { style: "Bold" }]], 820, { size: 76 });
// "nenhum clique meu": o cursor grande chega, clica (onda), e um risco vermelho atravessa
var cur = iconeFlat("cursor-click", 540, 1150, 260, 26.7, { giro: -10, fundo: "#F3EFEF", glifo: "#140B0C" });
K2(tr(cur, "pos"), [[26.7, [700, 1290]], [27.05, [540, 1150]]], 80);
var onda = forma("ellipse", 260, 260, CREME, { nome: "onda", stroke: CREME, strokeWidth: 6 });
tr(onda, "pos").setValue([540, 1150]); K(tr(onda, "esc"), [[27.1, [100, 100]], [27.6, [170, 170]]], 40); K(tr(onda, "op"), [[27.1, 80], [27.6, 0]], 40); vida(onda, 27.1, 27.7);
var corte = forma("rect", 340, 18, DEST, { nome: "corte", raio: 9 });
tr(corte, "pos").setValue([540, 1150]); tr(corte, "rot").setValue(-40); brilho(corte, 20, 1.0);
mola(tr(corte, "esc"), 27.54, [0, 100], [100, 100], { z: 0.8, w: 16 }); vida(corte, 27.54, 29.1);
legenda([["nenhum", 26.7], ["clique", 27.06, { style: "Bold" }], ["meu.", 27.54, { marca: true }]], { size: 58, y: 1480 });

// =============== CENA 7 — Kling → EffectCraft, ícones grandes (27,66 – 32,0 s) ===============
cena(7, 1400, -4900, -22400);
var icK = iconeGrande("kling", 540, 860, 380, 28.71, 33.6);
var icE = iconeGrande("effectcraft", 780, 860, 280, 30.82, 33.6);
parear(icK, 30.6, 860, 33.6);
legenda([["12", 28.71, { marca: true }], ["cenas", 29.08], ["geradas", 29.56], ["no", 30.02], ["Kling", 30.16, { style: "Bold" }]], { size: 46, saida: 30.4 });
legenda([["e", 30.44], ["montadas", 30.82], ["no", 31.3], ["EffectCraft.", 31.42, { style: "Bold" }]], { size: 46 });

// =============== CENA 8 — e o resultado foi esse (32,0 – 36,0 s) ===============
cena(8, -100, -5800, -25600);
linha([["E", 33.15], ["o", 33.28], ["resultado", 33.4, { style: "Bold" }], ["dos", 34.02]], 760, { size: 76 });
linha([["vídeos", 34.3], ["do", 34.56], ["top", 34.86, { style: "Bold" }], ["performer", 35.06, { style: "Bold" }]], 870, { size: 76 });
linha([["da", 35.54], ["unidade", 35.72], ["foi", 36.22]], 980, { size: 76 });
linha([["esse:", 36.7, { marca: true, size: 170 }]], 1170, { size: 170 });

// =============== CENA 9 — vitrine flat dos reveals (36,0 – 50,6 s), em 2D ===============
cena(9, 1600, -6600, -28800);   // ponto da câmera (a vitrine em si é 2D, por cima)
CENA_ATUAL = null;
var V0 = 37.35, V1 = 47.5;
var vitrine = [];
function vit(l) { vitrine.push(l); return l; }
var branco = vit(forma("rect", W1 + 40, H1 + 40, "#FAFAFA", { nome: "branco" }));
tr(branco, "pos").setValue([540, 960]);
K(tr(branco, "op"), [[V0, 0], [V0 + 0.25, 100], [V1 - 0.25, 100], [V1 + 0.05, 0]], 60); vida(branco, V0, V1 + 0.1);
var grade = vit(imagem("imagens/grade-fundo.png"));
tr(grade, "pos").setValue([540, 960]); tr(grade, "esc").setValue([50, 50]);
K(tr(grade, "op"), [[V0 + 0.1, 0], [V0 + 0.4, 100], [V1 - 0.25, 100], [V1, 0]], 60); vida(grade, V0, V1 + 0.1);
var VIDS = [
  ["clipes/res-karine.mp4", 9.4, 5.0, "Karine Pinheiro", "Gestora de Projetos · DONOZZ"],
  ["clipes/res-nathalia.mp4", 11.8, 2.8, "Nathália Souza", "Closer"],
  ["clipes/res-kaua.mp4", 11.8, 2.0, "Kauã Aragão", "Designer · SWAT"]
];
var CW = 980, CH = 551.25, CY = 740, RAIO = 30;
var tIni = [37.5], curT = 37.5;
for (var vv = 0; vv < 3; vv++) { curT += VIDS[vv][2]; tIni.push(curT); }   // 37.5, 42.5, 45.3, 47.3
for (var vk = 0; vk < 3; vk++) {
  var a = tIni[vk], b = tIni[vk + 1], ent = a - (vk ? 0.15 : 0), sai2 = b - 0.15;
  var g = nulo(540, CY); vit(g);
  var x0e = vk ? 1500 : 540, y0e = vk ? CY : CY + 220;
  mola(tr(g, "pos"), ent, [x0e, y0e], [540, CY], { z: 0.75, w: 11 });
  if (vk < 2) K2(tr(g, "pos"), [[sai2, [540, CY]], [b + 0.2, [-420, CY]]], 75);
  var somb = vit(forma("rect", CW, CH, "#000000", { nome: "sombra", raio: RAIO }));
  somb.parent = g; tr(somb, "pos").setValue([0, 26]); tr(somb, "op").setValue(24); borra(somb, [[0, 38]]);
  var clip = vit(imagem(VIDS[vk][0]));
  clip.parent = g; tr(clip, "pos").setValue([0, 0]); tr(clip, "esc").setValue([CW / 1920 * 100, CW / 1920 * 100]);
  clip.startTime = a;
  var mat = vit(forma("rect", CW, CH, "#FFFFFF", { nome: "cantos", raio: RAIO }));
  mat.parent = g; tr(mat, "pos").setValue([0, 0]);
  app.run("layer.setTrackMatte", { layer: clip.name, matte: mat.name, kind: "alpha" });
  var vf = vk < 2 ? b + 0.25 : V1 + 0.1;
  vida(g, ent, vf); vida(somb, ent, vf); vida(clip, a, vf); vida(mat, ent, vf);
  var nm = vit(texto(VIDS[vk][3], { size: 52, style: "Bold", cor: TINTA }));
  entra(nm, a + 0.1, 540, 330, { dy: 20 });
  var fn = vit(texto(VIDS[vk][4], { size: 34, style: "Medium", cor: CINZA_F }));
  entra(fn, a + 0.16, 540, 392, { dy: 16 });
  if (vk < 2) { sai(nm, sai2, 540, 330); sai(fn, sai2 + 0.03, 540, 392); }
  vida(nm, a, vk < 2 ? b + 0.2 : V1 + 0.1); vida(fn, a, vk < 2 ? b + 0.2 : V1 + 0.1);
}
// a linha do tempo da geração (flat), embaixo do vídeo; o cursor anda junto do trecho que está tocando
var TL_Y = 1110, TL_H = 650, TL_X0 = 50, TL_W = 980, LBL = 345, TRK = TL_W - LBL - 40, DUR = 17.2;
var tlG = nulo(0, 0); vit(tlG);
mola(tr(tlG, "pos"), 37.7, [0, 160], [0, 0], { z: 0.75, w: 11 });
function noPainel(l) { l.parent = tlG; return l; }
var painelS = vit(forma("rect", TL_W, TL_H, "#000000", { nome: "painelSombra", raio: 26 }));
noPainel(painelS); tr(painelS, "pos").setValue([540, TL_Y + TL_H / 2 + 16]); borra(painelS, [[0, 30]]);
var painel = vit(forma("rect", TL_W, TL_H, "#FFFFFF", { nome: "painel", raio: 26 }));
noPainel(painel); tr(painel, "pos").setValue([540, TL_Y + TL_H / 2]);
var borP = vit(forma("rect", TL_W, TL_H, "#E7E4E5", { nome: "painelBorda", raio: 26, stroke: "#E7E4E5", strokeWidth: 2 }));
noPainel(borP); tr(borP, "pos").setValue([540, TL_Y + TL_H / 2]);
var tcab = vit(texto("Linha do tempo · como cada parte foi gerada", { size: 28, style: "Semibold", cor: CINZA_F, tracking: 0 }));
noPainel(tcab); tr(tcab, "anc").setValue([tr(tcab, "anc").value[0] - tcab.largura / 2, tr(tcab, "anc").value[1]]); tr(tcab, "pos").setValue([TL_X0 + 34, TL_Y + 52]);
var FAIXAS = [
  ["Troféu · Kling", 0, 2.4, "#E0252F"],
  ["Título · PhotoCraft", 2.4, 4.65, "#F28B30"],
  ["Logo 3D · Kling", 4.65, 7.45, "#E0252F"],
  ["Asa e traseira · Nano Banana", 7.45, 9.9, "#8B5CF6"],
  ["Giro da pessoa · Kling", 8.9, 12.56, "#E0252F"],
  ["Cartão e estrelas · EffectCraft", 10.06, 17.2, "#3B82F6"],
  ["Foto real", 12.56, 17.2, "#10B981"],
  ["Trilha e efeitos", 0, 17.2, "#B8B2B4"]
];
var TX0 = TL_X0 + LBL, RY0 = TL_Y + 104, RH = 64;
for (var fi = 0; fi < FAIXAS.length; fi++) {
  var F = FAIXAS[fi], ry = RY0 + fi * RH + RH / 2, tf = 37.85 + fi * 0.06;
  var lb = vit(texto(F[0], { size: 26, style: "Medium", cor: TINTA, tracking: 0 }));
  noPainel(lb); tr(lb, "anc").setValue([tr(lb, "anc").value[0] - lb.largura / 2, tr(lb, "anc").value[1]]);
  tr(lb, "pos").setValue([TL_X0 + 34, ry + 8]); K(tr(lb, "op"), [[tf, 0], [tf + 0.2, 100]], 50);
  var trilho = vit(forma("rect", TRK, 30, "#F1EEEF", { nome: "trilho", raio: 8 }));
  noPainel(trilho); tr(trilho, "pos").setValue([TX0 + TRK / 2, ry]);
  K(tr(trilho, "op"), [[tf, 0], [tf + 0.2, 100]], 50);
  var w = (F[2] - F[1]) / DUR * TRK, bx = TX0 + F[1] / DUR * TRK;
  var bloco = vit(forma("rect", w, 30, F[3], { nome: "bloco", raio: 8 }));
  noPainel(bloco); tr(bloco, "anc").setValue([-w / 2, 0]); tr(bloco, "pos").setValue([bx, ry]);
  K(tr(bloco, "esc"), [[tf, [0, 100]], [tf + 0.45, [100, 100]]], 75);
  vida(lb, tf, V1 + 0.1); vida(trilho, tf, V1 + 0.1); vida(bloco, tf, V1 + 0.1);
}
// cursor de reprodução: tempo do vídeo que está na tela (cada vídeo mostra um trecho do reveal)
var tSrc = "var t=time, s; if (t<" + tIni[1] + ") s=" + VIDS[0][1] + "+(t-" + tIni[0] + "); else if (t<" + tIni[2] + ") s=" + VIDS[1][1] + "+(t-" + tIni[1] + "); else s=" + VIDS[2][1] + "+(t-" + tIni[2] + "); s=Math.max(0,Math.min(" + DUR + ",s));";
var cab3 = vit(forma("rect", 4, RH * FAIXAS.length + 24, DEST, { nome: "cursor", raio: 2 }));
noPainel(cab3); tr(cab3, "pos").expression = tSrc + "[" + TX0 + "+s/" + DUR + "*" + TRK + ", " + (RY0 + RH * FAIXAS.length / 2) + "]";
var cab4 = vit(forma("ellipse", 20, 20, DEST, { nome: "cursorTopo" }));
noPainel(cab4); tr(cab4, "pos").expression = tSrc + "[" + TX0 + "+s/" + DUR + "*" + TRK + ", " + (RY0 - 14) + "]";
var tc = vit(texto("00:00:00", { size: 30, style: "Bold", cor: DEST, tracking: 0 }));
noPainel(tc); tr(tc, "anc").setValue([tr(tc, "anc").value[0] + tc.largura / 2, tr(tc, "anc").value[1]]); tr(tc, "pos").setValue([TL_X0 + TL_W - 34, TL_Y + 52]);
tc.property("ADBE Text Properties").property("ADBE Text Document").expression = tSrc + "var q=Math.floor(s), f=Math.floor((s-q)*60); '00:' + (q<10?'0':'') + q + ':' + (f<10?'0':'') + f";
var opsTL = [[tcab, 100], [cab3, 100], [cab4, 100], [tc, 100], [painel, 100], [painelS, 10], [borP, 100]];
for (var vt = 0; vt < opsTL.length; vt++) { K(tr(opsTL[vt][0], "op"), [[37.75, 0], [38.0, opsTL[vt][1]]], 50); vida(opsTL[vt][0], 37.7, V1 + 0.1); }
vida(tlG, 37.7, V1 + 0.1);
// a vitrine inteira some junto (antes do voo para "Foram 6 horas")
for (var vz = 0; vz < vitrine.length; vz++) {
  var lv = vitrine[vz];
  try { if (lv.nullLayer) continue; } catch (e) {}
  if (lv === branco || lv === grade) continue;
  tr(lv, "op").expression = "var p=Math.min(1,Math.max(0,(time-" + (V1 - 0.3) + ")/0.3)); value*(1-p*p)";
}

// =============== CENA 10 — 6 horas (50,6 – 53,4 s) ===============
cena(10, 200, -7500, -32000);
var SH = 9.4;
// relógio desenhado: os ponteiros giram rápido enquanto o "6" aparece (6 voltas do minuto = 6 horas)
var tR = 38.34 + SH, rel = nulo(540, 600);
var aro = forma("ellipse", 300, 300, CREME, { nome: "aroRel", stroke: CREME, strokeWidth: 12 }); aro.parent = rel; tr(aro, "pos").setValue([0, 0]);
var cen = forma("ellipse", 28, 28, DEST, { nome: "centroRel" }); cen.parent = rel; tr(cen, "pos").setValue([0, 0]);
var pm = forma("rect", 12, 118, CREME, { nome: "minuto", raio: 6 }); pm.parent = rel; tr(pm, "anc").setValue([0, 52]); tr(pm, "pos").setValue([0, 0]);
var ph = forma("rect", 14, 80, DEST, { nome: "hora", raio: 7 }); ph.parent = rel; tr(ph, "anc").setValue([0, 34]); tr(ph, "pos").setValue([0, 0]);
var giro = "var p=Math.min(1,Math.max(0,(time-" + (tR + 0.2) + ")/1.6)); p=1-Math.pow(1-p,3);";
tr(pm, "rot").expression = giro + "p*360*6";
tr(ph, "rot").expression = giro + "p*180";
pop(rel, tR, 100, { giro: -12 });
var ls10 = [aro, cen, pm, ph];
for (var q10 = 0; q10 < ls10.length; q10++) { K(tr(ls10[q10], "op"), [[tR, 0], [tR + 0.12, 100]], 50); vida(ls10[q10], tR, FIM); }
vida(rel, tR, FIM);
linha([["Foram", 38.34 + SH]], 880, { size: 84 });
linha([["6", 38.64 + SH, { marca: true, size: 340 }], ["horas", 39.02 + SH, { style: "Bold", size: 150 }]], 1160, { size: 150 });
linha([["de", 39.4 + SH], ["trabalho", 39.54 + SH], ["no", 39.88 + SH], ["total.", 40.06 + SH, { style: "Bold" }]], 1350, { size: 80 });

// =============== CENA 11 — aprovar (53,4 – 56,6 s) ===============
cena(11, -200, -8400, -35200);
linha([["E", 41.18 + SH], ["no", 41.26 + SH], ["fim,", 41.38 + SH]], 720, { size: 84 });
linha([["o", 42.08 + SH], ["meu", 42.18 + SH], ["trabalho", 42.32 + SH], ["foi", 42.7 + SH]], 830, { size: 84 });
linha([["aprovar.", 42.94 + SH, { marca: true, size: 190 }]], 1060, { size: 190 });
var ok = iconeFlat("check-circle", 540, 1340, 230, 43.1 + SH, { giro: -16 });
var anel = forma("ellipse", 230, 230, DEST, { nome: "anelOk", stroke: DEST, strokeWidth: 8 });
tr(anel, "pos").setValue([540, 1340]); K(tr(anel, "esc"), [[43.2 + SH, [100, 100]], [43.9 + SH, [190, 190]]], 40); K(tr(anel, "op"), [[43.2 + SH, 90], [43.9 + SH, 0]], 40); vida(anel, 43.2 + SH, 44.0 + SH);

// =============== CENA 12 — ficha técnica (56,6 – 61,6 s) ===============
cena(12, 1600, -9200, -38400);
var tf2 = 53.35, ff = 57.7;
var fundoF = forma("rect", 960, 1180, "#170D0F", { raio: 44, nome: "ficha" });
tr(fundoF, "pos").setValue([540, 1000]); pop(fundoF, tf2, 100); vida(fundoF, tf2, ff);
var cab = texto("FICHA TÉCNICA", { size: 30, style: "Bold", cor: DEST, tracking: 300 });
entra(cab, tf2 + 0.1, 540, 540, { dy: 20 }); vida(cab, tf2, ff);
var cab2 = texto("Como foi feito", { size: 74, style: "Bold", cor: CREME });
entra(cab2, tf2 + 0.18, 540, 630, { dy: 30 }); vida(cab2, tf2, ff);
var rows = [
  ["sparkle", "Slides, código e motion", "Claude Opus 5.5"],
  ["presentation", "Integração", "Conector do Google Slides"],
  ["film-strip", "Cenas em vídeo", "Kling 2.5 no Magnific"],
  ["cpu", "Montagem dos vídeos", "EffectCraft"],
  ["code", "Tokens escritos", "707 mil (≈ 1.650 páginas)"],
  ["coins", "Créditos de IA", "5.633 no Magnific"],
  ["clock", "Tempo de produção", "6 horas"]
];
for (var ri = 0; ri < rows.length; ri++) {
  var ry2 = 770 + ri * 112, trr = tf2 + 0.3 + ri * 0.09;
  iconeFlat(rows[ri][0], 175, ry2 - 20, 84, trr, { fim: ff, giro: 0 });
  var lb2 = texto(rows[ri][1], { size: 38, style: "Medium", cor: CINZA });
  tr(lb2, "anc").setValue([tr(lb2, "anc").value[0] - lb2.largura / 2, tr(lb2, "anc").value[1]]);
  entra(lb2, trr, 240, ry2 - 34, { dy: 16 }); vida(lb2, trr, ff);
  var vl = texto(rows[ri][2], { size: 48, style: "Bold", cor: ri >= 4 ? DEST : CREME });
  tr(vl, "anc").setValue([tr(vl, "anc").value[0] - vl.largura / 2, tr(vl, "anc").value[1]]);
  entra(vl, trr + 0.04, 240, ry2 + 16, { dy: 16 }); vida(vl, trr, ff);
}

// =============== CÂMERA: parada em cada cena; só voa na troca, com borrão ===============
CENA_ATUAL = null; CENA_IDX = -1;
app.run("layer.newCamera", { name: "Camera", type: "twoNode" });
var camL = comp.layer("Camera");
var cP = tr(camL, "pos"), cA = tr(camL, "anc");
var bordas = [3.91, 8.52, 11.93, 15.0, 18.57, 23.09, 28.71, 33.15, 37.4, 47.6, 50.45, 53.3];
var ANTES = 0.25, DEPOIS = 0.35;
function alvo(i) { var c = CENAS[i]; return [c.x + 540, c.y + 960, c.z]; }
function olho(i) { var a = alvo(i); return [a[0], a[1], a[2] - 1500]; }
var olhos = [], alvos = [];
for (var s = 0; s < CENAS.length; s++) { olhos.push("[" + olho(s).join(",") + "]"); alvos.push("[" + alvo(s).join(",") + "]"); }
function exprCam(lista) {
  return "var B=[" + bordas.join(",") + "], P=[" + lista.join(",") + "], A=" + ANTES + ", D=" + DEPOIS + ";" +
    "var i=0; while (i<B.length && time>=B[i]+D) i++;" +
    "if (i>=B.length || time<B[i]-A) P[i]; else { var p=(time-(B[i]-A))/(A+D);" +
    " p = p<0.5 ? 16*p*p*p*p*p : 1-Math.pow(-2*p+2,5)/2;" +
    " var a=P[i], b=P[i+1]; [a[0]+(b[0]-a[0])*p, a[1]+(b[1]-a[1])*p, a[2]+(b[2]-a[2])*p]; }";
}
cP.setValue(olho(0)); cA.setValue(alvo(0));
cP.expression = exprCam(olhos); cA.expression = exprCam(alvos);
vida(camL, 0, FIM);

// a cena que sai apaga na primeira metade do voo
for (var ci2 = 0; ci2 < bordas.length; ci2++) {
  var ls2 = CAMADAS_CENA[ci2] || [], a0 = bordas[ci2] - ANTES;
  for (var li = 0; li < ls2.length; li++) {
    var cam = ls2[li];
    try { if (cam.nullLayer) continue; } catch (e) {}
    tr(cam, "op").expression = "var p=Math.min(1,Math.max(0,(time-" + a0.toFixed(3) + ")/0.3)); value*(1-p*p)";
  }
}
// a ficha apaga antes da logo
var ls12 = CAMADAS_CENA[12] || [];
for (var l12 = 0; l12 < ls12.length; l12++) {
  try { if (ls12[l12].nullLayer) continue; } catch (e) {}
  tr(ls12[l12], "op").expression = "var p=Math.min(1,Math.max(0,(time-57.3)/0.3)); value*(1-p*p)";
}

// borrão de velocidade: zoom radial que cresce no meio do voo
app.run("layer.newAdjustment", { name: "velocidade" });
var vel = comp.layer("velocidade");
var rb = vel.property("ADBE Effect Parade").addProperty("CC Radial Fast Blur");
rb.property(1).setValue([540, 960]);
var am = rb.property(2);
am.setValueAtTime(0, 0);
for (var bi2 = 0; bi2 < bordas.length; bi2++) {
  var bb = bordas[bi2];
  am.setValueAtTime(bb - ANTES, 0); am.setValueAtTime(bb + 0.02, 72); am.setValueAtTime(bb + DEPOIS, 0);
}
suaviza(am, 60);
vida(vel, 0, FIM);

// =============== assinatura: só a V4 Telles & Co ===============
var veu = forma("rect", W1, H1, FUNDO, { nome: "veu" });
K(tr(veu, "op"), [[57.3, 0], [57.6, 100]], 60); vida(veu, 57.3, FIM);
var lg = imagem("imagens/logos/logo-telles-branca.png");
tr(lg, "pos").setValue([540, 960]);
var eL = 760 / 3208 * 100;
K(tr(lg, "esc"), [[57.5, [eL * 0.94, eL * 0.94]], [FIM, [eL * 1.02, eL * 1.02]]], 25);
K(tr(lg, "op"), [[57.5, 0], [57.9, 100], [FIM - 0.3, 100], [FIM, 0]], 60);
borra(lg, [[57.5, 18], [58.0, 0]]);
vida(lg, 57.5, FIM);

// =============== ABERTURA: hook em fundo branco + ponte na cena 1 escura (tempos da voz audio/abertura.wav) ===============
var XC = 12.05, CORTE_ANT = 8.27, D = XC - CORTE_ANT, FIM_C = FIM, FIM_F = FIM + D;
var cenaUm = CENAS[1];
FIM = XC + 0.1;
comp = app.project.items.addComp("Abertura", W1, H1, 1, FIM, FPS);
comp.bgColor = [0.043, 0.027, 0.031]; comp.motionBlur = true; comp.openInViewer();
CENAS = []; CAMADAS_CENA = []; CENA_ATUAL = null; CENA_IDX = -1;
TOFF = CORTE_ANT - XC;   // no corte, as luzes estão onde estariam no Corpo
luz(DEST, 1300, 900, 900, 1950, 30, 0.33, 0);
luz("#7A0D14", 1100, 800, 100, 100, 34, 0.27, 2);
luz("#B3121C", 900, 700, 1050, 380, 14, 0.21, 4);
// cena 1 com o mesmo desenho e a mesma câmera do Corpo, nos tempos novos da ponte
cena(1, cenaUm.x, cenaUm.y, cenaUm.z);
linha([["Um", 6.82], ["evento", 6.96], ["interno", 7.26], ["precisa", 7.76], ["de:", 8.12]], 470, { size: 72, saida: XC - 0.45 });
iconeFlat("palette", 255, 740, 240, 8.30, { giro: -12, fundo: "#2A1416", glifo: CREME });
iconeFlat("presentation", 825, 740, 240, 9.28, { giro: 12, fundo: "#2A1416", glifo: CREME });
var wowA = iconeFlat("confetti", 540, 1180, 300, 10.98, { giro: -16 });
var balA = XC - (CORTE_ANT - (6.96 + 0.6));   // mesma fase do balanço do Corpo no corte
tr(wowA, "rot").expression = "value + (time>" + balA + " ? Math.sin((time-" + balA + ")*2.4)*6 : 0)";
linha([["identidade", 8.30, { style: "Bold" }]], 960, { size: 64, reflow: false }).forEach(function (l) { tr(l, "pos").expression = "value + [-285, 0]"; });
linha([["apresentação", 9.28, { style: "Bold" }]], 960, { size: 64, reflow: false }).forEach(function (l) { tr(l, "pos").expression = "value + [285, 0]"; });
linha([["momento", 10.56, { style: "Bold" }], ["WOW", 10.98, { marca: true, size: 150 }]], 1460, { size: 90 });
CENA_ATUAL = null; CENA_IDX = -1;
app.run("layer.newCamera", { name: "CameraAbertura", type: "twoNode" });
var camA = comp.layer("CameraAbertura");
tr(camA, "pos").setValue([cenaUm.x + 540, cenaUm.y + 960, cenaUm.z - 1500]); tr(camA, "anc").setValue([cenaUm.x + 540, cenaUm.y + 960, cenaUm.z]);
vida(camA, 0, FIM);
// por cima, a abertura branca (2D); o branco sobe voando no fim do hook
var SAI_BRANCO = 6.62;
#include "abertura_branca.jsx"

// =============== FINAL: Abertura até XC e o Corpo a partir do instante 8,27 dele ===============
FIM = FIM_F;
var compCorpo = null, compAb = comp;
for (var it = 1; it <= app.project.numItems; it++) if (app.project.item(it).name === "Corpo do case") compCorpo = app.project.item(it);
comp = app.project.items.addComp("Case NRR Day", W1, H1, 1, FIM_F, FPS);
comp.bgColor = [0.043, 0.027, 0.031]; comp.openInViewer();
var lC = comp.layers.add(compCorpo); lC.startTime = D; lC.inPoint = XC; lC.outPoint = FIM_F;
var lA = comp.layers.add(compAb); lA.startTime = 0; lA.inPoint = 0; lA.outPoint = XC;

// áudio final (voz + trilha + efeitos, mix.py) e a fila de render pronta
var somIt = app.project.importFile(new ImportOptions(new File(PASTA + "audio/mix.wav")));
var som = comp.layers.add(somIt); som.startTime = 0;
var rq = app.project.renderQueue.items.add(comp);
var om = rq.outputModule(1);
try { om.applyTemplate("H.264"); } catch (e) {}
om.file = new File(PASTA + "NRR Day - Case.mp4");
app.project.save(new File(PASTA + "NRR Day - Case.ecproj"));
writeLn("Corpo " + compCorpo.numLayers + " · Abertura " + compAb.numLayers + " · final " + comp.numLayers + " · duração " + FIM_F.toFixed(2) + " · glitches " + GLITCHES.join(","));
