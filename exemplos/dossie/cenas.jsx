// ---------------- peças deste vídeo ----------------
// DIMS (largura e altura de cada imagem) vem de dims.jsx, gerado pelo dims.py
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
function carimbo(g, txt, cx, cy, t, b, w) {
  var e = nulo(0, 0); filho(e, g); tr(e, "pos").setValue([cx, cy]);
  var vermelho = "#E5483A";
  var aro = forma("rect", w || 620, 150, vermelho, { nome: "aro", stroke: vermelho, strokeWidth: 12, raio: 18 }); filho(aro, e); tr(aro, "pos").setValue([0, 0]);
  var l = texto(txt, { size: 96, style: "Bold", cor: vermelho, tracking: 30 }); filho(l, e); tr(l, "pos").setValue([0, 6]);
  tr(e, "rot").setValue(-10);
  tr(e, "esc").expression = "var p=Math.min(1,Math.max(0,(time-" + t + ")/0.16)); p=p*p; var s=170-70*p; [s,s]";
  var op = "(time<" + t + " ? 0 : 100)*" + fade(b);
  tr(aro, "op").expression = op; tr(l, "op").expression = op;
  vida(e, t, b + 0.3); vida(aro, t, b + 0.3); vida(l, t, b + 0.3);
  GLITCHES.push(t);
  return e;
}
// logo do Nubank (PNG), grande e com mola; o.glitch faz piscar de tempos em tempos (o nome em risco)
function logoNu(g, arq, cx, cy, larg, t, b, o) {
  o = o || {};
  var l = imagem(arq); filho(l, g); var e = larg / DIMS[arq][0] * 100;
  tr(l, "pos").setValue([cx, cy]);
  tr(l, "esc").expression = "var s=" + e.toFixed(3) + "*(0.6+0.4*" + expo(t, 0.5) + ")" + (o.pulsa ? "*(1+0.03*Math.sin(Math.max(0,time-" + (t + 0.4) + ")*5))" : "") + "; [s,s]";
  var op = "100*Math.min(1,Math.max(0,(time-" + t + ")/0.1))*" + fade(o.sai || b);
  if (o.glitch) {
    tr(l, "op").expression = hsh() + "var k=Math.floor(time*24), v=1; if (time>" + o.glitch + " && h(k)<0.28) v=0.15; " + op + "*v";
    tr(l, "pos").expression = hsh() + "var k=Math.floor(time*24); value + ((time>" + o.glitch + " && h(k+7)<0.25) ? [(h(k+1)-0.5)*60, 0] : [0,0])";
    GLITCHES.push(o.glitch);
  } else tr(l, "op").expression = op;
  vida(l, t, (o.sai || b) + 0.3);
  ENTRADAS.push(t);
  return l;
}
// crédito pequeno embaixo da foto
function credito(g, T, txt, cx, cy, t, b) {
  var l = texto(txt, { size: 30, style: "Medium", cor: T.tinta, tracking: 0 }); filho(l, g); tr(l, "pos").setValue([cx, cy]);
  tr(l, "op").expression = "65*Math.min(1,Math.max(0,(time-" + (t + 0.3) + ")/0.2))*" + fade(b);
  vida(l, t, b + 0.3);
}
function foto(g, T, arq, cx, cy, w, h, t, b, o) { return cartao(g, T, arq, DIMS[arq][0], DIMS[arq][1], cx, cy, w, h, t, b, o); }
// risco vermelho que passa por cima de uma palavra (cresce da esquerda pra direita)
function risco(g, cx, cy, w, t, b) {
  var r = forma("rect", w, 14, "#E5483A", { nome: "risco", raio: 7 }); filho(r, g);
  tr(r, "anc").setValue([-w / 2, 0]); tr(r, "pos").setValue([cx - w / 2, cy]);
  tr(r, "esc").expression = "[100*" + expo(t, 0.35) + ", 100]";
  tr(r, "op").expression = "(time<" + t + " ? 0 : 100)*" + fade(b);
  vida(r, t, b + 0.3); GLITCHES.push(t);
}


