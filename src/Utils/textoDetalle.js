// Todas las etiquetas visibles se toman de GET /textos, sin traducciones en JSX.
export function obtenerTexto(textos, ...rutas) {
  for (const ruta of rutas) {
    const valor = ruta.split(".").reduce((obj, clave) => obj?.[clave], textos);
    if (typeof valor === "string" && valor.trim()) return valor;
  }
  return "";
}

export function etiquetaDetalle(textos, seccion, ...rutasExtra) {
  const directa = obtenerTexto(
    textos,
    ...rutasExtra,
    `paginas.detalleEvento.${seccion}.titulo`,
    `paginas.detalleEvento.${seccion}`,
    `paginas.detalleEvento.secciones.${seccion}.titulo`,
    `paginas.detalleEvento.secciones.${seccion}`,
  );
  if (directa) return directa;
  // Si el contrato añade un nivel o usa otro nombre para una sección,
  // buscamos el título en el árbol recibido de la API (no inventamos el texto).
  const alias = {
    sobreEvento: ["descripcion", "acercade", "sobre", "sobreevento"],
    comoLlegar: ["ubicacion", "mapa", "direccion", "comollegar"],
    funciones: ["funciones", "horarios", "fechas"],
    localidades: ["localidades", "zonas", "entradas"],
    relacionados: ["relacionados", "recomendados", "similares", "eventosrelacionados"],
    duracion: ["duracion"],
  };
  const nombres = alias[seccion] || [seccion.toLowerCase()];
  function buscar(nodo, profundidad = 0) {
    if (!nodo || typeof nodo !== "object" || profundidad > 5) return "";
    for (const [clave, valor] of Object.entries(nodo)) {
      const nombre = clave
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z]/g, "");
      if (nombres.some((alterno) => nombre === alterno || nombre.includes(alterno))) {
        if (typeof valor === "string" && valor.trim()) return valor;
        if (valor && typeof valor === "object") {
          const titulo = valor.titulo || valor.etiqueta || valor.label;
          if (typeof titulo === "string" && titulo.trim()) return titulo;
        }
      }
    }
    for (const valor of Object.values(nodo)) {
      const encontrado = buscar(valor, profundidad + 1);
      if (encontrado) return encontrado;
    }
    return "";
  }
  return buscar(textos?.paginas?.detalleEvento);
}

export function plantilla(texto, datos) {
  return Object.entries(datos).reduce(
    (resultado, [clave, valor]) => resultado.replaceAll(`{${clave}}`, String(valor)),
    texto || "",
  );
}
