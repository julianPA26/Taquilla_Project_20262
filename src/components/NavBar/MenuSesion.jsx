/**
 * MenuSesion.jsx
 *
 * Muestra la información del usuario autenticado.
 *
 * Escritorio: avatar circular con menú desplegable.
 * Móvil: perfil y botón de salida al final del menú.
 *
 * Los datos y las etiquetas provienen de la API.
 */

import { useEffect, useRef } from "react";

// Obtiene las iniciales del nombre del usuario.
function obtenerIniciales(nombre) {
  const partes = String(nombre ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (partes.length === 0) return "";

  if (partes.length === 1) {
    return partes[0].slice(0, 2).toLocaleUpperCase();
  }

  return (partes[0][0] + partes[partes.length - 1][0]).toLocaleUpperCase();
}

// Icono de salida utilizado en el menú de escritorio.
function IconoSalir() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" />
      <path d="m14 16 4-4-4-4" />
      <path d="M18 12H9" />
    </svg>
  );
}

/**
 * Información reutilizable del perfil.
 * Se muestra tanto en escritorio como en móvil.
 */
function PerfilCuenta({ nombre, correo, iniciales }) {
  return (
    <div className="navbar-sesion__perfil">
      <span className="navbar-sesion__avatar navbar-sesion__avatar--perfil" aria-hidden="true">
        {iniciales}
      </span>

      <div className="navbar-sesion__datos">
        <strong className="navbar-sesion__nombre-completo">{nombre}</strong>

        {correo && <span className="navbar-sesion__correo">{correo}</span>}
      </div>
    </div>
  );
}

/**
 * Botón reutilizable para cerrar la sesión.
 * El icono se muestra en escritorio y se oculta en móvil.
 */
function BotonCerrarSesion({ etiqueta, deshabilitado, onClick }) {
  return (
    <button
      type="button"
      className="navbar-sesion__salir"
      disabled={deshabilitado}
      onClick={onClick}
    >
      <IconoSalir />
      <span>{etiqueta}</span>
    </button>
  );
}

export default function MenuSesion({
  usuario,
  textos,
  cerrandoSesion = false,
  errorSesion = "",
  onCerrarSesion,
}) {
  // Referencia del desplegable de escritorio.
  const menuRef = useRef(null);

  // Datos reales obtenidos de GET /sesion.
  const correo = String(usuario?.correo ?? "").trim();

  const nombre = String(usuario?.nombre ?? correo.split("@")[0] ?? "").trim();

  const iniciales = obtenerIniciales(nombre);

  // Etiquetas procedentes de GET /textos.
  const textosCuenta = textos?.navbar?.usuario;

  const etiquetaMenu = textosCuenta?.menu?.replace("{nombre}", nombre);

  const etiquetaSalir = textosCuenta?.cerrarSesion;

  /**
   * Cierra el desplegable de escritorio al pulsar
   * fuera de él o presionar Escape.
   */
  useEffect(() => {
    function cerrarFuera(evento) {
      const menu = menuRef.current;

      if (menu?.open && !menu.contains(evento.target)) {
        menu.open = false;
      }
    }

    function cerrarEscape(evento) {
      if (evento.key === "Escape" && menuRef.current?.open) {
        menuRef.current.open = false;

        menuRef.current.querySelector("summary")?.focus();
      }
    }

    document.addEventListener("pointerdown", cerrarFuera);

    document.addEventListener("keydown", cerrarEscape);

    return () => {
      document.removeEventListener("pointerdown", cerrarFuera);

      document.removeEventListener("keydown", cerrarEscape);
    };
  }, []);

  /**
   * Ejecuta el cierre de sesión del componente padre.
   */
  function manejarSalida() {
    if (cerrandoSesion) return;

    if (menuRef.current) {
      menuRef.current.open = false;
    }

    onCerrarSesion?.();
  }

  return (
    <>
      {/* ESCRITORIO: AVATAR Y MENÚ DESPLEGABLE */}

      <details ref={menuRef} className="navbar-sesion navbar-sesion--escritorio">
        <summary aria-label={etiquetaMenu} title={nombre}>
          <span className="navbar-sesion__avatar navbar-sesion__avatar--boton" aria-hidden="true">
            {iniciales}
          </span>
        </summary>

        <div className="navbar-sesion__panel">
          <PerfilCuenta nombre={nombre} correo={correo} iniciales={iniciales} />

          <div className="navbar-sesion__separador" role="separator" />

          <BotonCerrarSesion
            etiqueta={etiquetaSalir}
            deshabilitado={cerrandoSesion}
            onClick={manejarSalida}
          />

          {errorSesion && (
            <p className="navbar-sesion__error" role="alert">
              {errorSesion}
            </p>
          )}
        </div>
      </details>

      {/* MÓVIL: PERFIL VISIBLE SIN DESPLEGABLE */}

      <div className="navbar-sesion-movil">
        <PerfilCuenta nombre={nombre} correo={correo} iniciales={iniciales} />

        <BotonCerrarSesion
          etiqueta={etiquetaSalir}
          deshabilitado={cerrandoSesion}
          onClick={manejarSalida}
        />

        {errorSesion && (
          <p className="navbar-sesion__error" role="alert">
            {errorSesion}
          </p>
        )}
      </div>
    </>
  );
}
