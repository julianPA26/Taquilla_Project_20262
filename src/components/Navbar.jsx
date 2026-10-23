import { useEffect, useRef, useState } from "react";
import Icono from "./Icono.jsx";
import "./Navbar.css";

const DESTINOS = {
  explorar: "/explorar",
  conciertos: "/conciertos",
  teatro: "/teatro",
  deportes: "/deportes",
  festivales: "/festivales",
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
  textoGrande,
  alternarTexto,
}) {
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const botonMenu = useRef(null);
  const campoBusqueda = useRef(null);
  const nav = textos?.navbar;
  const ingles = idioma === "en";
  const abrir =
    textos?.menuMovil.abrir ?? (ingles ? "Open menu" : "Abrir menú");
  const cerrar =
    textos?.menuMovil.cerrar ?? (ingles ? "Close menu" : "Cerrar menú");
  const enlaces = Object.entries(nav?.enlaces ?? {}).filter(
    ([clave]) => DESTINOS[clave],
  );

  let claseNavbar = "navbar";
  if (abierto) {
    claseNavbar = "navbar is-abierto";
  }

  let respaldoIdioma = "Idioma";
  let respaldoAccesibilidad = "Accesibilidad";
  if (ingles) {
    respaldoIdioma = "Language";
    respaldoAccesibilidad = "Accessibility";
  }
  const etiquetaIdioma = textos?.idioma?.tituloMovil ?? respaldoIdioma;
  const etiquetaAccesibilidad =
    textos?.menuMovil?.secciones?.accesibilidad ?? respaldoAccesibilidad;

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

  function abrirBusqueda() {
    setAbierto(true);
    requestAnimationFrame(() => campoBusqueda.current?.focus());
  }

  function buscar(evento) {
    evento.preventDefault();
    const consulta = busqueda.trim();
    if (!consulta) return;
    onBuscar(consulta);
    setAbierto(false);
  }

  return (
    <header className={claseNavbar}>
      <nav
        className="navbar-interior"
        aria-label={nav?.aria.menu ?? "Navegación principal"}
      >
        <a
          className="navbar-marca"
          href="#inicio"
          aria-label={nav?.logo.aria ?? "Inicio"}
          onClick={() => setAbierto(false)}
        >
          <span className="navbar-simbolo" aria-hidden="true">
            <Icono nombre="ticket" />
          </span>
          <span>{nav?.logo.texto ?? "taquilla"}</span>
        </a>

        <div className="navbar-movil-acciones">
          <button
            type="button"
            className="navbar-icono"
            aria-label={nav?.buscador.aria ?? "Buscar"}
            disabled={!nav}
            onClick={abrirBusqueda}
          >
            <Icono nombre="buscar" />
          </button>
          {nav && (
            <a
              className="navbar-icono"
              href="#mis-entradas"
              aria-label={nav.enlaces.misEntradas}
              onClick={() => setAbierto(false)}
            >
              <Icono nombre="ticket" />
            </a>
          )}
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
              <p>
                {ingles
                  ? "Navigation could not be loaded."
                  : "No pudimos cargar el menú."}
              </p>
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
                {/* Solo móvil: en escritorio este enlace va en las utilidades */}
                <li className="navbar-enlace-movil">
                  <a href="#vender" onClick={() => setAbierto(false)}>
                    {nav.enlaces.venderEventos}
                  </a>
                </li>
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
                  ref={campoBusqueda}
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
            {nav && (
              <a
                className="navbar-vender"
                href="#vender"
                onClick={() => setAbierto(false)}
              >
                {nav.enlaces.venderEventos}
              </a>
            )}
            <div className="navbar-ajustes">
              <div className="navbar-fila">
                <span className="navbar-fila-etiqueta">{etiquetaIdioma}</span>
                <div
                  className="navbar-idioma-movil"
                  role="group"
                  aria-label={nav?.aria.idioma ?? "Cambiar idioma"}
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

              {/* Escritorio: selector desplegable de idioma */}
              <label className="navbar-idioma">
                <Icono nombre="idioma" />
                <select
                  value={idioma}
                  onChange={(evento) => cambiarIdioma(evento.target.value)}
                  aria-label={nav?.aria.idioma ?? "Cambiar idioma"}
                >
                  <option value="es">{textos?.idioma?.codigoEs ?? "ES"}</option>
                  <option value="en">{textos?.idioma?.codigoEn ?? "EN"}</option>
                </select>
                <Icono nombre="flechaAbajo" />
              </label>

              <div className="navbar-fila">
                <span className="navbar-fila-etiqueta">
                  {etiquetaAccesibilidad}
                </span>
                <button
                  className="navbar-icono navbar-accesibilidad"
                  type="button"
                  aria-label={
                    nav?.aria.accesibilidad ??
                    (ingles ? "Enlarge text" : "Aumentar texto")
                  }
                  aria-pressed={textoGrande}
                  onClick={alternarTexto}
                >
                  <Icono nombre="accesibilidad" />
                </button>
              </div>
            </div>

            {nav && (
              <div className="navbar-acciones">
                <a
                  className="navbar-accion"
                  href="#ingresar"
                  onClick={() => setAbierto(false)}
                >
                  {nav.botones.ingresar}
                </a>
                <a
                  className="navbar-accion navbar-crear"
                  href="#crear-cuenta"
                  onClick={() => setAbierto(false)}
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