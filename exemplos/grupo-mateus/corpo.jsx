// ============================== CENAS do #02 (tempos da narração take_a; V() soma o OFF) ==============================

// --- utilidades deste episódio ---
function h01(n) { var v = Math.sin(n * 12.9898 + 7.13) * 43758.5453; return v - Math.floor(v); }
function glitch(l, a, d, amp, op) {
  var h = "function h(n){var v=Math.sin(n*12.9898+" + (Math.random() * 50).toFixed(2) + ")*43758.5453; return v-Math.floor(v);}";
  tr(l, "pos").expression = h + "var q=(time-" + a.toFixed(3) + ")/" + d + "; if (q<0||q>1) value; else { var k=Math.floor(time*24); var f=1-q; value+[(h(k)-0.5)*" + amp + "*f, (h(k+7)-0.5)*" + (amp * 0.25) + "*f]; }";
  if (op) tr(l, "op").expression = h + "var q=(time-" + a.toFixed(3) + ")/" + d + "; if (q<0) 0; else if (q>1) value; else (h(Math.floor(time*24)+3) > 0.35*(1-q) ? value : 0)";
}
// caminho por expressão (sem chaves espaciais, que fazem barriga): pontos [t, x, y] com ease in-out entre eles
function caminho(l, pts) {
  var s = "var P=[" + pts.map(function (p) { return "[" + p.join(",") + "]"; }).join(",") + "];" +
    "var i=0; while (i<P.length-2 && time>P[i+1][0]) i++; var a=P[i], b=P[i+1];" +
    "var p=Math.min(1,Math.max(0,(time-a[0])/(b[0]-a[0]))); p = p<0.5 ? 4*p*p*p : 1-Math.pow(-2*p+2,3)/2;" +
    "[a[1]+(b[1]-a[1])*p, a[2]+(b[2]-a[2])*p, value[2]]";
  tr(l, "pos").expression = s;
}
// pulso contínuo de escala (anel de Wi-Fi, botão)
function pulsa(l, t0, amp, vel) {
  tr(l, "esc").expression = "var d=time-" + t0.toFixed(3) + "; d>0 ? value*(1+" + (amp || 0.04) + "*Math.max(0,Math.sin(d*" + (vel || 6) + "))) : value";
}
function retangulo(w, h, cor, x, y, raio, nm) {
  var r = forma("rect", w, h, cor, { raio: raio || 0, nome: nm || "ret" });
  tr(r, "pos").setValue([x, y]);
  return r;
}
// texto alinhado à esquerda a partir de x
function textoEsq(t, o, x, y) {
  var l = texto(t, o);
  tr(l, "anc").setValue([tr(l, "anc").value[0] - l.largura / 2, tr(l, "anc").value[1]]);
  tr(l, "pos").setValue([x, y]);
  return l;
}
function aparece(l, t, fim, o) {  // entrada com mola de escala + opacidade, para formas
  o = o || {};
  pop(l, t, o.esc || 100);
  K(tr(l, "op"), [[t, 0], [t + 0.12, o.op || 100]], 50);
  vida(l, t, fim);
  return l;
}

// --- ícones de traço que se desenham (como na referência: linha fina na cor de destaque, com brilho) ---
// Tabler Icons (outline, MIT). Nomes antigos (Phosphor) → traço
var TRACO = { "wifi-high": "wifi", "ticket": "ticket", "device-mobile": "celular", "shopping-cart": "carrinho", "storefront": "loja",
  "user-circle": "usuario", "database": "banco", "megaphone": "megafone", "monitor-play": "tela", "whatsapp-logo": "whats",
  "chat-circle-text": "chat", "user-plus": "seguir", "tag": "tag", "map-pin": "pin", "trophy": "trofeu", "eye": "olho",
  "clock": "relogio", "coins": "moedas", "cpu": "cpu", "play": "play", "sparkle": "estrela", "calendar-star": "calendario",
  "list-bullets": "lista", "bell-ringing": "sino" };
