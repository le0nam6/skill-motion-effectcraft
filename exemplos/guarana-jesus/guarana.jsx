// Marketing da Ilha #01 — Guaraná Jesus. Motion 100% no EffectCraft, sem rosto.
// Observação: este exemplo usa o mapa_svg.jsx da primeira versão do gerador (nomes MA_*, MA_CAIXA).
// O ferramentas/gera_mapa.py atual gera os mesmos dados com nomes UF_* (UF_SVG, UF_LINHA_SVG, UF_CAIXA, UF_DET).
// Gramática da referência (fundo escuro com luz suave, uma cor de destaque, ícones flat em círculo,
// palavra com marca-texto e colchetes, cartões 3D com câmera voando) + as regras dele: SF Pro,
// mola contida e ease in-out, ícone dentro da frase, fotos reais em moldura de glossário, logo escrita no fim.
// Câmera 3D de dois nós: cada cena é um nulo 3D num ponto do espaço; a câmera voa entre elas.
// Rodar: effectcraft-cli script "$PWD/guarana.jsx" --empty
#include "base.jsx"
#include "logo_svg.jsx"
#include "icones_svg.jsx"
#include "mapa_svg.jsx"

var OFF = 0.3, FPS = 60;
W1 = 1080; H1 = 1920; FIM = 55.6;
function V(s) { return s + OFF; }
var ROSA = "#EC4F91", ROSA_ESCURO = "#B8306C", CREME = "#F4F1EC", FUNDO = "#0E0D0C";
COR.vermelho = ROSA; // destaque deste episódio é o rosa do Guaraná Jesus

// ficha técnica (preenchida com os números medidos no fim da produção)
// medidos em 15/10/2026: tokens somados do transcript (usage de cada resposta, desde o início do projeto);
// custo = Google (TTS + Lyria ≈ US$ 0,10; Veo 3.1 ≈ US$ 4,40) a R$ 5,05; o Claude roda no plano Max
var FICHA = { tokens: "81 mi lidos · 162 mil escritos", custo: "R$ 23 (APIs do Google)", tempo: "1h40", plano: "plano Max" };

comp = app.project.items.addComp("Guarana", W1, H1, 1, FIM, FPS);
comp.bgColor = [0.055, 0.051, 0.047];
comp.motionBlur = true;
comp.openInViewer();

// ---------- fundo 2D: luz suave nas bordas que respira (como na referência) ----------
function luz(cor, w, h, x, y, op, vel, fase) {
  var l = forma("ellipse", w, h, cor, { nome: "luz" });
  borra(l, [[0, 160]]);
  tr(l, "pos").setValue([x, y]);
  tr(l, "op").setValue(op);
  tr(l, "pos").expression = "value + [Math.sin(time * " + vel + " + " + fase + ") * 120, Math.cos(time * " + vel * 0.8 + " + " + fase + ") * 90]";
  vida(l, 0, FIM);
  return l;
}
luz(ROSA, 1300, 900, 900, 1900, 34, 0.35, 0);
luz("#FF8A3D", 900, 700, 120, 120, 16, 0.28, 2);
luz(ROSA_ESCURO, 1000, 800, 1000, 300, 14, 0.22, 4);

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

// ícone flat: círculo de destaque com o símbolo vetorial escuro dentro
function iconeFlat(nomeIc, x, y, diam, t, o) {
  o = o || {};
  var g = nulo(x, y);
  var bola = forma("ellipse", diam, diam, o.fundo || ROSA, { nome: "bola" });
  bola.parent = g; tr(bola, "pos").setValue([0, 0]);
  var svg = ICONES_SVG[nomeIc].replace('fill="currentColor"', 'fill="' + (o.glifo || "#16110F") + '"');
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
  for (var v = 0; v < 2; v++) {
    K(tr(vis[v], "op"), [[t, 0], [t + 0.1, 100]], 50);
    if (o.sai) { tr(vis[v], "op").setValueAtTime(o.sai, 100); tr(vis[v], "op").setValueAtTime(o.sai + 0.24, 0); }
  }
  var fim = o.sai ? o.sai + 0.35 : (o.fim || FIM);
  vida(g, t, fim); vida(bola, t, fim); vida(gl, t, fim);
  g.camadas = [bola, gl];
  return g;
}