// imagem com mola simples (peça gerada: prontuário, dossiê, transcrição, marca)
function peca(g, arq, cx, cy, larg, t, b, o) {
  o = o || {};
  var l = imagem(arq); filho(l, g); var e = larg / DIMS[arq][0] * 100;
  tr(l, "pos").setValue([cx, cy]);
  var de = o.de || [0, 160];
  tr(l, "pos").expression = "value + [" + de[0] + "*(1-" + expo(t, 0.5) + "), " + de[1] + "*(1-" + expo(t, 0.5) + ")]";
  tr(l, "esc").expression = "var p=Math.min(1,Math.max(0,(time-" + t + ")/0.5)); var m=1-Math.exp(-6*p)*Math.cos(9*p); var s=" + e.toFixed(3) + "*(0.6+0.4*m)" + (o.pulsa ? "*(1+0.03*Math.sin(Math.max(0,time-" + (t + 0.5) + ")*5))" : "") + "; [s,s]";
  tr(l, "rot").expression = (o.rot || 0) + " - 12*(1-" + expo(t, 0.6) + ")";
  var op = "100*Math.min(1,Math.max(0,(time-" + t + ")/0.1))*" + fade(o.sai || b);
  tr(l, "op").expression = op;
  vida(l, t, (o.sai || b) + 0.3); ENTRADAS.push(t);
  return l;
}
// balão de fala do cliente (a mesma história contada de novo)
function balao(g, T, txt, cx, cy, t, b, o) {
  o = o || {};
  var e = nulo(0, 0); filho(e, g); tr(e, "pos").setValue([cx, cy]);
  var l = texto(txt, { size: o.size || 44, style: "Semibold", cor: o.corTxt || T.tinta, tracking: 0 });
  var w = l.largura + 80, h = (o.size || 44) * 2.1;
  var r = forma("rect", w, h, o.cor || T.cartaoBorda, { nome: "balao", raio: h / 2 }); filho(r, e); tr(r, "pos").setValue([0, 0]);
  var bico = forma("rect", 34, 34, o.cor || T.cartaoBorda, { nome: "bico", raio: 6 }); filho(bico, e); tr(bico, "pos").setValue([-w / 2 + 70, h / 2 - 6]); tr(bico, "rot").setValue(45);
  filho(l, e); tr(l, "pos").setValue([0, 0]); r.moveAfter(l); bico.moveAfter(r);
  tr(e, "esc").expression = "var p=Math.min(1,Math.max(0,(time-" + t + ")/0.45)); var m=1-Math.exp(-6*p)*Math.cos(9*p); var s=100*(0.5+0.5*m); [s,s]";
  tr(e, "rot").expression = (o.rot || 0) + "";
  var op = "100*Math.min(1,Math.max(0,(time-" + t + ")/0.08))*" + fade(o.sai || b);
  tr(r, "op").expression = op; tr(bico, "op").expression = op; tr(l, "op").expression = op;
  var fimB = (o.sai || b) + 0.3; vida(e, t, fimB); vida(r, t, fimB); vida(bico, t, fimB); vida(l, t, fimB);
  ENTRADAS.push(t);
  return e;
}

// legendinha pequena embaixo: a fala inteira, em pedaços de até 6 palavras, no tempo da voz (pedido dele em 21/10)
function legenda(g, T, a, b) {
  var ws = []; for (var i = 0; i < PAL.length; i++) if (PAL[i][1] >= a - 0.05 && PAL[i][1] < b - 0.05) ws.push(PAL[i]);
  var pedacos = [], cur = [];
  for (var j = 0; j < ws.length; j++) {
    cur.push(ws[j]);
    var fimFrase = /[.,?!:]$/.test(ws[j][0]);
    if (cur.length >= 6 || (fimFrase && cur.length >= 3) || j == ws.length - 1) { pedacos.push(cur); cur = []; }
  }
  var modo = MODO; MODO = "sobe";
  for (var k = 0; k < pedacos.length; k++) {
    var p = pedacos[k], sai = k + 1 < pedacos.length ? pedacos[k + 1][0][1] - 0.02 : b, lin = [];
    for (var q = 0; q < p.length; q++) lin.push([p[q][0], p[q][1], { cor: T.tinta }]);
    linhas(g, T, [[lin, 40, sai]], 760, b);
  }
  MODO = modo;
}

