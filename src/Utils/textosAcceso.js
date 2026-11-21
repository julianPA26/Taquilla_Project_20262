/**
 * textosAcceso.js
 *
 * Centraliza los textos del inicio de sesión.
 * Las etiquetas y los mensajes proceden de GET /textos.
 *
 * No contiene traducciones ni mensajes visuales fijos.
 */

// Relaciona nombres internos con las rutas reales de la API.
const RUTAS_TEXTOS = {
  titulo: "paginas.ingresar.formulario.titulo",
  descripcion: "paginas.ingresar.formulario.subtitulo",

  correo: "paginas.ingresar.formulario.etiquetas.correo",
  correoPlaceholder: "paginas.ingresar.formulario.placeholders.correo",

  clave: "paginas.ingresar.formulario.etiquetas.clave",
  recordar: "paginas.ingresar.formulario.etiquetas.mantenerSesion",

  olvidaste: "paginas.ingresar.formulario.enlaces.olvidasteClave",

  ingresar: "paginas.ingresar.formulario.botones.ingresar",
  ingresando: "paginas.ingresar.formulario.mensajes.ingresando",

  noTienesCuenta: "paginas.ingresar.formulario.mensajes.sinCuenta",
  crearCuenta: "paginas.ingresar.formulario.enlaces.crearCuenta",

  mostrarClave: "formularios.aria.mostrarClave",
  ocultarClave: "formularios.aria.ocultarClave",

  // Mensajes de validación de los campos.
  camposMarcados: "paginas.ingresar.errores.camposObligatorios.titulo",
  correoObligatorio: "paginas.ingresar.errores.correoObligatorio",
  claveObligatoria: "paginas.ingresar.errores.claveObligatoria",
  correoInvalido: "formularios.validacion.correoInvalido",

  reintentar: "paginas.ingresar.errores.conexion.botones.reintentar",
};

// Relaciona los códigos de error con sus mensajes en la API.
const RUTAS_ERRORES = {
  credenciales_invalidas: "paginas.ingresar.errores.credenciales.texto",

  validacion: "paginas.ingresar.errores.camposObligatorios.texto",

  conexion: "paginas.ingresar.errores.conexion.texto",

  demasiadas_peticiones: "paginas.ingresar.errores.demasiadosIntentos.texto",
};

/**
 * Recorre un objeto utilizando una ruta de propiedades.
 */
function obtenerPorRuta(objeto, ruta) {
  if (!objeto || !ruta) return undefined;

  return ruta.split(".").reduce((actual, propiedad) => actual?.[propiedad], objeto);
}

/**
 * Sustituye variables de textos devueltos por la API.
 * Por ejemplo: {segundos}.
 */
export function interpolarTexto(plantilla, variables = {}) {
  if (typeof plantilla !== "string") {
    return "";
  }

  return plantilla.replace(/\{(\w+)\}/g, (coincidencia, clave) => {
    const valor = variables[clave];

    return valor === undefined || valor === null ? coincidencia : String(valor);
  });
}

/**
 * Obtiene una etiqueta del formulario de ingreso.
 * El idioma ya fue aplicado por useTextos.
 */
export function textoAcceso(textos, idioma, clave, variables = {}) {
  const ruta = RUTAS_TEXTOS[clave];

  if (!ruta) return "";

  const valor = obtenerPorRuta(textos, ruta);

  return interpolarTexto(valor, variables);
}

/**
 * Obtiene el mensaje correspondiente a un error.
 * Prioriza los mensajes específicos del formulario.
 */
export function mensajeError(textos, idioma, codigo, variables = {}) {
  const rutaEspecial = RUTAS_ERRORES[codigo];

  const mensajeEspecial = rutaEspecial ? obtenerPorRuta(textos, rutaEspecial) : undefined;

  let mensaje = mensajeEspecial ?? textos?.errores?.[codigo] ?? textos?.errores?.generico;

  // Evita mostrar un marcador sin reemplazar.
  if (codigo === "demasiadas_peticiones" && variables.segundos === undefined) {
    mensaje = textos?.paginas?.ingresar?.errores?.demasiadosIntentos?.titulo;
  }

  return interpolarTexto(mensaje, variables);
}
