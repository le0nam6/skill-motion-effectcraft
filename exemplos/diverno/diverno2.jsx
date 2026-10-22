// Marketing da Ilha #03, Diverno (v2, 17/10/2026): refeito no motor da abertura do case do NRR Day (referência Neto Editor).
// Pedido dele: gancho mais forte que enaltece a marca ("Se eu tivesse uma gelateria, eu copiaria tudo que a Diverno faz"),
// telas alternando tema claro e escuro nas cores da marca (vinho e dourado), fotos em alta do Instagram da Diverno
// (sem print com botão de play) recortadas no rosto. Voz: audio/voz_f.wav (pausas encurtadas e 5% mais rápida), tempos em audio/palavras_voz_f.json.
// v3 (18/10): Matilda corrigido (o gelato em todas as lojas; o Dilícias só na Karolícias Sede), tela da La Mia Dolce Vita,
// resultado do co-branding com três ícones e setas subindo (pedido dele). Chef fora ("irrelevante"); no lugar, os 10 anos.
// Cada tela: o fundo sobe por baixo cobrindo a anterior; o conteúdo da anterior sai voando para cima; zoom lento o tempo todo.
// Palavra comum entra cinza e escurece; destaque pisca (glitch simples) na cor da marca. Fotos em cartão arredondado.
// Rodar: effectcraft-cli script "$PWD/diverno2.jsx" --empty
#include "base.jsx"
#include "icones_v2.jsx"
#include "logo_svg.jsx"

PASTA = "~/Developer/artcraft/diverno/";
W1 = 1080; H1 = 1920; FIM = 84.0;
function V(s) { return s; }
var TEMA = {
  claro: { fundo: "#FBF7F2", grade: "v2/grade-clara.png", gradeOp: 100, luz: "#8E1B2B", luzOp: 7, tinta: "#2A1216", cinza: "#CDBFC1", marca: "#8E1B2B", cartaoBorda: "#FFFFFF", sombra: 22, tag: "#8E1B2B", tagTexto: "#FFFFFF", logo: "v2/logo-vinho.png" },
  escuro: { fundo: "#2A0B11", grade: "v2/grade-escura.png", gradeOp: 45, luz: "#E8B54A", luzOp: 10, tinta: "#F6EFE6", cinza: "#6E4A50", marca: "#E8B54A", cartaoBorda: "#3A1118", sombra: 45, tag: "#E8B54A", tagTexto: "#2A0B11", logo: "v2/logo-branca.png" },
};
comp = app.project.items.addComp("Diverno", W1, H1, 1, FIM, 60);
comp.bgColor = [0.165, 0.043, 0.067];
comp.motionBlur = true;
comp.openInViewer();

var MAXW = W1 - 2 * 110, GI = 0.3, GLITCHES = [], ENTRADAS = [], SAIDAS = [];
function hsh() { return "function h(n){var v=Math.sin(n*12.9898+" + (Math.random() * 50).toFixed(2) + ")*43758.5453; return v-Math.floor(v);}"; }
function expo(t0, d) { return "(1-Math.pow(2,-10*Math.min(1,Math.max(0,(time-" + t0 + ")/" + d + "))))"; }
function fade(b) { return "(time>=" + b + " ? Math.max(0,1-(time-" + b + ")/0.2) : 1)"; }

// prender a um grupo animado faz o EffectCraft compensar a escala e o giro que o grupo tem naquele instante: zera
function filho(l, pai) { l.parent = pai; tr(l, "esc").setValue([100, 100]); tr(l, "rot").setValue(0); return l; }

// ---------------- fundo de cada tela: sobe por baixo e cobre a anterior ----------------
function fundo(tema, a, b) {
  var T = TEMA[tema], ini = Math.max(0, a - 0.12), sobe = a <= 0 ? "0" : "2000*(1-" + expo(ini, 0.42) + ")";
  var fr = forma("rect", W1 + 60, H1 + 60, T.fundo, { nome: "fundo" });
  tr(fr, "pos").setValue([540, 960]); tr(fr, "pos").expression = "value + [0, " + sobe + "]";
  var g = imagem(T.grade);
  tr(g, "esc").setValue([50, 50]); tr(g, "pos").setValue([540, 1060]); tr(g, "op").setValue(T.gradeOp);
  tr(g, "pos").expression = "value + [0, -time*14 + " + sobe + "]";
  var lz = forma("ellipse", 1000, 1000, T.luz, { nome: "luz" });
  borra(lz, [[0, 230]]); tr(lz, "op").setValue(T.luzOp);
  tr(lz, "pos").expression = "[540 + Math.sin(time*0.9)*90, 900 + Math.cos(time*0.7)*70 + " + sobe + "]";
  var fimF = b + 1.2;
  vida(fr, ini, fimF); vida(g, ini, fimF); vida(lz, ini, fimF);
  if (a > 0) ENTRADAS.push(a);
}

