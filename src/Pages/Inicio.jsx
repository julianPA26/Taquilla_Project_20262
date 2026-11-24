import { useState } from "react";
import { useApi } from "../hooks/useApi.js";
import { useEventos } from "../hooks/useEvento.js";
import Hero from "../components/Hero/Hero.jsx";
import Categorias from "../components/Categorias/Categorias.jsx";
import SeccionEventos from "../components/SeccionEventos/SeccionEventos.jsx";
import ListaFinDeSemana from "../components/ListaFinDeSemana/Listafindesemana.jsx";
import { filtrarEventos, limitesDePrecio } from "../Utils/filtros.js";
import { normalizarRespuestaEventos } from "../Api/Adaptadores.js";
import { RUTAS } from "../Api/Rutas.js";
import "./Inicio.css";

// Ciudad que se muestra inicialmente en el buscador.
const CIUDAD_POR_DEFECTO = "Manizales";

/**
 * Filtros vacíos utilizados como base para
 * seleccionar eventos de las diferentes secciones.
 */
const SIN_FILTROS = {
  q: "",
  categorias: [],
  ciudad: "",
  fecha: "",
  desde: "",
  hasta: "",
  precioMin: null,
  precioMax: null,
};

export default function Inicio({ textos, idioma, onBuscar, onExplorarCategoria, onVerEvento }) {
  const ingles = idioma === "en";
  const textosInicio = textos?.paginas?.inicio;

  /* ========================================
     ESTADOS DE LA PÁGINA
     ======================================== */

  // Ciudad utilizada por el Hero y Próximamente.
  const [ciudad, setCiudad] = useState(CIUDAD_POR_DEFECTO);

  // Categoría seleccionada en los chips móviles.
  const [categoria, setCategoria] = useState("todas");

  /* ========================================
     CONSULTAS A LA API
     ======================================== */

  // Eventos destacados, ciudades y categorías.
  const destacados = useApi(RUTAS.eventosDestacados, normalizarRespuestaEventos);

  const ciudades = useApi(RUTAS.ciudades);
  const categorias = useApi(RUTAS.categorias);

  // Todos los eventos ordenados por fecha.
  const todos = useEventos("fecha");

  const limites = limitesDePrecio(todos.eventos);
  const eventosDestacados = destacados.datos?.datos ?? [];

  /* ========================================
     SELECCIÓN DE EVENTOS
     ======================================== */

  // El primer destacado se utiliza en el Hero.
  const principal = eventosDestacados[0];

  // Filtra los destacados según el chip seleccionado.
  const destacadosVisibles =
    categoria === "todas"
      ? eventosDestacados
      : eventosDestacados.filter((evento) => evento.categoria === categoria);

  // Conserva únicamente los eventos futuros.
  const ahora = Date.now();

  const futuros = todos.eventos.filter((evento) => new Date(evento.fecha).getTime() >= ahora);

  // Muestra un máximo de tres eventos para el fin de semana.
  const delFinDeSemana = filtrarEventos(todos.eventos, { ...SIN_FILTROS, fecha: "finde" }, limites);

  const eventosFinDeSemana = (delFinDeSemana.length > 0 ? delFinDeSemana : futuros).slice(0, 3);

  // Próximos cuatro eventos de la ciudad seleccionada.
  const eventosProximos = filtrarEventos(futuros, { ...SIN_FILTROS, ciudad }, limites).slice(0, 4);

  /* ========================================
     TEXTOS DESDE LA API
     ======================================== */

  const plantillaTitulo =
    textosInicio?.proximos?.titulo ??
    (ingles ? "Coming soon in {ciudad}" : "Próximamente en {ciudad}");

  const tituloProximamente = plantillaTitulo.replace("{ciudad}", ciudad);

  const subtituloProximamente =
    textosInicio?.proximos?.subtitulo ??
    (ingles ? "Change the city from the search bar" : "Cambia la ciudad desde el buscador");

  /* ========================================
     CONTENIDO DE INICIO
     ======================================== */

  return (
    <div className="pagina-inicio">
      {/* Presentación principal y buscador. */}
      <Hero
        textos={textos}
        idioma={idioma}
        evento={principal}
        ciudades={ciudades.datos?.datos ?? []}
        ciudad={ciudad}
        onCiudad={setCiudad}
        onBuscar={onBuscar}
        onVerEvento={onVerEvento}
      />

      {/* Categorías y filtros rápidos en móvil. */}
      <Categorias
        textos={textos}
        idioma={idioma}
        categorias={categorias.datos?.datos}
        cargando={categorias.cargando}
        error={categorias.error}
        recargar={categorias.recargar}
        activa={categoria}
        onElegir={setCategoria}
        onExplorar={onExplorarCategoria}
      />

      {/* Carrusel de eventos destacados. */}
      <SeccionEventos
        id="destacados"
        titulo={
          textosInicio?.destacados?.titulo ??
          (ingles ? "Featured this week" : "Destacados de la semana")
        }
        tituloMovil={textosInicio?.filtrosMovil?.destacados ?? (ingles ? "Featured" : "Destacados")}
        subtitulo={
          textosInicio?.destacados?.subtitulo ??
          (ingles
            ? "The events with the most tickets sold in the last 7 days"
            : "Los eventos con más entradas vendidas en los últimos 7 días")
        }
        eventos={destacadosVisibles}
        cargando={destacados.cargando}
        error={destacados.error}
        recargar={destacados.recargar}
        textos={textos}
        idioma={idioma}
        onVerTodos={() => onBuscar?.()}
        onVerEvento={onVerEvento}
      />

      {/* Tarjetas compactas exclusivas de móvil. */}
      <ListaFinDeSemana
        textos={textos}
        idioma={idioma}
        eventos={eventosFinDeSemana}
        cargando={todos.cargando}
        onVerTodos={() => onBuscar?.()}
        onVerEvento={onVerEvento}
      />

      {/* Próximos eventos: sección de escritorio. */}
      <SeccionEventos
        id="proximamente"
        titulo={tituloProximamente}
        subtitulo={subtituloProximamente}
        eventos={eventosProximos}
        cargando={todos.cargando}
        error={todos.error}
        recargar={todos.recargar}
        textos={textos}
        idioma={idioma}
        soloEscritorio
        onVerTodos={() => onBuscar?.("", ciudad)}
        onVerEvento={onVerEvento}
      />
    </div>
  );
}
