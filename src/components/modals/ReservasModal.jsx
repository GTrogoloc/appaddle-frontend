import Calendar from "../Calendar";
import { useState,useEffect } from "react";

function ReservasModal({
  mostrarReservas,
  setMostrarReservas,
  reservas,
  busqueda,
  setBusqueda,
  eliminarReserva,
  obtenerEstadoTurno,
  prioridadEstado,
  proximosTurnos,
  fechaFiltro,
  setFechaFiltro,
  mostrarCalendarioFiltro,
  setMostrarCalendarioFiltro,
  setMostrarCanceladas,
  diaFiltro,
  filtroMes,
  filtroAnio
}) {

const [ahora, setAhora] = useState(new Date());

useEffect(() => {
  const intervalo = setInterval(() => {
    setAhora(new Date());
  }, 60000);

  return () => clearInterval(intervalo);
}, []);

  if (!mostrarReservas) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="bg-white w-[95%] max-w-4xl rounded-lg p-4 max-h-[80vh] flex flex-col">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-3">
          
          <h3 className="font-semibold text-lg">Reservas</h3>
          <button
            onClick={() => setMostrarReservas(false)}
            className="text-red-600 font-bold text-lg"
          >
            ✕
          </button>
        </div>

{/* PROXIMOS TURNOS */}
<div className="mb-3 px-3 py-1.5 rounded-md bg-gray-50 border border-gray-200 text-xs text-gray-600 flex items-center gap-3">

  <span className="font-medium text-gray-600">
    ⏱️ Próximos turnos:
  </span>

  {proximosTurnos?.length === 0 && (
    <span className="italic text-gray-400">
      sin turnos próximos
    </span>
  )}

    {proximosTurnos?.map((r, index) => {

      const inicio = new Date(r.fechaHoraInicio);

      const minutosTotales = Math.max(0, Math.floor((inicio - ahora) / 60000));
      const esUrgente = minutosTotales <= 20;
      const horas = Math.floor(minutosTotales / 60);
      const minutos = minutosTotales % 60;

const tiempo =
  horas > 0
    ? `${horas}h ${minutos}min`
    : minutos === 0 ? "ahora" : `${minutos}min`;

    return (
<span key={r.id} className="flex items-center gap-1">
{index !== 0 && <span className="mx-1">•</span>}
   {r.cancha.nombre} en {tiempo}
   {esUrgente && <span className="ml-1 animate-pulse">🔴</span>}
</span>
      );
    })}

  </div>


        {/* FILTROS */}
        <div className="flex gap-4 pb-3 mb-3 border-b">

          {/* FECHA */}
          <div className="relative">
            <label className="block text-xs font-semibold mb-1 text-gray-600">
              Fecha de reserva
            </label>

            <button
              onClick={() => setMostrarCalendarioFiltro(!mostrarCalendarioFiltro)}
              className="border rounded px-3 py-1 bg-white hover:bg-gray-100 flex items-center gap-2"
            >
              <span>{fechaFiltro.toLocaleDateString("es-AR")}</span>
              <span className={`transition-transform ${mostrarCalendarioFiltro ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>

            {mostrarCalendarioFiltro && (
              <div className="absolute left-0 mt-2 z-50 bg-white rounded-lg shadow-lg p-2 scale-90 origin-top-left">
                <Calendar
                  onSelectDates={(fechas) => {
                    if (fechas && fechas.length > 0) {
                      setFechaFiltro(fechas[0]);
                    }
                    setMostrarCalendarioFiltro(false);
                  }}
                />
              </div>
            )}
          </div>

          {/* BUSCADOR */}
          <div className="w-[260px]">
            <label className="block text-xs font-semibold mb-1 text-gray-600">
              Buscar cliente:
            </label>
            <input
              type="text"
              placeholder="Nombre, apellido o teléfono"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          {/* METRICAS */}
          <div className="flex gap-3 items-center">
            <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
              📅 Reservas del Día: {
                reservas.filter((r) => {
                  const f = new Date(r.fechaHoraInicio);
                  return (
                    f.getDate() === diaFiltro &&
                    f.getMonth() + 1 === filtroMes &&
                    f.getFullYear() === filtroAnio
                  );
                }).length
              }
            </div>

            <div className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
              📊 Reservas del Mes: {
                reservas.filter((r) => {
                  const f = new Date(r.fechaHoraInicio);
                  return (
                    f.getMonth() + 1 === filtroMes &&
                    f.getFullYear() === filtroAnio
                  );
                }).length
              }
            </div>
          </div>

          {/* BOTON CANCELADAS */}
          <div className="flex justify-center">
            <button
              onClick={() => setMostrarCanceladas(true)}
              className="mt-1 px-1 py-1 text-sm bg-gray-700 text-white rounded shadow"
            >
              Reservas Canceladas
            </button>
          </div>

        </div>

        {/* COLUMNAS */}
        <div className="grid grid-cols-6 gap-2 text-xs font-semibold border-b pb-2 mb-2">
          <div className="flex items-center gap-1">
            👤 <span>Cliente</span>
          </div>
          <div className="flex items-center gap-1">
            📅 <span>Fecha</span>
          </div>
          <div className="flex items-center gap-1">
            🕒 <span>Hora</span>
          </div>
          <div className="flex items-center gap-1">
            🎾<span>Cancha</span>
          </div>
          <div className="flex items-center gap-1">
            ☎️<span>Teléfono</span>
          </div>

          <div className="flex items-center justify-start pl-3 gap-1">
            🗑️ <span>Eliminar</span>
          </div>
        </div>

        {/* LISTA */}
        <div className="flex-1 overflow-y-auto">

          {reservas
            .filter((r) => {
              if (r.estado === "CANCELADA") return false;

              const fecha = new Date(r.fechaHoraInicio);
            
              const coincideFecha =
                fecha.getDate() === diaFiltro &&
                fecha.getMonth() + 1 === filtroMes &&
                fecha.getFullYear() === filtroAnio;
            
              const texto = busqueda.toLowerCase();
            
              const coincideBusqueda =
                r.nombre.toLowerCase().includes(texto) ||
                r.apellido.toLowerCase().includes(texto) ||
                r.telefono.includes(texto);
            
              // 🔎 Si hay búsqueda → mostrar reservas HOY o FUTURAS del cliente
              if (busqueda !== "") {
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);
            
                return coincideBusqueda && fecha >= hoy;
              }
            
              // 📅 Si no hay búsqueda → mostrar solo el día seleccionado
              return coincideFecha;

            })
            .sort((a, b) => {
              const estadoA = obtenerEstadoTurno(a);
              const estadoB = obtenerEstadoTurno(b);

              const prioridadA = prioridadEstado(estadoA);
              const prioridadB = prioridadEstado(estadoB);

              if (prioridadA !== prioridadB) {
                return prioridadA - prioridadB;
              }

              return new Date(a.fechaHoraInicio) - new Date(b.fechaHoraInicio);
            })
            .map((r) => {
              const estado = obtenerEstadoTurno(r);

              return (
                <div
                  key={r.id}
                  className={`grid grid-cols-6 gap-2 items-center text-sm border-b py-2
    ${estado === "EN_JUEGO" ? "bg-green-100" : ""}
    ${estado === "PROXIMO" ? "bg-yellow-100" : ""}
    ${estado === "RESERVADA" ? "bg-gray-50" : ""}
    ${estado === "FINALIZADA" ? "bg-red-100" : ""}
  `}
                >
                  <div className="flex flex-col">
                    <span>{r.nombre} {r.apellido}</span>

                    <div className="flex items-center gap-2 text-xs mt-1">
                      <span
                        className={`w-2 h-2 rounded-full
        ${estado === "EN_JUEGO" ? "bg-green-600" : ""}
        ${estado === "PROXIMO" ? "bg-yellow-600" : ""}
        ${estado === "FINALIZADA" ? "bg-red-600" : ""}
        ${estado === "RESERVADA" ? "bg-blue-600" : ""}
      `}
                      ></span>

                      <span
                        className={`
        ${estado === "EN_JUEGO" ? "text-green-700" : ""}
        ${estado === "PROXIMO" ? "text-yellow-700" : ""}
        ${estado === "FINALIZADA" ? "text-red-700" : ""}
        ${estado === "RESERVADA" ? "text-blue-700" : ""}
      `}
                      >
                        {estado === "EN_JUEGO" && "En juego ✔️"}
                        {estado === "PROXIMO" && "Próximo turno ⏳"}
                        {estado === "FINALIZADA" && "Finalizada 🛑"}
                        {estado === "RESERVADA" && "Reservada 🕒"}
                      </span>
                    </div>
                  </div>
                  <div>{new Date(r.fechaHoraInicio).toLocaleDateString("es-AR")}</div>
                  <div>
                    <div>
                      {new Date(r.fechaHoraInicio).toLocaleTimeString("es-AR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  <div className="pl-5">
                    {r.cancha.nombre}
                  </div>

                  <div className="flex items-center gap-1">
                    <span>📲</span>
                    <a
                      href={`tel:${r.telefono}`}
                      className="text-blue-600 hover:underline"
                    >
                      {r.telefono}
                    </a>
                  </div>
                  <div className="flex justify-end pr-6">
  {estado !== "FINALIZADA" && (
    <button
      type="button"
      onClick={() => eliminarReserva(r.id)}
      className="px-3 py-1.5 text-xs bg-red-600 text-white rounded"
    >
      ¿Eliminar?
    </button>
  )}
</div>
                </div>
              );
            })}

          {reservas.length === 0 && (
            <p className="text-center text-red-500 mt-4">
              No hay reservas
            </p>
          )}

        </div>

      </div>
    </div>
  );
}

export default ReservasModal;