# Registro de uso de IA · Taquilla (Sprint 1)

## Declaración

Sí usé inteligencia artificial en este proyecto.

- **Herramienta:** Claude (Anthropic), en el chat de claude.ai.
- **Para qué:** explicarme cómo hacer cosas (filtros, paginación, estados de carga y error), proponer y corregir código, revisar mis archivos, y guiarme con Git y con el Figma.
- **Lo que no hizo la IA:** abrir el Figma ni el repositorio de la profesora (no puede acceder a esos sitios). Yo tuve que exportar los recursos del diseño (logo, iconos y afiches en SVG), tomar capturas y subirle mis archivos para que los revisara. Las decisiones de qué hacer, el montaje del proyecto, las pruebas en el navegador y la integración final fueron mías.
- **Cómo trabajé con el código que me dio:** lo leí, lo adapté a mi estructura de carpetas y lo probé en el navegador. Cuando no se veía igual al Figma, lo comparé con una captura y se lo devolví para corregirlo. No lo pegué a ciegas.

## Resumen

| #   | Tema                                             | ¿La respuesta de la IA era correcta? |
| --- | ------------------------------------------------ | ------------------------------------ |
| 1   | Filtros, orden y paginación de Explorar          | Correcta (con pruebas)               |
| 2   | Colores de los afiches                           | **Equivocada**, corregida            |
| 3   | Posición del botón de accesibilidad en el navbar | **Equivocada**, corregida            |
| 4   | Tamaño del círculo del afiche del hero           | **Equivocada** (parcial), corregida  |
| 5   | Git: por qué no se subía nada a GitHub           | Correcta                             |

---

## Entrada 1 · Filtros, orden y paginación de Explorar

- **Fecha:** finales de octubre de 2026
- **Qué necesitaba:** que Explorar tuviera varias categorías a la vez, fecha, ciudad, rango de precio, chips con los filtros activos, orden y paginación, como en el Figma. La API solo filtra por **una** categoría, una ciudad, un texto y el orden.
- **Lo que le pedí (resumen):** ayuda para armar la pantalla de Explorar completa con las capturas del diseño en web y móvil.
- **Qué respondió:** traer **todos** los eventos (pidiendo cada página de la API) y filtrarlos en el navegador con una función `filtrarEventos`, calcular las páginas con `slice` y reiniciar la página a 1 cada vez que cambia un filtro. También explicó que las fechas de la API vienen en UTC y que en Colombia hay que restar 5 horas antes de comparar días.
- **¿Estaba bien?** Sí.
- **Qué hice con la respuesta:** copié los archivos (`useEvento.js`, `filtros.js`, `Explorar`, `FiltrosExplorar`, `Paginacion`), los acomodé a mi estructura de carpetas y corregí los `import`.
- **Cómo lo verifiqué:** en el navegador cambié filtros, orden y páginas, y revisé los estados de carga, error y sin resultados.
- **Lo que aprendí:** el estado de la pantalla es solo lo que la persona elige (filtros, orden, página); la lista filtrada y la página visible se **calculan** a partir de eso y no se guardan aparte.
- **Límite que quedó:** los filtros no se guardan en la dirección (URL).

---

## Entrada 2 · Colores de los afiches respuesta equivocada

- **Fecha:** inicios de noviembre de 2026
- **Qué necesitaba:** que los afiches de los eventos se vieran igual que en el Figma.
- **Lo que le pedí:** le dije que ya podía exportar las imágenes del Figma y que trabajáramos con eso en vez de aproximarlas.
- **Qué respondió (la parte equivocada):** hizo un componente `Afiche` que dibuja un degradado con los colores `color1` y `color2` que manda la API para cada evento, y dijo que eso quedaba igual a mis SVG _"suponiendo que coinciden"_.
- **Por qué estaba mal:** no coincidían. La API manda colores muy vivos (verde, naranja, azul) y el Figma usa tonos apagados. En mi captura todos los afiches salían distintos al diseño.
- **Cómo me di cuenta:** comparé mi página con el Figma y le mandé una captura diciendo que todos se veían diferentes.
- **Cómo se corrigió:** la IA leyó los SVG que exporté, sacó los colores de cada degradado (por ejemplo `#9F8B88 → #544552`) y creó `Utils/paleta.js`, que asigna a cada uno de los 8 eventos del diseño su paleta exacta y reparte esas mismas 8 paletas entre los demás eventos. Faltaba el afiche de _La casa de los relojes_; lo exporté después y se pusieron sus colores reales (`#B7A885 → #AF7E78`).
- **Cómo lo verifiqué:** volví a comparar las tarjetas con el Figma.
- **Lo que aprendí:** no dar por hecho que dos fuentes de datos coinciden; hay que comprobarlo contra el diseño. Y una suposición que la IA dice en voz alta ("suponiendo que...") es justo la parte que hay que probar primero.

