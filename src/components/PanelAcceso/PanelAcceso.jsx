
import logoInverso from "../../Assets/Logos/logo-inverso.svg";
import "./PanelAcceso.css";

export default function PanelPresentacionAcceso({ tipo = "ingresar", textos, onInicio }) {
  // Obtiene la presentación según el tipo de página.
  const presentacion = textos?.paginas?.[tipo]?.presentacion;

  // Convierte los beneficios de la API en una lista.
  const beneficios = Object.entries(presentacion?.beneficios ?? {}).filter(
    ([, contenido]) => typeof contenido === "string" && contenido.trim().length > 0,
  );

  // Navega al inicio sin recargar la aplicación.
  function manejarInicio(evento) {
    evento.preventDefault();
    onInicio?.();
  }

  return (
    <aside className="panel-presentacion">
      {/* LOGOTIPO DE TAQUILLA */}

      <a href="/#inicio" className="panel-presentacion__marca" onClick={manejarInicio}>
        <img src={logoInverso} alt={textos?.navbar?.logo?.aria ?? textos?.sitio?.nombre ?? ""} />
      </a>

      {/* CONTENIDO PROVENIENTE DE LA API */}

      <div className="panel-presentacion__contenido">
        {/* Lema de la página */}

        {presentacion?.lema && <h2>{presentacion.lema}</h2>}

        {/* Beneficios de la plataforma */}

        {beneficios.length > 0 && (
          <ul>
            {beneficios.map(([clave, contenido]) => (
              <li key={clave}>
                <span className="panel-presentacion__icono" aria-hidden="true">
                  ✓
                </span>

                <span>{contenido}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
