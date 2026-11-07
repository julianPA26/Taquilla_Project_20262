import logoInverso from "../../Assets/Logos/logo-inverso.svg";
import PreferenciasCookies from "../Cookies/PreferenciasCookies.jsx"; 
import "./Footer.css";

const RESPALDO = {
    es: {
        lema: "Conciertos, teatro, deportes y festivales en un solo lugar. Explora eventos y consulta sus detalles.",
        columnas: {
            explora: { titulo: "Explora", enlaces: { inicio: "Inicio", explorar: "Explorar eventos" } },
            cuenta: { titulo: "Tu cuenta", enlaces: { ingresar: "Iniciar sesión", crearCuenta: "Crear cuenta" } },
            legal: { titulo: "Legal", enlaces: { terminos: "Términos de uso", accesibilidad: "Accesibilidad" } },
        },
        legal: { derechos: "© {anio} Taquilla · Proyecto académico", nota: "Datos de ejemplo con fines académicos." },
    },
    en: {
        lema: "Concerts, theater, sports and festivals in one place. Explore events and check their details.",
        columnas: {
            explora: { titulo: "Explore", enlaces: { inicio: "Home", explorar: "Explore events" } },
            cuenta: { titulo: "Your account", enlaces: { ingresar: "Log in", crearCuenta: "Sign up" } },
            legal: { titulo: "Legal", enlaces: { terminos: "Terms of use", accesibilidad: "Accessibility" } },
        },
        legal: { derechos: "© {anio} Taquilla · Academic project", nota: "Sample data for academic purposes." },
    },
};

const DESTINOS = {
    inicio: "#inicio",
    explorar: "#explorar",
    ingresar: "#ingresar",
    crearCuenta: "#crear-cuenta",
    terminos: "#terminos",
    accesibilidad: "#accesibilidad",
};

export default function Footer({ idioma, textos, onAbrirAccesibilidad, onAbrirAuth }) {
    const ingles = idioma === "en";
    const f = textos?.footer ?? RESPALDO[idioma] ?? RESPALDO.es;
    const derechos = f.legal.derechos.replace("{anio}", new Date().getFullYear());

    return (
        <footer className="footer">
            <div className="footer-interior">
                <div className="footer-presentacion">
                    <a
                        className="footer-marca"
                        href="#inicio"
                        aria-label={textos?.navbar?.logo?.aria ?? (ingles ? "Taquilla, go to home" : "Taquilla, ir al inicio")}
                    >
                        <img className="footer-logo" src={logoInverso} alt="" width="109" height="32" />
                    </a>
                    <p className="footer-lema">{f.lema}</p>
                </div>

                <nav className="footer-columnas" aria-label={ingles ? "Footer" : "Pie de página"}>
                    {Object.entries(f.columnas).map(([clave, columna]) => (
                        <div className="footer-columna" key={clave}>
                            <h2 className="footer-titulo">{columna.titulo}</h2>
                            <ul className="footer-lista">
                                {Object.entries(columna.enlaces).map(([enlace, texto]) => (
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
                <p>{f.legal.nota}</p>
                <PreferenciasCookies />
            </div>
        </footer>
    );
}