// ---------------- palavras e telas ----------------
function palavra(g, T, txt, a, cx, cy, sz, fit, o, b) {
  var bw = o.sai || b;
  var l = texto(txt, { size: sz, cor: o.marca ? T.marca : (o.cor || T.tinta), style: "Bold" });
  filho(l, g); tr(l, "esc").setValue([fit * 100, fit * 100]); tr(l, "pos").setValue([cx, cy]);
  if (o.conta) l.property("ADBE Text Properties").property("ADBE Text Document").expression =
    "var p=Math.min(1,Math.max(0,(time-" + a + ")/0.9)); p=1-Math.pow(1-p,3); '' + Math.round(" + o.conta[0] + "+" + (o.conta[1] - o.conta[0]) + "*p)";
  if (o.g) {
    tr(l, "op").expression = hsh() + "var k=Math.floor(time*30), v=1;" + (o.ja ? "" : "if (time<" + a + ") v=0;") +
      " if (time>=" + a + " && time<" + (a + GI) + ") v = h(k+3) < 0.2+0.8*(time-" + a + ")/" + GI + " ? 1 : 0; 100*v*" + fade(bw);
    GLITCHES.push(a);
    vida(l, o.ja ? 0 : a, bw + 0.25);
    return l;
  }
  var cz = texto(txt, { size: sz, cor: T.cinza, style: "Bold" });
  filho(cz, g); tr(cz, "esc").setValue([fit * 100, fit * 100]); tr(cz, "pos").setValue([cx, cy]);
  cz.moveAfter(l);
  var sobe = "value+[0,26*(1-" + expo(a, 0.35) + ")]";
  if (o.ja) { tr(l, "op").expression = "100*" + fade(bw); tr(cz, "op").setValue(0); }
  else {
    tr(cz, "pos").expression = sobe; tr(l, "pos").expression = sobe;
    tr(cz, "op").expression = "100*" + fade(bw) + "*Math.min(1,Math.max(0,(time-" + a + ")/0.08))";
    tr(l, "op").expression = "100*" + fade(bw) + "*Math.min(1,Math.max(0,(time-" + (a + 0.12) + ")/0.22))";
  }
  vida(l, o.ja ? 0 : a, bw + 0.25); vida(cz, o.ja ? 0 : a, bw + 0.25);
  return l;
}
// o grupo da tela: entra por baixo (ou já começa grande e encolhe), zoom lento e contínuo, sai voando para cima em b
function grupo(a, b, cy, o) {
  o = o || {};
  var g = nulo(540, cy);
  var ent = o.gigante ? "var s=(118-18*" + expo(0, 0.55) + ")" : "var s=(92+8*" + expo(a, 0.45) + ")";
  // zoom lento e contínuo, mas com teto (tela longa não pode encolher até sumir): no máximo 8%
  tr(g, "esc").expression = ent + "*(1-0.08*(1-Math.exp(-Math.max(0,time-" + a + ")/4))); [s,s]";
  var sobe = o.gigante ? "0" : "260*(1-" + expo(a, 0.45) + ")";
  tr(g, "pos").expression = "value + [0, " + sobe + " + (time>" + b + " ? -1500*Math.pow(Math.min(1,(time-" + b + ")/0.2),2) : 0)]";
  vida(g, 0, b + 0.3);
  SAIDAS.push(b);
  return g;
}
// bloco de linhas centralizado em dy (relativo ao centro do grupo), cada linha com o seu tamanho e com margem
function linhas(g, T, lista, dy, b) {
  var ms = [];
  for (var i = 0; i < lista.length; i++) {
    var ws = lista[i][0], size = lista[i][1] < 200 ? Math.round(lista[i][1] * 1.18) : lista[i][1], tot = 0, esp = size * 0.24, larg = [];
    for (var j = 0; j < ws.length; j++) { var tmp = texto(ws[j][0], { size: (ws[j][2] && ws[j][2].size) || size, style: "Bold" }); larg.push(tmp.largura); tot += tmp.largura + (j ? esp : 0); tmp.remove(); }
    var fit = Math.min(1, MAXW / tot);
    ms.push({ ws: ws, size: size, tot: tot, esp: esp, larg: larg, fit: fit, alt: size * fit, sai: lista[i][2] });
  }
  var ys = [0];
  for (var k = 1; k < ms.length; k++) ys.push(ys[k - 1] + 0.98 * (ms[k - 1].alt + ms[k].alt) / 2);
  var off = dy - ys[ys.length - 1] / 2;
  for (var q = 0; q < ms.length; q++) {
    var m = ms[q], x = 540 - m.tot * m.fit / 2;
    for (var w = 0; w < m.ws.length; w++) {
      var lw = m.larg[w] * m.fit, oo = m.ws[w][2] || {};
      if (m.sai && !oo.sai) oo.sai = m.sai;
      palavra(g, T, m.ws[w][0], m.ws[w][1], x + lw / 2 - 540, ys[q] + off, oo.size || m.size, m.fit, oo, b);
      x += lw + m.esp * m.fit;
    }
  }
}

