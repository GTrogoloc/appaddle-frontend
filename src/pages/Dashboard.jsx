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
import EstadisticasModal from "../components/modals/EstadisticasModal";
import { obtenerReservas } from "../services/reservaService";

function Dashboard() {
  const HORARIOS = [
    "06:30",
    "08:00",
    "09:30",
    "11:00",
    "12:30",
    "14:00",
    "15:30",
    "17:00",
    "18:30",
    "20:00",
    "21:30",
    "23:00",
  ];
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

  const {
    reservas,
    setReservas,
    eliminarReserva,
    confirmarReserva,
    DURACION_TURNO_MINUTOS,
  } = useReservas();

  console.log("RESERVAS:", reservas);

  const { estaOcupado, turnoFinalizado, obtenerEstadoTurno, proximosTurnos } =
    useEstadoTurnos({ reservas, diaActivo, DURACION_TURNO_MINUTOS });
  const {
    cliente,
    setCliente,
    sugerencias,
    handleClienteChange,
    limpiarCliente,
  } = useClienteReserva(reservas);
  const [mostrarEstadisticas, setMostrarEstadisticas] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [reservaAEliminar, setReservaAEliminar] = useState(null);
  const [pagoPendiente, setPagoPendiente] = useState(null);
  const [canchas, setCanchas] = useState([]);
  const CANCHAS_MAP = Object.fromEntries(canchas.map((c) => [c.nombre, c.id]));

  const hoy = new Date();
  const anioActual = hoy.getFullYear();
  const [mostrarDias, setMostrarDias] = useState(false);
  const [filtroMes, setFiltroMes] = useState(hoy.getMonth() + 1);
  const [filtroAnio, setFiltroAnio] = useState(hoy.getFullYear());
  const [diaFiltro, setDiaFiltro] = useState(new Date().getDate());
  const diasDelMes = new Date(filtroAnio, filtroMes, 0).getDate();

  const aniosDisponibles = [anioActual - 1, anioActual, anioActual + 1];

  const listaDias = Array.from({ length: diasDelMes }, (_, i) => i + 1);

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
      diasSeleccionados.some((d) => d.getTime() === diaActivo.getTime());

    if (!sigueActivo) {
      setDiaActivo(diasSeleccionados[diasSeleccionados.length - 1]);
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

  async function cargarCanchas() {
    try {
      const res = await fetch("http://localhost:8080/canchas");
      if (!res.ok) throw new Error("Error servidor");

      const data = await res.json();
      setCanchas(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    cargarCanchas();
  }, []);

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
      const nuevosHorarios = prev[fechaKey][cancha].filter((h) => h !== hora);

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

  // ======================
  // WHATSAPP CONFIRMACION
  // ======================
  function enviarConfirmacionWhatsApp(cliente, selecciones) {
    const emojiPelota = "🎾";
    const emojiCalendario = "📅";
    const emojiReloj = "⏰";
    const emojiPin = "📍";
    const emojiManos = "🙌";

    let mensaje = `${emojiPelota} Club Padel PCG
  
  Hola ${cliente.nombre} 👋
  
  Tu reserva fue confirmada con éxito.
  
  `;

    Object.entries(selecciones).forEach(([fecha, canchas]) => {
      Object.entries(canchas).forEach(([cancha, horarios]) => {
        horarios.forEach((hora) => {
          const fechaObj = new Date(fecha + "T00:00:00");

          const dia = fechaObj.toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });

          mensaje += `${emojiCalendario} ${dia}\n`;
          mensaje += `${emojiReloj} ${hora} hs\n`;
          mensaje += `${emojiPelota} ${cancha}\n`;
          mensaje += `⏳ Duración: ${DURACION_TURNO_MINUTOS} minutos\n\n`;
        });
      });
    });

    mensaje += `${emojiPin} Cómo llegar: https://maps.google.com/
  
  Te esperamos ${emojiManos}`;

    const mensajeCodificado = encodeURIComponent(mensaje);

    const telefono = cliente.telefono.replace(/\D/g, "");
    const url = `https://api.whatsapp.com/send?phone=54${telefono}&text=${mensajeCodificado}`;

    window.open(url, "whatsapp");
  }

  // ======================
  // WHATSAPP CANCELACION
  // ======================
  function enviarCancelacionWhatsApp(reserva) {
    const emojiPelota = "🎾";
    const emojiCalendario = "📅";
    const emojiReloj = "⏰";
    const emojiMano = "👋";

    const fechaObj = new Date(reserva.fechaHoraInicio);

    const dia = fechaObj.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const hora = fechaObj.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    let mensaje = `Hola ${reserva.nombre} ${emojiMano}
  
  Tu reserva fue cancelada.
  
  ${emojiCalendario} ${dia}
  ${emojiReloj} ${hora} hs
  ${emojiPelota} ${reserva.cancha?.nombre}
  
  Si querés reservar otro horario podés hacerlo nuevamente.
  
  ${emojiPelota} Club Padel PCG`;

    const mensajeCodificado = encodeURIComponent(mensaje);

    const telefono = reserva.telefono.replace(/\D/g, "");

    const url = `https://api.whatsapp.com/send?phone=54${telefono}&text=${mensajeCodificado}`;

    window.open(url, "whatsapp");
  }

  //funcion Confirmar reserva
  function handleConfirmarReserva() {
    setMostrarConfirmacion(true);
  }

  async function confirmarReservaFinal() {
    const ok = await confirmarReserva({
      cliente,
      selecciones,
      CANCHAS_MAP,
    });

    if (!ok) return;

    enviarConfirmacionWhatsApp(cliente, selecciones);

    setMostrarConfirmacion(false);
    setSelecciones({});
    setDiasSeleccionados([]);
    setDiaActivo(null);
    limpiarCliente();
  }

  // ======================
  // JSX
  // ======================
  return (
    <div className="h-screen flex flex-col pt-12">
      <Header cargarCanchas={cargarCanchas} canchas={canchas} />

      <ReservasModal
        mostrarReservas={mostrarReservas}
        setMostrarReservas={setMostrarReservas}
        reservas={reservas}
        setReservas={setReservas}
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        eliminarReserva={eliminarReserva}
        enviarCancelacionWhatsApp={enviarCancelacionWhatsApp}
        obtenerEstadoTurno={obtenerEstadoTurno}
        prioridadEstado={prioridadEstado}
        proximosTurnos={proximosTurnos}
        fechaFiltro={fechaFiltro}
        setFechaFiltro={setFechaFiltro}
        mostrarCalendarioFiltro={mostrarCalendarioFiltro}
        setMostrarCalendarioFiltro={setMostrarCalendarioFiltro}
        setMostrarCanceladas={setMostrarCanceladas}
        diaFiltro={diaFiltro}
        filtroMes={filtroMes}
        filtroAnio={filtroAnio}
        setReservaAEliminar={setReservaAEliminar}
        setPagoPendiente={setPagoPendiente}
      />

      <ReservasCanceladasModal
        mostrarCanceladas={mostrarCanceladas}
        setMostrarCanceladas={setMostrarCanceladas}
        reservas={reservas}
        formatearFecha={formatearFecha}
      />

      <EstadisticasModal
        mostrarEstadisticas={mostrarEstadisticas}
        setMostrarEstadisticas={setMostrarEstadisticas}
        reservas={reservas}
        setReservas={setReservas}
      />

      {/* ======================
        CONTENEDOR PRINCIPAL
       ====================== */}
      <div
        className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 px-6"
        style={{
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
          setMostrarEstadisticas={setMostrarEstadisticas}
        />

        <div className="flex flex-col flex-1 min-h-0">
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
            canchas={canchas}
          />
        </div>
      </div>

      {/*  MODAL CONFIRMAR RESERVA */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4 font-medium">
              ¿Confirmar la reserva de {cliente.nombre} {cliente.apellido}?
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={confirmarReservaFinal}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Aceptar
              </button>

              <button
                onClick={() => setMostrarConfirmacion(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 MODAL CANCELAR RESERVA */}
      {reservaAEliminar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4 font-medium">
              ¿Cancelar la reserva de {reservaAEliminar.nombre}{" "}
              {reservaAEliminar.apellido}?
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={async () => {
                  const ok = await eliminarReserva(reservaAEliminar.id);

                  if (ok) {
                    enviarCancelacionWhatsApp(reservaAEliminar);
                  }

                  setReservaAEliminar(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Aceptar
              </button>

              <button
                onClick={() => setReservaAEliminar(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 MODAL PAGOS */}
      {pagoPendiente && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4 font-medium">
              {pagoPendiente.estadoPago === "PENDIENTE"
                ? `¿Registrar seña de ${pagoPendiente.nombre} ${pagoPendiente.apellido}?`
                : `¿Registrar pago completo de ${pagoPendiente.nombre} ${pagoPendiente.apellido}?`}
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={async () => {
                  const token = localStorage.getItem("token");

                  if (pagoPendiente.estadoPago === "PENDIENTE") {
                    await fetch(
                      `http://localhost:8080/reservas/${pagoPendiente.id}/senia`,
                      {
                        method: "PUT",
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );
                  } else {
                    await fetch(
                      `http://localhost:8080/reservas/${pagoPendiente.id}/pagar`,
                      {
                        method: "PUT",
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );
                  }

                  // 🔥 NUEVO
                  const data = await obtenerReservas(token);
                  setReservas(data);

                  // cerrar modal
                  setPagoPendiente(null);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Aceptar
              </button>

              <button
                onClick={() => setPagoPendiente(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Dashboard;
