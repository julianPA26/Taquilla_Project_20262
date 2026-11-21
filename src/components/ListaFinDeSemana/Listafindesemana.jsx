/**
 * Listafindesemana.jsx
 *
 * Muestra hasta tres eventos del fin de semana
 * en tarjetas horizontales para la vista móvil.
 *
 * Los eventos provienen de la API y cada tarjeta
 * permite abrir su página de detalle.
 */

import Afiche from "../Afiche/Afiche.jsx";
import Icono from "../Icono/Icono.jsx";

import { formatearFechaCorta, formatearHora, formatearPrecio } from "../../Utils/formato.js";

import "./Listafindesemana.css";

export default function ListaFinDeSemana({
  textos,
  idioma,
  eventos,
  cargando,
  onVerTodos,
  onVerEvento,
}) {
  // Obtiene los textos de la sección desde la API.
  const titulo = textos?.paginas?.inicio?.filtrosMovil?.finDeSemana;

  const verTodos =
    textos?.paginas?.inicio?.destacados?.enlaces?.verTodos ?? textos?.general?.acciones?.verTodos;

  const desde = textos?.componentes?.precio?.desde;

  // La lista presenta como máximo tres eventos.
  const lista = (eventos ?? []).slice(0, 3);

  // No dibuja la sección si no existen eventos.
  if (!cargando && lista.length === 0) {
    return null;
  }

  /**
   * Abre la vista Explorar desde el enlace Ver todos.
   */
  function manejarVerTodos(evento) {
    evento.preventDefault();
    onVerTodos?.();
  }

  /**
   * Abre el detalle sin recargar la página.
   * Permite que el navegador gestione los clics
   * con Ctrl, Cmd o botón secundario normalmente.
   */
  function manejarVerEvento(eventoClick, evento) {
    if (
      eventoClick.metaKey ||
      eventoClick.ctrlKey ||
      eventoClick.shiftKey ||
      eventoClick.altKey ||
      eventoClick.button !== 0
    ) {
      return;
    }

    if (onVerEvento) {
      eventoClick.preventDefault();
      onVerEvento(evento);
    }
  }

  return (
    <section className="finde" aria-labelledby="finde-titulo">
      <div className="finde-interior">
        {/* ENCABEZADO */}

        <div className="finde-encabezado">
          <h2 className="finde-titulo" id="finde-titulo">
            {titulo}
          </h2>

          <a className="finde-ver-todos" href="/#explorar" onClick={manejarVerTodos}>
            {verTodos}
            <Icono nombre="flechaDerecha" />
          </a>
        </div>

        {/* LISTA DE TARJETAS */}

        <ul className="finde-lista" aria-busy={cargando}>
          {lista.map((evento) => (
            <li key={evento.id}>
              <a
                className="finde-fila"
                href={`/eventos/${encodeURIComponent(evento.slug)}`}
                onClick={(eventoClick) => manejarVerEvento(eventoClick, evento)}
              >
                {/* MINIATURA */}

                <Afiche evento={evento} className="finde-miniatura" />

                {/* INFORMACIÓN DEL EVENTO */}

                <span className="finde-texto">
                  <span className="finde-nombre">{evento.titulo}</span>

                  <span className="finde-fecha">
                    {formatearFechaCorta(evento.fecha, idioma)}
                    {" · "}
                    {formatearHora(evento.fecha, idioma)}
                  </span>

                  <span className="finde-precio">
                    {desde} {formatearPrecio(evento.precioDesde)}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
