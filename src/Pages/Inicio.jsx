import { useState } from "react";
import { useApi } from "../hooks/useApi.js";
import Hero from "../components/Hero.jsx";
import Categorias from "../components/Categorias.jsx";
import Destacados from "../components/Destacados.jsx";

export default function Inicio({ textos, idioma, onBuscar }) {
  const destacados = useApi("/eventos/destacados");
  const ciudades = useApi("/ciudades");
  const categorias = useApi("/categorias");
  // Categoría elegida ("todas" al inicio). Más adelante filtrará los destacados.
  const [categoria, setCategoria] = useState("todas");

  const eventos = destacados.datos?.datos ?? [];
  const principal =
    eventos.find((evento) => evento.slug === "festival-niebla-2026") ?? eventos[1];
  console.log("categorias:", categorias);

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
      <Destacados
        eventos={eventos}
        cargando={destacados.cargando}
        error={destacados.error}
        recargar={destacados.recargar}
        textos={textos}
        idioma={idioma}
      />
    </>
  );
}