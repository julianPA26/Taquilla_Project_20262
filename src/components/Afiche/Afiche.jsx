import { useId } from "react";
import { paletaDe } from "../../Utils/paleta.js";
import "./Afiche.css";

// Medidas del afiche de las tarjetas en el Figma (300 × 176)
const ANCHO = 300;
const ALTO_TARJETA = 176;

// Afiche de un evento, igual a los SVG exportados del Figma:
//  - un degradado de color1 a color2,
//  - un círculo blanco translúcido arriba a la derecha,
//  - un círculo negro translúcido abajo a la izquierda.
//
// Uso: <Afiche evento={evento} className="mi-clase">contenido encima</Afiche>
//  - `evento`: de él se elige la paleta del Figma (ver Utils/paletas.js).
//  - `paleta`: número (0 a 7) para forzar una paleta concreta.
//  - `alto`: alto del dibujo. 176 es el de las tarjetas. El afiche grande del hero
//    usa 274 (una caja casi cuadrada): así los círculos conservan su tamaño
//    en relación con el ANCHO, como en el Figma, y no se agrandan.
//  - `alineacion`: qué parte del dibujo queda visible si la caja tiene otra proporción.
export default function Afiche({
    evento,
    paleta,
    className = "",
    alto = ALTO_TARJETA,
    alineacion = "xMidYMid",
    children,
}) {
    // Cada SVG necesita un id único para su degradado
    const id = `afiche-${useId().replace(/:/g, "")}`;
    const [color1, color2] = paletaDe(evento, paleta);

    // En la versión alta, el círculo oscuro asoma solo un poco por abajo
    const esAlto = alto !== ALTO_TARJETA;
    const oscuro = esAlto ? { cx: 45, cy: alto + 55 } : { cx: 31.5, cy: 168.2 };

    return (
        <div className={`afiche ${className}`.trim()}>
            <svg
                className="afiche-arte"
                viewBox={`0 0 ${ANCHO} ${alto}`}
                preserveAspectRatio={`${alineacion} slice`}
                aria-hidden="true"
                focusable="false"
            >
                <defs>
                    {/* Mismo recorrido del degradado del Figma, pero medido sobre la caja,
              así se estira bien aunque cambie el alto */}
                    <linearGradient id={id} x1="-0.0714" y1="0.0714" x2="0.2944" y2="1.1342">
                        <stop stopColor={color1} />
                        <stop offset="1" stopColor={color2} />
                    </linearGradient>
                </defs>
                <rect width={ANCHO} height={alto} fill={`url(#${id})`} />
                <ellipse cx="255" cy="31.2" rx="105" ry="109.2" fill="white" fillOpacity="0.12" />
                <ellipse cx={oscuro.cx} cy={oscuro.cy} rx="67.5" ry="70.2" fill="black" fillOpacity="0.15" />
            </svg>
            {children}
        </div>
    );
}