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

// =============== TELA 0 (escuro): o estádio, já cheio no quadro 1 ===============
var T = TEMA.escuro, A = 0, B = 5.84;
fundo("escuro", A, B);
var g0 = grupo(A, B, 960, { gigante: true });
foto(g0, T, "img/nubank-parque-render.jpg", 0, -420, 800, 530, -0.8, B, { foco: [0.5, 0.5], de: [0, 0], rot: -2 });
pilula(g0, T, "R$ 50 milhões por ano", 0, -150, 640, 110, T.marca, "#FFFFFF", 2.64, B, { size: 52 });
linhas(g0, T, [
  [[["Como", 0.0, { ja: true }], ["que", 0.44], ["é", 0.58], ["possível", 0.64], ["um", 0.98], ["banco", 1.14, { g: true, marca: true }]], 104],
  [[["sem", 1.36], ["nenhuma", 1.54], ["agência", 1.88, { g: true, marca: true }]], 104],
  [[["pagar", 2.28], ["50", 2.64, { g: true, marca: true }], ["milhões", 3.1, { g: true, marca: true }], ["por", 3.62], ["ano", 3.96]], 96],
  [[["só", 4.2], ["pra", 4.5], ["dar", 4.66], ["nome", 4.8], ["a", 5.0], ["um", 5.1], ["estádio?", 5.16, { g: true, marca: true, pf: true }]], 88],
 ], 175, B);

// =============== TELA 1 (claro): sim, é o Nubank ===============
T = TEMA.claro; A = 5.86; B = 8.96;
fundo("claro", A, B, true);
var g1 = grupo(A, B, 960, { entra: "lado" });
MODO = "escala";
logoNu(g1, "img/nubank-roxo.png", 0, -330, 520, 6.87, B, { pulsa: true });
linhas(g1, T, [
  [[["Sim,", 5.9], ["estamos", 6.21], ["falando", 6.37], ["do", 6.71]], 96],
  [[["Nubank,", 6.87, { g: true, marca: true }]], 170],
  [[["no", 7.56], ["estádio", 7.65], ["do", 7.97], ["Palmeiras.", 8.07, { g: true, marca: true, pf: true }]], 96],
], 230, B);

// =============== TELA 2 (escuro): o estádio é só a ponta do iceberg (ilustração gerada no Gemini Image) ===============
T = TEMA.escuro; A = 8.98; B = 11.0;
fundo("escuro", A, B);
var g2 = grupo(A, B, 960, { entra: "zoom" });
MODO = "desfoque";
// começa colado na ponta do gelo e recua até mostrar a massa embaixo d'água quando ele diz "iceberg"
var ice = imagem("img/iceberg.png"); filho(ice, g2);
var eIce = 1200 / DIMS["img/iceberg.png"][0] * 100;
tr(ice, "anc").setValue([384, 370]);
tr(ice, "esc").expression = "var p=Math.min(1,Math.max(0,(time-9.7)/0.9)); p=p<0.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2; var s=" + (eIce * 2.4).toFixed(2) + "+(" + eIce.toFixed(2) + "-" + (eIce * 2.4).toFixed(2) + ")*p; [s,s]";
tr(ice, "pos").expression = "var p=Math.min(1,Math.max(0,(time-9.7)/0.9)); p=p<0.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2; [0, 60+(-447-60)*p]";
tr(ice, "op").expression = "100*Math.min(1,Math.max(0,(time-" + A + ")/0.15))*" + fade(B);
vida(ice, A, B + 0.3); ENTRADAS.push(A);
linhas(g2, T, [
  [[["Mas", 9.0], ["o", 9.13], ["estádio", 9.25], ["é", 9.59], ["só", 9.67]], 90],
  [[["a", 9.79], ["ponta", 9.97, { g: true, marca: true }], ["do", 10.19]], 120],
], -740, B);
linhas(g2, T, [
  [[["iceberg.", 10.29, { g: true, pf: true }]], 230],
], 640, B);

