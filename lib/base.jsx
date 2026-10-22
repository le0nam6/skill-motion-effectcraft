// Funções comuns ao convite e à vinheta da logo (incluído com #include).
var COR = { escuro: "#151311", papel: "#F2EDE3", vermelho: "#C8352B", tinta: "#1A1816", cinza: "#8C857B", cinzaClaro: "#B9B1A6" };
var SERIFA = "SF Pro Display", SANS = "SF Pro Display"; // tudo em SF Pro (pedido do Leonam)
var PASTA = "~/Developer/artcraft/marketing-da-ilha/";
// cena 3D atual: tudo que for criado vira camada 3D presa ao nulo da cena (coordenadas de tela em volta dela)
var CENA_ATUAL = null, CENA_IDX = -1, CAMADAS_CENA = [];
// toda camada da cena fica registrada: na troca de cena a opacidade dela cai junto (expressão no fim)
function prender(l) {
  if (CENA_ATUAL) {
    l.threeDLayer = true; l.parent = CENA_ATUAL;
    (CAMADAS_CENA[CENA_IDX] = CAMADAS_CENA[CENA_IDX] || []).push(l);
  }
  return l;
}
var comp, FIM, W1, H1;
var conta = 0;
function nome(p) { conta++; return p + "_" + conta; }

function dims(prop) { var v = prop.value; return (v instanceof Array) ? v.length : 1; }
function suaviza(prop, inf) {
  inf = inf || 82;
  for (var i = 1; i <= prop.numKeys; i++) {
    var n = dims(prop), ok = false, tent = [n, 1, 2, 3];
    for (var j = 0; j < tent.length && !ok; j++) {
      var a = [], b = [];
      for (var d = 0; d < tent[j]; d++) { a.push(new KeyframeEase(0, inf)); b.push(new KeyframeEase(0, inf)); }
      try { prop.setTemporalEaseAtKey(i, a, b); ok = true; } catch (e) {}
    }
  }
}
function mola(prop, t, de, para, o) {
  o = o || {};
  var z = o.z || 0.55, w = o.w || 12, dur = Math.min(1.6, 5 / (z * w));
  var wd = w * Math.sqrt(1 - z * z), arr = (de instanceof Array);
  for (var f = 0; f <= Math.round(dur * 60); f++) {
    var tt = f / 60;
    var p = 1 - Math.exp(-z * w * tt) * (Math.cos(wd * tt) + (z * w / wd) * Math.sin(wd * tt));
    if (f === Math.round(dur * 60)) p = 1;
    var v;
    if (arr) { v = []; for (var d = 0; d < de.length; d++) v.push(de[d] + (para[d] - de[d]) * p); } else v = de + (para - de) * p;
    prop.setValueAtTime(t + tt, v);
  }
}
function K(prop, pares, inf) {
  for (var i = 0; i < pares.length; i++) prop.setValueAtTime(pares[i][0], pares[i][1]);
  suaviza(prop, inf);
  return prop;
}
function tr(l, n) {
  var m = { pos: "ADBE Position", esc: "ADBE Scale", op: "ADBE Opacity", rot: "ADBE Rotate Z", anc: "ADBE Anchor Point" };
  return l.property("ADBE Transform Group").property(m[n]);
}
function borra(l, pares) {
  var b = l.property("ADBE Effect Parade").addProperty("ADBE Gaussian Blur 2");
  K(b.property(1), pares, 70);
  return b;
}
function vida(l, a, b) { l.inPoint = Math.max(0, a); l.outPoint = Math.min(FIM, b); return l; }

