import { useEffect, useState } from "react";
import "./AvisoCookies.css";

const CLAVE = "taquilla-consentimiento";

export default function AvisoCookies({ idioma }) {
  const [visible, setVisible] = useState(false);
  const ingles = idioma === "en";

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(CLAVE);
      if (!guardado) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  function responder(activarOpcionales) {
    const consentimiento = {
      necesarias: true,
      preferencias: activarOpcionales,
      analiticas: activarOpcionales,
      marketing: activarOpcionales,
    };

    try {
      localStorage.setItem(CLAVE, JSON.stringify(consentimiento));
    } catch {
      // Manejo de excepción en caso de que localStorage esté bloqueado
    }

    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside
      className="aviso-cookies"
      role="dialog"
      aria-label={ingles ? "Cookie notice" : "Aviso de cookies"}
    >
      <div className="aviso-cookies-interior">
        <div className="aviso-cookies-texto">
          <h2 className="aviso-cookies-titulo titular-h4">
            {ingles ? "We use cookies" : "Usamos cookies"}
          </h2>
          <p className="aviso-cookies-descripcion cuerpo-p">
            {ingles
              ? "We only use necessary cookies to keep your session active and remember your language. You can accept or reject them."
              : "Usamos solo las cookies necesarias para mantener tu sesión y recordar tu idioma. Puedes aceptarlas o rechazarlas."}
          </p>
        </div>

        <div className="aviso-cookies-acciones">
          <button
            type="button"
            className="aviso-cookies-boton aviso-cookies-secundario cuerpo-p-fuerte"
            onClick={() => responder(false)}
          >
            {ingles ? "Reject" : "Rechazar"}
          </button>
          <button
            type="button"
            className="aviso-cookies-boton aviso-cookies-primario cuerpo-p-fuerte"
            onClick={() => responder(true)}
          >
            {ingles ? "Accept" : "Aceptar"}
          </button>
        </div>
      </div>
    </aside>
  );
}
