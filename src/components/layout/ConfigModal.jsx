import { useState, useEffect } from "react";

const COLOR_DEFAULT = "#7a1f2b";
const COLOR_TEXTO_DEFAULT = "#ffffff";
const NOMBRE_DEFAULT = "TURNERO PADEL - PCG Developer";


function ConfigModal({ nombreClub, setNombreClub, cerrar, cargarCanchas, canchas }) {
  const [nuevoNombre, setNuevoNombre] = useState(nombreClub);
  const [nuevaCancha, setNuevaCancha] = useState("");

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

  async function agregarCancha() {
    if (!nuevaCancha.trim()) return;
  
    try {
      await fetch("http://localhost:8080/canchas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nuevaCancha })
      });
  
      await cargarCanchas(); // 🔥 actualiza Dashboard
      setNuevaCancha("");
  
    } catch (error) {
      console.error(error);
    }
  }

  async function eliminarCancha(id) {
    if (!window.confirm("¿Seguro que querés desactivar esta cancha?"))
      return;
  
    try {
      await fetch(`http://localhost:8080/canchas/${id}`, {
        method: "DELETE"
      });
  
      await cargarCanchas(); // 🔥 sincroniza todo
  
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
     

        <h2 className="text-lg font-semibold mb-4">
          Configuración
        </h2>
       
       {/* BLOQUE DE APARIENCIA */}
        <div className="bg-gray-50 border rounded-lg p-4 mb-6">

<h3 className="text-sm font-semibold mb-3 text-gray-700">
🎨 Configurar Apariencia 
</h3>

        {/* NOMBRE */}
        <label className="text-sm block mb-1">
          Nombre del club:
        </label>

        <input
          type="text"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        {/* COLOR FONDO HEADER */}
        <div className="flex items-center justify-between mb-4">
  <label className="text-sm">
    Color barra de navegación:
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
    className="w-8 h-6 cursor-pointer border border-gray-300 rounded"
  />
</div>

        {/* COLOR TEXTO HEADER */}
        <div className="flex items-center justify-between mb-4">
  <label className="text-sm">
    Color del texto e iconos:
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
    className="w-8 h-6 cursor-pointer border border-gray-300 rounded"
  />
</div>

        {/* RESTAURAR */}
        <button
          onClick={restaurarDefault}
          className="text-sm text-red-600 hover:underline mb-4"
        >
          Restaurar valores por defecto
        </button>
        </div>

        {/* BLOQUE GESTIÓN DE CANCHAS */}
<div className="bg-gray-50 border rounded-lg p-4 mb-4">

<h3 className="text-sm font-semibold mb-3 text-gray-700">
🎾 Gestión de Canchas (Agregar o Eliminar)
</h3>

<div className="flex gap-2">

  
  <input
    type="text"
    value={nuevaCancha}
    onChange={(e) => setNuevaCancha(e.target.value)}
    placeholder="Nombre nueva cancha"
    className="flex-1 border rounded px-2 py-1"
  />

  <button
    onClick={agregarCancha}
    className="bg-green-600 text-white px-3 rounded"
  >
    +
  </button>
</div>
  {/* LISTA */}
  <div className="mt-4 max-h-36 overflow-y-auto text-sm border-t pt-3">
  {canchas.length === 0 && (
    <p className="text-gray-500 text-xs">
      No hay canchas registradas
    </p>
  )}

  {canchas.map((c) => (
    <div
      key={c.id}
      className="flex justify-between items-center mb-2"
    >
      <span>{c.nombre}</span>

      <button
        onClick={() => eliminarCancha(c.id)}
        className="text-red-600 hover:text-red-800"
      >
        ❌
      </button>
    </div>
  ))}
</div>
</div>


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