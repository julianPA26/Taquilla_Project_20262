import { useState } from "react";
import Icono from "../Icono/Icono.jsx";
import Afiche from "../Afiche/Afiche.jsx";
import { formatearFechaCorta, formatearPrecio } from "../../Utils/formato.js";
import "./Hero.css";

const LOCAL = {
  es: {
    titulo: "Tu próxima noche empieza aquí",
    subtitulo:
      "Conciertos, teatro, deportes y festivales. Busca por categoría, fecha o ciudad y consulta todos los detalles de cada evento.",
    temporada: "nov – dic 2026",
    verEvento: "Ver evento",
    filtros: "Filtros",
    hoy: "Hoy",
    esteFinDeSemana: "Este fin de semana",
    esteMes: "Este mes",
    cualquierFecha: "Cualquier fecha",
    que: "Qué",
    donde: "Dónde",
    cuando: "Cuándo",
    placeholderQue: "Evento o artista",
    placeholderMovil: "Evento, artista o lugar",
    buscar: "Buscar",
    populares: "Populares:",
    destacado: "Destacado",
    desde: "Desde {precio}",
    temporadaPlantilla: "Temporada {temporada}",
    terminosPopulares: ["Salsa", "Stand-up", "Fútbol", "Festivales de fin de año"],
  },
  en: {
    titulo: "Your next night out starts here",
    subtitulo:
      "Concerts, theater, sports and festivals. Search by category, date or city and see every event's details.",
    temporada: "Nov – Dec 2026",
    verEvento: "View event",
    filtros: "Filters",
    hoy: "Today",
    esteFinDeSemana: "This weekend",
    esteMes: "This month",
    cualquierFecha: "Any date",
    que: "What",
    donde: "Where",
    cuando: "When",
    placeholderQue: "Event or artist",
    placeholderMovil: "Event, artist or place",
    buscar: "Search",
    populares: "Popular:",
    destacado: "Featured",
    desde: "From {precio}",
    temporadaPlantilla: "Season {temporada}",
    terminosPopulares: ["Salsa", "Stand-up", "Soccer", "Year-end festivals"],
  },
};

// "ciudad" y "onCiudad" llegan desde Inicio: la ciudad se comparte con "Próximamente en {ciudad}"
export default function Hero({
  textos,
  idioma,
  evento,
  ciudades,
  ciudad = "Manizales",
  onCiudad,
  onBuscar,
  onVerEvento,
}) {
  const local = LOCAL[idioma] ?? LOCAL.es;

  // Rutas reales de la API: paginas.inicio.hero.{titulo, subtitulo, buscador, destacado...}
  const hero = textos?.paginas?.inicio?.hero;
  const buscador = hero?.buscador;
  const destacadoHero = hero?.destacado;
  const filtrosExplorar = textos?.paginas?.explorar?.filtros;

  // Textos: primero la API, y si no llega esa clave, el respaldo de LOCAL
  const subtitulo = hero?.subtitulo ?? local.subtitulo;
  const tituloHero = hero?.titulo ?? local.titulo;
  const textoVerEvento = destacadoHero?.botones?.verEvento ?? local.verEvento;
  const textoFiltros = filtrosExplorar?.titulo ?? local.filtros;
  const textoDestacado =
    destacadoHero?.etiqueta ?? textos?.componentes?.etiquetas?.destacado ?? local.destacado;
  const plantillaDesde = destacadoHero?.desde ?? local.desde;

  const [consulta, setConsulta] = useState("");
  const [fecha, setFecha] = useState("");

  const listaCiudades = ciudades?.length ? ciudades : [{ nombre: "Manizales" }];
  const opcionesFecha = [
    ["", buscador?.placeholders?.cuando ?? local.cualquierFecha],
    ["hoy", filtrosExplorar?.fecha?.hoy ?? local.hoy],
    ["finde", filtrosExplorar?.fecha?.finDeSemana ?? local.esteFinDeSemana],
    ["mes", filtrosExplorar?.fecha?.mes ?? local.esteMes],
  ];
  const etiquetaFecha = opcionesFecha.find(([valor]) => valor === fecha)?.[1];

  const etiquetaTemporada = (hero?.etiquetas?.temporada ?? local.temporadaPlantilla).replace(
    "{temporada}",
    local.temporada,
  );

  const resumenMovil = (buscador?.resumenMovil ?? "{ciudad} · {fecha}")
    .replace("{ciudad}", ciudad)
    .replace("{fecha}", etiquetaFecha);

  function enviar(evento) {
    evento.preventDefault();
    // Texto, ciudad, categoría (vacía) y fecha: así Explorar recibe también la fecha elegida
    onBuscar?.(consulta.trim(), ciudad, "", fecha);
  }

  // Los términos populares no existen en la API: vienen de LOCAL
  const terminosPopulares = local.terminosPopulares;

  return (
    <section className="hero" aria-labelledby="hero-titulo">
      <div className="hero-interior">
        <div className="hero-texto">
          <p className="hero-etiqueta">{etiquetaTemporada}</p>

          <h1 className="hero-titulo" id="hero-titulo">
            {tituloHero}
          </h1>

          <p className="hero-subtitulo">{subtitulo}</p>

          <form className="hero-buscador" role="search" onSubmit={enviar}>
            <label className="hero-campo">
              <Icono nombre="buscar" />
              <span className="hero-campo-texto">
                <span className="hero-campo-etiqueta">{buscador?.etiquetas?.que ?? local.que}</span>
                <input
                  type="search"
                  value={consulta}
                  onChange={(e) => setConsulta(e.target.value)}
                  placeholder={buscador?.placeholders?.que ?? local.placeholderQue}
                />
              </span>
            </label>

            <label className="hero-campo">
              <Icono nombre="ubicacion" />
              <span className="hero-campo-texto">
                <span className="hero-campo-etiqueta">
                  {buscador?.etiquetas?.donde ?? local.donde}
                </span>
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
                <span className="hero-campo-etiqueta">
                  {buscador?.etiquetas?.cuando ?? local.cuando}
                </span>
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
              {buscador?.botones?.buscar ?? local.buscar}
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
                  placeholder={buscador?.placeholders?.movil ?? local.placeholderMovil}
                  aria-label={buscador?.placeholders?.movil ?? local.buscar}
                />
                <span className="hero-resumen">{resumenMovil}</span>
              </span>
            </div>
            {/* Botón (no enlace) para llevar a Explorar lo que ya escribiste y elegiste */}
            <button
              type="button"
              className="hero-filtros"
              aria-label={textoFiltros}
              onClick={() => onBuscar?.(consulta.trim(), ciudad, "", fecha)}
            >
              <Icono nombre="filtros" />
            </button>
          </form>

          <p className="hero-populares">
            <span>{buscador?.populares ?? local.populares}</span>
            {terminosPopulares.map((termino) => (
              <button
                key={termino}
                type="button"
                className="hero-popular"
                onClick={() => onBuscar?.(termino, ciudad, "", fecha)}
              >
                {termino}
              </button>
            ))}
          </p>
        </div>

        <Afiche evento={evento} paleta={4} alto={274} alineacion="xMaxYMin" className="hero-afiche">
          {evento && (
            <article className="hero-destacado">
              <p className="hero-insignia">{textoDestacado}</p>
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
                  {textoVerEvento}
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