function texto(t, o) {
  var n = nome(o.nome || "txt");
  var est = { Regular: "Semibold", Italic: "Bold", Medium: "Medium", Semibold: "Semibold", Bold: "Bold" }[o.style || "Regular"] || "Semibold";
  var p = { text: t, name: n, size: Math.round((o.size || 80) * 0.86), fill: o.cor || COR.papel, font: o.font || SERIFA, style: est, position: [0, 0], tracking: o.tracking !== undefined ? o.tracking : -25 };
  app.run("layer.newText", p);
  var l = comp.layer(n);
  var r = l.sourceRectAtTime(0, false);
  tr(l, "anc").setValue([r.left + r.width / 2, -p.size * 0.36]);
  l.motionBlur = true;
  l.largura = r.width;
  return prender(l);
}
function forma(kind, w, h, cor, o) {
  o = o || {};
  var n = nome(o.nome || "forma");
  var p = { kind: kind, name: n, size: [w, h], fill: cor, position: [W1 / 2, H1 / 2] };
  if (o.stroke) { p.stroke = o.stroke; p.strokeWidth = o.strokeWidth || 6; p.fillOpacity = 0; }
  app.run("layer.newShape", p);
  var l = comp.layer(n);
  if (o.raio !== undefined) app.run("prop.set", { layer: n, path: "contents/group/contents/rect/roundness", value: o.raio });
  l.motionBlur = true;
  return prender(l);
}
var itens = {};
function imagem(arquivo) {
  if (!itens[arquivo]) itens[arquivo] = app.project.importFile(new ImportOptions(new File(PASTA + arquivo)));
  var l = comp.layers.add(itens[arquivo]);
  l.motionBlur = true;
  return prender(l);
}
var camadaFundo = null; // camada acima da qual a aura deve ficar
function fundoTopo(l) { if (camadaFundo) l.moveBefore(camadaFundo); }
function nulo(x, y) {
  var n = nome("nulo");
  app.run("layer.newNull", { name: n });
  var l = comp.layer(n);
  prender(l);
  tr(l, "anc").setValue([0, 0]); // o nulo nasce com âncora em (50,50); os filhos ficariam 50 px fora do lugar
  tr(l, "pos").setValue([x, y]);
  return l;
}
function entra(l, t, x, y, o) {
  o = o || {};
  var dy = o.dy === undefined ? 70 : o.dy, d = o.dur || 0.42;
  mola(tr(l, "pos"), t, [x, y + dy], [x, y], { z: 0.7, w: 14.5 });
  K(tr(l, "op"), [[t, 0], [t + 0.22, 100]], 55);
  if (o.escala) mola(tr(l, "esc"), t, [Math.min(o.escala, 125), Math.min(o.escala, 125)], [100, 100], { z: 0.6, w: 14 });
  borra(l, [[t, o.borrao || 14], [t + 0.28, 0]]);
}
// saída como na referência: desfoca, sobe pouco e apaga rápido (acelera para fora: ease-in)
function sai(l, t, x, y, o) {
  o = o || {};
  var dy = o.dy === undefined ? -36 : o.dy, d = o.dur || 0.26;
  var P = tr(l, "pos");
  P.setValueAtTime(t, [x, y]); P.setValueAtTime(t + d, [x, y + dy]);
  var n = P.numKeys;
  try { P.setTemporalEaseAtKey(n - 1, [new KeyframeEase(0, 70)], [new KeyframeEase(0, 70)]); P.setTemporalEaseAtKey(n, [new KeyframeEase(0, 20)], [new KeyframeEase(0, 20)]); } catch (e) { suaviza(P, 60); }
  tr(l, "op").setValueAtTime(t, 100); tr(l, "op").setValueAtTime(t + d, 0);
  var fx = l.property("ADBE Effect Parade");
  var b = null;
  for (var i = 1; i <= fx.numProperties; i++) if (fx.property(i).matchName == "ADBE Gaussian Blur 2") b = fx.property(i);
  if (!b) b = fx.addProperty("ADBE Gaussian Blur 2");
  b.property(1).setValueAtTime(t, 0); b.property(1).setValueAtTime(t + d, 26);
}
// "pop" com sobra elástica: 0 → 115% → 96% → 100%, e um giro que assenta
function pop(l, t, alvo, o) {
  o = o || {};
  var e = alvo || 100;
  mola(tr(l, "esc"), t, [e * 0.55, e * 0.55], [e, e], { z: 0.5, w: 15 });
  if (o.giro) mola(tr(l, "rot"), t, o.giro > 0 ? 9 : -9, 0, { z: 0.5, w: 12 });
}
// flutuar devagar (vivo, sem parar), por expressão
function flutua(l, amp, vel) {
  tr(l, "pos").expression = "value + [0, Math.sin((time + " + (Math.random() * 6).toFixed(2) + ") * " + (vel || 1.6) + ") * " + (amp || 8) + "]";
}

