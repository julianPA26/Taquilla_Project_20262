import "./Afiche.css";

// El afiche no es una foto: la API entrega dos colores y un patrón.
// Uso: <Afiche afiche={evento.afiche} className="mi-clase">contenido encima</Afiche>
export default function Afiche({ afiche, className = "", children }) {
    const estilo = {
        "--afiche-1": afiche?.color1 ?? "var(--fondo-inverso-2)",
        "--afiche-2": afiche?.color2 ?? "var(--fondo-inverso)",
    };

    return (
        <div
            className={`afiche ${className}`.trim()}
            data-patron={afiche?.patron}
            style={estilo}
        >
            {children}
        </div>
    );
}