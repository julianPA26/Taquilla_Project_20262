import { useEffect, useRef, useState } from "react";
import { useTextos } from "./hooks/useTextos.js";
import { leerIdiomaGuardado, guardarIdioma } from "./Utils/preferencias.js";
import { consultarSesion, cerrarSesion } from "./Api/Sesion.js";
import { ErrorApi } from "./Api/Cliente.js";
import Navbar from "./components/NavBar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Inicio from "./Pages/Inicio.jsx";
import Explorar from "./Pages/Explorar.jsx";
import DetalleEvento from "./Pages/DetalleEvento.jsx";
import Acceso from "./Pages/Acceso.jsx";
import AccessibilityPanel from "./components/AccessibilityPanel/AccessibilityPanel.jsx";
import AvisoCookies from "./components/AvisoCookies/AvisoCookies.jsx";
import "./App.css";

const VISTAS_PUBLICAS = ["inicio", "explorar"];

function leerRutaActual() {
  const pathname = window.location.pathname;

  if (/^\/ingresar\/?$/.test(pathname) || /^\/(crear-cuenta|recuperar-clave)\/?$/.test(pathname)) {
    return { vista: "ingresar" };
  }

  const coincidencia = pathname.match(/^\/eventos\/([^/]+)\/?$/);

  if (coincidencia) {
    try {
      return {
        vista: "detalle",
        slug: decodeURIComponent(coincidencia[1]),
      };
    } catch {
      return {
        vista: "detalle",
        slug: "",
      };
    }
  }

  const hash = window.location.hash.slice(1);

  return {
    vista: VISTAS_PUBLICAS.includes(hash) ? hash : "inicio",
  };
}

