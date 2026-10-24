import { useApi } from "../hooks/useApi.js";
import Hero from "../components/Hero.jsx";

export default function Inicio({ textos, idioma, onBuscar }) {
  const destacados = useApi("/eventos/destacados");
  const ciudades = useApi("/ciudades");

  const eventos = destacados.datos?.datos ?? [];
  // El diseño muestra "Festival Niebla 2026"; si no está, se usa el primero de la lista
  const principal =
    eventos.find((evento) => evento.slug === "festival-niebla-2026") ?? eventos[0];

  return (
    <Hero
      textos={textos}
      idioma={idioma}
      evento={principal}
      ciudades={ciudades.datos?.datos ?? []}
      onBuscar={onBuscar}
    />
  );
}