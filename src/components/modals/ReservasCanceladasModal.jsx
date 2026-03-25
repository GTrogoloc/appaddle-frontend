function ReservasCanceladasModal({
  mostrarCanceladas,
  setMostrarCanceladas,
  reservas,
  formatearFecha,
}) {
  if (!mostrarCanceladas) return null;

  const hoy = new Date().toLocaleDateString("sv-SE");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-[95%] max-w-5xl rounded-lg p-4 max-h-[80vh] flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg text-red-600">
            Reservas Canceladas ❌
          </h3>
          <button
            onClick={() => setMostrarCanceladas(false)}
            className="text-red-600 font-bold text-lg"
          >
            ✕
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[900px] flex flex-col">
            {/* COLUMNAS */}
            <div className="grid grid-cols-7 gap-2 text-xs font-semibold border-b pb-2 mb-2 text-center sticky top-0 bg-white z-10">
              <div className="text-left pl-2">Cliente</div>
              <div className="text-left pl-7">Fecha Turno</div>
              <div className="text-left pl-9">Hora Turno</div>
              <div className="text-left pl-10">Cancha</div>
              <div className="text-left pl-8">Teléfono</div>
              <div className="text-left pl-2">Fecha Cancelación</div>
              <div className="text-left pl-3">Hora Cancelación</div>
            </div>

            {/* LISTA */}
            <div className="flex-1 overflow-y-auto pr-1">
              {reservas
                .filter((r) => r.estado === "CANCELADA")
                .sort(
                  (a, b) =>
                    new Date(b.fechaCancelacion) - new Date(a.fechaCancelacion)
                )
                .map((r) => {
                  const fechaCancelacion = r.fechaCancelacion?.slice(0, 10);
                  const esHoy = fechaCancelacion === hoy;

                  return (
                    <div
                      key={r.id}
                      className={`grid grid-cols-7 gap-2 items-center text-sm border-b py-2 text-center ${
                        esHoy
                          ? "bg-red-200 border-red-700"
                          : "bg-red-50 border-red-300"
                      }`}
                    >
                      <div className="text-left pl-2">
                        {r.nombre} {r.apellido}
                      </div>
                      <div>{formatearFecha(r.fechaHoraInicio)}</div>
                      <div>{formatearFecha(r.fechaHoraInicio, true)}</div>
                      <div>{r.cancha.nombre}</div>
                      <div>{r.telefono}</div>
                      <div className="text-red-700 font-semibold">
                        {formatearFecha(r.fechaCancelacion)}
                        {esHoy && (
                          <span className="ml-1.5 text-[10px] bg-red-700 text-white px-1.5 py-[1px] rounded ">
                            HOY
                          </span>
                        )}
                      </div>
                      <div className="text-red-700 font-semibold">
                        {formatearFecha(r.fechaCancelacion, true)}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {reservas.filter((r) => r.estado === "CANCELADA").length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No hay reservas canceladas
          </p>
        )}
      </div>
    </div>
  );
}

export default ReservasCanceladasModal;
