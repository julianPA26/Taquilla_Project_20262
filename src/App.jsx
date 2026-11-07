import { useTextos } from "./hooks/useTextos.js";
import "./App.css";
import Navbar from "./components/NavBar/Navbar.jsx";
import { useEffect, useState } from "react";
import Footer from "./components/Footer/Footer.jsx";
import Inicio from "./Pages/Inicio.jsx";
import Explorar from "./Pages/Explorar.jsx";
import  AccessibilityPanel  from "./components/AccessibilityPanel/AccessibilityPanel.jsx";
import ModalEvento from "./components/ModalEvent/ModalEvent.jsx";
import ModalAuth from "./components/ModalAuth/ModalAuth.jsx"; 
import AvisoCookies from "./components/AvisoCookies/AvisoCookies.jsx";

const VISTAS = ["inicio", "explorar"];

function leerVista(actual = "inicio") {
  const hash = window.location.hash.slice(1);
  return VISTAS.includes(hash) ? hash : actual;
}

function App() {
  const [idioma, setIdioma] = useState("es");
  const [activo, setActivo] = useState(() => leerVista());
  const [panelAccesibilidadAbierto, setPanelAccesibilidadAbierto] = useState(false);

  // ESTADO PARA EL EVENTO SELECCIONADO PARA EL MODAL
  const [eventoModal, setEventoModal] = useState(null);

  // 2. ESTADO PARA EL MODAL DE AUTENTICACIÓN
  const [authModal, setAuthModal] = useState({ abierto: false, modo: "ingresar" });

  const datos = useTextos(idioma);

  const [consulta, setConsulta] = useState("");
  const [ciudadFiltro, setCiudadFiltro] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  const ingles = idioma === "en";

  useEffect(() => {
    function actualizar() {
      const hash = window.location.hash.slice(1);
      if (!VISTAS.includes(hash)) return;
      setActivo(hash);
      setConsulta("");
      setCiudadFiltro("");
      setCategoriaFiltro("");
    }
    window.addEventListener("hashchange", actualizar);
    return () => window.removeEventListener("hashchange", actualizar);
  }, []);

  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  useEffect(() => {
    const nombre =
      activo === "explorar"
        ? ingles ? "Explore" : "Explorar"
        : ingles ? "Home" : "Inicio";
    document.title = `Taquilla · ${nombre}`;
  }, [activo, ingles]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [activo]);

  function buscar(valor = "", ciudad = "", categoria = "") {
    setConsulta(valor);
    setCiudadFiltro(ciudad);
    setCategoriaFiltro(categoria);
    setActivo("explorar");
    window.history.replaceState(null, "", "#explorar");
  }

  function saltarAlContenido(evento) {
    evento.preventDefault();
    document.getElementById("contenido")?.focus();
  }

  const abrirAccesibilidad = () => setPanelAccesibilidadAbierto(true);
  const cerrarAccesibilidad = () => setPanelAccesibilidadAbierto(false);

  // FUNCIONES PARA ABRIR Y CERRAR EL MODAL DE INICIAR SESIÓN / CREAR CUENTA
  const abrirAuth = (modo) => setAuthModal({ abierto: true, modo });
  const cerrarAuth = () => setAuthModal((prev) => ({ ...prev, abierto: false }));

  return (
    <>
      <a className="saltar-contenido" href="#contenido" onClick={saltarAlContenido}>
        {ingles ? "Skip to content" : "Saltar al contenido"}
      </a>

      {/* 3. PROP onAbrirAuth AGREGADA AL NAVBAR */}
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
        {activo === "explorar" ? (
          <Explorar
            textos={datos.textos}
            idioma={idioma}
            consulta={consulta}
            ciudadInicial={ciudadFiltro}
            categoriaInicial={categoriaFiltro}
            onVerEvento={(evento) => setEventoModal(evento)}
          />
        ) : (
          <Inicio
            textos={datos.textos}
            idioma={idioma}
            onBuscar={buscar}
            onExplorarCategoria={(id) => buscar("", "", id)}
            onVerEvento={(evento) => setEventoModal(evento)}
          />
        )}
      </main>

      <Footer
        idioma={idioma}
        textos={datos.textos}
        onAbrirAccesibilidad={abrirAccesibilidad}
        onAbrirAuth={abrirAuth}
      />

      {/* Modal de Accesibilidad */}
      {panelAccesibilidadAbierto && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={cerrarAccesibilidad}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <AccessibilityPanel onClose={cerrarAccesibilidad} />
          </div>
        </div>
      )}

      {eventoModal && (
        <ModalEvento
          evento={eventoModal}
          textos={datos.textos}
          idioma={idioma}
          onClose={() => setEventoModal(null)}
        />
      )}

      
      <ModalAuth
        abierto={authModal.abierto}
        modo={authModal.modo}
        idioma={idioma}
        onClose={cerrarAuth}
      />
      
      <AvisoCookies idioma={idioma} />
    </>
  );
}

export default App;