// =============== TELA 3 (claro): a regra do Banco Central e a licença que o Nubank não tinha ===============
T = TEMA.claro; A = 11.03; B = 18.15;
fundo("claro", A, B);
var g3 = grupo(A, B, 960, { sai: "zoom" });
MODO = "lado";
foto(g3, T, "img/manchete-bc-titulo.png", 0, -560, 940, Math.round(940 * DIMS["img/manchete-bc-titulo.png"][1] / DIMS["img/manchete-bc-titulo.png"][0]), 12.2, B, { foco: [0.5, 0.5], de: [0, -420], rot: 1.5 });
linhas(g3, T, [
  [[["Em", 11.05], ["novembro", 11.12, { g: true, marca: true }], ["do", 11.5], ["ano", 11.58], ["passado,", 11.68]], 84],
  [[["o", 12.14], ["Banco", 12.2, { g: true, marca: true }], ["Central", 12.3, { g: true, marca: true }], ["proibiu", 12.56]], 96],
  [[["quem", 13.16], ["não", 13.36], ["tem", 13.52], ["licença", 13.66, { g: true, marca: true }], ["de", 14.12], ["banco", 14.24]], 84],
  [[["de", 14.46], ["usar", 14.6], ["a", 14.76], ["palavra", 14.88], ["banco", 15.12, { g: true, marca: true, pf: true }]], 96],
  [[["no", 15.52], ["nome.", 15.78]], 96],
], 60, B);
linhas(g3, T, [
  [[["E", 16.34], ["o", 16.38], ["Nubank", 16.46, { g: true, marca: true }], ["não", 16.78], ["tinha", 17.1]], 96],
], 520, B);
carimbo(g3, "SEM LICENÇA", 0, 690, 17.42, B, 700);

// =============== TELA 4 (escuro): a empresa que todo mundo chama de banco podia ter que mudar de nome ===============
T = TEMA.escuro; A = 18.17; B = 22.68;
fundo("escuro", A, B);
var g4 = grupo(A, B, 960, { entra: "zoom", sai: "lado" });
MODO = "escala";
logoNu(g4, "img/nubank-branco.png", 0, -430, 560, 18.2, B, { glitch: 20.34 });
linhas(g4, T, [
  [[["Ou", 18.2], ["seja,", 18.28], ["a", 18.6], ["empresa", 18.72], ["que", 18.98]], 84],
  [[["todo", 19.16], ["mundo", 19.38], ["chama", 19.56], ["de", 19.82], ["banco", 19.98, { g: true, marca: true }]], 96],
  [[["corria", 20.34], ["o", 20.76], ["risco", 20.86, { g: true, marca: true }], ["de", 21.12], ["ter", 21.24], ["que", 21.38]], 84],
  [[["mudar", 21.48, { g: true, marca: true, pf: true }], ["de", 21.66, { pf: true }], ["nome.", 21.8, { g: true, marca: true, pf: true }]], 150],
], 260, B);

// =============== TELA 5 (claro): coincidência ou não, em 2026 o Nubank apareceu em tudo ===============
T = TEMA.claro; A = 22.7; B = 25.54;
fundo("claro", A, B, true);
var g5 = grupo(A, B, 960, { entra: "lado" });
MODO = "desfoque";
linhas(g5, T, [
  [[["Coincidência", 22.72, { g: true, marca: true, pf: true }], ["ou", 23.1], ["não,", 23.22]], 110],
  [[["em", 23.5], ["2026", 23.62, { g: true, marca: true, conta: [2020, 2026] }]], 220],
  [[["o", 24.28], ["Nubank", 24.5, { g: true, marca: true }], ["apareceu", 24.74]], 110],
  [[["em", 25.18], ["tudo.", 25.32, { g: true, marca: true, pf: true }]], 180],
], 0, B);

// =============== TELA 6 (escuro): F1, Messi, Palmeiras e o Fred ===============
T = TEMA.escuro; A = 25.56; B = 34.3;
fundo("escuro", A, B);
var g6 = grupo(A, B, 960, { sai: "lado" });
MODO = "sobe";
// cada foto entra no tempo em que é dita, em leque
foto(g6, T, "img/mercedes-nubank-anuncio.jpg", -215, -380, 470, 330, 26.04, B, { rot: -6, de: [-500, 300] });
credito(g6, T, "Fórmula 1 · Mercedes", -215, -185, 26.04, B);
foto(g6, T, "img/messi.jpg", 215, -380, 420, 330, 28.1, B, { rot: 5, de: [500, 300], foco: [0.5, 0.3] });
credito(g6, T, "Messi · Nu Stadium, Inter Miami", 215, -185, 28.1, B);
foto(g6, T, "img/nubank-parque.jpg", -215, 40, 470, 330, 28.68, B, { rot: 4, de: [-500, 300] });
credito(g6, T, "Nubank Parque · Palmeiras", -215, 235, 28.68, B);
foto(g6, T, "img/fred-bruno.jpg", 215, 40, 420, 330, 30.76, B, { rot: -5, de: [500, 300], foco: [0.5, 0.3] });
etiqueta(g6, T, "Fred Bruno", "ex-Desimpedidos", 215, 250, 30.9, B);
linhas(g6, T, [
  [[["corrigindo", 32.27], ["quem", 32.76], ["ainda", 32.86], ["fala", 33.02]], 96],
], 450, B);
linhas(g6, T, [
  [[["Allianz", 33.3, { g: true, marca: true }], ["Parque", 33.66, { g: true, marca: true }]], 130],
], 590, B);
risco(g6, 0, 590, 760, 33.95, B);

