/**
 * FormularioIngreso.jsx
 *
 * Formulario de inicio de sesión de Taquilla.
 * Gestiona validaciones, visibilidad de contraseña,
 * peticiones a la API y estados de error.
 *
 * Los enlaces del Sprint 3 se mantienen visualmente,
 * pero todavía no permiten navegar.
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
  // Obtiene las etiquetas desde GET /textos.
  const t = (clave) => textoAcceso(textos, idioma, clave);

  // Estados de los campos.
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [recordar, setRecordar] = useState(true);
  const [visible, setVisible] = useState(false);

  // Estados de validación y envío.
  const [erroresCampos, setErroresCampos] = useState({});
  const [errorCodigo, setErrorCodigo] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Bloqueo temporal del formulario.
  const [bloqueoHasta, setBloqueoHasta] = useState(0);
  const [segundosRestantes, setSegundosRestantes] = useState(0);

  // Referencias de los campos y control de envíos.
  const correoRef = useRef(null);
  const claveRef = useRef(null);
  const envioEnCurso = useRef(false);

  const bloqueado = segundosRestantes > 0;

  // Actualiza el contador cuando la API responde 429.
  useEffect(() => {
    if (!bloqueoHasta) return;

    const actualizar = () => {
      setSegundosRestantes(Math.max(0, Math.ceil((bloqueoHasta - Date.now()) / 1000)));
    };

    actualizar();

    const intervalo = window.setInterval(actualizar, 250);

    return () => window.clearInterval(intervalo);
  }, [bloqueoHasta]);

  // Actualiza los valores y limpia errores anteriores.
  function actualizarCampo(campo, valor) {
    if (campo === "correo") setCorreo(valor);
    if (campo === "clave") setClave(valor);

    setErroresCampos((actual) => ({
      ...actual,
      [campo]: "",
    }));

    setErrorCodigo("");
  }

  // Valida los campos y envía el formulario a la API.
  async function enviar() {
    if (envioEnCurso.current || bloqueado) return;

    const nuevosErrores = {};

    if (!correo.trim()) {
      nuevosErrores.correo = t("correoObligatorio");
    } else if (!correoRef.current?.validity.valid) {
      nuevosErrores.correo = t("correoInvalido");
    }

    if (!clave) {
      nuevosErrores.clave = t("claveObligatoria");
    }

    // Muestra los errores y enfoca el primer campo inválido.
    if (Object.keys(nuevosErrores).length) {
      setErroresCampos(nuevosErrores);
      setErrorCodigo("validacion");

      (nuevosErrores.correo ? correoRef : claveRef).current?.focus();

      return;
    }

    // Evita enviar dos veces las mismas credenciales.
    envioEnCurso.current = true;
    setEnviando(true);
    setErrorCodigo("");

    try {
      const datos = await iniciarSesion(correo.trim(), clave);

      // No almacenamos el token en localStorage.
      onIngreso(datos.usuario);
    } catch (error) {
      if (error instanceof ErrorApi) {
        setErrorCodigo(error.codigo || "error_interno");

        // Procesa errores de validación de la API.
        if (error.codigo === "validacion") {
          const campos = error.campos || {};

          setErroresCampos(campos);

          (campos.correo ? correoRef : claveRef).current?.focus();
        }

        // Bloquea el formulario durante Retry-After.
        if (error.status === 429) {
          setBloqueoHasta(Date.now() + error.retryAfter * 1000);
        }
      } else {
        // Error de conexión.
        setErrorCodigo("conexion");
      }
    } finally {
      envioEnCurso.current = false;
      setEnviando(false);
    }
  }

  // Evita que el navegador recargue la página.
  function manejarEnvio(evento) {
    evento.preventDefault();
    void enviar();
  }

  // Mensajes de error provenientes de la API.
  const textoAlerta = errorCodigo
    ? mensajeError(textos, idioma, errorCodigo, {
        segundos: segundosRestantes,
      })
    : "";

  const idCorreoError = erroresCampos.correo ? "ingreso-correo-error" : undefined;

  const idClaveError = erroresCampos.clave ? "ingreso-clave-error" : undefined;

  return (
    <div className="acceso-formulario">
      {/* ENCABEZADO */}

      <h1>{t("titulo")}</h1>

      <p className="acceso-formulario__introduccion">{t("descripcion")}</p>

      {/* ALERTAS DE ERROR */}

      {errorCodigo && (
        <div className="acceso-aviso" role="alert">
          <span className="acceso-aviso__icono" aria-hidden="true">
            !
          </span>

          <div>
            {errorCodigo === "validacion" && <strong>{t("camposMarcados")}</strong>}

            <p>{textoAlerta}</p>
          </div>
        </div>
      )}

      {/* FORMULARIO */}

      <form noValidate onSubmit={manejarEnvio} aria-busy={enviando}>
        <fieldset className="acceso-fieldset" disabled={enviando || bloqueado}>
          {/* CORREO */}

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


          <div className="acceso-formulario__opciones">
            <label className="acceso-checkbox">
              <input
                type="checkbox"
                checked={recordar}
                onChange={(evento) => setRecordar(evento.target.checked)}
              />

              <span>{t("recordar")}</span>
            </label>

            <a>{t("olvidaste")}</a>
          </div>


          <button type="submit" className="acceso-boton" disabled={enviando || bloqueado}>
            {enviando && <span className="acceso-boton__spinner" aria-hidden="true" />}

            {enviando ? t("ingresando") : t("ingresar")}
          </button>
        </fieldset>
      </form>


      {errorCodigo === "conexion" && (
        <button
          type="button"
          className="acceso-reintentar"
          disabled={enviando}
          onClick={() => void enviar()}
        >
          {t("reintentar")}
        </button>
      )}


      <p className="acceso-formulario__pie">
        {t("noTienesCuenta")} <a>{t("crearCuenta")}</a>
      </p>
    </div>
  );
}
