import { useTextos } from "./hooks/useTextos.js";
import "./App.css";
import Navbar from "./components/Navbar/Navbar.jsx";
import { useEffect, useState } from "react";
import Footer from "./components/Footer/Footer.jsx";
import Inicio from "./Pages/Inicio.jsx";
import Explorar from "./Pages/Explorar.jsx";

// Las únicas vistas que existen en este sprint
const VISTAS = ["inicio", "explorar"];

// Lee la vista del # de la dirección. Si el # es de otra cosa (#evento-..., #ingresar...)
// se queda en la vista que ya estaba.
function leerVista(actual = "inicio") {
  const hash = window.location.hash.slice(1);
  return VISTAS.includes(hash) ? hash : actual;
}

function App() {
  // Idioma por defecto español
  const [idioma, setIdioma] = useState("es");
  const [activo, setActivo] = useState(() => leerVista());
  const [textoGrande, setTextoGrande] = useState(false);
  const datos = useTextos(idioma);

  // Lo que se lleva a Explorar desde el buscador, "Ver todos" o las categorías
  const [consulta, setConsulta] = useState("");
  const [ciudadFiltro, setCiudadFiltro] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  const ingles = idioma === "en";

  // Sincroniza la vista con el # de la dirección (botones atrás/adelante y enlaces del navbar)
  useEffect(() => {
    function actualizar() {
      const hash = window.location.hash.slice(1);
      // Los enlaces a #evento-..., #ingresar, etc. no cambian de vista ni borran los filtros
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

  // Aumento de texto (si el navbar tiene ese botón)
  useEffect(() => {
    document.documentElement.style.fontSize = textoGrande ? "112%" : "";
    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [textoGrande]);

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
        textoGrande={textoGrande}
        alternarTexto={() => setTextoGrande((valor) => !valor)}
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

      <Footer idioma={idioma} />
    </>
  );
}

export default App;