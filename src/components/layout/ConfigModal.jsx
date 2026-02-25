import { useState } from "react";

const COLOR_DEFAULT = "#7a1f2b";
const COLOR_TEXTO_DEFAULT = "#ffffff";
const NOMBRE_DEFAULT = "TURNERO PADEL - PCG Developer";

function ConfigModal({ nombreClub, setNombreClub, cerrar }) {
  const [nuevoNombre, setNuevoNombre] = useState(nombreClub);

  function guardar() {
    if (!nuevoNombre.trim()) return;

    localStorage.setItem("nombreClub", nuevoNombre);
    setNombreClub(nuevoNombre);
    cerrar();
  }

  function restaurarDefault() {
    // Restaurar nombre
    setNombreClub(NOMBRE_DEFAULT);
    setNuevoNombre(NOMBRE_DEFAULT);
    localStorage.removeItem("nombreClub");

    // Restaurar fondo header
    document.documentElement.style.setProperty(
      "--color-header",
      COLOR_DEFAULT
    );
    localStorage.removeItem("colorHeader");

    // Restaurar color texto header
    document.documentElement.style.setProperty(
      "--color-header-texto",
      COLOR_TEXTO_DEFAULT
    );
    localStorage.removeItem("colorHeaderTexto");
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-80 shadow-lg">

        <h2 className="text-lg font-semibold mb-4">
          Configuración
        </h2>

        {/* NOMBRE */}
        <label className="text-sm block mb-1">
          Nombre del club
        </label>

        <input
          type="text"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        {/* COLOR FONDO HEADER */}
        <label className="text-sm block mb-1">
          Color barra de navegación
        </label>

        <input
          type="color"
          defaultValue={
            localStorage.getItem("colorHeader") || COLOR_DEFAULT
          }
          onChange={(e) => {
            const nuevoColor = e.target.value;

            document.documentElement.style.setProperty(
              "--color-header",
              nuevoColor
            );

            localStorage.setItem("colorHeader", nuevoColor);
          }}
          className="w-full h-10 mb-4 cursor-pointer"
        />

        {/* COLOR TEXTO HEADER */}
        <label className="text-sm block mb-1">
          Color del texto e iconos de navegación
        </label>

        <input
          type="color"
          defaultValue={
            localStorage.getItem("colorHeaderTexto") ||
            COLOR_TEXTO_DEFAULT
          }
          onChange={(e) => {
            const nuevoColorTexto = e.target.value;

            document.documentElement.style.setProperty(
              "--color-header-texto",
              nuevoColorTexto
            );

            localStorage.setItem(
              "colorHeaderTexto",
              nuevoColorTexto
            );
          }}
          className="w-full h-10 mb-4 cursor-pointer"
        />

        {/* RESTAURAR */}
        <button
          onClick={restaurarDefault}
          className="text-sm text-red-600 hover:underline mb-4"
        >
          Restaurar valores por defecto
        </button>

        {/* BOTONES */}
        <div className="flex justify-end gap-2">
          <button
            onClick={cerrar}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Cancelar
          </button>

          <button
            onClick={guardar}
            className="px-3 py-1 bg-[#7a1f2b] text-white rounded"
          >
            Guardar
          </button>
        </div>

      </div>
    </div>
  );
}

export default ConfigModal;