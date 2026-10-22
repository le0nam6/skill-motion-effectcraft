// Abertura branca do case NRR Day (v3, 17/10, referência Neto Editor @onetoeditor). Monta na comp atual (variável comp).
// Usado por teste-abertura.jsx (só a abertura) e por case.jsx (o vídeo inteiro).
// Se SAI_BRANCO estiver definido, o fundo branco sobe voando nesse instante junto com a última tela e revela o que está por baixo.
var CINZA_P = "#BDB6B7", AZUL = "#0D99FF";
var branco = forma("rect", W1 + 40, H1 + 40, "#FAFAFA", { nome: "branco" });
tr(branco, "pos").setValue([540, 960]); vida(branco, 0, FIM);
var grade = imagem("imagens/grade-linhas.png");
tr(grade, "pos").setValue([540, 1060]); tr(grade, "esc").setValue([50, 50]); vida(grade, 0, FIM);
tr(grade, "pos").expression = "value + [0, -time*14]";
// luz vermelha bem suave atrás do texto, que respira e anda devagar (na referência, a luz verde atrás de tudo)
var luzF = forma("ellipse", 980, 980, DEST, { nome: "luz" });
borra(luzF, [[0, 220]]); tr(luzF, "op").setValue(6); vida(luzF, 0, FIM);
tr(luzF, "pos").expression = "[540 + Math.sin(time*0.9)*80, 940 + Math.cos(time*0.7)*60]";
tr(luzF, "esc").expression = "var s=100+Math.sin(time*1.7)*8; [s,s]";

