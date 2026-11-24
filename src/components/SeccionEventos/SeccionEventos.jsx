/**
 * SeccionEventos.jsx
 *
 * Sección reutilizable para eventos de Inicio.
 *
 * - Presenta Destacados y Próximamente.
 * - Conserva el carrusel y las tarjetas.
 * - Muestra esqueletos mientras llegan eventos.
 * - Obtiene los textos de carga desde la API.
 * - Conserva los estados de error y vacío.
 */

import Icono from "../Icono/Icono.jsx";
import TarjetaEvento from "../EventCards/TarjetaEvento.jsx";
import EstadoCarga from "../EstadoCarga/EstadoCarga.jsx";
import "./SeccionEventos.css";

const CANTIDAD_ESQUELETOS = 4;
const MAXIMO_TARJETAS = 6;

export default function SeccionEventos({
  id,
  titulo,
  tituloMovil,
  subtitulo,
  eventos,
  cargando,
  error,
  recargar,
  textos,
  idioma,
  onVerTodos,
  soloEscritorio = false,
  onVerEvento,
}) {
  const ingles = idioma === "en";

  // Limita la cantidad de tarjetas de la sección.
  const lista = (eventos ?? []).slice(0, MAXIMO_TARJETAS);

  const idTitulo = `${id}-titulo`;

  const verTodos =
    textos?.paginas?.inicio?.destacados?.enlaces?.verTodos ??
    textos?.general?.acciones?.verTodos ??
    (ingles ? "View all" : "Ver todos");

  const estados = textos?.estados;

  let contenido;

  /* ========================================
     ESTADO DE CARGA
     ======================================== */

  if (cargando && lista.length === 0) {
    contenido = (
      <>
        {/* Textos de carga obtenidos de GET /textos. */}
        <EstadoCarga textos={textos} />

        {/* Conserva los esqueletos originales. */}
        <ul className="seccion-lista" aria-hidden="true">
          {Array.from({ length: CANTIDAD_ESQUELETOS }, (_, indice) => (
            <li key={indice}>
              <div className="tarjeta-esqueleto" />
            </li>
          ))}
        </ul>
      </>
    );
  } else if (error && lista.length === 0) {
    /* ======================================
       ERROR DE LA API
       ====================================== */

    contenido = (
      <div className="seccion-mensaje seccion-mensaje-error" role="alert">
        <p>
          {estados?.error?.texto ??
            (ingles
              ? "Check your connection and try again."
              : "Revisa tu conexión e inténtalo de nuevo.")}
        </p>

        <button type="button" onClick={recargar}>
          {estados?.error?.botones?.reintentar ?? (ingles ? "Try again" : "Reintentar")}
        </button>
      </div>
    );
  } else if (lista.length === 0) {
    /* ======================================
       SIN EVENTOS
       ====================================== */

    contenido = (
      <div className="seccion-mensaje">
        <p>{estados?.vacio?.titulo ?? (ingles ? "Nothing here yet" : "No hay nada por aquí")}</p>
      </div>
    );
  } else {
    /* ======================================
       TARJETAS DE EVENTOS
       ====================================== */

    contenido = (
      <ul className="seccion-lista">
        {lista.map((evento) => (
          <li key={evento.id}>
            <TarjetaEvento
              evento={evento}
              textos={textos}
              idioma={idioma}
              onVerEvento={onVerEvento}
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section
      className={`seccion${soloEscritorio ? " seccion-solo-escritorio" : ""}`}
      aria-labelledby={idTitulo}
    >
      <div className="seccion-interior">
        {/* Encabezado de la sección. */}
        <div className="seccion-encabezado">
          <div>
            <h2 className="seccion-titulo" id={idTitulo}>
              {tituloMovil ? (
                <>
                  <span className="seccion-titulo-web">{titulo}</span>
                  <span className="seccion-titulo-movil">{tituloMovil}</span>
                </>
              ) : (
                titulo
              )}
            </h2>

            {subtitulo && <p className="seccion-subtitulo">{subtitulo}</p>}
          </div>

          <a
            className="seccion-ver-todos"
            href="#explorar"
            onClick={(evento) => {
              evento.preventDefault();
              onVerTodos?.();
            }}
          >
            {verTodos}
            <Icono nombre="flechaDerecha" />
          </a>
        </div>

        {/* Contenido según el estado de la consulta. */}
        {contenido}
      </div>
    </section>
  );
}
