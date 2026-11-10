// CAPA ADAPTADORA: traduce lo que manda la API a la forma que usa NUESTRA aplicación.
// Los componentes (TarjetaEvento, filtros.js, Inicio...) siempre leen estos nombres:
//   id, slug, titulo, fecha, categoria, precioDesde, recinto{nombre,ciudad}, disponibilidad, afiche
// Si la API cambia un nombre, se ajusta la línea correspondiente AQUÍ y nada más.
export function normalizarEvento(eventoApi) {
  return {
    // "...eventoApi" conserva cualquier otro campo que no listemos (por si algún componente lo usa)
    ...eventoApi,
    id: eventoApi.id,
    slug: eventoApi.slug,
    titulo: eventoApi.titulo,
    fecha: eventoApi.fecha,
    categoria: eventoApi.categoria,
    precioDesde: eventoApi.precioDesde,
    recinto: eventoApi.recinto,
    disponibilidad: eventoApi.disponibilidad,
    afiche: eventoApi.afiche,
  };
  // EJEMPLO si la profesora renombra campos:
  //   precioDesde: eventoApi.precio_minimo,
  //   recinto: { nombre: eventoApi.lugar.nombre, ciudad: eventoApi.lugar.ciudad },
}

// Campos que filtros.js y formato.js leen de cada evento. Se escriben como ruta:
// "recinto.ciudad" significa evento.recinto.ciudad
const CAMPOS_OBLIGATORIOS = [
  "id",
  "slug",
  "titulo",
  "fecha",
  "categoria",
  "precioDesde",
  "recinto.nombre",
  "recinto.ciudad",
];

// Mensajes que ya se mostraron, para no repetir el mismo aviso en cada página o render
const avisosEmitidos = new Set();

// Entra a un objeto siguiendo una ruta escrita como texto: ("recinto.ciudad") -> objeto.recinto.ciudad
function obtenerPorRuta(objeto, ruta) {
  let actual = objeto;
  for (const clave of ruta.split(".")) {
    if (actual === null || actual === undefined) {
      return undefined;
    }
    actual = actual[clave];
  }
  return actual;
}

// Revisa un evento YA normalizado. Si falta un campo, avisa en la consola (F12) cuál es.
// Solo se compara contra "undefined": un null puede ser un valor válido (por ejemplo, sin precio).
// No lanza error a propósito: así la pantalla no se rompe, pero el problema queda a la vista.
function avisarCamposFaltantes(eventoNormalizado) {
  const faltantes = CAMPOS_OBLIGATORIOS.filter(
    (ruta) => obtenerPorRuta(eventoNormalizado, ruta) === undefined,
  );

  if (faltantes.length === 0) {
    return;
  }

  const mensaje =
    `La API no está mandando estos campos del evento: ${faltantes.join(", ")}. ` +
    "Revisa normalizarEvento en src/Api/Adaptadores.js";

  if (!avisosEmitidos.has(mensaje)) {
    avisosEmitidos.add(mensaje);
    console.error(mensaje);
  }
}

// Las listas llegan como { datos: [...], paginacion: {...} }.
// Esta función normaliza cada evento de "datos" y deja el resto de la respuesta igual.
export function normalizarRespuestaEventos(respuestaApi) {
  if (!Array.isArray(respuestaApi?.datos)) {
    return respuestaApi;
  }

  const eventosNormalizados = respuestaApi.datos.map(normalizarEvento);

  // Si la API renombra un campo, FALTA en todos los eventos: con revisar el primero basta
  if (eventosNormalizados.length > 0) {
    avisarCamposFaltantes(eventosNormalizados[0]);
  }

  return {
    ...respuestaApi,
    datos: eventosNormalizados,
  };
}
