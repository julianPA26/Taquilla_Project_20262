import { BASE_API, ErrorApi } from "./Cliente.js";
import { RUTAS } from "./Rutas.js";

const TIEMPO_LIMITE_MS = 20000;

function leerEspera(valor) {
  if (!valor) return 0;

  const segundos = Number(valor);

  if (Number.isFinite(segundos)) {
    return Math.max(0, Math.ceil(segundos));
  }

  const fecha = Date.parse(valor);

  return Number.isNaN(fecha) ? 0 : Math.max(0, Math.ceil((fecha - Date.now()) / 1000));
}

async function solicitar(ruta, { metodo = "GET", datos } = {}) {
  const controlador = new AbortController();

  const temporizador = setTimeout(() => controlador.abort(), TIEMPO_LIMITE_MS);

  try {
    const respuesta = await fetch(`${BASE_API}${ruta}`, {
      method: metodo,
      credentials: "include",

      headers: datos === undefined ? undefined : { "Content-Type": "application/json" },

      body: datos === undefined ? undefined : JSON.stringify(datos),

      signal: controlador.signal,
    });

    const contenido = respuesta.status === 204 ? null : await respuesta.json().catch(() => null);

    if (!respuesta.ok) {
      throw new ErrorApi({
        status: respuesta.status,
        codigo: contenido?.error?.codigo ?? "error_interno",
        campos: contenido?.error?.campos ?? {},
        retryAfter: leerEspera(respuesta.headers.get("Retry-After")),
        mensaje: contenido?.error?.mensaje || `HTTP ${respuesta.status}`,
      });
    }

    return contenido;
  } finally {
    clearTimeout(temporizador);
  }
}

// La API establece la cookie httpOnly.
// Nunca almacenamos el token de la respuesta.
export const iniciarSesion = (correo, clave) =>
  solicitar(RUTAS.sesion, {
    metodo: "POST",
    datos: { correo, clave },
  });

export const consultarSesion = () => solicitar(RUTAS.sesion);

export const cerrarSesion = () =>
  solicitar(RUTAS.sesion, {
    metodo: "DELETE",
  });

export const solicitarRecuperacion = (correo) =>
  solicitar(RUTAS.recuperacion, {
    metodo: "POST",
    datos: { correo },
  });

export const cambiarClave = ({ correo, codigo, clave }) =>
  solicitar(RUTAS.nuevaClave, {
    metodo: "POST",
    datos: { correo, codigo, clave },
  });
