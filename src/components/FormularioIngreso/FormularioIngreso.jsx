/**
 * FormularioIngreso.jsx
 *
 * Gestiona el inicio de sesión:
 * - Validación de los campos.
 * - Mostrar y ocultar la contraseña.
 * - Envío de credenciales a la API.
 * - Mensajes de error y reintento.
 * - Bloqueo temporal por demasiados intentos.
 */

import { useEffect, useRef, useState } from "react";

import { ErrorApi } from "../../Api/Cliente.js";
import { iniciarSesion } from "../../Api/Sesion.js";

import { mensajeError, textoAcceso } from "../../Utils/textosAcceso.js";

// Icono que permite mostrar u ocultar la contraseña.
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
  // Obtiene los textos de la API.
  const t = (nombre) => textoAcceso(textos, idioma, nombre);

  // Datos introducidos por el usuario.
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [recordar, setRecordar] = useState(true);
  const [visible, setVisible] = useState(false);

  // Estados de validación y solicitud.
  const [erroresCampos, setErroresCampos] = useState({});
  const [errorCodigo, setErrorCodigo] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Contador de bloqueo cuando la API responde 429.
  const [bloqueoHasta, setBloqueoHasta] = useState(0);
  const [segundosRestantes, setSegundosRestantes] = useState(0);

  // Referencias para controlar el foco y los envíos.
  const correoRef = useRef(null);
  const claveRef = useRef(null);
  const envioEnCurso = useRef(false);

  const bloqueado = segundosRestantes > 0;

  /**
   * Actualiza el contador y libera el formulario
   * cuando termina el tiempo de bloqueo.
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
   * Actualiza un campo y limpia los errores anteriores.
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
   * Valida el formulario y solicita iniciar sesión.
   */
  async function enviar() {
    if (envioEnCurso.current || bloqueado) return;

    const nuevosErrores = {};

    // Comprueba el correo.
    if (!correo.trim()) {
      nuevosErrores.correo = t("correoObligatorio");
    } else if (!correoRef.current?.validity.valid) {
      nuevosErrores.correo = t("correoInvalido");
    }

    // Comprueba la contraseña.
    if (!clave) {
      nuevosErrores.clave = t("claveObligatoria");
    }

    // Muestra los errores antes de enviar.
    if (Object.keys(nuevosErrores).length > 0) {
      setErroresCampos(nuevosErrores);
      setErrorCodigo("validacion");

      const primerCampo = nuevosErrores.correo ? correoRef : claveRef;

      primerCampo.current?.focus();
      return;
    }

    // Impide solicitudes duplicadas.
    envioEnCurso.current = true;
    setEnviando(true);
    setErrorCodigo("");

    try {
      const datos = await iniciarSesion(correo.trim(), clave);

      // La sesión se gestiona mediante la API.
      // No almacenamos tokens en localStorage.
      onIngreso(datos.usuario);
    } catch (error) {
      if (error instanceof ErrorApi) {
        setErrorCodigo(error.codigo || "error_interno");

        // Errores de validación que devuelve el servidor.
        if (error.codigo === "validacion") {
          const campos = error.campos || {};

          setErroresCampos(campos);

          const primerCampo = campos.correo ? correoRef : claveRef;

          primerCampo.current?.focus();
        }

        // Respeta el tiempo de espera del servidor.
        if (error.status === 429) {
          const segundos = Math.max(0, Number(error.retryAfter) || 0);

          setBloqueoHasta(Date.now() + segundos * 1000);

          setSegundosRestantes(Math.ceil(segundos));
        }
      } else {
        // Conserva los campos cuando falla la conexión.
        setErrorCodigo("conexion");
      }
    } finally {
      envioEnCurso.current = false;
      setEnviando(false);
    }
  }

  // Evita la recarga del navegador al enviar.
  function manejarEnvio(evento) {
    evento.preventDefault();
    void enviar();
  }

  // Mensajes de la alerta obtenidos desde GET /textos.
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

  // El botón principal también sirve para reintentar.
  const textoBoton = enviando
    ? t("ingresando")
    : errorCodigo === "conexion"
      ? t("reintentar")
      : t("ingresar");

  // Asocia los errores visuales a sus campos.
  const idCorreoError = erroresCampos.correo ? "ingreso-correo-error" : undefined;

  const idClaveError = erroresCampos.clave ? "ingreso-clave-error" : undefined;

  return (
    <div className="acceso-formulario">
      {/* ENCABEZADO */}

      <h1>{t("titulo")}</h1>

      <p className="acceso-formulario__introduccion">{t("descripcion")}</p>

      {/* ALERTA DE VALIDACIÓN O CONEXIÓN */}

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

      {/* FORMULARIO DE INGRESO */}

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

            {/* Sprint 3: texto sin navegación temporalmente */}
            <a>{t("olvidaste")}</a>
          </div>

          {/* BOTÓN PRINCIPAL: INGRESAR O REINTENTAR */}

          <button type="submit" className="acceso-boton" disabled={enviando || bloqueado}>
            {enviando && <span className="acceso-boton__spinner" aria-hidden="true" />}

            {textoBoton}
          </button>
        </fieldset>
      </form>

      {/* ENLACE DE REGISTRO PENDIENTE DEL SPRINT 3 */}

      <p className="acceso-formulario__pie">
        {t("noTienesCuenta")} <a>{t("crearCuenta")}</a>
      </p>
    </div>
  );
}