// ---------------- foto em cartão arredondado, recortada no foco, que entra voando e respira ----------------
function cartao(g, T, arq, iw, ih, cx, cy, w, h, t, b, o) {
  o = o || {};
  var c = nulo(0, 0); filho(c, g); tr(c, "pos").setValue([cx, cy]);
  var rot = o.rot || 0, de = o.de || [-340, 520];
  tr(c, "pos").expression = "value + [" + de[0] + "*(1-" + expo(t, 0.55) + "), " + de[1] + "*(1-" + expo(t, 0.55) + ")]";
  tr(c, "rot").expression = rot + " - 24*(1-" + expo(t, 0.65) + ")";
  tr(c, "esc").expression = "var s=100*(0.6+0.4*" + expo(t, 0.55) + "); [s,s]";
  c.motionBlur = true;
  var somb = forma("rect", w, h, "#000000", { nome: "sombra", raio: 36 });
  filho(somb, c); tr(somb, "pos").setValue([0, 28]); borra(somb, [[0, 40]]);
  var borda = forma("rect", w + 16, h + 16, T.cartaoBorda, { nome: "borda", raio: 44 });
  filho(borda, c); tr(borda, "pos").setValue([0, 0]);
  var im = imagem(arq); filho(im, c);
  var s = Math.max(w / iw, h / ih), f = o.foco || [0.5, 0.5];
  var dx = (0.5 - f[0]) * Math.max(0, iw * s - w), dy = (0.5 - f[1]) * Math.max(0, ih * s - h);
  tr(im, "pos").setValue([dx, dy]);
  tr(im, "esc").expression = "var k=" + (s * 100).toFixed(3) + "*(1+0.05*Math.min(1,Math.max(0,(time-" + t + ")/6))); [k,k]";
  var mat = forma("rect", w, h, "#FFFFFF", { nome: "cantos", raio: 36 }); filho(mat, c); tr(mat, "pos").setValue([0, 0]);
  app.run("layer.setTrackMatte", { layer: im.name, matte: mat.name, kind: "alpha" });
  var op = "100*Math.min(1,Math.max(0,(time-" + t + ")/0.08))*" + fade(o.sai || b);
  tr(somb, "op").expression = (T.sombra) + "*Math.min(1,Math.max(0,(time-" + t + ")/0.08))*" + fade(o.sai || b);
  tr(borda, "op").expression = op; tr(im, "op").expression = op;
  var fimC = (o.sai || b) + 0.3;
  vida(c, t, fimC); vida(somb, t, fimC); vida(borda, t, fimC); vida(im, t, fimC); vida(mat, t, fimC);
  ENTRADAS.push(t);
  return c;
}
// etiqueta de nome (como crédito de foto), na cor de destaque do tema
function etiqueta(g, T, nomeTxt, papel, cx, cy, t, b) {
  var e = nulo(0, 0); filho(e, g); tr(e, "pos").setValue([cx, cy]);
  var n1 = texto(nomeTxt, { size: 58, style: "Bold", cor: T.tagTexto }), n2 = texto(papel, { size: 38, style: "Medium", cor: T.tagTexto, tracking: 0 });
  var w = Math.max(n1.largura, n2.largura) + 64;
  var r = forma("rect", w, 150, T.tag, { nome: "etiqueta", raio: 18 }); filho(r, e); tr(r, "pos").setValue([0, 0]);
  filho(n1, e); tr(n1, "pos").setValue([0, -22]); filho(n2, e); tr(n2, "pos").setValue([0, 26]);
  r.moveAfter(n1);   // a caixa fica embaixo das duas linhas (antes ela cobria o nome)
  tr(e, "esc").expression = "var s=100*(0.7+0.3*" + expo(t, 0.4) + "); [s,s]";
  var op = "100*Math.min(1,Math.max(0,(time-" + t + ")/0.1))*" + fade(b);
  tr(r, "op").expression = op; tr(n1, "op").expression = op; tr(n2, "op").expression = op;
  vida(e, t, b + 0.3); vida(r, t, b + 0.3); vida(n1, t, b + 0.3); vida(n2, t, b + 0.3);
}
function logo(g, T, cx, cy, larg, t, b, o) {
  o = o || {};
  var l = imagem(T.logo); filho(l, g); var e = larg / 780 * 100;
  tr(l, "pos").setValue([cx, cy]);
  tr(l, "esc").expression = "var s=" + e.toFixed(2) + "*(0.6+0.4*" + expo(t, 0.5) + "); [s,s]";
  tr(l, "op").expression = "100*Math.min(1,Math.max(0,(time-" + t + ")/0.1))*" + fade(o.sai || b);
  vida(l, t, (o.sai || b) + 0.3);
  return l;
}
function icone(g, T, nomeIc, cx, cy, d, t, rotulo, b) {
  var e = nulo(0, 0); filho(e, g); tr(e, "pos").setValue([cx, cy]);
  var bola = forma("ellipse", d, d, T.marca, { nome: "bola" }); filho(bola, e); tr(bola, "pos").setValue([0, 0]);
  var nn = nome("ic"); app.run("edit.pasteSvg", { svg: ICONES_V2[nomeIc].replace('fill="currentColor"', 'fill="' + T.fundo + '"'), name: nn });
  var gl = prender(comp.layer(nn)); filho(gl, e); tr(gl, "anc").setValue([128, 128]); tr(gl, "esc").setValue([d * 0.5 / 256 * 100, d * 0.5 / 256 * 100]); tr(gl, "pos").setValue([0, 0]);
  var lb = texto(rotulo, { size: 42, style: "Semibold", cor: T.tinta, tracking: 0 }); filho(lb, e); tr(lb, "pos").setValue([0, d / 2 + 52]);
  tr(e, "esc").expression = "var s=100*(0.5+0.5*" + expo(t, 0.45) + "); [s,s]";
  tr(e, "rot").expression = "-14*(1-" + expo(t, 0.6) + ")";
  var op = "100*Math.min(1,Math.max(0,(time-" + t + ")/0.08))*" + fade(b);
  tr(bola, "op").expression = op; tr(gl, "op").expression = op; tr(lb, "op").expression = op;
  vida(e, t, b + 0.3); vida(bola, t, b + 0.3); vida(gl, t, b + 0.3); vida(lb, t, b + 0.3);
  ENTRADAS.push(t);
}

