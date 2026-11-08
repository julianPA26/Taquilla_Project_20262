// Paletas de los afiches, tomadas de los SVG exportados del Figma.
// Cada paleta es [color1, color2]: el degradado va de color1 a color2.
// La API manda colores muy vivos (verde, naranja, azul...) que NO son los del diseño,
// por eso aquí usamos los del Figma.
export const PALETAS = [
  ["#9F8B88", "#544552"], // 1 · Noche de Salsa Brava
  ["#6984A7", "#19171C"], // 2 · Festival Niebla 2026
  ["#B7A885", "#AF7E78"], // 3 · La casa de los relojes
  ["#4F806B", "#1E3033"], // 4 · Clásico Montaña vs. Río
  ["#A198C3", "#AF7E78"], // 5 · Sinfónica bajo las estrellas (y el afiche grande del hero)
  ["#19171C", "#A198C3"], // 6 · Risas sin filtro
  ["#B17A95", "#B7A885"], // 7 · Jazz en el patio
  ["#1E3033", "#6984A7"], // 8 · El circo de papel
];

// "Clásico Montaña vs. Río" -> "clasico montana vs rio"
function normalizar(texto = "") {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Los 8 eventos que salen en el diseño tienen su paleta exacta
const POR_TITULO = {
  "noche de salsa brava": 0,
  "festival niebla 2026": 1,
  "la casa de los relojes": 2,
  "clasico montana vs rio": 3,
  "sinfonica bajo las estrellas": 4,
  "risas sin filtro": 5,
  "jazz en el patio": 6,
  "el circo de papel": 7,
};

// Devuelve [color1, color2] para un evento.
// `indice` fuerza una paleta concreta (se usa en el afiche grande del hero).
export function paletaDe(evento, indice) {
  if (typeof indice === "number") return PALETAS[indice] ?? PALETAS[0];
  if (!evento) return ["#262626", "#141414"];

  const clave = normalizar(evento.titulo);
  if (clave in POR_TITULO) return PALETAS[POR_TITULO[clave]];

  // Los demás eventos reparten las 8 paletas según su identificador,
  // así todos se ven de la misma familia que el diseño.
  const semilla = String(evento.slug ?? evento.id ?? clave);
  let suma = 0;
  for (const letra of semilla) suma += letra.charCodeAt(0);
  return PALETAS[suma % PALETAS.length];
}
