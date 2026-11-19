import { obtenerTexto } from "../../Utils/textoDetalle.js";
import "./DetalleEstado.css";

export default function DetalleEstado({ tipo, textos, error, onReintentar, onVolver }) {
  const estados = textos?.estados;
  const es404 = tipo === "noEncontrado";
  const mensajeError = error?.codigo && textos?.errores?.[error.codigo];
  const titulo = es404
    ? obtenerTexto(textos, "paginas.detalleEvento.noEncontrado.titulo", "estados.vacio.titulo")
    : obtenerTexto(textos, "estados.error.titulo");
  const texto = es404
    ? obtenerTexto(
        textos,
        "errores.no_encontrado",
        "paginas.detalleEvento.noEncontrado.texto",
        "estados.vacio.texto",
      )
    : mensajeError || obtenerTexto(textos, "estados.error.texto", "errores.error_interno");
  const boton = es404
    ? obtenerTexto(textos, "componentes.migas.explorar", "navbar.enlaces.explorar")
    : obtenerTexto(textos, "estados.error.botones.reintentar");
  return (
    <section className="detalle-estado" role={es404 ? "status" : "alert"}>
      {titulo && <h1>{titulo}</h1>}
      {texto && <p>{texto}</p>}
      {boton && (
        <button type="button" onClick={es404 ? () => onVolver("explorar") : onReintentar}>
          {boton}
        </button>
      )}
    </section>
  );
}
