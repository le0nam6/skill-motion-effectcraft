// Reel 21/10 do desafio @instadoleonam: "O prontuário do cliente" (bastidor, CTA pra comunidade InsidersAI). Motor do Diverno v2 (exemplos/diverno no motion-effectcraft):
// telas alternando tema claro e escuro (laranja do Claude), palavra comum entra cinza e escurece, destaque pisca, fotos em cartão.
// Voz: ~/Downloads/Estudio/2026-10-21 - Dossiê do cliente/audio/voz.wav (Gemini 3.8 TTS, Charon), tempos em palavras.json.
// Rodar: effectcraft-cli script "$PWD/dossie.jsx" --empty
#include "base.jsx"
#include "icones_md.jsx"
#include "icones_extra.jsx"
#include "logo_svg.jsx"

PASTA = "~/Developer/artcraft/dossie/";
W1 = 1080; H1 = 1920; FIM = 67.0;
function V(s) { return s; }
var TEMA = {
  claro: { fundo: "#F3EFE6", grade: "img/grade-clara.png", gradeOp: 100, luz: "#D8452B", luzOp: 6, tinta: "#151412", cinza: "#D9D2C4", marca: "#D8452B", cartaoBorda: "#FFFFFF", sombra: 22, tag: "#D8452B", tagTexto: "#FFFFFF" },
  escuro: { fundo: "#151412", grade: "img/grade-escura.png", gradeOp: 40, luz: "#D8452B", luzOp: 12, tinta: "#F3EFE6", cinza: "#3E3A35", marca: "#E8604A", cartaoBorda: "#2A2724", sombra: 45, tag: "#E8604A", tagTexto: "#151412" },
};
comp = app.project.items.addComp("Dossie", W1, H1, 1, FIM, 60);
comp.bgColor = [0.08, 0.08, 0.07];
comp.motionBlur = true;
comp.openInViewer();

var MAXW = W1 - 2 * 110, GI = 0.3, GLITCHES = [], ENTRADAS = [], SAIDAS = [];
function hsh() { return "function h(n){var v=Math.sin(n*12.9898+" + (Math.random() * 50).toFixed(2) + ")*43758.5453; return v-Math.floor(v);}"; }
function expo(t0, d) { return "(1-Math.pow(2,-10*Math.min(1,Math.max(0,(time-" + t0 + ")/" + d + "))))"; }
function fade(b) { return "(time>=" + b + " ? Math.max(0,1-(time-" + b + ")/0.2) : 1)"; }

// prender a um grupo animado faz o EffectCraft compensar a escala e o giro que o grupo tem naquele instante: zera
function filho(l, pai) { l.parent = pai; tr(l, "esc").setValue([100, 100]); tr(l, "rot").setValue(0); return l; }

// ---------------- fundo de cada tela: sobe por baixo e cobre a anterior ----------------
function fundo(tema, a, b, lado) {
  var T = TEMA[tema], ini = Math.max(0, a - 0.12), mv = a <= 0 ? "0" : (lado ? "1200" : "2000") + "*(1-" + expo(ini, 0.42) + ")";
  var dx = lado ? mv : "0", dy = lado ? "0" : mv;   // a tela nova cobre a anterior vindo de baixo ou da direita
  var fr = forma("rect", W1 + 60, H1 + 60, T.fundo, { nome: "fundo" });
  tr(fr, "pos").setValue([540, 960]); tr(fr, "pos").expression = "value + [" + dx + ", " + dy + "]";
  var g = imagem(T.grade);
  tr(g, "esc").setValue([50, 50]); tr(g, "pos").setValue([540, 1060]); tr(g, "op").setValue(T.gradeOp);
  tr(g, "pos").expression = "value + [" + dx + ", -((time*14)%90) + " + dy + "]";
  var lz = forma("ellipse", 1000, 1000, T.luz, { nome: "luz" });
  borra(lz, [[0, 230]]); tr(lz, "op").setValue(T.luzOp);
  tr(lz, "pos").expression = "[540 + Math.sin(time*0.9)*90 + " + dx + ", 900 + Math.cos(time*0.7)*70 + " + dy + "]";
  var fimF = b + 1.2;
  vida(fr, ini, fimF); vida(g, ini, fimF); vida(lz, ini, fimF);
  if (a > 0) ENTRADAS.push(a);
}

