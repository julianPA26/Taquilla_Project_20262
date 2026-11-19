import { useId } from "react";
import { paletaDe } from "../../Utils/paleta.js";
import "./Afiche.css";

// Conserva las medidas y las paletas originales del Sprint 1.
const ANCHO = 300;
const ALTO_TARJETA = 176;

export default function Afiche({
  evento,
  paleta,
  className = "",
  alto = ALTO_TARJETA,
  alineacion = "xMidYMid",
  children,
  variante = "tarjeta",
}) {
  const id = `afiche-${useId().replace(/:/g, "")}`;
  const [color1, color2] = paletaDe(evento, paleta);

  // La portada necesita proporciones distintas a una tarjeta.
  // Conservamos intactos los colores originales y el SVG de las tarjetas.
  if (variante === "panoramico") {
    return (
      <div
        className={`afiche afiche--panoramico ${className}`.trim()}
        style={{ "--afiche-color1": color1, "--afiche-color2": color2 }}
      >
        {children}
      </div>
    );
  }
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
          <linearGradient id={id} x1="-0.0714" y1="0.0714" x2="0.2944" y2="1.1342">
            <stop stopColor={color1} />
            <stop offset="1" stopColor={color2} />
          </linearGradient>
        </defs>
        <rect width={ANCHO} height={alto} fill={`url(#${id})`} />
        <ellipse cx="255" cy="31.2" rx="105" ry="109.2" fill="white" fillOpacity="0.12" />
        <ellipse
          cx={oscuro.cx}
          cy={oscuro.cy}
          rx="67.5"
          ry="70.2"
          fill="black"
          fillOpacity="0.15"
        />
      </svg>
      {children}
    </div>
  );
}
