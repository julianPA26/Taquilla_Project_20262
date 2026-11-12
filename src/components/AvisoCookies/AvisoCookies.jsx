import { useState } from "react";
import {
  leerConsentimiento,
  guardarConsentimiento,
  guardarIdioma,
  borrarIdiomaGuardado,
} from "../../Utils/preferencias.js";
import "./AvisoCookies.css";

// Todos los textos salen de GET /textos, dentro de textos.cookies.banner:
//   titulo, texto, botones.rechazar, botones.aceptar
// "idioma" se necesita para recordar el idioma actual si la persona acepta.
export default function AvisoCookies({ textos, idioma }) {
  const banner = textos?.cookies?.banner;

  // Se muestra solo si todavía no respondió (null = nunca respondió)
  const [visible, setVisible] = useState(() => leerConsentimiento() === null);

  function responder(aceptarOpcionales) {
    guardarConsentimiento(aceptarOpcionales);

    if (aceptarOpcionales) {
      // Acepta: se recuerda el idioma que tiene en este momento
      guardarIdioma(idioma);
    } else {
      // Rechaza: no se recuerda nada
      borrarIdiomaGuardado();
    }

    setVisible(false);
  }

  // Sin textos de la API no se muestra: así nunca aparece un aviso vacío
  if (!visible || !banner) {
    return null;
  }

  return (
    <aside className="aviso-cookies" role="dialog" aria-labelledby="aviso-cookies-titulo">
      <div className="aviso-cookies-interior">
        <div className="aviso-cookies-texto">
          <h2 className="aviso-cookies-titulo titular-h4" id="aviso-cookies-titulo">
            {banner.titulo}
          </h2>
          <p className="aviso-cookies-descripcion cuerpo-p">{banner.texto}</p>
        </div>

        <div className="aviso-cookies-acciones">
          <button
            type="button"
            className="aviso-cookies-boton aviso-cookies-secundario cuerpo-p-fuerte"
            onClick={() => responder(false)}
          >
            {banner.botones?.rechazar}
          </button>
          <button
            type="button"
            className="aviso-cookies-boton aviso-cookies-primario cuerpo-p-fuerte"
            onClick={() => responder(true)}
          >
            {banner.botones?.aceptar}
          </button>
        </div>
      </div>
    </aside>
  );
}
