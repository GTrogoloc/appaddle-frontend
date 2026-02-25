function HorariosCancha({
    cancha,
    HORARIOS,
    diaActivo,
    selecciones,
    toggleHorario,
    estaOcupado,
    turnoFinalizado,
    tooltipHora,
    setTooltipHora,
    keyDia
  }) {
    if (!diaActivo) return null;
  
    const diaKey = keyDia(diaActivo);
    const seleccionados = selecciones[diaKey]?.[cancha] || [];
  
    return (
      <div className="flex flex-wrap gap-2 justify-start">
        {HORARIOS.map((hora) => {
          const finalizado = turnoFinalizado(hora);
          const ocupado = estaOcupado(cancha, hora);
          const seleccionado = seleccionados.includes(hora);
  
          return (
            <div
              key={hora}
              style={{ position: "relative", display: "inline-block" }}
              onMouseEnter={() => setTooltipHora(hora)}
              onMouseLeave={() => setTooltipHora(null)}
            >
<button
  onClick={() => {
    if (ocupado || finalizado) return;
    toggleHorario(cancha, hora);
  }}
  style={{
    padding: "7px 12px",
    borderRadius: "2px",
    border: "none",
    cursor: "pointer", // 👈 ACA ESTA EL CAMBIO
    background: ocupado
      ? "#d32f2f"
      : finalizado
      ? "#8f8f8f"
      : seleccionado
      ? "#FF9800"
      : "#4CAF50",
    color: ocupado
      ? "#fff"
      : finalizado
      ? "#000"
      : "#fff",
  }}
>
  {hora}
</button>
  
              {tooltipHora === hora && (
  <span
    style={{
      position: "absolute",
      bottom: "-22px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "#333",
      color: "#fff",
      fontSize: "10px",
      padding: "2px 6px",
      borderRadius: "4px",
      whiteSpace: "nowrap",
      pointerEvents: "none",
      zIndex: 10,
    }}
  >
    {ocupado
      ? "Reservado"
      : finalizado
      ? "Horario finalizado"
      : "Disponible"}
  </span>
)}
            </div>
          );
        })}
      </div>
    );
  }
  
  export default HorariosCancha;