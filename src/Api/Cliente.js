// La dirección base de la API sale de la variable de entorno VITE_API_URL (archivo .env).
const direccion = import.meta.env.VITE_API_URL;

if (!direccion) {
  throw new Error("Falta VITE_API_URL. Copia .env.example a .env y reinicia npm run dev.");
}

// Se quita la "/" final por si alguien la escribe, para no armar rutas con "//"
export const BASE_API = direccion.replace(/\/$/, "");

// Tiempo máximo que se espera la respuesta de la API antes de darla por perdida
const TIEMPO_MAXIMO_MS = 20000;

// Peticiones que todavía no terminan: ruta -> promesa.
// Si la misma ruta se pide otra vez mientras la primera sigue en camino, se reutiliza
// esa petición en vez de lanzar otra.
const pedidosEnCurso = new Map();

function crearErrorDeCancelacion() {
  return new DOMException("La petición fue cancelada.", "AbortError");
}

// Hace la petición real. Tiene su propio límite de tiempo para que una petición
// colgada no se quede en la lista para siempre.
async function descargarJson(ruta) {
  const controlador = new AbortController();
  const limite = setTimeout(() => controlador.abort(), TIEMPO_MAXIMO_MS);

  try {
    const respuesta = await fetch(`${BASE_API}${ruta}`, { signal: controlador.signal });
    if (!respuesta.ok) {
      throw new Error(`HTTP ${respuesta.status} en ${ruta}`);
    }
    return await respuesta.json();
  } finally {
    clearTimeout(limite);
  }
}

// Devuelve la petición en curso de esa ruta, o crea una nueva si no hay ninguna.
// Al terminar (bien o mal) se quita de la lista: un error no se guarda y
// "Reintentar" siempre lanza una petición nueva.
function obtenerPedido(ruta) {
  let pedido = pedidosEnCurso.get(ruta);

  if (!pedido) {
    pedido = descargarJson(ruta).finally(() => pedidosEnCurso.delete(ruta));
    pedidosEnCurso.set(ruta, pedido);
  }
  return pedido;
}

// "senal" es la señal de cancelación de quien pide (el hook). Si se cancela, SOLO se cancela
// la espera de ese hook: la petición real sigue y la aprovecha quien la pida después.
export function pedirJson(ruta, senal) {
  if (senal?.aborted) {
    return Promise.reject(crearErrorDeCancelacion());
  }

  const pedido = obtenerPedido(ruta);
  if (!senal) {
    return pedido;
  }

  return new Promise((resolver, rechazar) => {
    function alCancelar() {
      rechazar(crearErrorDeCancelacion());
    }
    senal.addEventListener("abort", alCancelar, { once: true });

    pedido.then(
      (datos) => {
        senal.removeEventListener("abort", alCancelar);
        resolver(datos);
      },
      (errorPedido) => {
        senal.removeEventListener("abort", alCancelar);
        rechazar(errorPedido);
      },
    );
  });
}
