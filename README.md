# Taller Cacho — Sitio web

Sitio institucional del taller de chapa y pintura **Taller Cacho** (Diego Araoz 3339/49, Castelar).

Objetivo: presentar el taller frente a **compañías de seguros**, empresas y particulares.
No es un e-commerce ni una landing de captación masiva. El pedido del dueño fue explícito:
*"que se sepa que existo y que para las compañías de seguro alcance y sobre"*. Por eso el
sitio es **corto a propósito** — 7 bloques, sin secciones de relleno.

---

## Stack

HTML + CSS + JavaScript vanilla. **Sin build, sin dependencias, sin CDN.**
Se sube tal cual está y funciona.

```
sitio/
├── index.html              Toda la página (una sola vista, secciones ancladas)
├── og-image.jpg            Imagen para WhatsApp / Facebook / X (1200×630)
├── favicon.png             Favicon 32×32
├── apple-touch-icon.png    Icono iOS 180×180
├── icon-512.png            Icono 512×512 (PWA + schema.org)
├── site.webmanifest        Manifest
├── robots.txt / sitemap.xml
├── vercel.json             Cache-Control y headers de seguridad
└── assets/
    ├── brand/
    │   └── logo-cacho-blanco.png   Logo blanco sobre transparente (único archivo:
    │                               la variante grafito del header se genera con
    │                               una máscara CSS sobre este mismo PNG)
    ├── css/
    │   ├── base.css        Tokens, tipografías, reset, botones, animaciones
    │   └── site.css        Componentes y secciones
    ├── fonts/              Archivo + Instrument Sans (woff2, self-hosted)
    ├── js/
    │   └── site.js         Header, menú, reveals, FAQ, galería, flotantes
    └── img/
        ├── hero.webp / hero-sm.webp   Portada (1800 px / 900 px)
        ├── taller.webp                Bloque "El taller"
        ├── seguros.webp               Fondo de la banda de seguros (va en B/N y oscurecida)
        └── trabajos/                  Galería: 4 fotos, thumb 800×600 + versión -full
```

**Los 8 bloques:** portada · el taller + equipamiento · servicios · compañías de seguros ·
el taller por dentro · compra y venta · preguntas frecuentes · contacto + mapa.

---

## Identidad visual

Todo salió del logotipo original, no se inventaron colores.

| Token | Valor | Uso |
|---|---|---|
| `--g-500` | `#5f6266` | **Color exacto del logotipo.** Base de toda la escala |
| `--g-950` | `#0e1013` | Fondos oscuros (hero, equipamiento, seguros, footer) |
| `--g-900` | `#16181b` | Texto principal, botones sólidos |
| `--g-050` → `--g-150` | grises claros | Fondos suaves y líneas |
| `--sheen` | degradé | Veta metálica: único "acento", derivado del mismo gris |

El sistema es **monocromático a propósito**: gris grafito, blanco y una veta metálica.
Es lo que separa la web de la competencia del rubro, que suele usar rojo/naranja saturado.
El verde sólo aparece en el botón de WhatsApp, por reconocimiento del canal.

**Tipografías:** `Archivo` (títulos, UI, números) + `Instrument Sans` (texto).
Ambas self-hosted en `assets/fonts/`, con `size-adjust` en los fallbacks para que no
haya salto de layout mientras cargan.

---

## ⚠️ Pendientes antes de publicar

### 1. Fotos
Las 5 fotos del sitio son **reales, del taller** (cabina de pintura y laboratorio de
colores). No hay ninguna de un vehículo terminado, por eso la sección se llama
"El taller por dentro" y no "Trabajos realizados". Cuando el cliente mande fotos de
unidades entregadas conviene sumarlas: es lo que más convence a un particular.
Ver `REEMPLAZAR-FOTOS.md` para el procedimiento.

### 2. Datos a confirmar con el cliente

| Dato | Valor actual | Dónde |
|---|---|---|
| Horarios de atención | Lun–Vie 8–18 h · Sáb 9–13 h | Contacto, footer y `schema.org` |

Si cambian los horarios hay que actualizarlos en **tres lugares**: el bloque
`openingHoursSpecification` del JSON-LD, la fila de Contacto y el `<address>` del footer.

### 3. Dominio
Está puesto `https://tallercacho.com.ar` como placeholder. Hay que reemplazarlo en:
`index.html` (canonical, `og:url`, `og:image`, `twitter:image`, los dos bloques JSON-LD),
`robots.txt` y `sitemap.xml`. Buscar y reemplazar `tallercacho.com.ar`.

### 4. Verificar la ubicación del mapa
El iframe apunta a `Diego Araoz 3339, Castelar`. Conviene confirmar con el cliente que
el pin cae exactamente sobre el portón del taller. Si no, reemplazar la URL del iframe
y del botón "Abrir en Google Maps" por el link corto del lugar en Maps.

---

## Contacto