var MAXW = W1 - 2 * 110, GI = 0.3, GLITCHES = [];
function hsh() { return "function h(n){var v=Math.sin(n*12.9898+" + (Math.random() * 50).toFixed(2) + ")*43758.5453; return v-Math.floor(v);}"; }
// saída de cada tela: "voa" (o grupo sobe; a opacidade apaga junto) ou "apaga" (glitch: pisca e some, como deletado)
function saidaOp(b, modo) {
  if (modo === "apaga") return hsh() + "var k=Math.floor(time*30); if (time>=" + (b + 0.16) + ") 0; else if (time>=" + b + ") (h(k+5) > (time-" + b + ")/0.16 ? 1 : 0); else 1";
  return "time>=" + b + " ? Math.max(0,1-(time-" + b + ")/0.2) : 1";
}
// palavra: entra cinza e escurece (comum) ou pisca e fica (destaque, em vermelho ou preto)
function palavra(g, txt, a, cx, cy, sz, fit, o, b, modo) {
  var l = texto(txt, { size: sz, cor: o.marca ? DEST : TINTA, style: "Bold" });
  l.parent = g; tr(l, "esc").setValue([fit * 100, fit * 100]); tr(l, "pos").setValue([cx, cy]);
  var sai = saidaOp(b, modo);
  if (o.g) {
    tr(l, "op").expression = hsh() + "var k=Math.floor(time*30), v=1;" +
      (o.ja ? "" : "if (time<" + a + ") v=0;") +
      " if (time>=" + a + " && time<" + (a + GI) + ") v = h(k+3) < 0.2+0.8*(time-" + a + ")/" + GI + " ? 1 : 0;" +
      " var s=(function(){" + sai + "})(); 100*v*s";
    GLITCHES.push(a);
    vida(l, o.ja ? 0 : a, b + 0.25);
    return l;
  }
  var cz = texto(txt, { size: sz, cor: CINZA_P, style: "Bold" });
  cz.parent = g; tr(cz, "esc").setValue([fit * 100, fit * 100]); tr(cz, "pos").setValue([cx, cy]);
  cz.moveAfter(l);
  var sobe = "var p=Math.min(1,Math.max(0,(time-" + a + ")/0.35)); p=1-Math.pow(2,-10*p); value+[0,26*(1-p)]";
  tr(cz, "pos").expression = sobe; tr(l, "pos").expression = sobe;
  if (o.ja) { tr(l, "op").expression = "var s=(function(){" + sai + "})(); 100*s"; tr(cz, "op").setValue(0); }
  else {
    tr(cz, "op").expression = "var s=(function(){" + sai + "})(); 100*s*Math.min(1,Math.max(0,(time-" + a + ")/0.08))";
    tr(l, "op").expression = "var s=(function(){" + sai + "})(); 100*s*Math.min(1,Math.max(0,(time-" + (a + 0.12) + ")/0.22))";
  }
  vida(l, o.ja ? 0 : a, b + 0.25); vida(cz, o.ja ? 0 : a, b + 0.25);
  return l;
}
// uma tela: grupo que entra por baixo (ou já começa gigante encolhendo), faz zoom lento o tempo todo e sai voando ou apagando
function tela(linhas, cy, a, b, o) {
  o = o || {};
  var g = nulo(540, cy);
  var ent = o.gigante
    ? "var p=Math.min(1,Math.max(0,time/0.55)); p=1-Math.pow(2,-10*p); var s=(118-18*p)"
    : "var p=Math.min(1,Math.max(0,(time-" + a + ")/0.45)); p=1-Math.pow(2,-10*p); var s=(92+8*p)";
  tr(g, "esc").expression = ent + "*(1-0.03*Math.max(0,time-" + a + ")); [s,s]";
  var sobe = o.gigante ? "0" : "260*(1-Math.min(1,1-Math.pow(2,-10*Math.min(1,Math.max(0,(time-" + a + ")/0.45)))))";
  var voa = o.saida === "apaga" ? "0" : "(time>" + b + " ? -1500*Math.pow(Math.min(1,(time-" + b + ")/0.2),2) : 0)";
  tr(g, "pos").expression = "value + [0, " + sobe + " + " + voa + "]";
  // linhas empilhadas pelo tamanho real, com margem
  var ms = [];
  for (var i = 0; i < linhas.length; i++) {
    var ws = linhas[i][0], size = linhas[i][1], tot = 0, esp = size * 0.24, larg = [];
    for (var j = 0; j < ws.length; j++) {   // mede antes de criar (camada provisória)
      var tmp = texto(ws[j][0], { size: size, style: "Bold" }); larg.push(tmp.largura); tot += tmp.largura + (j ? esp : 0); tmp.remove();
    }
    var fit = Math.min(1, MAXW / tot);
    ms.push({ ws: ws, size: size, tot: tot, esp: esp, larg: larg, fit: fit, alt: size * fit });
  }
  var ys = [0];
  for (var k = 1; k < ms.length; k++) ys.push(ys[k - 1] + 0.98 * (ms[k - 1].alt + ms[k].alt) / 2);
  var off = (o.dy || 0) - ys[ys.length - 1] / 2, camadas = [];
  for (var q = 0; q < ms.length; q++) {
    var m = ms[q], x = 540 - m.tot * m.fit / 2;
    for (var w = 0; w < m.ws.length; w++) {
      var lw = m.larg[w] * m.fit;
      camadas.push(palavra(g, m.ws[w][0], m.ws[w][1], x + lw / 2 - 540, ys[q] + off, m.size, m.fit, m.ws[w][2] || {}, b, o.saida));
      x += lw + m.esp * m.fit;
    }
  }
  vida(g, 0, b + 0.3);
  g.camadas = camadas;
  return g;
}

// ---------------- tela 1: "Eu aposentei de vez" (quadro 1 já cheio, gigante e encolhendo) ----------------
tela([[[["Eu", 0.0, { ja: true }], ["aposentei", 0.21, { marca: true, g: true, ja: true }]], 300],
      [[["de", 0.87, { g: true }], ["vez", 0.97, { g: true }]], 300]], 960, 0.0, 1.20, { gigante: true });

// ---------------- tela 2: as três ferramentas; os ícones voam até o leque e o cursor seleciona tudo e apaga ----------------
var DEL = 4.12;   // a seleção é apagada
var g2 = tela([[[["o", 1.35], ["Figma,", 1.55, { g: true }]], 230],
               [[["Photoshop", 2.25, { g: true }]], 260],
               [[["e", 2.75], ["o", 3.21], ["After", 3.33, { g: true }], ["Effects", 3.57, { g: true }]], 260]], 960, 1.30, DEL, { saida: "apaga", dy: 110 });