function svgTraco(chave, cor) {
  var ic = LINHAS[chave], body = "";
  for (var i = 0; i < ic.paths.length; i++) body += '<path d="' + ic.paths[i] + '" fill="none" stroke="' + cor + '" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>';
  return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">' + body + '</svg>';
}
iconeFlat = function (nomeIc, x, y, diam, t, o) {
  o = o || {};
  var chave = TRACO[nomeIc] || "estrela";
  var g = nulo(x, y);
  var partes = [];
  // com fundo (diagramas): disco cheio e o traço escuro por cima; sem fundo (na frase): só o traço com brilho
  var corTraco = o.fundo ? (o.glifo || "#111111") : (o.cor || ROSA);
  if (o.fundo) {
    var bola = forma("ellipse", diam, diam, o.fundo, { nome: "disco" }); bola.parent = g; tr(bola, "pos").setValue([0, 0]); partes.push(bola);
  }
  var n = nome("traco");
  app.run("edit.pasteSvg", { svg: svgTraco(chave, corTraco), name: n });
  var l = prender(comp.layer(n)); l.parent = g;
  var esc = (o.fundo ? diam * 0.58 : diam * 0.95) / 24 * 100;
  // amplia por dentro (escala de cada grupo do desenho), não pela camada: efeito em camada ampliada 3× estoura a memória no 4K
  var raiz = l.property("ADBE Root Vectors Group");
  for (var gq = 1; gq <= raiz.numProperties; gq++) {
    var grp = raiz.property(gq);
    if (grp.matchName != "ADBE Vector Group") continue;
    grp.property("ADBE Vector Transform Group").property("ADBE Vector Scale").setValue([esc, esc]);
    // o traço engrossa junto com a escala do grupo; mantém a espessura visual de 1,7 do ícone
  }
  tr(l, "anc").setValue([12 * esc / 100, 12 * esc / 100]); tr(l, "pos").setValue([0, 0]);
  l.motionBlur = true;
  app.run("layer.addShapeItem", { layer: n, kind: "trim" });
  var tm = l.property("ADBE Root Vectors Group").property("ADBE Vector Filter - Trim");
  K(tm.property("ADBE Vector Trim End"), [[t, 0], [t + 0.55, 100]], 75);  // o traço se desenha (ease-out)
  if (!o.fundo) brilho(l, diam * 0.22, 1.1);
  partes.push(l);
  pop(g, t, 100, { giro: o.giro === undefined ? -8 : o.giro });
  for (var v = 0; v < partes.length; v++) {
    K(tr(partes[v], "op"), [[t, 0], [t + 0.1, 100]], 50);
    if (o.sai) { tr(partes[v], "op").setValueAtTime(o.sai, 100); tr(partes[v], "op").setValueAtTime(o.sai + 0.24, 0); }
    vida(partes[v], t, o.sai ? o.sai + 0.35 : (o.fim || FIM));
  }
  vida(g, t, o.sai ? o.sai + 0.35 : (o.fim || FIM));
  g.camadas = partes;
  return g;
};
// logo do Grupo Mateus em branco, grande, entrando com mola e desfoque
function logoMateus(x, y, w, t, fim, saida) {
  var n = nome("logoMateus");
  app.run("edit.pasteSvg", { svg: MATEUS_SVG, name: n });
  var l = prender(comp.layer(n));
  var e = w / MATEUS_W * 100;
  tr(l, "anc").setValue([MATEUS_W / 2, MATEUS_H / 2]);
  tr(l, "pos").setValue([x, y]);
  mola(tr(l, "esc"), t, [e * 0.7, e * 0.7], [e, e], { z: 0.6, w: 13 });
  K(tr(l, "op"), [[t, 0], [t + 0.18, 100]], 55);
  borra(l, [[t, 18], [t + 0.3, 0]]);
  if (saida) { tr(l, "op").setValueAtTime(saida, 100); tr(l, "op").setValueAtTime(saida + 0.26, 0); }
  l.motionBlur = true;
  vida(l, t, saida ? saida + 0.3 : fim);
  return l;
}

// =============== CENA 0 — gancho com o corredor de supermercado (Veo 3.1) ===============
cena(0, 0, 0, 0);
var F0 = V(9.0);
// clipe do Veo em 2D (fora da câmera), escurecido para o texto ler; apaga com a cena
var cg0 = CENA_ATUAL; CENA_ATUAL = null;
var clip = imagem("abertura.mp4");
tr(clip, "pos").setValue([540, 960]);
var it0 = itens["abertura.mp4"]; var ec0 = Math.max(1080 / it0.width, 1920 / it0.height) * 100;
tr(clip, "esc").setValue([ec0 * 1.22, ec0 * 1.22]); // o Veo veio com faixas pretas em cima e embaixo
K(tr(clip, "esc"), [[0, [ec0 * 1.22, ec0 * 1.22]], [9, [ec0 * 1.3, ec0 * 1.3]]], 20); // empurrão lento
K(tr(clip, "op"), [[0, 0], [0.35, 100]], 60);
vida(clip, 0, F0);
var veu0 = retangulo(1080, 1920, FUNDO, 540, 960, 0, "veu0"); tr(veu0, "op").setValue(58); vida(veu0, 0, F0);
CENA_ATUAL = cg0; (CAMADAS_CENA[0] = CAMADAS_CENA[0] || []).push(clip, veu0);
linha([["Você", 0.20], ["sabia", 0.31], ["que", 0.70], ["o", 0.93]], 714, { size: 74, saida: V(4.50) });
logoMateus(540, 832, 640, V(1.05), F0, V(4.52)); // "o Grupo Mateus" com a logo, em branco
linha([["sabe", 1.93], ["quem", 2.17], ["você", 2.45, { style: "Bold" }], ["é", 2.71, { style: "Bold" }]], 937, { size: 84, saida: V(4.54) });
linha([["no", 2.82], ["minuto", 2.96], ["em", 3.30], ["que", 3.48], ["você", 3.64]], 1015, { size: 70, saida: V(4.56) });
linha([["entra", 3.85], ["na", 4.12], ["loja", 4.24, { style: "Bold" }], ["@storefront", 4.26]], 1086, { size: 70, saida: V(4.58) });
linha([["e", 4.70], ["ainda", 4.90], ["manda", 5.04], ["um", 5.32]], 772, { size: 80, fim: F0 });
linha([["@ticket", 5.40], ["cupom", 5.43, { marca: true }]], 884, { size: 140, fim: F0 });
linha([["pro", 5.75], ["seu", 6.07], ["celular", 6.16, { style: "Bold" }], ["@device-mobile", 6.18]], 996, { size: 80, fim: F0 });
linha([["antes", 6.66], ["de", 7.01], ["você", 7.09]], 1077, { size: 80, fim: F0 });
linha([["chegar", 7.34], ["no", 7.71], ["caixa?", 7.83, { style: "Bold" }], ["@shopping-cart", 7.86]], 1158, { size: 80, fim: F0 });

