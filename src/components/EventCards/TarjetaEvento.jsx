import Afiche from "../Afiche/Afiche.jsx";
import Icono from "../Icono/Icono.jsx";
import { formatearFechaCorta, formatearHora, formatearPrecio } from "../../Utils/formato.js";
import "./TarjetaEvento.css";

export default function TarjetaEvento({ evento, textos, idioma, onVerEvento }) {
  const ingles = idioma === "en";
  const etiquetas = textos?.componentes?.etiquetas;
  const disponibilidad = etiquetas?.disponibilidad;

  const categoria = textos?.general?.categorias?.singular?.[evento.categoria] ?? evento.categoria;
  const desde = textos?.componentes?.precio?.desde ?? (ingles ? "From" : "Desde");
  const verEvento = ingles ? "View event" : "Ver evento";

  const fecha = `${formatearFechaCorta(evento.fecha, idioma)} · ${formatearHora(evento.fecha, idioma)}`;
  const lugar = `${evento.recinto?.nombre}, ${evento.recinto?.ciudad}`;

  const agotado = evento.disponibilidad?.agotado;
  const ultimas = evento.disponibilidad?.ultimasEntradas;
  let aviso = null;
  if (agotado) {
    aviso = disponibilidad?.agotada ?? (ingles ? "Sold out" : "Agotada");
  } else if (ultimas) {
    aviso = disponibilidad?.ultimasEntradas ?? (ingles ? "Last tickets" : "Últimas entradas");
  }

  return (
    <article className="tarjeta-evento">
      <Afiche evento={evento} className="tarjeta-afiche">
        {aviso && <span className="tarjeta-aviso">{aviso}</span>}
      </Afiche>

      <div className="tarjeta-cuerpo">
        <p className="tarjeta-categoria">{categoria}</p>
        <h3 className="tarjeta-titulo">{evento.titulo}</h3>

        <ul className="tarjeta-datos">
          <li>
            <Icono nombre="calendario" />
            <span>{fecha}</span>
          </li>
          <li>
            <Icono nombre="ubicacion" />
            <span>{lugar}</span>
          </li>
        </ul>

        <div className="tarjeta-pie">
          <p className="tarjeta-precio">
            <span>{desde}</span>
            <strong>{formatearPrecio(evento.precioDesde)}</strong>
          </p>

          {agotado ? (
            <span className="tarjeta-boton" aria-disabled="true">
              {aviso}
            </span>
          ) : (
            <button type="button" className="tarjeta-boton" onClick={() => onVerEvento?.(evento)}>
              {verEvento}
              <span className="tarjeta-oculto"> · {evento.titulo}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