// ícone com setinha que sobe sem parar (resultado do co-branding)
function iconeSobe(g, T, nomeIc, cx, cy, d, t, rotulo, b) {
  var e = nulo(0, 0); filho(e, g); tr(e, "pos").setValue([cx, cy]);
  var bola = forma("ellipse", d, d, T.marca, { nome: "bola" }); filho(bola, e); tr(bola, "pos").setValue([0, 0]);
  var nn = nome("ic"); app.run("edit.pasteSvg", { svg: ICONES_V2[nomeIc].replace('fill="currentColor"', 'fill="' + T.fundo + '"'), name: nn });
  var gl = prender(comp.layer(nn)); filho(gl, e); tr(gl, "anc").setValue([128, 128]); tr(gl, "esc").setValue([d * 0.5 / 256 * 100, d * 0.5 / 256 * 100]); tr(gl, "pos").setValue([0, 0]);
  var sd = d * 0.42, sx = d * 0.36, sy = -d * 0.36;
  var sb = forma("ellipse", sd, sd, T.tinta, { nome: "selo" }); filho(sb, e); tr(sb, "pos").setValue([sx, sy]);
  var na = nome("seta"); app.run("edit.pasteSvg", { svg: ICONES_V2["arrow-up"].replace('fill="currentColor"', 'fill="' + T.fundo + '"'), name: na });
  var se = prender(comp.layer(na)); filho(se, e); tr(se, "anc").setValue([128, 128]); tr(se, "esc").setValue([sd * 0.62 / 256 * 100, sd * 0.62 / 256 * 100]);
  // a seta sobe e some em ciclo, e volta de baixo
  tr(se, "pos").expression = "var q=Math.max(0,time-" + (t + 0.35) + "); var c=(q*1.4)%1; [" + sx + ", " + sy + " + 18 - 36*c]";
  var lb = texto(rotulo, { size: 52, style: "Bold", cor: T.tinta, tracking: 0 }); filho(lb, e); tr(lb, "pos").setValue([0, d / 2 + 62]);
  tr(e, "esc").expression = "var s=100*(0.5+0.5*" + expo(t, 0.45) + "); [s,s]";
  tr(e, "rot").expression = "-14*(1-" + expo(t, 0.6) + ")";
  var op = "100*Math.min(1,Math.max(0,(time-" + t + ")/0.08))*" + fade(b);
  tr(bola, "op").expression = op; tr(gl, "op").expression = op; tr(sb, "op").expression = op; tr(lb, "op").expression = op;
  tr(se, "op").expression = "var q=Math.max(0,time-" + (t + 0.35) + "); var c=(q*1.4)%1; (time<" + (t + 0.35) + " ? 0 : 100*Math.sin(Math.PI*c))*" + fade(b);
  var fimI = b + 0.3;
  vida(e, t, fimI); vida(bola, t, fimI); vida(gl, t, fimI); vida(sb, t, fimI); vida(se, t, fimI); vida(lb, t, fimI);
  ENTRADAS.push(t);
}

// =============== TELA 0 (claro): o gancho, já cheio no quadro 1 ===============
var T = TEMA.claro, A = 0, B = 4.5;
fundo("claro", A, B);
var g0 = grupo(A, B, 960, { gigante: true });
cartao(g0, T, "v2/cones.jpg", 1440, 1920, -270, -470, 330, 430, 0.0, B, { rot: -9, foco: [0.55, 0.5], de: [-260, 380] });
cartao(g0, T, "v2/casquinha.jpg", 1440, 1920, 0, -520, 330, 430, 0.12, B, { rot: 0, foco: [0.6, 0.45], de: [0, 420] });
cartao(g0, T, "v2/vela.jpg", 1440, 1920, 270, -470, 330, 430, 0.24, B, { rot: 9, foco: [0.5, 0.55], de: [260, 380] });
linhas(g0, T, [
  [[["Se", 0.0, { ja: true }], ["eu", 0.0, { ja: true }], ["tivesse", 0.0, { ja: true }]], 150],
  [[["uma", 0.0, { ja: true }], ["gelateria,", 0.0, { ja: true }]], 150],
  [[["eu", 2.17], ["copiaria", 2.25], ["tudo", 2.8, { g: true, marca: true }]], 150],
  [[["que", 3.28], ["a", 3.43], ["Diverno", 3.54, { g: true, marca: true }], ["faz.", 4.02]], 150],
], 330, B);

