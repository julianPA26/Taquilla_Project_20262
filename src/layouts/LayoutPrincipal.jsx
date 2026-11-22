/**
 * LayoutPrincipal.jsx
 *
 * Define la estructura compartida de Taquilla:
 * - Enlace para saltar al contenido.
 * - Navbar, cuando corresponde.
 * - Contenido de la página mediante children.
 * - Footer, cuando corresponde.
 * - Elementos adicionales como avisos y paneles.
 *
 * No administra rutas, datos ni autenticación.
 */

export default function LayoutPrincipal({
  claseSitio = "sitio",
  textoSaltar,
  encabezado,
  pie,
  adicionales,
  children,
}) {
  /**
   * Permite saltar directamente al contenido
   * principal mediante el teclado.
   */
  function saltarAlContenido(evento) {
    evento.preventDefault();
    document.getElementById("contenido")?.focus();
  }

  return (
    <div className={claseSitio}>
      <a className="saltar-contenido" href="#contenido" onClick={saltarAlContenido}>
        {textoSaltar}
      </a>

      {/* Encabezado compartido entre las páginas públicas. */}
      {encabezado}

      {/* Cada vista se muestra dentro del mismo main. */}
      <main id="contenido" tabIndex={-1}>
        {children}
      </main>

      {/* Pie de página, si la vista lo utiliza. */}
      {pie}

      {/* Paneles y avisos que no pertenecen al main. */}
      {adicionales}
    </div>
  );
}
