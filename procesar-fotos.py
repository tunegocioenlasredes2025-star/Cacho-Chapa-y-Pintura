"""
Procesa las fotos reales del Taller Cacho para la web.

Tanda del 11/09/2026 (WhatsApp de Adrián, en la carpeta del cliente):
  - Cabina: Audi A1 recién pintado. Fotos verticales de 960x1280.
  - Sacabollos: 3 autos de clientes bajo la luz en panal (1200x1600).
    Son autos de clientes: la patente se pixela antes de exportar.
Laboratorio: se recortan a 3:2 las versiones grandes que ya estaban en el sitio.

Uso, desde la raíz del repo:  python procesar-fotos.py
"""
from PIL import Image, ImageEnhance, ImageFilter, ImageOps
import os
import shutil

SRC = r"C:\Users\Santi\Desktop\TuNegocioEnLasRedes\Cacho chapa y pintura"
ROOT = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(ROOT, "assets", "img")
GAL = os.path.join(IMG, "trabajos")
PDR = os.path.join(IMG, "sacabollos")
os.makedirs(PDR, exist_ok=True)

# Caja de la patente en cada original (x0, y0, x1, y1), medida a mano.
PATENTES = {
    "17.24.30a": (664, 938, 780, 1014),
    "17.24.29":  (1112, 1155, 1200, 1265),
    "17.24.29v": (292, 838, 420, 922),
}


def original(n):
    return Image.open(os.path.join(SRC, f"WhatsApp Image 2026-09-11 at {n}.jpeg")).convert("RGB")


def realzar(im):
    """Nivelado suave + color + nitidez. Sin inventar detalle que no existe."""
    im = im.convert("RGB")
    im = ImageOps.autocontrast(im, cutoff=(0.4, 0.3))       # abre negros y blancos
    im = ImageEnhance.Color(im).enhance(1.10)               # saca el gris de foto de celular
    im = ImageEnhance.Contrast(im).enhance(1.06)
    im = ImageEnhance.Brightness(im).enhance(1.03)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.5, percent=95, threshold=3))
    return im


def pixelar(im, caja, bloque=14):
    zona = im.crop(caja)
    w, h = zona.size
    zona = zona.resize((max(1, w // bloque), max(1, h // bloque)), Image.BILINEAR)
    zona = zona.resize((w, h), Image.NEAREST).filter(ImageFilter.GaussianBlur(2))
    im.paste(zona, caja[:2])


def exportar(im, destino, ancho, alto, q=82, fx=0.5, fy=0.5):
    """Recorta al aspecto pedido (fx/fy: dónde cae el recorte, 0 = arriba/izquierda)
    y escala. Si hubo que agrandar, repasa la nitidez que se pierde al escalar."""
    obj = ancho / alto
    if im.width / im.height > obj:
        nw = round(im.height * obj)
        x = round((im.width - nw) * fx)
        caja = (x, 0, x + nw, im.height)
    else:
        nh = round(im.width / obj)
        y = round((im.height - nh) * fy)
        caja = (0, y, im.width, y + nh)
    out = im.crop(caja)
    if out.size != (ancho, alto):
        agranda = ancho > out.width
        out = out.resize((ancho, alto), Image.LANCZOS)
        if agranda:
            out = out.filter(ImageFilter.UnsharpMask(radius=2, percent=55, threshold=2))
    out.save(destino, "WEBP", quality=q, method=6)
    kb = os.path.getsize(destino) / 1024
    print(f"  {os.path.relpath(destino, IMG):34} {ancho}x{alto}  {kb:6.0f} KB")


print("Portada (Audi A1 en cabina):")
hero = realzar(original("17.24.24"))
# La tarjeta de la portada usa la foto entera, vertical.
exportar(hero, os.path.join(IMG, "hero-cabina.webp"), 960, 1280, q=80)
exportar(hero, os.path.join(IMG, "hero-cabina-sm.webp"), 600, 800, q=78)
# Recorte horizontal: sólo para el fondo de la banda de seguros y og-image.jpg.
exportar(hero, os.path.join(IMG, "hero.webp"), 1600, 1000, q=76, fy=0.57)

print("Galeria cabina (miniatura 3:4 + version grande):")
for nombre, n in [
    ("cabina-01", "17.24.24 (2)"),   # lateral delantero
    ("cabina-02", "17.24.24 (1)"),   # brillo del lateral trasero
    ("cabina-03", "17.24.26 (1)"),   # paragolpes en caballetes
    ("cabina-04", "17.24.25"),       # paragolpes trasero
]:
    im = realzar(original(n))
    exportar(im, os.path.join(GAL, f"{nombre}.webp"), 600, 800, q=80)
    exportar(im, os.path.join(GAL, f"{nombre}-full.webp"), 960, 1280, q=82)

print("Galeria laboratorio (miniatura 3:2; la grande queda en 1600x720):")
for nombre, viejo, fx in [
    ("laboratorio-01", "trabajo-03", 0.35),  # centrado en la maquina de mezcla
    ("laboratorio-02", "trabajo-04", 0.40),  # muestrario + carta de colores
]:
    full = os.path.join(GAL, f"{nombre}-full.webp")
    if not os.path.exists(full):
        shutil.copyfile(os.path.join(GAL, f"{viejo}-full.webp"), full)
    exportar(Image.open(full).convert("RGB"), os.path.join(GAL, f"{nombre}.webp"), 900, 600, q=80, fx=fx)

print("Sacabollos (patente pixelada):")
for nombre, n, w, h in [
    ("sacabollos-01", "17.24.30a", 900, 1200),  # Honda Civic, vista del sector
    ("sacabollos-02", "17.24.29", 600, 800),    # Renault Kangoo Stepway
    ("sacabollos-03", "17.24.29v", 600, 800),   # Toyota Corolla Cross
]:
    im = original(n)
    pixelar(im, PATENTES[n])
    im = realzar(im)
    # El piso texturado y el panal de luces pesan mucho en WebP: calidad más baja.
    exportar(im, os.path.join(PDR, f"{nombre}.webp"), w, h, q=74)
    exportar(im, os.path.join(PDR, f"{nombre}-full.webp"), 960, 1280, q=70)

print("\nListo.")
