import "./Afiche.css";


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