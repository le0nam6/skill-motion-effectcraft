"""Gera dims.jsx com largura e altura de cada imagem de img/ (o cartao precisa saber o tamanho)."""
import glob, os
from PIL import Image
P = os.path.dirname(os.path.abspath(__file__))
linhas = []
for f in sorted(glob.glob(f"{P}/img/*")):
    if f.lower().endswith((".png", ".jpg", ".jpeg")):
        w, h = Image.open(f).size; linhas.append(f'  "img/{os.path.basename(f)}": [{w}, {h}]')
open(f"{P}/dims.jsx", "w").write("var DIMS = {\n" + ",\n".join(linhas) + "\n};\n")
print(len(linhas), "imagens")