// =============== TELA 0 (claro): o médico novo e o histórico de novo ===============
var T = TEMA.claro, A = 0, B = 5.98;
fundo("claro", A, B);
var g0 = grupo(A, B, 960, { gigante: true });
icone(g0, T, "stethoscope", -210, -420, 250, 0.0, "médico novo", B);
icone(g0, T, "chat-circle-text", 210, -420, 250, 2.12, "tudo de novo", B);
MODO = "sobe";
linhas(g0, T, [
  [[["Se", 0.0, { ja: true }], ["você", 0.0, { ja: true }], ["já", 0.0, { ja: true }], ["trocou", 0.64], ["de", 0.92], ["médico", 1.02, { g: true, marca: true }]], 110],
  [[["histórico", 2.12, { g: true, marca: true }], ["todo", 2.44], ["de", 2.96], ["novo,", 3.14]], 96],
], 60, B);
linhas(g0, T, [
  [[["é", 4.4], ["o", 4.86], ["cliente", 4.96], ["de", 5.26], ["uma", 5.36], ["agência.", 5.48, { g: true, marca: true, pf: true }]], 96],
], 420, B);
legenda(g0, T, A, B);

// =============== TELA 1 (escuro): dentro de uma agência, o tempo todo ===============
T = TEMA.escuro; A = 6.0; B = 8.92;
fundo("escuro", A, B, true);
var g1 = grupo(A, B, 960, { entra: "lado" });
iconeSobe(g1, T, "arrows-clockwise", 0, -380, 300, 6.68, "o tempo todo", B);
MODO = "escala";
linhas(g1, T, [
  [[["Dentro", 6.18], ["de", 6.48], ["uma", 6.56], ["agência,", 6.68, { g: true, marca: true }]], 110],
  [[["o", 7.84], ["tempo", 8.27], ["todo.", 8.46, { g: true, marca: true, pf: true }]], 150],
], 230, B);
legenda(g1, T, A, B);

// =============== TELA 2 (claro): comercial, operação, time novo ===============
T = TEMA.claro; A = 8.94; B = 15.7;
fundo("claro", A, B);
var g2 = grupo(A, B, 960, { entra: "zoom" });
icone(g2, T, "handshake", -300, -420, 210, 9.58, "comercial", B);
icone(g2, T, "gear", 0, -420, 210, 11.34, "operação", B);
icone(g2, T, "users-three", 300, -420, 210, 13.64, "time novo", B);
MODO = "desfoque";
linhas(g2, T, [
  [[["conta", 10.08], ["tudo,", 10.3, { g: true, marca: true }]], 110],
  [[["conta", 11.84], ["de", 12.04], ["novo,", 12.22, { g: true, marca: true }]], 110],
  [[["conta", 13.98], ["pela", 14.12], ["terceira", 14.36, { g: true, marca: true, pf: true }], ["vez.", 14.98, { g: true, marca: true, pf: true }]], 110],
], 160, B);
legenda(g2, T, A, B);

// =============== TELA 3 (escuro): a pesquisa da Harvard Business Review ===============
T = TEMA.escuro; A = 15.72; B = 20.68;
fundo("escuro", A, B);
var g3 = grupo(A, B, 960, { sai: "zoom" });
foto(g3, T, "img/hbr-2010.png", 0, -420, 380, 530, 16.44, B, { rot: -3, de: [0, -500] });
etiqueta(g3, T, "Harvard Business Review", "julho de 2010", 0, -110, 17.36, B);
MODO = "lado";
linhas(g3, T, [
  [[["ouviu", 18.34], ["mais", 18.68], ["de", 18.82]], 90],
  [[["75", 18.92, { g: true, marca: true, conta: [0, 75] }], ["mil", 19.54, { g: true, marca: true }], ["clientes.", 19.9]], 140],
], 260, B);
legenda(g3, T, A, B);

