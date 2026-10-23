import { useTextos } from "./hooks/useTextos.js";
import "./App.css";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import PreferenciasCookies from "./components/PreferenciasCookies.jsx";

function leerSeccion() {
  return window.location.hash.slice(1) || "explorar";
}

function App() {
  // Idioma por defecto español
  const [idioma, setIdioma] = useState("es");
  const [activo, setActivo] = useState(leerSeccion);
  const [consulta, setConsulta] = useState("");
  const [textoGrande, setTextoGrande] = useState(false);
  const datos = useTextos(idioma);

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

  function buscar(valor) {
    setConsulta(valor);
    setActivo("explorar");
    //window.history es el que da acceso al historial de la pestaña
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
      <main className="Contenedor demo-contenido">
        <p>{ingles ? "English content" : "Contenido en español"}</p>
        <h1>{titulo ?? (ingles ? "Navigation" : "Navegación")}</h1>
        <p role="status">
          {consulta
            ? `${ingles ? "Search submitted" : "Búsqueda enviada"}: ${consulta}`
            : ingles
              ? "Select a link"
              : "Selecciona un enlace"}
        </p>
        <p>
          {ingles
            ? "This example loads navigation texts"
            : "Este ejemplo carga los textos del menú desde la API"}
        </p>
      </main>

      <footer className="pie-pagina">
        <div className="contenedor">
          <PreferenciasCookies />
        </div>
      </footer>
    </>
  );
}

export default App;