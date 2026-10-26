import TarjetaEvento from "./TarjetaEvento.jsx";
import Icono from "./Icono.jsx";
import "./Destacados.css";

// Cuántas tarjetas grises se muestran mientras llega la respuesta de la API
const CANTIDAD_ESQUELETOS = 4;

// Textos de respaldo: se usan si la API de textos aún no respondió o no trae la clave.
// "verTodos" no existe en la API, por eso siempre sale de aquí.
const RESPALDO = {
    es: {
        titulo: "Destacados de la semana",
        tituloMovil: "Destacados",
        subtitulo: "Los eventos con más entradas vendidas en los últimos 7 días",
        verTodos: "Ver todos",
        cargando: "Cargando…",
        vacioTitulo: "No hay nada por aquí",
        vacioTexto: "Cuando haya información la verás en este lugar.",
        errorTitulo: "Algo salió mal",
        errorTexto: "Revisa tu conexión e inténtalo de nuevo.",
        reintentar: "Reintentar",
    },
    en: {
        titulo: "This week's highlights",
        tituloMovil: "Highlights",
        subtitulo: "The events with the most tickets sold in the last 7 days",
        verTodos: "View all",
        cargando: "Loading…",
        vacioTitulo: "Nothing here yet",
        vacioTexto: "When there is information you will see it here.",
        errorTitulo: "Something went wrong",
        errorTexto: "Check your connection and try again.",
        reintentar: "Try again",
    },
};

// Sección "Destacados de la semana" de Inicio.
// Recibe los eventos ya pedidos por Inicio (así no se pide dos veces la misma ruta).
export default function Destacados({
    eventos,
    cargando,
    error,
    recargar,
    textos,
    idioma,
}) {
    const respaldo = RESPALDO[idioma] ?? RESPALDO.es;
    const seccion = textos?.paginas?.inicio?.destacados;
    const estados = textos?.estados;

    const titulo = seccion?.titulo ?? respaldo.titulo;
    const tituloMovil = seccion?.tituloMovil ?? respaldo.tituloMovil;
    const subtitulo = seccion?.subtitulo ?? respaldo.subtitulo;
    const textoCargando = estados?.cargando?.indicador ?? respaldo.cargando;

    // Se arma UNA de las cuatro vistas posibles: cargando, error, vacío o lista
    let contenido;

    if (cargando) {
        const esqueletos = Array.from({ length: CANTIDAD_ESQUELETOS }, (_, posicion) => (
            <li key={posicion} className="tarjeta-esqueleto" aria-hidden="true" />
        ));

        contenido = (
            <>
                <p className="destacados-oculto" role="status">
                    {textoCargando}
                </p>
                <ul className="destacados-lista">{esqueletos}</ul>
            </>
        );
    } else if (error) {
        contenido = (
            <div className="destacados-estado" role="alert">
                <h3 className="destacados-estado-titulo">
                    {estados?.error?.titulo ?? respaldo.errorTitulo}
                </h3>
                <p className="destacados-estado-texto">
                    {estados?.error?.texto ?? respaldo.errorTexto}
                </p>
                <button type="button" className="destacados-reintentar" onClick={recargar}>
                    {estados?.error?.botones?.reintentar ?? respaldo.reintentar}
                </button>
            </div>
        );
    } else if (eventos.length === 0) {
        contenido = (
            <div className="destacados-estado">
                <h3 className="destacados-estado-titulo">
                    {estados?.vacio?.titulo ?? respaldo.vacioTitulo}
                </h3>
                <p className="destacados-estado-texto">
                    {estados?.vacio?.texto ?? respaldo.vacioTexto}
                </p>
            </div>
        );
    } else {
        contenido = (
            <ul className="destacados-lista">
                {eventos.map((evento) => (
                    <li key={evento.id}>
                        <TarjetaEvento evento={evento} textos={textos} idioma={idioma} />
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <section
            className="destacados"
            aria-labelledby="destacados-titulo"
            aria-busy={cargando}
        >
            <div className="destacados-interior">
                <header className="destacados-cabecera">
                    <div>
                        <h2 className="destacados-titulo" id="destacados-titulo">
                            {/* Dos textos: el CSS muestra el largo o el corto según el tamaño */}
                            <span className="destacados-titulo-largo">{titulo}</span>
                            <span className="destacados-titulo-corto">{tituloMovil}</span>
                        </h2>
                        <p className="destacados-subtitulo">{subtitulo}</p>
                    </div>

                    <a className="destacados-ver-todos" href="#explorar">
                        {respaldo.verTodos}
                        <Icono nombre="flechaDerecha" />
                    </a>
                </header>

                {contenido}
            </div>
        </section>
    );
}