**No hay formulario a propósito.** Un formulario suma alto de página y un paso más, y el
taller atiende por WhatsApp igual. Los contactos son: el botón flotante de WhatsApp (siempre
visible), los botones del hero y de la banda de seguros, las cuatro tarjetas de la sección
Contacto y el `tel:` para llamar desde el celular.

El número aparece como `wa.me/5491134502319` en `index.html`. Si cambia, buscar y reemplazar
esa cadena (aparece en el header móvil, el hero, seguros, contacto, footer y el botón flotante)
y también `+541146239498` para el teléfono fijo.

---

## SEO

- `<title>` y meta description apuntadas a *chapa y pintura Castelar*, *reparación de
  siniestros*, *taller para seguros*, *zona oeste*.
- Open Graph + Twitter Card con `og-image.jpg`.
- **JSON-LD `AutoBodyShop`**: dirección, teléfono, horarios, zonas de cobertura y catálogo
  de servicios.
- **JSON-LD `FAQPage`**: las 4 preguntas frecuentes, elegibles para rich results.
  Si se edita una pregunta en el HTML hay que editarla también en el JSON-LD.
  Es el motivo por el que la sección de preguntas sobrevivió al recorte: cerrada ocupa
  muy poco y es lo único que puede darle a Google un resultado enriquecido.
- `robots.txt` + `sitemap.xml`.

Después de publicar: dar de alta el sitio en **Google Search Console** y enlazarlo desde la
ficha de **Google Business Profile** del taller (es lo que más mueve la aguja en búsquedas
locales tipo "chapa y pintura Castelar").

---

## Rendimiento y accesibilidad

- Imágenes en **WebP**, con `loading="lazy"` en todo lo que está bajo el fold.
- Hero precargado con `<link rel="preload">` + `srcset` (versión de 900px para celular).
- Fuentes self-hosted con `preload` y `font-display: swap`.
- **Sin CLS**: todas las imágenes tienen `width`/`height` o un contenedor con `aspect-ratio`.
- Contraste verificado: todo el texto cumple **WCAG AA**.
- Estructura de encabezados correcta (un solo `h1`, `h2` por sección, `h3` en las tarjetas).
- Navegación por teclado completa, con `skip-link`, foco visible y foco atrapado en el lightbox.
- `prefers-reduced-motion` respetado: se desactivan reveals, parallax y contadores animados.

---

## Desarrollo local

Cualquier servidor estático sirve:

```bash
python -m http.server 4370 --directory "C:/TNR/Cacho/sitio"
```

---

## Deploy en Vercel

El proyecto es estático, no hay build step. El repositorio git está inicializado en esta
misma carpeta, así que `index.html` queda en la raíz del repo.

1. Importar el repo en Vercel.
2. Framework Preset: **Other**.
3. Build Command: vacío. Output Directory: vacío (raíz).
4. Deploy.
5. Conectar el dominio y hacer el reemplazo del punto 3 de *Pendientes*.

`vercel.json` ya deja configurados los headers de seguridad (`X-Content-Type-Options`,
`Referrer-Policy`, etc.) y el cache de cada tipo de archivo.

### ⚠️ Al editar un `.css` o un `.js`: subir el `?v=`

En `index.html` los estilos y el script se piden con una versión:

```html
<link rel="stylesheet" href="assets/css/base.css?v=2">
<link rel="stylesheet" href="assets/css/site.css?v=2">
<script src="assets/js/site.js?v=2" defer></script>
```

**Cada vez que se toque un CSS o el JS hay que subir ese número en los tres.** Si no, un
visitante que ya entró antes puede quedarse con el CSS viejo y el HTML nuevo, y la página se
rompe (pasó con el equipamiento: el markup nuevo usa `.equip__item` y el CSS viejo tenía
`.equip__card`, así que la sección quedaba sin estilo).

El `vercel.json` también fuerza `no-cache` en CSS y JS como segunda red de seguridad, pero
el `?v=` es lo que evita hasta la petición de revalidación.

### Qué hace cada regla del `vercel.json`

`vercel.json` no admite comentarios ni propiedades extra dentro de `headers` — agregarle una
clave `"comment"` hace que el deploy **falle en la validación** y Vercel se quede sirviendo la
versión anterior. Por eso la explicación va acá:

| Ruta | Cache-Control | Por qué |
|---|---|---|
| `/assets/fonts/*` | `max-age=31536000, immutable` | Las fuentes nunca cambian con el mismo nombre. |
| `/assets/img/*` | `max-age=3600, stale-while-revalidate=86400` | **No pueden ser `immutable`**: el procedimiento de `REEMPLAZAR-FOTOS.md` es pisar los archivos con el mismo nombre, y con `immutable` los visitantes que ya entraron verían las fotos viejas durante un año. |
| `/assets/css/*`, `/assets/js/*` | `no-cache` | El HTML y el CSS tienen que viajar juntos. Revalidan siempre; el 304 pesa casi nada. |
| `/*` | — | Sólo headers de seguridad. **No agregarle `Cache-Control`**: sobreescribiría a los de arriba. |
