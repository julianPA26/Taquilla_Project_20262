import Afiche from "../Afiche/Afiche.jsx";
import Icono from "../Icono/Icono.jsx";
import { formatearFechaCorta, formatearHora, formatearPrecio } from "../../Utils/formato.js";
import "./Listafindesemana.css";

// Lista compacta de eventos con miniatura. Solo se ve en móvil.
export default function ListaFinDeSemana({
  textos,
  idioma,
  eventos,
  cargando,
  onVerTodos,
  onVerEvento,
}) {
  const ingles = idioma === "en";
  const titulo =
    textos?.paginas?.inicio?.filtrosMovil?.finDeSemana ??
    (ingles ? "This weekend" : "Este fin de semana");
  const verTodos =
    textos?.paginas?.inicio?.destacados?.enlaces?.verTodos ??
    textos?.general?.acciones?.verTodos ??
    (ingles ? "View all" : "Ver todos");
  const desde = textos?.componentes?.precio?.desde ?? (ingles ? "From" : "Desde");

  if (!cargando && (!eventos || eventos.length === 0)) return null;

  return (
    <section className="finde" aria-labelledby="finde-titulo">
      <div className="finde-interior">
        <div className="finde-encabezado">
          <h2 className="finde-titulo" id="finde-titulo">
            {titulo}
          </h2>
          <a
            className="finde-ver-todos"
            href="#explorar"
            onClick={(evento) => {
              evento.preventDefault();
              onVerTodos?.();
            }}
          >
            {verTodos}
            <Icono nombre="flechaDerecha" />
          </a>
        </div>

        <ul className="finde-lista" aria-busy={cargando}>
          {(eventos ?? []).slice(0, 3).map((evento) => (
            <li key={evento.id}>
              {/* El detalle no está en el sprint: el enlace solo cambia el # */}
              <a className="finde-fila" href={`#evento-${evento.slug}`}>
                <Afiche evento={evento} className="finde-miniatura" />
                <span className="finde-texto">
                  <span className="finde-nombre">{evento.titulo}</span>
                  <span className="finde-fecha">
                    {formatearFechaCorta(evento.fecha, idioma)} ·{" "}
                    {formatearHora(evento.fecha, idioma)}
                  </span>
                  <span className="finde-precio">
                    {desde} {formatearPrecio(evento.precioDesde)}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
