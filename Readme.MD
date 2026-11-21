#  Taquilla — Frontend

### Proyecto académico | Sprint 1 y Sprint 2

**Taquilla** es una aplicación web responsiva para descubrir y explorar eventos como conciertos, festivales, obras de teatro y encuentros deportivos.

El proyecto está desarrollado con **React, Vite, JavaScript y CSS**, siguiendo los diseños proporcionados en Figma y consumiendo una API REST para obtener eventos, categorías, ciudades, textos y gestionar la autenticación.

La interfaz está adaptada para dispositivos móviles y computadores. No es una aplicación móvil nativa.

**Aplicación publicada:** [Ver Taquilla en Vercel](https://taquilla-project-20262.vercel.app/)

**Repositorio:** [Taquilla_Project_20262](https://github.com/julianPA26/Taquilla_Project_20262)

---

## 1. Objetivo del proyecto

Desarrollar el frontend de una plataforma de eventos que permita a los usuarios:

- Descubrir eventos destacados y próximos.
- Explorar eventos utilizando búsquedas y filtros.
- Consultar información detallada de cada evento.
- Visualizar fechas, localidades y precios disponibles.
- Consultar eventos relacionados.
- Iniciar sesión mediante la API del proyecto.
- Utilizar la plataforma en español e inglés.
- Navegar desde dispositivos móviles y computadores.
- Disponer de herramientas básicas de accesibilidad.

El proyecto se desarrolla por sprints, incorporando nuevas funcionalidades de manera progresiva.

---

## 2. Tecnologías utilizadas

| Tecnología       | Uso                                      |
| ---------------- | ---------------------------------------- |
| React 19         | Construcción de componentes e interfaces |
| Vite 8           | Entorno de desarrollo y compilación      |
| JavaScript (JSX) | Lógica e interacción                     |
| HTML5            | Estructura semántica                     |
| CSS3             | Diseño y adaptación responsiva           |
| Fetch API        | Comunicación con la API REST             |
| Git              | Control de versiones                     |
| GitHub           | Almacenamiento del código                |
| Vercel           | Publicación del frontend                 |
| Figma            | Referencia del diseño visual             |

No se utilizan librerías de componentes visuales ni frameworks de CSS.

La navegación se administra mediante la API History del navegador y el fragmento de la URL, sin una librería externa de rutas.

---

## 3. Funcionalidades implementadas

### Sprint 1 — Exploración de eventos

**Página de inicio**

La página principal presenta diferentes secciones para facilitar el descubrimiento de eventos:

- Evento principal destacado.
- Categorías de eventos.
- Destacados de la semana.
- Eventos para el fin de semana en móvil.
- Próximos eventos según la ciudad.
- Buscador para acceder a los resultados de Explorar.

**Página Explorar**

Permite consultar el catálogo de eventos utilizando:

- Búsqueda por texto.
- Filtros de categorías.
- Filtro por ciudad.
- Filtros de fechas.
- Rango de precios.
- Ordenamiento de resultados.
- Paginación.
- Filtros activos que pueden eliminarse.

También contempla los estados de carga, error y ausencia de resultados.

**Componentes generales**

- Navbar responsivo.
- Menú de navegación móvil.
- Selector de idioma español e inglés.
- Footer con enlaces informativos.
- Panel de accesibilidad.
- Aviso y preferencias de cookies.
- Tarjetas de eventos reutilizables.

### Sprint 2 — Detalle de eventos y autenticación

**US-TAQ-S2-01 — Detalle dinámico del evento**

Se implementó la vista `/eventos/:slug`, que consulta los datos reales del evento seleccionado.

La pantalla presenta:

- Imagen y título del evento.
- Descripción, con opción de expandir el contenido.
- Información de fecha y ubicación.
- Funciones disponibles.
- Localidades y precios.
- Información y políticas del evento.
- Eventos relacionados.
- Navegación hacia otros detalles.

**US-TAQ-S2-02 — Estados de carga, vacío y error**

Se incorporaron estados visuales para informar al usuario mientras se consulta la API:

- Indicadores y estructuras de carga.
- Mensaje para eventos no encontrados.
- Mensajes cuando falla una petición.
- Botón de reintento.
- Tratamiento de respuestas de error de la API.

**US-TAQ-S2-03 — Inicio de sesión**

Se creó la página `/ingresar`, con un formulario que incluye:

- Campo de correo electrónico.
- Campo de contraseña.
- Opción para mostrar u ocultar la contraseña.
- Validaciones del formulario.
- Estado de envío.
- Comunicación con `POST /sesion`.
- Actualización de la interfaz al recibir un usuario autenticado.

**US-TAQ-S2-04 — Manejo de errores de autenticación**

El formulario contempla:

- Campos obligatorios.
- Formato de correo incorrecto.
- Credenciales inválidas.
- Errores de conexión.
- Mensajes provenientes de la API.
- Respuesta `429` por exceso de intentos.
- Control del tiempo de espera indicado por `Retry-After`.
- Reintento después de un error de conexión.

**US-TAQ-S2-05 — Consulta y cierre de sesión**

En `src/Api/Sesion.js` están definidas las operaciones:

- `GET /sesion`: consultar una sesión activa.
- `DELETE /sesion`: solicitar el cierre de sesión.

También se implementó la presentación de la cuenta del usuario en el Navbar.

**Estado pendiente:** completar y verificar la integración de recuperación y cierre de sesión en la aplicación. Durante las pruebas se observaron dificultades de persistencia al recargar la web publicada en determinados navegadores móviles. No se considera esta parte completamente validada.

---

## 4. Requisitos para ejecutar el proyecto

Se necesita:

- Node.js compatible con Vite 8.
- npm.
- Git.
- Un navegador web actualizado.
- Conexión a internet para consumir la API.

Se recomienda utilizar Node.js **20.19 o superior**, o una versión LTS compatible.

Para comprobar las herramientas instaladas:

```bash
node --version
npm --version
git --version
```

---

## 5. Instalación y ejecución local

### Paso 1. Clonar el repositorio

```bash
git clone https://github.com/julianPA26/Taquilla_Project_20262.git
```

Entrar a la carpeta del proyecto:

```bash
cd Taquilla_Project_20262
```

### Paso 2. Instalar las dependencias

```bash
npm install
```

### Paso 3. Configurar las variables de entorno

Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`.

Su contenido debe ser:

```env
VITE_API_URL=https://yanethm-taquilla-api.fly.dev/api/v1
```

En Git Bash puede copiarse el archivo de ejemplo con:

```bash
cp .env.example .env
```

El archivo `.env` contiene la configuración local de la aplicación y no debe utilizarse para almacenar contraseñas ni secretos del usuario.

### Paso 4. Iniciar el servidor

```bash
npm run dev
```

Vite mostrará una dirección local, normalmente:

```text
http://localhost:5173
```

Abrir esa dirección en el navegador.

Para detener el servidor, utilizar `Ctrl + C` en la terminal.

---

## 6. Scripts disponibles

| Comando           | Descripción                                |
| ----------------- | ------------------------------------------ |
| `npm run dev`     | Inicia el servidor de desarrollo           |
| `npm run build`   | Genera la versión de producción en `dist/` |
| `npm run preview` | Permite visualizar la compilación local    |
| `npm run format`  | Aplica el formato configurado con Prettier |

Para comprobar la compilación antes de publicar cambios:

```bash
npm run build
```

---

## 7. API REST

Taquilla consume una API externa proporcionada para el proyecto académico.

**URL base:**

```text
https://yanethm-taquilla-api.fly.dev/api/v1
```

### Endpoints utilizados

| Método | Endpoint                      | Funcionalidad                    |
| ------ | ----------------------------- | -------------------------------- |
| GET    | `/textos?idioma=es`           | Textos de la interfaz en español |
| GET    | `/textos?idioma=en`           | Textos de la interfaz en inglés  |
| GET    | `/eventos/destacados`         | Eventos destacados               |
| GET    | `/eventos`                    | Catálogo, búsqueda y filtros     |
| GET    | `/eventos/:slug`              | Detalle de un evento             |
| GET    | `/eventos/:slug/relacionados` | Eventos relacionados             |
| GET    | `/categorias`                 | Categorías disponibles           |
| GET    | `/ciudades`                   | Ciudades disponibles             |
| POST   | `/sesion`                     | Inicio de sesión                 |
| GET    | `/sesion`                     | Consulta de sesión               |
| DELETE | `/sesion`                     | Cierre de sesión                 |

### Manejo de datos

La información de los eventos proviene de la API y se presenta mediante componentes reutilizables.

Los textos visibles de la interfaz se obtienen principalmente mediante `GET /textos`, según el idioma seleccionado.

La comunicación está organizada en archivos dentro de `src/Api/`, evitando realizar las mismas configuraciones de solicitudes en todos los componentes.

### Autenticación

La autenticación utiliza cookies HTTP administradas por el navegador y el backend.

Las peticiones de sesión emplean:

```javascript
credentials: "include";
```

Esta configuración permite enviar y recibir cookies cuando las políticas del navegador y del servidor lo autorizan.

No se almacenan tokens de autenticación en `localStorage`.

La duración de la sesión depende de la configuración de la cookie establecida por la API. La casilla visual «Mantener la sesión iniciada» no configura por sí sola una duración diferente.

---

## 8. Estructura principal del proyecto

```text
Taquilla_Project_20262/
│
├── src/
│   ├── Api/
│   │   ├── Cliente.js
│   │   ├── Rutas.js
│   │   └── Sesion.js
│   │
│   ├── Assets/
│   │   └── Logos/
│   │
│   ├── Pages/
│   │   ├── Inicio.jsx
│   │   ├── Explorar.jsx
│   │   ├── DetalleEvento.jsx
│   │   ├── DetalleEvento.css
│   │   ├── DetalleContenidoMovil.css
│   │   └── Acceso.jsx
│   │
│   ├── components/
│   │   ├── NavBar/
│   │   ├── Footer/
│   │   ├── FormularioIngreso/
│   │   ├── PanelAcceso/
│   │   ├── DetalleEncabezado/
│   │   ├── FuncionesEvento/
│   │   ├── LocalidadesEvento/
│   │   ├── EventosRelacionados/
│   │   ├── DetalleEstado/
│   │   ├── FiltrosExplorar/
│   │   └── AccessibilityPanel/
│   │
│   ├── hooks/
│   │   ├── useTextos.js
│   │   └── useDetalleEvento.js
│   │
│   ├── Utils/
│   ├── styles/
│   │   ├── tokens.css
│   │   └── global.css
│   │
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── IA.md
└── Readme.MD
```

La estructura anterior muestra los archivos y carpetas principales; no representa todos los componentes del repositorio.

### Responsabilidad de cada carpeta

- **`Api/`:** centraliza las rutas, la comunicación HTTP y las funciones de sesión.
- **`Pages/`:** contiene las vistas principales de la aplicación.
- **`components/`:** reúne elementos visuales reutilizables.
- **`hooks/`:** contiene lógica reutilizable para consultar y administrar datos.
- **`Utils/`:** agrupa funciones auxiliares, filtros, formatos y tratamiento de textos.
- **`styles/`:** contiene los estilos globales y las variables de diseño.
- **`Assets/`:** almacena recursos como logotipos.

`App.jsx` administra las vistas principales, el idioma, el usuario en memoria y parte de la navegación.

---

## 9. Navegación

El proyecto no utiliza React Router. La navegación se implementa mediante JavaScript y la API History del navegador.

### Rutas principales

| Ruta             | Descripción                    |
| ---------------- | ------------------------------ |
| `/#inicio`       | Página de inicio               |
| `/#explorar`     | Catálogo y filtros             |
| `/eventos/:slug` | Detalle dinámico del evento    |
| `/ingresar`      | Formulario de inicio de sesión |

En las rutas dinámicas, el `slug` identifica el evento que debe consultarse en la API.

Por ejemplo, la estructura de una URL de detalle es:

```text
/eventos/slug-del-evento
```

El valor utilizado debe corresponder a un evento real devuelto por la API.

---

## 10. Diseño responsivo

El diseño de Taquilla toma como referencia los archivos de Figma proporcionados para el proyecto.

La aplicación se adapta a diferentes tamaños de pantalla mediante:

- CSS Flexbox.
- CSS Grid.
- Media queries.
- Unidades relativas.
- Funciones como `clamp()`.
- Variables CSS.
- Ajustes específicos para móvil.

Las variables de diseño se encuentran principalmente en:

```text
src/styles/tokens.css
```

Allí se centralizan propiedades como colores, espacios, tipografía y bordes.

Se prioriza la reutilización de estilos y componentes para mantener consistencia entre las páginas.

---

## 11. Accesibilidad

La aplicación incorpora medidas básicas de accesibilidad:

- Estructura HTML semántica.
- Navegación mediante teclado.
- Indicadores de foco visibles.
- Etiquetas para los campos de formulario.
- Mensajes de error asociados a los campos.
- Enlace para saltar al contenido principal.
- Textos alternativos cuando corresponda.
- Atributos ARIA para controles interactivos.
- Panel de accesibilidad con opciones de visualización.

Estas medidas ayudan a mejorar el uso de la aplicación, aunque no representan una certificación de conformidad con WCAG.

---

## 12. Estado actual y limitaciones conocidas

El desarrollo incluye las principales funcionalidades de exploración, detalle de eventos y formulario de ingreso previstas para los dos primeros sprints.

Se mantienen las siguientes observaciones:

**Persistencia de sesión**

La consulta y el cierre de sesión están definidos en el módulo de API, pero queda pendiente validar su integración completa en la interfaz y su funcionamiento al recargar en diferentes navegadores.

En pruebas con la versión publicada en Vercel se observó que la sesión podía perderse al actualizar la página desde dispositivos móviles.

**Cookies entre dominios**

La interfaz está publicada en Vercel y la API está alojada en Fly.io. Al encontrarse en dominios diferentes, algunas políticas de privacidad de los navegadores pueden limitar el uso de cookies de sesión.

**Funciones fuera del alcance del Sprint 2**

El registro de usuarios, la recuperación de contraseña y la verificación de cuentas corresponden a funcionalidades posteriores y no se consideran implementadas.

Los enlaces visuales relacionados con estas funciones pueden permanecer presentes sin activar todavía sus respectivos flujos.

**Dependencia de la API**

La disponibilidad del catálogo, los textos y el ingreso depende de la respuesta del servicio externo.

---

## 13. Pruebas recomendadas

Antes de entregar o publicar una actualización, comprobar:

1. Que Inicio cargue los eventos correctamente.
2. Que Explorar permita buscar, filtrar y ordenar.
3. Que se pueda abrir el detalle de un evento.
4. Que los eventos relacionados permitan navegar a otro detalle.
5. Que un evento inexistente muestre el estado correspondiente.
6. Que los errores de API presenten mensajes adecuados.
7. Que el formulario valide correo y contraseña.
8. Que el inicio de sesión acepte credenciales válidas.
9. Que el error `429` aplique el bloqueo temporal correspondiente.
10. Que las vistas se adapten a dispositivos móviles.
11. Que la navegación con teclado funcione.
12. Que la compilación de producción termine sin errores.

Para la historia US-TAQ-S2-05 se requieren pruebas adicionales de recuperación y cierre de sesión.

---

## 14. Publicación

El frontend está publicado en Vercel:

**https://taquilla-project-20262.vercel.app/**

El código fuente se encuentra en GitHub:

**https://github.com/julianPA26/Taquilla_Project_20262**

Para generar una versión de producción localmente:

```bash
npm run build
```

Vite genera los archivos compilados dentro de la carpeta `dist/`.

Las rutas administradas por el frontend necesitan una configuración de publicación que permita entregar `index.html` cuando el usuario accede directamente a ellas.

También debe configurarse `VITE_API_URL` en el entorno de publicación.

---

## 15. Uso de inteligencia artificial

Durante el desarrollo se utilizaron herramientas de inteligencia artificial como apoyo para comprender conceptos, revisar código, analizar errores y mejorar la implementación.

Las decisiones y cambios se integraron en el contexto del proyecto académico.

El registro del uso de inteligencia artificial se encuentra en:

[IA.md](./IA.md)

---

## 16. Autor

**Proyecto académico de desarrollo frontend**

Repositorio: [@julianPA26](https://github.com/julianPA26)

**Taquilla — 2026**
