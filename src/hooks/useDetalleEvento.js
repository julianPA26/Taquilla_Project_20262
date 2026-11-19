import { useEffect, useState } from "react";
import { pedirJson } from "../Api/Cliente.js";
import { RUTAS } from "../Api/Rutas.js";
import { normalizarEvento } from "../Api/Adaptadores.js";

const INICIAL = {
  evento: null,
  relacionados: [],
  cargando: true,
  error: null,
  noEncontrado: false,
};

export function useDetalleEvento(slug) {
  const [estado, setEstado] = useState(INICIAL);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    if (!slug) {
      setEstado({ ...INICIAL, cargando: false, noEncontrado: true });
      return;
    }

    const controlador = new AbortController();
    let vigente = true;
    setEstado(INICIAL);
    async function cargar() {
      try {
        // Se solicita primero el evento para distinguir 404 de otras fallas.
        const eventoApi = await pedirJson(RUTAS.eventoDetalle(slug), controlador.signal);
        const relacionadosApi = await pedirJson(
          RUTAS.eventosRelacionados(slug),
          controlador.signal,
        );
        if (vigente) {
          setEstado({
            evento: normalizarEvento(eventoApi),
            relacionados: (Array.isArray(relacionadosApi?.datos) ? relacionadosApi.datos : [])
              .filter((item) => item?.slug && item.slug !== slug)
              .slice(0, 4)
              .map(normalizarEvento),
            cargando: false,
            error: null,
            noEncontrado: false,
          });
        }
      } catch (error) {
        if (!vigente || error?.name === "AbortError") return;
        const noEncontrado = error?.status === 404 && error?.codigo === "no_encontrado";
        setEstado({
          ...INICIAL,
          cargando: false,
          error: noEncontrado ? null : error,
          noEncontrado,
        });
      }
    }
    cargar();
    return () => {
      vigente = false;
      controlador.abort();
    };
  }, [slug, intento]);

  return { ...estado, reintentar: () => setIntento((valor) => valor + 1) };
}
