import React, { useEffect } from "react";
import { formatearFechaCorta, formatearHora, formatearPrecio } from "../../Utils/formato.js";
import Afiche from "../Afiche/Afiche.jsx";
import "./ModalEvent.css";

export default function ModalEvento({ evento, textos, idioma, onClose }) {
    const ingles = idioma === "en";

    useEffect(() => {
        function cerrarConEscape(e) {
            if (e.key === "Escape") onClose();
        }
        window.addEventListener("keydown", cerrarConEscape);
        return () => window.removeEventListener("keydown", cerrarConEscape);
    }, [onClose]);

    if (!evento) return null;

    const fecha = `${formatearFechaCorta(evento.fecha, idioma)} · ${formatearHora(evento.fecha, idioma)}`;
    const lugar = `${evento.recinto?.nombre}, ${evento.recinto?.ciudad}`;
    const precio = formatearPrecio(evento.precioDesde);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-contenido"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-titulo"
            >
                {/* Botón X de cierre */}
                <button className="modal-close-btn" onClick={onClose} aria-label={ingles ? "Close" : "Cerrar"}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="var(--marca-primario)" />
                    </svg>
                </button>

                {/* Encabezado */}
                <div className="modal-header">
                    <h2 id="modal-titulo" className="titular-h2">{evento.titulo}</h2>
                    <p className="modal-subtitulo cuerpo-p">
                        {fecha} · {lugar}
                    </p>
                </div>

                {/* Banner / Afiche */}
                <div className="modal-imagen-contenedor">
                    <Afiche evento={evento} className="modal-afiche" />
                </div>

                {/* Precio */}
                <div className="modal-precio cuerpo-m-fuerte">
                    {precio}
                </div>

                {/* Nota informativa */}
                <p className="modal-nota detalle-nota">
                    {ingles ? "Sample event. Tickets are not for sale." : "Evento de ejemplo. No hay venta de entradas."}
                </p>

                {/* Botón de cierre */}
                <div className="modal-acciones">
                    <button className="modal-btn-cerrar cuerpo-p-fuerte" onClick={onClose}>
                        {ingles ? "Close" : "Cerrar"}
                    </button>
                </div>
            </div>
        </div>
    );
}