// =============== CENA 1 — o app Mateus Mais (glossário com foto real da loja) ===============
cena(1, 1700, -500, -3200);
var F1 = V(12.9);
var glo = glossario("loja.jpg", 540, 650, 820, 467, V(8.45), "Mateus Mais", "O app de compras e ofertas da rede", F1);
var cred1 = texto("Foto: divulgação / Mercado&Consumo", { size: 22, style: "Medium", cor: "#8C857B", tracking: 0 });
tr(cred1, "pos").setValue([540, 1230]); K(tr(cred1, "op"), [[V(9.0), 0], [V(9.3), 100]], 60); vida(cred1, V(9.0), F1);
linha([["@device-mobile", 9.22], ["aplicativo", 9.22, { style: "Bold" }], ["de", 9.94], ["compras", 10.08], ["e", 10.61], ["ofertas", 10.65]], 1330, { size: 52, fim: F1 });
// o ícone oficial do app (Google Play) entra quando a narração diz "Mateus Mais"
function iconeApp(x, y, lado, t, fim) {
  var l = imagem("mateusmais.png"); var e = lado / itens["mateusmais.png"].width * 100;
  tr(l, "pos").setValue([x, y]); pop(l, t, e, { giro: -10 });
  K(tr(l, "op"), [[t, 0], [t + 0.12, 100]], 50); vida(l, t, fim);
  return l;
}
var appG = iconeApp(540, 1480, 150, V(11.40), F1); brilho(appG, 40, 0.5);

// =============== CENA 2 — planta da loja: Wi-Fi reconhece, cruza histórico e corredor, cupom chega ===============
cena(2, -300, -1100, -6400);
var F2 = V(24.2);
linha([["Quando", 12.34], ["você", 12.75], ["conecta", 13.02], ["no", 13.49], ["@wifi-high", 13.55], ["Wi-Fi", 13.62, { style: "Bold" }]], 330, { size: 66, saida: V(14.75) });
linha([["o", 14.81], ["sistema", 14.87], ["te", 15.28], ["reconhece", 15.40, { marca: true }], ["@user-circle", 15.45]], 330, { size: 66, saida: V(16.0) });
linha([["cruza", 16.07], ["com", 16.36], ["o", 16.54], ["que", 16.60], ["você", 16.79], ["costuma", 17.17], ["comprar", 17.40, { style: "Bold" }]], 330, { size: 58, saida: V(17.75) });
linha([["e", 17.80], ["até", 18.00], ["com", 18.08], ["o", 18.29], ["corredor", 18.36, { marca: true }], ["por", 18.92], ["onde", 19.17], ["você", 19.43], ["passa", 19.73]], 330, { size: 56, saida: V(20.5) });
linha([["Aí", 20.60], ["o", 20.80], ["@ticket", 20.83], ["cupom", 20.85, { marca: true }], ["chega", 21.27]], 314, { size: 70, fim: F2 });
linha([["na", 21.69], ["hora", 21.86, { style: "Bold" }], ["e", 22.23], ["no", 22.28], ["lugar", 22.45, { style: "Bold" }], ["certo.", 22.91, { style: "Bold" }]], 385, { size: 70, fim: F2 });
// planta vista de cima: ilustração gerada no Gemini 3 Pro Image (1024 px) a 80% → coordenadas da imagem viram tela por U()
var tP = V(12.45);
var PX = 540, PY = 1040, PE = 0.8;
function U(u, v) { return [PX + (u - 512) * PE, PY + (v - 512) * PE]; }
var planta = nulo(PX, PY);
var plantaImg = imagem("planta.jpg"); plantaImg.parent = planta;
tr(plantaImg, "pos").setValue([0, 0]); tr(plantaImg, "esc").setValue([PE * 100, PE * 100]);
K(tr(plantaImg, "op"), [[tP, 0], [tP + 0.3, 100]], 60); vida(plantaImg, tP, F2);
mola(tr(planta, "esc"), tP, [92, 92], [100, 100], { z: 0.7, w: 12 });
var gond = [plantaImg];
// Wi-Fi: ícone no teto da loja e anéis que pulsam a partir de "Wi-Fi"
var tW = V(13.62);
var pW = U(660, 330); var wifi = iconeFlat("wifi-high", pW[0], pW[1], 90, tW, { fim: F2, giro: 0 });
for (var ar = 0; ar < 3; ar++) {
  var anel = forma("ellipse", 120, 120, ROSA, { nome: "anelWifi", stroke: ROSA, strokeWidth: 3 });
  tr(anel, "pos").setValue([pW[0], pW[1]]);
  var a0w = tW + 0.2 + ar * 0.45;
  tr(anel, "esc").expression = "var d=(time-" + a0w.toFixed(3) + ")%1.35; time<" + a0w.toFixed(3) + " ? [0,0,100] : [100+d*320, 100+d*320, 100]";
  tr(anel, "op").expression = "var d=(time-" + a0w.toFixed(3) + ")%1.35; time<" + a0w.toFixed(3) + " ? 0 : 40*(1-d/1.35)";
  vida(anel, a0w, F2);
}
// o cliente: um ponto que entra pela porta e anda pelos corredores
var tC = V(12.9);
var p0 = U(215, 880); var cli = nulo(p0[0], p0[1]);
var cliB = forma("ellipse", 44, 44, ROSA, { nome: "cliente" }); cliB.parent = cli; tr(cliB, "pos").setValue([0, 0]);
var cliH = forma("ellipse", 90, 90, ROSA, { nome: "halo" }); cliH.parent = cli; tr(cliH, "pos").setValue([0, 0]);
tr(cliH, "op").setValue(25); brilho(cliB, 24, 1.0);
K(tr(cliB, "op"), [[tC, 0], [tC + 0.15, 100]], 50); vida(cliB, tC, F2);
K(tr(cliH, "op"), [[tC, 0], [tC + 0.15, 25]], 50); vida(cliH, tC, F2);
pulsa(cliH, tC, 0.25, 4);
var cam = [[tC, 215, 880], [V(14.2), 280, 760], [V(16.0), 280, 470], [V(18.3), 280, 205],
  [V(19.6), 515, 205], [V(20.6), 515, 430], [V(23.0), 515, 450]];