// ícones (Kling 2.5, o último quadro fica): entram voando de baixo à esquerda, girando, com borrão, e assentam em leque
var ICS = [["clipes/ic-figma-fica.mp4", 1.55, -250, 20, -11], ["clipes/ic-photoshop-fica.mp4", 2.25, 0, -30, 0], ["clipes/ic-aftereffects-fica.mp4", 3.33, 250, 20, 11]];
for (var ii = 0; ii < ICS.length; ii++) {
  var I = ICS[ii], ic = imagem(I[0]), a0 = I[1];
  ic.parent = g2; ic.startTime = a0;
  tr(ic, "esc").setValue([52, 52]);   // o azulejo fica com ~260 px
  ic.blendingMode = BlendingMode.MULTIPLY;
  var px = I[2], py = -400 + I[3];
  tr(ic, "pos").setValue([px, py]);
  tr(ic, "pos").expression = "var p=Math.min(1,Math.max(0,(time-" + a0 + ")/0.5)); var e=1-Math.pow(2,-10*p); value+[-520*(1-e), 620*(1-e)]";
  tr(ic, "rot").expression = "var p=Math.min(1,Math.max(0,(time-" + a0 + ")/0.6)); var e=1-Math.pow(2,-10*p); " + I[4] + " - 38*(1-e)";
  tr(ic, "esc").expression = "var p=Math.min(1,Math.max(0,(time-" + a0 + ")/0.55)); var e=1-Math.pow(2,-9*p); var s=52*(0.55+0.45*e); [s,s]";
  tr(ic, "op").expression = "var s=(function(){" + saidaOp(DEL, "apaga") + "})(); 100*s*Math.min(1,Math.max(0,(time-" + a0 + ")/0.06))";
  ic.motionBlur = true;
  vida(ic, a0, DEL + 0.25);
}
// cursor e caixa de seleção do Figma: o cursor chega, arrasta a caixa em volta de tudo e solta; a seleção é apagada
var X0 = 150, Y0 = 330, X1 = 930, Y1 = 1360, TC0 = 3.40, TA = 3.66, TB = 4.02;
var cursorSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 2 L4 19.5 L8.6 15.1 L11.7 22 L14.8 20.6 L11.8 13.9 L18.2 13.9 Z" fill="#111111" stroke="#FFFFFF" stroke-width="1.3" stroke-linejoin="round"/></svg>';
var nc = nome("cursor"); app.run("edit.pasteSvg", { svg: cursorSvg, name: nc });
var cur = comp.layer(nc), rc = cur.sourceRectAtTime(0, false);
tr(cur, "anc").setValue([rc.left + rc.width * 0.02, rc.top + rc.height * 0.02]);
var eC = 78 / rc.height * 100; tr(cur, "esc").setValue([eC, eC]);
var caminho = "var t=time, x, y;" +
  "if (t<" + TA + ") { var p=Math.min(1,Math.max(0,(t-" + TC0 + ")/" + (TA - TC0) + ")); p = p<0.5 ? 4*p*p*p : 1-Math.pow(-2*p+2,3)/2; x=1150+(" + X0 + "-1150)*p; y=1750+(" + Y0 + "-1750)*p; }" +
  "else { var p=Math.min(1,Math.max(0,(t-" + TA + ")/" + (TB - TA) + ")); p = p<0.5 ? 4*p*p*p : 1-Math.pow(-2*p+2,3)/2; x=" + X0 + "+(" + (X1 - X0) + ")*p; y=" + Y0 + "+(" + (Y1 - Y0) + ")*p; }";