// ---------------- vinheta da logo (leonam ⚡ alves), escrita à mão pelas linhas do vetor ----------------
// GLIFO_SVG (logo_svg.jsx): 12 SVGs na mesma tela de 4098x433, um por peça: l e o n a m ⚡ a l v e s
var CENTRO_LOGO = [2514, 288.77], LARG_LOGO = 5464.3; // o SVG vem em pt: 4098 × 4/3
function vinhetaLogo(t0, cx, cy, larguraPx, o) {
  o = o || {};
  var esc = larguraPx / LARG_LOGO * 100;          // escala das camadas
  var traco = 3.4 / (esc / 100);                    // espessura do traço na tela ≈ 2,4 px
  var mestre = nulo(cx, cy);
  // empurrão de câmera lento e contínuo do começo ao fim
  K(tr(mestre, "esc"), [[t0, [94, 94]], [FIM, [102, 102]]], 25);
  var ordem = [0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 6]; // o raio por último, como assinatura
  for (var k = 0; k < ordem.length; k++) {
    var i = ordem[k], raio = (i === 6);
    var n = nome("glifo");
    app.run("edit.pasteSvg", { svg: GLIFO_SVG[i], name: n });
    var l = comp.layer(n);
    tr(l, "anc").setValue(CENTRO_LOGO); l.parent = mestre;
    tr(l, "pos").setValue([0, 0]); tr(l, "esc").setValue([esc, esc]);
    l.motionBlur = true;
    var base = "contents/group/contents/group/contents/";
    var g = l.property("ADBE Root Vectors Group").property(1).property("ADBE Vectors Group").property(1).property("ADBE Vectors Group");
    var nPaths = 0; for (var q = 1; q <= g.numProperties; q++) if (g.property(q).matchName == "ADBE Vector Shape - Group") nPaths++;
    app.run("layer.addShapeItem", { layer: n, kind: "stroke", group: "contents/group/contents/group" });
    var tm = app.run("layer.addShapeItem", { layer: n, kind: "trim", group: "contents/group/contents/group" });
    app.run("prop.moveGroup", { layer: n, prop: tm.uid, index: nPaths + 1 });
    app.run("prop.set", { layer: n, path: base + "stroke/width", value: raio ? traco * 1.6 : traco });
    app.run("prop.set", { layer: n, path: base + "stroke/cap", value: 1 });
    if (raio) app.run("prop.set", { layer: n, path: base + "stroke/color", value: COR.vermelho });
    var t = raio ? t0 + 1.55 : t0 + k * 0.1, d = raio ? 0.32 : 0.8;
    // traço se escreve (entra e assenta suave), o preenchimento acende por cima, e o traço some
    var gl = g; // grupo interno: trim, fill e stroke ficam aqui
    var trim = gl.property("ADBE Vector Filter - Trim"), fill = gl.property("ADBE Vector Graphic - Fill"), st = gl.property("ADBE Vector Graphic - Stroke");
    K(trim.property("ADBE Vector Trim End"), [[t, 0], [t + d, 100]], 70);
    K(trim.property("ADBE Vector Trim Offset"), [[t, -25], [t + d, 0]], 70);
    K(fill.property("ADBE Vector Fill Opacity"), [[t + d * 0.55, 0], [t + d + 0.15, 100]], 60);
    K(st.property("ADBE Vector Stroke Opacity"), [[t + d, 100], [t + d + 0.35, 0]], 60);
    // leve subida de cada letra enquanto é escrita (dá corpo, sem chamar atenção)
    K(tr(l, "pos"), [[t, [0, 14]], [t + d + 0.2, [0, 0]]], 80);
    if (raio) {
      K(tr(l, "esc"), [[t + d, [esc, esc]], [t + d + 0.12, [esc * 1.18, esc * 1.18]], [t + d + 0.4, [esc, esc]]], 75);
    }
    vida(l, t, FIM);
  }
  // sublinhado vermelho que se desenha da esquerda para a direita e a assinatura
  if (o.assinatura === true) { // sem traço e sem assinatura (pedido do Leonam)
    var h = 433 * esc / 100;
    var tl = t0 + 1.75;
    var sub = forma("rect", larguraPx * 0.34, Math.max(3, larguraPx * 0.0035), COR.vermelho, { nome: "traco" });
    tr(sub, "anc").setValue([-larguraPx * 0.17, 0]);
    tr(sub, "pos").setValue([cx - larguraPx * 0.17, cy + h * 0.78]);
    K(tr(sub, "esc"), [[tl, [0, 100]], [tl + 0.6, [100, 100]]], 75);
    vida(sub, tl, FIM);
    var ass = texto("MARKETING DESCOMPLICADO", { size: Math.round(larguraPx * 0.026), font: SANS, style: "Semibold", cor: COR.cinzaClaro, tracking: 420 });
    entra(ass, tl + 0.25, cx, cy + h * 0.78 + larguraPx * 0.06, { dy: 18, dur: 0.6, borrao: 10 });
    vida(ass, tl + 0.2, FIM);
  }
  return mestre;
}
