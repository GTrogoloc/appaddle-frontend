import HorariosCancha from "./HorariosCancha";
import { keyDia } from "../../utils/reservaUtils";
import ResumenReserva from "./ResumenReserva";

function FechasHorarios({
  diasSeleccionados,
  diaActivo,
  setDiaActivo,
  HORARIOS,
  selecciones,
  toggleHorario,
  estaOcupado,
  turnoFinalizado,
  tooltipHora,
  setTooltipHora,
  cliente,
  sugerencias,
  handleClienteChange,
  setCliente,
  handleConfirmarReserva,
  eliminarHorario,
  canchas
}) {
  if (diasSeleccionados.length === 0) return null;

  return (
    <div className="flex flex-col h-full min-h-0">
  
      {/* TITULO */}
      <div className="w-full mt-4 mb-3 flex justify-center md:justify-start">
        <span className="inline-block bg-[#7a1f2b] text-white px-20 py-1 rounded-md text-sm font-semibold">
          FECHAS Y HORARIOS
        </span>
      </div>
  
      {/* CONTENIDO */}
      <div className="flex flex-col flex-1 min-h-0">
  
        {/* BOTONES DE FECHA */}
        <div className="flex flex-wrap gap-2 mb-3">
          {diasSeleccionados.map((dia) => (
            <button
              key={dia.getTime()}
              onClick={() => setDiaActivo(dia)}
              style={{
                padding: "6px 12px",
                borderRadius: "2px",
                border: "none",
                cursor: "pointer",
                fontWeight: "500",
                background:
                  diaActivo?.getTime() === dia.getTime()
                    ? "#e53935"
                    : "#eee",
                color:
                  diaActivo?.getTime() === dia.getTime()
                    ? "#fff"
                    : "#000",
              }}
            >
              {dia.toLocaleDateString("es-AR")}
            </button>
          ))}
        </div>
  
        {diaActivo && (
          <>
            {/* SCROLL SOLO PARA CANCHAS */}
            <div
  className="overflow-y-auto pr-2"
  style={{ maxHeight: "220px" }}
>
  
              {canchas.map((cancha) => (
                <div
                  key={cancha.id}
                  className="mb-3 bg-white/70 p-2 rounded-md shadow-sm"
                >
                  <h4 className="mb-3 font-semibold text-black">
                    {cancha.nombre}
                  </h4>
  
                  <HorariosCancha
                    cancha={cancha.nombre}
                    HORARIOS={HORARIOS}
                    diaActivo={diaActivo}
                    selecciones={selecciones}
                    toggleHorario={toggleHorario}
                    estaOcupado={estaOcupado}
                    turnoFinalizado={turnoFinalizado}
                    tooltipHora={tooltipHora}
                    setTooltipHora={setTooltipHora}
                    keyDia={keyDia}
                  />
                </div>
              ))}
  
            </div>
  
            {/* RESUMEN FIJO ABAJO */}
            <div className="mt-3 shrink-0">
              <ResumenReserva
                selecciones={selecciones}
                eliminarHorario={eliminarHorario}
                cliente={cliente}
                sugerencias={sugerencias}
                handleClienteChange={handleClienteChange}
                setCliente={setCliente}
                handleConfirmarReserva={handleConfirmarReserva}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FechasHorarios;