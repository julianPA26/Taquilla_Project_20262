import Icono from "./Icono.jsx";
import "./Footer.css";

// Estos textos no están en la API de textos, por eso se escriben aquí (es y en)
const TEXTOS = {
    es: {
        aria: "Pie de página",
        ariaLogo: "Taquilla, ir al inicio",
        lema: "Conciertos, teatro, deportes y festivales en un solo lugar. Explora eventos y consulta sus detalles.",
        columnas: [
            {
                titulo: "Explora",
                enlaces: [
                    ["Inicio", "#inicio"],
                    ["Explorar eventos", "#explorar"],
                ],
            },
            {
                titulo: "Tu cuenta",
                enlaces: [
                    ["Iniciar sesión", "#ingresar"],
                    ["Crear cuenta", "#crear-cuenta"],
                ],
            },
            {
                titulo: "Legal",
                enlaces: [["Términos de uso", "#"]],
            },
        ],
        derechos: "Taquilla · Proyecto académico",
        aviso: "Datos de ejemplo con fines académicos.",
    },
    en: {
        aria: "Footer",
        ariaLogo: "Taquilla, go to home",
        lema: "Concerts, theater, sports and festivals in one place. Explore events and check their details.",
        columnas: [
            {
                titulo: "Explore",
                enlaces: [
                    ["Home", "#inicio"],
                    ["Explore events", "#explorar"],
                ],
            },
            {
                titulo: "Your account",
                enlaces: [
                    ["Log in", "#ingresar"],
                    ["Create account", "#crear-cuenta"],
                ],
            },
            {
                titulo: "Legal",
                enlaces: [["Terms of use", "#"]],
            },
        ],
        derechos: "Taquilla · Academic project",
        aviso: "Sample data for academic purposes.",
    },
};

export default function Footer({ idioma }) {
    const t = TEXTOS[idioma] ?? TEXTOS.es;
    const anio = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-interior">
                <div className="footer-presentacion">
                    <a className="footer-marca" href="#inicio" aria-label={t.ariaLogo}>
                        <span className="footer-simbolo" aria-hidden="true">
                            <Icono nombre="ticket" />
                        </span>
                        <span>taquilla</span>
                    </a>
                    <p className="footer-lema">{t.lema}</p>
                </div>

                <nav className="footer-columnas" aria-label={t.aria}>
                    {t.columnas.map((columna) => (
                        <div className="footer-columna" key={columna.titulo}>
                            <h2 className="footer-titulo">{columna.titulo}</h2>
                            <ul className="footer-lista">
                                {columna.enlaces.map(([texto, destino]) => (
                                    <li key={texto}>
                                        <a href={destino}>{texto}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>
            </div>

            <div className="footer-base">
                <p>
                    © {anio} {t.derechos}
                </p>
                <p>{t.aviso}</p>
            </div>
        </footer>
    );
}