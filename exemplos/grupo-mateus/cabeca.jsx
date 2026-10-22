// Marketing da Ilha #02 — Grupo Mateus. Motion 100% no EffectCraft, sem rosto.
// Gramática da referência (fundo escuro com luz suave, uma cor de destaque, ícones flat em círculo,
// palavra com marca-texto e colchetes, cartões 3D com câmera voando) + as regras dele: SF Pro,
// mola contida e ease in-out, ícone dentro da frase, fotos reais em moldura de glossário, logo escrita no fim.
// Câmera 3D de dois nós: cada cena é um nulo 3D num ponto do espaço; a câmera voa entre elas.
// Rodar: effectcraft-cli script "$PWD/mateus.jsx" --empty
#include "base.jsx"
#include "logo_svg.jsx"
#include "icones_svg.jsx"
#include "logo_mateus.jsx"
#include "linhas_svg.jsx"


var OFF = 0.3, FPS = 60;
W1 = 1080; H1 = 1920; FIM = 83.0;
function V(s) { return s + OFF; }
var ROSA = "#38A8E8", ROSA_ESCURO = "#1B6FA8", CREME = "#F4F1EC", FUNDO = "#0E0D0C", VERMELHO_M = "#E1251B";
COR.vermelho = ROSA; // destaque deste episódio é o azul do Mateus (o "ROSA" é só o nome da variável herdada)

// ficha técnica (preenchida com os números medidos no fim da produção)
// medidos em 15/10/2026 (21h45 → 23h10): tokens do transcript; sessão = 9 pontos da janela de 5 h no Max 5x (×5 = Pro);
// custo = Google (TTS + Lyria ≈ US$ 0,13; Veo 3.1 8 s ≈ US$ 3,20; Gemini 3 Pro Image ≈ US$ 0,13) a R$ 5,05
var FICHA = { tokens: "67 mi lidos · 111 mil escritos", custo: "R$ 17 (APIs do Google)", tempo: "1h25", sessao: "~45% de uma sessão" };

comp = app.project.items.addComp("Mateus", W1, H1, 1, FIM, FPS);
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
luz(ROSA, 1300, 900, 900, 1900, 30, 0.35, 0);
luz(VERMELHO_M, 900, 700, 120, 120, 14, 0.28, 2);
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
