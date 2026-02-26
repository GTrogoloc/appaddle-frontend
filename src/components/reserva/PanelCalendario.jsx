import Calendar from "../Calendar";

function PanelCalendario({
  setDiasSeleccionados,
  setMostrarReservas,
  setMostrarEstadisticas,
}) {
  return (
    <div className="dashboard-left">
      <div className="max-w-md mx-auto mt-4">

        {/* TÍTULO */}
        <div className="w-full mb-4 flex justify-center md:justify-start">
          <span className="inline-block bg-[#7a1f2b] text-white px-20 py-1 rounded-md text-sm font-semibold">
            SELECCIONE FECHA A RESERVAR
          </span>
        </div>

        {/* CALENDARIO */}
        <div className="rounded-2xl bg-white p-4 shadow-md">
          <Calendar onSelectDates={setDiasSeleccionados} />
        </div>

        {/* BOTÓN VER RESERVAS */}
        <div className="mt-4">
          <button
            onClick={() => setMostrarReservas(true)}
            className="w-full px-4 py-2 text-sm bg-[#7a1f2b] hover:bg-[#5e1821] text-white rounded shadow transition transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
           📅 Ver reservas
          </button>
        </div>

        {/* BOTÓN ESTADÍSTICAS */}
<div className="mt-2">
  <button
    onClick={() => setMostrarEstadisticas(true)}
    className="w-full px-4 py-2 text-sm bg-blue-700 hover:bg-blue-800 text-white rounded shadow transition transform hover:scale-[1.02] flex items-center justify-center gap-2"
  >
    📊 Estadísticas
  </button>
</div>

      </div>
    </div>
  );
}

export default PanelCalendario;