import { useState } from "react";
import { useApi } from "../hooks/useApi.js";
import Hero from "../components/Hero/Hero.jsx";
import Categorias from "../components/Categorias/Categorias.jsx";
import Destacados from "../components/Destacados/Destacados.jsx";
import { useEventos } from "../hooks/useEvento.js";
import { filtrarEventos, limitesDePrecio } from "../Utils/filtros.js";
import SeccionEventos from "../components/SeccionEventos/SeccionEventos.jsx";
import ListaFinDeSemana from "../components/ListaFinDeSemana/Listafindesemana.jsx";

export default function Inicio({ textos, idioma, onBuscar }) {
  const destacados = useApi("/eventos/destacados");
  const ciudades = useApi("/ciudades");
  const categorias = useApi("/categorias");
  const [categoria, setCategoria] = useState("todas");

  const eventos = destacados.datos?.datos ?? [];
  const principal =
    eventos.find((evento) => evento.slug === "festival-niebla-2026") ?? eventos[1];
  console.log("categorias:", categorias);

  // Dentro del componente. Recibe también onExplorarCategoria desde App.
  const [ciudad, setCiudad] = useState("Manizales");
  const todos = useEventos("fecha");
  const limites = limitesDePrecio(todos.eventos);
  const textosInicio = textos?.paginas?.inicio;

  const eventosFinDeSemana = filtrarEventos(
    todos.eventos,
    { categorias: [], ciudad: "", q: "", fecha: "fin" },
    limites,
  );
  const eventosProximos = filtrarEventos(
    todos.eventos,
    { categorias: [], ciudad, q: "", fecha: "" },
    limites,
  );

  const plantillaTitulo = textosInicio?.proximamente?.titulo ?? "Próximamente en {ciudad}";
  const tituloProximamente = plantillaTitulo.replace("{ciudad}", ciudad);

  return (
    <>
      <Hero
        textos={textos}
        idioma={idioma}
        evento={principal}
        ciudades={ciudades.datos?.datos ?? []}
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
      />
      <SeccionEventos
        id="destacados"
        titulo={textosInicio?.destacados?.titulo ?? "Destacados de la semana"}
        tituloMovil={textosInicio?.destacados?.tituloMovil ?? "Destacados"}
        subtitulo={textosInicio?.destacados?.subtitulo}
        eventos={eventos}
        cargando={destacados.cargando}
        error={destacados.error}
        recargar={destacados.recargar}
        textos={textos}
        idioma={idioma}
        onVerTodos={() => onBuscar()}
      />

      <ListaFinDeSemana
        textos={textos}
        idioma={idioma}
        eventos={eventosFinDeSemana}
        cargando={todos.cargando}
        onVerTodos={() => onBuscar()}
      />

      <SeccionEventos
        id="proximamente"
        titulo={tituloProximamente}
        subtitulo={textosInicio?.proximamente?.subtitulo}
        eventos={eventosProximos}
        cargando={todos.cargando}
        error={todos.error}
        recargar={todos.recargar}
        textos={textos}
        idioma={idioma}
        soloEscritorio
        onVerTodos={() => onBuscar("", ciudad)}
      />
    </>
  );
}