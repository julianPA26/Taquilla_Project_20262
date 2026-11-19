import { useState } from "react";
import Afiche from "../Afiche/Afiche.jsx";
import Icono from "../Icono/Icono.jsx";
import { formatearHora } from "../../Utils/formato.js";
import { obtenerTexto, plantilla } from "../../Utils/textoDetalle.js";
import "./DetalleEncabezado.css";

function fechaConAnio(fechaIso, idioma) {
  if (!fechaIso || Number.isNaN(new Date(fechaIso).getTime())) return "";
  const componentes = new Intl.DateTimeFormat(idioma === "en" ? "en-US" : "es-CO", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "America/Bogota",
  }).formatToParts(new Date(fechaIso));
  const parte = (tipo) =>
    componentes.find((item) => item.type === tipo)?.value.replaceAll(".", "") ?? "";
  const dia = parte("weekday");
  if (idioma === "en") return `${dia} ${parte("month")} ${parte("day")}, ${parte("year")}`;
  return `${dia.charAt(0).toUpperCase()}${dia.slice(1)} ${parte("day")} ${parte("month")} ${parte("year")}`;
}

export default function DetalleEncabezado({ evento, textos, idioma, onVolver }) {
  const [compartido, setCompartido] = useState(false);
  const categoria =
    textos?.general?.categorias?.singular?.[evento.categoria] ||
    textos?.general?.categorias?.[evento.categoria] ||
    evento.categoria;

  const funcion = evento.funciones?.find((item) => item?.fecha);
  const fecha = funcion?.fecha || evento.fecha;
  const artistas = Array.isArray(evento.artistas)
    ? evento.artistas.filter(Boolean).join(" · ")
    : "";
  const subtitulo = artistas || evento.organizador?.nombre;
  const lugar = evento.recinto?.nombre;
  const ciudad = evento.recinto?.ciudad;
  const direccion = [evento.recinto?.direccion, ciudad].filter(Boolean).join(" · ");

  const etiquetaFecha = obtenerTexto(
    textos,
    "paginas.detalleEvento.datos.fecha",
    "paginas.detalleEvento.informacion.fecha",
    "paginas.detalleEvento.fecha.etiqueta",
    "general.fecha",
  );
  const etiquetaHora = obtenerTexto(
    textos,
    "paginas.detalleEvento.datos.hora",
    "paginas.detalleEvento.informacion.hora",
    "paginas.detalleEvento.hora.etiqueta",
    "general.hora",
  );
  const etiquetaLugar = obtenerTexto(
    textos,
    "paginas.detalleEvento.datos.lugar",
    "paginas.detalleEvento.informacion.lugar",
    "paginas.detalleEvento.lugar.etiqueta",
    "general.lugar",
  );
  const etiquetaCompartir = obtenerTexto(
    textos,
    "paginas.detalleEvento.botones.compartir",
    "paginas.detalleEvento.acciones.compartir",
    "componentes.botones.compartir",
  );
  const etiquetaRegresar = obtenerTexto(
    textos,
    "paginas.detalleEvento.botones.volver",
    "componentes.botones.volver",
    "navbar.enlaces.explorar",
  );
  const etiquetaCopiado = obtenerTexto(
    textos,
    "paginas.detalleEvento.mensajes.enlaceCopiado",
    "estados.exito.texto",
  );

  const esTodoPublico = evento.edadMinima === 0;
  const etiquetaEdad = esTodoPublico
    ? obtenerTexto(
        textos,
        "paginas.detalleEvento.etiquetas.todoPublico",
        "paginas.detalleEvento.edad.todoPublico",
      )
    : obtenerTexto(
        textos,
        "paginas.detalleEvento.etiquetas.edadMinima",
        "paginas.detalleEvento.edad.mayoresDe",
      );
  const edad =
    Number.isFinite(evento.edadMinima) && evento.edadMinima > 0
      ? etiquetaEdad
        ? plantilla(etiquetaEdad, { edad: evento.edadMinima, cantidad: evento.edadMinima })
        : `${evento.edadMinima}+`
      : esTodoPublico
        ? etiquetaEdad
        : "";

  async function compartir() {
    try {
      if (navigator.share) {
        await navigator.share({ title: evento.titulo, url: window.location.href });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href);
        setCompartido(true);
      }
    } catch (error) {
      if (error?.name !== "AbortError") console.error(error);
    }
  }

  return (
    <header className="detalle-encabezado">
      <Afiche evento={evento} variante="panoramico" className="detalle-encabezado__arte">
        <div className="detalle-encabezado__controles">
          <button
            type="button"
            className="detalle-encabezado__control"
            onClick={onVolver}
            aria-label={etiquetaRegresar}
            title={etiquetaRegresar}
          >
            <Icono nombre="chevronIzquierda" />
          </button>
          <button
            type="button"
            className="detalle-encabezado__control"
            onClick={compartir}
            aria-label={etiquetaCompartir}
            title={etiquetaCompartir}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 16V3m0 0L7.5 7.5M12 3l4.5 4.5" />
              <path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
            </svg>
          </button>
        </div>
      </Afiche>

      <div className="detalle-encabezado__contenido">
        <div className="detalle-encabezado__etiquetas">
          {categoria && <span className="detalle-encabezado__categoria">{categoria}</span>}
          {edad && (
            <span className="detalle-encabezado__categoria detalle-encabezado__categoria--edad">
              {edad}
            </span>
          )}
        </div>
        <h1>{evento.titulo}</h1>
        {subtitulo && <p className="detalle-encabezado__subtitulo">{subtitulo}</p>}

        <ul className="detalle-encabezado__datos">
          {fecha && (
            <li className="detalle-encabezado__item-fecha">
              <span className="detalle-encabezado__icono">
                <Icono nombre="calendario" />
              </span>
              <span className="detalle-encabezado__dato">
                {etiquetaFecha && (
                  <small className="detalle-encabezado__etiqueta">{etiquetaFecha}</small>
                )}
                <span>{fechaConAnio(fecha, idioma)}</span>
                <span className="detalle-encabezado__dato-secundario detalle-encabezado__hora-movil">
                  {formatearHora(fecha, idioma)}
                </span>
              </span>
            </li>
          )}
          {fecha && (
            <li className="detalle-encabezado__item-hora">
              <span
                className="detalle-encabezado__icono detalle-encabezado__reloj"
                aria-hidden="true"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </span>
              <span className="detalle-encabezado__dato">
                {etiquetaHora && (
                  <small className="detalle-encabezado__etiqueta">{etiquetaHora}</small>
                )}
                <span>{formatearHora(fecha, idioma)}</span>
              </span>
            </li>
          )}
          {lugar && (
            <li className="detalle-encabezado__item-lugar">
              <span className="detalle-encabezado__icono">
                <Icono nombre="ubicacion" />
              </span>
              <span className="detalle-encabezado__dato">
                {etiquetaLugar && (
                  <small className="detalle-encabezado__etiqueta">{etiquetaLugar}</small>
                )}
                <span className="detalle-encabezado__lugar-escritorio">
                  {lugar}
                  {ciudad ? `, ${ciudad}` : ""}
                </span>
                <span className="detalle-encabezado__lugar-movil">{lugar}</span>
                {direccion && (
                  <span className="detalle-encabezado__dato-secundario detalle-encabezado__direccion-movil">
                    {direccion}
                  </span>
                )}
              </span>
            </li>
          )}
        </ul>
        {compartido && etiquetaCopiado && (
          <p className="detalle-encabezado__compartido" role="status">
            {etiquetaCopiado}
          </p>
        )}
      </div>
    </header>
  );
}
