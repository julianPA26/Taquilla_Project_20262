/**
 * Navbar.jsx
 *
 * Navegación principal de Taquilla.
 *
 * Administra:
 * - Enlaces de Inicio y Explorar.
 * - Buscador de eventos.
 * - Selector de idioma y accesibilidad.
 * - Inicio y cierre de sesión.
 * - Menú responsive de escritorio y móvil.
 *
 * La información de la cuenta se delega a MenuSesion.
 */
import { useEffect, useRef, useState } from "react";
import Icono from "../Icono/Icono.jsx";
import MenuSesion from "./MenuSesion.jsx";
import logoNormal from "../../Assets/Logos/logo-normal.svg";
import logoInverso from "../../Assets/Logos/logo-inverso.svg";
import "./Navbar.css";
import "./NavbarSesion.css";

// Destinos de navegación disponibles en el Sprint 2.
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
  // Estados de navegación móvil y búsqueda.
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  // Permite devolver el foco al botón del menú móvil.
  const botonMenu = useRef(null);

  // Textos procedentes de GET /textos.
  const nav = textos?.navbar;
  const textosMovil = textos?.menuMovil;

  const enlaces = [
    ["inicio", nav?.enlaces?.inicio ?? textos?.componentes?.migas?.inicio],
    ["explorar", nav?.enlaces?.explorar],
  ];

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

    return () => {
      document.removeEventListener("keydown", cerrarConEscape);
    };
  }, [abierto]);

  /**
   * Envía el término buscado a App.jsx.
   */
  function buscar(evento) {
    evento.preventDefault();

    const consulta = busqueda.trim();

    if (!consulta) return;

    onBuscar(consulta);
    setAbierto(false);
  }

  /**
   * Navega al formulario de ingreso.
   */
  function abrirIngreso(evento) {
    evento.preventDefault();
    setAbierto(false);
    onAbrirAuth("ingresar");
  }

  /**
   * Mantiene desactivado el registro del Sprint 3.
   */
  function mantenerRegistroPendiente(evento) {
    evento.preventDefault();
    setAbierto(false);
  }

  /**
   * Cierra el menú móvil y solicita cerrar sesión.
   */
  function salir() {
    setAbierto(false);
    void onCerrarSesion?.();
  }

  return (
    <header className={claseNavbar}>
      <nav className="navbar-interior" aria-label={textos?.sitio?.nombre}>
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

        {/* ENCABEZADO MÓVIL */}

        <div className="navbar-movil-acciones">
          {/* Acceso a la búsqueda */}

          <a
            className="navbar-icono"
            href="#explorar"
            aria-label={nav?.buscador?.aria}
            onClick={() => setAbierto(false)}
          >
            <Icono nombre="buscar" />
          </a>

          {/*
           * Si hay una sesión activa, NO mostramos
           * el nombre del usuario en el encabezado.
           *
           * Su perfil aparecerá dentro del menú móvil.
           */}

          {!usuario && (
            <a className="navbar-movil-ingresar" href="/ingresar" onClick={abrirIngreso}>
              {nav?.botones?.ingresar}
            </a>
          )}

          {/* Botón hamburguesa */}

          <button
            ref={botonMenu}
            type="button"
            className="navbar-icono"
            aria-label={abierto ? textosMovil?.cerrar : textosMovil?.abrir}
            aria-expanded={abierto}
            aria-controls="navbar-panel"
            onClick={() => setAbierto((actual) => !actual)}
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
          {/* ESTADOS DE CARGA Y ERROR */}

          {cargando && (
            <p className="navbar-estado" role="status">
              {textos?.estados?.cargando?.indicador}
            </p>
          )}

          {error && (
            <div className="navbar-estado" role="alert">
              <p>{textos?.estados?.error?.texto}</p>

              <button type="button" onClick={recargar}>
                {textos?.estados?.error?.botones?.reintentar}
              </button>
            </div>
          )}

          {/* ENLACES DE INICIO Y EXPLORAR */}

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

              {/* BUSCADOR DE EVENTOS */}

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

          {/* IDIOMA, ACCESIBILIDAD Y CUENTA */}

          <div className="navbar-utilidades">
            <div className="navbar-ajustes">
              {/* SELECTOR DE IDIOMA */}

              <div className="navbar-fila">
                <span className="navbar-fila-etiqueta">{textos?.idioma?.tituloMovil}</span>

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

              {/* ACCESIBILIDAD */}

              <div className="navbar-fila navbar-fila-accesibilidad">
                <span className="navbar-fila-etiqueta">
                  {textosMovil?.secciones?.accesibilidad}
                </span>

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

            {/* CUENTA DEL USUARIO */}

            {nav && (
              <div className="navbar-acciones">
                {usuario ? (
                  /*
                   * El mismo componente muestra:
                   *
                   * Escritorio: avatar con desplegable.
                   * Móvil: perfil y botón de salida.
                   */
                  <MenuSesion
                    usuario={usuario}
                    textos={textos}
                    cerrandoSesion={cerrandoSesion}
                    errorSesion={errorSesion}
                    onCerrarSesion={salir}
                  />
                ) : (
                  <>
                    {/* INICIAR SESIÓN */}

                    <a
                      className="navbar-accion navbar-accion-contorno"
                      href="/ingresar"
                      onClick={abrirIngreso}
                    >
                      {nav.botones.ingresar}
                    </a>

                    {/* REGISTRO PENDIENTE DEL SPRINT 3 */}

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
