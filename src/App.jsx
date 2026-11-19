import { useEffect, useState } from "react";
import { useTextos } from "./hooks/useTextos.js";
import "./App.css";
import Navbar from "./components/NavBar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Inicio from "./Pages/Inicio.jsx";
import Explorar from "./Pages/Explorar.jsx";
import DetalleEvento from "./Pages/DetalleEvento.jsx";
import AccessibilityPanel from "./components/AccessibilityPanel/AccessibilityPanel.jsx";
import ModalAuth from "./components/ModalAuth/ModalAuth.jsx";
import AvisoCookies from "./components/AvisoCookies/AvisoCookies.jsx";
import { leerIdiomaGuardado, guardarIdioma } from "./Utils/preferencias.js";

const VISTAS = ["inicio", "explorar"];

function leerRutaActual() {
  const partes = window.location.pathname.match(/^\/eventos\/([^/]+)\/?$/);
  if (partes) {
    try {
      return { vista: "detalle", slug: decodeURIComponent(partes[1]) };
    } catch {
      return { vista: "detalle", slug: "" };
    }
  }
  const hash = window.location.hash.slice(1);
  return { vista: VISTAS.includes(hash) ? hash : "inicio" };
}

function App() {
  const [idioma, setIdioma] = useState(leerIdiomaGuardado);
  const [ruta, setRuta] = useState(leerRutaActual);
  const [panelAccesibilidadAbierto, setPanelAccesibilidadAbierto] = useState(false);
  const [authModal, setAuthModal] = useState({ abierto: false, modo: "ingresar" });
  const [consulta, setConsulta] = useState("");
  const [ciudadFiltro, setCiudadFiltro] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const datos = useTextos(idioma);
  const activo = ruta.vista;
  const ingles = idioma === "en";

  useEffect(() => {
    function sincronizar() {
      // Navbar y Footer del Sprint 1 usan #inicio y #explorar.
      // Desde /eventos/:slug normalizamos el destino para no conservar el slug anterior.
      const hash = window.location.hash.slice(1);
      if (window.location.pathname.startsWith("/eventos/") && VISTAS.includes(hash)) {
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

  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);
  useEffect(() => {
    guardarIdioma(idioma);
  }, [idioma]);
  useEffect(() => {
    if (activo === "detalle") return;
    const nombre =
      activo === "explorar" ? (ingles ? "Explore" : "Explorar") : ingles ? "Home" : "Inicio";
    document.title = `Taquilla · ${nombre}`;
  }, [activo, ingles]);
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [ruta]);

  function irAVista(vista = "inicio") {
    if (!VISTAS.includes(vista)) return;
    window.history.pushState(null, "", `/#${vista}`);
    setRuta({ vista });
  }

  function abrirEvento(evento) {
    if (!evento?.slug) return;
    window.history.pushState(null, "", `/eventos/${encodeURIComponent(evento.slug)}`);
    setRuta({ vista: "detalle", slug: evento.slug });
  }

  function buscar(valor = "", ciudad = "", categoria = "", fecha = "") {
    setConsulta(valor);
    setCiudadFiltro(ciudad);
    setCategoriaFiltro(categoria);
    setFechaFiltro(fecha);
    irAVista("explorar");
  }

  function saltarAlContenido(evento) {
    evento.preventDefault();
    document.getElementById("contenido")?.focus();
  }

  const abrirAccesibilidad = () => setPanelAccesibilidadAbierto(true);
  const cerrarAccesibilidad = () => setPanelAccesibilidadAbierto(false);
  const abrirAuth = (modo) => setAuthModal({ abierto: true, modo });
  const cerrarAuth = () => setAuthModal((prev) => ({ ...prev, abierto: false }));

  return (
    <div className={`sitio${activo === "detalle" ? " sitio--detalle" : ""}`}>
      <a className="saltar-contenido" href="#contenido" onClick={saltarAlContenido}>
        {datos.textos?.accesibilidad?.saltarContenido ||
          datos.textos?.navbar?.aria?.saltarContenido}
      </a>
      <Navbar
        {...datos}
        idioma={idioma}
        cambiarIdioma={setIdioma}
        activo={activo}
        onBuscar={buscar}
        onAbrirAccesibilidad={abrirAccesibilidad}
        onAbrirAuth={abrirAuth}
      />
      <main id="contenido" tabIndex={-1}>
        {activo === "detalle" ? (
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
      <Footer
        idioma={idioma}
        textos={datos.textos}
        onAbrirAccesibilidad={abrirAccesibilidad}
        onAbrirAuth={abrirAuth}
      />
      {panelAccesibilidadAbierto && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={cerrarAccesibilidad}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <AccessibilityPanel onClose={cerrarAccesibilidad} />
          </div>
        </div>
      )}
      <ModalAuth
        abierto={authModal.abierto}
        modo={authModal.modo}
        idioma={idioma}
        onClose={cerrarAuth}
      />
      <AvisoCookies textos={datos.textos} idioma={idioma} />
    </div>
  );
}

export default App;