caminho(cli, cam.map(function (q) { var u = U(q[1], q[2]); return [q[0], u[0], u[1]]; }));
// "te reconhece": crachá com o ícone de usuário acima do ponto
var tR = V(15.40);
var cracha = iconeFlat("user-circle", 0, 0, 80, tR, { fim: F2, giro: 0 });
cracha.parent = cli; tr(cracha, "pos").setValue([0, -70]);
// "o que você costuma comprar": etiquetas acendem nas gôndolas do histórico
var hist = [[335, 360, 16.6], [575, 540, 16.9], [815, 430, 17.2]];
for (var hi = 0; hi < hist.length; hi++) {
  var ph = U(hist[hi][0], hist[hi][1]); var tg = iconeFlat("tag", ph[0], ph[1], 64, V(hist[hi][2]), { fim: F2, giro: 12, fundo: CREME, glifo: "#111111" });
}
// "o corredor por onde você passa": o corredor do ponto acende
var pc0 = U(515, 460); var corr = retangulo(70, 360, ROSA, pc0[0], pc0[1], 12, "corredor");
tr(corr, "op").setValue(0);
K(tr(corr, "op"), [[V(18.36), 0], [V(18.6), 22], [V(20.4), 22], [V(20.7), 30]], 60); vida(corr, V(18.3), F2);
corr.moveBefore(plantaImg);
// "o cupom chega": celular sobe pela direita com a notificação
var tCel = V(20.85);
var cel = nulo(PX + 250, PY + 230);
var corpoC = retangulo(250, 470, "#0B0B0C", 0, 0, 44, "celular"); corpoC.parent = cel; tr(corpoC, "pos").setValue([0, 0]);
var aroC = forma("rect", 250, 470, "#3A3633", { raio: 44, nome: "celAro", stroke: "#5A5550", strokeWidth: 6 }); aroC.parent = cel; tr(aroC, "pos").setValue([0, 0]);
var nota = retangulo(214, 120, CREME, 0, -110, 22, "notificacao"); nota.parent = cel; tr(nota, "pos").setValue([0, -110]);
var notaIc = iconeApp(-62, -110, 64, tCel + 0.35, F2); notaIc.parent = cel; tr(notaIc, "pos").setValue([-62, -110]);
var notaT = textoEsq("CUPOM", { size: 30, style: "Bold", cor: "#111111", tracking: 40 }, -20, -126); notaT.parent = cel; tr(notaT, "pos").setValue([-20, -126]);
var notaT2 = textoEsq("pra você", { size: 26, style: "Medium", cor: "#55504B" }, -20, -88); notaT2.parent = cel; tr(notaT2, "pos").setValue([-20, -88]);
var pc = [corpoC, aroC];
for (var ci3 = 0; ci3 < pc.length; ci3++) { K(tr(pc[ci3], "op"), [[tCel, 0], [tCel + 0.12, 100]], 50); vida(pc[ci3], tCel, F2); }
var pn = [nota, notaT, notaT2];
for (var ci4 = 0; ci4 < pn.length; ci4++) { K(tr(pn[ci4], "op"), [[tCel + 0.3, 0], [tCel + 0.42, 100]], 50); vida(pn[ci4], tCel + 0.3, F2); }
mola(tr(cel, "pos"), tCel, [PX + 250, PY + 700, 0], [PX + 250, PY + 230, 0], { z: 0.62, w: 11 });
mola(tr(cel, "rot"), tCel, 14, -4, { z: 0.5, w: 10 });
// vibração do celular quando a notificação chega
tr(cel, "rot").expression = "var d=time-" + (tCel + 0.3).toFixed(3) + "; (d>0 && d<0.45) ? value+Math.sin(d*90)*3*(1-d/0.45) : value";
mola(tr(nota, "esc"), tCel + 0.3, [60, 60], [100, 100], { z: 0.5, w: 15 });

