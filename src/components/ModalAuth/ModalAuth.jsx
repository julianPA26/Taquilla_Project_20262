import { useEffect } from "react";
import Icono from "../Icono/Icono.jsx";
import "./ModalAuth.css";

export default function ModalAuth({ abierto, modo, onClose, idioma }) {
  const ingles = idioma === "en";

  useEffect(() => {
    function cerrarConEscape(e) {
      if (e.key === "Escape" && abierto) {
        onClose();
      }
    }
    window.addEventListener("keydown", cerrarConEscape);
    return () => window.removeEventListener("keydown", cerrarConEscape);
  }, [abierto, onClose]);

  if (!abierto) return null;

  const titulo =
    modo === "crearCuenta"
      ? ingles
        ? "Create account"
        : "Crear cuenta"
      : ingles
        ? "Log in"
        : "Iniciar sesión";

  return (
    <div className="modal-auth-overlay" onClick={onClose}>
      <div
        className="modal-auth-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-auth-titulo"
      >
        <button
          type="button"
          className="modal-auth-cerrar"
          onClick={onClose}
          aria-label={ingles ? "Close" : "Cerrar"}
        >
          <Icono nombre="cerrar" />
        </button>

        <h2 id="modal-auth-titulo" className="modal-auth-titulo titular-h2">
          {titulo}
        </h2>

        <p className="modal-auth-mensaje cuerpo-m">
          {ingles
            ? "Account access is not yet available. You can explore the public catalog without logging in."
            : "El acceso a cuentas aún no está disponible. Puedes explorar el catálogo público sin iniciar sesión."}
        </p>

        <button type="button" className="modal-auth-boton cuerpo-m-fuerte" onClick={onClose}>
          {ingles ? "Keep exploring" : "Seguir explorando"}
        </button>
      </div>
    </div>
  );
}
