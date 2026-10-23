import { useId, useRef, useState } from "react";
import Icono from "./Icono.jsx";
import "./PreferenciasCookies.css";

const CLAVE = "taquilla-consentimiento";
const CATEGORIAS = [
  { id: "necesarias", titulo: "Necesarias", descripcion: "Sesión, carrito, reserva de asientos y seguridad.", cookies: "sesion · carrito · csrf" },
  { id: "preferencias", titulo: "Preferencias", descripcion: "Idioma, ciudad y opciones de accesibilidad.", cookies: "idioma · ciudad · accesibilidad" },
  { id: "analiticas", titulo: "Analíticas", descripcion: "Medición anónima de visitas para mejorar el sitio.", cookies: "medicion" },
  { id: "marketing", titulo: "Marketing", descripcion: "Recomendaciones de eventos en otros sitios.", cookies: "campanas" },
];

function crearSeleccion(activar = false) {
  return { necesarias: true, preferencias: activar, analiticas: activar, marketing: activar };
}

function leerSeleccion() {
  try {
    const guardada = JSON.parse(localStorage.getItem(CLAVE));
    return Object.fromEntries(CATEGORIAS.map(({ id }) => [id, id === "necesarias" || guardada?.[id] === true]));
  } catch {
    return crearSeleccion();
  }
}

export default function PreferenciasCookies({ onGuardar }) {
  const id = useId();
  const dialogo = useRef(null);
  const disparador = useRef(null);
  const [seleccion, setSeleccion] = useState(crearSeleccion);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  function abrir() {
    setSeleccion(leerSeleccion());
    setError("");
    setMensaje("");
    dialogo.current.showModal();
  }

  function guardar(valores) {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(valores));
    } catch {
      setError("No pudimos guardar tus preferencias en este navegador. Inténtalo de nuevo.");
      return;
    }
    setSeleccion(valores);
    onGuardar?.(valores);
    setMensaje("Preferencias de cookies guardadas.");
    dialogo.current.close();
  }

  return (
    <div className="cookies">
      <button ref={disparador} className="cookies-boton" type="button" onClick={abrir}>
        Preferencias de cookies
      </button>
      <span className="cookies-confirmacion" role="status">{mensaje}</span>
      <dialog
        ref={dialogo}
        className="cookies-dialogo"
        aria-labelledby={`${id}-titulo`}
        aria-describedby={`${id}-descripcion`}
        onClose={() => disparador.current?.focus()}
      >
        <div className="cookies-contenido">
          <header className="cookies-encabezado">
            <h2 id={`${id}-titulo`}>Preferencias de cookies</h2>
            <button className="cookies-cerrar" type="button" aria-label="Cerrar preferencias de cookies" onClick={() => dialogo.current.close()}>
              <Icono nombre="cerrar" />
            </button>
          </header>
          <p id={`${id}-descripcion`} className="cookies-descripcion">
            Elige qué cookies permites. Puedes cambiarlo cuando quieras desde el pie de página.
          </p>
          {CATEGORIAS.map(({ id: categoria, titulo, descripcion, cookies }) => (
            <section className="cookies-categoria" key={categoria} aria-labelledby={`${id}-${categoria}`}>
              <div className="cookies-detalle">
                <h3 id={`${id}-${categoria}`}>{titulo}</h3>
                <p id={`${id}-${categoria}-descripcion`}>{descripcion}</p>
                <small>Cookies: {cookies}</small>
              </div>
              <div className="cookies-control">
                <button
                  className="cookies-interruptor"
                  type="button"
                  role="switch"
                  aria-checked={seleccion[categoria]}
                  aria-labelledby={`${id}-${categoria}`}
                  aria-describedby={`${id}-${categoria}-descripcion`}
                  disabled={categoria === "necesarias"}
                  onClick={() => setSeleccion((actual) => ({ ...actual, [categoria]: !actual[categoria] }))}
                >
                  <span />
                </button>
                {categoria === "necesarias" && <small>Siempre activas</small>}
              </div>
            </section>
          ))}
          {error && <p className="cookies-error" role="alert">{error}</p>}
          <footer className="cookies-acciones">
            <button className="cookies-boton cookies-boton-primario" type="button" onClick={() => guardar(seleccion)}>Guardar selección</button>
            <button className="cookies-boton" type="button" onClick={() => guardar(crearSeleccion())}>Rechazar opcionales</button>
            <button className="cookies-boton" type="button" onClick={() => guardar(crearSeleccion(true))}>Aceptar todas</button>
          </footer>
        </div>
      </dialog>
    </div>
  );
}
