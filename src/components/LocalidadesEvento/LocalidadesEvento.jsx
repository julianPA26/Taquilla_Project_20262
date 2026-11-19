import { formatearPrecio } from "../../Utils/formato.js";
import { etiquetaDetalle, obtenerTexto, plantilla } from "../../Utils/textoDetalle.js";
import "./LocalidadesEvento.css";

export default function LocalidadesEvento({ localidades, textos }) {
  const titulo = etiquetaDetalle(textos, "localidades", "paginas.detalleEvento.localidadesTitulo");
  const disponibles = obtenerTexto(
    textos,
    "paginas.detalleEvento.localidades.disponibles",
    "componentes.etiquetas.disponibilidad.disponibles",
  );
  const agotado = obtenerTexto(
    textos,
    "componentes.etiquetas.disponibilidad.agotada",
    "paginas.detalleEvento.localidades.agotada",
  );
  const vacio = obtenerTexto(
    textos,
    "estados.vacio.texto",
    "paginas.detalleEvento.localidades.vacio",
  );
  return (
    <section className="detalle-localidades" aria-labelledby="detalle-localidades-titulo">
      {titulo && <h2 id="detalle-localidades-titulo">{titulo}</h2>}
      {!localidades?.length ? (
        <p className="detalle-localidades__vacio">{vacio}</p>
      ) : (
        <ul className="detalle-localidades__lista">
          {localidades.map((localidad) => (
            <li className="detalle-localidades__item" key={localidad.id}>
              <div>
                <h3>{localidad.nombre}</h3>
                <p
                  className={
                    localidad.agotada
                      ? "detalle-localidades__stock detalle-localidades__stock--agotado"
                      : "detalle-localidades__stock"
                  }
                >
                  {localidad.agotada
                    ? agotado
                    : disponibles.includes("{cantidad}")
                      ? plantilla(disponibles, { cantidad: localidad.disponibles ?? 0 })
                      : `${localidad.disponibles ?? 0} ${disponibles}`}
                </p>
              </div>
              <strong>{formatearPrecio(localidad.precio)}</strong>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
