/**
 * Navbar.jsx
 *
 * Navegación principal de Taquilla.
 * Muestra las opciones públicas, el buscador,
 * los controles de idioma y el estado de sesión.
 *
 * Cuando hay un usuario autenticado, sustituye
 * los botones de ingreso por su menú de cuenta.
 */

import { useEffect, useRef, useState } from "react";
import Icono from "../Icono/Icono.jsx";
import logoNormal from "../../Assets/Logos/logo-normal.svg";
import logoInverso from "../../Assets/Logos/logo-inverso.svg";
import "./Navbar.css";
import "./NavbarSesion.css";

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
  usuario,
  cerrandoSesion,
  errorSesion,
  onCerrarSesion,
  onBuscar,
  onAbrirAccesibilidad,
  onAbrirAuth,
}) {
  // Estados del menú móvil y del buscador.
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const botonMenu = useRef(null);

  // Textos de navegación provenientes de la API.
  const nav = textos?.navbar;
  const textosMovil = textos?.menuMovil;
  const ingles = idioma === "en";

  const abrirMenu = textosMovil?.abrir;
  const cerrarMenu = textosMovil?.cerrar;

  const enlaces = [
    ["inicio", nav?.enlaces?.inicio ?? textos?.componentes?.migas?.inicio],
    ["explorar", nav?.enlaces?.explorar],
  ];

  const etiquetaIdioma = textos?.idioma?.tituloMovil;

  const etiquetaAccesibilidad = textosMovil?.secciones?.accesibilidad;

  const textoIngresar = nav?.botones?.ingresar;

  // El nombre visible proviene de GET /sesion.
  const nombreUsuario = usuario?.nombre ?? usuario?.correo ?? nav?.usuario?.panel ?? "";

  const etiquetaMenuUsuario = nav?.usuario?.menu?.replace("{nombre}", nombreUsuario);

  // Aplica las clases del Navbar según la vista actual.
  const claseNavbar = [
    "navbar",
    abierto ? "is-abierto" : "",
    activo === "inicio" ? "navbar-oscuro" : "",
  ]
    .filter(Boolean)
    .join(" ");

  /**
   * Permite cerrar el menú móvil con Escape.
   */
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

  /**
   * Envía la búsqueda a App.jsx para abrir Explorar.
   */
  function buscar(evento) {
    evento.preventDefault();

    const consulta = busqueda.trim();

    if (!consulta) return;

    onBuscar(consulta);
    setAbierto(false);
  }

  /**
   * Abre el formulario de ingreso y cierra el menú móvil.
   */
  function abrirIngreso(evento) {
    evento.preventDefault();
    setAbierto(false);
    onAbrirAuth("ingresar");
  }

  /**
   * Mantiene visible Crear cuenta sin navegar al Sprint 3.
   */
  function mantenerRegistroPendiente(evento) {
    evento.preventDefault();
    setAbierto(false);
  }

  /**
   * Solicita cerrar sesión y cierra el menú móvil.
   */
  function salir() {
    setAbierto(false);
    void onCerrarSesion?.();
  }

  return (
    <header className={claseNavbar}>
      <nav
        className="navbar-interior"
        aria-label={nav?.aria?.menu ?? (ingles ? "Main navigation" : "Navegación principal")}
      >
        {/* LOGOTIPO */}

        <a
          className="navbar-marca"
          href="#inicio"
          aria-label={nav?.logo?.aria}
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

        {/* ACCIONES VISIBLES EN MÓVIL */}

        <div className="navbar-movil-acciones">
          <a
            className="navbar-icono"
            href="#explorar"
            aria-label={nav?.buscador?.aria}
            onClick={() => setAbierto(false)}
          >
            <Icono nombre="buscar" />
          </a>

          {usuario ? (
            <span
              className="navbar-movil-ingresar navbar-sesion__nombre-movil"
              title={nombreUsuario}
            >
              {nombreUsuario}
            </span>
          ) : (
            <a className="navbar-movil-ingresar" href="/ingresar" onClick={abrirIngreso}>
              {textoIngresar}
            </a>
          )}

          <button
            ref={botonMenu}
            type="button"
            className="navbar-icono"
            aria-label={abierto ? cerrarMenu : abrirMenu}
            aria-expanded={abierto}
            aria-controls="navbar-panel"
            onClick={() => setAbierto((valor) => !valor)}
          >
            <Icono nombre={abierto ? "cerrar" : "menu"} />
          </button>
        </div>

        {/* PANEL DE NAVEGACIÓN */}

        <div
          id="navbar-panel"
          className={`navbar-panel${abierto ? " is-abierto" : ""}`}
          aria-busy={cargando}
        >
          {/* Estados de carga de los textos */}

          {cargando && (
            <p className="navbar-estado" role="status">
              {textos?.estados?.cargando?.indicador ??
                (ingles ? "Loading navigation…" : "Cargando navegación…")}
            </p>
          )}

          {error && (
            <div className="navbar-estado" role="alert">
              <p>
                {textos?.estados?.error?.texto ??
                  (ingles ? "Navigation could not be loaded." : "No pudimos cargar el menú.")}
              </p>

              <button type="button" onClick={recargar}>
                {textos?.estados?.error?.botones?.reintentar ??
                  (ingles ? "Try again" : "Reintentar")}
              </button>
            </div>
          )}

          {nav && (
            <>
              {/* ENLACES PRINCIPALES */}

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

              {/* BUSCADOR */}

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

          {/* IDIOMA Y ACCESIBILIDAD */}

          <div className="navbar-utilidades">
            <div className="navbar-ajustes">
              <div className="navbar-fila">
                <span className="navbar-fila-etiqueta">{etiquetaIdioma}</span>

                <div className="navbar-idioma-movil" role="group" aria-label={nav?.aria?.idioma}>
                  <button
                    type="button"
                    aria-pressed={idioma === "es"}
                    onClick={() => cambiarIdioma("es")}
                  >
                    {textos?.idioma?.codigoEs}
                  </button>

                  <button
                    type="button"
                    aria-pressed={idioma === "en"}
                    onClick={() => cambiarIdioma("en")}
                  >
                    {textos?.idioma?.codigoEn}
                  </button>
                </div>
              </div>

              <div className="navbar-fila navbar-fila-accesibilidad">
                <span className="navbar-fila-etiqueta">{etiquetaAccesibilidad}</span>

                <button
                  className="navbar-icono navbar-accesibilidad"
                  type="button"
                  aria-label={nav?.aria?.accesibilidad}
                  onClick={() => {
                    onAbrirAccesibilidad();
                    setAbierto(false);
                  }}
                >
                  <Icono nombre="accesibilidad" />
                </button>
              </div>
            </div>

            {/* ESTADO DE LA CUENTA */}

            {nav && (
              <div className="navbar-acciones">
                {usuario ? (
                  <details className="navbar-sesion">
                    <summary aria-label={etiquetaMenuUsuario}>
                      <span className="navbar-sesion__nombre" title={nombreUsuario}>
                        {nombreUsuario}
                      </span>

                      <span aria-hidden="true">▾</span>
                    </summary>

                    <div className="navbar-sesion__panel">
                      <button
                        type="button"
                        className="navbar-sesion__salir"
                        disabled={cerrandoSesion}
                        onClick={salir}
                      >
                        {nav.usuario.cerrarSesion}
                      </button>

                      {errorSesion && (
                        <p className="navbar-sesion__error" role="alert">
                          {errorSesion}
                        </p>
                      )}
                    </div>
                  </details>
                ) : (
                  <>
                    <a
                      className="navbar-accion navbar-accion-contorno"
                      href="/ingresar"
                      onClick={abrirIngreso}
                    >
                      {nav.botones.ingresar}
                    </a>

                    {/* Sprint 3: enlace visible sin navegación */}
                    <a
                      className="navbar-accion"
                      href="#crear-cuenta"
                      aria-disabled="true"
                      onClick={mantenerRegistroPendiente}
                    >
                      {nav.botones.crearCuenta}
                    </a>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