// =============== CENA 3 — começou na Cohama e se espalhou por 18 lojas ===============
cena(3, 1500, -1600, -9600);
var F3 = V(29.0);
linha([["Isso", 23.60], ["começou", 23.87], ["na", 24.35], ["loja", 24.48], ["da", 24.74], ["Cohama,", 24.87, { style: "Bold" }]], 446, { size: 70, fim: F3 });
linha([["aqui", 25.32], ["em", 25.59], ["@map-pin", 25.68], ["São", 25.72, { marca: true }], ["Luís", 25.92, { marca: true }]], 524, { size: 84, fim: F3 });
// 18 lojas em grade (6 × 3); a primeira (Cohama) acende primeiro e as outras se espalham
var lojas = [];
for (var lj = 0; lj < 18; lj++) {
  var col = lj % 6, lin = Math.floor(lj / 6);
  var lx = 540 + (col - 2.5) * 150, ly = 830 + lin * 160;
  var tl = lj === 0 ? V(24.87) : V(26.55) + (lj - 1) * 0.045;
  lojas.push(iconeFlat("storefront", lx, ly, 104, tl, { fim: F3, giro: lj % 2 ? 8 : -8, fundo: lj === 0 ? ROSA : "#2E2B28", glifo: lj === 0 ? "#111111" : CREME }));
}
var c18 = linha([["já", 26.39], ["se", 26.52], ["espalhou", 26.65], ["por", 27.17]], 1415, { size: 66, fim: F3 });
linha([["18", 27.37, { marca: true, size: 170, conta: [1, 18, 0.55] }], ["unidades.", 27.76, { style: "Bold", size: 90 }]], 1535, { size: 90, fim: F3 });

// =============== CENA 4 — o segundo ganho: o supermercado vira canal de mídia ===============
cena(4, -200, -2300, -12800);
var F4 = V(38.2);
linha([["E", 28.41], ["tem", 28.60], ["um", 28.62], ["segundo", 28.73, { marca: true }], ["ganho", 29.12, { marca: true }], ["nisso.", 29.45]], 330, { size: 70, saida: V(29.8) });
linha([["Com", 29.90], ["esses", 30.10], ["dados,", 30.36, { style: "Bold" }]], 384, { size: 70, fim: F4 });
linha([["as", 30.76], ["marcas", 30.87, { style: "Bold" }], ["que", 31.27], ["vendem", 31.38], ["lá", 31.84], ["dentro", 31.88]], 451, { size: 62, fim: F4 });
linha([["podem", 32.28], ["pagar", 32.59, { style: "Bold" }], ["pra", 32.90], ["anunciar", 33.06, { marca: true }], ["@megaphone", 33.10]], 514, { size: 62, fim: F4 });
linha([["só", 33.40, { style: "Bold" }], ["pra", 33.70], ["quem", 33.84], ["tem", 34.00], ["chance", 34.16], ["de", 34.73], ["comprar.", 34.76, { style: "Bold" }]], 577, { size: 62, fim: F4 });
// uma fileira de clientes: o anúncio chega só em quem tem chance de comprar
var pessoas = [];
for (var pe = 0; pe < 5; pe++) {
  var px2 = 540 + (pe - 2) * 175, alvoP = (pe === 1 || pe === 3);
  var pI = iconeFlat("user-circle", px2, 950, 120, V(32.6) + pe * 0.06, { fim: F4, giro: 0, fundo: "#2E2B28", glifo: CREME });
  pessoas.push(pI);
  if (alvoP) {
    var acesa = iconeFlat("user-circle", px2, 950, 120, V(33.85) + pe * 0.05, { fim: F4, giro: 0 });
    var adI = iconeFlat("megaphone", px2 + 50, 860, 64, V(34.2) + pe * 0.05, { fim: F4, giro: -12, fundo: CREME, glifo: "#111111" });
  }
}
linha([["O", 35.30], ["supermercado", 35.50, { style: "Bold" }], ["virou", 36.21]], 1264, { size: 74, fim: F4 });
linha([["um", 36.56], ["@monitor-play", 36.62], ["canal", 36.70, { marca: true }], ["de", 37.05, { marca: true }], ["mídia.", 37.24, { marca: true }]], 1357, { size: 110, fim: F4 });

// =============== CENA 5 — dado primário ===============
cena(5, 1300, -3200, -16000);
var F5 = V(45.6);
linha([["Por", 37.60], ["trás", 37.80], ["de", 38.00], ["tudo", 38.11], ["isso", 38.34]], 504, { size: 70, fim: F5 });
linha([["está", 38.68], ["uma", 38.97], ["coisa", 39.08], ["chamada", 39.37]], 575, { size: 70, fim: F5 });
var dp = linha([["dado", 39.77, { marca: true }], ["primário", 40.05, { marca: true }]], 730, { size: 130, fim: F5 });
colchetes(540, 692, dp[1].cx + dp[1].largura / 2 - (dp[0].cx - dp[0].largura / 2) + 100, 165, V(40.35), F5);
iconeFlat("database", 540, 930, 130, V(40.45), { fim: F5, giro: -14 });
linha([["você", 40.80], ["coleta", 41.05, { style: "Bold" }], ["os", 41.43], ["dados", 41.55]], 1134, { size: 70, fim: F5 });
linha([["do", 41.87], ["seu", 41.99], ["cliente,", 42.18, { style: "Bold" }]], 1205, { size: 70, fim: F5 });
var sp = linha([["sem", 42.62], ["precisar", 42.81], ["pagar", 43.32], ["anúncio", 43.63]], 1374, { size: 70, fim: F5 });
linha([["pra", 44.06], ["descobrir.", 44.31, { style: "Bold" }]], 1445, { size: 70, fim: F5 });
// risco em "pagar anúncio" (meio das letras, acompanha a recentralização)
var rxa = sp[2].cx - sp[2].largura / 2 - 14, rxb = sp[3].cx + sp[3].largura / 2 + 14, rya = 1374 + 0.09 * 70 * 0.86;
var risco5 = forma("rect", rxb - rxa, 8, ROSA, { nome: "risco5" });
tr(risco5, "anc").setValue([-(rxb - rxa) / 2, 0]); tr(risco5, "pos").setValue([rxa, rya]);
tr(risco5, "pos").expression = tr(sp[3], "pos").expression;
mola(tr(risco5, "esc"), V(43.95), [0, 100], [100, 100], { z: 0.85, w: 16 }); vida(risco5, V(43.95), F5);

