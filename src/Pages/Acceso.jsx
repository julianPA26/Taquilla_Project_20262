import PanelPresentacionAcceso from "../components/PanelAcceso/PanelAcceso.jsx";
import FormularioIngreso from "../components/FormularioIngreso/FormularioIngreso.jsx";
import logoNormal from "../Assets/Logos/logo-normal.svg";
import "./Acceso.css";

export default function Acceso({
  modo,
  textos,
  idioma,
  onIngreso,
  onVolverIngreso,
  onRecuperar,
  onCrearCuenta,
  onInicio,
}) {
  // El panel utiliza los textos de ingreso
  // hasta que se implemente el registro.
  const tipoPresentacion = modo === "registro" ? "registro" : "ingresar";

  // Navega al inicio sin recargar la página.
  function manejarInicio(evento) {
    evento.preventDefault();
    onInicio?.();
  }

  return (
    <div className="acceso-layout">
      {/* PANEL REUTILIZABLE DE ESCRITORIO */}

      <PanelPresentacionAcceso tipo={tipoPresentacion} textos={textos} onInicio={onInicio} />

      {/* CONTENIDO PRINCIPAL */}

      <section className="acceso-layout__principal">
        {/* LOGOTIPO EXCLUSIVO DE MÓVIL */}

        <a href="/#inicio" className="acceso-layout__marca-movil" onClick={manejarInicio}>
          <img src={logoNormal} alt={textos?.navbar?.logo?.aria ?? textos?.sitio?.nombre ?? ""} />
        </a>

        {/* FORMULARIO SEGÚN LA RUTA ACTUAL */}

        {modo === "recuperar" ? (
          <RecuperarClave textos={textos} idioma={idioma} onVolverIngreso={onVolverIngreso} />
        ) : (
          <FormularioIngreso
            textos={textos}
            idioma={idioma}
            onIngreso={onIngreso}
            onRecuperar={onRecuperar}
            onCrearCuenta={onCrearCuenta}
          />
        )}
      </section>
    </div>
  );
}
