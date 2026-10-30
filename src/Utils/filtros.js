const DESFASE_BOGOTA = -5 * 60 * 60 * 1000;
export const PASO_PRECIO = 5000;

function dosDigitos(numero) {
    return String(numero).padStart(2, "0");
}

function aTexto(fecha) {
    return fecha.toISOString().slice(0, 10);
}

function sumarDias(base, dias) {
    const copia = new Date(base);
    copia.setUTCDate(copia.getUTCDate() + dias);
    return copia;
}

export function diaBogota(valor) {
    const fecha = new Date(valor);
    return aTexto(new Date(fecha.getTime() + DESFASE_BOGOTA));
}

export function rangoDeFecha(tipo) {
    const hoy = diaBogota(new Date());
    const [anio, mes, dia] = hoy.split("-").map(Number);
    const base = new Date(Date.UTC(anio, mes - 1, dia));

    if (tipo === "hoy") return [hoy, hoy];

    if (tipo === "finde") {
        // Fin de semana = viernes a domingo
        if (diaSemana === 0) return [hoy, hoy];
        if (diaSemana >= 1 && diaSemana <= 4) {
            return [aTexto(sumarDias(base, 5 - diaSemana)), aTexto(sumarDias(base, 7 - diaSemana))];
        }
        return [hoy, aTexto(sumarDias(base, 7 - diaSemana))];
    }

    if (tipo === "mes") {
        const ultimo = new Date(Date.UTC(anio, mes, 0)).getUTCDate();
        return [`${anio}-${dosDigitos(mes)}-01`, `${anio}-${dosDigitos(mes)}-${dosDigitos(ultimo)}`];
    }

    return null;
}

// Quita tildes y mayúsculas para buscar "salsa" y encontrar "Salsa"
function normalizar(texto = "") {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

// Precio mínimo y máximo de la lista, redondeados a 10.000, para el rango
export function limitesDePrecio(eventos) {
    if (eventos.length === 0) return [0, 0];
    const precios = eventos.map((evento) => evento.precioDesde);
    const minimo = Math.floor(Math.min(...precios) / 10000) * 10000;
    const maximo = Math.ceil(Math.max(...precios) / 10000) * 10000;
    return [minimo, maximo];
}

// Aplica todos los filtros de la pantalla a la lista de eventos
export function filtrarEventos(eventos, filtros, limites) {
    const texto = normalizar(filtros.q);
    const minimo = filtros.precioMin ?? limites[0];
    const maximo = filtros.precioMax ?? limites[1];

    let rango = null;
    if (filtros.fecha === "elegir") {
        rango = [filtros.desde || "0000-01-01", filtros.hasta || "9999-12-31"];
    } else if (filtros.fecha) {
        rango = rangoDeFecha(filtros.fecha);
    }

    return eventos.filter((evento) => {
        if (filtros.categorias.length && !filtros.categorias.includes(evento.categoria)) {
            return false;
        }
        if (filtros.ciudad && evento.recinto?.ciudad !== filtros.ciudad) return false;
        if (texto) {
            const donde = normalizar(`${evento.titulo} ${evento.recinto?.nombre ?? ""}`);
            if (!donde.includes(texto)) return false;
        }
        if (rango) {
            const dia = diaBogota(evento.fecha);
            if (dia < rango[0] || dia > rango[1]) return false;
        }
        if (evento.precioDesde < minimo || evento.precioDesde > maximo) return false;
        return true;
    });
}