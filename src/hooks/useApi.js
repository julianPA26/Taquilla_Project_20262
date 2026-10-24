import { useEffect, useState } from "react";

const BASE = "https://yanethm-taquilla-api.fly.dev/api/v1";

// Pide una ruta de la API (por ejemplo "/eventos/destacados") y devuelve su estado.
// Sirve para cualquier endpoint: destacados, ciudades, categorías, eventos con filtros...
export function useApi(ruta) {
    const [datos, setDatos] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);
    const [intento, setIntento] = useState(0);

    useEffect(() => {
        const controlador = new AbortController();
        const limite = setTimeout(() => controlador.abort(), 12000);
        let vigente = true;
        setCargando(true);
        setError(false);

        async function cargar() {
            try {
                const respuesta = await fetch(`${BASE}${ruta}`, {
                    signal: controlador.signal,
                });
                if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
                const json = await respuesta.json();
                if (vigente) setDatos(json);
            } catch (errorConsulta) {
                if (vigente) {
                    console.error("Error al pedir datos a la API:", errorConsulta);
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
    }, [ruta, intento]);

    return {
        datos,
        cargando,
        error,
        recargar: () => setIntento((valor) => valor + 1),
    };
}