// =============== TELA 7 (claro): efeito da mera exposição ===============
T = TEMA.claro; A = 34.32; B = 41.87;
fundo("claro", A, B, true);
var g7 = grupo(A, B, 960, { entra: "lado" });
MODO = "escala";
// logos pequenos que vão se repetindo no fundo: quanto mais aparece, mais familiar
var GRADE = [[-380, -820], [380, 820], [0, -820], [0, 820], [380, -820], [-380, 820], [-380, -650], [380, 650], [0, -650], [0, 650], [380, -650], [-380, 650]];
for (var gi = 0; gi < GRADE.length; gi++) {
  var tg = 37.9 + gi * 0.28;
  var lg = imagem("img/nubank-roxo.png"); filho(lg, g7); var eg = 150 / DIMS["img/nubank-roxo.png"][0] * 100;
  tr(lg, "pos").setValue(GRADE[gi]);
  tr(lg, "esc").expression = "var s=" + eg.toFixed(3) + "*(0.5+0.5*" + expo(tg, 0.4) + "); [s,s]";
  tr(lg, "op").expression = "35*Math.min(1,Math.max(0,(time-" + tg + ")/0.1))*" + fade(B);
  vida(lg, tg, B + 0.3);
}
foto(g7, T, "img/zajonc.jpg", 0, -500, 420, 420, 34.9, 37.55, { foco: [0.5, 0.35], de: [0, 400] });
etiqueta(g7, T, "Robert Zajonc", "psicólogo, 1968", 0, -230, 35.84, 37.55);
linhas(g7, T, [
  [[["Isso", 34.35], ["tem", 34.48], ["nome", 34.66], ["na", 34.9], ["psicologia:", 35.02]], 84, 37.55],
  [[["efeito", 35.84, { g: true, marca: true }], ["da", 36.28], ["mera", 36.44, { g: true, marca: true, pf: true }]], 130, 37.55],
  [[["exposição.", 36.7, { g: true, marca: true, pf: true }]], 150, 37.55],
], 160, B);
linhas(g7, T, [
  [[["Quanto", 37.63], ["mais", 37.81], ["a", 38.01], ["gente", 38.15], ["vê", 38.25, { g: true, marca: true }]], 104],
  [[["uma", 38.39], ["marca,", 38.51]], 104],
  [[["mais", 38.99], ["a", 39.23], ["gente", 39.37], ["gosta", 39.49]], 104],
  [[["e", 39.73], ["confia", 39.83, { g: true, marca: true }], ["nela,", 40.09]], 130],
  [[["mesmo", 40.62], ["sem", 40.95], ["perceber.", 41.15, { g: true, marca: true, pf: true }]], 104],
], 40, B);

// =============== TELA 8 (escuro): falar mais alto que a crítica ===============
T = TEMA.escuro; A = 41.89; B = 46.23;
fundo("escuro", A, B);
var g8 = grupo(A, B, 960, { entra: "zoom", sai: "zoom" });
MODO = "desfoque";
linhas(g8, T, [
  [[["Quando", 41.91], ["seu", 42.05], ["nome", 42.27], ["tá", 42.49], ["sendo", 42.61]], 84],
  [[["questionado,", 42.83, { g: true, marca: true }]], 120],
  [[["o", 43.67], ["Nubank", 43.77, { g: true, marca: true }], ["mostrou", 44.07]], 96],
  [[["que", 44.49], ["dá", 44.61], ["pra", 44.71], ["falar", 44.83]], 96],
  [[["mais", 45.03, { g: true, marca: true }], ["alto", 45.25, { g: true, marca: true }]], 260],
  [[["que", 45.43], ["a", 45.53], ["crítica.", 45.61, { pf: true }]], 64],
], 0, B);