// brilho suave na cor do texto (o destaque da referência é cor + brilho, nunca caixa atrás da palavra)
function brilho(l, raio, forca) {
  var g = l.property("ADBE Effect Parade").addProperty("ADBE Glo2");
  g.property(2).setValue(18); g.property(3).setValue(raio || 38); g.property(4).setValue(forca || 0.9);
  return g;
}
// linha de palavras centralizada, como na referência: cada palavra entra desfocando e a linha se recentraliza
// a cada palavra nova. "@nome" vira ícone flat inline. Por palavra: cor, style, size (mesma linha de base),
// marca (rosa com brilho), conta: [de, para, dur] (contador). o: size, cor, saida, fim, reflow
function linha(ws, y, o) {
  o = o || {};
  var size = o.size || 80, esp = size * 0.26;
  var ls = [], total = 0;
  for (var i = 0; i < ws.length; i++) {
    var c = ws[i][2] || {}, l, sz = c.size || size;
    if (ws[i][0].charAt(0) === "@") { l = { icone: ws[i][0].substr(1), largura: sz * 1.1 }; }
    else {
      l = texto(ws[i][0], { size: sz, cor: c.marca ? ROSA : (c.cor || o.cor || CREME), style: c.marca ? "Bold" : (c.style || o.style || "Regular") });
      if (c.marca) brilho(l, sz * 0.4, 0.8);
    }
    l.sz = sz;
    ls.push(l); total += l.largura + (i ? esp : 0);
  }
  var x0 = (W1 - total) / 2, x = x0;
  // deslocamento da linha enquanto ela ainda não está completa: começa centrada só na 1ª palavra
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
    var yj = y + 0.36 * (size - ls[j].sz); // alinha pela linha de base
    var fim = o.saida ? o.saida + 0.3 + j * 0.02 : o.fim || FIM;
    if (ls[j].icone) {
      var lw = ls[j].largura;
      ls[j] = iconeFlat(ls[j].icone, cx, y - size * 0.02, size * 1.1, t, { sai: o.saida ? o.saida + j * 0.02 : null, fim: o.fim });
      ls[j].largura = lw;
    } else {
      entra(ls[j], t, cx, yj, { dy: o.dy === undefined ? 34 : o.dy, escala: o.escala });
      if (cj.conta) {
        var cc = cj.conta;
        ls[j].property("ADBE Text Properties").property("ADBE Text Document").expression =
          "var p=Math.min(1,Math.max(0,(time-" + (t + 0.05) + ")/" + cc[2] + ")); p=1-Math.pow(1-p,3); '' + Math.round(" + cc[0] + "+(" + (cc[1] - cc[0]) + ")*p)";
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

// colchetes nos cantos de um bloco (como "[problema.]" da referência)
function colchetes(cx, cy, w, h, t, fim) {
  var cantos = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
  for (var i = 0; i < 4; i++) {
    var sx = cantos[i][0], sy = cantos[i][1];
    var hz = forma("rect", 46, 7, ROSA, { nome: "colchete" });
    var vt = forma("rect", 7, 46, ROSA, { nome: "colchete" });
    var px = cx + sx * w / 2, py = cy + sy * h / 2;
    mola(tr(hz, "pos"), t, [px - sx * 60, py], [px - sx * 20, py], { z: 0.6, w: 13 });
    mola(tr(vt, "pos"), t, [px, py - sy * 60], [px, py - sy * 20], { z: 0.6, w: 13 });
    K(tr(hz, "op"), [[t, 0], [t + 0.15, 100]], 50); K(tr(vt, "op"), [[t, 0], [t + 0.15, 100]], 50);
    vida(hz, t, fim); vida(vt, t, fim);
  }
}

// moldura de glossário (referência PrimoCast 24h): janela com cabeçalho colorido e três bolinhas,
// borda preta grossa, cantos retos e uma cópia branca deslocada atrás; legenda numa segunda janela igual
function janela(g, cx, cy, w, h, cab) {
  // cópia deslocada (atrás), depois a janela: borda preta, corpo branco, cabeçalho rosa
  var B = 6, partes = [];
  var somB = forma("rect", w + 2 * B, h + 2 * B, "#111111", { nome: "jSomB" }); somB.parent = g; tr(somB, "pos").setValue([cx + 18, cy + 18]);
  var somW = forma("rect", w, h, "#FFFFFF", { nome: "jSomW" }); somW.parent = g; tr(somW, "pos").setValue([cx + 18, cy + 18]);
  var bor = forma("rect", w + 2 * B, h + 2 * B, "#111111", { nome: "jBorda" }); bor.parent = g; tr(bor, "pos").setValue([cx, cy]);
  var corpo = forma("rect", w, h, "#FFFFFF", { nome: "jCorpo" }); corpo.parent = g; tr(corpo, "pos").setValue([cx, cy]);
  partes.push(somB, somW, bor, corpo);
  if (cab) {
    var barra = forma("rect", w, cab, ROSA, { nome: "jCab" }); barra.parent = g; tr(barra, "pos").setValue([cx, cy - h / 2 + cab / 2]);
    var linhaB = forma("rect", w, B, "#111111", { nome: "jLinha" }); linhaB.parent = g; tr(linhaB, "pos").setValue([cx, cy - h / 2 + cab + B / 2]);
    partes.push(barra, linhaB);
    for (var d = 0; d < 3; d++) {
      var dot = forma("ellipse", cab * 0.32, cab * 0.32, "#FFFFFF", { nome: "jDot" }); dot.parent = g;
      tr(dot, "pos").setValue([cx - w / 2 + cab * 0.55 + d * cab * 0.5, cy - h / 2 + cab / 2]);
      partes.push(dot);
    }
  }
  return partes;
}
function glossario(arq, cx, cy, w, h, t, titulo, verbete, fim) {
  var g = nulo(cx, cy);
  var CAB = 54;
  // janela da foto
  var partes = janela(g, 0, 0, w, h + CAB, CAB);
  var foto = imagem(arq);
  foto.parent = g;
  var it = itens[arq];
  var esc = Math.max(w / it.width, h / it.height) * 100;
  tr(foto, "esc").setValue([esc, esc]); tr(foto, "pos").setValue([0, CAB / 2 + 3]);
  app.run("layer.addMask", { layer: foto.name, shape: "rect", rect: [(it.width - w / esc * 100) / 2, (it.height - h / esc * 100) / 2, w / esc * 100, h / esc * 100] });
  partes.push(foto);
  // janela da legenda (entra um tempo depois, com a mesma mola)
  var g2 = nulo(cx - 40, cy + (h + CAB) / 2 + 150);
  var lw = Math.max(560, w * 0.9), lh = 190;
  var p2 = janela(g2, 0, 0, lw, lh, 30);
  var tt = texto(titulo, { size: 64, style: "Bold", cor: "#111111" });
  tt.parent = g2; tr(tt, "anc").setValue([tr(tt, "anc").value[0] - tt.largura / 2, tr(tt, "anc").value[1]]); tr(tt, "pos").setValue([-lw / 2 + 34, 2]);
  var vb = texto(verbete, { size: 46, style: "Medium", cor: "#111111" });
  vb.parent = g2; tr(vb, "anc").setValue([tr(vb, "anc").value[0] - vb.largura / 2, tr(vb, "anc").value[1]]); tr(vb, "pos").setValue([-lw / 2 + 34, 66]);
  p2.push(tt, vb);
  // entram girando no espaço (3D) e assentam com mola
  mola(tr(g, "pos"), t, [cx + 140, cy + 260, 700], [cx, cy, 0], { z: 0.62, w: 10 });
  mola(g.property("ADBE Transform Group").property("ADBE Rotate Y"), t, -40, -7, { z: 0.6, w: 9 });
  mola(g.property("ADBE Transform Group").property("ADBE Rotate X"), t, 16, 3, { z: 0.6, w: 9 });
  K(tr(g, "op"), [[t, 0], [t + 0.15, 100]], 50);
  var t2 = t + 0.35;
  mola(tr(g2, "pos"), t2, [cx - 340, cy + (h + CAB) / 2 + 150, 300], [cx - 40, cy + (h + CAB) / 2 + 150, -60], { z: 0.6, w: 11 });
  mola(g2.property("ADBE Transform Group").property("ADBE Rotate Z"), t2, -8, -2, { z: 0.5, w: 10 });
  K(tr(g2, "op"), [[t2, 0], [t2 + 0.12, 100]], 50);
  for (var i = 0; i < partes.length; i++) vida(partes[i], t, fim);
  for (var j = 0; j < p2.length; j++) vida(p2[j], t2, fim);
  vida(g, t, fim); vida(g2, t2, fim);
  g.todas = partes.concat(p2);
  return g;
}

// =============== CENA 0 — gancho (0 – 5,55 s) ===============
cena(0, 0, 0, 0);
// ---- mapa de satélite (referência @fatoscomfativa): continente escuro → linhas dos estados → aproxima no Maranhão,
// que acende em rosa com contorno luminoso e glitch. Satélite: NASA Blue Marble; malha: IBGE. Fica atrás do texto.
function h01(n) { var v = Math.sin(n * 12.9898 + 7.13) * 43758.5453; return v - Math.floor(v); }
function glitch(l, a, d, amp, op) {
  var h = "function h(n){var v=Math.sin(n*12.9898+" + (Math.random() * 50).toFixed(2) + ")*43758.5453; return v-Math.floor(v);}";
  tr(l, "pos").expression = h + "var q=(time-" + a.toFixed(3) + ")/" + d + "; if (q<0||q>1) value; else { var k=Math.floor(time*24); var f=1-q; value+[(h(k)-0.5)*" + amp + "*f, (h(k+7)-0.5)*" + (amp * 0.25) + "*f]; }";
  if (op) tr(l, "op").expression = h + "var q=(time-" + a.toFixed(3) + ")/" + d + "; if (q<0) 0; else if (q>1) value; else (h(Math.floor(time*24)+3) > 0.35*(1-q) ? value : 0)";
}
var tM0 = 0.30, tM1 = V(2.30), tMA = V(1.98), fimMapa = V(2.49);
var mapaN = nulo(540, 960);
// três paradas como na referência: continente → o Brasil inteiro (segura) → mergulha no Maranhão
var PAR = [[0.30, 1320, 2040, 960, 33], [1.05, 1740, 1640, 1000, 46], [1.75, 1760, 1620, 1000, 49], [V(2.30), (MA_CAIXA[0] + MA_CAIXA[1]) / 2, (MA_CAIXA[2] + MA_CAIXA[3]) / 2, 1500, 132]];
var parS = "var P=[" + PAR.map(function (q) { return "[" + q.join(",") + "]"; }).join(",") + "]; var i=0; while (i<P.length-2 && time>P[i+1][0]) i++;" +
  "var a=P[i], b=P[i+1], p=Math.min(1,Math.max(0,(time-a[0])/(b[0]-a[0]))); p = p<0.5 ? 4*p*p*p : 1-Math.pow(-2*p+2,3)/2;";
tr(mapaN, "anc").expression = parS + "[a[1]+(b[1]-a[1])*p, a[2]+(b[2]-a[2])*p, 0]";
tr(mapaN, "pos").expression = parS + "[540, a[3]+(b[3]-a[3])*p, value[2]]";
tr(mapaN, "esc").expression = parS + "var k=a[4]*Math.pow(b[4]/a[4], p); [k*0.97, k, 100]"; // ×0,97: cos da latitude
function noMapa(l, ax, ay, esc) { l.parent = mapaN; tr(l, "anc").setValue([0, 0]); tr(l, "pos").setValue([ax, ay]); if (esc) tr(l, "esc").setValue([esc, esc]); l.motionBlur = false; vida(l, tM0, fimMapa + 0.3); return l; }
function svgMapa(svg, nm) { var n = nome(nm); app.run("edit.pasteSvg", { svg: svg, name: n }); return noMapa(prender(comp.layer(n)), 0, 0); }
// fundo opaco atrás do satélite: as luzes do fundo não marcam a borda da imagem
var fundoMapa = forma("rect", 1200, 2100, "#0E0D0C", { nome: "fundoMapa" });
tr(fundoMapa, "pos").setValue([540, 960]);
K(tr(fundoMapa, "op"), [[tM0, 0], [tM0 + 0.3, 100], [fimMapa, 100], [fimMapa + 0.28, 0]], 60);
vida(fundoMapa, tM0, fimMapa + 0.3);
var satB = noMapa(imagem("sat_base.jpg"), 0, 0, 100);
var satD = noMapa(imagem("sat_ma.jpg"), (82 - 49.5) * 60, (13 - 1) * 60, 50);
var brF = svgMapa(BRASIL_SVG, "brasilTinta");
var brL = svgMapa(LINHAS_SVG, "estados");
var maF = svgMapa(MA_SVG, "maFill");
var maC = svgMapa(MA_SVG.replace("#EC4F91", "#29E3E8"), "maCiano");
var maL = svgMapa(MA_LINHA_SVG, "maLinha");
K(tr(satB, "op"), [[tM0, 0], [tM0 + 0.35, 100]], 60);
K(tr(satD, "op"), [[V(1.75), 0], [V(2.2), 100]], 60);
K(tr(brF, "op"), [[V(0.75), 0], [V(1.2), 14], [tMA, 14], [tMA + 0.3, 6]], 60);
K(tr(brL, "op"), [[V(0.6), 0], [V(1.0), 62], [tMA, 62], [tMA + 0.3, 40]], 60);
// o Maranhão acende: preenchimento rosa translúcido + contorno com brilho; entra com glitch e separação ciano
K(tr(maF, "op"), [[tMA, 0], [tMA + 0.05, 42], [tMA + 0.6, 34]], 50);
glitch(maF, tMA, 0.36, 60, true);
K(tr(maL, "op"), [[tMA, 0], [tMA + 0.05, 100]], 50);
glitch(maL, tMA, 0.36, 60, true);
var gMA = brilho(maL, 26, 1.4);
tr(maC, "pos").expression = "var q=(time-" + tMA.toFixed(3) + ")/0.36; q<0||q>1 ? value : value+[-18*(1-q), 0]";
K(tr(maC, "op"), [[tMA - 0.02, 0], [tMA, 70], [tMA + 0.36, 0]], 40);
var lsMapa = [satB, satD, brF, brL, maF, maC, maL];
// saída do mapa junto com as frases do gancho: apaga rápido
for (var mi = 0; mi < lsMapa.length; mi++) { var o = tr(lsMapa[mi], "op"); o.setValueAtTime(fimMapa, o.valueAtTime(fimMapa, false)); o.setValueAtTime(fimMapa + 0.28, 0); }
// vinheta escura em cima e embaixo para o texto ler sobre o satélite
var vinheta = forma("rect", 1080, 1920, "#0E0D0C", { nome: "vinhetaMapa" });
tr(vinheta, "pos").setValue([540, 960]);
tr(vinheta, "op").setValue(0);
K(tr(vinheta, "op"), [[tM0, 0], [tM0 + 0.3, 28], [fimMapa, 28], [fimMapa + 0.28, 0]], 60);
vida(vinheta, tM0, fimMapa + 0.3);

var coca = nome("coca");
app.run("edit.pasteSvg", { svg: COCA_SVG.replace(/#F40009/gi, "#FFFFFF"), name: coca }); // branca e maior (pedido dele)
var cocaL = prender(comp.layer(coca));
tr(cocaL, "anc").setValue([12, 12]); tr(cocaL, "pos").setValue([540, 520]);
pop(cocaL, V(0.21), 2600, { giro: -10 });
K(tr(cocaL, "op"), [[V(0.21), 0], [V(0.3), 100], [V(2.5), 100], [V(2.8), 0]], 50);
vida(cocaL, V(0.15), V(2.9));
linha([["A", 0.01], ["Coca-Cola", 0.21, { style: "Bold" }], ["comprou", 0.60]], 820, { size: 78, saida: V(2.45) });
linha([["um", 1.02], ["refrigerante", 1.14], ["do", 1.86]], 930, { size: 78, saida: V(2.47) });
linha([["Maranhão", 1.98, { marca: true }]], 1080, { size: 120, saida: V(2.49) });


linha([["e", 2.60], ["não", 2.61], ["teve", 2.90], ["coragem", 3.29]], 640, { size: 80, fim: V(6.2) });
linha([["de", 4.00], ["mudar", 4.17], ["a", 4.61]], 760, { size: 80, fim: V(6.2) });
// a disputa: um disco vermelho tenta cobrir, o rosa vence
var discoV = forma("ellipse", 520, 520, "#F40009", { nome: "discoV" });
mola(tr(discoV, "esc"), V(4.10), [0, 0], [100, 100], { z: 0.55, w: 12 });
tr(discoV, "pos").setValue([540, 1180]);
K(tr(discoV, "op"), [[V(4.1), 0], [V(4.2), 100]], 50);
vida(discoV, V(4.1), V(4.9));
var discoR = forma("ellipse", 560, 560, ROSA, { nome: "discoR" });
tr(discoR, "pos").setValue([540, 1180]);
mola(tr(discoR, "esc"), V(4.62), [0, 0], [100, 100], { z: 0.42, w: 14 });
vida(discoR, V(4.6), V(6.2));
linha([["cor", 4.69, { style: "Bold", cor: "#16110F" }]], 1225, { size: 200, escala: 125, fim: V(6.2) });
linha([["dele.", 4.78]], 1520, { size: 80, fim: V(6.2) });

// =============== CENA 1 — glossário + 99 anos (5,55 – 10,55 s) ===============
cena(1, 1700, -500, -3200);
// "O Guaraná Jesus nasceu numa farmácia de São Luís": o verbete com a foto real
var glo = glossario("farmacia-1959.jpg", 560, 640, 800, 450, V(5.5), "Farmácia Sanitária", "Onde nasceu o Guaraná Jesus", V(8.55));
// crédito da foto, discreto, colado na janela
var cred = texto("Foto: Arquivo Central do Iphan, 1959", { size: 22, style: "Medium", cor: "#8C857B", tracking: 0 });
tr(cred, "pos").setValue([560, 640 + 252 + 300]); K(tr(cred, "op"), [[V(6.0), 0], [V(6.3), 100]], 60); vida(cred, V(6.0), V(8.55));
glo.todas.push(cred);
linha([["@pill", 6.95], ["farmácia", 6.97], ["@map-pin", 7.65], ["São", 7.67, { style: "Bold" }], ["Luís", 7.97, { style: "Bold" }]], 1360, { size: 60, saida: V(8.05) });
// o verbete sai como bloco: encolhe um pouco e apaga (acelerando); sem chave de posição (a curva espacial escaparia)
var ge = tr(glo, "esc");
ge.setValueAtTime(V(7.95), [100, 100, 100]); ge.setValueAtTime(V(8.25), [88, 88, 88]);
try { ge.setTemporalEaseAtKey(ge.numKeys - 1, [new KeyframeEase(0, 70)], [new KeyframeEase(0, 70)]); ge.setTemporalEaseAtKey(ge.numKeys, [new KeyframeEase(0, 20)], [new KeyframeEase(0, 20)]); } catch (e) {}
glo.apagar = V(7.95);
// "e, em março, fez noventa e nove anos": a frase literal, com o 99 contando
linha([["@calendar-star", 8.26], ["Em", 8.30], ["março,", 8.42, { style: "Bold" }]], 800, { size: 84, fim: V(10.9) });
var anos = linha([["fez", 8.87], ["99", 9.06, { marca: true, size: 300, conta: [10, 99, 0.9] }], ["anos.", 9.12, { style: "Bold", size: 150 }]], 1120, { size: 110, fim: V(10.9) });

// =============== CENA 2 — campanha genérica × a sua cor (10,55 – 16,95 s) ===============
cena(2, -300, -1100, -6400);
linha([["Mas", 10.40], ["pra", 10.61], ["comemorar,", 10.81]], 700, { size: 76, saida: V(13.2) });
linha([["eles", 11.41], ["não", 11.62], ["fizeram", 11.79], ["uma", 12.18]], 810, { size: 76, saida: V(13.22) });
var gen = linha([["@megaphone-simple", 12.30], ["campanha", 12.35], ["genérica.", 12.79]], 960, { size: 92, saida: V(13.24) });
// risco no meio das letras de "campanha genérica." (altura do x), do começo ao fim das duas palavras, acompanhando a recentralização
var rx0 = gen[1].cx - gen[1].largura / 2 - 16, rx1 = gen[2].cx + gen[2].largura / 2 + 16, ry = 960 + 0.09 * 92 * 0.86;
var riscoG = forma("rect", rx1 - rx0, 9, ROSA, { nome: "riscoG" });
tr(riscoG, "anc").setValue([-(rx1 - rx0) / 2, 0]);
tr(riscoG, "pos").setValue([rx0, ry]);
tr(riscoG, "pos").expression = tr(gen[2], "pos").expression;
mola(tr(riscoG, "esc"), V(13.0), [0, 100], [100, 100], { z: 0.85, w: 16 });
K(tr(riscoG, "op"), [[V(13.24), 100], [V(13.5), 0]], 60); vida(riscoG, V(13.0), V(13.7));
linha([["Eles", 13.48], ["celebraram", 13.80]], 720, { size: 80, fim: V(17.9) });
linha([["uma", 14.39], ["coisa", 14.58], ["muito", 14.90], ["única:", 15.23]], 830, { size: 80, fim: V(17.9) });
linha([["a", 15.71], ["sua", 15.83], ["cor.", 16.17, { marca: true }]], 1060, { size: 180, fim: V(17.9) });
iconeFlat("palette", 540, 1380, 170, V(16.25), { fim: V(17.9), giro: -16 });
// "a sua cor.": guaraná rosa de verdade (Veo 3.1) sobe e engole a cena; o texto some sob o líquido.
// A superfície do clipe foi medida quadro a quadro (A); a camada desce/estica para a superfície cair na curva S.
var LT0 = 16.70, LT1 = 17.40, KV = 5;
// em 2D (fora da câmera): a máscara de trilha não casa com camadas 3D; apagam com a cena pela lista dela
var cenaGuardada = CENA_ATUAL; CENA_ATUAL = null;
var liq = imagem("liquido.mp4");
liq.startTime = LT0; liq.stretch = 100 / KV; // tempo do clipe = (time - LT0) * KV
tr(liq, "anc").setValue([540, 1920]);
var curva = "var p=Math.min(1,Math.max(0,(time-" + LT0 + ")/" + (LT1 - LT0) + ")); p = p<0.5 ? 4*p*p*p : 1-Math.pow(-2*p+2,3)/2; var S=1.03-1.10*p;" +
  "var A=[0.681,0.669,0.656,0.644,0.631,0.625,0.613,0.600,0.588,0.581,0.569,0.556,0.550,0.537,0.525,0.519,0.506,0.494,0.487,0.475,0.463,0.450,0.438,0.425,0.419,0.406,0.394,0.381,0.375,0.362,0.350,0.338,0.325,0.319,0.306,0.300,0.287,0.275,0.269,0.256,0.250,0.237,0.231,0.225,0.212,0.206,0.200,0.194,0.188,0.181,0.175,0.169,0.163,0.156,0.150,0.150,0.144,0.144,0.138,0.131,0.131,0.131,0.131,0.125,0.125,0.119,0.119,0.119,0.119,0.113,0.113,0.113,0.113,0.113,0.106,0.106,0.106,0.106,0.106,0.106,0.106,0.106,0.106,0.106,0.106,0.100,0.100,0.100,0.100,0.100,0.100,0.100,0.100,0.100,0.100,0.100], i=Math.min(A.length-1,Math.max(0,Math.floor((time-" + LT0 + ")*" + KV + "*12))), C=A[i];";
tr(liq, "pos").expression = curva + "S>=C ? [540, 1920+(S-C)*1920] : [540, 1920]";
tr(liq, "esc").expression = curva + "var k = S>=C ? 100 : 100*(1-S)/(1-C); [k, k]";
vida(liq, LT0, V(17.9));
// máscara: só o que está abaixo da superfície aparece (o preto acima do líquido não cobre o texto)
var mat = forma("rect", 1400, 2400, "#FFFFFF", { nome: "matteLiq" });
tr(mat, "anc").setValue([0, -1200]);
tr(mat, "pos").expression = curva + "[540, S*1920 - 4]";
vida(mat, LT0, V(17.9));
app.run("layer.setTrackMatte", { layer: liq.name, matte: mat.name, kind: "alpha" });
CENA_ATUAL = cenaGuardada; CAMADAS_CENA[2].push(liq, mat);

// =============== CENA 3 — 12 painéis com as fotos reais, um sai em 3D (16,95 – 22 s) ===============
cena(3, 1500, -1600, -9600);
var fotosP = ["tango-2.jpg", "maximize-1.jpg", "painel-ondebeber.jpg", "maximize-2.jpg"];
var paineis = [];
for (var pi = 0; pi < 12; pi++) {
  var col = pi % 3, lin = Math.floor(pi / 3);
  var px = 540 + (col - 1) * 330, py = 930 + (lin - 1.5) * 222;
  var g = nulo(px, py);
  var moldura = forma("rect", 304, 196, CREME, { raio: 18, nome: "moldura" });
  moldura.parent = g; tr(moldura, "pos").setValue([0, 0]);
  var arq = fotosP[pi % 4], f = imagem(arq), it = itens[arq];
  f.parent = g;
  var esc = Math.max(292 / it.width, 184 / it.height) * 100;
  tr(f, "esc").setValue([esc, esc]); tr(f, "pos").setValue([0, 0]);
  app.run("layer.addMask", { layer: f.name, shape: "rect", rect: [(it.width - 292 / esc * 100) / 2, (it.height - 184 / esc * 100) / 2, 292 / esc * 100, 184 / esc * 100] });
  var t0 = V(17.49) + pi * 0.075;
  mola(tr(g, "pos"), t0, [px, py, 900], [px, py, (Math.abs(col - 1) * 120)], { z: 0.6, w: 11 });
  g.property("ADBE Transform Group").property("ADBE Rotate Y").setValue((col - 1) * 14);
  K(tr(g, "op"), [[t0, 0], [t0 + 0.12, 100]], 50);
  vida(g, t0, V(22.4)); vida(moldura, t0, V(22.4)); vida(f, t0, V(22.4));
  paineis.push({ g: g, x: px, y: py, col: col });
}
// o painel do meio vem para frente em 3D no "3D"
var p3 = paineis[7];
var r3 = p3.g.property("ADBE Transform Group").property("ADBE Rotate Y");
mola(tr(p3.g, "pos"), V(19.5), [p3.x, p3.y, 0], [540, 930, -520], { z: 0.55, w: 10 });
mola(r3, V(19.5), 0, -18, { z: 0.5, w: 9 });
iconeFlat("cube", 880, 560, 130, V(19.55), { fim: V(22.4), giro: 20 });
var titulo12 = texto("00", { size: 170, style: "Bold", cor: ROSA });
titulo12.property("ADBE Text Properties").property("ADBE Text Document").expression = 'var p = Math.min(1, Math.max(0, (time - ' + V(17.49) + ') / 0.9)); "" + Math.round(12 * p)';
entra(titulo12, V(17.4), 290, 400, { dy: 40 }); vida(titulo12, V(17.4), V(22.4));
linha([["painéis", 17.79], ["de", 18.33], ["LED", 18.48, { style: "Bold" }]], 330, { size: 64, fim: V(22.4) }).forEach(function (l) { tr(l, "pos").expression = "value + [110, 70]"; });
linha([["pintando", 19.85], ["São", 20.47], ["Luís", 20.70], ["de", 21.00], ["rosa.", 21.15, { marca: true }]], 1560, { size: 78, fim: V(22.4) });

// =============== CENA 4 — ativo distintivo e as três cores (22 – 29,1 s) ===============
cena(4, -200, -2300, -12800);
iconeFlat("fingerprint", 540, 520, 150, V(22.9), { sai: V(24.3), giro: -16 });
linha([["Isso", 21.88], ["tem", 22.22], ["nome:", 22.47]], 720, { size: 74, saida: V(24.35) });
var ad = linha([["ativo", 22.98, { style: "Bold" }], ["distintivo", 23.40, { style: "Bold", cor: ROSA }]], 880, { size: 118, saida: V(24.37) });
colchetes(540, 845, ad[1].cx + ad[1].largura / 2 - (ad[0].cx - ad[0].largura / 2) + 90, 190, V(23.5), V(24.8));
var cores = [["#0ABAB5", "Tiffany", 24.75, 200], ["#820AD1", "Nubank", 25.85, 540], [ROSA, "Guaraná Jesus", 27.22, 880]];
for (var ci = 0; ci < 3; ci++) {
  var cc = cores[ci], tc = V(cc[2]);
  var dsc = forma("ellipse", 250, 250, cc[0], { nome: "cor" });
  tr(dsc, "pos").setValue([cc[3], 980]);
  pop(dsc, tc, 100);
  K(tr(dsc, "op"), [[tc, 0], [tc + 0.1, 100]], 50);
  var lb = texto(cc[1], { size: 46, style: ci === 2 ? "Bold" : "Medium", cor: ci === 2 ? ROSA : "#A8A19A" });
  entra(lb, tc + 0.08, cc[3], 1190, { dy: 30 });
  if (ci < 2) { K(tr(dsc, "op"), [[V(27.7), 100], [V(28.1), 35]], 60); K(tr(lb, "op"), [[V(27.7), 100], [V(28.1), 35]], 60); }
  else mola(tr(dsc, "esc"), V(27.76), [100, 100], [128, 128], { z: 0.45, w: 13 });
  vida(dsc, tc, V(29.5)); vida(lb, tc, V(29.5));
}
linha([["o", 24.68], ["azul,", 24.75], ["o", 25.85], ["roxo…", 25.85], ["e", 27.15], ["o", 27.15], ["rosa.", 27.22, { style: "Bold", cor: ROSA }]], 720, { size: 70, fim: V(29.5) });

// =============== CENA 5 — parar de pagar para ser lembrado (29,1 – 33,1 s) ===============
cena(5, 1300, -3200, -16000);
linha([["Quando", 28.99], ["a", 29.22], ["cor", 29.33, { style: "Bold", cor: ROSA }], ["sozinha", 29.51]], 760, { size: 80, fim: V(33.5) });
linha([["diz", 30.01], ["quem", 30.23], ["você", 30.53], ["é,", 30.81]], 870, { size: 80, fim: V(33.5) });
var pg = linha([["você", 31.08], ["para", 31.25], ["de", 31.44], ["pagar", 31.56, { style: "Bold" }], ["@money", 31.62]], 1060, { size: 86, fim: V(33.5) });
var corte = forma("rect", 150, 10, "#16110F", { nome: "corte" });
tr(corte, "pos").setValue([pg[4].cx, 1060 - 86 * 0.3]); tr(corte, "rot").setValue(-40);
mola(tr(corte, "esc"), V(31.85), [0, 100], [100, 100], { z: 0.8, w: 16 }); vida(corte, V(31.85), V(33.5));
linha([["pra", 31.86], ["ser", 32.10], ["lembrado.", 32.29, { marca: true }]], 1200, { size: 96, fim: V(33.5) });

// =============== CENA 6 — tire o nome do seu negócio (33,1 – 38,1 s) ===============
cena(6, 0, -4100, -19200);
linha([["Agora", 32.98], ["pensa", 33.53], ["no", 33.89]], 640, { size: 80, fim: V(38.5) });
linha([["seu", 34.04, { style: "Bold" }], ["negócio:", 34.29, { style: "Bold", cor: ROSA }]], 760, { size: 96, fim: V(38.5) });
var ct = V(34.2);
var card = forma("rect", 720, 300, "#1B1917", { raio: 40, nome: "cardNeg" });
tr(card, "pos").setValue([540, 1080]); pop(card, ct, 100); vida(card, ct, V(38.5));
iconeFlat("storefront", 300, 1080, 150, ct + 0.1, { fim: V(38.5), giro: -10 });
var nomeNeg = texto("SUA MARCA", { size: 72, style: "Bold", cor: CREME });
tr(nomeNeg, "anc").setValue([tr(nomeNeg, "anc").value[0] - nomeNeg.largura / 2, tr(nomeNeg, "anc").value[1]]);
entra(nomeNeg, ct + 0.2, 410, 1080, { dy: 30 });
// "se eu tirar o seu nome": o nome some da direita para a esquerda
K(tr(nomeNeg, "esc"), [[V(35.4), [100, 100]], [V(35.95), [0, 100]]], 70);
vida(nomeNeg, ct + 0.2, V(36.0));
var interroga = texto("?", { size: 260, style: "Bold", cor: ROSA });
entra(interroga, V(36.95), 600, 1150, { dy: 50, escala: 150 }); vida(interroga, V(36.9), V(38.5));
linha([["o", 36.37], ["que", 36.38], ["ainda", 36.58], ["te", 36.92], ["identifica?", 37.05, { style: "Bold" }]], 1430, { size: 70, fim: V(38.5) });

// =============== CENA 7 — canal e chamada (38,1 – 47 s) ===============
cena(7, 1400, -4900, -22400);
var yt = imagem("youtube-icon.png");
tr(yt, "pos").setValue([540, 500]); pop(yt, V(38.74), 34, { giro: -10 });
K(tr(yt, "op"), [[V(38.74), 0], [V(38.84), 100]], 50); vida(yt, V(38.7), V(47.4));
linha([["No", 38.02], ["meu", 38.23], ["canal", 38.34], ["do", 38.62], ["YouTube", 38.74, { style: "Bold" }]], 720, { size: 72, saida: V(41.25) });
linha([["eu", 39.16], ["explico", 39.33], ["como", 39.72], ["construir", 39.94]], 830, { size: 72, saida: V(41.27) });
linha([["um", 40.60], ["ativo", 40.63, { style: "Bold", cor: ROSA }], ["desses,", 40.90, { style: "Bold", cor: ROSA }]], 950, { size: 88, saida: V(41.29) });
linha([["e", 41.41], ["como", 41.53], ["fazer", 41.69], ["isso", 41.97]], 760, { size: 80, saida: V(43.15) });
linha([["na", 42.20], ["era", 42.35], ["da", 42.58], ["IA.", 42.77, { marca: true }], ["@sparkle", 42.85]], 900, { size: 110, saida: V(43.17) });
// botão de inscrever (vermelho do YouTube) e a pílula da palavra-chave com contorno tracejado que pulsa
var bi = forma("rect", 460, 110, "#FF0033", { raio: 55, nome: "inscrever" });
tr(bi, "pos").setValue([540, 780]); pop(bi, V(43.47), 100); vida(bi, V(43.4), V(47.4));
var biT = texto("Inscrever-se", { size: 50, style: "Bold", cor: "#FFFFFF" });
tr(biT, "pos").setValue([540, 780]); pop(biT, V(43.5), 100); vida(biT, V(43.4), V(47.4));
var cm = linha([["Comenta", 44.57]], 1000, { size: 70, fim: V(47.4) });
var pl = forma("rect", 640, 150, ROSA, { raio: 75, nome: "pilula" });
tr(pl, "pos").setValue([540, 1170]);
var aro = forma("rect", 690, 200, ROSA, { raio: 100, nome: "aro", stroke: ROSA, strokeWidth: 4 });
tr(aro, "pos").setValue([540, 1170]);
var plT = texto("YOUTUBE", { size: 92, style: "Bold", cor: "#16110F", tracking: 60 });
tr(plT, "pos").setValue([540, 1170]);
var tp = V(45.04);
pop(pl, tp, 100); pop(plT, tp + 0.04, 100); pop(aro, tp + 0.1, 100);
tr(aro, "esc").expression = "var d = time - " + (tp + 0.6) + "; d > 0 ? value + [1, 1] * (Math.sin(d * 6) * 3) : value";
tr(pl, "esc").expression = "var d = time - " + (tp + 0.6) + "; d > 0 ? value + [1, 1] * (Math.max(0, Math.sin(d * 6)) * 3) : value";
vida(pl, tp, V(47.4)); vida(aro, tp, V(47.4)); vida(plT, tp, V(47.4));
linha([["que", 45.49], ["eu", 45.87], ["te", 45.91], ["mando", 46.01], ["o", 46.27], ["link.", 46.32, { style: "Bold" }], ["@link", 46.4]], 1380, { size: 62, fim: V(47.4) });

// =============== CENA 8 — ficha técnica (47 – 51,2 s) ===============
cena(8, -100, -5800, -25600);
var tf = 47.2;
var fundoF = forma("rect", 960, 1160, "#181614", { raio: 44, nome: "ficha" });
tr(fundoF, "pos").setValue([540, 1010]); pop(fundoF, tf, 100); vida(fundoF, tf, 51.6);
var cab = texto("FICHA TÉCNICA", { size: 30, style: "Bold", cor: ROSA, tracking: 300 });
entra(cab, tf + 0.1, 540, 560, { dy: 20 }); vida(cab, tf, 51.6);
var cab2 = texto("Feito 100% com IA", { size: 74, style: "Bold", cor: CREME });
entra(cab2, tf + 0.18, 540, 650, { dy: 30 }); vida(cab2, tf, 51.6);
var rows = [
  ["sparkle", "Roteiro, motion e edição", "Claude Opus 5.5"],
  ["cpu", "Motion design", "EffectCraft (open source)"],
  ["megaphone-simple", "Narração", "Gemini 3.8 TTS"],
  ["play", "Trilha", "Lyria 3.5"],
  ["clock", "Tokens do Claude", FICHA.tokens],
  ["coins", "Custo de API", FICHA.custo],
  ["calendar-star", "Tempo de produção", FICHA.tempo],
];
for (var ri = 0; ri < rows.length; ri++) {
  var ry = 790 + ri * 112, trr = tf + 0.3 + ri * 0.09;
  iconeFlat(rows[ri][0], 175, ry - 20, 84, trr, { fim: 51.6, giro: 0 });
  var lb2 = texto(rows[ri][1], { size: 38, style: "Medium", cor: "#A8A19A" });
  tr(lb2, "anc").setValue([tr(lb2, "anc").value[0] - lb2.largura / 2, tr(lb2, "anc").value[1]]);
  entra(lb2, trr, 240, ry - 34, { dy: 16 }); vida(lb2, trr, 51.6);
  var vl = texto(rows[ri][2], { size: 48, style: "Bold", cor: ri >= 4 ? ROSA : CREME });
  tr(vl, "anc").setValue([tr(vl, "anc").value[0] - vl.largura / 2, tr(vl, "anc").value[1]]);
  entra(vl, trr + 0.04, 240, ry + 16, { dy: 16 }); vida(vl, trr, 51.6);
}

// =============== CÂMERA 3D: parada em cada cena; só voa na troca (0,6 s), com borrão de velocidade ===============
CENA_ATUAL = null; CENA_IDX = -1;
app.run("layer.newCamera", { name: "Camera", type: "twoNode" });
var camL = comp.layer("Camera");
var cP = tr(camL, "pos"), cA = tr(camL, "anc");
// trocas no início da 1ª palavra de cada cena (tempo do vídeo)
var bordas = [V(5.36), V(10.40), V(17.38), V(21.88), V(28.99), V(32.98), V(38.02), 47.15];
var ANTES = 0.25, DEPOIS = 0.35;
function alvo(i) { var c = CENAS[i]; return [c.x + 540, c.y + 960, c.z]; }
function olho(i) { var a = alvo(i); return [a[0], a[1], a[2] - 1500]; }
// sem chaves: com chaves, a curva espacial automática fazia a câmera passear durante a "parada".
// Expressão: parada exata em cada cena e voo com ease in-out quíntico entre (borda - ANTES) e (borda + DEPOIS)
var olhos = [], alvos = [];
for (var s = 0; s < 9; s++) { olhos.push("[" + olho(s).join(",") + "]"); alvos.push("[" + alvo(s).join(",") + "]"); }
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

// a cena que sai apaga na primeira metade do voo (como a referência: some em ~0,3 s enquanto borra)
for (var ci2 = 0; ci2 < 8; ci2++) {
  var ls2 = CAMADAS_CENA[ci2] || [], a0 = bordas[ci2] - ANTES;
  for (var li = 0; li < ls2.length; li++) {
    var cam = ls2[li];
    try { if (cam.nullLayer) continue; } catch (e) {}
    tr(cam, "op").expression = "var p=Math.min(1,Math.max(0,(time-" + a0.toFixed(3) + ")/0.3)); value*(1-p*p)";
  }
}
// o verbete do glossário sai antes, dentro da cena
for (var gi = 0; gi < glo.todas.length; gi++)
  tr(glo.todas[gi], "op").expression = "var p=Math.min(1,Math.max(0,(time-" + V(7.95).toFixed(3) + ")/0.28)); value*(1-p*p)";

// borrão de velocidade: camada de ajuste com zoom radial que cresce no meio do voo
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

// =============== LOGO escrita à mão no fim (2D, sobre tudo) ===============
CENA_ATUAL = null;
var veu = forma("rect", W1, H1, FUNDO, { nome: "veu" });
K(tr(veu, "op"), [[51.2, 0], [51.6, 100]], 60); vida(veu, 51.2, FIM);
vinhetaLogo(51.7, W1 / 2, 940, 820);

app.project.save(new File("~/Developer/artcraft/marketing-da-ilha/guarana.ecproj"));
writeLn("camadas " + comp.numLayers);
