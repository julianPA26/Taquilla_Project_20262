import { useTextos } from "./hooks/useTextos.js";
import "./App.css";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import PreferenciasCookies from "./components/PreferenciasCookies.jsx";
import Footer from "./components/Footer";
import Inicio from "./Pages/Inicio.jsx";
import Explorar from "./Pages/Explorar.jsx";


function leerSeccion() {
  return window.location.hash.slice(1) || "inicio";
}

function App() {
  // Idioma por defecto español
  const [idioma, setIdioma] = useState("es");
  const [activo, setActivo] = useState(leerSeccion);
  const [consulta, setConsulta] = useState("");
  const [textoGrande, setTextoGrande] = useState(false);
  const datos = useTextos(idioma);
  const [ciudadFiltro, setCiudadFiltro] = useState("");


  const ingles = idioma === "en";
  const titulo =
    datos.textos?.navbar.enlaces[activo] ??
    datos.textos?.navbar.botones[activo];


  //Va a sincronizar el estado del componente con el hash de la URL
  useEffect(() => {
    function actualizar() {
      setActivo(leerSeccion());
      setConsulta("");
    }
    window.addEventListener("hashchange", actualizar);
    return () => window.removeEventListener("hashchange", actualizar);
  }, []);

  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  useEffect(() => {
    document.documentElement.style.fontSize = textoGrande ? "112%" : "";
    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [textoGrande]);


  function buscar(valor, ciudad = "") {
    setConsulta(valor);
    setCiudadFiltro(ciudad);
    setActivo("explorar");
    window.history.replaceState(null, "", "#explorar");
  }

  return (
    <>
      <Navbar
        {...datos}
        idioma={idioma}
        cambiarIdioma={setIdioma}
        activo={activo}
        onBuscar={buscar}
        textoGrande={textoGrande}
        alternarTexto={() => setTextoGrande((valor) => !valor)}
      />
      <main>
        {activo === "explorar" ? (
          <Explorar
            textos={datos.textos}
            idioma={idioma}
            consulta={consulta}
            ciudadInicial={ciudadFiltro}
          />
        ) : (
          <Inicio textos={datos.textos} idioma={idioma} onBuscar={buscar} />
        )}
      </main>
      <Footer idioma={idioma} />
    </>
  );
}

export default App;