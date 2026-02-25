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
}) {
  if (diasSeleccionados.length === 0) return null;

  return (
    <div className="dashboard-right flex flex-col mt-4 items-start w-full">

      {/* TITULO */}
      <div className="w-full mb-4 flex justify-center md:justify-start">
        <span className="inline-block bg-[#7a1f2b] text-white px-20 py-1 rounded-md text-sm font-semibold">
          FECHAS Y HORARIOS
        </span>
      </div>

      {/* BOTONES DE FECHA */}
      <div className="w-full">
        <div className="flex flex-wrap gap-2 justify-start">
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
            {/* CANCHA 1 */}
            <div className="mt-3 w-full bg-white/70 p-2 rounded-md shadow-sm">
              <h4 className="mb-4 font-semibold text-black">Cancha 1</h4>
              <HorariosCancha
                cancha="Cancha 1"
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

            {/* CANCHA 2 */}
            <div className="mt-3 w-full bg-white/70 p-2 rounded-md shadow-sm">
              <h4 className="mb-4 font-semibold text-black">Cancha 2</h4>
              <HorariosCancha
                cancha="Cancha 2"
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
        
<ResumenReserva
  selecciones={selecciones}
  eliminarHorario={eliminarHorario}
  cliente={cliente}
  sugerencias={sugerencias}
  handleClienteChange={handleClienteChange}
  setCliente={setCliente}
  handleConfirmarReserva={handleConfirmarReserva}
/>
          </>
        )}
      </div>
    </div>
  );
}

export default FechasHorarios;