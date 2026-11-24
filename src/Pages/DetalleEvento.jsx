
import { useEffect, useState } from "react";

import DetalleEncabezado from "../components/DetalleEncabezado/DetalleEncabezado.jsx";
import FuncionesEvento from "../components/FuncionesEvento/FuncionesEvento.jsx";
import LocalidadesEvento from "../components/LocalidadesEvento/LocalidadesEvento.jsx";
import EventosRelacionados from "../components/EventosRelacionados/EventosRelacionados.jsx";
import DetalleEstado from "../components/DetalleEstado/DetalleEstado.jsx";
import EstadoCarga from "../components/EstadoCarga/EstadoCarga.jsx";
import Icono from "../components/Icono/Icono.jsx";

import { useDetalleEvento } from "../hooks/useDetalleEvento.js";

import { etiquetaDetalle, obtenerTexto } from "../Utils/textoDetalle.js";

import "./DetalleEvento.css";
import "./DetalleContenidoMovil.css";

export default function DetalleEvento({ slug, textos, idioma, onVolver, onVerEvento }) {
  const { evento, relacionados, cargando, error, noEncontrado, reintentar } =
    useDetalleEvento(slug);

  const [descripcionExpandida, setDescripcionExpandida] = useState(false);

  /* ========================================
     CAMBIO DE EVENTO
     ======================================== */

  // Restablece "Leer más" cuando cambia el slug.
  useEffect(() => {
    setDescripcionExpandida(false);
  }, [slug]);

  /* ========================================
     METADATOS DEL DOCUMENTO
     ======================================== */

  /**
   * Actualiza el título y la descripción
   * del documento con los datos del evento.
   */
  useEffect(() => {
    if (!evento) return;

    const tituloAnterior = document.title;

    let metaDescripcion = document.querySelector('meta[name="description"]');

    const metaCreada = !metaDescripcion;

    if (!metaDescripcion) {
      metaDescripcion = document.createElement("meta");
      metaDescripcion.setAttribute("name", "description");

      document.head.appendChild(metaDescripcion);
    }

    const descripcionAnterior = metaDescripcion.getAttribute("content");

    document.title = `${evento.titulo} · Taquilla`;

    metaDescripcion.setAttribute("content", evento.descripcion || "");

    return () => {
      document.title = tituloAnterior;

      if (metaCreada) {
        metaDescripcion.remove();
      } else if (descripcionAnterior === null) {
        metaDescripcion.removeAttribute("content");
      } else {
        metaDescripcion.setAttribute("content", descripcionAnterior);
      }
    };
  }, [evento]);

  /* ========================================
     ESTADO DE CARGA
     ======================================== */

  if (cargando) {
    return (
      <div className="detalle-evento detalle-evento--cargando" aria-busy="true">
        {/* Los textos se obtienen desde GET /textos. */}
        <EstadoCarga textos={textos} />

        {/* Esqueletos originales del detalle. */}
        <div
          className={["detalle-evento__esqueleto", "detalle-evento__esqueleto--afiche"].join(" ")}
          aria-hidden="true"
        />

        <div
          className={["detalle-evento__esqueleto", "detalle-evento__esqueleto--titulo"].join(" ")}
          aria-hidden="true"
        />

        <div
          className={["detalle-evento__esqueleto", "detalle-evento__esqueleto--texto"].join(" ")}
          aria-hidden="true"
        />
      </div>
    );
  }

  /* ========================================
     EVENTO NO ENCONTRADO
     ======================================== */

  if (noEncontrado) {
    return (
      <div className="detalle-evento">
        <DetalleEstado tipo="noEncontrado" textos={textos} onVolver={onVolver} />
      </div>
    );
  }

  /* ========================================
     ERROR DE CONSULTA
     ======================================== */

  if (error || !evento) {
    return (
      <div className="detalle-evento">
        <DetalleEstado tipo="error" textos={textos} error={error} onReintentar={reintentar} />
      </div>
    );
  }

  /* ========================================
     TEXTOS DE LA API
     ======================================== */

  const tituloSobreEvento = etiquetaDetalle(
    textos,
    "sobreEvento",
    "paginas.detalleEvento.descripcion.titulo",
  );

  const tituloComoLlegar = etiquetaDetalle(
    textos,
    "comoLlegar",
    "paginas.detalleEvento.ubicacion.titulo",
  );

  const tituloPoliticas = obtenerTexto(
    textos,
    "paginas.detalleEvento.politicas.titulo",
    "paginas.detalleEvento.secciones.politicas.titulo",
  );

  const pestanaDescripcion =
    obtenerTexto(
      textos,
      "paginas.detalleEvento.pestanas.descripcion",
      "paginas.detalleEvento.tabs.descripcion",
    ) || tituloSobreEvento;

  const pestanaUbicacion =
    obtenerTexto(
      textos,
      "paginas.detalleEvento.pestanas.comoLlegar",
      "paginas.detalleEvento.tabs.comoLlegar",
    ) || tituloComoLlegar;

  const pestanaPoliticas =
    obtenerTexto(
      textos,
      "paginas.detalleEvento.pestanas.politicas",
      "paginas.detalleEvento.tabs.politicas",
    ) || tituloPoliticas;

  // Etiquetas para expandir y contraer el contenido.
  const etiquetaLeerMas =
    obtenerTexto(
      textos,
      "paginas.detalleEvento.descripcion.leerMas",
      "paginas.detalleEvento.botones.leerMas",
      "paginas.detalleEvento.acciones.leerMas",
      "paginas.detalleEvento.acciones.verMas",
      "paginas.detalleEvento.verMas",
    ) || (idioma === "en" ? "Read more" : "Leer más");

  const etiquetaLeerMenos =
    obtenerTexto(
      textos,
      "paginas.detalleEvento.descripcion.leerMenos",
      "paginas.detalleEvento.botones.leerMenos",
      "paginas.detalleEvento.acciones.leerMenos",
      "paginas.detalleEvento.acciones.verMenos",
      "paginas.detalleEvento.verMenos",
    ) || (idioma === "en" ? "Read less" : "Leer menos");

  /* ========================================
     DATOS DEL EVENTO
     ======================================== */

  const recinto = evento.recinto;

  const direccion = [recinto?.direccion, recinto?.ciudad].filter(Boolean).join(", ");

  const mostrarUbicacion = Boolean(recinto?.nombre || direccion);

  const mapaEtiqueta = obtenerTexto(
    textos,
    "paginas.detalleEvento.ubicacion.mapa",
    "paginas.detalleEvento.mapa.etiqueta",
  );

  const politicas = typeof evento.politicas === "string" ? evento.politicas : "";

  const tieneFunciones = Array.isArray(evento.funciones) && evento.funciones.length > 0;

  const tieneLocalidades = Array.isArray(evento.localidades) && evento.localidades.length > 0;

  /**
   * Alterna las secciones adicionales
   * sin modificar el ancho de la página.
   */
  function cambiarExpansion() {
    setDescripcionExpandida((actual) => !actual);
  }

  /* ========================================
     DETALLE DEL EVENTO
     ======================================== */

  return (
    <article className="detalle-evento" data-detalle-abierto={descripcionExpandida}>
      {/* ======================================
          MIGAS DE PAN - ESCRITORIO
          ====================================== */}

      <nav className="detalle-evento__migas">
        <ol>
          <li>
            <a
              href="/#inicio"
              onClick={(eventoClick) => {
                eventoClick.preventDefault();
                onVolver("inicio");
              }}
            >
              {obtenerTexto(
                textos,
                "componentes.migas.inicio",
                "footer.columnas.explora.enlaces.inicio",
                "navbar.enlaces.inicio",
              )}
            </a>
          </li>

          <li>
            <a
              href="/#explorar"
              onClick={(eventoClick) => {
                eventoClick.preventDefault();
                onVolver("explorar");
              }}
            >
              {obtenerTexto(textos, "componentes.migas.explorar", "navbar.enlaces.explorar")}
            </a>
          </li>

          <li aria-current="page">{evento.titulo}</li>
        </ol>
      </nav>

      {/* ======================================
          ENCABEZADO
          ====================================== */}

      <DetalleEncabezado
        evento={evento}
        textos={textos}
        idioma={idioma}
        onVolver={() => onVolver("explorar")}
      />

      {/* ======================================
          PESTAÑAS - ESCRITORIO
          ====================================== */}

      <nav className="detalle-evento__pestanas">
        {pestanaDescripcion && (
          <a
            href="#detalle-descripcion"
            className={["detalle-evento__pestana", "detalle-evento__pestana--activa"].join(" ")}
          >
            {pestanaDescripcion}
          </a>
        )}

        {mostrarUbicacion && pestanaUbicacion && (
          <a href="#detalle-ubicacion" className="detalle-evento__pestana">
            {pestanaUbicacion}
          </a>
        )}

        {pestanaPoliticas && <span className="detalle-evento__pestana">{pestanaPoliticas}</span>}
      </nav>

      {/* ======================================
          DESCRIPCIÓN DEL EVENTO
          ====================================== */}

      <section
        id="detalle-descripcion"
        className={[
          "detalle-evento__descripcion",
          "detalle-evento__descripcion--recortable",
          descripcionExpandida ? "detalle-evento__descripcion--expandida" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-labelledby="detalle-evento-descripcion-titulo"
      >
        {tituloSobreEvento && <h2 id="detalle-evento-descripcion-titulo">{tituloSobreEvento}</h2>}

        <p id="detalle-evento-descripcion-texto">{evento.descripcion}</p>

        {/* Botón Leer más exclusivo del diseño móvil. */}
        <button
          type="button"
          className="detalle-evento__leer-mas"
          aria-expanded={descripcionExpandida}
          aria-controls="detalle-evento-contenido-extra"
          onClick={cambiarExpansion}
        >
          {descripcionExpandida ? etiquetaLeerMenos : etiquetaLeerMas}
        </button>
      </section>

      {/* ======================================
          SECCIONES ADICIONALES
          ====================================== */}

      <div id="detalle-evento-contenido-extra" className="detalle-evento__secciones-extra">
        {/* Funciones y localidades en móvil. */}
        {(tieneFunciones || tieneLocalidades) && (
          <div className="detalle-evento__adicionales-movil">
            {tieneFunciones && (
              <FuncionesEvento funciones={evento.funciones} textos={textos} idioma={idioma} />
            )}

            {tieneLocalidades && (
              <LocalidadesEvento localidades={evento.localidades} textos={textos} />
            )}
          </div>
        )}

        {/* ==================================
            UBICACIÓN DEL EVENTO
            ================================== */}

        {mostrarUbicacion && (
          <section
            id="detalle-ubicacion"
            className="detalle-evento__ubicacion"
            aria-labelledby="detalle-evento-ubicacion-titulo"
          >
            {tituloComoLlegar && <h2 id="detalle-evento-ubicacion-titulo">{tituloComoLlegar}</h2>}

            <div className="detalle-evento__ubicacion-panel">
              <Icono nombre="ubicacion" />

              <span>{mapaEtiqueta || recinto?.nombre}</span>
            </div>

            {(recinto?.nombre || direccion) && (
              <p className="detalle-evento__direccion">
                {[recinto?.nombre, direccion].filter(Boolean).join(" · ")}
              </p>
            )}
          </section>
        )}

        {/* ==================================
            POLÍTICAS
            ================================== */}

        {politicas && (
          <section
            id="detalle-politicas"
            className="detalle-evento__politicas"
            aria-labelledby="detalle-evento-politicas-titulo"
          >
            {tituloPoliticas && <h2 id="detalle-evento-politicas-titulo">{tituloPoliticas}</h2>}

            <p>{politicas}</p>
          </section>
        )}

        {/* ==================================
            EVENTOS RELACIONADOS
            ================================== */}

        <EventosRelacionados
          eventos={relacionados}
          textos={textos}
          idioma={idioma}
          onVerEvento={onVerEvento}
        />
      </div>
    </article>
  );
}
