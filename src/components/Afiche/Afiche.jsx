import { useId } from "react";
import "./Afiche.css";

// Afiche de un evento, igual al exportado del Figma (300 × 176):
//  - un degradado de color1 a color2,
//  - un círculo blanco translúcido arriba a la derecha,
//  - un círculo negro translúcido abajo a la izquierda.
// Los colores salen de `afiche.color1` y `afiche.color2` de cada evento de la API,
// así que todos los eventos tienen su afiche sin necesidad de una imagen por evento.
//
// Uso: <Afiche afiche={evento.afiche} className="mi-clase">contenido encima</Afiche>
// `alineacion` decide qué parte del dibujo queda visible si la caja tiene otra proporción.
export default function Afiche({ afiche, className = "", alineacion = "xMidYMid", children }) {
    // Cada SVG necesita un id único para su degradado
    const id = `afiche-${useId().replace(/:/g, "")}`;
    const color1 = afiche?.color1 ?? "#262626";
    const color2 = afiche?.color2 ?? "#141414";

    return (
        <div className={`afiche ${className}`.trim()}>
            <svg
                className="afiche-arte"
                viewBox="0 0 300 176"
                preserveAspectRatio={`${alineacion} slice`}
                aria-hidden="true"
                focusable="false"
            >
                <defs>
                    <linearGradient
                        id={id}
                        x1="-21.4286"
                        y1="12.5714"
                        x2="88.3075"
                        y2="199.622"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor={color1} />
                        <stop offset="1" stopColor={color2} />
                    </linearGradient>
                </defs>
                <rect width="300" height="176" fill={`url(#${id})`} />
                <ellipse cx="255" cy="31.2" rx="105" ry="109.2" fill="white" fillOpacity="0.12" />
                <ellipse cx="31.5" cy="168.2" rx="67.5" ry="70.2" fill="black" fillOpacity="0.15" />
            </svg>
            {children}
        </div>
    );
}