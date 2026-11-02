import { useEffect, useState } from "react";
import { pedirJson } from "../api/cliente.js";

// Textos que el Navbar lee SIN valor de respaldo: si faltan, el Navbar se rompería.
// Cada uno es una "ruta" dentro del objeto textos. Para agregar o quitar uno, se edita esta lista.
const RUTAS_OBLIGATORIAS = [
  "navbar.logo.texto",
  "navbar.logo.aria",
  "navbar.enlaces.explorar",
  "navbar.buscador.placeholder",
  "navbar.buscador.aria",
  "navbar.botones.ingresar",
  "navbar.botones.crearCuenta",
  "navbar.usuario.menu",
  "navbar.usuario.panel",
  "navbar.usuario.cerrarSesion",
  "navbar.aria.idioma",
  "navbar.aria.accesibilidad",
];

// Entra a un objeto siguiendo una ruta escrita como texto: ("navbar.logo.texto") -> objeto.navbar.logo.texto
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

function validarTextos(datos) {
  const textos = datos?.textos;

  // Un valor es válido solo si es texto con contenido (no "", no "   ", no undefined, no número)
  const faltantes = RUTAS_OBLIGATORIAS.filter((ruta) => {
    const valor = obtenerPorRuta(textos, ruta);
    return !(typeof valor === "string" && valor.trim());
  });

  if (faltantes.length > 0) {
    // El mensaje dice EXACTAMENTE qué clave cambió la API: se ve en la consola (F12)
    throw new Error(`Faltan textos del navbar en la API: ${faltantes.join(", ")}`);
  }
  return textos;
}

export function useTextos(idioma) {
  const [textos, setTextos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    const limite = setTimeout(() => controlador.abort(), 12000);
    let vigente = true;
    setCargando(true);
    setError(false);
    setTextos(null);

    async function cargarTextos() {
      try {
        const datos = await pedirJson(`/textos?idioma=${idioma}`, controlador.signal);
        const nuevosTextos = validarTextos(datos);
        if (vigente) {
          setTextos(nuevosTextos);
        }
      } catch (errorConsulta) {
        if (vigente) {
          console.error("Error al cargar los textos:", errorConsulta);
          setError(true);
        }
      } finally {
        clearTimeout(limite);
        if (vigente) {
          setCargando(false);
        }
      }
    }

    cargarTextos();
    return () => {
      vigente = false;
      clearTimeout(limite);
      controlador.abort();
    };
  }, [idioma, intento]);

  return {
    textos,
    cargando,
    error,
    recargar: () => setIntento((valor) => valor + 1),
  };
}