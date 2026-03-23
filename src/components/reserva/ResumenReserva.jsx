import { useState } from "react";

function ResumenReserva({
  selecciones,
  eliminarHorario,
  cliente,
  sugerencias,
  handleClienteChange,
  setCliente,
  handleConfirmarReserva,
}) {
  const hayTurnos = Object.keys(selecciones).length > 0;

  if (!hayTurnos) return null;

  function renderResumen() {
    return Object.entries(selecciones)
      .sort(([fechaA], [fechaB]) => new Date(fechaA) - new Date(fechaB))
      .map(([fecha, canchas]) => (
        <div
          key={fecha}
          className="mb-2 p-2 rounded-md border border-gray-200 bg-white/60"
        >
          {/* FECHA */}
          <div className="font-semibold text-sm mb-2 flex items-center gap-2">
            <span>📅</span>
            <span>
              {new Date(fecha + "T00:00:00").toLocaleDateString("es-AR")}
            </span>
          </div>

          {/* CANCHAS */}
          {Object.entries(canchas)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([cancha, horarios]) => (
              <div key={cancha} className="mb-2">
                <div className="text-sm font-medium text-gray-700 mb-1">
                  {cancha}
                </div>

                <div className="flex flex-wrap gap-2">
                  {horarios
                    .slice()
                    .sort()
                    .map((hora) => (
                      <div
                        key={hora}
                        className="flex items-center bg-red-100 text-red-800 px-2 py-[2px] rounded text-xs"
                      >
                        {hora}
                        <button
                          onClick={() => eliminarHorario(fecha, cancha, hora)}
                          className="ml-2 flex items-center justify-center w-4 h-4 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>
      ));
  }

  const [indiceActivo, setIndiceActivo] = useState(-1);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

  // Funcion para manejar los clientes con click seleccionar con enter etc
  function handleKeyDown(e) {
    if (sugerencias.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndiceActivo((prev) => (prev < sugerencias.length - 1 ? prev + 1 : 0));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndiceActivo((prev) => (prev > 0 ? prev - 1 : sugerencias.length - 1));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (indiceActivo >= 0) {
        const seleccionado = sugerencias[indiceActivo];
        setCliente({
          nombre: seleccionado.nombre,
          apellido: seleccionado.apellido,
          telefono: seleccionado.telefono,
        });
        setIndiceActivo(-1);
        setMostrarSugerencias(false);
      }
    }

    if (e.key === "Escape") {
      setIndiceActivo(-1);
      setMostrarSugerencias(false);
    }
  }

  return (
    <div className="w-full mt-6">
      <div
        style={{
          padding: "16px",
          border: "1px solid rgba(0,0,0,0.1)",
          borderRadius: "10px",
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(4px)",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col h-full">
            {/* Título + contador */}
            <div className="mb-3">
              <h3 className="font-semibold text-base flex items-center">
                🎾 Resumen de la reserva
              </h3>

              <p className="text-xs text-gray-600">
                {Object.values(selecciones).reduce(
                  (acc, canchas) =>
                    acc +
                    Object.values(canchas).reduce(
                      (sum, horarios) => sum + horarios.length,
                      0
                    ),
                  0
                )}{" "}
                turnos seleccionados
              </p>
            </div>

            {/* Scroll interno */}
            <div className="h-40 overflow-y-auto pr-2 space-y-2">
              {renderResumen()}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-3">Datos del cliente:</h3>

            <div className="mt-7 space-y-3">
              <div className="relative">
                <input
                  name="nombre"
                  autoComplete="off"
                  placeholder="Nombre"
                  value={cliente.nombre}
                  onChange={(e) => {
                    handleClienteChange(e);
                    setIndiceActivo(-1);
                    setMostrarSugerencias(true);
                  }}
                  onFocus={() => {
                    if (sugerencias.length > 0) {
                      setMostrarSugerencias(true);
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  className="w-full border rounded px-2 py-1"
                />

                {mostrarSugerencias && sugerencias.length > 0 && (
                  <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
                    {sugerencias.map((s, index) => (
                      <div
                        key={s.id}
                        className={`px-3 py-2 cursor-pointer text-sm ${
                          index === indiceActivo
                            ? "bg-blue-600 text-white"
                            : "hover:bg-gray-100"
                        }`}
                        onMouseEnter={() => setIndiceActivo(index)}
                        onClick={() => {
                          setCliente({
                            nombre: s.nombre,
                            apellido: s.apellido,
                            telefono: s.telefono,
                          });
                          setIndiceActivo(-1);
                          setMostrarSugerencias(false);
                        }}
                      >
                        <span className="font-medium">
                          {s.nombre} {s.apellido}
                        </span>

                        <span
                          className={`block text-xs ${
                            index === indiceActivo
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          {s.telefono}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <input
                name="apellido"
                placeholder="Apellido"
                value={cliente.apellido}
                onChange={handleClienteChange}
                className="w-full border rounded px-2 py-1"
              />

              <input
                name="telefono"
                placeholder="Teléfono"
                value={cliente.telefono}
                onChange={handleClienteChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleConfirmarReserva}
          className="w-full md:w-1/2 mx-auto block mt-6 py-2 bg-green-600 hover:bg-green-700 transition text-white rounded-lg font-medium shadow"
        >
          Confirmar reserva
        </button>
      </div>
    </div>
  );
}

export default ResumenReserva;
