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
  keyDia,
}) {
  if (!diaActivo) return null;

  const diaKey = keyDia(diaActivo);
  const seleccionados = selecciones[diaKey]?.[cancha] || [];
  console.log(HORARIOS);
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(50px,1fr))] gap-2">
      {HORARIOS.map((hora) => {
        const finalizado = turnoFinalizado(hora);
        const ocupado = estaOcupado(cancha, hora);
        const seleccionado = seleccionados.includes(hora);

        return (
          <div
            key={hora}
            className="relative"
            onMouseEnter={() => setTooltipHora(hora)}
            onMouseLeave={() => setTooltipHora(null)}
          >
            <button
              onClick={() => {
                if (ocupado || finalizado) return;
                toggleHorario(cancha, hora);
              }}
              style={{
                padding: "4px 8px",
                minWidth: "50px",
                borderRadius: "2px",
                fontWeight: "500",
                border: "none",
                cursor: "pointer",
                background: ocupado
                  ? "#d32f2f"
                  : finalizado
                  ? "#8f8f8f"
                  : seleccionado
                  ? "#FF9800"
                  : "#4CAF50",
                color: ocupado ? "#fff" : finalizado ? "#000" : "#fff",
              }}
            >
              {hora}
            </button>

            {tooltipHora === hora && (
              <span
                style={{
                  position: "absolute",
                  top: "30px",
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
                  ? "Ocupado"
                  : finalizado
                  ? "No Disponible"
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
