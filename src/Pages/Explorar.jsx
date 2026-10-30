import { useEffect, useMemo, useState } from "react";
import { useApi } from "../hooks/useApi.js";
import { useEventos } from "../hooks/useEvento.js";
import { filtrarEventos, limitesDePrecio } from "../Utils/filtros.js";
import { formatearPrecio } from "../Utils/formato.js";
import Icono from "../components/Icono.jsx";
import TarjetaEvento from "../components/TarjetaEvento.jsx";
import FiltrosExplorar from "../components/FiltrosExplorar.jsx";
import Paginacion from "../components/Paginacion.jsx";
import "./Explorar.css";

const POR_PAGINA = 9;
const CIUDAD_POR_DEFECTO = "Manizales";
const CANTIDAD_ESQUELETOS = 6;

function filtrosIniciales(consulta, ciudad) {
    return {
        q: consulta ?? "",
        categorias: [],
        ciudad: ciudad || CIUDAD_POR_DEFECTO,
        fecha: "",
        desde: "",
        hasta: "",
        precioMin: null,
        precioMax: null,
    };
}

export default function Explorar({ textos, idioma, consulta, ciudadInicial }) {
    const ingles = idioma === "en";
    const t = textos?.paginas?.explorar;
    const nombres = textos?.general?.categorias;
    const estados = textos?.estados;

    const [orden, setOrden] = useState("fecha");
    const [filtros, setFiltros] = useState(() => filtrosIniciales(consulta, ciudadInicial));
    const [pagina, setPagina] = useState(1);
    const [panelAbierto, setPanelAbierto] = useState(false);

    const todos = useEventos(orden);
    const categorias = useApi("/categorias");
    const ciudades = useApi("/ciudades");

    // Si llega una búsqueda nueva desde el navbar o el inicio, se aplica aquí
    useEffect(() => {
        setFiltros((actuales) => ({
            ...actuales,
            q: consulta ?? "",
            ciudad: ciudadInicial || actuales.ciudad,
        }));
        setPagina(1);
    }, [consulta, ciudadInicial]);

    const limites = useMemo(() => limitesDePrecio(todos.eventos), [todos.eventos]);
    const filtrados = useMemo(
        () => filtrarEventos(todos.eventos, filtros, limites),
        [todos.eventos, filtros, limites],
    );

    const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
    const paginaActual = Math.min(pagina, totalPaginas);
    const visibles = filtrados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);

    function cambiarFiltros(parcial) {
        setFiltros((actuales) => ({ ...actuales, ...parcial }));
        setPagina(1);
    }

    function limpiar() {
        setFiltros(filtrosIniciales("", ""));
        setPagina(1);
    }

    function cambiarPagina(numero) {
        setPagina(numero);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // ===== Textos =====
    const cantidad = filtrados.length;
    const textoResultados = (
        cantidad === 1
            ? (t?.resultados?.uno ?? (ingles ? "{cantidad} event matches your filters" : "{cantidad} evento coincide con tus filtros"))
            : (t?.resultados?.otro ?? (ingles ? "{cantidad} events match your filters" : "{cantidad} eventos coinciden con tus filtros"))
    ).replace("{cantidad}", cantidad);
    const textoCorto = (
        cantidad === 1
            ? (t?.resultadosCorto?.uno ?? (ingles ? "{cantidad} event" : "{cantidad} evento"))
            : (t?.resultadosCorto?.otro ?? (ingles ? "{cantidad} events" : "{cantidad} eventos"))
    ).replace("{cantidad}", cantidad);

    const tituloPagina =
        textos?.footer?.columnas?.explora?.enlaces?.explorar ?? (ingles ? "Explore events" : "Explorar eventos");
    const migas = textos?.componentes?.migas;
    const etiquetaQuitar = ingles ? "Remove filter" : "Quitar filtro";
    const etiquetaBuscar = textos?.paginas?.inicio?.hero?.buscador?.placeholders?.movil ?? (ingles ? "Event, artist or place" : "Evento, artista o lugar");

    const opcionesOrden = [
        ["fecha", t?.orden?.opciones?.fecha ?? (ingles ? "Closest date" : "Fecha más próxima")],
        ["precio", t?.orden?.opciones?.precio ?? (ingles ? "Lowest price" : "Precio más bajo")],
        ["popularidad", t?.orden?.opciones?.popularidad ?? (ingles ? "Most popular" : "Más populares")],
    ];

    // ===== Chips de los filtros activos =====
    const chips = [];
    filtros.categorias.forEach((id) => {
        chips.push({
            clave: `categoria-${id}`,
            texto: nombres?.[id] ?? id,
            quitar: () => cambiarFiltros({ categorias: filtros.categorias.filter((c) => c !== id) }),
        });
    });
    if (filtros.fecha) {
        const etiquetasFecha = {
            hoy: t?.filtros?.fecha?.hoy ?? (ingles ? "Today" : "Hoy"),
            finde: t?.filtros?.fecha?.finDeSemana ?? (ingles ? "This weekend" : "Este fin de semana"),
            mes: t?.filtros?.fecha?.mes ?? (ingles ? "This month" : "Este mes"),
        };
        chips.push({
            clave: "fecha",
            texto:
                filtros.fecha === "elegir"
                    ? `${filtros.desde || "…"} – ${filtros.hasta || "…"}`
                    : etiquetasFecha[filtros.fecha],
            quitar: () => cambiarFiltros({ fecha: "", desde: "", hasta: "" }),
        });
    }
    if (filtros.precioMin !== null || filtros.precioMax !== null) {
        chips.push({
            clave: "precio",
            texto: `${formatearPrecio(filtros.precioMin ?? limites[0])} – ${formatearPrecio(filtros.precioMax ?? limites[1])}`,
            quitar: () => cambiarFiltros({ precioMin: null, precioMax: null }),
        });
    }
    if (filtros.q) {
        chips.push({
            clave: "q",
            texto: `“${filtros.q}”`,
            quitar: () => cambiarFiltros({ q: "" }),
        });
    }

    // ===== Qué se muestra en la zona de resultados =====
    const primeraCarga = todos.cargando && todos.eventos.length === 0;
    const falloTotal = todos.error && todos.eventos.length === 0;

    let contenido;
    if (primeraCarga) {
        contenido = (
            <>
                <p className="explorar-estado-oculto" role="status">
                    {estados?.cargando?.indicador ?? (ingles ? "Loading…" : "Cargando…")}
                </p>
                <ul className="explorar-lista" aria-hidden="true">
                    {Array.from({ length: CANTIDAD_ESQUELETOS }, (_, i) => (
                        <li key={i} className="tarjeta-esqueleto" />
                    ))}
                </ul>
            </>
        );
    } else if (falloTotal) {
        contenido = (
            <div className="explorar-mensaje explorar-mensaje-error" role="alert">
                <h2>{estados?.error?.titulo ?? (ingles ? "Something went wrong" : "Algo salió mal")}</h2>
                <p>{estados?.error?.texto ?? (ingles ? "Check your connection and try again." : "Revisa tu conexión e inténtalo de nuevo.")}</p>
                <button type="button" onClick={todos.recargar}>
                    {estados?.error?.botones?.reintentar ?? (ingles ? "Try again" : "Reintentar")}
                </button>
            </div>
        );
    } else if (filtrados.length === 0) {
        contenido = (
            <div className="explorar-mensaje">
                <h2>{t?.vacio?.titulo ?? (ingles ? "We found no events with those filters" : "No encontramos eventos con esos filtros")}</h2>
                <p>{t?.vacio?.texto ?? (ingles ? "Try another date, another city or clear the filters." : "Prueba con otra fecha, otra ciudad o limpia los filtros.")}</p>
                <button type="button" onClick={limpiar}>
                    {t?.vacio?.botones?.limpiar ?? (ingles ? "Clear filters" : "Limpiar filtros")}
                </button>
            </div>
        );
    } else {
        contenido = (
            <>
                <ul className="explorar-lista">
                    {visibles.map((evento) => (
                        <li key={evento.id}>
                            <TarjetaEvento evento={evento} textos={textos} idioma={idioma} />
                        </li>
                    ))}
                </ul>
                <Paginacion
                    textos={textos}
                    idioma={idioma}
                    pagina={paginaActual}
                    totalPaginas={totalPaginas}
                    onCambiar={cambiarPagina}
                />
            </>
        );
    }

    return (
        <div className="explorar">
            <div className="explorar-interior">
                {/* Solo escritorio: ruta de migas */}
                <nav className="explorar-migas" aria-label={ingles ? "Breadcrumb" : "Ruta de navegación"}>
                    <ol>
                        <li>
                            <a href="#inicio">{migas?.inicio ?? (ingles ? "Home" : "Inicio")}</a>
                        </li>
                        <li aria-current="page">{migas?.explorar ?? (ingles ? "Explore" : "Explorar")}</li>
                    </ol>
                </nav>

                <header className="explorar-encabezado">
                    <h1>{tituloPagina}</h1>
                    <p className="explorar-conteo" aria-live="polite">
                        {textoResultados}
                    </p>
                </header>

                {/* Solo móvil: buscador y botón de filtros */}
                <form className="explorar-buscador" role="search" onSubmit={(evento) => evento.preventDefault()}>
                    <label className="explorar-campo">
                        <Icono nombre="buscar" />
                        <input
                            type="search"
                            value={filtros.q}
                            onChange={(evento) => cambiarFiltros({ q: evento.target.value })}
                            placeholder={etiquetaBuscar}
                            aria-label={etiquetaBuscar}
                        />
                    </label>
                    <button
                        type="button"
                        className="explorar-boton-filtros"
                        aria-label={t?.filtros?.titulo ?? (ingles ? "Filters" : "Filtros")}
                        aria-expanded={panelAbierto}
                        onClick={() => setPanelAbierto(true)}
                    >
                        <Icono nombre="filtros" />
                    </button>
                </form>

                <div className="explorar-cuerpo">
                    <FiltrosExplorar
                        textos={textos}
                        idioma={idioma}
                        filtros={filtros}
                        categorias={categorias.datos?.datos}
                        ciudades={ciudades.datos?.datos}
                        limites={limites}
                        totalResultados={cantidad}
                        abierto={panelAbierto}
                        onCambiar={cambiarFiltros}
                        onLimpiar={limpiar}
                        onCerrar={() => setPanelAbierto(false)}
                    />

                    <section className="explorar-resultados" aria-busy={todos.cargando}>
                        <div className="explorar-barra">
                            {chips.length > 0 && (
                                <ul className="explorar-chips">
                                    {chips.map((chip) => (
                                        <li key={chip.clave}>
                                            <button
                                                type="button"
                                                className="explorar-chip"
                                                aria-label={`${etiquetaQuitar}: ${chip.texto}`}
                                                onClick={chip.quitar}
                                            >
                                                <span>{chip.texto}</span>
                                                <Icono nombre="cerrar" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <div className="explorar-datos">
                                <p className="explorar-conteo-movil">{textoCorto}</p>
                                <label className="explorar-orden">
                                    <span className="explorar-orden-etiqueta">
                                        {t?.orden?.etiqueta ?? (ingles ? "Sort by:" : "Ordenar:")}
                                    </span>
                                    <span className="explorar-orden-selector">
                                        <select
                                            value={orden}
                                            onChange={(evento) => {
                                                setOrden(evento.target.value);
                                                setPagina(1);
                                            }}
                                        >
                                            {opcionesOrden.map(([valor, etiqueta]) => (
                                                <option key={valor} value={valor}>
                                                    {etiqueta}
                                                </option>
                                            ))}
                                        </select>
                                        <Icono nombre="flechaAbajo" />
                                    </span>
                                </label>
                            </div>
                        </div>

                        {contenido}
                    </section>
                </div>
            </div>
        </div>
    );
}