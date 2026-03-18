import { useState, useEffect } from "react";

const COLOR_DEFAULT = "#7a1f2b";
const COLOR_TEXTO_DEFAULT = "#ffffff";
const NOMBRE_DEFAULT = "TURNERO PADEL - PCG Developer";


function ConfigModal({ nombreClub, setNombreClub, cerrar, cargarCanchas, canchas }) {
  const [nuevoNombre, setNuevoNombre] = useState(nombreClub);
  const [nuevaCancha, setNuevaCancha] = useState("");
  const [configPagos, setConfigPagos] = useState({
    precioTurno: "",
    seniaTurno: "",
    horasCancelacion: ""
  });

 // TRAER CONFIG DEL BACKEND
 useEffect(() => {
  fetch("http://localhost:8080/configuracion-pagos")
    .then(res => res.json())
    .then(data => setConfigPagos(data))
    .catch(err => console.error(err));
}, []);

// HANDLER DE PAGOS
function handleChangePagos(e) {
  setConfigPagos({
    ...configPagos,
    [e.target.name]: e.target.value
  });
}


async function guardar() {
  if (!nuevoNombre.trim()) return;

  localStorage.setItem("nombreClub", nuevoNombre);
  setNombreClub(nuevoNombre);

  try {
    await fetch("http://localhost:8080/configuracion-pagos", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(configPagos)
    });
  } catch (error) {
    console.error(error);
  }

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
  
      await cargarCanchas(); // actualiza Dashboard
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
  
      await cargarCanchas(); // sincroniza todo
  
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[700px] max-h-[80vh] overflow-y-auto shadow-lg">
     

        <h2 className="text-lg font-semibold mb-4">
          Configuración del Sistema
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

{/* IZQUIERDA */}
  <div className="flex flex-col gap-4">

{/* BLOQUE GESTIÓN DE CANCHAS */}
<div className="bg-blue-50/80 border-l-4 border-blue-400 rounded-lg p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-200">

<h3 className="text-base font-semibold mb-3 text-gray-800">
🎾 Gestión de Canchas
</h3>

<div className="flex gap-2">

  <input
    type="text"
    value={nuevaCancha}
    onChange={(e) => setNuevaCancha(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter" && nuevaCancha.trim()) {
        e.preventDefault();
        agregarCancha();
      }
    }}
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

{/* CONFIG DE PAGOS */}
<div className="bg-blue-50/80 border-l-4 border-blue-400 rounded-lg p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-200">

  <h3 className="text-base font-semibold mb-3 text-gray-800">
    💰 Configuración de Pagos
  </h3>

  <div className="space-y-3">

    <div>
      <label className="text-xs text-gray-600">
        💰 Precio total del turno
      </label>

<div className="flex items-center border rounded px-2 py-1 bg-white">
    <span className="text-gray-500 mr-1">$</span>
      <input
        type="number"
        name="precioTurno"
        value={configPagos.precioTurno}
        onChange={handleChangePagos}
        className="w-full outline-none bg-transparent"
      />
    </div>
    </div>

    <div>
      <label className="text-xs text-gray-600">
        💵 Seña requerida para reservar
      </label>

      <div className="flex items-center border rounded px-2 py-1 bg-white">
    <span className="text-gray-500 mr-1">$</span>
      <input
        type="number"
        name="seniaTurno"
        value={configPagos.seniaTurno}
        onChange={handleChangePagos}
        className="w-full outline-none bg-transparent"
      />
    </div>
    </div>

    <div>
      <label className="text-xs text-gray-600">
        ⏱️ Horas límite para pagar antes de cancelar
      </label>
      <input
        type="number"
        name="horasCancelacion"
        value={configPagos.horasCancelacion}
        onChange={handleChangePagos}
        className="w-full border rounded px-2 py-1"
      />
    </div>

  </div>

  {/* ayuda */}
  <p className="text-[11px] text-gray-400 mt-2">
    Si el cliente no paga la seña antes del límite, la reserva se cancela automáticamente.
  </p>

</div>
</div>

{/* DERECHA */}
<div>
{/* BLOQUE DE APARIENCIA */}
<div className="bg-orange-50/80 border-l-4 border-orange-400 rounded-lg p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-200">

<h3 className="text-base font-semibold mb-3 text-gray-800">
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


        {/* BOTONES */}
        <div className="flex justify-center gap-3 mt-4 border-t pt-4">
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
    </div>
    </div>
  );
}

export default ConfigModal;