import Icono from "./Icono.jsx";
import "./Categorias.css";

const CANTIDAD = 6;

function textoConteo(textos, cantidad, ingles) {
    const plantillas = textos?.paginas?.inicio?.categorias?.conteo;
    const plantilla =
        cantidad === 1
            ? (plantillas?.uno ?? (ingles ? "{cantidad} event" : "{cantidad} evento"))
            : (plantillas?.otro ?? (ingles ? "{cantidad} events" : "{cantidad} eventos"));
    return plantilla.replace("{cantidad}", cantidad);
}

export default function Categorias({
    textos,
    idioma,
    categorias,
    cargando,
    error,
    recargar,
    activa,
    onElegir,
}) {
    const ingles = idioma === "en";
    const nombres = textos?.general?.categorias;
    const errorTextos = textos?.estados?.error;
    const lista = categorias ?? [];
    const etiquetaSeccion = ingles ? "Categories" : "Categorías";
    const etiquetaTodas = nombres?.todas ?? (ingles ? "All" : "Todas");

    function nombreDe(categoria) {
        return nombres?.[categoria.id] ?? categoria.nombre;
    }

    if (cargando && lista.length === 0) {
        return (
            <section className="categorias" aria-label={etiquetaSeccion} aria-busy="true">
                <div className="categorias-interior">
                    <p className="categorias-estado" role="status">
                        {textos?.estados?.cargando?.indicador ?? (ingles ? "Loading…" : "Cargando…")}
                    </p>
                    <ul className="categorias-tarjetas" aria-hidden="true">
                        {Array.from({ length: CANTIDAD }, (_, i) => (
                            <li key={i} className="categoria-esqueleto" />
                        ))}
                    </ul>
                </div>
            </section>
        );
    }

    if (error && lista.length === 0) {
        return (
            <section className="categorias" aria-label={etiquetaSeccion}>
                <div className="categorias-interior">
                    <div className="categorias-error" role="alert">
                        <p>
                            {errorTextos?.texto ??
                                (ingles
                                    ? "Check your connection and try again."
                                    : "Revisa tu conexión e inténtalo de nuevo.")}
                        </p>
                        <button type="button" onClick={recargar}>
                            {errorTextos?.botones?.reintentar ?? (ingles ? "Try again" : "Reintentar")}
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="categorias" aria-label={etiquetaSeccion}>
            <div className="categorias-interior">
                <ul className="categorias-tarjetas">
                    {lista.map((categoria) => (
                        <li key={categoria.id}>
                            <a
                                className="categoria-tarjeta"
                                href="#explorar"
                                onClick={() => onElegir?.(categoria.id)}
                            >
                                <span className="categoria-icono" aria-hidden="true">
                                    <Icono nombre={categoria.id} />
                                </span>
                                <span className="categoria-texto">
                                    <span className="categoria-nombre">{nombreDe(categoria)}</span>
                                    <span className="categoria-conteo">
                                        {textoConteo(textos, categoria.eventos, ingles)}
                                    </span>
                                </span>
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Móvil: chips que filtran */}
                <ul className="categorias-chips">
                    {[{ id: "todas", nombre: etiquetaTodas }, ...lista].map((categoria) => (
                        <li key={categoria.id}>
                            <button
                                type="button"
                                className="categoria-chip"
                                aria-pressed={activa === categoria.id}
                                onClick={() => onElegir?.(categoria.id)}
                            >
                                {categoria.id === "todas" ? categoria.nombre : nombreDe(categoria)}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}