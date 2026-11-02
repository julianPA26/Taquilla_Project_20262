import { useTextos } from "./hooks/useTextos.js";
import "./App.css";
import Navbar from "./components/Navbar/Navbar.jsx";
import { useEffect, useState } from "react";
import Footer from "./components/Footer/Footer.jsx";
import Inicio from "./Pages/Inicio.jsx";
import Explorar from "./Pages/Explorar.jsx";
import  {AccessibilityPanel}  from "./components/AccessibilityPanel/AccessibilityPanel.jsx";

// Las únicas vistas que existen en este sprint
const VISTAS = ["inicio", "explorar"];

function leerVista(actual = "inicio") {
  const hash = window.location.hash.slice(1);
  return VISTAS.includes(hash) ? hash : actual;
}

function App() {
  // Idioma por defecto español
  const [idioma, setIdioma] = useState("es");
  const [activo, setActivo] = useState(() => leerVista());

  // ESTADO PARA EL PANEL DE ACCESIBILIDAD
  const [panelAccesibilidadAbierto, setPanelAccesibilidadAbierto] = useState(false);

  const datos = useTextos(idioma);

  // Lo que se lleva a Explorar desde el buscador, "Ver todos" o las categorías
  const [consulta, setConsulta] = useState("");
  const [ciudadFiltro, setCiudadFiltro] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  const ingles = idioma === "en";

  // Sincroniza la vista con el # de la dirección
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

  // Idioma y título de la pestaña
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

  // Al cambiar de vista se vuelve arriba
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [activo]);

  // Lleva a Explorar con una búsqueda, una ciudad o una categoría ya elegidas
  function buscar(valor = "", ciudad = "", categoria = "") {
    setConsulta(valor);
    setCiudadFiltro(ciudad);
    setCategoriaFiltro(categoria);
    setActivo("explorar");
    window.history.replaceState(null, "", "#explorar");
  }

  // Enlace "Saltar al contenido" para quien navega con teclado
  function saltarAlContenido(evento) {
    evento.preventDefault();
    document.getElementById("contenido")?.focus();
  }

  // Abrir y cerrar el panel de accesibilidad
  const abrirAccesibilidad = () => setPanelAccesibilidadAbierto(true);
  const cerrarAccesibilidad = () => setPanelAccesibilidadAbierto(false);

  return (
    <>
      <a className="saltar-contenido" href="#contenido" onClick={saltarAlContenido}>
        {ingles ? "Skip to content" : "Saltar al contenido"}
      </a>

      <Navbar
        {...datos}
        idioma={idioma}
        cambiarIdioma={setIdioma}
        activo={activo}
        onBuscar={buscar}
        onAbrirAccesibilidad={abrirAccesibilidad}
      />

      <main id="contenido" tabIndex={-1}>
        {activo === "explorar" ? (
          <Explorar
            textos={datos.textos}
            idioma={idioma}
            consulta={consulta}
            ciudadInicial={ciudadFiltro}
            categoriaInicial={categoriaFiltro}
          />
        ) : (
          <Inicio
            textos={datos.textos}
            idioma={idioma}
            onBuscar={buscar}
            onExplorarCategoria={(id) => buscar("", "", id)}
          />
        )}
      </main>

      <Footer
        idioma={idioma}
        textos={datos.textos}
        onAbrirAccesibilidad={abrirAccesibilidad}
      />

      {/* Renderizado flotante/modal del panel de accesibilidad */}
      {panelAccesibilidadAbierto && (
        <div
          className="overlay-accesibilidad"
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
    </>
  );
}

export default App;