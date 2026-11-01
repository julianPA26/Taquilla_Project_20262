import { useState } from "react";
import { useApi } from "../hooks/useApi.js";
import Hero from "../components/Hero/Hero.jsx";
import Categorias from "../components/Categorias/Categorias.jsx";
import SeccionEventos from "../components/SeccionEventos/SeccionEventos.jsx";
import ListaFinDeSemana from "../components/ListaFinDeSemana/Listafindesemana.jsx";
import { useEventos } from "../hooks/useEvento.js";
import { filtrarEventos, limitesDePrecio } from "../Utils/filtros.js";

const CIUDAD_POR_DEFECTO = "Manizales";

// Filtros "vacíos": sirven de base para pedir solo lo que necesitamos
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

export default function Inicio({ textos, idioma, onBuscar, onExplorarCategoria }) {
  const ingles = idioma === "en";
  const textosInicio = textos?.paginas?.inicio;

  // La ciudad se elige en el buscador del hero y también cambia "Próximamente en ..."
  const [ciudad, setCiudad] = useState(CIUDAD_POR_DEFECTO);
  // Categoría elegida en los chips del móvil: filtra los destacados
  const [categoria, setCategoria] = useState("todas");

  const destacados = useApi("/eventos/destacados");
  const ciudades = useApi("/ciudades");
  const categorias = useApi("/categorias");
  // Todos los eventos ordenados por fecha (para "Este fin de semana" y "Próximamente")
  const todos = useEventos("fecha");
  const limites = limitesDePrecio(todos.eventos);

  const eventosDestacados = destacados.datos?.datos ?? [];
  // El diseño muestra "Festival Niebla 2026" en el hero
  const principal =
    eventosDestacados.find((evento) => evento.slug === "festival-niebla-2026") ??
    eventosDestacados[1] ??
    eventosDestacados[0];

  const destacadosVisibles =
    categoria === "todas"
      ? eventosDestacados
      : eventosDestacados.filter((evento) => evento.categoria === categoria);

  // Solo eventos que todavía no han pasado
  const ahora = Date.now();
  const futuros = todos.eventos.filter((evento) => new Date(evento.fecha).getTime() >= ahora);

  // "Este fin de semana": máximo 3. Si ese fin de semana no tiene eventos, los 3 próximos.
  const delFinDeSemana = filtrarEventos(todos.eventos, { ...SIN_FILTROS, fecha: "finde" }, limites);
  const eventosFinDeSemana = (delFinDeSemana.length > 0 ? delFinDeSemana : futuros).slice(0, 3);

  // "Próximamente en {ciudad}": los próximos 4 eventos de la ciudad elegida
  const eventosProximos = filtrarEventos(futuros, { ...SIN_FILTROS, ciudad }, limites).slice(0, 4);

  // Textos: la clave en la API es "proximos" (no "proximamente")
  const plantillaTitulo =
    textosInicio?.proximos?.titulo ?? (ingles ? "Coming soon in {ciudad}" : "Próximamente en {ciudad}");
  const tituloProximamente = plantillaTitulo.replace("{ciudad}", ciudad);
  const subtituloProximamente =
    textosInicio?.proximos?.subtitulo ??
    (ingles ? "Change the city from the search bar" : "Cambia la ciudad desde el buscador");

  return (
    <>
      <Hero
        textos={textos}
        idioma={idioma}
        evento={principal}
        ciudades={ciudades.datos?.datos ?? []}
        ciudad={ciudad}
        onCiudad={setCiudad}
        onBuscar={onBuscar}
      />

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

      <SeccionEventos
        id="destacados"
        titulo={textosInicio?.destacados?.titulo ?? (ingles ? "Featured this week" : "Destacados de la semana")}
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
      />

      <ListaFinDeSemana
        textos={textos}
        idioma={idioma}
        eventos={eventosFinDeSemana}
        cargando={todos.cargando}
        onVerTodos={() => onBuscar?.()}
      />

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
      />
    </>
  );
}