// =============== CENA 6 — a virada: 1986, a mercearia de 50 m² em Balsas e o 3º maior do Brasil ===============
cena(6, 0, -4100, -19200);
var F6 = V(58.9);
// sem mapa neste episódio (pedido dele: repetiria o #01). A escala vem de um quadrado de 50 m² com a mercearia dentro.
var tQ = V(50.62), fimQ = V(52.75);
var quad = forma("rect", 330, 330, ROSA, { raio: 6, nome: "quad50", stroke: ROSA, strokeWidth: 6 });
tr(quad, "pos").setValue([540, 1200]);
mola(tr(quad, "esc"), tQ, [0, 0], [100, 100], { z: 0.62, w: 12 }); K(tr(quad, "op"), [[tQ, 0], [tQ + 0.1, 100]], 50);
tr(quad, "op").setValueAtTime(fimQ, 100); tr(quad, "op").setValueAtTime(fimQ + 0.26, 0); vida(quad, tQ, fimQ + 0.3);
var quadIc = iconeFlat("storefront", 540, 1200, 150, tQ + 0.15, { sai: fimQ, giro: -10 });
var cota = texto("50 m²", { size: 44, style: "Bold", cor: ROSA }); entra(cota, tQ + 0.25, 540, 1420, { dy: 16 }); sai(cota, fimQ, 540, 1420); vida(cota, tQ + 0.2, fimQ + 0.3);
// texto da virada
linha([["E", 45.00], ["quem", 45.20], ["montou", 45.36], ["essa", 45.79], ["máquina", 46.08, { style: "Bold" }]], 617, { size: 70, saida: V(49.3) });
linha([["começou", 46.63], ["em", 47.10], ["1986", 47.31, { marca: true, size: 130 }]], 718, { size: 70, saida: V(49.32) });
linha([["como", 48.12], ["ex-garimpeiro,", 48.43, { style: "Bold" }]], 823, { size: 76, saida: V(49.34) });
linha([["com", 49.50], ["uma", 49.70], ["mercearia", 49.90, { style: "Bold" }], ["de", 50.55]], 543, { size: 70, saida: V(52.65) });
linha([["50", 50.62, { marca: true, size: 150 }], ["metros", 51.02, { style: "Bold" }], ["quadrados", 51.43, { style: "Bold" }]], 655, { size: 80, saida: V(52.67) });
linha([["em", 52.01], ["@map-pin", 52.08], ["Balsas.", 52.14, { marca: true }]], 777, { size: 90, saida: V(52.69) });
// pódio: Carrefour, Assaí e Mateus (Ranking ABRAS 2026)
linha([["Hoje", 52.80], ["é", 53.06], ["o", 53.12], ["terceiro", 53.19, { marca: true }], ["maior", 53.70]], 412, { size: 74, fim: F6 });
linha([["supermercado", 54.03, { style: "Bold" }], ["do", 54.80], ["Brasil,", 54.94, { style: "Bold" }]], 487, { size: 74, fim: F6 });
var podio = [["Carrefour", 1, 380, 200, V(53.25)], ["Assaí", 2, 300, 540, V(53.35)], ["Mateus", 3, 230, 880, V(53.45)]];
for (var po = 0; po < 3; po++) {
  var pd = podio[po], hP = pd[2], baseY = 1180;
  var bar = forma("rect", 250, hP, po === 2 ? ROSA : "#2E2B28", { raio: 18, nome: "podio" });
  tr(bar, "anc").setValue([0, hP / 2]); tr(bar, "pos").setValue([pd[3], baseY]);
  mola(tr(bar, "esc"), pd[4], [100, 0], [100, 100], { z: 0.7, w: 12 }); K(tr(bar, "op"), [[pd[4], 0], [pd[4] + 0.1, 100]], 50); vida(bar, pd[4], F6);
  var nP = texto(pd[1] + "º", { size: 64, style: "Bold", cor: po === 2 ? "#111111" : CREME });
  entra(nP, pd[4] + 0.15, pd[3], baseY - 60, { dy: 20 }); vida(nP, pd[4] + 0.1, F6);
  if (po === 2) logoMateus(pd[3], baseY + 52, 240, pd[4] + 0.2, F6);
  else { var lP = texto(pd[0], { size: 40, style: "Medium", cor: "#A8A19A" }); entra(lP, pd[4] + 0.2, pd[3], baseY + 50, { dy: 16 }); vida(lP, pd[4] + 0.15, F6); }
  if (po === 2) { brilho(bar, 30, 0.6); iconeFlat("trophy", pd[3], baseY - hP - 70, 110, V(53.7), { fim: F6, giro: -14 }); }
}
linha([["com", 55.57], ["mais", 55.83], ["de", 56.23]], 1369, { size: 70, fim: F6 });
linha([["R$", 56.30, { style: "Bold", size: 90 }], ["43", 56.37, { marca: true, size: 170, conta: [1, 43, 0.7] }], ["bilhões", 56.87, { style: "Bold", size: 90 }]], 1491, { size: 90, fim: F6 });
linha([["por", 57.63], ["ano.", 57.74, { style: "Bold" }]], 1611, { size: 66, fim: F6 });