// =============== TELA 1 (escuro): de São Luís, pega emprestado o público ===============
T = TEMA.escuro; A = 4.65; B = 9.3;
fundo("escuro", A, B);
var g1 = grupo(A, B, 960);
logo(g1, T, 0, -470, 520, 4.8, B);
linhas(g1, T, [
  [[["Essa", 4.76], ["gelateria", 5.03], ["de", 5.54], ["São", 5.68, { g: true, marca: true }], ["Luís", 5.83, { g: true, marca: true }]], 110],
  [[["cresce", 6.15], ["pegando", 6.63]], 150],
  [[["emprestado", 7.03, { g: true, marca: true }]], 230],
  [[["o", 7.62], ["público", 7.75], ["de", 8.04], ["outras", 8.25], ["marcas.", 8.65]], 110],
], 120, B);

// =============== TELA 2 (claro): Igor Caleb, gelato e milkshake proteico ===============
T = TEMA.claro; A = 9.4; B = 16.95;
fundo("claro", A, B);
var g2 = grupo(A, B, 960);
linhas(g2, T, [[[["Se", 9.5], ["liga", 9.58], ["só:", 9.75]], 80]], -700, B);
cartao(g2, T, "v2/igor.jpg", 1440, 1920, -70, -180, 760, 860, 10.36, B, { rot: -3, foco: [0.5, 0.3] });
cartao(g2, T, "v2/milkshake.jpg", 1440, 1920, 300, 70, 330, 420, 11.58, B, { rot: 7, foco: [0.5, 0.4], de: [380, 420] });
etiqueta(g2, T, "Igor Caleb", "Nutricionista", -170, 280, 13.68, B);
linhas(g2, T, [
  [[["gelato", 10.95], ["e", 11.49], ["milkshake", 11.58], ["proteico", 12.04, { g: true, marca: true }]], 84],
  [[["conquistou", 14.84], ["o", 15.31], ["público", 15.47]], 84],
  [[["que", 15.71], ["cuida", 15.96], ["do", 16.34], ["corpo.", 16.5, { g: true, marca: true }]], 84],
], 520, B);

// =============== TELA 3 (escuro): Gelato Matilda com a Karolícias, e o Dilícias só na loja dela ===============
T = TEMA.escuro; A = 17.05; B = 27.45;
fundo("escuro", A, B);
var g3 = grupo(A, B, 960);
cartao(g3, T, "v2/matilda-potes.jpg", 1440, 1920, -60, -400, 600, 640, 17.81, B, { rot: -3, foco: [0.45, 0.8] });
cartao(g3, T, "v2/dilicias.jpg", 1350, 1688, 290, -240, 300, 375, 20.34, B, { rot: 7, foco: [0.5, 0.45], de: [380, 300] });
linhas(g3, T, [
  [[["Gelato", 17.81], ["Matilda", 18.15, { g: true, marca: true }]], 130, 23.3],
  [[["com", 18.74], ["a", 18.95], ["Karolícias,", 19.09]], 90, 23.3],
  [[["e", 19.79], ["ainda", 20.13], ["um", 20.34], ["doce", 20.51, { g: true, marca: true }]], 90, 23.3],
  [[["que", 20.78], ["só", 20.91], ["existe", 21.1], ["na", 21.52], ["loja", 21.73], ["da", 22.1], ["confeitaria.", 22.25]], 70, 23.3],
], 330, B);
// "Ou seja": as linhas de cima saem e a explicação entra no lugar delas
linhas(g3, T, [
  [[["levou", 23.93], ["a", 24.3], ["Diverno", 24.41, { g: true, marca: true }]], 120],
  [[["pra", 24.83], ["dentro", 24.98], ["do", 25.38], ["lugar", 25.53]], 90],
  [[["onde", 25.78], ["o", 26.01], ["cliente", 26.1], ["de", 26.49], ["doce", 26.62, { g: true, marca: true }]], 90],
  [[["já", 26.92], ["estava.", 27.21]], 90],
], 350, B);

// =============== TELA 4 (claro): a sobremesa de março com a La Mia Dolce Vita ===============
T = TEMA.claro; A = 27.55; B = 33.7;
fundo("claro", A, B);
var g4 = grupo(A, B, 960);
cartao(g4, T, "v2/dolcevita.jpg", 1440, 1920, 0, -360, 600, 720, 27.69, B, { rot: -2, foco: [0.45, 0.5] });
etiqueta(g4, T, "La Mia Dolce Vita", "Só em março", 0, 60, 30.46, B);
linhas(g4, T, [
  [[["Em", 27.69], ["março,", 28.32, { g: true, marca: true }], ["lançou", 28.8]], 110],
  [[["uma", 29.22], ["sobremesa", 29.35], ["junto", 29.87], ["com", 30.11]], 84],
  [[["a", 30.29], ["La", 30.46], ["Mia", 30.68], ["Dolce", 30.9, { g: true, marca: true }], ["Vita,", 31.31, { g: true, marca: true }]], 110],
  [[["que", 31.79], ["só", 31.96], ["ficou", 32.11], ["à", 32.38], ["venda", 32.51], ["naquele", 32.74], ["mês.", 33.2, { g: true, marca: true }]], 76],
], 440, B);

