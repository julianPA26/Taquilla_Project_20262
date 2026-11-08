# Taquilla · Sprint 1

Interfaz web y móvil (diseño responsivo) de **Taquilla**, una plataforma para descubrir conciertos, teatro, deportes y festivales. Es un proyecto académico: replica el diseño de Figma entregado en clase y consume una API de prueba.

> No es una aplicación móvil nativa: son dos tamaños de la misma interfaz, revisados entre **360 px y 1440 px**.

## Qué incluye este sprint

- **Inicio:** encabezado con buscador, evento destacado, categorías, "Destacados de la semana", "Este fin de semana" (solo móvil) y "Próximamente en {ciudad}".
- **Explorar:** buscador, filtros (categorías, fecha, ciudad y rango de precio), chips de filtros activos, orden, paginación y los estados de carga, error y sin resultados.
- **Navbar y menú móvil** con los enlaces Inicio y Explorar, selector de idioma ES | EN, botón de accesibilidad y botones de Ingresar y Crear cuenta.
- **Pie de página** con enlaces y enlace a la declaración de accesibilidad.
- **Panel de accesibilidad**, **aviso y preferencias de cookies**, y diálogos de detalle de evento y de ingresar o crear cuenta.
- **Español e inglés:** todos los textos vienen de la API según el idioma elegido.
- **Accesibilidad básica:** enlace "Saltar al contenido", HTML semántico, etiquetas accesibles, foco visible y navegación con teclado.

## Tecnologías

| Herramienta            | Versión                              |
| ---------------------- | ------------------------------------ |
| React                  | 19                                   |
| Vite                   | 8                                    |
| JavaScript (JSX) y CSS | sin librerías de estilos ni de rutas |

## Requisitos

- **Node.js 20.19 o superior** (se recomienda la versión LTS actual). Incluye `npm`.
- **Git**, para clonar el repositorio.
- Conexión a internet: los textos y los eventos se piden a una API pública.

Para comprobar que los tienes:

```bash
node --version
npm --version
git --version
```

## Instalación y ejecución

1. **Clona el repositorio** y entra a la carpeta:

   ```bash
   git clone https://github.com/julianPA26/Taquilla_Project_20262.git
   cd Taquilla_Project_20262.git
   ```

2. **Instala las dependencias:**

   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo:**

   ```bash
   npm run dev
   ```

4. **Abre en el navegador** la dirección que aparece en la terminal, normalmente <http://localhost:5173>.

Para detener el servidor, presiona `Ctrl + C` en la terminal.

### Scripts disponibles

| Comando           | Qué hace                                                    |
| ----------------- | ----------------------------------------------------------- |
| `npm run dev`     | Inicia el servidor de desarrollo con recarga automática     |
| `npm run build`   | Genera la versión de producción en la carpeta `dist/`       |
| `npm run preview` | Sirve la versión de `dist/` para probarla antes de publicar |

## Datos y API

La aplicación **no tiene backend propio**: usa la API de prueba de la asignatura.

- **Dirección base:** `https://yanethm-taquilla-api.fly.dev/api/v1`
- **Rutas que usa:**
  - `GET /textos?idioma=es|en`: todos los textos de la interfaz.
  - `GET /eventos/destacados`: eventos del Inicio.
  - `GET /eventos?orden=...&porPagina=...&pagina=...`: catálogo completo (Explorar y secciones del Inicio).
  - `GET /categorias` y `GET /ciudades`: filtros y conteos.

Notas importantes:

- Si la API lleva un rato sin uso, se apaga: **la primera carga puede tardar unos segundos**. Si ves un mensaje de error, usa el botón _Reintentar_ o recarga la página.
- Los datos son de prueba y se reinician cuando la API se reinicia.
- Los filtros de Explorar (varias categorías, fecha, precio) se aplican en el navegador, porque la API solo filtra por una categoría, ciudad, texto y orden.

## Estructura del proyecto

```text
src/
├── main.jsx               Punto de entrada: carga los estilos y dibuja <App />
├── App.jsx                Elige la vista (Inicio o Explorar) según el # de la dirección
├── App.css
├── Assets/Logos/          Logo normal e inverso (SVG oficiales del diseño)
├── Pages/                 Inicio.jsx y Explorar.jsx
├── hooks/                 useTextos (textos), useApi (cualquier ruta), useEvento (catálogo)
├── Utils/                 filtros.js, formato.js (precios y fechas), paleta.js (colores de afiches)
├── styles/                tokens.css (tokens de diseño del Figma) y global.css
└── components/            Un componente por carpeta, con su .jsx y su .css
    ├── NavBar, Footer, Hero, Categorias, SeccionEventos, ListaFinDeSemana
    ├── EventCards (tarjeta de evento), Afiche, Icono
    ├── FiltrosExplorar, Pagination
    └── AccessibilityPanel, AvisoCookies, Cookies, ModalAuth, ModalEvent
```

### Cómo se navega

No se usa librería de rutas. La vista activa se guarda según el `#` de la dirección: `#inicio` y `#explorar`. Los enlaces a pantallas que no existen en este sprint (por ejemplo, el detalle de un evento) abren diálogos o no cambian de vista.

### Estilos

Los colores, espacios, radios, sombras y tipografía salen de `src/styles/tokens.css`, exportado del Figma con los mismos nombres de variable (`--fondo-pagina`, `--marca-primario`, `--espacio-4`...). La fuente es **Instrument Sans** (Google Fonts).

## Problemas frecuentes

| Problema                                       | Solución                                                                                                                                               |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm: command not found`                       | Instala Node.js desde <https://nodejs.org> y abre una terminal nueva                                                                                   |
| El puerto 5173 está ocupado                    | Vite usará el siguiente libre (5174...); abre la dirección que muestre la terminal                                                                     |
| La página queda con "Cargando…" o con un error | La API puede estar despertando: espera unos segundos y usa _Reintentar_                                                                                |
| Falla un `import` con un error de mayúsculas   | En Linux y en la mayoría de servicios de publicación importan las mayúsculas: el nombre del archivo debe coincidir **exactamente** con el del `import` |

## Enlace publicado

**Sitio:** https://taquilla-project-20262.vercel.app

## Autor

**Nombre:** Juliàn Santiago Parra Arias · Proyecto académico, Frontend

## Uso de inteligencia artificial

Se usó un asistente de IA durante el desarrollo. El detalle (para qué, qué se aceptó, qué estaba mal y cómo se corrigió) está en [`IA.md`](./IA.md).
