import { useEffect, useState } from "react";
import { pedirJson } from "../Api/Cliente.js";

// Pide una ruta de la API y devuelve su estado: { datos, cargando, error, recargar }.
// "transformar" es opcional: una función que arregla la respuesta antes de guardarla
// (por ejemplo normalizarRespuestaEventos). Debe ser una función definida FUERA del
// componente para que no cambie en cada render.
export function useApi(ruta, transformar) {
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
                const json = await pedirJson(ruta, controlador.signal);
                let resultado = json;
                if (transformar) {
                    resultado = transformar(json);
                }
                if (vigente) {
                    setDatos(resultado);
                }
            } catch (errorConsulta) {
                if (vigente) {
                    console.error("Error al pedir datos a la API:", errorConsulta);
                    setError(true);
                }
            } finally {
                clearTimeout(limite);
                if (vigente) {
                    setCargando(false);
                }
            }
        }

        cargar();
        return () => {
            vigente = false;
            clearTimeout(limite);
            controlador.abort();
        };
        // "transformar" no va en las dependencias a propósito: es una función fija del módulo.
    }, [ruta, intento]);

    return {
        datos,
        cargando,
        error,
        recargar: () => setIntento((valor) => valor + 1),
    };
}