// =============== TELA 5 (escuro): os 10 anos, com o Golden Celebration de volta e o selo novo nos copos ===============
T = TEMA.escuro; A = 33.8; B = 43.2;
fundo("escuro", A, B);
var g5 = grupo(A, B, 960);
cartao(g5, T, "v2/golden.jpg", 1440, 1920, -60, -400, 600, 680, 33.92, B, { rot: -3, foco: [0.4, 0.6] });
cartao(g5, T, "v2/selo10.jpg", 1440, 1920, 290, -230, 300, 380, 41.39, B, { rot: 7, foco: [0.55, 0.55], de: [380, 300] });
linhas(g5, T, [
  [[["E", 33.92], ["pra", 34.11], ["comemorar", 34.25]], 90, 37.55],
  [[["10", 34.74, { g: true, marca: true }], ["anos,", 34.99, { g: true, marca: true }]], 200, 37.55],
  [[["trouxe", 35.64], ["de", 35.83], ["volta", 35.98], ["o", 36.23]], 84, 37.55],
  [[["Golden", 36.42, { g: true, marca: true }], ["Celebration,", 36.76, { g: true, marca: true }]], 110, 37.55],
], 360, B);
linhas(g5, T, [
  [[["o", 37.7], ["gelato", 37.85], ["de", 38.19], ["avelã", 38.32, { g: true, marca: true }]], 100],
  [[["que", 38.67], ["o", 38.78], ["público", 38.9], ["espera", 39.12], ["o", 39.5], ["ano", 39.71], ["inteiro,", 39.96]], 76],
  [[["e", 40.42], ["colocou", 40.76], ["o", 41.16], ["selo", 41.39, { g: true, marca: true }], ["dos", 41.62], ["10", 41.77], ["anos", 41.96]], 84],
  [[["em", 42.3], ["cada", 42.55], ["copo.", 42.84, { g: true, marca: true }]], 100],
], 380, B);

// =============== TELA 6 (claro): co-branding, e o resultado com os três ícones subindo ===============
T = TEMA.claro; A = 43.3; B = 58.95;
fundo("claro", A, B);
var g6 = grupo(A, B, 960);
linhas(g6, T, [
  [[["No", 43.6], ["marketing,", 43.7], ["isso", 44.36], ["se", 44.46], ["chama", 44.61]], 84],
  [[["co-branding", 44.82, { g: true, marca: true }]], 220],
], -560, B);
// duas marcas com público que se juntam: os círculos se aproximam e a interseção acende; saem quando entra o resultado
var SAI_CIRC = 51.6;
function circulo(cx0, cx1, rotulo, cor, t) {
  var c = nulo(0, 0); filho(c, g6);
  tr(c, "pos").expression = "var p=" + expo(t, 0.6) + ", q=" + expo(48.08, 0.8) + "; [" + cx0 + "+(" + (cx1 - cx0) + ")*q, 40+300*(1-p)]";
  tr(c, "esc").expression = "var s=100*(0.5+0.5*" + expo(t, 0.5) + "); [s,s]";
  var e = forma("ellipse", 440, 440, cor, { nome: "circulo" }); filho(e, c); tr(e, "pos").setValue([0, 0]);
  tr(e, "op").expression = "34*Math.min(1,Math.max(0,(time-" + t + ")/0.1))*" + fade(SAI_CIRC);
  var a = forma("ellipse", 440, 440, cor, { nome: "aro", stroke: cor, strokeWidth: 6 }); filho(a, c); tr(a, "pos").setValue([0, 0]);
  tr(a, "op").expression = "100*Math.min(1,Math.max(0,(time-" + t + ")/0.1))*" + fade(SAI_CIRC);
  var l = texto(rotulo, { size: 56, style: "Bold", cor: T.tinta, tracking: 0 }); filho(l, c); tr(l, "pos").setValue([cx0 < 0 ? -90 : 90, 0]);
  tr(l, "op").expression = "100*Math.min(1,Math.max(0,(time-" + t + ")/0.1))*" + fade(SAI_CIRC);
  vida(c, t, SAI_CIRC + 0.3); vida(e, t, SAI_CIRC + 0.3); vida(a, t, SAI_CIRC + 0.3); vida(l, t, SAI_CIRC + 0.3);
  ENTRADAS.push(t);
}
circulo(-330, -150, "Diverno", TEMA.claro.marca, 46.19);
circulo(330, 150, "Parceiro", "#C9A24A", 46.51);
var meio = forma("ellipse", 150, 300, "#FFFFFF", { nome: "intersecao" }); filho(meio, g6); tr(meio, "pos").setValue([0, 40]); borra(meio, [[0, 30]]);
tr(meio, "op").expression = "var p=Math.min(1,Math.max(0,(time-49.24)/0.4)); 80*p*" + fade(SAI_CIRC) + "*(0.8+0.2*Math.sin(time*4))";
vida(meio, 49.2, SAI_CIRC + 0.3);
linhas(g6, T, [
  [[["O", 51.87], ["resultado", 52.06], ["é", 52.44]], 96],
], -230, B);
iconeSobe(g6, T, "user-plus", -310, 80, 250, 52.95, "mais seguidores", B);
iconeSobe(g6, T, "shopping-cart", 0, 80, 250, 54.1, "mais vendas", B);
iconeSobe(g6, T, "megaphone", 310, 80, 250, 54.93, "mais alcance", B);
linhas(g6, T, [
  [[["e", 55.49], ["as", 55.81], ["pessoas", 55.9], ["passam", 56.19], ["a", 56.57], ["falar", 56.65], ["da", 56.93], ["marca", 57.09, { g: true, marca: true }]], 84],
  [[["em", 57.39], ["lugares", 57.52], ["onde", 57.83], ["ela", 58.04], ["nem", 58.21], ["estava.", 58.5, { g: true, marca: true }]], 84],
], 500, B);