// ---------------- palavras e telas ----------------
var PF = { font: "Playfair Display", estilo: "Bold Italic", tracking: 0 };
function fonteDe(o, size, cor) { var f = { size: o.pf ? Math.round(size * 1.12) : size, style: "Bold" }; if (cor) f.cor = cor; if (o.pf) { f.font = PF.font; f.estilo = PF.estilo; f.tracking = PF.tracking; } return f; }
// como as palavras comuns entram em cada tela: "sobe" (padrão), "escala", "lado" ou "desfoque"
var MODO = "sobe";
function palavra(g, T, txt, a, cx, cy, sz, fit, o, b) {
  var bw = o.sai || b;
  var l = texto(txt, fonteDe(o, sz, o.marca ? T.marca : (o.cor || T.tinta)));
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
  var cz = texto(txt, fonteDe(o, sz, T.cinza));
  filho(cz, g); tr(cz, "esc").setValue([fit * 100, fit * 100]); tr(cz, "pos").setValue([cx, cy]);
  cz.moveAfter(l);
  var sobe = "value+[0,26*(1-" + expo(a, 0.35) + ")]";
  if (MODO == "lado") sobe = "value+[60*(1-" + expo(a, 0.4) + "),0]";
  if (o.ja) { tr(l, "op").expression = "100*" + fade(bw); tr(cz, "op").setValue(0); }
  else {
    if (MODO == "escala") {
      sobe = "value";
      var ee = "var p=Math.min(1,Math.max(0,(time-" + a + ")/0.45)); var m=1-Math.exp(-6*p)*Math.cos(9*p); var s=" + (fit * 100).toFixed(2) + "*(0.55+0.45*m); [s,s]";
      tr(cz, "esc").expression = ee; tr(l, "esc").expression = ee;
    }
    if (MODO == "desfoque") { borra(l, [[a, 30], [a + 0.3, 0]]); borra(cz, [[a, 30], [a + 0.3, 0]]); }
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
  var ent = o.gigante ? "var s=(118-18*" + expo(0, 0.55) + ")" : (o.entra == "zoom" ? "var s=(135-35*" + expo(a, 0.5) + ")" : "var s=(92+8*" + expo(a, 0.45) + ")");
  // zoom lento e contínuo, mas com teto (tela longa não pode encolher até sumir): no máximo 8%
  tr(g, "esc").expression = ent + "*(1-0.08*(1-Math.exp(-Math.max(0,time-" + a + ")/4))); [s,s]";
  var sobe = (o.gigante || o.entra == "zoom" || o.entra == "lado") ? "0" : "260*(1-" + expo(a, 0.45) + ")";
  var lado = o.entra == "lado" ? "900*(1-" + expo(a, 0.5) + ")" : "0";
  var saiX = o.sai == "lado" ? "(time>" + b + " ? -1400*Math.pow(Math.min(1,(time-" + b + ")/0.22),2) : 0)" : "0";
  var saiY = o.sai == "lado" || o.sai == "zoom" ? "0" : "(time>" + b + " ? -1500*Math.pow(Math.min(1,(time-" + b + ")/0.2),2) : 0)";
  tr(g, "pos").expression = "value + [" + lado + " + " + saiX + ", " + sobe + " + " + saiY + "]";
  if (o.sai == "zoom") tr(g, "esc").expression = tr(g, "esc").expression.replace("; [s,s]", "; if (time>" + b + ") s=s*(1+2.5*Math.pow(Math.min(1,(time-" + b + ")/0.22),2)); [s,s]");
  vida(g, 0, b + 0.3);
  SAIDAS.push(b);
  return g;
}
// bloco de linhas centralizado em dy (relativo ao centro do grupo), cada linha com o seu tamanho e com margem
function linhas(g, T, lista, dy, b) {
  var ms = [];
  for (var i = 0; i < lista.length; i++) {
    var ws = lista[i][0], size = lista[i][1] < 200 ? Math.round(lista[i][1] * 1.18) : lista[i][1], tot = 0, esp = size * 0.24, larg = [];
    for (var j = 0; j < ws.length; j++) { var tmp = texto(ws[j][0], fonteDe(ws[j][2] || {}, (ws[j][2] && ws[j][2].size) || size)); larg.push(tmp.largura); tot += tmp.largura + (j ? esp : 0); tmp.remove(); }
    var fit = Math.min(1, MAXW / tot);
    ms.push({ ws: ws, size: size, tot: tot, esp: esp, larg: larg, fit: fit, alt: size * fit, sai: lista[i][2] });
  }
  var ys = [0];
  for (var k = 1; k < ms.length; k++) ys.push(ys[k - 1] + 0.98 * (ms[k - 1].alt + ms[k].alt) / 2);
  var off = dy - ys[ys.length - 1] / 2;
  for (var q = 0; q < ms.length; q++) {
    var m = ms[q], x = 540 - m.tot * m.fit / 2;
    // a linha se recentraliza a cada palavra nova: um nulo por linha anda pra esquerda conforme as palavras entram
    var ln = nulo(0, 0); filho(ln, g); tr(ln, "pos").setValue([0, 0]);
    var ini = 0, k0 = 0;
    while (k0 < m.ws.length && (m.ws[k0][2] || {}).ja) { ini += m.larg[k0] + (k0 ? m.esp : 0); k0++; }
    if (k0 == 0) { ini = m.larg[0]; k0 = 1; }
    var ex = ((m.tot - ini) * m.fit / 2).toFixed(2);
    for (var j = k0; j < m.ws.length; j++) ex += "-" + ((m.larg[j] + m.esp) * m.fit / 2).toFixed(2) + "*" + expo(m.ws[j][1], 0.3);
    tr(ln, "pos").expression = "[" + ex + ", 0]";
    vida(ln, 0, b + 0.3);
    for (var w = 0; w < m.ws.length; w++) {
      var lw = m.larg[w] * m.fit, oo = m.ws[w][2] || {};
      if (m.sai && !oo.sai) oo.sai = m.sai;
      palavra(ln, T, m.ws[w][0], m.ws[w][1], x + lw / 2 - 540, ys[q] + off, oo.size || m.size, m.fit, oo, b);
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

var FICHA = [
  ["sparkle", "Pauta, roteiro e motion", "Claude Opus 5.5"],
  ["cpu", "Motion design", "EffectCraft (open source)"],
  ["microphone", "Narração", "Gemini TTS, voz Charon"],
  ["pen-nib", "O gancho", "escrito por mim"],
  ["target", "Ganchos até o aprovado", "6"],
];

// ---------------- peças novas deste vídeo ----------------
function pilula(g, T, txt, cx, cy, w, h, cor, corTxt, t, b, o) {
  o = o || {};
  var e = nulo(0, 0); filho(e, g); tr(e, "pos").setValue([cx, cy]);
  var r = forma("rect", w, h, cor, { nome: "pilula", raio: h / 2 }); filho(r, e); tr(r, "pos").setValue([0, 0]);
  var l = texto(txt, { size: o.size || h * 0.5, style: "Bold", cor: corTxt, tracking: 0 }); filho(l, e); tr(l, "pos").setValue([o.dx || 0, 0]);
  tr(e, "esc").expression = "var s=100*(0.5+0.5*" + expo(t, 0.45) + ")" + (o.pulsa ? "*(1+0.035*Math.sin(Math.max(0,time-" + (t + 0.5) + ")*6))" : "") + "; [s,s]";
  tr(e, "rot").expression = (o.rot || 0) + "-10*(1-" + expo(t, 0.6) + ")";
  var op = "100*Math.min(1,Math.max(0,(time-" + t + ")/0.08))*" + fade(o.sai || b);
  tr(r, "op").expression = op; tr(l, "op").expression = op;
  var fimP = (o.sai || b) + 0.3; vida(e, t, fimP); vida(r, t, fimP); vida(l, t, fimP);
  ENTRADAS.push(t);
  return e;
}
function cracha(g, T, cx, cy, b) {
  // crachá vertical: faixa escura com o furo, a foto dele, nome, cargo e @ (pedido dele em 19/10)
  var e = nulo(0, 0); filho(e, g); tr(e, "pos").setValue([cx, cy]);
  tr(e, "rot").setValue(-3); tr(e, "esc").setValue([85, 85]);
  var W = 600, H = 840, ls = [];
  var somb = forma("rect", W, H, "#000000", { nome: "sombra", raio: 40 }); filho(somb, e); tr(somb, "pos").setValue([0, 30]); borra(somb, [[0, 44]]);
  var c = forma("rect", W, H, "#FFFFFF", { nome: "cracha", raio: 40 }); filho(c, e); tr(c, "pos").setValue([0, 0]); ls.push(c);
  var faixa = forma("rect", W, 120, T.tinta, { nome: "faixa" }); filho(faixa, e); tr(faixa, "pos").setValue([0, -H / 2 + 60]); ls.push(faixa);
  var mc = forma("rect", W, H, "#FFFFFF", { nome: "mcracha", raio: 40 }); filho(mc, e); tr(mc, "pos").setValue([0, 0]); ls.push(mc);
  app.run("layer.setTrackMatte", { layer: faixa.name, matte: mc.name, kind: "alpha" });
  var furo = forma("rect", 130, 24, T.fundo, { nome: "furo", raio: 12 }); filho(furo, e); tr(furo, "pos").setValue([0, -H / 2 + 52]); ls.push(furo);
  var foto = imagem("img/leonam.jpg"); filho(foto, e); tr(foto, "pos").setValue([0, -110]); tr(foto, "esc").setValue([400 / 900 * 100, 400 / 900 * 100]); ls.push(foto);
  var mf = forma("rect", 400, 400, "#FFFFFF", { nome: "mfoto", raio: 30 }); filho(mf, e); tr(mf, "pos").setValue([0, -110]); ls.push(mf);
  app.run("layer.setTrackMatte", { layer: foto.name, matte: mf.name, kind: "alpha" });
  var n = texto("Leonam Alves", { size: 70, style: "Bold", cor: T.tinta, tracking: 0 }); filho(n, e); tr(n, "pos").setValue([0, 165]); ls.push(n);
  var cg = texto("Social Media", { size: 62, style: "Bold", cor: T.marca, tracking: 0 }); filho(cg, e); tr(cg, "pos").setValue([0, 245]); ls.push(cg);
  var at = texto("@instadoleonam", { size: 40, style: "Medium", cor: "#8C8079", tracking: 0 }); filho(at, e); tr(at, "pos").setValue([0, 320]); ls.push(at);
  for (var i = 0; i < ls.length; i++) { tr(ls[i], "op").expression = "100*" + fade(b); vida(ls[i], 0, b + 0.3); }
  tr(somb, "op").expression = "22*" + fade(b); vida(somb, 0, b + 0.3);
  vida(e, 0, b + 0.3);
  return e;
}
function carimbo(g, txt, cx, cy, t, b) {
  var e = nulo(0, 0); filho(e, g); tr(e, "pos").setValue([cx, cy]);
  var vermelho = "#D93A2B";
  var aro = forma("rect", 560, 150, vermelho, { nome: "aro", stroke: vermelho, strokeWidth: 12, raio: 18 }); filho(aro, e); tr(aro, "pos").setValue([0, 0]);
  var l = texto(txt, { size: 120, style: "Bold", cor: vermelho, tracking: 40 }); filho(l, e); tr(l, "pos").setValue([0, 6]);
  tr(e, "rot").setValue(-12);
  tr(e, "esc").expression = "var p=Math.min(1,Math.max(0,(time-" + t + ")/0.16)); p=p*p; var s=170-70*p; [s,s]";
  var op = "(time<" + t + " ? 0 : 100)*" + fade(b);
  tr(aro, "op").expression = op; tr(l, "op").expression = op;
  vida(e, t, b + 0.3); vida(aro, t, b + 0.3); vida(l, t, b + 0.3);
  GLITCHES.push(t);
  return e;
}
function marcaClaude(g, cx, cy, larg, t, b, arq) {
  var l = imagem(arq); filho(l, g); tr(l, "pos").setValue([cx, cy]);
  var e = larg / 800 * 100;
  tr(l, "esc").expression = "var s=" + e.toFixed(2) + "*(0.5+0.5*" + expo(t, 0.5) + "); [s,s]";
  tr(l, "rot").expression = "-90*(1-" + expo(t, 0.8) + ") + Math.max(0,time-" + t + ")*12";   // o do Claude gira (case NRR Day)
  tr(l, "op").expression = "100*Math.min(1,Math.max(0,(time-" + t + ")/0.1))*" + fade(b);
  vida(l, t, b + 0.3); ENTRADAS.push(t);
  return l;
}
// barra horizontal que cresce da esquerda até "vezes" a mediana
function barra(g, T, rotulo, vezes, cor, cy, t, b, txtCor) {
  var X0 = -400, UN = 330, w = vezes * UN, h = 120;
  var r = forma("rect", w, h, cor, { nome: "barra", raio: 20 }); filho(r, g);
  tr(r, "anc").setValue([-w / 2, 0]); tr(r, "pos").setValue([X0, cy]);
  tr(r, "esc").expression = "[100*" + expo(t, 0.9) + ", 100]";
  tr(r, "op").expression = "100*Math.min(1,Math.max(0,(time-" + t + ")/0.05))*" + fade(b);
  var l = texto(rotulo, { size: 52, style: "Bold", cor: txtCor, tracking: 0 }); filho(l, g);
  tr(l, "anc").setValue([tr(l, "anc").value[0] - l.largura / 2, tr(l, "anc").value[1]]);
  tr(l, "pos").setValue([X0, cy - h / 2 - 46]);
  tr(l, "op").expression = "100*Math.min(1,Math.max(0,(time-" + t + ")/0.15))*" + fade(b);
  vida(r, t, b + 0.3); vida(l, t, b + 0.3); ENTRADAS.push(t);
}