// =============== TELA 4 (claro): encantar quase não fideliza; o que faz ir embora é o esforço ===============
T = TEMA.claro; A = 20.7; B = 25.98;
fundo("claro", A, B, true);
var g4 = grupo(A, B, 960, { entra: "lado", sai: "lado" });
icone(g4, T, "heart", -210, -430, 240, 21.28, "encantar", B);
icone(g4, T, "warning", 210, -430, 240, 25.11, "esforço", B);
risco(g4, -210, -430, 280, 23.26, B);
MODO = "escala";
linhas(g4, T, [
  [[["encantar", 21.28, { g: true, marca: true }], ["o", 21.82], ["cliente", 21.94]], 96],
  [[["quase", 22.26], ["não", 22.52, { g: true, marca: true }], ["aumenta", 22.74], ["a", 23.18], ["lealdade.", 23.26]], 84],
], 40, B);
linhas(g4, T, [
  [[["O", 24.05], ["que", 24.09], ["faz", 24.19], ["ele", 24.39], ["ir", 24.53], ["embora", 24.63], ["é", 24.85], ["o", 25.03]], 74],
  [[["esforço.", 25.11, { g: true, marca: true, pf: true }]], 150],
], 400, B);
legenda(g4, T, A, B);

// =============== TELA 5 (escuro): diminuir a fricção na entrada ===============
T = TEMA.escuro; A = 26.0; B = 31.45;
fundo("escuro", A, B);
var g5 = grupo(A, B, 960, { entra: "zoom" });
icone(g5, T, "door-open", -210, -430, 240, 28.54, "a entrada", B);
icone(g5, T, "waves", 210, -430, 240, 30.7, "fluido", B);
MODO = "desfoque";
linhas(g5, T, [
  [[["diminuir", 26.94], ["a", 27.36], ["fricção", 27.48, { g: true, marca: true, pf: true }]], 120],
  [[["que", 27.78], ["o", 27.92], ["cliente", 27.98], ["tem", 28.26], ["na", 28.4], ["entrada.", 28.54]], 80],
], 40, B);
linhas(g5, T, [
  [[["Um", 28.86], ["bom", 29.38], ["onboarding", 29.56, { g: true, marca: true }], ["é", 30.5], ["fluido.", 30.7, { g: true, marca: true }]], 96],
], 380, B);
legenda(g5, T, A, B);

// =============== TELA 6 (claro): o prontuário vira o dossiê do cliente ===============
T = TEMA.claro; A = 31.47; B = 38.2;
fundo("claro", A, B, true);
var g6 = grupo(A, B, 960, { entra: "lado" });
peca(g6, "img/prontuario.png", -40, -360, 430, 32.64, B, { rot: -4, sai: 36.84 });
peca(g6, "img/dossie.png", 40, -350, 430, 36.84, B, { rot: 3, de: [500, 0] });
MODO = "sobe";
linhas(g6, T, [
  [[["No", 31.49], ["hospital,", 31.52], ["é", 32.48], ["o", 32.56], ["prontuário.", 32.64, { g: true, marca: true, pf: true }]], 100, 36.7],
], 300, B);
linhas(g6, T, [
  [[["Na", 36.77], ["nossa", 35.84], ["operação:", 36.06]], 84],
  [[["o", 36.77], ["dossiê", 36.84, { g: true, marca: true, pf: true }], ["do", 37.32], ["cliente.", 37.44, { g: true, marca: true }]], 120],
], 330, B);
legenda(g6, T, A, B);

