function ResumenReserva({
    selecciones,
    eliminarHorario,
    cliente,
    sugerencias,
    handleClienteChange,
    setCliente,
    handleConfirmarReserva
  }) {
  
    const hayTurnos = Object.keys(selecciones).length > 0;
  
    if (!hayTurnos) return null;
  
    function renderResumen() {
      return Object.entries(selecciones)
        .sort(([fechaA], [fechaB]) => new Date(fechaA) - new Date(fechaB))
        .map(([fecha, canchas]) => (
          <div key={fecha} style={{ marginBottom: "10px" }}>
            <strong>
              📅 {new Date(fecha + "T00:00:00").toLocaleDateString("es-AR")}
            </strong>
  
            {Object.entries(canchas)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([cancha, horarios]) => (
                <div key={cancha} style={{ marginLeft: "15px" }}>
                  <strong>{cancha}:</strong>{" "}
                  {horarios
                    .slice()
                    .sort()
                    .map((hora) => (
                      <span key={hora} style={{ marginRight: "8px" }}>
                        {hora}
                        <button
                          onClick={() =>
                            eliminarHorario(fecha, cancha, hora)
                          }
                          style={{
                            marginLeft: "3px",
                            background: "red",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            cursor: "pointer",
                            fontSize: "11px",
                          }}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                </div>
              ))}
          </div>
        ));
    }
  
    return (
      <div className="w-full mt-6">
        <div
          style={{
            padding: "16px",
            border: "2px solid #ccc",
            borderRadius: "10px",
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  
            <div>
              <h3 className="mb-2 font-semibold">Resumen de la reserva:</h3>
              {renderResumen()}
            </div>
  
            <div>
              <h3 className="mb-2 font-semibold">Datos del cliente:</h3>
  
              <input
                name="nombre"
                placeholder="Nombre"
                value={cliente.nombre}
                onChange={handleClienteChange}
                className="w-full mb-2 border rounded px-2 py-1"
              />
  
              {sugerencias.length > 0 && (
                <div className="border rounded bg-white shadow mb-2">
                  {sugerencias.map((s) => (
                    <div
                      key={s.id}
                      className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setCliente({
                          nombre: s.nombre,
                          apellido: s.apellido,
                          telefono: s.telefono,
                        });
                      }}
                    >
                      {s.nombre} {s.apellido}
                    </div>
                  ))}
                </div>
              )}
  
              <input
                name="apellido"
                placeholder="Apellido"
                value={cliente.apellido}
                onChange={handleClienteChange}
                className="w-full mb-2 border rounded px-2 py-1"
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
  
          <button
            onClick={handleConfirmarReserva}
            className="block mx-auto mt-4 px-6 py-2 bg-green-600 text-white rounded"
          >
            Confirmar reserva
          </button>
        </div>
      </div>
    );
  }
  
  export default ResumenReserva;
