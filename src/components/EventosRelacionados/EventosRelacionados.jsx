import TarjetaEvento from "../EventCards/TarjetaEvento.jsx";
import { etiquetaDetalle, obtenerTexto } from "../../Utils/textoDetalle.js";
import "./EventosRelacionados.css";

export default function EventosRelacionados({ eventos, textos, idioma, onVerEvento }) {
  const titulo = etiquetaDetalle(
    textos,
    "relacionados",
    "paginas.detalleEvento.eventosRelacionados.titulo",
  );
  const subtitulo = obtenerTexto(
    textos,
    "paginas.detalleEvento.relacionados.subtitulo",
    "paginas.detalleEvento.eventosRelacionados.subtitulo",
  );
  if (!eventos.length) return null;
  return (
    <section className="detalle-relacionados" aria-labelledby="detalle-relacionados-titulo">
      <header className="detalle-relacionados__encabezado">
        {titulo && <h2 id="detalle-relacionados-titulo">{titulo}</h2>}
        {subtitulo && <p>{subtitulo}</p>}
      </header>
      <ul className="detalle-relacionados__lista">
        {eventos.slice(0, 4).map((evento) => (
          <li key={evento.id || evento.slug}>
            <TarjetaEvento
              evento={evento}
              textos={textos}
              idioma={idioma}
              onVerEvento={onVerEvento}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
