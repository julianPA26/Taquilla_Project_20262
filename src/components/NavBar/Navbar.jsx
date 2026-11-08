import { useEffect, useRef, useState } from "react";
import Icono from "../Icono/Icono.jsx";
import "./Navbar.css";
import logoNormal from "../../Assets/Logos/logo-normal.svg";
import logoInverso from "../../Assets/Logos/logo-inverso.svg";

const DESTINOS = {
  inicio: "#inicio",
  explorar: "#explorar",
};

export default function Navbar({
  textos,
  cargando,
  error,
  recargar,
  idioma,
  cambiarIdioma,
  activo,
  onBuscar,
  onAbrirAccesibilidad,
  onAbrirAuth,
}) {
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const botonMenu = useRef(null);
  const nav = textos?.navbar;
  const ingles = idioma === "en";
  const abrir = textos?.menuMovil?.abrir ?? (ingles ? "Open menu" : "Abrir menú");
  const cerrar = textos?.menuMovil?.cerrar ?? (ingles ? "Close menu" : "Cerrar menú");

  // "Inicio" no está en navbar.enlaces de la API, se toma de componentes.migas
  const enlaces = [
    ["inicio", textos?.componentes?.migas?.inicio ?? (ingles ? "Home" : "Inicio")],
    ["explorar", nav?.enlaces?.explorar ?? (ingles ? "Explore" : "Explorar")],
  ];

  let claseNavbar = "navbar";
  if (abierto) {
    claseNavbar = "navbar is-abierto";
  }
  if (activo === "inicio") {
    claseNavbar = `${claseNavbar} navbar-oscuro`;
  }

  const etiquetaIdioma = textos?.idioma?.tituloMovil ?? (ingles ? "Language" : "Idioma");
  const etiquetaAccesibilidad =
    textos?.menuMovil?.secciones?.accesibilidad ?? (ingles ? "Accessibility" : "Accesibilidad");
  const textoIngresar = nav?.botones?.ingresar ?? (ingles ? "Log in" : "Ingresar");

  useEffect(() => {
    function cerrarConEscape(evento) {
      if (evento.key === "Escape" && abierto) {
        setAbierto(false);
        botonMenu.current?.focus();
      }
    }
    document.addEventListener("keydown", cerrarConEscape);
    return () => document.removeEventListener("keydown", cerrarConEscape);
  }, [abierto]);

  function buscar(evento) {
    evento.preventDefault();
    const consulta = busqueda.trim();
    if (!consulta) return;
    onBuscar(consulta);
    setAbierto(false);
  }

  return (
    <header className={claseNavbar}>
      <nav className="navbar-interior" aria-label={nav?.aria?.menu ?? "Navegación principal"}>
        <a
          className="navbar-marca"
          href="#inicio"
          aria-label={nav?.logo?.aria ?? "Inicio"}
          onClick={() => setAbierto(false)}
        >
          <img
            className="navbar-logo navbar-logo-normal"
            src={logoNormal}
            alt=""
            width="109"
            height="32"
          />
          <img
            className="navbar-logo navbar-logo-inverso"
            src={logoInverso}
            alt=""
            width="109"
            height="32"
          />
        </a>

        {/* Barra del móvil: buscar (lleva a Explorar), Ingresar y menú */}
        <div className="navbar-movil-acciones">
          <a
            className="navbar-icono"
            href="#explorar"
            aria-label={nav?.buscador?.aria ?? (ingles ? "Search events" : "Buscar eventos")}
            onClick={() => setAbierto(false)}
          >
            <Icono nombre="buscar" />
          </a>
          <a
            className="navbar-movil-ingresar"
            href="#ingresar"
            onClick={(e) => {
              e.preventDefault();
              setAbierto(false);
              onAbrirAuth("ingresar");
            }}
          >
            {textoIngresar}
          </a>
          <button
            ref={botonMenu}
            type="button"
            className="navbar-icono"
            aria-label={abierto ? cerrar : abrir}
            aria-expanded={abierto}
            aria-controls="navbar-panel"
            onClick={() => setAbierto((valor) => !valor)}
          >
            <Icono nombre={abierto ? "cerrar" : "menu"} />
          </button>
        </div>

        <div
          id="navbar-panel"
          className={`navbar-panel${abierto ? " is-abierto" : ""}`}
          aria-busy={cargando}
        >
          {cargando && (
            <p className="navbar-estado" role="status">
              {ingles ? "Loading navigation…" : "Cargando navegación…"}
            </p>
          )}
          {error && (
            <div className="navbar-estado" role="alert">
              <p>{ingles ? "Navigation could not be loaded." : "No pudimos cargar el menú."}</p>
              <button type="button" onClick={recargar}>
                {ingles ? "Try again" : "Reintentar"}
              </button>
            </div>
          )}
          {nav && (
            <>
              <ul className="navbar-enlaces">
                {enlaces.map(([clave, etiqueta]) => (
                  <li key={clave}>
                    <a
                      href={DESTINOS[clave]}
                      aria-current={activo === clave ? "page" : undefined}
                      onClick={() => setAbierto(false)}
                    >
                      {etiqueta}
                    </a>
                  </li>
                ))}
              </ul>
              <form
                className="navbar-buscador"
                role="search"
                aria-label={nav.buscador.aria}
                onSubmit={buscar}
              >
                <button type="submit" aria-label={nav.buscador.aria}>
                  <Icono nombre="buscar" />
                </button>
                <input
                  type="search"
                  value={busqueda}
                  onChange={(evento) => setBusqueda(evento.target.value)}
                  placeholder={nav.buscador.placeholder}
                  aria-label={nav.buscador.aria}
                  required
                />
              </form>
            </>
          )}
          <div className="navbar-utilidades">
            <div className="navbar-ajustes">
              {/* Fila de idioma */}
              <div className="navbar-fila">
                <span className="navbar-fila-etiqueta">{etiquetaIdioma}</span>
                <div
                  className="navbar-idioma-movil"
                  role="group"
                  aria-label={nav?.aria?.idioma ?? "Cambiar idioma"}
                >
                  <button
                    type="button"
                    aria-pressed={idioma === "es"}
                    onClick={() => cambiarIdioma("es")}
                  >
                    {textos?.idioma?.codigoEs ?? "ES"}
                  </button>
                  <button
                    type="button"
                    aria-pressed={idioma === "en"}
                    onClick={() => cambiarIdioma("en")}
                  >
                    {textos?.idioma?.codigoEn ?? "EN"}
                  </button>
                </div>
              </div>

              {/* Fila de accesibilidad */}
              <div className="navbar-fila navbar-fila-accesibilidad">
                <span className="navbar-fila-etiqueta">{etiquetaAccesibilidad}</span>
                <button
                  className="navbar-icono navbar-accesibilidad"
                  type="button"
                  aria-label={ingles ? "Open accessibility panel" : "Abrir panel de accesibilidad"}
                  onClick={() => {
                    onAbrirAccesibilidad();
                    setAbierto(false);
                  }}
                >
                  <Icono nombre="accesibilidad" />
                </button>
              </div>
            </div>

            {nav && (
              <div className="navbar-acciones">
                <a
                  className="navbar-accion navbar-accion-contorno"
                  href="#ingresar"
                  onClick={(e) => {
                    e.preventDefault();
                    setAbierto(false);
                    onAbrirAuth("ingresar");
                  }}
                >
                  {nav.botones.ingresar}
                </a>
                <a
                  className="navbar-accion"
                  href="#crear-cuenta"
                  onClick={(e) => {
                    e.preventDefault();
                    setAbierto(false);
                    onAbrirAuth("crearCuenta");
                  }}
                >
                  {nav.botones.crearCuenta}
                </a>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
