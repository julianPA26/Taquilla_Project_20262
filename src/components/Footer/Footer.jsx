import logoInverso from "../../Assets/Logos/logo-inverso.svg";
import "./Footer.css";

// Destinos de los enlaces (son direcciones de la app, no textos).
const DESTINOS = {
  inicio: "#inicio",
  explorar: "#explorar",
  ingresar: "#ingresar",
  crearCuenta: "#crear-cuenta",
  terminos: "#terminos",
  accesibilidad: "#accesibilidad",
};

// TODOS los textos salen de GET /textos, dentro de textos.footer:
//   lema, columnas.{explora, cuenta, legal}.{titulo, enlaces}, legal.{derechos, nota}
export default function Footer({ textos, onAbrirAccesibilidad, onAbrirAuth }) {
  const pie = textos?.footer;

  // Sin los textos de la API no hay nada que mostrar
  if (!pie) {
    return null;
  }

  const derechos = (pie.legal?.derechos ?? "").replace("{anio}", new Date().getFullYear());

  return (
    <footer className="footer">
      <div className="footer-interior">
        <div className="footer-presentacion">
          <a className="footer-marca" href="#inicio" aria-label={textos?.navbar?.logo?.aria}>
            <img className="footer-logo" src={logoInverso} alt="" width="109" height="32" />
          </a>
          <p className="footer-lema">{pie.lema}</p>
        </div>

        <nav className="footer-columnas">
          {Object.entries(pie.columnas ?? {}).map(([clave, columna]) => (
            <div className="footer-columna" key={clave}>
              <h2 className="footer-titulo">{columna.titulo}</h2>
              <ul className="footer-lista">
                {Object.entries(columna.enlaces ?? {}).map(([enlace, texto]) => (
                  <li key={enlace}>
                    {enlace === "accesibilidad" ? (
                      <a
                        href="#accesibilidad"
                        onClick={(e) => {
                          e.preventDefault();
                          onAbrirAccesibilidad?.();
                        }}
                      >
                        {texto}
                      </a>
                    ) : enlace === "ingresar" ? (
                      <a
                        href="#ingresar"
                        onClick={(e) => {
                          e.preventDefault();
                          onAbrirAuth?.("ingresar");
                        }}
                      >
                        {texto}
                      </a>
                    ) : enlace === "crearCuenta" ? (
                      <a
                        href="#crear-cuenta"
                        onClick={(e) => {
                          e.preventDefault();
                          onAbrirAuth?.("crearCuenta");
                        }}
                      >
                        {texto}
                      </a>
                    ) : (
                      <a href={DESTINOS[enlace] ?? "#"}>{texto}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="footer-base">
        <p>{derechos}</p>
        <p>{pie.legal?.nota}</p>
      </div>
    </footer>
  );
}
