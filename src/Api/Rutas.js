// TODAS las rutas de la API están escritas aquí y en ningún otro archivo.
// Si la API renombra una ruta, se cambia la línea correspondiente AQUÍ y nada más.
// (El dominio y la versión, "/api/v1", viven en Cliente.js.)

// Arma "?clave=valor&clave=valor" usando solo los parámetros que tienen valor.
// encodeURIComponent convierte "Bogotá" en "Bogot%C3%A1" para que viaje bien en la URL.
function armarConsulta(parametros) {
  const partes = [];

  for (const [clave, valor] of Object.entries(parametros)) {
    if (valor !== undefined && valor !== null && valor !== "") {
      partes.push(`${clave}=${encodeURIComponent(valor)}`);
    }
  }

  if (partes.length === 0) {
    return "";
  }
  return `?${partes.join("&")}`;
}

export const RUTAS = {
  // Las que no cambian son simples textos
  categorias: "/categorias",
  ciudades: "/ciudades",
  eventosDestacados: "/eventos/destacados",

  // Las que reciben datos son funciones que devuelven el texto de la ruta
  textos: (idioma) => `/textos${armarConsulta({ idioma })}`,

  // El nombre de la IZQUIERDA es el que usa la API; el de la DERECHA es el nuestro.
  // Si la API renombra "porPagina" a "limite", solo se cambia: limite: porPagina
  eventos: ({ ciudad, orden, porPagina, pagina } = {}) =>
    `/eventos${armarConsulta({ ciudad, orden, porPagina, pagina })}`,
};
