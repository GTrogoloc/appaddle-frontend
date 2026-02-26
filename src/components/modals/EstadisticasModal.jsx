import { useState } from "react";

function EstadisticasModal({ mostrarEstadisticas, setMostrarEstadisticas }) {
  const [seccionActiva, setSeccionActiva] = useState("clientes");

  if (!mostrarEstadisticas) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-[95%] max-w-5xl rounded-lg p-6 max-h-[80vh] flex flex-col">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-lg">📊 Estadísticas</h3>
          <button
            onClick={() => setMostrarEstadisticas(false)}
            className="text-red-600 font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {/* TABS PRINCIPALES */}
        <div className="flex gap-3 mb-6 border-b pb-4">

        <button
  onClick={() => setSeccionActiva("clientes")}
  className={`px-4 py-2 rounded-md text-sm transition ${
    seccionActiva === "clientes"
      ? "bg-blue-500/20 text-blue-700 border border-blue-400/40 font-semibold"
      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
  }`}
>
  👥 Clientes
</button>

{/* OCUPACION */}
<button
  onClick={() => setSeccionActiva("ocupacion")}
  className={`px-4 py-2 rounded-md text-sm transition ${
    seccionActiva === "ocupacion"
      ? "bg-[#7a1f2b]/25 text-[#7a1f2b] border border-[#7a1f2b]/40 font-semibold"
      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
  }`}
>
  📊 Ocupación
</button>

{/* INGRESOS */}
<button
  onClick={() => setSeccionActiva("ingresos")}
  className={`px-4 py-2 rounded-md text-sm transition ${
    seccionActiva === "ingresos"
      ? "bg-green-500/20 text-green-700 border border-green-400/40 font-semibold"
      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
  }`}
>
  💰 Ingresos
</button>

</div>

        {/* CONTENIDO DINÁMICO */}
        <div className="flex-1 overflow-y-auto">
        {seccionActiva === "clientes" && (
  <div>

    {/* SUB-OPCIONES */}
    <div className="flex gap-3 mb-6">
      <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm transition">
        🏆 Clientes Más Activos (Últimos 3 meses)
      </button>

      <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm transition">
        😴 Clientes Inactivos
      </button>

      <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm transition">
        🆕 Nuevos Clientes del Mes
      </button>
    </div>

    {/* CONTENIDO TEMPORAL */}
    <div className="bg-gray-50 p-4 rounded-md border">
      <h4 className="font-semibold text-lg mb-2">
        🏆 Clientes Más Activos (Últimos 3 meses)
      </h4>

      <p className="text-gray-600 text-sm">
        Basado en cantidad total de reservas confirmadas.
      </p>

      <div className="mt-4 text-gray-400 text-sm">
        Aquí aparecerá el ranking de los 5 clientes con mayor cantidad de reservas.
      </div>
    </div>

  </div>
)}

          {seccionActiva === "ocupacion" && (
            <div>
              <h4 className="font-semibold mb-3">Sección Ocupación</h4>
              <p className="text-gray-500">
                Aquí mostraremos porcentaje mensual y horarios fuertes.
              </p>
            </div>
          )}

          {seccionActiva === "ingresos" && (
            <div>
              <h4 className="font-semibold mb-3">Sección Ingresos</h4>
              <p className="text-gray-500">
                Aquí mostraremos estadísticas de ingresos cuando agreguemos precios.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default EstadisticasModal;