---

## Entrada 3 · Posición del botón de accesibilidad respuesta equivocada

- **Fecha:** inicios de noviembre de 2026
- **Qué necesitaba:** en escritorio, el botón de accesibilidad a la **izquierda** del interruptor de idioma ES | EN, como en el Figma.
- **Qué respondió (la parte equivocada):** que pusiera `order: -1` en la regla `.navbar-fila-accesibilidad` del CSS.
- **Por qué estaba mal:** esa fila tiene `display: contents`, que hace que la fila no genere su propia caja. En un diseño flex, `order` solo funciona en los elementos hijos directos del contenedor, así que la propiedad no hacía nada.
- **Cómo me di cuenta:** el botón seguía saliendo a la derecha del idioma; se lo dije con una captura.
- **Cómo se corrigió:** la IA explicó la causa y movió el `order: -1` al **botón** (`.navbar-fila-accesibilidad .navbar-accesibilidad`), que sí es el elemento que participa en el diseño flex.
- **Cómo lo verifiqué:** recargué la página en escritorio y revisé el orden: buscador, accesibilidad, ES | EN, Ingresar y Crear cuenta.
- **Lo que aprendí:** `display: contents` hace que los hijos se comporten como hijos del abuelo; las propiedades de posición hay que ponerlas en esos hijos y no en el contenedor que "desaparece".

---

## Entrada 4 · Tamaño del círculo del afiche del hero respuesta equivocada (parcial)

- **Fecha:** inicios de noviembre de 2026
- **Qué necesitaba:** que el afiche grande de "Festival Niebla 2026" en el hero se viera como en el Figma.
- **Qué respondió (la parte equivocada):** reutilizó el mismo dibujo de las tarjetas (300 × 176) estirado para llenar la caja casi cuadrada del hero.
- **Por qué estaba mal:** al llenar la altura, el dibujo se agrandaba cerca de 1,6 veces y el círculo claro quedaba mucho más grande que en el diseño.
- **Cómo me di cuenta:** puse mi captura del hero al lado de la del Figma y le dije que el círculo interno era más grande.
- **Cómo se corrigió:** la IA midió la captura del Figma y concluyó que el círculo conserva su tamaño en relación con el **ancho**, no con el alto. Añadió al componente `Afiche` la propiedad `alto` (el hero usa un dibujo de 300 × 274) y alineó el dibujo arriba a la derecha. La IA advirtió que la posición del círculo oscuro de abajo era una medida aproximada.
- **Cómo lo verifiqué:** comparé de nuevo el hero con el Figma a 1440 px.
- **Lo que aprendí:** cuando una caja tiene otra proporción que el dibujo, hay que decidir si se escala por ancho o por alto; cada opción cambia el tamaño de las formas.

---

## Entrada 5 · Git: por qué no se subía nada a GitHub

- **Fecha:** inicios de noviembre de 2026
- **Qué necesitaba:** juntar mi rama `feature/explorar` con `main`. Hice `commit` y `pull`, todo decía estar bien, pero en GitHub no aparecía nada.
- **Qué respondió:** que `commit`, `merge` y `pull` solo trabajan en mi computador (`pull` solo **baja** cambios) y que lo que sube a GitHub es `git push`. Me indicó revisar `git remote -v` (a qué repositorio apunta mi `origin`), `git branch -vv` y el historial con `git log --graph`.
- **¿Estaba bien?** Sí.
- **Qué hice con la respuesta:** revisé a dónde apuntaba el `origin`, fusioné la rama en `main` y ejecuté `git push`.
- **Cómo lo verifiqué:** abrí mi repositorio en GitHub y comprobé que los archivos de Explorar estaban en `main`. Después borré la rama `feature/explorar` en mi computador y en GitHub.
- **Lo que aprendí:** `commit` guarda en mi equipo, `merge` junta ramas en mi equipo, `pull` baja y `push` sube.

---

## Reflexión

- Las tres respuestas equivocadas tuvieron algo en común: eran **suposiciones sobre algo que la IA no podía ver** (los colores reales del Figma, cómo se comportaba el CSS en mi pantalla, las proporciones del diseño). Se corrigieron cuando le di **evidencia**: capturas, los SVG exportados y mi pantalla al lado del diseño.
- Lo que más me sirvió fue pedirle que me explicara el **porqué** de cada arreglo, no solo el código nuevo.
- Mi regla: probar todo en el navegador contra el Figma antes de dar algo por terminado.
