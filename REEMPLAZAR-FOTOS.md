# Cómo reemplazar o sumar fotos

Todas las fotos del sitio son **reales, del taller**. La última tanda la mandó Adrián por
WhatsApp el 11/09/2026: el Audi A1 recién pintado en cabina y el sector de sacabollos.

Las fotos se procesan con `procesar-fotos.py` (nivelado de contraste, color y nitidez,
recorte a la medida de cada lugar y exportación a WebP). Para una tanda nueva: dejar los
originales en la carpeta del cliente, ajustar los nombres en el script y correrlo desde la
raíz del repo:

```bash
python procesar-fotos.py
```

> **Patentes.** Las fotos de sacabollos son autos de clientes. El script pixela la patente
> antes de exportar (diccionario `PATENTES`, con la caja medida a mano sobre el original).
> Cualquier foto nueva con la patente a la vista tiene que pasar por ahí.

---

## 1. Qué foto va en cada lugar

### Portada
| Archivo | Medida | Qué muestra |
|---|---|---|
| `assets/img/hero.webp` | 1600 × 1000 | Audi A1 recién pintado en la cabina |
| `assets/img/hero-sm.webp` | 900 × 563 | **La misma foto**, más chica (se usa en celular) |

> La portada lleva un degradé oscuro encima. Conviene que la foto tenga profundidad y que
> la zona inferior izquierda no tenga detalle importante, porque ahí van el logo y el título.
> En celular se muestra como banda 16:9 con el texto debajo.

El fondo de la banda de seguros **no tiene archivo propio**: reusa `hero.webp`, en blanco y
negro y muy oscurecido. Y `og-image.jpg` (1200 × 630, la que se ve al compartir el link por
WhatsApp) se arma con la misma foto: si cambia la portada, hay que regenerarla.

### El taller
| Archivo | Medida | Qué muestra |
|---|---|---|
| `assets/img/taller.webp` | 1200 × 675 | Laboratorio de colores. Va al lado del texto "El taller" |

### Sacabollos (`assets/img/sacabollos/`)
| Archivo | Miniatura | Grande | Qué muestra |
|---|---|---|---|
| `sacabollos-01` | 900 × 1200 | 1050 × 1400 | Honda Civic, vista del sector (la foto grande del bloque) |
| `sacabollos-02` | 600 × 800 | 1050 × 1400 | Renault Kangoo Stepway |
| `sacabollos-03` | 600 × 800 | 1050 × 1400 | Toyota Corolla Cross |

### Galería "El taller por dentro" (`assets/img/trabajos/`)
| Archivo | Miniatura | Grande | Qué muestra |
|---|---|---|---|
| `cabina-01` … `cabina-04` | 600 × 800 (3:4) | 960 × 1280 | Audi A1 en cabina y paragolpes |
| `laboratorio-01`, `-02` | 900 × 600 (3:2) | 1600 × 720 | Máquina de mezcla y carta de colores |

Cada foto tiene dos archivos: la miniatura (`cabina-01.webp`) y la que se abre al hacer
click (`cabina-01-full.webp`). Desde 700 px de ancho la galería va en 4 columnas: las
verticales ocupan una y las horizontales (`gallery__item--wide`) dos. En celular van todas
en un carrusel deslizable.

### Para sumar fotos a la galería
Duplicar un bloque `<a class="gallery__item">` en `index.html` con su par de archivos. Si
la foto es horizontal, sumarle la clase `gallery__item--wide`. La grilla y el visor se
acomodan solos.

> Las fotos de **antes y después** del mismo vehículo son las mejores para esta sección:
> es lo que más convence a un cliente particular y lo que mejor respalda un trabajo frente
> a una compañía.

---

## 2. Nombres de archivo nuevos, no pisados

Las imágenes tienen cache de una hora (`vercel.json`). Si una foto cambia de **medida**,
conviene darle un nombre nuevo en vez de pisar el archivo: así nadie ve una miniatura vieja
estirada dentro del recuadro nuevo. Si sólo cambia la foto y la medida es la misma, se
puede pisar el archivo.

---

## 3. Lo único que sí hay que tocar en el HTML

### Los textos `alt`
Cada `<img>` tiene un `alt` que describe la foto. Cuando cambie la foto, cambiar la
descripción. Sirve para Google y para lectores de pantalla.

### Los epígrafes
Cada foto de la galería y de sacabollos tiene el texto repetido en dos lugares del bloque:
`data-cap="…"` (lo que se lee en el visor) y `<span class="gallery__cap">` (el que aparece
al pasar el mouse). Conviene algo concreto: *"Audi A1 — lateral recién pintado"*.

---

## 4. Chequeo final

- [ ] Ninguna imagen pesa más de 250 KB
- [ ] Las miniaturas respetan la medida de la tabla (si no, se recortan raro)
- [ ] Ninguna patente legible
- [ ] Todos los `alt` y epígrafes describen la foto nueva
- [ ] Si cambió la portada, se regeneró `og-image.jpg`
- [ ] Si se tocó un `.css` o el `.js`, se subió el `?v=` en `index.html`
