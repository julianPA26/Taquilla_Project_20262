const ICONOS = {
  ticket: { caja: 24, tamano: 20, trazos: <><path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z" /><path d="M14 6v12" strokeDasharray="2 2" /></> },
  buscar: { caja: 16, trazos: <><path d="M12.667 7.333a5.333 5.333 0 1 1-10.667 0 5.333 5.333 0 0 1 10.667 0Z" /><path d="m14 14-2.867-2.867" /></> },
  idioma: { caja: 18, trazos: <><path d="M16.5 9a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" /><path d="M9 1.5A10.9 10.9 0 0 0 6 9a10.9 10.9 0 0 0 3 7.5A10.9 10.9 0 0 0 12 9a10.9 10.9 0 0 0-3-7.5Z" /><path d="M1.5 9h15" /></> },
  flechaAbajo: { caja: 16, trazos: <path d="m4 6 4 4 4-4" /> },
  accesibilidad: { caja: 20, trazos: <><path d="M10.833 4.167a.833.833 0 1 1-1.666 0 .833.833 0 0 1 1.666 0Z" /><path d="m7.5 16.667 2.5-5 2.5 5" /><path d="m5 6.667 5 1.666 5-1.666" /><path d="M10 8.333v3.334" /></> },
  menu: { caja: 24, tamano: 20, trazos: <path d="M4 6h16M4 12h16M4 18h16" /> },
  cerrar: { caja: 24, tamano: 20, trazos: <path d="m6 6 12 12M6 18 18 6" /> },
  favoritos: { caja: 24, tamano: 20, trazos: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" /> },
};

export default function Icono({ nombre }) {
  const icono = ICONOS[nombre];
  if (!icono) return null; // Si el nombre no existe, no dibuja nada en vez de romper la página
  const lado = icono.tamano ?? icono.caja;
  return <svg viewBox={`0 0 ${icono.caja} ${icono.caja}`} width={lado} height={lado} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{icono.trazos}</svg>;
}