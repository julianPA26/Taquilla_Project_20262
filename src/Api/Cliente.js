export const BASE_API = "https://yanethm-taquilla-api.fly.dev/api/v1";

export async function pedirJson(ruta, senal) {
    const respuesta = await fetch(`${BASE_API}${ruta}`, { signal: senal });
    if (!respuesta.ok) {
        throw new Error(`HTTP ${respuesta.status} en ${ruta}`);
    }
    return respuesta.json();
}