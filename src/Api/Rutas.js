
function armarConsulta(parametros) {
  const consulta = new URLSearchParams();

  Object.entries(parametros).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== "") {
      consulta.set(clave, String(valor));
    }
  });

  const resultado = consulta.toString();

  return resultado ? `?${resultado}` : "";
}

// Rutas utilizadas por las funcionalidades del Sprint 2.
export const RUTAS = {
  categorias: "/categorias",
  ciudades: "/ciudades",
  eventosDestacados: "/eventos/destacados",

  textos: (idioma) => `/textos${armarConsulta({ idioma })}`,

  eventos: ({ ciudad, categoria, q, orden, porPagina, pagina } = {}) =>
    `/eventos${armarConsulta({
      ciudad,
      categoria,
      q,
      orden,
      porPagina,
      pagina,
    })}`,

  eventoDetalle: (slug) => `/eventos/${encodeURIComponent(slug)}`,

  eventosRelacionados: (slug) => `/eventos/${encodeURIComponent(slug)}/relacionados`,

  // Inicio, consulta y cierre de sesión.
  sesion: "/sesion",
};
