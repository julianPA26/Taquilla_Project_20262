/**
 * FormularioIngreso.jsx
 *
 * Gestiona el formulario de inicio de sesión:
 * - Validaciones de correo y contraseña.
 * - Mostrar y ocultar contraseña.
 * - Comunicación con la API.
 * - Estados de carga, errores y reintento.
 * - Bloqueo temporal por demasiados intentos.
 *
 * Los enlaces del Sprint 3 son interactivos,
 * pero mantienen al usuario en la misma pantalla.
 */

import { useEffect, useRef, useState } from "react";

import { ErrorApi } from "../../Api/Cliente.js";
import { iniciarSesion } from "../../Api/Sesion.js";

import { mensajeError, textoAcceso } from "../../Utils/textosAcceso.js";

// Icono para mostrar u ocultar la contraseña.
function Ojo({ visible }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 12s3.4-5.5 9.5-5.5 9.5 5.5 9.5 5.5-3.4 5.5-9.5 5.5S2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.5" />
      {visible && <path d="M3 3 21 21" />}
    </svg>
  );
}

export default function FormularioIngreso({ textos, idioma, onIngreso }) {
  // Obtiene las etiquetas y los mensajes desde GET /textos.
  const t = (nombre) => textoAcceso(textos, idioma, nombre);

  // Estados de los campos del formulario.
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [recordar, setRecordar] = useState(true);
  const [visible, setVisible] = useState(false);

  // Estados de validación y comunicación con la API.
  const [erroresCampos, setErroresCampos] = useState({});
  const [errorCodigo, setErrorCodigo] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Estados para controlar el bloqueo de intentos.
  const [bloqueoHasta, setBloqueoHasta] = useState(0);
  const [segundosRestantes, setSegundosRestantes] = useState(0);

  // Referencias para manejar el foco y evitar envíos dobles.
  const correoRef = useRef(null);
  const claveRef = useRef(null);
  const envioEnCurso = useRef(false);

  const bloqueado = segundosRestantes > 0;

  /**
   * Actualiza el tiempo restante cuando la API
   * devuelve un error de demasiados intentos.
   */
  useEffect(() => {
    if (!bloqueoHasta) return;

    function actualizar() {
      const restantes = Math.max(0, Math.ceil((bloqueoHasta - Date.now()) / 1000));

      setSegundosRestantes(restantes);
    }

    actualizar();

    const intervalo = window.setInterval(actualizar, 250);

    return () => window.clearInterval(intervalo);
  }, [bloqueoHasta]);

  /**
   * Actualiza los campos y limpia los errores
   * cuando el usuario vuelve a escribir.
   */
  function actualizarCampo(campo, valor) {
    if (campo === "correo") {
      setCorreo(valor);
    }

    if (campo === "clave") {
      setClave(valor);
    }

    setErroresCampos((actual) => ({
      ...actual,
      [campo]: "",
    }));

    setErrorCodigo("");
  }

  /**
   * Mantiene activos los enlaces del Sprint 3
   * sin abandonar la página de inicio de sesión.
   *
   * Cuando implementemos el Sprint 3, podremos
   * retirar esta función y utilizar sus rutas reales.
   */
  function mantenerEnIngreso(evento) {
    evento.preventDefault();
  }

  /**
   * Valida los datos e intenta iniciar sesión.
   * También gestiona las respuestas de error.
   */
  async function enviar() {
    if (envioEnCurso.current || bloqueado) return;

    const nuevosErrores = {};

    // Valida el correo electrónico.
    if (!correo.trim()) {
      nuevosErrores.correo = t("correoObligatorio");
    } else if (!correoRef.current?.validity.valid) {
      nuevosErrores.correo = t("correoInvalido");
    }

    // Valida que la contraseña no esté vacía.
    if (!clave) {
      nuevosErrores.clave = t("claveObligatoria");
    }

    // Muestra los errores y enfoca el primer campo inválido.
    if (Object.keys(nuevosErrores).length > 0) {
      setErroresCampos(nuevosErrores);
      setErrorCodigo("validacion");

      const primerCampo = nuevosErrores.correo ? correoRef : claveRef;

      primerCampo.current?.focus();
      return;
    }

    // Evita enviar las credenciales más de una vez.
    envioEnCurso.current = true;
    setEnviando(true);
    setErrorCodigo("");

    try {
      const datos = await iniciarSesion(correo.trim(), clave);

      // La API administra la sesión mediante cookies.
      // No guardamos tokens en localStorage.
      onIngreso(datos.usuario);
    } catch (error) {
      if (error instanceof ErrorApi) {
        setErrorCodigo(error.codigo || "error_interno");

        // Procesa los errores de validación del servidor.
        if (error.codigo === "validacion") {
          const campos = error.campos || {};

          setErroresCampos(campos);

          const primerCampo = campos.correo ? correoRef : claveRef;

          primerCampo.current?.focus();
        }

        // Respeta el tiempo de espera enviado por la API.
        if (error.status === 429) {
          const segundos = Math.max(0, Number(error.retryAfter) || 0);

          setBloqueoHasta(Date.now() + segundos * 1000);

          setSegundosRestantes(Math.ceil(segundos));
        }
      } else {
        // Conserva los datos si ocurre un error de conexión.
        setErrorCodigo("conexion");
      }
    } finally {
      envioEnCurso.current = false;
      setEnviando(false);
    }
  }

  // Evita que el navegador recargue al enviar el formulario.
  function manejarEnvio(evento) {
    evento.preventDefault();
    void enviar();
  }

  // Obtiene los mensajes de error desde GET /textos.
  const erroresIngreso = textos?.paginas?.ingresar?.errores;

  const tituloAlerta =
    errorCodigo === "validacion"
      ? erroresIngreso?.camposObligatorios?.titulo
      : errorCodigo === "credenciales_invalidas"
        ? erroresIngreso?.credenciales?.titulo
        : errorCodigo === "conexion"
          ? erroresIngreso?.conexion?.titulo
          : errorCodigo === "demasiadas_peticiones"
            ? erroresIngreso?.demasiadosIntentos?.titulo
            : "";

  const textoAlerta = errorCodigo
    ? mensajeError(textos, idioma, errorCodigo, { segundos: segundosRestantes })
    : "";

  // Cambia el texto del botón si necesitamos reintentar.
  const textoBoton = enviando
    ? t("ingresando")
    : errorCodigo === "conexion"
      ? t("reintentar")
      : t("ingresar");

  // Relaciona los mensajes de error con sus campos.
  const idCorreoError = erroresCampos.correo ? "ingreso-correo-error" : undefined;

  const idClaveError = erroresCampos.clave ? "ingreso-clave-error" : undefined;

  return (
    <div className="acceso-formulario">
      {/* ENCABEZADO */}

      <h1>{t("titulo")}</h1>

      <p className="acceso-formulario__introduccion">{t("descripcion")}</p>

      {/* MENSAJES DE ERROR */}

      {errorCodigo && (
        <div className="acceso-aviso" role="alert">
          <span className="acceso-aviso__icono" aria-hidden="true">
            !
          </span>

          <div className="acceso-aviso__contenido">
            {tituloAlerta && <strong>{tituloAlerta}</strong>}

            {textoAlerta && <p>{textoAlerta}</p>}
          </div>
        </div>
      )}

      {/* FORMULARIO */}

      <form noValidate onSubmit={manejarEnvio} aria-busy={enviando}>
        <fieldset className="acceso-fieldset" disabled={enviando || bloqueado}>
          {/* CORREO ELECTRÓNICO */}

          <div className="acceso-campo">
            <label htmlFor="ingreso-correo">{t("correo")}</label>

            <input
              ref={correoRef}
              id="ingreso-correo"
              type="email"
              autoComplete="username"
              inputMode="email"
              placeholder={t("correoPlaceholder")}
              value={correo}
              aria-invalid={Boolean(erroresCampos.correo)}
              aria-describedby={idCorreoError}
              onChange={(evento) => actualizarCampo("correo", evento.target.value)}
            />

            {erroresCampos.correo && (
              <small id={idCorreoError} className="acceso-campo__error">
                {erroresCampos.correo}
              </small>
            )}
          </div>

          {/* CONTRASEÑA */}

          <div className="acceso-campo">
            <label htmlFor="ingreso-clave">{t("clave")}</label>

            <div className="acceso-campo__con-ojo">
              <input
                ref={claveRef}
                id="ingreso-clave"
                type={visible ? "text" : "password"}
                autoComplete="current-password"
                value={clave}
                aria-invalid={Boolean(erroresCampos.clave)}
                aria-describedby={idClaveError}
                onChange={(evento) => actualizarCampo("clave", evento.target.value)}
              />

              <button
                type="button"
                className="acceso-campo__ojo"
                aria-label={visible ? t("ocultarClave") : t("mostrarClave")}
                aria-pressed={visible}
                onClick={() => setVisible((actual) => !actual)}
              >
                <Ojo visible={visible} />
              </button>
            </div>

            {erroresCampos.clave && (
              <small id={idClaveError} className="acceso-campo__error">
                {erroresCampos.clave}
              </small>
            )}
          </div>

          {/* OPCIONES DEL FORMULARIO */}

          <div className="acceso-formulario__opciones">
            <label className="acceso-checkbox">
              <input
                type="checkbox"
                checked={recordar}
                onChange={(evento) => setRecordar(evento.target.checked)}
              />

              <span>{t("recordar")}</span>
            </label>

            {/*
             * ENLACE DE RECUPERACIÓN - SPRINT 3
             *
             * Se puede pulsar, pero no navega todavía.
             * Conserva el estilo y el foco del enlace.
             */}
            <a href="/ingresar" onClick={mantenerEnIngreso}>
              {t("olvidaste")}
            </a>
          </div>

          {/* BOTÓN PRINCIPAL */}

          <button type="submit" className="acceso-boton" disabled={enviando || bloqueado}>
            {enviando && <span className="acceso-boton__spinner" aria-hidden="true" />}

            {textoBoton}
          </button>
        </fieldset>
      </form>

      {/* ENLACE DE REGISTRO - SPRINT 3 */}

      <p className="acceso-formulario__pie">
        {t("noTienesCuenta")}{" "}
        {/*
         * Es un enlace interactivo, pero permanece
         * en la página de ingreso hasta el Sprint 3.
         */}
        <a href="/ingresar" onClick={mantenerEnIngreso}>
          {t("crearCuenta")}
        </a>
      </p>
    </div>
  );
}
