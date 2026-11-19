import Icono from "../Icono/Icono.jsx";
import { formatearFechaCorta, formatearHora } from "../../Utils/formato.js";
import { etiquetaDetalle, obtenerTexto, plantilla } from "../../Utils/textoDetalle.js";
import "./FuncionesEvento.css";

export default function FuncionesEvento({ funciones, textos, idioma }) {
  const titulo = etiquetaDetalle(textos, "funciones", "paginas.detalleEvento.funcionesTitulo");
  const agotada = obtenerTexto(
    textos,
    "componentes.etiquetas.disponibilidad.agotada",
    "paginas.detalleEvento.funciones.agotada",
  );
  const disponibles = obtenerTexto(
    textos,
    "paginas.detalleEvento.funciones.disponibles",
    "componentes.etiquetas.disponibilidad.disponibles",
  );
  const vacio = obtenerTexto(
    textos,
    "estados.vacio.texto",
    "paginas.detalleEvento.funciones.vacio",
  );
  return (
    <section className="detalle-funciones" aria-labelledby="detalle-funciones-titulo">
      {titulo && <h2 id="detalle-funciones-titulo">{titulo}</h2>}
      {!funciones?.length ? (
        <p className="detalle-funciones__vacio">{vacio}</p>
      ) : (
        <ul className="detalle-funciones__lista">
          {funciones.map((funcion) => (
            <li key={funcion.id} className="detalle-funciones__item">
              <span className="detalle-funciones__fecha">
                <Icono nombre="calendario" />
                {formatearFechaCorta(funcion.fecha, idioma)} ·{" "}
                {formatearHora(funcion.fecha, idioma)}
              </span>
              <span
                className={
                  funcion.agotada
                    ? "detalle-funciones__stock detalle-funciones__stock--agotado"
                    : "detalle-funciones__stock"
                }
              >
                {funcion.agotada
                  ? agotada
                  : disponibles.includes("{cantidad}")
                    ? plantilla(disponibles, { cantidad: funcion.disponibles ?? 0 })
                    : `${funcion.disponibles ?? 0} ${disponibles}`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