// =============== TELA 7 (escuro): a IA puxa as transcrições dos gestores ===============
T = TEMA.escuro; A = 38.23; B = 42.9;
fundo("escuro", A, B);
var g7 = grupo(A, B, 960);
var TR = [[-150, -600, -6, 39.31], [150, -520, 5, 39.81], [-140, -400, 4, 40.43], [160, -320, -4, 40.95]];
for (var ti = 0; ti < TR.length; ti++) peca(g7, "img/transcricao-" + (ti + 1) + ".png", TR[ti][0], TR[ti][1], 480, TR[ti][3], B, { rot: TR[ti][2], de: [TR[ti][0] > 0 ? 500 : -500, 0] });
MODO = "lado";
linhas(g7, T, [
  [[["Liguei", 38.25], ["uma", 38.43], ["IA", 38.59, { g: true, marca: true }]], 110],
  [[["nas", 39.15], ["transcrições", 39.31, { g: true, marca: true }]], 96],
  [[["dos", 40.85], ["gestores", 40.95, { g: true, marca: true }], ["de", 41.25], ["projetos.", 41.39]], 84],
], 250, B);
legenda(g7, T, A, B);

// =============== TELA 8 (claro): a reunião acaba e o dossiê se atualiza ===============
T = TEMA.claro; A = 42.93; B = 50.05;
fundo("claro", A, B, true);
var g8 = grupo(A, B, 960, { entra: "lado", sai: "zoom" });
MODO = "escala";
linhas(g8, T, [
  [[["A", 43.02], ["reunião", 43.1], ["acaba,", 43.36, { g: true, marca: true }]], 110],
  [[["ela", 44.05], ["atualiza", 44.22], ["o", 44.64], ["dossiê:", 44.72, { g: true, marca: true, pf: true }]], 96],
], -470, B);
icone(g8, T, "chats", -330, -60, 190, 45.46, "o que foi falado", B);
icone(g8, T, "smiley", -110, 180, 190, 46.56, "como reagiu", B);
icone(g8, T, "hourglass", 110, -60, 190, 47.6, "o que ficou pendente", B);
icone(g8, T, "arrow-right", 330, 180, 190, 49.0, "próximos passos", B);
legenda(g8, T, A, B);

// =============== TELA 9 (escuro): quem pega o cliente já chega sabendo do contexto ===============
T = TEMA.escuro; A = 50.09; B = 54.83;
fundo("escuro", A, B);
var g9 = grupo(A, B, 960, { entra: "zoom" });
iconeSobe(g9, T, "check-circle", 0, -420, 280, 51.84, "contexto", B);
balao(g9, T, "Deixa eu te contar desde o começo…", 0, 400, 50.2, B, { size: 44, cor: "#2A2724", corTxt: "#F3EFE6" });
risco(g9, 0, 400, 760, 53.34, B);
MODO = "desfoque";
linhas(g9, T, [
  [[["já", 50.88], ["chega", 51.04], ["sabendo", 51.22], ["do", 51.72], ["contexto,", 51.84, { g: true, marca: true }]], 96],
  [[["sem", 52.9], ["contar", 53.34], ["tudo", 53.62], ["de", 54.04], ["novo.", 54.2, { g: true, marca: true }]], 96],
], 60, B);
legenda(g9, T, A, B);

// =============== TELA 10 (claro): CTA, comenta DOSSIÊ e entra na InsidersAI ===============
T = TEMA.claro; A = 54.85; B = 60.72;
fundo("claro", A, B, true);
var gC = grupo(A, B, 960, { entra: "lado" });
MODO = "sobe";
linhas(gC, T, [
  [[["Quer", 54.87], ["aprender", 54.9], ["a", 55.12], ["fazer", 55.24], ["isso?", 55.38, { g: true, marca: true }]], 96],
  [[["Comenta", 55.56], ["a", 56.13], ["palavra", 56.23]], 84],
], -560, B);
pilula(gC, T, "DOSSIÊ", 0, -300, 680, 200, T.marca, "#FFFFFF", 56.47, B, { size: 130, pulsa: true });
icone(gC, T, "hand-pointing", 360, -190, 130, 56.6, "", B);
peca(gC, "img/insiders-escura.png", 0, 160, 760, 58.67, B, { pulsa: true });
linhas(gC, T, [
  [[["que", 56.97], ["eu", 57.15], ["te", 57.21], ["mando", 57.29], ["o", 57.49], ["link", 57.57, { g: true, marca: true }]], 74],
], 420, B);
legenda(gC, T, A, B);