// =============== TELA 7 (escuro): tudo começou num quiosque (sem o ano: a matéria de 2018 diz 2010, a marca comemora 10 anos em 2026) ===============
T = TEMA.escuro; A = 59.05; B = 65.3;
fundo("escuro", A, B);
var g7 = grupo(A, B, 960);
linhas(g7, T, [
  [[["E", 59.29], ["o", 59.5], ["mais", 59.58], ["curioso:", 59.79, { g: true, marca: true }]], 84],
  [[["tudo", 60.42], ["começou", 60.7]], 110],
  [[["num", 61.09], ["quiosque,", 61.28, { g: true, marca: true }]], 170],
], -540, B);
cartao(g7, T, "v2/fundadores.jpg", 1024, 682, 0, -10, 760, 500, 61.94, B, { rot: -2, foco: [0.55, 0.35] });
etiqueta(g7, T, "Rodrigo e Danielle Lima", "Fundadores · hoje são 7 lojas", 0, 260, 62.63, B);
linhas(g7, T, [
  [[["criado", 61.94], ["por", 62.38], ["um", 62.51], ["casal", 62.63]], 84],
  [[["que", 62.97], ["saiu", 63.1], ["do", 63.5], ["Grupo", 63.64], ["Mateus", 63.87, { g: true, marca: true }]], 84],
  [[["pra", 64.32], ["vender", 64.46], ["sorvete.", 64.78, { g: true, marca: true }]], 84],
], 520, B);

// =============== TELA 8 (claro): quem são os seus parceiros? ===============
T = TEMA.claro; A = 65.4; B = 73.3;
fundo("claro", A, B);
var g8 = grupo(A, B, 960);
linhas(g8, T, [
  [[["Agora", 65.71], ["pensa", 65.87], ["aí:", 66.11]], 90],
  [[["quem", 66.57], ["são", 66.78], ["os", 66.95], ["parceiros", 67.1, { g: true, marca: true }]], 120],
  [[["que", 67.54], ["já", 67.7], ["têm", 67.85], ["um", 68.08], ["relacionamento", 68.19]], 84],
  [[["com", 68.8], ["o", 68.95], ["cliente", 69.05], ["que", 69.43], ["você", 69.52, { g: true, marca: true }], ["quer?", 69.79]], 84],
], -300, B);
icone(g8, T, "barbell", -290, 330, 210, 70.52, "a academia do bairro", B);
icone(g8, T, "scissors", 0, 330, 210, 71.74, "o salão", B);
icone(g8, T, "coffee", 290, 330, 210, 72.47, "o café do lado", B);

// =============== TELA 9 (escuro): a chamada, centralizada (sem a logo da Diverno, pedido dele) ===============
T = TEMA.escuro; A = 73.4; B = 76.85;
fundo("escuro", A, B);
var g9 = grupo(A, B, 960);
linhas(g9, T, [
  [[["Marca", 73.46], ["aqui", 73.83], ["embaixo", 74.02, { g: true, marca: true }]], 130],
  [[["uma", 74.38], ["empresa", 74.53], ["que", 74.82], ["faria", 74.95]], 90],
  [[["a", 75.24], ["collab", 75.35, { g: true, marca: true }], ["perfeita", 75.6]], 140],
  [[["com", 76.34], ["a", 76.5], ["sua.", 76.57]], 90],
], -40, B);
var seta = texto("↓", { size: 120, style: "Bold", cor: T.marca }); filho(seta, g9); tr(seta, "pos").setValue([0, 330]);
tr(seta, "pos").expression = "value + [0, Math.abs(Math.sin((time-74.0)*4))*-26]";
tr(seta, "op").expression = "100*Math.min(1,Math.max(0,(time-74.02)/0.15))*" + fade(B); vida(seta, 74.0, B + 0.3);

