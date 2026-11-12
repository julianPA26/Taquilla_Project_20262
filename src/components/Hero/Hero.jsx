import { useState } from "react";
import Icono from "../Icono/Icono.jsx";
import Afiche from "../Afiche/Afiche.jsx";
import { formatearFechaCorta, formatearPrecio } from "../../Utils/formato.js";
import "./Hero.css";

// Identificadores de las categorías que se ofrecen como "Populares".
// Son ids (datos), no texto: el nombre que se ve sale de la API (textos.general.categorias).
const CATEGORIAS_POPULARES = ["conciertos", "teatro", "deportes", "festivales"];

// TODOS los textos de este componente salen de GET /textos.
// "ciudad" y "onCiudad" llegan desde Inicio: la ciudad se comparte con "Próximamente en {ciudad}"
export default function Hero({
  textos,
  idioma,
  evento,
  ciudades,
  ciudad = "",
  onCiudad,
  onBuscar,
  onVerEvento,
}) {
  // Rutas dentro de la respuesta de la API
  const hero = textos?.paginas?.inicio?.hero;
  const buscador = hero?.buscador;
  const destacadoHero = hero?.destacado;
  const textosFecha = textos?.paginas?.explorar?.filtros?.fecha;
  const nombresCategorias = textos?.general?.categorias;

  const [consulta, setConsulta] = useState("");
  const [fecha, setFecha] = useState("");

  // Antes de que lleguen las ciudades de la API, se muestra solo la ciudad actual
  let listaCiudades = ciudades ?? [];
  if (listaCiudades.length === 0 && ciudad) {
    listaCiudades = [{ nombre: ciudad }];
  }

  const opcionesFecha = [
    ["", buscador?.placeholders?.cuando],
    ["hoy", textosFecha?.hoy],
    ["finde", textosFecha?.finDeSemana],
    ["mes", textosFecha?.mes],
  ];
  const etiquetaFecha = opcionesFecha.find(([valor]) => valor === fecha)?.[1];

  // Plantillas de la API con huecos como {ciudad}, {fecha} o {precio}.
  // El "?? ''" evita un error si la clave no llegó (no es un texto escrito en el código).
  const plantillaResumen = buscador?.resumenMovil ?? "";
  const resumenMovil = plantillaResumen
    .replace("{ciudad}", ciudad)
    .replace("{fecha}", etiquetaFecha ?? "");

  const plantillaDesde = destacadoHero?.desde ?? "";

  function enviar(evento) {
    evento.preventDefault();
    // Texto, ciudad, categoría (vacía) y fecha: así Explorar recibe también la fecha elegida
    onBuscar?.(consulta.trim(), ciudad, "", fecha);
  }

  return (
    <section className="hero" aria-labelledby="hero-titulo">
      <div className="hero-interior">
        <div className="hero-texto">
          <p className="hero-etiqueta">{hero?.etiquetas?.temporada}</p>

          <h1 className="hero-titulo" id="hero-titulo">
            {hero?.titulo}
          </h1>

          <p className="hero-subtitulo">{hero?.subtitulo}</p>

          <form className="hero-buscador" role="search" onSubmit={enviar}>
            <label className="hero-campo">
              <Icono nombre="buscar" />
              <span className="hero-campo-texto">
                <span className="hero-campo-etiqueta">{buscador?.etiquetas?.que}</span>
                <input
                  type="search"
                  value={consulta}
                  onChange={(e) => setConsulta(e.target.value)}
                  placeholder={buscador?.placeholders?.que}
                />
              </span>
            </label>

            <label className="hero-campo">
              <Icono nombre="ubicacion" />
              <span className="hero-campo-texto">
                <span className="hero-campo-etiqueta">{buscador?.etiquetas?.donde}</span>
                <select value={ciudad} onChange={(e) => onCiudad?.(e.target.value)}>
                  {listaCiudades.map((c) => (
                    <option key={c.nombre} value={c.nombre}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </span>
            </label>

            <label className="hero-campo">
              <Icono nombre="calendario" />
              <span className="hero-campo-texto">
                <span className="hero-campo-etiqueta">{buscador?.etiquetas?.cuando}</span>
                <select value={fecha} onChange={(e) => setFecha(e.target.value)}>
                  {opcionesFecha.map(([valor, etiqueta]) => (
                    <option key={valor} value={valor}>
                      {etiqueta}
                    </option>
                  ))}
                </select>
              </span>
            </label>

            <button type="submit" className="hero-boton">
              {buscador?.botones?.buscar}
            </button>
          </form>

          <form className="hero-buscador-movil" role="search" onSubmit={enviar}>
            <div className="hero-movil-campo">
              <Icono nombre="buscar" />
              <span className="hero-campo-texto">
                <input
                  type="search"
                  value={consulta}
                  onChange={(e) => setConsulta(e.target.value)}
                  placeholder={buscador?.placeholders?.movil}
                  aria-label={buscador?.botones?.buscar}
                />
                <span className="hero-resumen">{resumenMovil}</span>
              </span>
            </div>
            {/* Botón (no enlace) para llevar a Explorar lo que ya escribiste y elegiste */}
            <button
              type="button"
              className="hero-filtros"
              aria-label={textos?.paginas?.explorar?.filtros?.titulo}
              onClick={() => onBuscar?.(consulta.trim(), ciudad, "", fecha)}
            >
              <Icono nombre="filtros" />
            </button>
          </form>

          <p className="hero-populares">
            <span>{buscador?.populares}</span>
            {CATEGORIAS_POPULARES.map((idCategoria) => (
              <button
                key={idCategoria}
                type="button"
                className="hero-popular"
                onClick={() => onBuscar?.("", ciudad, idCategoria, fecha)}
              >
                {nombresCategorias?.[idCategoria]}
              </button>
            ))}
          </p>
        </div>

        <Afiche evento={evento} paleta={4} alto={274} alineacion="xMaxYMin" className="hero-afiche">
          {evento && (
            <article className="hero-destacado">
              <p className="hero-insignia">{destacadoHero?.etiqueta}</p>
              <h2 className="hero-evento-titulo">{evento.titulo}</h2>
              <div className="hero-evento-fila">
                <div>
                  <p className="hero-evento-meta">
                    {formatearFechaCorta(evento.fecha, idioma)} · {evento.recinto?.nombre}
                  </p>
                  <p className="hero-evento-precio">
                    {plantillaDesde.replace("{precio}", formatearPrecio(evento.precioDesde))}
                  </p>
                </div>
                <button type="button" className="hero-ver" onClick={() => onVerEvento?.(evento)}>
                  {destacadoHero?.botones?.verEvento}
                  <span className="hero-ver-oculto"> · {evento.titulo}</span>
                </button>
              </div>
            </article>
          )}
        </Afiche>
      </div>
    </section>
  );
}