// =============== TELA 9 (claro): estratégia ou abafar a crítica? ===============
T = TEMA.claro; A = 46.25; B = 51.4;
fundo("claro", A, B);
var g9 = grupo(A, B, 960);
MODO = "lado";
linhas(g9, T, [
  [[["Agora", 46.27], ["me", 46.45], ["diz:", 46.63]], 96],
  [[["isso", 47.01], ["é", 47.29], ["estratégia", 47.37, { g: true, marca: true }]], 120],
  [[["de", 47.87], ["gente", 48.01, { pf: true }], ["grande", 48.25, { pf: true }]], 120],
  [[["ou", 48.65], ["é", 48.95], ["jeito", 49.09], ["de", 49.31]], 96],
  [[["abafar", 49.45, { g: true, marca: true }], ["a", 49.79], ["crítica?", 49.93, { g: true, marca: true }]], 120],
], -230, B);
pilula(g9, T, "ESTRATÉGIA", -225, 380, 400, 130, T.marca, "#FFFFFF", 47.37, B, { size: 52 });
pilula(g9, T, "ABAFAR", 225, 380, 400, 130, T.tinta, "#FFFFFF", 49.45, B, { size: 52 });
linhas(g9, T, [
  [[["Comenta", 50.54, { g: true, marca: true }], ["aí.", 50.78]], 110],
], 600, B);

// =============== TELA 10 (escuro): ficha técnica curta ===============
T = TEMA.escuro; A = 51.4; B = 55.4;
fundo("escuro", A, B);
var gF = grupo(A, B, 960);
var painel = forma("rect", 980, 1060, "#1E1229", { nome: "ficha", raio: 44 }); filho(painel, gF); tr(painel, "pos").setValue([0, 30]);
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
var cab2 = texto("Feito com o Claude", { size: 84, style: "Bold", cor: T.tinta }); filho(cab2, gF); tr(cab2, "pos").setValue([0, -305]);
tr(cab2, "op").expression = "100*Math.min(1,Math.max(0,(time-" + (A + 0.18) + ")/0.15))*" + fade(B); vida(cab2, A, B + 0.3);
for (var fi = 0; fi < FICHA.length; fi++) {
  var fy = -160 + fi * 122, tf = A + 0.3 + fi * 0.08;
  var bo = forma("ellipse", 80, 80, T.marca, { nome: "bolaFicha" }); filho(bo, gF); tr(bo, "pos").setValue([-380, fy]);
  var nf = nome("icf"); app.run("edit.pasteSvg", { svg: ICONES_V2[FICHA[fi][0]].replace('fill="currentColor"', 'fill="#13081E"'), name: nf });
  var gf = prender(comp.layer(nf)); filho(gf, gF); tr(gf, "anc").setValue([128, 128]); tr(gf, "esc").setValue([42 / 256 * 100, 42 / 256 * 100]); tr(gf, "pos").setValue([-380, fy]);
  var opf = "100*Math.min(1,Math.max(0,(time-" + tf + ")/0.15))*" + fade(B);
  tr(bo, "op").expression = opf; tr(gf, "op").expression = opf; vida(bo, tf, B + 0.3); vida(gf, tf, B + 0.3);
  textoEsq(gF, FICHA[fi][1], { size: 36, style: "Medium", cor: "#9C8CB0", tracking: 0 }, -300, fy - 26, tf);
  textoEsq(gF, FICHA[fi][2], { size: 50, style: "Bold", cor: fi >= 3 ? T.marca : T.tinta, tracking: 0 }, -300, fy + 24, tf + 0.04);
}

// =============== a logo dele, escrita à mão no fim ===============
fundo("escuro", 55.4, FIM);
CENA_ATUAL = null;
vinhetaLogo(55.55, W1 / 2, 940, 820);

var somIt = app.project.importFile(new ImportOptions(new File(PASTA + "mix.wav")));
var som = comp.layers.add(somIt); som.startTime = 0;
var rq = app.project.renderQueue.items.add(comp);
var om = rq.outputModule(1);
try { om.applyTemplate("H.264"); } catch (e) {}
om.file = new File("~/Downloads/Estudio/2026-10-20 - Nubank/Nubank.mp4");
app.project.save(new File(PASTA + "nubank.ecproj"));
writeLn("camadas " + comp.numLayers);
writeLn("glitches " + GLITCHES.join(","));
writeLn("entradas " + ENTRADAS.join(","));
writeLn("saidas " + SAIDAS.join(","));
