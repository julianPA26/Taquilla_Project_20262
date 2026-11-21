import { useEffect, useState } from "react";
import { useTextos } from "./hooks/useTextos.js";
import { leerIdiomaGuardado, guardarIdioma } from "./Utils/preferencias.js";
import { textoAcceso } from "./Utils/textosAcceso.js";
import Navbar from "./components/NavBar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Inicio from "./Pages/Inicio.jsx";
import Explorar from "./Pages/Explorar.jsx";
import DetalleEvento from "./Pages/DetalleEvento.jsx";
import Acceso from "./Pages/Acceso.jsx";
import AccessibilityPanel from "./components/AccessibilityPanel/AccessibilityPanel.jsx";
import ModalAuth from "./components/ModalAuth/ModalAuth.jsx";
import AvisoCookies from "./components/AvisoCookies/AvisoCookies.jsx";
import "./App.css";
const VISTAS_PUBLICAS = ["inicio", "explorar"];

function leerRutaActual() {
  const pathname = window.location.pathname;

  if (/^\/ingresar\/?$/.test(pathname)) {
    return { vista: "ingresar" };
  }

  if (/^\/recuperar-clave\/?$/.test(pathname)) {
    return { vista: "recuperar" };
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
  const [idioma, setIdioma] = useState(leerIdiomaGuardado);

  const [ruta, setRuta] = useState(leerRutaActual);

  const [usuario, setUsuario] = useState(null);

  const [panelAccesibilidadAbierto, setPanelAccesibilidadAbierto] = useState(false);

  const [authModal, setAuthModal] = useState({
    abierto: false,
    modo: "ingresar",
  });

  const [consulta, setConsulta] = useState("");
  const [ciudadFiltro, setCiudadFiltro] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");

  const datos = useTextos(idioma);

  const activo = ruta.vista;

  const esAcceso = activo === "ingresar" || activo === "recuperar";

  /* SINCRONIZAR NAVEGACIÓN */

  useEffect(() => {
    function sincronizar() {
      const hash = window.location.hash.slice(1);

      if (window.location.pathname.startsWith("/eventos/") && VISTAS_PUBLICAS.includes(hash)) {
        window.history.replaceState(null, "", `/#${hash}`);
      }

      setRuta(leerRutaActual());

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

  /* IDIOMA */

  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  useEffect(() => {
    guardarIdioma(idioma);
  }, [idioma]);

  /* TÍTULO DEL DOCUMENTO */

  useEffect(() => {
    if (activo === "detalle") return;

    const nombre =
      activo === "ingresar"
        ? textoAcceso(datos.textos, idioma, "titulo")
        : activo === "recuperar"
          ? textoAcceso(datos.textos, idioma, "recuperarTitulo")
          : activo === "explorar"
            ? idioma === "en"
              ? "Explore"
              : "Explorar"
            : idioma === "en"
              ? "Home"
              : "Inicio";

    document.title = `Taquilla · ${nombre}`;
  }, [activo, datos.textos, idioma]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [ruta]);

  /* NAVEGACIÓN PÚBLICA */

  function irAVista(vista = "inicio") {
    if (!VISTAS_PUBLICAS.includes(vista)) {
      return;
    }

    window.history.pushState(null, "", `/#${vista}`);

    setRuta({ vista });
  }

  /* NAVEGACIÓN DE AUTENTICACIÓN */

  function irAAcceso(vista) {
    if (!["ingresar", "recuperar"].includes(vista)) {
      return;
    }

    window.history.pushState(null, "", vista === "ingresar" ? "/ingresar" : "/recuperar-clave");

    setRuta({ vista });
  }

  /* DETALLE DE EVENTO */

  function abrirEvento(evento) {
    if (!evento?.slug) return;

    window.history.pushState(null, "", `/eventos/${encodeURIComponent(evento.slug)}`);

    setRuta({
      vista: "detalle",
      slug: evento.slug,
    });
  }

  /* BUSCADOR */

  function buscar(valor = "", ciudad = "", categoria = "", fecha = "") {
    setConsulta(valor);
    setCiudadFiltro(ciudad);
    setCategoriaFiltro(categoria);
    setFechaFiltro(fecha);

    irAVista("explorar");
  }

  /* AUTENTICACIÓN */

  function abrirAuth(modo) {
    if (modo === "ingresar") {
      irAAcceso("ingresar");
    } else {
      setAuthModal({
        abierto: true,
        modo,
      });
    }
  }

  function saltarAlContenido(evento) {
    evento.preventDefault();

    document.getElementById("contenido")?.focus();
  }

  function ingresoCorrecto(nuevoUsuario) {
    setUsuario(nuevoUsuario ?? null);
    irAVista("inicio");
  }

  return (
    <div
      className={[
        "sitio",
        activo === "detalle" ? "sitio--detalle" : "",
        esAcceso ? "sitio--acceso" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* ACCESIBILIDAD */}

      <a className="saltar-contenido" href="#contenido" onClick={saltarAlContenido}>
        {datos.textos?.accesibilidad?.saltarContenido ||
          datos.textos?.navbar?.aria?.saltarContenido}
      </a>

      {/* NAVEGACIÓN PÚBLICA */}

      {!esAcceso && (
        <Navbar
          {...datos}
          idioma={idioma}
          cambiarIdioma={setIdioma}
          activo={activo}
          usuario={usuario}
          onBuscar={buscar}
          onAbrirAccesibilidad={() => setPanelAccesibilidadAbierto(true)}
          onAbrirAuth={abrirAuth}
        />
      )}

      {/* CONTENIDO PRINCIPAL */}

      <main id="contenido" tabIndex={-1}>
        {esAcceso ? (
          <Acceso
            modo={activo}
            textos={datos.textos}
            idioma={idioma}
            onIngreso={ingresoCorrecto}
            onRecuperar={() => irAAcceso("recuperar")}
            onVolverIngreso={() => irAAcceso("ingresar")}
            onCrearCuenta={() => abrirAuth("crearCuenta")}
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

      {/* FOOTER PÚBLICO */}

      {!esAcceso && (
        <Footer
          idioma={idioma}
          textos={datos.textos}
          onAbrirAccesibilidad={() => setPanelAccesibilidadAbierto(true)}
          onAbrirAuth={abrirAuth}
        />
      )}

      {/* PANEL DE ACCESIBILIDAD */}

      {panelAccesibilidadAbierto && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setPanelAccesibilidadAbierto(false)}
        >
          <div onClick={(evento) => evento.stopPropagation()}>
            <AccessibilityPanel onClose={() => setPanelAccesibilidadAbierto(false)} />
          </div>
        </div>
      )}

      {/* CREAR CUENTA:
          SE CONSERVA EL MODAL PROVISIONAL */}

      <ModalAuth
        abierto={authModal.abierto}
        modo={authModal.modo}
        idioma={idioma}
        onClose={() =>
          setAuthModal((anterior) => ({
            ...anterior,
            abierto: false,
          }))
        }
      />

      <AvisoCookies textos={datos.textos} idioma={idioma} />
    </div>
  );
}
