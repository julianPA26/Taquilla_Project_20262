import Icono from "../Icono/Icono.jsx";
import TarjetaEvento from "../EventCards/TarjetaEvento.jsx";
import "./SeccionEventos.css";

const CANTIDAD_ESQUELETOS = 4;
const MAXIMO_TARJETAS = 6;

// Sección del Inicio con una fila de tarjetas. Se usa para "Destacados de la semana"
// y "Próximamente en {ciudad}".
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
  const lista = (eventos ?? []).slice(0, MAXIMO_TARJETAS);
  const idTitulo = `${id}-titulo`;
  const verTodos =
    textos?.paginas?.inicio?.destacados?.enlaces?.verTodos ??
    textos?.general?.acciones?.verTodos ??
    (ingles ? "View all" : "Ver todos");
  const estados = textos?.estados;

  let contenido;
  if (cargando && lista.length === 0) {
    contenido = (
      <>
        <p className="seccion-estado-oculto" role="status">
          {estados?.cargando?.indicador ?? (ingles ? "Loading…" : "Cargando…")}
        </p>
        <ul className="seccion-lista" aria-hidden="true">
          {Array.from({ length: CANTIDAD_ESQUELETOS }, (_, i) => (
            <li key={i}>
              <div className="tarjeta-esqueleto" />
            </li>
          ))}
        </ul>
      </>
    );
  } else if (error && lista.length === 0) {
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
    contenido = (
      <div className="seccion-mensaje">
        <p>{estados?.vacio?.titulo ?? (ingles ? "Nothing here yet" : "No hay nada por aquí")}</p>
      </div>
    );
  } else {
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

        {contenido}
      </div>
    </section>
  );
}
