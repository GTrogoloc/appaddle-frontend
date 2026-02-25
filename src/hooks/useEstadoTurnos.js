import { useMemo } from "react";

export function useEstadoTurnos({ reservas, diaActivo, DURACION_TURNO_MINUTOS }) {

  const ahora = new Date();

  // ======================
  // PRÓXIMOS TURNOS
  // ======================
  const proximosTurnos = useMemo(() => {
    return reservas
      .filter((r) => {
        if (r.estado === "CANCELADA") return false;
        return new Date(r.fechaHoraInicio) > ahora;
      })
      .sort(
        (a, b) =>
          new Date(a.fechaHoraInicio) - new Date(b.fechaHoraInicio)
      )
      .slice(0, 2);
  }, [reservas]);

  // ======================
  // ESTA OCUPADO
  // ======================
  function estaOcupado(cancha, hora) {
    if (!diaActivo) return false;

    return reservas.some((r) => {
      if (r.estado === "CANCELADA") return false;

      const inicio = new Date(r.fechaHoraInicio);
      const fin = new Date(inicio);
      fin.setMinutes(fin.getMinutes() + DURACION_TURNO_MINUTOS);

      const ahora = new Date();
      if (ahora >= fin) return false;

      return (
        inicio.getFullYear() === diaActivo.getFullYear() &&
        inicio.getMonth() === diaActivo.getMonth() &&
        inicio.getDate() === diaActivo.getDate() &&
        r.cancha.nombre === cancha &&
        inicio.toTimeString().substring(0, 5) === hora
      );
    });
  }

  // ======================
  // TURNO FINALIZADO
  // ======================
  function turnoFinalizado(hora) {
    if (!diaActivo) return false;

    const ahora = new Date();

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

    return ahora >= finTurno;
  }

  // ======================
  // ESTADO TURNO
  // ======================
  function obtenerEstadoTurno(reserva) {
    const ahora = new Date();

    const inicio = new Date(reserva.fechaHoraInicio);
    const fin = new Date(inicio);
    fin.setMinutes(fin.getMinutes() + DURACION_TURNO_MINUTOS);

    if (ahora >= inicio && ahora < fin) {
      return "EN_JUEGO";
    }

    if (ahora >= fin) {
      return "FINALIZADA";
    }

    const esProximo = proximosTurnos.some(
      (r) => r.id === reserva.id
    );

    if (esProximo) {
      return "PROXIMO";
    }

    return "RESERVADA";
  }

  return {
    proximosTurnos,
    estaOcupado,
    turnoFinalizado,
    obtenerEstadoTurno
  };
}