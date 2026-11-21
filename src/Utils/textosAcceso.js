/**
 * textosAcceso.js
 *
 * Centraliza el acceso a los textos de autenticación.
 * Todas las etiquetas y mensajes se obtienen de GET /textos.
 *
 * Este archivo no contiene contenido visual hardcodeado.
 */

// Rutas de las etiquetas dentro de la respuesta de la API.
const RUTAS_TEXTOS = {
  // Formulario de ingreso
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

  // Validaciones
  camposMarcados: "paginas.ingresar.errores.camposObligatorios.titulo",

  correoObligatorio: "paginas.ingresar.errores.correoObligatorio",
  claveObligatoria: "paginas.ingresar.errores.claveObligatoria",

  correoInvalido: "formularios.validacion.correoInvalido",

  reintentar: "paginas.ingresar.errores.conexion.botones.reintentar",

  // Presentación de escritorio
  promocionTitulo: "paginas.ingresar.presentacion.lema",

  // Recuperación de contraseña
  recuperarTitulo: "paginas.recuperarClave.solicitud.titulo",

  recuperarDescripcion: "paginas.recuperarClave.solicitud.texto",

  enviarCodigo: "paginas.recuperarClave.solicitud.botones.enviar",

  codigo: "paginas.recuperarClave.nuevaClave.etiquetas.codigo",

  nuevaClave: "paginas.recuperarClave.nuevaClave.etiquetas.clave",

  cambiarClave: "paginas.recuperarClave.nuevaClave.botones.guardar",

  volverIngreso: "paginas.recuperarClave.solicitud.enlaces.volver",

  codigoPrueba: "paginas.recuperarClave.nuevaClave.etiquetas.codigo",

  recuperacionEnviada: "paginas.recuperarClave.enviado.texto",

  claveCambiada: "paginas.recuperarClave.actualizada.texto",
};

// Rutas de mensajes específicos del formulario.
const RUTAS_ERRORES = {
  credenciales_invalidas: "paginas.ingresar.errores.credenciales.texto",

  validacion: "paginas.ingresar.errores.camposObligatorios.texto",

  conexion: "paginas.ingresar.errores.conexion.texto",

  demasiadas_peticiones: "paginas.ingresar.errores.demasiadosIntentos.texto",
};

/**
 * Obtiene una propiedad anidada mediante su ruta.
 *
 * Ejemplo:
 * "paginas.ingresar.formulario.titulo"
 */
function obtenerPorRuta(objeto, ruta) {
  if (!objeto || !ruta) return undefined;

  return ruta.split(".").reduce((actual, propiedad) => actual?.[propiedad], objeto);
}

/**
 * Sustituye variables dinámicas de la API.
 *
 * Ejemplo:
 * "Espera {segundos} segundos"
 * con { segundos: 30 }
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
 * Obtiene una etiqueta desde GET /textos.
 *
 * El idioma ya viene aplicado por useTextos,
 * por eso no necesitamos duplicar traducciones.
 */
export function textoAcceso(textos, idioma, clave, variables = {}) {
  const ruta = RUTAS_TEXTOS[clave];

  if (!ruta) return "";

  const valor = obtenerPorRuta(textos, ruta);

  return interpolarTexto(valor, variables);
}

/**
 * Obtiene mensajes de error específicos o generales.
 *
 * Los códigos HTTP se interpretan en el componente,
 * mientras que el mensaje visible viene de la API.
 */
export function mensajeError(textos, idioma, codigo, variables = {}) {
  const rutaEspecial = RUTAS_ERRORES[codigo];

  const mensajeEspecial = rutaEspecial ? obtenerPorRuta(textos, rutaEspecial) : undefined;

  const mensajeGeneral = textos?.errores?.[codigo];

  let mensaje = mensajeEspecial ?? mensajeGeneral ?? textos?.errores?.generico;

  // Evita mostrar una plantilla incompleta
  // si todavía no se han enviado los segundos.
  if (codigo === "demasiadas_peticiones" && variables.segundos === undefined) {
    mensaje = textos?.paginas?.ingresar?.errores?.demasiadosIntentos?.titulo;
  }

  return interpolarTexto(mensaje, variables);
}

/**
 * Obtiene los beneficios del panel negro.
 *
 * No se define ninguna lista manual:
 * los beneficios provienen de GET /textos.
 */
export function beneficiosAcceso(textos, idioma) {
  const beneficios = textos?.paginas?.ingresar?.presentacion?.beneficios;

  if (!beneficios) return [];

  return Object.values(beneficios).filter(
    (beneficio) => typeof beneficio === "string" && beneficio.trim().length > 0,
  );
}
