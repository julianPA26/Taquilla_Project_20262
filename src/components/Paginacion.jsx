import Icono from "./Icono.jsx";
import "./Paginacion.css";

// Devuelve algo como [1, "…a", 4, 5, 6, "…b", 12]: siempre la primera, la última y las cercanas
function paginasVisibles(actual, total) {
    const numeros = [...new Set([1, total, actual - 1, actual, actual + 1])]
        .filter((numero) => numero >= 1 && numero <= total)
        .sort((a, b) => a - b);

    const salida = [];
    numeros.forEach((numero, indice) => {
        if (indice > 0 && numero - numeros[indice - 1] > 1) {
            salida.push(`…${numero}`);
        }
        salida.push(numero);
    });
    return salida;
}

export default function Paginacion({ textos, idioma, pagina, totalPaginas, onCambiar }) {
    if (totalPaginas <= 1) return null;

    const ingles = idioma === "en";
    const aria = textos?.componentes?.paginacion?.aria;

    return (
        <nav className="paginacion" aria-label={aria?.etiqueta ?? (ingles ? "Pagination" : "Paginación")}>
            <button
                type="button"
                className="paginacion-boton"
                aria-label={aria?.anterior ?? (ingles ? "Previous page" : "Página anterior")}
                disabled={pagina === 1}
                onClick={() => onCambiar(pagina - 1)}
            >
                <Icono nombre="flechaIzquierda" />
            </button>

            <ul className="paginacion-lista">
                {paginasVisibles(pagina, totalPaginas).map((elemento) =>
                    typeof elemento === "string" ? (
                        <li key={elemento} className="paginacion-puntos" aria-hidden="true">
                            …
                        </li>
                    ) : (
                        <li key={elemento}>
                            <button
                                type="button"
                                className="paginacion-boton"
                                aria-current={elemento === pagina ? "page" : undefined}
                                aria-label={
                                    elemento === pagina
                                        ? (aria?.paginaActual ?? (ingles ? "Page {numero}, current page" : "Página {numero}, página actual")).replace("{numero}", elemento)
                                        : (aria?.irAPagina ?? (ingles ? "Go to page {numero}" : "Ir a la página {numero}")).replace("{numero}", elemento)
                                }
                                onClick={() => onCambiar(elemento)}
                            >
                                {elemento}
                            </button>
                        </li>
                    ),
                )}
            </ul>

            <button
                type="button"
                className="paginacion-boton"
                aria-label={aria?.siguiente ?? (ingles ? "Next page" : "Página siguiente")}
                disabled={pagina === totalPaginas}
                onClick={() => onCambiar(pagina + 1)}
            >
                <Icono nombre="flechaDerecha" />
            </button>
        </nav>
    );
}