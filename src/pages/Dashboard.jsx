import { useState, useEffect } from "react";
import Calendar from "../components/Calendar";
import { obtenerReservas, crearReserva, cancelarReserva } from "../services/reservaService";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";


const HORARIOS = [
  "08:00", "09:30", "11:00", "12:30",
  "14:00", "15:30", "17:00", "18:30",
  "20:00", "21:30", "23:00"
];

const CANCHAS_MAP = {
  "Cancha 1": 1,
  "Cancha 2": 2,
};

// ======================
// UTILIDADES DE FECHA
// ======================
function formatearFecha(fecha, conHora = false) {
  if (!fecha) return "-";

  const d = new Date(fecha);
  if (isNaN(d.getTime())) return "-";

  return conHora
    ? d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString("es-AR");
}

function Dashboard() {
  // ======================
  // ESTADOS
  // ======================
  const navigate = useNavigate();
  const [diasSeleccionados, setDiasSeleccionados] = useState([]);
  const [diaActivo, setDiaActivo] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [selecciones, setSelecciones] = useState({});
  const [mostrarReservas, setMostrarReservas] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const DURACION_TURNO_MINUTOS = 90;
  const [fechaFiltro, setFechaFiltro] = useState(new Date());
  const [mostrarCalendarioFiltro, setMostrarCalendarioFiltro] = useState(false);
  const [mostrarCanceladas, setMostrarCanceladas] = useState(false);
  const [tooltipHora, setTooltipHora] = useState(null);

  const hoy = new Date();
  const anioActual = hoy.getFullYear();
  const [mostrarDias, setMostrarDias] = useState(false);
  const [filtroMes, setFiltroMes] = useState(hoy.getMonth() + 1);
  const [filtroAnio, setFiltroAnio] = useState(hoy.getFullYear());
  const [diaFiltro, setDiaFiltro] = useState(new Date().getDate());
  const diasDelMes = new Date(filtroAnio, filtroMes, 0).getDate();
 
  const aniosDisponibles = [anioActual - 1,
    anioActual,
  anioActual + 1];


const listaDias = Array.from(
  { length: diasDelMes },
  (_, i) => i + 1
);

  const [cliente, setCliente] = useState({
    nombre: "",
    apellido: "",
    telefono: "",

  });

  // ======================
  // PRÓXIMO TURNO
  // ======================
  const ahora = new Date();

  const proximoTurno = reservas
    .filter((r) => new Date(r.fechaHoraInicio) > ahora)
    .sort(
      (a, b) =>
        new Date(a.fechaHoraInicio) - new Date(b.fechaHoraInicio)
    )[0];

  // ======================
  // CARGAR RESERVAS
  // ======================
  useEffect(() => {
    async function cargarReservas() {
      try {
        const token = localStorage.getItem("token");
        const data = await obtenerReservas(token);
        setReservas(data);
      } catch (error) {
        console.error("Error cargando reservas", error);
      }
    }
    cargarReservas();
  }, []);

  // ======================
  // LIMPIAR DIA ACTIVO SI SE DESELECCIONA
  // ======================
  useEffect(() => {
    if (!diaActivo) return;

    const sigueSeleccionado = diasSeleccionados.some(
      (d) => d.getTime() === diaActivo.getTime()
    );

    if (!sigueSeleccionado) {
      setDiaActivo(null);
    }
  }, [diasSeleccionados, diaActivo]);

  useEffect(() => {
    setSelecciones((prev) => {
      const nuevas = {};

      diasSeleccionados.forEach((dia) => {
        const key = keyDia(dia);
        if (prev[key]) {
          nuevas[key] = prev[key];
        }
      });

      return nuevas;
    });
  }, [diasSeleccionados]);


  // ======================
  // ACTIVAR AUTOMÁTICAMENTE EL DÍA SELECCIONADO
  // ======================
  useEffect(() => {
    if (diasSeleccionados.length === 0) {
      setDiaActivo(null);
      return;
    }

    const sigueActivo =
      diaActivo &&
      diasSeleccionados.some(
        (d) => d.getTime() === diaActivo.getTime()
      );

    if (!sigueActivo) {
      setDiaActivo(
        diasSeleccionados[diasSeleccionados.length - 1]
      );
    }
  }, [diasSeleccionados]);

  //RESETEAR MES Y AÑO CADA VEZ QUE ABRO MODAL
  useEffect(() => {
    if (mostrarReservas) {
      const hoy = new Date();
      setDiaFiltro(hoy.getDate());
      setFiltroMes(hoy.getMonth() + 1);
      setFiltroAnio(hoy.getFullYear());
    }
  }, [mostrarReservas]);

  //Sincronizar dia mes y año 
  useEffect(() => {
    setDiaFiltro(fechaFiltro.getDate());
    setFiltroMes(fechaFiltro.getMonth() + 1);
    setFiltroAnio(fechaFiltro.getFullYear());
  }, [fechaFiltro]);


  // ======================
  // UTILIDADES
  // ======================
  function estaOcupado(cancha, hora) {
    return reservas.some((r) => {
      if (r.estado === "CANCELADA") return false; // 👈 CLAVE
  
      const f = new Date(r.fechaHoraInicio);
  
      return (
        f.getFullYear() === diaActivo.getFullYear() &&
        f.getMonth() === diaActivo.getMonth() &&
        f.getDate() === diaActivo.getDate() &&
        r.cancha.nombre === cancha &&
        f.toTimeString().substring(0, 5) === hora
      );
    });
  }

  /////HORARIO FINALIZADO
  function turnoFinalizado(hora) {
    if (!diaActivo) return false;
  
    const ahora = new Date();
  
    // solo bloquear si el día activo es HOY
    const esHoy =
      diaActivo.getDate() === ahora.getDate() &&
      diaActivo.getMonth() === ahora.getMonth() &&
      diaActivo.getFullYear() === ahora.getFullYear();
  
    if (!esHoy) return false;
  
    const [h, m] = hora.split(":").map(Number);
  
    const inicioTurno = new Date(diaActivo);
    inicioTurno.setHours(h, m, 0, 0);
  
    const finTurno = new Date(inicioTurno);
    finTurno.setMinutes(finTurno.getMinutes() + DURACION_TURNO_MINUTOS);
  
    return ahora >= finTurno; // 🔴 SOLO si ya terminó
  }

 
  ////////// ESTADO DE TURNOS
  function obtenerEstadoTurno(reserva, proximoTurno) {
    const ahora = new Date();
  
    const inicio = new Date(reserva.fechaHoraInicio);
    const fin = new Date(inicio);
    fin.setMinutes(fin.getMinutes() + DURACION_TURNO_MINUTOS);
  
   const esHoy =
     inicio.getDate() === ahora.getDate() &&
     inicio.getMonth() === ahora.getMonth() &&
     inicio.getFullYear() === ahora.getFullYear();

     // 🟢 EN JUEGO
  if (ahora >= inicio && ahora < fin) {
    return "EN_JUEGO";
  }

  // 🔴 FINALIZADA
  if (ahora >= fin) {
    return "FINALIZADA";
  }

  // 🟡 PRÓXIMO TURNO (solo para HOY)
  if (esHoy) {
    return "PROXIMO";
  }

  // ⚪ RESERVADA (solo otros días)
  return "RESERVADA";
  }


  //PRIORIDAD DE ESTADOS
  function prioridadEstado(estado) {
    switch (estado) {
      case "EN_JUEGO":
        return 1;
      case "PROXIMO":
        return 2;
      case "RESERVADA":
        return 3;
      case "FINALIZADA":
        return 4;
      default:
        return 99;
    }
  }


  function keyDia(fecha) {
    // CLAVE INTERNA SEGURA (sin corrimiento)
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, "0");
    const d = String(fecha.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`; // 👈 NO TOCAR
  }

  //AUTOCOMPLETAR CLIENTE EXISTENTE
  function buscarClienteExistente(nombre, apellido) {
    return reservas.find(
      (r) =>
        r.nombre.toLowerCase() === nombre.toLowerCase() &&
        r.apellido.toLowerCase() === apellido.toLowerCase()
    );
  }

  function toggleHorario(cancha, hora) {
    if (!diaActivo) return;

    const diaKey = keyDia(diaActivo);

    setSelecciones((prev) => {
      const actuales = prev[diaKey]?.[cancha] || [];

      const nuevos = actuales.includes(hora)
        ? actuales.filter((h) => h !== hora)
        : [...actuales, hora];

      const nuevasCanchas = {
        ...(prev[diaKey] || {}),
      };

      if (nuevos.length === 0) {
        // 🧹 si no quedan horarios, eliminar la cancha
        delete nuevasCanchas[cancha];
      } else {
        nuevasCanchas[cancha] = nuevos;
      }

      const nuevasSelecciones = {
        ...prev,
        [diaKey]: nuevasCanchas,
      };

      // 🧹 si el día queda vacío, eliminar el día
      if (Object.keys(nuevasCanchas).length === 0) {
        delete nuevasSelecciones[diaKey];
      }

      return nuevasSelecciones;
    });
  }


  //Eliminar turnos del resumen
  function eliminarHorario(fechaKey, cancha, hora) {
    setSelecciones((prev) => {
      const nuevosHorarios = prev[fechaKey][cancha].filter(
        (h) => h !== hora
      );

      const nuevasCanchas = {
        ...prev[fechaKey],
        [cancha]: nuevosHorarios,
      };

      // si la cancha queda vacía, la eliminamos
      if (nuevosHorarios.length === 0) {
        delete nuevasCanchas[cancha];
      }

      const nuevasSelecciones = {
        ...prev,
        [fechaKey]: nuevasCanchas,
      };

      // si el día queda vacío, lo eliminamos
      if (Object.keys(nuevasCanchas).length === 0) {
        delete nuevasSelecciones[fechaKey];
      }

      return nuevasSelecciones;
    });
  }

  //SUGERENCIAS DEL CLIENTE.. BUSCANDO COINCIDENCIAS NOMBRE APELLIDO..
  function buscarSugerencias(nombre, apellido) {
    if (!nombre && !apellido) return [];

    const filtrados = reservas.filter((r) => {
      const nombreMatch = nombre
        ? r.nombre.toLowerCase().startsWith(nombre.toLowerCase())
        : true;

      const apellidoMatch = apellido
        ? r.apellido.toLowerCase().startsWith(apellido.toLowerCase())
        : true;

      return nombreMatch && apellidoMatch;
    });

    // 🧹 eliminar duplicados por nombre + apellido
    const mapa = new Map();

    filtrados.forEach((r) => {
      const key = `${r.nombre.toLowerCase()}-${r.apellido.toLowerCase()}`;

      if (!mapa.has(key)) {
        mapa.set(key, {
          id: r.id,
          nombre: r.nombre,
          apellido: r.apellido,
          telefono: r.telefono,
        });
      }
    });

    return Array.from(mapa.values());
  }


  function handleClienteChange(e) {
    const { name, value } = e.target;

    let nuevoValor = value;

    if (name === "nombre" || name === "apellido") {
      nuevoValor = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    }

    if (name === "telefono") {
      nuevoValor = value.replace(/[^0-9]/g, "");
    }

    setCliente((prev) => {
      const actualizado = {
        ...prev,
        [name]: nuevoValor,
      };

      // 🔍 buscar sugerencias mientras escribe
      if (name === "nombre" || name === "apellido") {
        const lista = buscarSugerencias(
          actualizado.nombre,
          actualizado.apellido
        );
        setSugerencias(lista.slice(0, 5)); // máximo 5
      }

      return actualizado;
    });
  }

  const hayTurnos = Object.keys(selecciones).length > 0;

  //CONFIRMAR RESERVA
  async function confirmarReserva() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("No estás autenticado");
        return;
      }


      //VALIDACION DE CLIENTE
      if (!cliente.nombre || !cliente.apellido || !cliente.telefono) {
        alert("Todos los campos del cliente son obligatorios");
        return;
      }

      for (const [fecha, canchas] of Object.entries(selecciones)) {
        for (const [canchaNombre, horarios] of Object.entries(canchas)) {
          for (const hora of horarios) {

            const payload = {
              fechaHoraInicio: `${fecha}T${hora}`,
              nombre: cliente.nombre,
              apellido: cliente.apellido,
              telefono: cliente.telefono,
              canchaId: CANCHAS_MAP[canchaNombre],
              administradorId: 1, // ajustá si lo sacás del token
            };

            await crearReserva(payload, token);
          }
        }
      }

      alert("✅ Reserva creada correctamente");

      // limpiar estado
      setSelecciones({});
      setDiasSeleccionados([]);
      setDiaActivo(null);
      setCliente({ nombre: "", apellido: "", telefono: "" });

      // refrescar reservas
      const data = await obtenerReservas(token);
      setReservas(data);

    } catch (error) {
      console.error(error);
      alert("❌ Error al crear la reserva");
    }
  }


  //ELIMINAR/cancelar RESERVA 
  async function eliminarReserva(reservaId) {
    const confirmar = window.confirm(
      "¿Seguro querés eliminar/cancelar esta reserva?"
    );
    if (!confirmar) return;
  
    try {
      const token = localStorage.getItem("token");
  
      await cancelarReserva(reservaId, token);
  
      const data = await obtenerReservas(token);
      setReservas(data);
  
      alert("✅ Reserva cancelada/eliminada correctamente!");
    } catch (error) {
      console.error(error);
      alert("❌ Error al cancelar/eliminar la reserva");
    }
  }

  function cerrarSesion() {
    const confirmar = window.confirm("¿Seguro desea cerrar sesión?");
    if (!confirmar) return;

    // borrar sesión
    logout();

    // redirigir al login
    navigate("/");
  }



  // ======================
  // RESUMEN
  // ======================
  function renderResumen() {
    return Object.entries(selecciones)
      // 1️⃣ ORDENAR FECHAS (19 → 20 → 22)
      .sort(([fechaA], [fechaB]) => {
        return new Date(fechaA) - new Date(fechaB);
      })
      .map(([fecha, canchas]) => (
        <div key={fecha} style={{ marginBottom: "10px" }}>
          <strong>
            📅 {new Date(fecha + "T00:00:00").toLocaleDateString("es-AR")}
          </strong>

          {/* 2️⃣ ORDENAR CANCHAS (Cancha 1 arriba de Cancha 2) */}
          {Object.entries(canchas)
            .sort(([canchaA], [canchaB]) =>
              canchaA.localeCompare(canchaB)
            )
            .map(([cancha, horarios]) => (
              <div key={cancha} style={{ marginLeft: "15px" }}>
                <strong>{cancha}:</strong>{" "}

                {/* 3️⃣ ORDENAR HORARIOS + BOTÓN ELIMINAR */}
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

// ======================
// HORARIOS
// ======================
function renderHorarios(cancha) {
  if (!diaActivo) return null;

  const diaKey = keyDia(diaActivo);
  const seleccionados = selecciones[diaKey]?.[cancha] || [];

  return (
    <div className="flex flex-wrap gap-2 justify-start">
      {HORARIOS.map((hora) => {
        const ocupado = estaOcupado(cancha, hora);
        const finalizado = turnoFinalizado(hora);
        const seleccionado = seleccionados.includes(hora);

        return (
          <div
            key={hora}
            style={{ position: "relative", display: "inline-block" }}
            onMouseEnter={() => {
              if (ocupado) {
                setTooltipHora(`${hora}-reservado`);
              } else if (finalizado) {
                setTooltipHora(`${hora}-finalizado`);
              } else {
                setTooltipHora(`${hora}-disponible`);
              }
            }}
            onMouseLeave={() => setTooltipHora(null)}
          >
            <button
              onClick={() => toggleHorario(cancha, hora)}
              style={{
                padding: "7px 12px",
                borderRadius: "2px",
                border: "none",

                cursor: ocupado || finalizado ? "not-allowed" : "pointer",
                pointerEvents: ocupado || finalizado ? "none" : "auto",

                background: ocupado
                  ? "#d32f2f"        // 🔴 reservado
                  : finalizado
                    ? "#8f8f8f"      // ⚫ pasado
                    : seleccionado
                      ? "#FF9800"    // 🟧 seleccionado
                      : "#4CAF50",   // 🟢 disponible

                color: ocupado
                  ? "#fff"
                  : finalizado
                    ? "#000"
                    : "#fff",
              }}
            >
              {hora}
            </button>

            {/* TOOLTIP CONTROLADO POR ESTADO */}
            {
              tooltipHora ===
                `${hora}-${ocupado ? "reservado" : finalizado ? "finalizado" : "disponible"}` && (
                <span
                  style={{
                    position: "absolute",
                    bottom: "-22px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#333",
                    color: "#fff",
                    fontSize: "10px",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                    zIndex: 10,
                  }}
                >
                    {ocupado
    ? "Reservado"
    : finalizado
      ? "Horario finalizado"
      : "Disponible"}
                </span>
              )}
          </div>
        );
      })}
    </div>
  );
}
      
  

  // ======================
  // JSX
  // ======================
  return (
    <>
      {/* ======================
        HEADER
    ====================== */}
      <div
        className="fixed top-0 left-0 w-full h-8 z-50 bg-[#7a1f2b]"
        style={{ backgroundColor: "#7a1f2b" }}>
        <h1 className="text-white text-base font-semibold text-center">
          Molino Padel
        </h1>
      </div>

      {/* ======================
       MODAL VER RESERVAS
      ====================== */}
      {mostrarReservas && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-[95%] max-w-4xl rounded-lg p-4 max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">Reservas</h3>
              <button
                onClick={() => setMostrarReservas(false)}
                className="text-red-600 font-bold text-lg">
                ✕
              </button>
            </div>

            <div className="flex gap-4 pb-3 mb-3 border-b">



{/* ======================
    CALENDARIO FILTRO RESERVAS
====================== */}
{/* BUSCAR FECHA */}
<div className="relative">
  <label className="block text-xs font-semibold mb-1 text-gray-600">
    Fecha de reserva
  </label>

  <button
    onClick={() => setMostrarCalendarioFiltro(!mostrarCalendarioFiltro)}
    className="border rounded px-3 py-1 bg-white hover:bg-gray-100 flex items-center gap-2"
  >
    <span>{fechaFiltro.toLocaleDateString("es-AR")}</span>
    <span
      className={`transition-transform ${
        mostrarCalendarioFiltro ? "rotate-180" : ""
      }`}
    >
      ▼
    </span>
  </button>

  {/* CALENDARIO DESPLEGABLE */}
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
              {/*  BUSCADOR Nombre apellido o telefono*/}
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

              

{/* ======================
   MÉTRICAS FIJAS (NO SCROLL)
====================== */}
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

 {/* BOTON RESERVAS CANCELADAS*/}
<div className="flex justify-center">
            <button
  onClick={() => setMostrarCanceladas(true)}
  className="
    mt-1
    px-1
    py-1
    text-sm
    bg-gray-700
    text-white
    rounded
    shadow
  "
>
 Reservas Canceladas
</button>
</div>
            </div>
            
            {/* HEADER DE COLUMNAS */}
            <div className="grid grid-cols-6 gap-2 text-xs font-semibold border-b pb-2 mb-2">
              <div>Cliente</div>
              <div>Fecha</div>
              <div>Hora</div>
              <div>Cancha</div>
              <div>Teléfono</div>
              <div className="text-center">Eliminar Reserva</div>
            </div>

            <div className="flex-1 overflow-y-auto">

            {/* LISTA DE RESERVAS */}
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
              
                return coincideFecha && (busqueda === "" || coincideBusqueda);
              })
              .sort(
                (a, b) =>{
                  const estadoA = obtenerEstadoTurno(a, proximoTurno);
                  const estadoB = obtenerEstadoTurno(b, proximoTurno);
              
                  const prioridadA = prioridadEstado(estadoA);
                  const prioridadB = prioridadEstado(estadoB);
              
                  // 1️⃣ ordenar por estado
                  if (prioridadA !== prioridadB) {
                    return prioridadA - prioridadB;
                  }

                //Mismo estado-> ordenar por fecha y hora
                  new Date(a.fechaHoraInicio) -
                  new Date(b.fechaHoraInicio)
                }
              )
                
                .map((r) => {
                  const estado = obtenerEstadoTurno(r, proximoTurno);             
                  return (
                    <div
                      key={r.id}
                      className={`grid grid-cols-6 gap-2 items-center text-sm border-b py-2
                       ${estado === "EN_JUEGO" ? "bg-green-50" : ""}
                      `}
                  >
                    {/* CLIENTE */}
                    <div>
                      {r.nombre} {r.apellido}
                    </div>

                    {/* FECHA */}
                    <div>
                      {new Date(r.fechaHoraInicio).toLocaleDateString("es-AR")}
                    </div>

                    {/* HORA */}
                    <div>
                      {new Date(r.fechaHoraInicio).toLocaleTimeString("es-AR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>

                    {/* CANCHA */}
                    <div>{r.cancha.nombre}</div>

                    {/* TELÉFONO */}
                    <div>
                      <a
                        href={`tel:${r.telefono}`}
                        className="text-blue-600 underline"
                      >
                        {r.telefono}
                      </a>
                    </div>

                    {/*ELIMINAR RESERVA*/}
                    <div className="flex justify-center">
                      <button
                       type="button"
                       onClick={() => eliminarReserva(r.id)}
                       className="px-3 py-1.5 text-xs bg-red-600 text-white rounded"
                     >
                       ¿Eliminar?
                      </button>
                    </div>


                    {/* ESTADO DEL TURNO */}
<div className="col-span-6 text-xs font-semibold mt-1">
  {estado === "EN_JUEGO" && (
    <span className="text-green-700">🟢 En juego</span>
  )}

  {estado === "PROXIMO" && (
    <span className="text-yellow-700">🟡 Próximo turno</span>
  )}

  {estado === "RESERVADA" && (
    <span className="text-blue-600">⚪ Reservada</span>
  )}

  {estado === "FINALIZADA" && (
    <span className="text-red-600">🔴 Finalizada</span>
  )}
</div>

                  </div>
                );
              })}

            {/* SIN RESERVAS */}
            {reservas.length === 0 && (
              <p className="text-center text-red-500 mt-4">
                No hay reservas
              </p>
            )}
            </div>
          </div>
        </div>
      )}



 {/* ======================
   RESERVAS CANCELADAS
====================== */}
{mostrarCanceladas && (
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

        {/* SIN CANCELADAS */}
        {reservas.filter((r) => r.estado === "CANCELADA").length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No hay reservas canceladas
          </p>
        )}
      </div>
    </div>
  </div>
)}


      {/* ======================
        CONTENEDOR PRINCIPAL
       ====================== */}
      <div
        className="min-h-screen pt-[calc(env(safe-area-inset-top)+48px)] md:pt-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:pb-20"
        style={{
          Height: "calc(100vh - 40px)",
          backgroundImage: `
      linear-gradient(
        rgba(245,245,245,0.1),
        rgba(245,245,245,0.2)
      ),
      url('/Padel-Tennis-Hub-10.jpg')
    `,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "top center",
          backgroundColor: "#f5f5f5",
        }}


      >
        {/* ======================
          IZQUIERDA
      ====================== */}
        <div className="dashboard-left">

          {/* TITULO DE CALENDARIO */}
          <div className="max-w-md mx-auto mt-4">
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
                className="
          w-full
          px-4
          py-2
          text-sm
          bg-[#7a1f2b]
          text-white
          rounded
          shadow
        "
              >
                Ver reservas
              </button>
            </div>

          </div>
        </div>


{/* ======================
      DERECHA
====================== */}
{diasSeleccionados.length > 0 && (
  <div className="dashboard-right flex flex-col mt-4 items-start w-full">

    {/* TITULO FECHAS Y HORARIOS */}
    <div className="w-full mb-4 flex justify-center md:justify-start">
      <span className="inline-block bg-[#7a1f2b] text-white px-20 py-1 rounded-md text-sm font-semibold">
        FECHAS Y HORARIOS
      </span>
    </div>

    {/* FECHAS SELECCIONADAS */}
    <div className="w-full">
      <div className="flex flex-wrap gap-2 justify-start">
        {diasSeleccionados.map((dia) => (
          <button
            key={dia.getTime()}
            onClick={() => setDiaActivo(dia)}
            style={{
              padding: "6px 12px",
              borderRadius: "2px",
              border: "none",
              cursor: "pointer",
              fontWeight: "500",
              background:
                diaActivo?.getTime() === dia.getTime()
                  ? "#e53935"
                  : "#eee",
              color:
                diaActivo?.getTime() === dia.getTime()
                  ? "#fff"
                  : "#000",
            }}
          >
            {dia.toLocaleDateString("es-AR")}
          </button>
        ))}
      </div>

      {diaActivo && (
        <>
          <div className="mt-3 w-full bg-white/70 p-2 rounded-md shadow-sm">
            <h4 className="mb-4 font-semibold text-black">Cancha 1</h4>
            {renderHorarios("Cancha 1")}
          </div>

          <div className="mt-3 w-full bg-white/70 p-2 rounded-md shadow-sm">
            <h4 className="mb-4 font-semibold text-black">Cancha 2</h4>
            {renderHorarios("Cancha 2")}
          </div>
        </>
      )}
    </div>

    {/* ======================
        RESUMEN + CLIENTE
    ====================== */}
    {hayTurnos && (
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
                        setSugerencias([]);
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
            onClick={confirmarReserva}
            className="block mx-auto mt-4 px-6 py-2 bg-green-600 text-white rounded"
          >
            Confirmar reserva
          </button>
        </div>
      </div>
    )}

  </div>
)}

  
        {/* ======================
            BOTÓN CERRAR SESIÓN
        ====================== */}
        <button
          onClick={cerrarSesion}
          className="
    w-full
    mt-10
    md:fixed
    md:bottom-4
    md:right-4
    md:w-auto
    z-50
    px-4
    py-2
    text-sm
    bg-red-600
    text-white
    rounded
    cursor-pointer
  "
        >
          Cerrar sesión
        </button>
      </div>
    </>
  );
}
export default Dashboard;
