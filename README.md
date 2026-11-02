# Taquilla — Frontend

Aplicación web para descubrir y explorar eventos (conciertos, teatro, deportes, festivales, comedia y más). Proyecto académico construido con **React 19 + Vite**, a partir de un diseño en Figma y consumiendo una API propia.

> Datos de ejemplo con fines académicos.

##  Funcionalidades

- **Inicio**: banner principal con buscador y selector de ciudad, categorías, *Destacados de la semana*, *Este fin de semana* (móvil) y *Próximamente en {ciudad}*.
- **Explorar**: filtros por categoría (varias a la vez), fecha (hoy, fin de semana, mes o rango), ciudad y rango de precio; orden por fecha, precio o popularidad; chips de filtros activos y paginación.
- **Navbar responsive** con menú móvil, buscador y cambio de idioma.
- **Idiomas**: español e inglés (los textos vienen de la API).
- **Modal de detalle de evento** y modal de **iniciar sesión / crear cuenta**.
- **Accesibilidad**: enlace "Saltar al contenido", foco gestionado, etiquetas ARIA y panel de accesibilidad.
- **Aviso y preferencias de cookies** (se guardan en `localStorage`).

## Tecnologías

- [React 19](https://react.dev/)
- [Vite](https://vite.dev/)
- CSS puro con **variables de diseño** (`tokens.css`) tomadas del Figma
- API REST: `https://yanethm-taquilla-api.fly.dev/api/v1` ([contrato](https://yanethm-taquilla-api.fly.dev/docs/contrato))

##  Cómo ejecutarlo

Requisitos: [Node.js](https://nodejs.org/) 18 o superior.

```bash
# 1. Clonar el repositorio
git clone https://github.com/julianPA26/Taquilla_Project_20262.git
cd Taquilla_Project_20262

# 2. Instalar dependencias
npm install

# 3. Levantar el servidor de desarrollo
npm run dev
```

Abre la dirección que muestra la terminal (normalmente `http://localhost:5173`).

## Estructura del proyecto

```
src/
├── main.jsx                 # Punto de entrada: carga estilos y monta <App />
├── App.jsx                  # Vista activa (hash), idioma, búsqueda y modales
├── App.css
├── api/
│   ├── cliente.js           # URL base de la API y función pedirJson
│   └── adaptadores.js       # Traduce los eventos de la API al formato interno
├── hooks/
│   ├── useTextos.js         # Textos de la interfaz según el idioma
│   ├── useApi.js            # Hook genérico para cualquier endpoint
│   └── useEvento.js         # Trae todos los eventos (todas las páginas)
├── Utils/
│   ├── filtros.js           # Filtrado de eventos en el navegador
│   ├── formato.js           # Precio, fecha y hora (zona America/Bogota)
│   └── paleta.js            # Colores de los afiches
├── Pages/
│   ├── Inicio.jsx
│   ├── Explorar.jsx
│   └── Explorar.css
├── components/              # Una carpeta por componente (.jsx + .css)
│   ├── NavBar/  Footer/  Hero/  Categorias/
│   ├── SeccionEventos/  ListaFinDeSemana/  EventCards/
│   ├── FiltrosExplorar/  Pagination/
│   ├── Afiche/  Icono/
│   ├── ModalEvent/  ModalAuth/
│   ├── AccessibilityPanel/
│   └── AvisoCookies/  Cookies/
├── Assets/Logos/
└── styles/
    ├── tokens.css           # Variables de diseño (colores, espacios, tipografía)
    └── global.css           # Reset y estilos base
```

## Cómo funciona

1. **Navegación por hash**: `App.jsx` lee `#inicio` o `#explorar` y muestra la página correspondiente, sin librería de rutas.
2. **Datos**: los hooks (`useTextos`, `useApi`, `useEventos`) piden información a la API, manejan carga, error, reintento y cancelación de peticiones.
3. **Filtrado en el navegador**: la API no ofrece todos los filtros del diseño (varias categorías, rango de precio, fechas), así que `useEventos` descarga todos los eventos y `filtrarEventos` los filtra localmente.
4. **Capa adaptadora**: `adaptadores.js` convierte cada evento de la API al formato que usan los componentes. Si la API cambia un nombre de campo, solo se ajusta ese archivo.
5. **Estilos con tokens**: todos los componentes usan variables de `tokens.css` para mantener el diseño consistente con Figma.


##  Entregas

El proyecto se divide en tres sprints:

- [x] **Sprint 1**: páginas Inicio y Explorar
- [ ] **Sprint 2**
- [ ] **Sprint 3**

##  Flujo de trabajo con Git

Las funcionalidades se desarrollan en ramas `feature/...` (por ejemplo `feature/explorar`) y luego se integran a `main`.

```bash
git checkout -b feature/nombre-de-la-funcionalidad
git add .
git commit -m "Descripción del cambio"
git push -u origin feature/nombre-de-la-funcionalidad
```

##  Autor

Proyecto desarrollado por **Julián Santiago Parra** como trabajo académico.