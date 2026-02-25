import { useEffect, useState } from "react";
import { obtenerReservas, crearReserva, cancelarReserva } from "../services/reservaService";

export function useReservas() {

  const [reservas, setReservas] = useState([]);
  const DURACION_TURNO_MINUTOS = 90;

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
  // ELIMINAR / CANCELAR
  // ======================
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

// ======================
// CONFIRMAR RESERVA
// ======================
async function confirmarReserva({ cliente, selecciones, CANCHAS_MAP }) {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        alert("No estás autenticado");
        return false;
      }
  
      if (!cliente.nombre || !cliente.apellido || !cliente.telefono) {
        alert("Todos los campos del cliente son obligatorios");
        return false;
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
              administradorId: 1,
            };
  
            await crearReserva(payload, token);
          }
        }
      }
  
      // refrescar reservas
      const data = await obtenerReservas(token);
      setReservas(data);
  
      return true;
  
    } catch (error) {
      console.error(error);
      alert("❌ Error al crear la reserva");
      return false;
    }
  }



  return {
    reservas,
    setReservas,
    eliminarReserva,
    confirmarReserva,
    DURACION_TURNO_MINUTOS
  };
}