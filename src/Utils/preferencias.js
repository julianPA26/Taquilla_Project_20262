// Preferencias que se guardan en el navegador (localStorage).
// El idioma SOLO se guarda si la persona aceptó las cookies de "preferencias".

const CLAVE_CONSENTIMIENTO = "taquilla-consentimiento";
const CLAVE_IDIOMA = "taquilla-idioma";
const IDIOMAS_VALIDOS = ["es", "en"];
const IDIOMA_POR_DEFECTO = "es";

// Devuelve lo que la persona respondió en el aviso, o null si aún no ha respondido
export function leerConsentimiento() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_CONSENTIMIENTO));
  } catch {
    return null;
  }
}

// Guarda la respuesta del aviso: "Aceptar" activa las opcionales y "Rechazar" no
export function guardarConsentimiento(aceptarOpcionales) {
  const consentimiento = {
    necesarias: true,
    preferencias: aceptarOpcionales,
    analiticas: aceptarOpcionales,
    marketing: aceptarOpcionales,
  };

  try {
    localStorage.setItem(CLAVE_CONSENTIMIENTO, JSON.stringify(consentimiento));
  } catch {
    // Si localStorage está bloqueado, el aviso se cierra igual
  }
}

function puedeGuardarIdioma() {
  const consentimiento = leerConsentimiento();
  return consentimiento?.preferencias === true;
}

// Idioma con el que arranca la página: el guardado, o español si no hay uno válido
export function leerIdiomaGuardado() {
  if (!puedeGuardarIdioma()) {
    return IDIOMA_POR_DEFECTO;
  }

  try {
    const guardado = localStorage.getItem(CLAVE_IDIOMA);
    if (IDIOMAS_VALIDOS.includes(guardado)) {
      return guardado;
    }
  } catch {
    // Si localStorage está bloqueado, se usa el idioma por defecto
  }
  return IDIOMA_POR_DEFECTO;
}

// Guarda el idioma, pero solo si se aceptaron las cookies de preferencias
export function guardarIdioma(idioma) {
  if (!puedeGuardarIdioma()) {
    return;
  }

  try {
    localStorage.setItem(CLAVE_IDIOMA, idioma);
  } catch {
    // Si localStorage está bloqueado, simplemente no se recuerda
  }
}

// Se usa al rechazar las cookies: se borra lo que hubiera guardado
export function borrarIdiomaGuardado() {
  try {
    localStorage.removeItem(CLAVE_IDIOMA);
  } catch {
    // Nada que borrar si localStorage está bloqueado
  }
}
