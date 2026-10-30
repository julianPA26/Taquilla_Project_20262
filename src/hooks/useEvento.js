import { useEffect, useState } from "react";

const BASE = "https://yanethm-taquilla-api.fly.dev/api/v1";
const POR_PAGINA = 50;

// Trae TODOS los eventos (pidiendo cada página de la API) ya ordenados por `orden`
// ("fecha", "precio" o "popularidad"). Los filtros y la paginación de la pantalla
// se hacen después, en el navegador, porque el diseño tiene filtros (varias categorías,
// fechas, rango de precio) que la API no ofrece.
export function useEventos(orden) {
    const [eventos, setEventos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);
    const [intento, setIntento] = useState(0);

    useEffect(() => {
        const controlador = new AbortController();
        const limite = setTimeout(() => controlador.abort(), 15000);
        let vigente = true;
        setCargando(true);
        setError(false);

        async function pedirPagina(pagina) {
            const respuesta = await fetch(
                `${BASE}/eventos?orden=${orden}&porPagina=${POR_PAGINA}&pagina=${pagina}`,
                { signal: controlador.signal },
            );
            if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
            return respuesta.json();
        }

        async function cargar() {
            try {
                const primera = await pedirPagina(1);
                let todos = primera.datos ?? [];
                const paginas = primera.paginacion?.paginas ?? 1;

                if (paginas > 1) {
                    const restantes = await Promise.all(
                        Array.from({ length: paginas - 1 }, (_, i) => pedirPagina(i + 2)),
                    );
                    restantes.forEach((pagina) => {
                        todos = todos.concat(pagina.datos ?? []);
                    });
                }

                if (vigente) setEventos(todos);
            } catch (errorConsulta) {
                if (vigente) {
                    console.error("Error al cargar los eventos:", errorConsulta);
                    setError(true);
                }
            } finally {
                clearTimeout(limite);
                if (vigente) setCargando(false);
            }
        }

        cargar();
        return () => {
            vigente = false;
            clearTimeout(limite);
            controlador.abort();
        };
    }, [orden, intento]);

    return {
        eventos,
        cargando,
        error,
        recargar: () => setIntento((valor) => valor + 1),
    };
}