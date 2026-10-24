// "140000" -> "$140.000"
export function formatearPrecio(valor) {
    const numero = new Intl.NumberFormat("es-CO", {
        maximumFractionDigits: 0,
    }).format(valor);
    return `$${numero}`;
}

// "2026-11-21T01:00:00.000Z" -> "Vie 20 nov" (hora de Colombia)
export function formatearFechaCorta(fechaISO, idioma = "es") {
    const ingles = idioma === "en";
    const partes = new Intl.DateTimeFormat(ingles ? "en-US" : "es-CO", {
        weekday: "short",
        day: "numeric",
        month: "short",
        timeZone: "America/Bogota",
    }).formatToParts(new Date(fechaISO));

    function tomar(tipo) {
        const valor = partes.find((parte) => parte.type === tipo)?.value ?? "";
        return valor.replace(".", "");
    }

    const dia = tomar("weekday");
    const diaCapitalizado = dia.charAt(0).toUpperCase() + dia.slice(1);
    const numero = tomar("day");
    const mes = tomar("month");

    return ingles
        ? `${diaCapitalizado} ${mes} ${numero}`
        : `${diaCapitalizado} ${numero} ${mes}`;
}