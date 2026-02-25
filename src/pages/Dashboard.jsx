import { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import ReservasModal from "../components/modals/ReservasModal";
import ReservasCanceladasModal from "../components/modals/ReservasCanceladasModal";
import { keyDia, prioridadEstado, formatearFecha } from "../utils/reservaUtils";
import { useReservas } from "../hooks/useReservas";
import { useEstadoTurnos } from "../hooks/useEstadoTurnos";
import { useClienteReserva } from "../hooks/useClienteReserva";
import FechasHorarios from "../components/reserva/FechasHorarios";
import PanelCalendario from "../components/reserva/PanelCalendario";

const HORARIOS = [
  "08:00", "09:30", "11:00", "12:30",
  "14:00", "15:30", "17:00", "18:30",
  "20:00", "21:30", "23:00"
];

const CANCHAS_MAP = {
  "Cancha 1": 1,
  "Cancha 2": 2,
};

function Dashboard() {
  // ======================
  // ESTADOS
  // ======================
  const [diasSeleccionados, setDiasSeleccionados] = useState([]);
  const [diaActivo, setDiaActivo] = useState(null);
  const [selecciones, setSelecciones] = useState({});
  const [mostrarReservas, setMostrarReservas] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState(new Date());
  const [mostrarCalendarioFiltro, setMostrarCalendarioFiltro] = useState(false);
  const [mostrarCanceladas, setMostrarCanceladas] = useState(false);
  const [tooltipHora, setTooltipHora] = useState(null);
  const { reservas, setReservas, eliminarReserva, confirmarReserva, DURACION_TURNO_MINUTOS} = useReservas();
  const { estaOcupado, turnoFinalizado, obtenerEstadoTurno} = useEstadoTurnos({reservas,diaActivo, DURACION_TURNO_MINUTOS});
  const { cliente, setCliente, sugerencias, handleClienteChange, limpiarCliente } = useClienteReserva(reservas);

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

  //funcion Confirmar reserva
  async function handleConfirmarReserva() {
    const ok = await confirmarReserva({
      cliente,
      selecciones,
      CANCHAS_MAP
    });
  
    if (!ok) return;
  
    alert("✅ Reserva creada correctamente");
  
    setSelecciones({});
    setDiasSeleccionados([]);
    setDiaActivo(null);
    limpiarCliente();
  }
 
  // ======================
  // JSX
  // ======================
  return (
    <>
      <Header />

      <ReservasModal
  mostrarReservas={mostrarReservas}
  setMostrarReservas={setMostrarReservas}
  reservas={reservas}
  busqueda={busqueda}
  setBusqueda={setBusqueda}
  eliminarReserva={eliminarReserva}
  obtenerEstadoTurno={obtenerEstadoTurno}
  prioridadEstado={prioridadEstado}
  fechaFiltro={fechaFiltro}
  setFechaFiltro={setFechaFiltro}
  mostrarCalendarioFiltro={mostrarCalendarioFiltro}
  setMostrarCalendarioFiltro={setMostrarCalendarioFiltro}
  setMostrarCanceladas={setMostrarCanceladas}
  diaFiltro={diaFiltro}
  filtroMes={filtroMes}
  filtroAnio={filtroAnio}
/>

<ReservasCanceladasModal
  mostrarCanceladas={mostrarCanceladas}
  setMostrarCanceladas={setMostrarCanceladas}
  reservas={reservas}
  formatearFecha={formatearFecha}
/>


      {/* ======================
        CONTENEDOR PRINCIPAL
       ====================== */}
      <div
        className="min-h-screen pt-[calc(env(safe-area-inset-top)+48px)] md:pt-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:pb-20"
        style={{
          height: "calc(100vh - 40px)",
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

 {/*====================== MARCA DE AGUA ======================*/}
<div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs px-4 py-1.5 rounded-full shadow-lg font-semibold tracking-wide hover:bg-black transition-colors duration-200">
  © 2026 PCG Developer
</div>

<PanelCalendario
  setDiasSeleccionados={setDiasSeleccionados}
  setMostrarReservas={setMostrarReservas}
/>


        <FechasHorarios
  diasSeleccionados={diasSeleccionados}
  diaActivo={diaActivo}
  setDiaActivo={setDiaActivo}
  HORARIOS={HORARIOS}
  selecciones={selecciones}
  toggleHorario={toggleHorario}
  estaOcupado={estaOcupado}
  turnoFinalizado={turnoFinalizado}
  tooltipHora={tooltipHora}
  setTooltipHora={setTooltipHora}
  cliente={cliente}
  sugerencias={sugerencias}
  handleClienteChange={handleClienteChange}
  setCliente={setCliente}
  handleConfirmarReserva={handleConfirmarReserva}
  eliminarHorario={eliminarHorario}
/>

      </div>
    </>
  );
}
export default Dashboard;
