import PanelPresentacionAcceso from "../components/PanelAcceso/PanelAcceso.jsx";
import FormularioIngreso from "../components/FormularioIngreso/FormularioIngreso.jsx";
import logoNormal from "../Assets/Logos/logo-normal.svg";
import "./Acceso.css";

export default function Acceso({ textos, idioma, onIngreso, onInicio }) {
  // Permite regresar al Inicio sin recargar la página.
  function manejarInicio(evento) {
    evento.preventDefault();
    onInicio();
  }

  const etiquetaLogo = textos?.navbar?.logo?.aria ?? textos?.sitio?.nombre ?? "";

  return (
    <div className="acceso-layout">
      {/* Panel negro reutilizable de escritorio */}
      <PanelPresentacionAcceso tipo="ingresar" textos={textos} onInicio={onInicio} />

      <section className="acceso-layout__principal">
        {/* Logotipo visible en pantallas móviles */}
        <a href="/#inicio" className="acceso-layout__marca-movil" onClick={manejarInicio}>
          <img src={logoNormal} alt={etiquetaLogo} />
        </a>

        {/* Formulario exclusivo del Sprint 2 */}
        <FormularioIngreso textos={textos} idioma={idioma} onIngreso={onIngreso} />
      </section>
    </div>
  );
}
