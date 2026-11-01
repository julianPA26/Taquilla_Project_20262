import logoInverso from "../../assets/logos/logo-inverso.svg";
import "./Footer.css";

// Textos de respaldo mientras llega la API. Tienen la misma forma que textos.footer.
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

// A dónde lleva cada enlace (solo Inicio y Explorar existen en este sprint)
const DESTINOS = {
    inicio: "#inicio",
    explorar: "#explorar",
    ingresar: "#ingresar",
    crearCuenta: "#crear-cuenta",
    terminos: "#terminos",
    accesibilidad: "#accesibilidad",
};

export default function Footer({ idioma, textos }) {
    const ingles = idioma === "en";
    // Si la API ya respondió se usan sus textos; si no, los de respaldo
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
                                        <a href={DESTINOS[enlace] ?? "#"}>{texto}</a>
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
            </div>
        </footer>
    );
}