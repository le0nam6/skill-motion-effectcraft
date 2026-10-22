"""Mapa de satélite + linhas dos estados no MESMO sistema de coordenadas (referência: reels do @fatoscomfativa).

Gera, na pasta do projeto:
  sat_base.jpg   satélite escuro do continente (60 px/grau, lon -82..-30, lat 13..-56), borda dissolvida
  sat_uf.jpg     recorte em 120 px/grau em volta do estado (entra por cima quando a câmera mergulha)
  mapa_svg.jsx   LINHAS_SVG (todos os estados), BRASIL_SVG (preenchimento), UF_SVG e UF_LINHA_SVG, UF_CAIXA, UF_DET

Uso: python3 gera_mapa.py <pasta-do-projeto> <codigo-IBGE-da-UF> [cor-hex]
  ex.: python3 gera_mapa.py ~/Developer/artcraft/meu-video 21 "#EC4F91"   (21 = Maranhão)
Precisa de: Pillow. Baixa sozinho a malha do IBGE e os blocos B1/B2 do NASA Blue Marble (~100 MB, ficam em cache).
"""
import json, os, sys, urllib.request
from PIL import Image, ImageEnhance, ImageDraw, ImageFilter
Image.MAX_IMAGE_PIXELS = None

pasta, uf = os.path.expanduser(sys.argv[1]), sys.argv[2]
cor = sys.argv[3] if len(sys.argv) > 3 else "#EC4F91"
cache = os.path.expanduser("~/.cache/motion-effectcraft"); os.makedirs(cache, exist_ok=True)

def baixa(url, nome):
    c = os.path.join(cache, nome)
    if not os.path.exists(c): urllib.request.urlretrieve(url, c)
    return c

malha = json.load(open(baixa("https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=application/vnd.geo%2Bjson&intrarregiao=UF&qualidade=intermediaria", "br_uf.json")))
NASA = "https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73776/world.topo.bathy.200408.3x21600x21600.{}.jpg"
blocos = {b: baixa(NASA.format(b), f"bm_{b}.jpg") for b in ("B1", "B2")}  # B = lon -90..0; 1 = lat 90..0, 2 = 0..-90

def bloco(b, lado):  # decodifica já reduzido (draft): 5400 = 60 px/grau, 10800 = 120 px/grau
    im = Image.open(blocos[b]); im.draft("RGB", (lado, lado)); return im.convert("RGB")
def trata(im):  # satélite escuro e pouco saturado, como na referência
    im = ImageEnhance.Color(im).enhance(0.75); im = ImageEnhance.Brightness(im).enhance(0.62)
    return ImageEnhance.Contrast(im).enhance(1.1)

# ---- base do continente (60 px/grau) ----
b1, b2 = bloco("B1", 5400), bloco("B2", 5400)
x0, x1 = 8 * 60, 60 * 60
topo, baixo = b1.crop((x0, 77 * 60, x1, 5400)), b2.crop((x0, 0, x1, 56 * 60))
base = Image.new("RGB", (x1 - x0, topo.size[1] + baixo.size[1])); base.paste(topo, (0, 0)); base.paste(baixo, (0, topo.size[1]))
base = trata(base); w, h = base.size
m = Image.new("L", (w, h), 0); ImageDraw.Draw(m).rectangle((260, 260, w - 260, h - 260), fill=255); m = m.filter(ImageFilter.GaussianBlur(118))
Image.composite(base, Image.new("RGB", (w, h), (14, 13, 12)), m).save(os.path.join(pasta, "sat_base.jpg"), quality=90)

# ---- vetores no sistema da imagem: X = (lon+82)*60, Y = (13-lat)*60 ----
P = lambda lon, lat: ((lon + 82) * 60, (13 - lat) * 60)
def polys(g): return [g["coordinates"]] if g["type"] == "Polygon" else g["coordinates"]
def caminho(g): return "".join("M" + " L".join("%.1f,%.1f" % P(*q) for q in r) + "Z " for pp in polys(g) for r in pp)
W, H = w, h
alvo = [f for f in malha["features"] if f["properties"]["codarea"] == str(uf)][0]
pts = [P(*q) for pp in polys(alvo["geometry"]) for q in pp[0]]
cx = [min(p[0] for p in pts), max(p[0] for p in pts), min(p[1] for p in pts), max(p[1] for p in pts)]
todos = "".join(caminho(f["geometry"]) for f in malha["features"]); uf_d = caminho(alvo["geometry"])
sv = lambda corpo: f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">{corpo}</svg>'

# ---- recorte em 120 px/grau em volta do estado (margem de 1,5 grau) ----
lon0 = cx[0] / 60 - 82 - 1.5; lon1 = cx[1] / 60 - 82 + 1.5; lat0 = 13 - cx[2] / 60 + 1.5; lat1 = 13 - cx[3] / 60 - 1.5
d1, d2 = bloco("B1", 10800), bloco("B2", 10800)
X0, X1 = int((lon0 + 90) * 120), int((lon1 + 90) * 120)
partes = []
if lat0 > 0: partes.append(d1.crop((X0, int((90 - lat0) * 120), X1, 10800 if lat1 < 0 else int((90 - lat1) * 120))))
if lat1 < 0: partes.append(d2.crop((X0, int(max(0, -lat0) * 120), X1, int(-lat1 * 120))))
det = Image.new("RGB", (X1 - X0, sum(p.size[1] for p in partes))); y = 0
for p in partes: det.paste(p, (0, y)); y += p.size[1]
trata(det).save(os.path.join(pasta, "sat_uf.jpg"), quality=92)

linhas = sv('<path d="%s" fill="none" stroke="#F4EBDD" stroke-width="1.6" stroke-linejoin="round"/>' % todos)
preench = sv('<path d="%s" fill="#F4EBDD"/>' % todos)
uf_f = sv('<path d="%s" fill="%s"/>' % (uf_d, cor))
uf_l = sv('<path d="%s" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linejoin="round"/>' % uf_d)
open(os.path.join(pasta, "mapa_svg.jsx"), "w").write(
    "// gerado por gera_mapa.py: sistema do satélite (60 px/grau, origem lon -82, lat 13)\n"
    + "var MAPA_W = %d, MAPA_H = %d;\n" % (W, H)
    + "var UF_CAIXA = [%.0f,%.0f,%.0f,%.0f];\n" % tuple(cx)
    + "var UF_DET = [%.1f, %.1f]; // canto do sat_uf.jpg no sistema base (camada a 50%%)\n" % ((lon0 + 82) * 60, (13 - lat0) * 60)
    + "var LINHAS_SVG = %s;\nvar BRASIL_SVG = %s;\nvar UF_SVG = %s;\nvar UF_LINHA_SVG = %s;\n" % tuple(json.dumps(x) for x in (linhas, preench, uf_f, uf_l)))
print("ok:", pasta, "| caixa da UF", [round(v) for v in cx])
