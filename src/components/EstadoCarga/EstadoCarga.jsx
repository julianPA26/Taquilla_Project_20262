/**
 * EstadoCarga.jsx
 *
 * Estado de carga reutilizable de Taquilla.
 *
 * Utiliza exclusivamente los textos recibidos
 * desde GET /textos:
 * - estados.cargando.titulo
 * - estados.cargando.texto
 * - estados.cargando.indicador
 *
 * Si todavía no llegaron los textos, no muestra
 * mensajes escritos directamente en el código.
 */

import "./EstadoCarga.css";

export default function EstadoCarga({ textos }) {
  // Obtiene los tres valores del idioma activo.
  const carga = textos?.estados?.cargando;

  const titulo = carga?.titulo;
  const texto = carga?.texto;
  const indicador = carga?.indicador;

  /**
   * Mientras se espera GET /textos, no hay
   * palabras disponibles para presentar.
   * Los componentes padres mantienen sus esqueletos.
   */
  if (!titulo && !texto && !indicador) {
    return null;
  }

  return (
    <div className="estado-carga" role="status" aria-live="polite" aria-atomic="true">
      {/* Indicador visual con nombre accesible de la API. */}
      {indicador && <span className="estado-carga__indicador" role="img" aria-label={indicador} />}

      {/* Título y mensaje visibles obtenidos de la API. */}
      <div className="estado-carga__contenido">
        {titulo && <p className="estado-carga__titulo">{titulo}</p>}

        {texto && <p className="estado-carga__texto">{texto}</p>}
      </div>
    </div>
  );
}