export default function App() {
  // Preferencias generales de la aplicación.
  const [idioma, setIdioma] = useState(leerIdiomaGuardado);
  const [ruta, setRuta] = useState(leerRutaActual);

  // La sesión se consulta a la API, no a localStorage.
  const [usuario, setUsuario] = useState(null);
  const [cerrandoSesion, setCerrandoSesion] = useState(false);
  const [errorSesion, setErrorSesion] = useState("");

  // Evita que una consulta antigua sobrescriba un ingreso nuevo.
  const versionSesion = useRef(0);

  // Estados de accesibilidad y búsqueda.
  const [panelAccesibilidadAbierto, setPanelAccesibilidadAbierto] = useState(false);

  const [consulta, setConsulta] = useState("");
  const [ciudadFiltro, setCiudadFiltro] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");

  // Textos y estado de carga provenientes de la API.
  const datos = useTextos(idioma);
  const activo = ruta.vista;
  const esAcceso = activo === "ingresar";

  /**
   * Recupera la sesión al abrir o recargar la aplicación.
   * La cookie httpOnly es administrada por el navegador y la API.
   */
  useEffect(() => {
    let vigente = true;
    const versionInicial = versionSesion.current;

    async function recuperarSesionActual() {
      try {
        const respuesta = await consultarSesion();

        if (vigente && versionSesion.current === versionInicial) {
          setUsuario(respuesta?.usuario ?? null);
        }
      } catch (error) {
        if (vigente && versionSesion.current === versionInicial) {
          // Una respuesta 401 significa que no hay sesión activa.
          if (error instanceof ErrorApi && error.status === 401) {
            setUsuario(null);
          } else {
            console.warn("No fue posible comprobar la sesión:", error);
          }
        }
      }
    }

    void recuperarSesionActual();

    return () => {
      vigente = false;
    };
  }, []);

  /**
   * Sincroniza los botones Atrás y Adelante del navegador
   * con las vistas de React.
   */
  useEffect(() => {
    function sincronizar() {
      const hash = window.location.hash.slice(1);

      if (window.location.pathname !== "/" && VISTAS_PUBLICAS.includes(hash)) {
        window.history.replaceState(null, "", `/#${hash}`);
      }

      setRuta(leerRutaActual());

      // Los filtros de una búsqueda nueva comienzan limpios.
      setConsulta("");
      setCiudadFiltro("");
      setCategoriaFiltro("");
      setFechaFiltro("");
    }

    window.addEventListener("hashchange", sincronizar);
    window.addEventListener("popstate", sincronizar);

    return () => {
      window.removeEventListener("hashchange", sincronizar);
      window.removeEventListener("popstate", sincronizar);
    };
  }, []);

  // Aplica y conserva el idioma seleccionado.
  useEffect(() => {
    document.documentElement.lang = idioma;
    guardarIdioma(idioma);
  }, [idioma]);

  // Actualiza los metadatos utilizando los textos de la API.
  useEffect(() => {
    if (activo === "detalle") return;

    const paginas = datos.textos?.paginas;

    const pagina =
      activo === "ingresar"
        ? paginas?.ingresar
        : activo === "explorar"
          ? paginas?.explorar
          : paginas?.inicio;

    if (pagina?.seo?.titulo) {
      document.title = pagina.seo.titulo;
    }

    const descripcion = document.querySelector('meta[name="description"]');

    if (descripcion && pagina?.seo?.descripcion) {
      descripcion.setAttribute("content", pagina.seo.descripcion);
    }
  }, [activo, datos.textos]);

  // Lleva al comienzo de cada nueva vista.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [ruta]);

  /**
   * Navega a Inicio o Explorar.
   */
  function irAVista(vista = "inicio") {
    if (!VISTAS_PUBLICAS.includes(vista)) return;

    window.history.pushState(null, "", `/#${vista}`);

    setRuta({ vista });
  }

  /**
   * Abre la vista de inicio de sesión.
   */
  function irAIngreso() {
    if (window.location.pathname !== "/ingresar") {
      window.history.pushState(null, "", "/ingresar");
    }

    setRuta({ vista: "ingresar" });
  }

  /**
   * Abre el detalle del evento seleccionado.
   */
  function abrirEvento(evento) {
    if (!evento?.slug) return;

    window.history.pushState(null, "", `/eventos/${encodeURIComponent(evento.slug)}`);

    setRuta({
      vista: "detalle",
      slug: evento.slug,
    });
  }

  /**
   * Conserva la búsqueda y navega a Explorar.
   */
  function buscar(valor = "", ciudad = "", categoria = "", fecha = "") {
    setConsulta(valor);
    setCiudadFiltro(ciudad);
    setCategoriaFiltro(categoria);
    setFechaFiltro(fecha);

    irAVista("explorar");
  }

  /**
   * Solamente el ingreso está disponible en el Sprint 2.
   * Crear cuenta permanece visible, pero no abre otra vista.
   */
  function abrirAuth(modo) {
    if (modo === "ingresar") {
      irAIngreso();
    }
  }

  /**
   * Actualiza el usuario después de POST /sesion.
   * No almacenamos el token que pueda devolver la API.
   */
  function ingresoCorrecto(nuevoUsuario) {
    versionSesion.current += 1;
    setUsuario(nuevoUsuario ?? null);
    setErrorSesion("");

    irAVista("inicio");
  }

  /**
   * Cierra la sesión mediante DELETE /sesion.
   */
  async function manejarCerrarSesion() {
    if (cerrandoSesion) return;

    setCerrandoSesion(true);
    setErrorSesion("");

    try {
      await cerrarSesion();

      versionSesion.current += 1;
      setUsuario(null);
      irAVista("inicio");
    } catch (error) {
      if (error instanceof ErrorApi && error.status === 401) {
        // Si la sesión ya venció, limpiamos igualmente la UI.
        versionSesion.current += 1;
        setUsuario(null);
        irAVista("inicio");
      } else {
        const codigo = error instanceof ErrorApi ? error.codigo : "generico";

        setErrorSesion(datos.textos?.errores?.[codigo] ?? datos.textos?.errores?.generico ?? "");
      }
    } finally {
      setCerrandoSesion(false);
    }
  }

  // Accesibilidad: salta directamente al contenido principal.
  function saltarAlContenido(evento) {
    evento.preventDefault();
    document.getElementById("contenido")?.focus();
  }

  const claseSitio = [
    "sitio",
    activo === "detalle" ? "sitio--detalle" : "",
    esAcceso ? "sitio--acceso" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={claseSitio}>
      {/* Enlace accesible para saltar la navegación */}
      <a className="saltar-contenido" href="#contenido" onClick={saltarAlContenido}>
        {datos.textos?.general?.aria?.saltarAlContenido}
      </a>

      {/* Navbar público */}
      {!esAcceso && (
        <Navbar
          {...datos}
          idioma={idioma}
          cambiarIdioma={setIdioma}
          activo={activo}
          usuario={usuario}
          cerrandoSesion={cerrandoSesion}
          errorSesion={errorSesion}
          onCerrarSesion={manejarCerrarSesion}
          onBuscar={buscar}
          onAbrirAccesibilidad={() => setPanelAccesibilidadAbierto(true)}
          onAbrirAuth={abrirAuth}
        />
      )}

      {/* Vistas del Sprint 2 */}
      <main id="contenido" tabIndex={-1}>
        {esAcceso ? (
          <Acceso
            textos={datos.textos}
            idioma={idioma}
            onIngreso={ingresoCorrecto}
            onInicio={() => irAVista("inicio")}
          />
        ) : activo === "detalle" ? (
          <DetalleEvento
            slug={ruta.slug}
            textos={datos.textos}
            idioma={idioma}
            onVolver={irAVista}
            onVerEvento={abrirEvento}
          />
        ) : activo === "explorar" ? (
          <Explorar
            textos={datos.textos}
            idioma={idioma}
            consulta={consulta}
            ciudadInicial={ciudadFiltro}
            categoriaInicial={categoriaFiltro}
            fechaInicial={fechaFiltro}
            onVerEvento={abrirEvento}
          />
        ) : (
          <Inicio
            textos={datos.textos}
            idioma={idioma}
            onBuscar={buscar}
            onExplorarCategoria={(id) => buscar("", "", id)}
            onVerEvento={abrirEvento}
          />
        )}
      </main>

      {/* Footer público */}
      {!esAcceso && (
        <Footer
          textos={datos.textos}
          onAbrirAccesibilidad={() => setPanelAccesibilidadAbierto(true)}
          onAbrirAuth={abrirAuth}
        />
      )}

      {/* Panel de accesibilidad */}
      {panelAccesibilidadAbierto && (
        <div
          className="accesibilidad-superposicion"
          onClick={() => setPanelAccesibilidadAbierto(false)}
        >
          <div onClick={(evento) => evento.stopPropagation()}>
            <AccessibilityPanel onClose={() => setPanelAccesibilidadAbierto(false)} />
          </div>
        </div>
      )}

      <AvisoCookies textos={datos.textos} idioma={idioma} />
    </div>
  );
}
