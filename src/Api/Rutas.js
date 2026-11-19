// Centralización de rutas de la API, sin duplicar URLs en componentes.
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

export const RUTAS = {
  categorias: "/categorias",
  ciudades: "/ciudades",
  eventosDestacados: "/eventos/destacados",
  textos: (idioma) => `/textos${armarConsulta({ idioma })}`,
  // Conserva los parámetros existentes y permite los nuevos filtros del contrato.
  eventos: ({ ciudad, categoria, q, orden, porPagina, pagina } = {}) =>
    `/eventos${armarConsulta({ ciudad, categoria, q, orden, porPagina, pagina })}`,
  eventoDetalle: (slug) => `/eventos/${encodeURIComponent(slug)}`,
  eventosRelacionados: (slug) => `/eventos/${encodeURIComponent(slug)}/relacionados`,
};