// =============== TELA 10 (escuro): ficha técnica curta ===============
T = TEMA.escuro; A = 60.75; B = 64.75;
fundo("escuro", A, B);
var gF = grupo(A, B, 960);
var painel = forma("rect", 980, 1060, "#24211E", { nome: "ficha", raio: 44 }); filho(painel, gF); tr(painel, "pos").setValue([0, 30]);
vida(painel, A, B + 0.3);
function textoEsq(g, txt, o, x, y, t) {
  var l = texto(txt, o); filho(l, g);
  tr(l, "anc").setValue([tr(l, "anc").value[0] - l.largura / 2, tr(l, "anc").value[1]]);
  tr(l, "pos").setValue([x, y]);
  tr(l, "pos").expression = "value+[0,18*(1-" + expo(t, 0.35) + ")]";
  tr(l, "op").expression = "100*Math.min(1,Math.max(0,(time-" + t + ")/0.15))*" + fade(B);
  vida(l, t, B + 0.3);
  return l;
}
var cab = texto("FICHA TÉCNICA", { size: 34, style: "Bold", cor: T.marca, tracking: 300 }); filho(cab, gF); tr(cab, "pos").setValue([0, -400]);
tr(cab, "op").expression = "100*Math.min(1,Math.max(0,(time-" + (A + 0.1) + ")/0.15))*" + fade(B); vida(cab, A, B + 0.3);
var cab2 = texto("Quanto custou", { size: 84, style: "Bold", cor: T.tinta }); filho(cab2, gF); tr(cab2, "pos").setValue([0, -305]);
tr(cab2, "op").expression = "100*Math.min(1,Math.max(0,(time-" + (A + 0.18) + ")/0.15))*" + fade(B); vida(cab2, A, B + 0.3);
for (var fi = 0; fi < FICHA.length; fi++) {
  var fy = -160 + fi * 122, tf = A + 0.3 + fi * 0.08;
  var bo = forma("ellipse", 80, 80, T.marca, { nome: "bolaFicha" }); filho(bo, gF); tr(bo, "pos").setValue([-380, fy]);
  var nf = nome("icf"); app.run("edit.pasteSvg", { svg: ICONES_V2[FICHA[fi][0]].replace('fill="currentColor"', 'fill="#151412"'), name: nf });
  var gf = prender(comp.layer(nf)); filho(gf, gF); tr(gf, "anc").setValue([128, 128]); tr(gf, "esc").setValue([42 / 256 * 100, 42 / 256 * 100]); tr(gf, "pos").setValue([-380, fy]);
  var opf = "100*Math.min(1,Math.max(0,(time-" + tf + ")/0.15))*" + fade(B);
  tr(bo, "op").expression = opf; tr(gf, "op").expression = opf; vida(bo, tf, B + 0.3); vida(gf, tf, B + 0.3);
  textoEsq(gF, FICHA[fi][1], { size: 36, style: "Medium", cor: "#9A9389", tracking: 0 }, -300, fy - 26, tf);
  textoEsq(gF, FICHA[fi][2], { size: 50, style: "Bold", cor: fi >= 3 ? T.marca : T.tinta, tracking: 0 }, -300, fy + 24, tf + 0.04);
}

// =============== a logo dele, escrita à mão no fim ===============
fundo("escuro", 64.75, FIM);
CENA_ATUAL = null;
vinhetaLogo(64.9, W1 / 2, 940, 820);

var somIt = app.project.importFile(new ImportOptions(new File(PASTA + "mix.wav")));
var som = comp.layers.add(somIt); som.startTime = 0;
var rq = app.project.renderQueue.items.add(comp);
var om = rq.outputModule(1);
try { om.applyTemplate("H.264"); } catch (e) {}
om.file = new File("~/Downloads/Estudio/2026-10-21 - Dossiê do cliente/Dossie.mp4");
app.project.save(new File(PASTA + "dossie.ecproj"));
writeLn("camadas " + comp.numLayers);
writeLn("glitches " + GLITCHES.join(","));
writeLn("entradas " + ENTRADAS.join(","));
writeLn("saidas " + SAIDAS.join(","));
