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

// Las listas llegan como { datos: [...], paginacion: {...} }.
// Esta función normaliza cada evento de "datos" y deja el resto de la respuesta igual.
export function normalizarRespuestaEventos(respuestaApi) {
    if (!Array.isArray(respuestaApi?.datos)) {
        return respuestaApi;
    }

    return {
        ...respuestaApi,
        datos: respuestaApi.datos.map(normalizarEvento),
    };
}