tr(cur, "pos").expression = caminho + "[x,y]";
tr(cur, "esc").expression = "var c=(time>" + TA + "-0.05 && time<" + TA + "+0.08) ? 0.86 : 1; [value[0]*c, value[1]*c]";   // o clique
tr(cur, "op").expression = "var s=(function(){" + saidaOp(DEL + 0.06, "apaga") + "})(); 100*s";
cur.motionBlur = true;
vida(cur, TC0, DEL + 0.3);
// a caixa: quatro bordas azuis e as alças nos cantos acompanham a ponta do cursor
var pc = "var p=Math.min(1,Math.max(0,(time-" + TA + ")/" + (TB - TA) + ")); p = p<0.5 ? 4*p*p*p : 1-Math.pow(-2*p+2,3)/2; var cx=" + X0 + "+(" + (X1 - X0) + ")*p, cy=" + Y0 + "+(" + (Y1 - Y0) + ")*p;";
var opSel = "var s=(function(){" + saidaOp(DEL, "apaga") + "})(); 100*s";
function borda(horiz, base) {
  var L = forma("rect", horiz ? (X1 - X0) : 4, horiz ? 4 : (Y1 - Y0), AZUL, { nome: "selecao" });
  tr(L, "anc").setValue(horiz ? [-(X1 - X0) / 2, 0] : [0, -(Y1 - Y0) / 2]);
  tr(L, "pos").expression = pc + base;
  tr(L, "esc").expression = pc + (horiz ? "[(cx-" + X0 + ")/" + (X1 - X0) + "*100, 100]" : "[100, (cy-" + Y0 + ")/" + (Y1 - Y0) + "*100]");
  tr(L, "op").expression = opSel;
  vida(L, TA, DEL + 0.25);
}
borda(true, "[" + X0 + "," + Y0 + "]"); borda(true, "[" + X0 + ", cy]"); borda(false, "[" + X0 + "," + Y0 + "]"); borda(false, "[cx," + Y0 + "]");
var cantos = ["[" + X0 + "," + Y0 + "]", "[cx," + Y0 + "]", "[" + X0 + ",cy]", "[cx,cy]"];
for (var hc = 0; hc < 4; hc++) {
  var hb = forma("rect", 20, 20, AZUL, { nome: "alca" }), hw = forma("rect", 13, 13, "#FFFFFF", { nome: "alcaMiolo" });
  tr(hb, "pos").expression = pc + cantos[hc]; tr(hw, "pos").expression = pc + cantos[hc];
  tr(hb, "op").expression = opSel; tr(hw, "op").expression = opSel;
  vida(hb, TA, DEL + 0.25); vida(hw, TA, DEL + 0.25);
}
cur.moveToBeginning();
GLITCHES.push(DEL);

// ---------------- tela 3: o resultado (entra por baixo; no impacto, um soco de escala) ----------------
var g3 = tela([[[["e", 4.43], ["esse", 4.60], ["foi", 4.92]], 190],
               [[["o", 5.14], ["resultado", 5.26, { marca: true, g: true }]], 300],
               [[["que", 5.74], ["eu", 5.94], ["tive.", 6.02]], 190]], 960, 4.38, 6.62);
var esc3 = tr(g3, "esc").expression;
tr(g3, "esc").expression = esc3.replace("[s,s]", "var q=time-6.33; var k = q>0 && q<0.5 ? 1+0.07*Math.exp(-q*9)*Math.cos(q*28) : 1; [s*k,s*k]");
writeLn("glitches " + GLITCHES.join(","));


// o fundo branco sobe voando (com a última tela) e revela a cena escura de baixo
if (typeof SAI_BRANCO !== "undefined" && SAI_BRANCO) {
  var voaB = "(time>" + SAI_BRANCO + " ? -2200*Math.pow(Math.min(1,(time-" + SAI_BRANCO + ")/0.3),2) : 0)";
  tr(branco, "pos").expression = "value + [0, " + voaB + "]";
  tr(grade, "pos").expression = "value + [0, -time*14 + " + voaB + "]";
  tr(luzF, "pos").expression = "[540 + Math.sin(time*0.9)*80, 940 + Math.cos(time*0.7)*60 + " + voaB + "]";
  vida(branco, 0, SAI_BRANCO + 0.32); vida(grade, 0, SAI_BRANCO + 0.32); vida(luzF, 0, SAI_BRANCO + 0.32);
}
