import { useEffect, useRef } from "react";
import Icono from "./Icono.jsx";
import { formatearPrecio } from "../Utils/formato.js";
import { PASO_PRECIO } from "../Utils/filtros.js";
import "./FiltrosExplorar.css";

const CATEGORIAS_BASE = ["conciertos", "teatro", "deportes", "festivales", "comedia", "familiares"];

const LOCAL = {
    es: {
        todasCiudades: "Todas las ciudades",
        desde: "Desde",
        hasta: "Hasta",
        precioMinimo: "Precio mínimo",
        precioMaximo: "Precio máximo",
        cerrar: "Cerrar filtros",
    },
    en: {
        todasCiudades: "All cities",
        desde: "From",
        hasta: "To",
        precioMinimo: "Minimum price",
        precioMaximo: "Maximum price",
        cerrar: "Close filters",
    },
};

export default function FiltrosExplorar({
    textos,
    idioma,
    filtros,
    categorias,
    ciudades,
    limites,
    totalResultados,
    abierto,
    onCambiar,
    onLimpiar,
    onCerrar,
}) {
    const local = LOCAL[idioma] ?? LOCAL.es;
    const ingles = idioma === "en";
    const t = textos?.paginas?.explorar?.filtros;
    const nombres = textos?.general?.categorias;
    const botonCerrar = useRef(null);

    // En móvil, el panel es una pantalla completa: foco al abrir, Escape lo cierra
    // y la página de atrás no se desplaza.
    useEffect(() => {
        if (!abierto) return;
        botonCerrar.current?.focus();
        document.body.style.overflow = "hidden";

        function cerrarConEscape(evento) {
            if (evento.key === "Escape") onCerrar();
        }
        document.addEventListener("keydown", cerrarConEscape);

        return () => {
            document.body.style.overflow = "";
            document.removeEventListener("keydown", cerrarConEscape);
        };
    }, [abierto]);

    const listaCategorias = categorias?.length
        ? categorias
        : CATEGORIAS_BASE.map((id) => ({ id, nombre: id }));

    const fechas = [
        ["hoy", t?.fecha?.hoy ?? (ingles ? "Today" : "Hoy")],
        ["finde", t?.fecha?.finDeSemana ?? (ingles ? "This weekend" : "Este fin de semana")],
        ["mes", t?.fecha?.mes ?? (ingles ? "This month" : "Este mes")],
        ["elegir", t?.fecha?.elegir ?? (ingles ? "Pick dates" : "Elegir fechas")],
    ];

    // Rango de precio
    const [minimo, maximo] = limites;
    const hayRango = maximo > minimo;
    const valorMinimo = filtros.precioMin ?? minimo;
    const valorMaximo = filtros.precioMax ?? maximo;
    const amplitud = Math.max(maximo - minimo, 1);
    const inicioPista = ((valorMinimo - minimo) / amplitud) * 100;
    const finPista = ((valorMaximo - minimo) / amplitud) * 100;

    function alternarCategoria(id) {
        const activas = filtros.categorias.includes(id)
            ? filtros.categorias.filter((categoria) => categoria !== id)
            : [...filtros.categorias, id];
        onCambiar({ categorias: activas });
    }

    function alternarFecha(valor) {
        onCambiar({ fecha: filtros.fecha === valor ? "" : valor, desde: "", hasta: "" });
    }

    function cambiarMinimo(evento) {
        const valor = Math.min(Number(evento.target.value), valorMaximo - PASO_PRECIO);
        onCambiar({ precioMin: valor });
    }

    function cambiarMaximo(evento) {
        const valor = Math.max(Number(evento.target.value), valorMinimo + PASO_PRECIO);
        onCambiar({ precioMax: valor });
    }

    const textoVer = (t?.botones?.verResultados ?? (ingles ? "See {cantidad} events" : "Ver {cantidad} eventos")).replace(
        "{cantidad}",
        totalResultados,
    );

    return (
        <aside
            className={`filtros${abierto ? " is-abierto" : ""}`}
            aria-label={t?.titulo ?? (ingles ? "Filters" : "Filtros")}
        >
            <div className="filtros-encabezado">
                <h2 className="filtros-titulo">{t?.titulo ?? (ingles ? "Filters" : "Filtros")}</h2>
                <button type="button" className="filtros-limpiar" onClick={onLimpiar}>
                    {t?.botones?.limpiar ?? (ingles ? "Clear" : "Limpiar")}
                </button>
                <button
                    ref={botonCerrar}
                    type="button"
                    className="filtros-cerrar"
                    aria-label={local.cerrar}
                    onClick={onCerrar}
                >
                    <Icono nombre="cerrar" />
                </button>
            </div>

            <div className="filtros-cuerpo">
                {/* Categoría: casillas en escritorio, chips en móvil */}
                <fieldset className="filtros-grupo">
                    <legend>{t?.categoria ?? (ingles ? "Category" : "Categoría")}</legend>
                    <div className="filtros-categorias">
                        {listaCategorias.map((categoria) => (
                            <label className="filtros-categoria" key={categoria.id}>
                                <input
                                    type="checkbox"
                                    checked={filtros.categorias.includes(categoria.id)}
                                    onChange={() => alternarCategoria(categoria.id)}
                                />
                                <span className="filtros-categoria-nombre">
                                    {nombres?.[categoria.id] ?? categoria.nombre}
                                </span>
                                {categoria.eventos != null && (
                                    <span className="filtros-categoria-cuenta">{categoria.eventos}</span>
                                )}
                            </label>
                        ))}
                    </div>
                </fieldset>

                {/* Fecha */}
                <fieldset className="filtros-grupo">
                    <legend>{t?.fecha?.titulo ?? (ingles ? "Date" : "Fecha")}</legend>
                    <div className="filtros-chips">
                        {fechas.map(([valor, etiqueta]) => (
                            <button
                                key={valor}
                                type="button"
                                className="filtros-chip"
                                aria-pressed={filtros.fecha === valor}
                                onClick={() => alternarFecha(valor)}
                            >
                                {etiqueta}
                            </button>
                        ))}
                    </div>
                    {filtros.fecha === "elegir" && (
                        <div className="filtros-fechas">
                            <label>
                                <span>{local.desde}</span>
                                <input
                                    type="date"
                                    value={filtros.desde}
                                    max={filtros.hasta || undefined}
                                    onChange={(evento) => onCambiar({ desde: evento.target.value })}
                                />
                            </label>
                            <label>
                                <span>{local.hasta}</span>
                                <input
                                    type="date"
                                    value={filtros.hasta}
                                    min={filtros.desde || undefined}
                                    onChange={(evento) => onCambiar({ hasta: evento.target.value })}
                                />
                            </label>
                        </div>
                    )}
                </fieldset>

                {/* Ciudad */}
                <div className="filtros-grupo">
                    <label className="filtros-etiqueta" htmlFor="filtro-ciudad">
                        {t?.ciudad ?? (ingles ? "City" : "Ciudad")}
                    </label>
                    <div className="filtros-selector">
                        <select
                            id="filtro-ciudad"
                            value={filtros.ciudad}
                            onChange={(evento) => onCambiar({ ciudad: evento.target.value })}
                        >
                            <option value="">{local.todasCiudades}</option>
                            {(ciudades ?? []).map((ciudad) => (
                                <option key={ciudad.nombre} value={ciudad.nombre}>
                                    {ciudad.nombre}
                                </option>
                            ))}
                        </select>
                        <Icono nombre="flechaAbajo" />
                    </div>
                </div>

                {/* Precio: dos controles superpuestos (mínimo y máximo) */}
                <fieldset className="filtros-grupo">
                    <legend>{t?.precio ?? (ingles ? "Price" : "Precio")}</legend>
                    <div className="rango">
                        <div className="rango-pista">
                            <div
                                className="rango-activo"
                                style={{ left: `${inicioPista}%`, right: `${100 - finPista}%` }}
                            />
                        </div>
                        <input
                            type="range"
                            min={minimo}
                            max={maximo}
                            step={PASO_PRECIO}
                            value={valorMinimo}
                            disabled={!hayRango}
                            aria-label={local.precioMinimo}
                            aria-valuetext={formatearPrecio(valorMinimo)}
                            onChange={cambiarMinimo}
                        />
                        <input
                            type="range"
                            min={minimo}
                            max={maximo}
                            step={PASO_PRECIO}
                            value={valorMaximo}
                            disabled={!hayRango}
                            aria-label={local.precioMaximo}
                            aria-valuetext={formatearPrecio(valorMaximo)}
                            onChange={cambiarMaximo}
                        />
                    </div>
                    <div className="rango-valores">
                        <span>{formatearPrecio(valorMinimo)}</span>
                        <span>{formatearPrecio(valorMaximo)}</span>
                    </div>
                </fieldset>
            </div>

            {/* Solo móvil: botón para ver los resultados y cerrar el panel */}
            <div className="filtros-pie">
                <button type="button" className="filtros-ver" onClick={onCerrar}>
                    {textoVer}
                </button>
            </div>
        </aside>
    );
}