// =============== CENA 7 — e no seu negócio? lista de contatos ===============
cena(7, 1400, -4900, -22400);
var F7 = V(68.1);
linha([["E", 58.31], ["aí,", 58.50, { style: "Bold" }]], 394, { size: 80, fim: F7 });
linha([["se", 58.70], ["você", 58.86], ["já", 59.18], ["tem", 59.35], ["o", 59.58], ["@whatsapp-logo", 59.62], ["WhatsApp,", 59.67, { style: "Bold" }]], 466, { size: 62, fim: F7 });
linha([["o", 60.47], ["nome", 60.61, { style: "Bold" }], ["e", 60.87], ["o", 60.95], ["histórico", 61.03, { style: "Bold" }]], 529, { size: 62, fim: F7 });
linha([["de", 61.76], ["cada", 61.92], ["cliente,", 62.24, { marca: true }]], 596, { size: 70, fim: F7 });
// cartão da lista de contatos
var tL = V(59.7);
var cartao = retangulo(820, 470, "#1B1917", 540, 980, 32, "lista"); aparece(cartao, tL, F7);
var nomes = ["Ana", "Carlos", "Dona Lúcia", "Pedro"];
var linhasL = [];
for (var cl = 0; cl < 4; cl++) {
  var yl = 820 + cl * 106, tl2 = V(60.6) + cl * 0.12;
  var av = iconeFlat("user-circle", 230, yl, 72, tl2, { fim: F7, giro: 0, fundo: cl === 1 ? ROSA : "#3A3633", glifo: cl === 1 ? "#111111" : CREME });
  var nm = textoEsq(nomes[cl], { size: 40, style: "Bold", cor: CREME }, 290, yl - 14); entra(nm, tl2 + 0.05, 290 + nm.largura / 2, yl - 14, { dy: 14 });
  tr(nm, "anc").setValue([0, tr(nm, "anc").value[1]]);
  vida(nm, tl2, F7);
  var hs = retangulo(220 + cl * 40, 14, "#3A3633", 290 + (220 + cl * 40) / 2, yl + 22, 7, "hist"); aparece(hs, V(61.1) + cl * 0.1, F7);
  linhasL.push({ y: yl });
}
// "vender pra ele": mensagem personalizada só para o Carlos
var bal1 = retangulo(230, 60, ROSA, 820, 926, 30, "balao"); aparece(bal1, V(63.95), V(64.8));
var bal1T = texto("pra você", { size: 30, style: "Bold", cor: "#111111" }); tr(bal1T, "pos").setValue([820, 928]); aparece(bal1T, V(64.0), V(64.8));
// "a mesma promoção pra lista inteira": o mesmo balão cinza em todo mundo
for (var cm2 = 0; cm2 < 4; cm2++) {
  var bm = retangulo(230, 60, "#4A4540", 820, linhasL[cm2].y, 30, "balaoIgual"); aparece(bm, V(65.4) + cm2 * 0.06, F7);
  var bmT = texto("PROMO", { size: 28, style: "Bold", cor: "#A8A19A", tracking: 80 }); tr(bmT, "pos").setValue([820, linhasL[cm2].y + 2]); aparece(bmT, V(65.45) + cm2 * 0.06, F7);
}
linha([["está", 62.90], ["usando", 63.13], ["isso", 63.47], ["pra", 63.70], ["vender", 63.95, { marca: true }], ["pra", 64.27], ["ele,", 64.53, { style: "Bold" }]], 1329, { size: 62, fim: F7 });
var mp = linha([["ou", 64.84], ["manda", 64.95], ["a", 65.27], ["mesma", 65.35, { style: "Bold" }], ["promoção", 65.65, { style: "Bold" }]], 1394, { size: 66, fim: F7 });
linha([["pra", 66.16], ["a", 66.42], ["lista", 66.49], ["inteira?", 66.80, { style: "Bold" }]], 1461, { size: 66, fim: F7 });
var rma = mp[3].cx - mp[3].largura / 2 - 14, rmb = mp[4].cx + mp[4].largura / 2 + 14, rmy = 1394 + 0.09 * 66 * 0.86;
var risco7 = forma("rect", rmb - rma, 8, ROSA, { nome: "risco7" });
tr(risco7, "anc").setValue([-(rmb - rma) / 2, 0]); tr(risco7, "pos").setValue([rma, rmy]);
tr(risco7, "pos").expression = tr(mp[4], "pos").expression;
mola(tr(risco7, "esc"), V(66.2), [0, 100], [100, 100], { z: 0.85, w: 16 }); vida(risco7, V(66.2), F7);

