// Teste da abertura nova (17/10), v3: referência Neto Editor (@onetoeditor, Edit Class).
// O que veio da referência: nada parado (cada tela com zoom lento e contínuo; o quadro 1 já abre com o texto gigante encolhendo
// com borrão), as telas saem voando para cima com borrão enquanto a próxima entra por baixo, os ícones voam até o lugar
// e ficam em leque, a palavra comum entra cinza e escurece, e um cursor arrasta uma caixa de seleção (como no Figma).
// O "aposentei" acontece na tela: o cursor seleciona as três ferramentas e elas são apagadas.
// Glitch (pisca, some e aparece) só nas palavras de destaque. Fundo branco com grade cinza.
// Rodar: effectcraft-cli script "$PWD/teste-abertura.jsx" --empty
#include "base.jsx"
PASTA = "~/Downloads/NRR Day - Case/";
W1 = 1080; H1 = 1920; FIM = 7.2;
function V(s) { return s; }
var DEST = "#E0252F", TINTA = "#1B1617";
comp = app.project.items.addComp("Teste abertura", W1, H1, 1, FIM, 60);
comp.bgColor = [1, 1, 1];
comp.motionBlur = true;
comp.openInViewer();

#include "abertura_branca.jsx"

var somIt = app.project.importFile(new ImportOptions(new File(PASTA + "audio/teste-abertura.wav")));
var som = comp.layers.add(somIt); som.startTime = 0;
app.project.save(new File(PASTA + "Teste abertura.ecproj"));
writeLn("camadas " + comp.numLayers);
