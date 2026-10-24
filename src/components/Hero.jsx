import { useState } from "react";
import Icono from "./Icono.jsx";
import Afiche from "./Afiche.jsx";
import { formatearFechaCorta, formatearPrecio } from "../Utils/formato.js";
import "./Hero.css";

// Textos que el diseño usa y que la API no trae
const LOCAL = {
    es: {
        subtitulo:
            "Conciertos, teatro, deportes y festivales. Busca por categoría, fecha o ciudad y consulta todos los detalles de cada evento.",
        temporada: "nov – dic 2026",
        verEvento: "Ver evento",
        filtros: "Filtros",
        hoy: "Hoy",
        esteFinDeSemana: "Este fin de semana",
        esteMes: "Este mes",
    },
    en: {
        subtitulo:
            "Concerts, theater, sports and festivals. Search by category, date or city and see every event's details.",
        temporada: "Nov – Dec 2026",
        verEvento: "View event",
        filtros: "Filters",
        hoy: "Today",
        esteFinDeSemana: "This weekend",
        esteMes: "This month",
    },
};

export default function Hero({ textos, idioma, evento, ciudades, onBuscar }) {
    const local = LOCAL[idioma] ?? LOCAL.es;
    const ingles = idioma === "en";
    const inicio = textos?.paginas?.inicio;
    const hero = inicio?.hero;
    const buscador = inicio?.buscador;
    const populares = inicio?.busquedasPopulares;
    const filtrosExplorar = textos?.paginas?.explorar?.filtros?.etiquetas;
    const destacado = textos?.componentes?.etiquetas?.destacado;
    const desde = textos?.componentes?.precio?.desde;

    const [consulta, setConsulta] = useState("");
    const [ciudad, setCiudad] = useState("Manizales");
    const [fecha, setFecha] = useState("");

    const listaCiudades = ciudades?.length ? ciudades : [{ nombre: "Manizales" }];
    const opcionesFecha = [
        ["", buscador?.etiquetas?.cualquierFecha ?? (ingles ? "Any date" : "Cualquier fecha")],
        ["hoy", filtrosExplorar?.hoy ?? local.hoy],
        ["finde", filtrosExplorar?.esteFinDeSemana ?? local.esteFinDeSemana],
        ["mes", filtrosExplorar?.esteMes ?? local.esteMes],
    ];
    const etiquetaFecha = opcionesFecha.find(([valor]) => valor === fecha)?.[1];

    const etiquetaTemporada = (
        hero?.etiquetas?.temporada ?? (ingles ? "Season {temporada}" : "Temporada {temporada}")
    ).replace("{temporada}", local.temporada);

    const resumenMovil = (buscador?.resumenMovil ?? "{ciudad} · {fecha}")
        .replace("{ciudad}", ciudad)
        .replace("{fecha}", etiquetaFecha);

    function enviar(evento) {
        evento.preventDefault();
        onBuscar?.(consulta.trim(), ciudad);
    }

    const terminosPopulares = [
        populares?.etiquetas?.salsa ?? "Salsa",
        populares?.etiquetas?.standUp ?? "Stand-up",
        populares?.etiquetas?.futbol ?? (ingles ? "Soccer" : "Fútbol"),
        populares?.etiquetas?.festivalesFinDeAno ??
        (ingles ? "Year-end festivals" : "Festivales de fin de año"),
    ];

    return (
        <section className="hero" aria-labelledby="hero-titulo">
            <div className="hero-interior">
                <div className="hero-texto">
                    <p className="hero-etiqueta">{etiquetaTemporada}</p>

                    <h1 className="hero-titulo" id="hero-titulo">
                        {hero?.titulo ??
                            (ingles ? "Your next night out starts here" : "Tu próxima noche empieza aquí")}
                    </h1>

                    <p className="hero-subtitulo">{local.subtitulo}</p>

                    {/* Buscador de escritorio: tres campos */}
                    <form className="hero-buscador" role="search" onSubmit={enviar}>
                        <label className="hero-campo">
                            <Icono nombre="buscar" />
                            <span className="hero-campo-texto">
                                <span className="hero-campo-etiqueta">
                                    {buscador?.etiquetas?.que ?? (ingles ? "What" : "Qué")}
                                </span>
                                <input
                                    type="search"
                                    value={consulta}
                                    onChange={(e) => setConsulta(e.target.value)}
                                    placeholder={buscador?.placeholder ?? (ingles ? "Event or artist" : "Evento o artista")}
                                />
                            </span>
                        </label>

                        <label className="hero-campo">
                            <Icono nombre="ubicacion" />
                            <span className="hero-campo-texto">
                                <span className="hero-campo-etiqueta">
                                    {buscador?.etiquetas?.donde ?? (ingles ? "Where" : "Dónde")}
                                </span>
                                <select value={ciudad} onChange={(e) => setCiudad(e.target.value)}>
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
                                    {buscador?.etiquetas?.cuando ?? (ingles ? "When" : "Cuándo")}
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
                            {buscador?.botones?.buscar ?? (ingles ? "Search" : "Buscar")}
                        </button>
                    </form>

                    {/* Buscador de móvil: un solo campo con resumen y botón de filtros */}
                    <form className="hero-buscador-movil" role="search" onSubmit={enviar}>
                        <div className="hero-movil-campo">
                            <Icono nombre="buscar" />
                            <span className="hero-campo-texto">
                                <input
                                    type="search"
                                    value={consulta}
                                    onChange={(e) => setConsulta(e.target.value)}
                                    placeholder={
                                        buscador?.placeholderMovil ??
                                        (ingles ? "Event, artist or place" : "Evento, artista o lugar")
                                    }
                                    aria-label={buscador?.placeholderMovil ?? (ingles ? "Search" : "Buscar")}
                                />
                                <span className="hero-resumen">{resumenMovil}</span>
                            </span>
                        </div>
                        <a className="hero-filtros" href="#explorar" aria-label={local.filtros}>
                            <Icono nombre="filtros" />
                        </a>
                    </form>

                    <p className="hero-populares">
                        <span>{populares?.titulo ?? (ingles ? "Popular:" : "Populares:")}</span>
                        {terminosPopulares.map((termino) => (
                            <button
                                key={termino}
                                type="button"
                                className="hero-popular"
                                onClick={() => onBuscar?.(termino, ciudad)}
                            >
                                {termino}
                            </button>
                        ))}
                    </p>
                </div>

                {/* Evento destacado: solo escritorio y tablet */}
                <Afiche afiche={evento?.afiche} className="hero-afiche">
                    {evento && (
                        <article className="hero-destacado">
                            <p className="hero-insignia">
                                {destacado ?? (ingles ? "Featured" : "Destacado")}
                            </p>
                            <h2 className="hero-evento-titulo">{evento.titulo}</h2>
                            <div className="hero-evento-fila">
                                <div>
                                    <p className="hero-evento-meta">
                                        {formatearFechaCorta(evento.fecha, idioma)} · {evento.recinto?.nombre}
                                    </p>
                                    <p className="hero-evento-precio">
                                        {desde ?? (ingles ? "From" : "Desde")} {formatearPrecio(evento.precioDesde)}
                                    </p>
                                </div>
                                {/* Por ahora no hay vista de detalle en el sprint: el enlace no lleva a otra página */}
                                <a className="hero-ver" href="#">
                                    {local.verEvento}
                                    <span className="hero-ver-oculto"> · {evento.titulo}</span>
                                </a>
                            </div>
                        </article>
                    )}
                </Afiche>
            </div>
        </section>
    );
}