// =============== TELA 10 (claro): ficha técnica, como nos outros episódios do Marketing da Ilha ===============
T = TEMA.claro; A = 76.95; B = 80.75;
fundo("claro", A, B);
var g10 = grupo(A, B, 960);
var painel = forma("rect", 980, 1240, "#FFFFFF", { nome: "ficha", raio: 44 }); filho(painel, g10); tr(painel, "pos").setValue([0, 30]);
var sombraF = forma("rect", 980, 1240, "#000000", { nome: "fichaSombra", raio: 44 }); filho(sombraF, g10); tr(sombraF, "pos").setValue([0, 58]); borra(sombraF, [[0, 40]]);
sombraF.moveAfter(painel); tr(sombraF, "op").setValue(14);
vida(painel, A, B + 0.3); vida(sombraF, A, B + 0.3);
function textoEsq(g, txt, o, x, y, t) {
  var l = texto(txt, o); filho(l, g);
  tr(l, "anc").setValue([tr(l, "anc").value[0] - l.largura / 2, tr(l, "anc").value[1]]);
  tr(l, "pos").setValue([x, y]);
  tr(l, "pos").expression = "value+[0,18*(1-" + expo(t, 0.35) + ")]";
  tr(l, "op").expression = "100*Math.min(1,Math.max(0,(time-" + t + ")/0.15))*" + fade(B);
  vida(l, t, B + 0.3);
  return l;
}
var cab = texto("FICHA TÉCNICA", { size: 34, style: "Bold", cor: T.marca, tracking: 300 }); filho(cab, g10); tr(cab, "pos").setValue([0, -480]);
tr(cab, "op").expression = "100*Math.min(1,Math.max(0,(time-" + (A + 0.1) + ")/0.15))*" + fade(B); vida(cab, A, B + 0.3);
var cab2 = texto("Feito 100% com IA", { size: 84, style: "Bold", cor: T.tinta }); filho(cab2, g10); tr(cab2, "pos").setValue([0, -385]);
tr(cab2, "op").expression = "100*Math.min(1,Math.max(0,(time-" + (A + 0.18) + ")/0.15))*" + fade(B); vida(cab2, A, B + 0.3);
var FICHA = [
  ["sparkle", "Roteiro, motion e edição", "Claude Opus 5.5"],
  ["cpu", "Motion design", "EffectCraft (open source)"],
  ["microphone", "Narração e trilha", "Gemini TTS · Lyria"],
  ["image", "Fotos", "Instagram da @divernogelato"],
  ["pen-nib", "Texto escrito pelo Claude", "~165 mil tokens"],
  ["coins", "Créditos de IA", "784 no Magnific"],
  ["clock", "Tempo de produção", "1h30"],
];
for (var fi = 0; fi < FICHA.length; fi++) {
  var fy = -240 + fi * 122, tf = A + 0.3 + fi * 0.08;
  var bo = forma("ellipse", 80, 80, T.marca, { nome: "bolaFicha" }); filho(bo, g10); tr(bo, "pos").setValue([-380, fy]);
  var nf = nome("icf"); app.run("edit.pasteSvg", { svg: ICONES_V2[FICHA[fi][0]].replace('fill="currentColor"', 'fill="#FFFFFF"'), name: nf });
  var gf = prender(comp.layer(nf)); filho(gf, g10); tr(gf, "anc").setValue([128, 128]); tr(gf, "esc").setValue([42 / 256 * 100, 42 / 256 * 100]); tr(gf, "pos").setValue([-380, fy]);
  var opf = "100*Math.min(1,Math.max(0,(time-" + tf + ")/0.15))*" + fade(B);
  tr(bo, "op").expression = opf; tr(gf, "op").expression = opf; vida(bo, tf, B + 0.3); vida(gf, tf, B + 0.3);
  textoEsq(g10, FICHA[fi][1], { size: 36, style: "Medium", cor: "#8A7A7C", tracking: 0 }, -300, fy - 26, tf);
  textoEsq(g10, FICHA[fi][2], { size: 50, style: "Bold", cor: fi >= 4 ? T.marca : T.tinta, tracking: 0 }, -300, fy + 24, tf + 0.04);
}

// =============== a logo dele, escrita à mão no fim ===============
fundo("escuro", 80.75, FIM);
CENA_ATUAL = null;
vinhetaLogo(80.9, W1 / 2, 940, 820);

// áudio (mix2.py) e projeto salvo; ele renderiza no app
var somIt = app.project.importFile(new ImportOptions(new File(PASTA + "mix2.wav")));
var som = comp.layers.add(somIt); som.startTime = 0;
var rq = app.project.renderQueue.items.add(comp);
var om = rq.outputModule(1);
try { om.applyTemplate("H.264"); } catch (e) {}
om.file = new File("~/Downloads/marketing-da-ilha/03-diverno/video/Diverno - Marketing da Ilha 03.mp4");
app.project.save(new File(PASTA + "diverno2.ecproj"));
writeLn("camadas " + comp.numLayers);
writeLn("glitches " + GLITCHES.join(","));
writeLn("entradas " + ENTRADAS.join(","));
writeLn("saidas " + SAIDAS.join(","));
