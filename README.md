# Taller Cacho — Sitio web

Sitio institucional del taller de chapa y pintura **Taller Cacho** (Diego Araoz 3339/49, Castelar).

Objetivo: presentar el taller frente a **compañías de seguros**, empresas y particulares.
No es un e-commerce ni una landing de captación masiva: es una presencia digital que tiene
que transmitir trayectoria, equipamiento y método de trabajo.

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
    │   └── site.js         Header, menú, reveals, contadores, FAQ, galería, form
    └── img/
        ├── hero-cabina.webp / hero-cabina-sm.webp
        ├── taller-*.webp, servicio-*.webp, seguros-*.webp, equipo-*.webp
        └── trabajos/       Galería (thumb 800×600 + versión -full para el lightbox)
```

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

### 1. Fotos reales del taller
**Todas las imágenes de `assets/img/` son provisorias** (banco de imágenes libre, sin
branding de terceros). Están sólo para que la demo se vea terminada.
Ver `REEMPLAZAR-FOTOS.md` para el procedimiento exacto.

### 2. Datos a confirmar con el cliente
Están marcados con comentarios en el HTML:

| Dato | Valor actual | Dónde |
|---|---|---|
| Años de experiencia | `+30` | Contadores, sección Nosotros |
| Plazo de respuesta | `24 h` | Contadores, sección Nosotros |
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

## Formulario de contacto

No hay backend: el formulario **arma el mensaje y abre WhatsApp** con el texto listo.
Es lo que mejor funciona para este tipo de negocio y no requiere servidor ni mail.

El número está en una sola constante, arriba del bloque en `assets/js/site.js`:

```js
var WA_NUMBER = '5491134502319';
```

**Si más adelante se quiere recibir por mail**, la forma más rápida es Formspree:
1. Crear el form en formspree.io y copiar el endpoint.
2. En `index.html`, agregarle al `<form>`: `action="https://formspree.io/f/XXXX" method="POST"`.
3. En `site.js`, en el handler del `submit`, borrar el `e.preventDefault()` y el bloque
   que arma la URL de wa.me. La validación de campos se mantiene igual.

---

## SEO

- `<title>` y meta description apuntadas a *chapa y pintura Castelar*, *reparación de
  siniestros*, *taller para seguros*, *zona oeste*.
- Open Graph + Twitter Card con `og-image.jpg`.
- **JSON-LD `AutoBodyShop`**: dirección, teléfono, horarios, zonas de cobertura y catálogo
  de servicios.
- **JSON-LD `FAQPage`**: las 7 preguntas frecuentes, elegibles para rich results.
  Si se edita una pregunta en el HTML hay que editarla también en el JSON-LD.
- `robots.txt` + `sitemap.xml`.

Después de publicar: dar de alta el sitio en **Google Search Console** y enlazarlo desde la
ficha de **Google Business Profile** del taller (es lo que más mueve la aguja en búsquedas
locales tipo "chapa y pintura Castelar").

---

## Rendimiento y accesibilidad

- Imágenes en **WebP**, con `loading="lazy"` en todo lo que está bajo el fold (19 de 24).
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

El proyecto es estático, no hay build step.

1. Importar el repo en Vercel.
2. Framework Preset: **Other**.
3. Build Command: vacío. Output Directory: **`sitio`** (o mover el contenido de `sitio/`
   a la raíz del repo y dejarlo en blanco).
4. Deploy.
5. Conectar el dominio y hacer el reemplazo del punto 3 de *Pendientes*.

`vercel.json` ya deja configurado el cache largo para imágenes y fuentes y los headers de
seguridad (`X-Content-Type-Options`, `Referrer-Policy`, etc.).
