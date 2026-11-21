
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

/**
 * Realiza peticiones autenticadas mediante fetch.
 * Envía las cookies y transforma los errores de la API.
 */
async function solicitar(ruta, { metodo = "GET", datos } = {}) {
  const controlador = new AbortController();

  const temporizador = setTimeout(() => controlador.abort(), TIEMPO_LIMITE_MS);

  try {
    const respuesta = await fetch(`${BASE_API}${ruta}`, {
      method: metodo,
      credentials: "include",
      headers:
        datos === undefined
          ? undefined
          : {
              "Content-Type": "application/json",
            },
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
        mensaje: contenido?.error?.mensaje ?? `HTTP ${respuesta.status}`,
      });
    }

    return contenido;
  } finally {
    clearTimeout(temporizador);
  }
}

/**
 * POST /sesion
 * Valida las credenciales del formulario de ingreso.
 */
export function iniciarSesion(correo, clave) {
  return solicitar(RUTAS.sesion, {
    metodo: "POST",
    datos: { correo, clave },
  });
}

/**
 * GET /sesion
 * Consulta si el navegador conserva una sesión activa.
 */
export function consultarSesion() {
  return solicitar(RUTAS.sesion);
}

/**
 * DELETE /sesion
 * Solicita a la API cerrar la sesión activa.
 */
export function cerrarSesion() {
  return solicitar(RUTAS.sesion, {
    metodo: "DELETE",
  });
}
