// Cliente compartido: conserva la deduplicación de peticiones del Sprint 1.
const direccion = import.meta.env.VITE_API_URL;
if (!direccion) {
  throw new Error("Falta VITE_API_URL. Copia .env.example a .env y reinicia npm run dev.");
}
export const BASE_API = direccion.replace(/\/$/, "");
const TIEMPO_MAXIMO_MS = 20000;
const pedidosEnCurso = new Map();

export class ErrorApi extends Error {
  constructor({ mensaje, status, codigo, campos, retryAfter }) {
    super(mensaje);
    this.name = "ErrorApi";
    this.status = status;
    this.codigo = codigo;
    this.campos = campos;
    this.retryAfter = retryAfter;
  }
}

function crearErrorDeCancelacion() {
  return new DOMException("La petición fue cancelada.", "AbortError");
}

async function descargarJson(ruta) {
  const controlador = new AbortController();
  const limite = setTimeout(() => controlador.abort(), TIEMPO_MAXIMO_MS);
  try {
    // Solo se usan para pruebas locales, nunca en el contenido de la interfaz.
    const cabeceras = {};
    if (import.meta.env.DEV && ruta.startsWith("/eventos") && import.meta.env.VITE_SIMULAR_LATENCIA) {
      cabeceras["X-Simular-Latencia"] = import.meta.env.VITE_SIMULAR_LATENCIA;
    }
    if (import.meta.env.DEV && ruta.startsWith("/eventos") && import.meta.env.VITE_SIMULAR_ERROR) {
      cabeceras["X-Simular-Error"] = import.meta.env.VITE_SIMULAR_ERROR;
    }
    const respuesta = await fetch(`${BASE_API}${ruta}`, {
      signal: controlador.signal,
      headers: cabeceras,
    });
    const contenido = await respuesta.json().catch(() => null);
    if (!respuesta.ok) {
      throw new ErrorApi({
        mensaje: contenido?.error?.mensaje || `HTTP ${respuesta.status}`,
        status: respuesta.status,
        codigo: contenido?.error?.codigo,
        campos: contenido?.error?.campos,
        retryAfter: Number(respuesta.headers.get("Retry-After")) || 0,
      });
    }
    return contenido;
  } finally {
    clearTimeout(limite);
  }
}

function obtenerPedido(ruta) {
  let pedido = pedidosEnCurso.get(ruta);
  if (!pedido) {
    pedido = descargarJson(ruta).finally(() => pedidosEnCurso.delete(ruta));
    pedidosEnCurso.set(ruta, pedido);
  }
  return pedido;
}

// Compatible con useApi/useTextos existentes. Cada consumidor puede cancelar su espera.
export function pedirJson(ruta, senal) {
  if (senal?.aborted) return Promise.reject(crearErrorDeCancelacion());
  const pedido = obtenerPedido(ruta);
  if (!senal) return pedido;
  return new Promise((resolver, rechazar) => {
    function alCancelar() { rechazar(crearErrorDeCancelacion()); }
    senal.addEventListener("abort", alCancelar, { once: true });
    pedido.then(
      (datos) => { senal.removeEventListener("abort", alCancelar); resolver(datos); },
      (error) => { senal.removeEventListener("abort", alCancelar); rechazar(error); },
    );
  });
}