// =============== CENA 8 — chamada: comenta e segue ===============
cena(8, -100, -5800, -25600);
var F8 = V(73.4);
linha([["@chat-circle-text", 67.50], ["Me", 67.50], ["conta", 67.70], ["aqui", 67.89], ["embaixo", 68.07]], 558, { size: 70, fim: F8 });
linha([["o", 68.44], ["que", 68.55], ["você", 68.65], ["acha", 68.87]], 629, { size: 70, fim: F8 });
linha([["dessa", 69.13], ["estratégia", 69.33, { marca: true }]], 713, { size: 96, fim: F8 });
// botão Seguir (estilo de perfil) que pulsa
var tS = V(70.09);
var seg = retangulo(460, 120, ROSA, 540, 960, 60, "seguir"); aparece(seg, tS, F8);
var segIc = iconeFlat("user-plus", 400, 960, 76, tS + 0.05, { fim: F8, giro: 0, fundo: "#111111", glifo: ROSA });
var segT = texto("Seguir", { size: 56, style: "Bold", cor: "#111111" }); tr(segT, "pos").setValue([575, 962]); aparece(segT, tS + 0.05, F8);
pulsa(seg, tS + 0.6, 0.035, 6);
linha([["que", 70.70], ["toda", 70.90], ["semana", 71.09, { style: "Bold" }], ["tem", 71.42]], 1191, { size: 70, fim: F8 });
linha([["um", 71.60], ["case", 71.75, { marca: true }], ["novo", 71.93, { marca: true }]], 1275, { size: 96, fim: F8 });
linha([["analisado", 72.15], ["por", 72.65], ["mim.", 72.82, { style: "Bold" }]], 1359, { size: 70, fim: F8 });

// =============== CENA 9 — ficha técnica ===============
cena(9, 1300, -6600, -28800);
var tf = V(73.3), fimF = 78.4;
var fundoF = retangulo(960, 1220, "#181614", 540, 990, 44, "ficha"); pop(fundoF, tf, 100); vida(fundoF, tf, fimF);
var cab = texto("FICHA TÉCNICA", { size: 30, style: "Bold", cor: ROSA, tracking: 300 });
entra(cab, tf + 0.1, 540, 500, { dy: 20 }); vida(cab, tf, fimF);
var cab2 = texto("Feito 100% com IA", { size: 74, style: "Bold", cor: CREME });
entra(cab2, tf + 0.18, 540, 590, { dy: 30 }); vida(cab2, tf, fimF);
var rows = [
  ["sparkle", "Roteiro, motion e edição", "Claude Opus 5.5"],
  ["cpu", "Motion design", "EffectCraft (open source)"],
  ["megaphone", "Narração e trilha", "Gemini 3.8 TTS · Lyria 3.5"],
  ["play", "Abertura no supermercado", "Veo 3.1"],
  ["clock", "Tokens do Claude", FICHA.tokens],
  ["eye", "No plano Pro", FICHA.sessao],
  ["coins", "Custo de API", FICHA.custo],
  ["calendar-star", "Tempo de produção", FICHA.tempo],
];
for (var ri = 0; ri < rows.length; ri++) {
  var ry = 720 + ri * 104, trr = tf + 0.3 + ri * 0.08;
  iconeFlat(rows[ri][0], 175, ry - 20, 80, trr, { fim: fimF, giro: 0 });
  var lb2 = texto(rows[ri][1], { size: 34, style: "Medium", cor: "#A8A19A" });
  tr(lb2, "anc").setValue([tr(lb2, "anc").value[0] - lb2.largura / 2, tr(lb2, "anc").value[1]]);
  entra(lb2, trr, 240, ry - 34, { dy: 16 }); vida(lb2, trr, fimF);
  var vl = texto(rows[ri][2], { size: 44, style: "Bold", cor: ri >= 4 ? ROSA : CREME });
  tr(vl, "anc").setValue([tr(vl, "anc").value[0] - vl.largura / 2, tr(vl, "anc").value[1]]);
  entra(vl, trr + 0.04, 240, ry + 14, { dy: 16 }); vida(vl, trr, fimF);
}

// =============== CÂMERA 3D: parada em cada cena; só voa na troca, com borrão de velocidade ===============
CENA_ATUAL = null; CENA_IDX = -1;
app.run("layer.newCamera", { name: "Camera", type: "twoNode" });
var camL = comp.layer("Camera");
var cP = tr(camL, "pos"), cA = tr(camL, "anc");
var bordas = [V(8.30), V(12.34), V(23.60), V(28.41), V(37.60), V(45.00), V(58.31), V(67.50), V(73.3)];
var NC = bordas.length + 1;
var ANTES = 0.25, DEPOIS = 0.35;
function alvo(i) { var c = CENAS[i]; return [c.x + 540, c.y + 960, c.z]; }
function olho(i) { var a = alvo(i); return [a[0], a[1], a[2] - 1500]; }
var olhos = [], alvos = [];
for (var s = 0; s < NC; s++) { olhos.push("[" + olho(s).join(",") + "]"); alvos.push("[" + alvo(s).join(",") + "]"); }
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
for (var ci2 = 0; ci2 < NC - 1; ci2++) {
  var ls2 = CAMADAS_CENA[ci2] || [], a0 = bordas[ci2] - ANTES;
  for (var li = 0; li < ls2.length; li++) {
    var cam = ls2[li];
    try { if (cam.nullLayer) continue; } catch (e) {}
    if (tr(cam, "op").expression) continue; // já tem regra própria (anéis do Wi-Fi, glitch)
    tr(cam, "op").expression = "var p=Math.min(1,Math.max(0,(time-" + a0.toFixed(3) + ")/0.3)); value*(1-p*p)";
  }
}

// borrão de velocidade
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

// =============== LOGO escrita à mão no fim ===============
CENA_ATUAL = null;
var veu = retangulo(W1, H1, FUNDO, 540, 960, 0, "veu");
K(tr(veu, "op"), [[fimF - 0.4, 0], [fimF, 100]], 60); vida(veu, fimF - 0.4, FIM);
vinhetaLogo(fimF + 0.1, W1 / 2, 940, 820);

app.project.save(new File("~/Developer/artcraft/mateus/mateus.ecproj"));
writeLn("camadas " + comp.numLayers);
