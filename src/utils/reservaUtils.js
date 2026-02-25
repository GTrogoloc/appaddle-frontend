export function keyDia(fecha) {
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, "0");
    const d = String(fecha.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  
  export function prioridadEstado(estado) {
    switch (estado) {
      case "EN_JUEGO": return 1;
      case "PROXIMO": return 2;
      case "RESERVADA": return 3;
      case "FINALIZADA": return 4;
      default: return 99;
    }
  } 
  
  export function formatearFecha(fecha, conHora = false) {
    if (!fecha) return "-";
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return "-";
  
    return conHora
      ? d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })
      : d.toLocaleDateString("es-AR");
  } 