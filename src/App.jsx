/**
 * App.jsx
 *
 * Componente principal de Taquilla.
 *
 * Administra:
 * - Navegación entre vistas.
 * - Preferencias de idioma.
 * - Estado de la sesión.
 * - Búsquedas y filtros iniciales.
 * - Panel de accesibilidad.
 *
 * La estructura visual compartida está
 * separada en LayoutPrincipal.jsx.
 */
import { useEffect, useRef, useState } from "react";
import { useTextos } from "./hooks/useTextos.js";
import { leerIdiomaGuardado, guardarIdioma } from "./Utils/preferencias.js";
import { consultarSesion, cerrarSesion } from "./Api/Sesion.js";
import { ErrorApi } from "./Api/Cliente.js";
import LayoutPrincipal from "./layouts/LayoutPrincipal.jsx";
import Navbar from "./components/NavBar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import AccessibilityPanel from "./components/AccessibilityPanel/AccessibilityPanel.jsx";
import AvisoCookies from "./components/AvisoCookies/AvisoCookies.jsx";
import Inicio from "./Pages/Inicio.jsx";
import Explorar from "./Pages/Explorar.jsx";
import DetalleEvento from "./Pages/DetalleEvento.jsx";
import Acceso from "./Pages/Acceso.jsx";
import "./App.css";
import "./styles/ajustesMovil.css";

const VISTAS_PUBLICAS = ["inicio", "explorar"];
/**
 * Obtiene la vista correspondiente a la URL.
 * Conserva las rutas existentes del Sprint 2.
 */
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

/* ========================================
   COMPONENTE PRINCIPAL
   ======================================== */

export default function App() {
  // Preferencias de idioma y ruta activa.
  const [idioma, setIdioma] = useState(leerIdiomaGuardado);
  const [ruta, setRuta] = useState(leerRutaActual);

  // Estado de autenticación administrado en React.
  const [usuario, setUsuario] = useState(null);
  const [cerrandoSesion, setCerrandoSesion] = useState(false);
  const [errorSesion, setErrorSesion] = useState("");

  // Impide que una consulta antigua sobrescriba un ingreso.
  const versionSesion = useRef(0);

  // Controla el panel de accesibilidad.
  const [panelAccesibilidadAbierto, setPanelAccesibilidadAbierto] = useState(false);

  // Valores utilizados para abrir Explorar con filtros.
  const [consulta, setConsulta] = useState("");
  const [ciudadFiltro, setCiudadFiltro] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");

  // Recupera los textos de la API según el idioma.
  const datos = useTextos(idioma);

  const activo = ruta.vista;
  const esAcceso = activo === "ingresar";

  /* ========================================
     RECUPERACIÓN DE SESIÓN
     ======================================== */

  /**
   * Consulta GET /sesion al cargar la aplicación.
   * La cookie HttpOnly depende del navegador y la API.
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
          if (error instanceof ErrorApi && error.status === 401) {
            // Una respuesta 401 indica que no hay sesión válida.
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

  /* ========================================
     SINCRONIZACIÓN DE RUTAS
     ======================================== */

  /**
   * Mantiene la interfaz sincronizada con los
   * botones Atrás y Adelante del navegador.
   */
  useEffect(() => {
    function sincronizar() {
      const hash = window.location.hash.slice(1);

      if (window.location.pathname !== "/" && VISTAS_PUBLICAS.includes(hash)) {
        window.history.replaceState(null, "", `/#${hash}`);
      }

      setRuta(leerRutaActual());

      // Una navegación externa inicia sin filtros anteriores.
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

  /* ========================================
     PREFERENCIAS Y METADATOS
     ======================================== */

  /**
   * Actualiza el idioma del documento
   * y conserva la preferencia seleccionada.
   */
  useEffect(() => {
    document.documentElement.lang = idioma;
    guardarIdioma(idioma);
  }, [idioma]);

  /**
   * Actualiza el título y descripción del documento
   * utilizando los textos recibidos de la API.
   *
   * El detalle administra sus propios metadatos.
   */
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

  /**
   * Lleva al inicio de la página al cambiar de ruta.
   */
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [ruta]);

  /* ========================================
     FUNCIONES DE NAVEGACIÓN
     ======================================== */

  /**
   * Navega entre Inicio y Explorar.
   */
  function irAVista(vista = "inicio") {
    if (!VISTAS_PUBLICAS.includes(vista)) return;

    window.history.pushState(null, "", `/#${vista}`);

    setRuta({ vista });
  }

  /**
   * Abre la página de inicio de sesión.
   */
  function irAIngreso() {
    if (window.location.pathname !== "/ingresar") {
      window.history.pushState(null, "", "/ingresar");
    }

    setRuta({ vista: "ingresar" });
  }

  /**
   * Navega al detalle del evento seleccionado.
   * Utiliza su slug real.
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
   * Conserva la búsqueda antes de abrir Explorar.
   */
  function buscar(valor = "", ciudad = "", categoria = "", fecha = "") {
    setConsulta(valor);
    setCiudadFiltro(ciudad);
    setCategoriaFiltro(categoria);
    setFechaFiltro(fecha);

    irAVista("explorar");
  }

  /**
   * El Sprint 2 únicamente habilita el ingreso.
   */
  function abrirAuth(modo) {
    if (modo === "ingresar") {
      irAIngreso();
    }
  }

  /* ========================================
     AUTENTICACIÓN
     ======================================== */

  /**
   * Actualiza el estado después de POST /sesion.
   * No almacena tokens en localStorage.
   */
  function ingresoCorrecto(nuevoUsuario) {
    versionSesion.current += 1;

    setUsuario(nuevoUsuario ?? null);
    setErrorSesion("");

    irAVista("inicio");
  }

  /**
   * Solicita DELETE /sesion para cerrar la sesión.
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
        // La sesión ya vencida también se elimina de la UI.
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

  /* ========================================
     CONFIGURACIÓN DEL LAYOUT
     ======================================== */

  /**
   * Conserva las clases que utilizan los estilos
   * del detalle y del formulario de ingreso.
   */
  const claseSitio = [
    "sitio",
    activo === "detalle" ? "sitio--detalle" : "",
    esAcceso ? "sitio--acceso" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <LayoutPrincipal
      claseSitio={claseSitio}
      textoSaltar={datos.textos?.general?.aria?.saltarAlContenido}

      /* Navbar compartido, excepto en Ingresar. */
      encabezado={
        !esAcceso ? (
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
        ) : null
      }

      /* Footer compartido, excepto en Ingresar. */
      pie={
        !esAcceso ? (
          <Footer
            textos={datos.textos}
            onAbrirAccesibilidad={() => setPanelAccesibilidadAbierto(true)}
            onAbrirAuth={abrirAuth}
          />
        ) : null
      }

      /* Elementos independientes de las vistas. */
      adicionales={
        <>
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
        </>
      }
    >
      {/* Contenido de la ruta activa. */}
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
    </LayoutPrincipal>
  );
}
