"""
Procesa las fotos reales del Taller Cacho para la web.

Fuente: WEB1-WEB5 (1600x720) — mismas fotos que el collage pero al doble de
resolución. Se les levanta contraste y nitidez, y se exportan en WebP a las
medidas que usa cada lugar del sitio.
"""
from PIL import Image, ImageEnhance, ImageFilter, ImageOps
import os

SRC = r"C:\TNR\Cacho"
IMG = r"C:\TNR\Cacho\sitio\assets\img"
GAL = os.path.join(IMG, "trabajos")


def realzar(im):
    """Nivelado suave + color + nitidez. Sin inventar detalle que no existe."""
    im = im.convert("RGB")
    im = ImageOps.autocontrast(im, cutoff=(0.4, 0.3))       # abre negros y blancos
    im = ImageEnhance.Color(im).enhance(1.10)               # saca el gris de foto de celular
    im = ImageEnhance.Contrast(im).enhance(1.06)
    im = ImageEnhance.Brightness(im).enhance(1.03)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.5, percent=95, threshold=3))
    return im


def exportar(im, destino, ancho, alto=None, q=82):
    if alto is None:
        alto = round(im.height * ancho / im.width)
    # recorte centrado al aspecto pedido y luego escalado
    obj = ancho / alto
    act = im.width / im.height
    if act > obj:
        nw = round(im.height * obj)
        caja = ((im.width - nw) // 2, 0, (im.width - nw) // 2 + nw, im.height)
    else:
        nh = round(im.width / obj)
        caja = (0, (im.height - nh) // 2, im.width, (im.height - nh) // 2 + nh)
    out = im.crop(caja).resize((ancho, alto), Image.LANCZOS)
    out.save(destino, "WEBP", quality=q, method=6)
    kb = os.path.getsize(destino) / 1024
    print(f"  {os.path.basename(destino):26} {ancho}x{alto}  {kb:6.0f} KB")


fuentes = {n: realzar(Image.open(os.path.join(SRC, f)))
           for n, f in {
               "booth_lateral": "WEB1.jfif",
               "booth_frente":  "WEB2.jpeg",
               "lab_estante":   "WEB3.jpeg",
               "carta_colores": "WEB4.jpeg",
               "lab_amplia":    "WEB5.jpeg",
           }.items()}

print("Portada:")
exportar(fuentes["booth_frente"], os.path.join(IMG, "hero.webp"), 1600, 720, q=84)
exportar(fuentes["booth_frente"], os.path.join(IMG, "hero-sm.webp"), 900, 405, q=80)

print("Bloque 'El taller':")
exportar(fuentes["lab_estante"], os.path.join(IMG, "taller.webp"), 1200, 675, q=82)

print("Galeria (miniatura 16:9 + version grande):")
galeria = [
    ("trabajo-01", "booth_lateral"),
    ("trabajo-02", "booth_frente"),
    ("trabajo-03", "lab_amplia"),
    ("trabajo-04", "carta_colores"),
]
for nombre, clave in galeria:
    exportar(fuentes[clave], os.path.join(GAL, f"{nombre}.webp"), 800, 450, q=80)
    exportar(fuentes[clave], os.path.join(GAL, f"{nombre}-full.webp"), 1600, 720, q=84)

print("\nListo.")
