function ReservasCanceladasModal({
    mostrarCanceladas,
    setMostrarCanceladas,
    reservas,
    formatearFecha
  }) {
    if (!mostrarCanceladas) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        
        <div className="bg-white w-[95%] max-w-5xl rounded-lg p-4 max-h-[80vh] flex flex-col">
  
          {/* HEADER */}
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg text-red-600">
              Reservas Canceladas
            </h3>
            <button
              onClick={() => setMostrarCanceladas(false)}
              className="text-red-600 font-bold text-lg"
            >
              ✕
            </button>
          </div>
  
          {/* COLUMNAS */}
          <div className="grid grid-cols-7 gap-2 text-xs font-semibold border-b pb-2 mb-2">
            <div>Cliente</div>
            <div>Fecha Turno</div>
            <div>Hora Turno</div>
            <div>Cancha</div>
            <div>Teléfono</div>
            <div>Fecha Cancelación</div>
            <div>Hora Cancelación</div>
          </div>
  
          {/* LISTA */}
          <div className="flex-1 overflow-y-auto">
            {reservas
              .filter((r) => r.estado === "CANCELADA")
              .sort(
                (a, b) =>
                  new Date(b.fechaCancelacion) - new Date(a.fechaCancelacion)
              )
              .map((r) => (
                <div
                  key={r.id}
                  className="grid grid-cols-7 gap-2 items-center text-sm border-b py-2 bg-red-50"
                >
                  <div>{r.nombre} {r.apellido}</div>
                  <div>{formatearFecha(r.fechaHoraInicio)}</div>
                  <div>{formatearFecha(r.fechaHoraInicio, true)}</div>
                  <div>{r.cancha.nombre}</div>
                  <div>{r.telefono}</div>
                  <div className="text-red-700 font-semibold">
                    {formatearFecha(r.fechaCancelacion)}
                  </div>
                  <div className="text-red-700 font-semibold">
                    {formatearFecha(r.fechaCancelacion, true)}
                  </div>
                </div>
              ))}
  
            {reservas.filter((r) => r.estado === "CANCELADA").length === 0 && (
              <p className="text-center text-gray-500 mt-4">
                No hay reservas canceladas
              </p>
            )}
          </div>
  
        </div>
      </div>
    );
  }
  
  export default ReservasCanceladasModal;