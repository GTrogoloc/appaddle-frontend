import { useState } from "react";

function EstadisticasModal({
  mostrarEstadisticas,
  setMostrarEstadisticas,
  reservas,
  setReservas,
}) {
  const [seccionActiva, setSeccionActiva] = useState("clientes");
  const [subSeccionClientes, setSubSeccionClientes] = useState("activos");
  const [subSeccionIngresos, setSubSeccionIngresos] = useState(null);

  //TOP 5 CLIENTES MÁS ACTIVOS (ÚLTIMOS 3 MESES)
  const obtenerTopClientes = () => {
    if (!reservas || reservas.length === 0) return [];

    const ahora = new Date();
    const haceTresMeses = new Date();
    haceTresMeses.setMonth(ahora.getMonth() - 3);

    const reservasValidas = reservas.filter((r) => {
      if (r.estado === "CANCELADA") return false;
      const fecha = new Date(r.fechaHoraInicio);
      return fecha >= haceTresMeses;
    });

    const contador = {};

    reservasValidas.forEach((r) => {
      const clave = `${r.nombre}-${r.apellido}`.toLowerCase().trim();
      const fecha = new Date(r.fechaHoraInicio);

      if (!contador[clave]) {
        contador[clave] = {
          nombre: r.nombre,
          apellido: r.apellido,
          telefono: r.telefono,
          cantidad: 0,
          ultimaFecha: fecha,
        };
      } else {
        // actualizar telefono si es más nuevo
        if (fecha > contador[clave].ultimaFecha) {
          contador[clave].telefono = r.telefono;
          contador[clave].ultimaFecha = fecha;
        }
      }

      contador[clave].cantidad++;
    });

    return Object.values(contador)
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);
  };

  const topClientes = obtenerTopClientes();

  // 😴 CLIENTES INACTIVOS (SIN RESERVAS EN EL ULTIMO MES)
  const obtenerClientesInactivos = () => {
    if (!reservas || reservas.length === 0) return [];

    const ahora = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(ahora.getDate() - 30);

    const reservasValidas = reservas.filter((r) => r.estado !== "CANCELADA");

    const clientes = {};

    reservasValidas.forEach((r) => {
      const telefono = r.telefono;
      const fecha = new Date(r.fechaHoraInicio);

      if (!clientes[telefono]) {
        clientes[telefono] = {
          nombre: r.nombre,
          apellido: r.apellido,
          telefono,
          ultimaReserva: fecha,
        };
      } else {
        if (fecha > clientes[telefono].ultimaReserva) {
          clientes[telefono].ultimaReserva = fecha;
        }
      }
    });

    return Object.values(clientes)
      .filter((cliente) => cliente.ultimaReserva < hace30Dias)
      .sort((a, b) => a.ultimaReserva - b.ultimaReserva);
  };

  const clientesInactivos = obtenerClientesInactivos();

  // 🆕 NUEVOS CLIENTES (ÚLTIMOS 14 DÍAS)
  const obtenerNuevosClientes = () => {
    if (!reservas || reservas.length === 0) return [];

    const ahora = new Date();
    const hace14Dias = new Date();
    hace14Dias.setDate(ahora.getDate() - 14);

    const reservasValidas = reservas.filter((r) => r.estado !== "CANCELADA");

    const clientes = {};

    reservasValidas.forEach((r) => {
      const telefono = r.telefono;
      const fecha = new Date(r.fechaHoraInicio);

      if (!clientes[telefono]) {
        clientes[telefono] = {
          nombre: r.nombre,
          apellido: r.apellido,
          telefono: r.telefono,
          primeraReserva: fecha,
        };
      } else {
        if (fecha < clientes[telefono].primeraReserva) {
          clientes[telefono].primeraReserva = fecha;
        }
      }
    });

    return Object.values(clientes)
      .filter((cliente) => cliente.primeraReserva >= hace14Dias)
      .sort((a, b) => b.primeraReserva - a.primeraReserva);
  };

  const nuevosClientes = obtenerNuevosClientes();

  const HORARIOS = [
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

  const ahora = new Date();
  const hoy = ahora.toLocaleDateString("sv-SE");

  const mesActual = ahora.getMonth();
  const anioActual = ahora.getFullYear();

  const mesAnterior = mesActual === 0 ? 11 : mesActual - 1;
  const anioMesAnterior = mesActual === 0 ? anioActual - 1 : anioActual;

  // reservas válidas
  const reservasValidas = reservas.filter((r) => r.estado !== "CANCELADA");

  // 📊 RESERVAS HOY
  const reservasHoy = reservasValidas.filter(
    (r) => r.fechaHoraInicio?.slice(0, 10) === hoy
  );

  // 📅 MES ACTUAL
  const reservasMesActual = reservasValidas.filter((r) => {
    const fecha = new Date(r.fechaHoraInicio);
    return fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual;
  });

  // 📅 MES ANTERIOR
  const reservasMesAnterior = reservasValidas.filter((r) => {
    const fecha = new Date(r.fechaHoraInicio);
    return (
      fecha.getMonth() === mesAnterior &&
      fecha.getFullYear() === anioMesAnterior
    );
  });

  // ❌ CANCELADAS HOY
  const canceladasHoy = reservas.filter(
    (r) => r.estado === "CANCELADA" && r.fechaHoraInicio?.slice(0, 10) === hoy
  ).length;

  // ❌ CANCELADAS MES ACTUAL
  const canceladasMesActual = reservas.filter((r) => {
    if (r.estado !== "CANCELADA") return false;

    const fecha = new Date(r.fechaHoraInicio);
    return fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual;
  }).length;

  // ❌ CANCELADAS MES ANTERIOR
  const canceladasMesAnterior = reservas.filter((r) => {
    if (r.estado !== "CANCELADA") return false;

    const fecha = new Date(r.fechaHoraInicio);
    return (
      fecha.getMonth() === mesAnterior &&
      fecha.getFullYear() === anioMesAnterior
    );
  }).length;

  // INGRESOS DEL DÍA
  const ingresosHoy = reservasHoy.reduce((total, r) => {
    if (r.estadoPago === "PAGADO") {
      return total + (r.precioTotal || 0);
    }
    if (r.estadoPago === "SENIA_PAGADA") {
      return total + (r.seniaTotal || 0);
    }
    return total;
  }, 0);

  //DEUDORES EN DINERO PENDIENTE
  const deudores = reservasValidas.filter(
    (r) =>
      r.estadoPago && // 🔥 clave: solo reservas con pagos definidos
      r.estadoPago !== "PAGADO"
  );

  // DINERO PENDIENTE (lo que me deben)
  const ingresosPendientes = reservasValidas.reduce((total, r) => {
    if (r.estadoPago === "PENDIENTE") {
      return total + (r.precioTotal || 0);
    }

    if (r.estadoPago === "SENIA_PAGADA") {
      return total + ((r.precioTotal || 0) - (r.seniaTotal || 0));
    }

    return total;
  }, 0);

  // MARCAR COMO PAGADO EN DEUDORES
  const marcarComoPagado = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que querés marcar este turno como pagado?"
    );

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/reservas/${id}/pagar`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Error en PUT pagar");
        return;
      }

      const res = await fetch("http://localhost:8080/reservas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Error al traer reservas");
        return;
      }

      const json = await res.json();

      setReservas(json.data);
    } catch (error) {
      console.error("ERROR TOTAL:", error);
    }
  };

  // 🔢 CONTADORES DE PAGOS
  const turnosPendientes = reservasValidas.filter(
    (r) => r.estadoPago === "PENDIENTE"
  ).length;

  const turnosConSenia = reservasValidas.filter(
    (r) => r.estadoPago === "SENIA_PAGADA"
  ).length;

  // 📅 INGRESOS MES ACTUAL
  const ingresosMesActual = reservasMesActual.reduce((total, r) => {
    if (r.estadoPago === "PAGADO") {
      return total + (r.precioTotal || 0);
    }
    if (r.estadoPago === "SENIA_PAGADA") {
      return total + (r.seniaTotal || 0);
    }
    return total;
  }, 0);

  // 📅 INGRESOS MES ANTERIOR
  const ingresosMesAnterior = reservasMesAnterior.reduce((total, r) => {
    if (r.estadoPago === "PAGADO") {
      return total + (r.precioTotal || 0);
    }
    if (r.estadoPago === "SENIA_PAGADA") {
      return total + (r.seniaTotal || 0);
    }
    return total;
  }, 0);

  // 💸 INGRESOS DE CANCELADAS
  const calcularIngresosCanceladas = (lista) => {
    return lista.reduce((total, r) => {
      if (r.estado !== "CANCELADA") return total;

      if (r.estadoPago === "SENIA_PAGADA") {
        return total + (r.seniaTotal || 0);
      }

      return total;
    }, 0);
  };

  // HOY
  const ingresosCanceladasHoy = calcularIngresosCanceladas(
    reservas.filter((r) => r.fechaHoraInicio?.slice(0, 10) === hoy)
  );

  // MES ACTUAL
  const ingresosCanceladasMesActual =
    calcularIngresosCanceladas(reservasMesActual);

  // MES ANTERIOR
  const ingresosCanceladasMesAnterior =
    calcularIngresosCanceladas(reservasMesAnterior);

  // 📊 PORCENTAJES
  const porcentajeCancelacionesHoy =
    ingresosHoy > 0
      ? Math.round((ingresosCanceladasHoy / ingresosHoy) * 100)
      : 0;

  const porcentajeCancelacionesMesActual =
    ingresosMesActual > 0
      ? Math.round((ingresosCanceladasMesActual / ingresosMesActual) * 100)
      : 0;

  const porcentajeCancelacionesMesAnterior =
    ingresosMesAnterior > 0
      ? Math.round((ingresosCanceladasMesAnterior / ingresosMesAnterior) * 100)
      : 0;

  // HORARIOS MES ANTERIOR
  const contadorHoras = {};

  HORARIOS.forEach((h) => (contadorHoras[h] = 0));

  reservasMesAnterior.forEach((r) => {
    const hora = r.fechaHoraInicio.substring(11, 16);
    if (contadorHoras[hora] !== undefined) {
      contadorHoras[hora]++;
    }
  });

  let horaMasFuerte = null;
  let horaMasFloja = null;

  if (Object.keys(contadorHoras).length > 0) {
    horaMasFuerte = Object.entries(contadorHoras).sort(
      (a, b) => b[1] - a[1]
    )[0][0];

    horaMasFloja = Object.entries(contadorHoras).sort(
      (a, b) => a[1] - b[1]
    )[0][0];
  }

  // SUGERENCIA PROMO
  const sugerenciaPromo = horaMasFloja;

  // capacidad diaria
  const canchasActivas =
    new Set(reservasValidas.map((r) => r.cancha?.nombre)).size || 1;

  const turnosPorDia = HORARIOS.length * canchasActivas;

  // ocupacion hoy
  const ocupacionHoy = Math.round((reservasHoy.length / turnosPorDia) * 100);
  const bloques = 20;
  const llenos = Math.round((ocupacionHoy / 100) * bloques);
  const vacios = bloques - llenos;

  const barraOcupacionHoy = "█".repeat(llenos) + "░".repeat(vacios);

  // ocupacion mes actual
  const diasMesActual = new Date(anioActual, mesActual + 1, 0).getDate();
  const capacidadMesActual = diasMesActual * turnosPorDia;

  const ocupacionMesActual = Math.round(
    (reservasMesActual.length / capacidadMesActual) * 100
  );

  // ocupacion mes anterior
  const diasMesAnterior = new Date(
    anioMesAnterior,
    mesAnterior + 1,
    0
  ).getDate();
  const capacidadMesAnterior = diasMesAnterior * turnosPorDia;

  const ocupacionMesAnterior = Math.round(
    (reservasMesAnterior.length / capacidadMesAnterior) * 100
  );

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

        {/* CONTENIDO DINÁMICO */}
        <div className="flex-1 overflow-y-auto ">
          {/* TABS PRINCIPALES */}
          <div className="flex gap-3 mb-6 border-b pb-4 sticky top-0 bg-white z-30">
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

          {seccionActiva === "clientes" && (
            <div>
              {/* SUB-OPCIONES */}
              <div className="flex gap-3 mb-6 sticky top-14 bg-white z-20 pb-2">
                <button
                  onClick={() => setSubSeccionClientes("activos")}
                  className={`px-4 py-2 rounded-md text-sm transition ${
                    subSeccionClientes === "activos"
                      ? "bg-blue-500/20 text-blue-700 border border-blue-400/40 font-semibold"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  🏆 Clientes Más Activos (Últimos 3 meses)
                </button>

                <button
                  onClick={() => setSubSeccionClientes("inactivos")}
                  className={`px-4 py-2 rounded-md text-sm transition ${
                    subSeccionClientes === "inactivos"
                      ? "bg-blue-500/20 text-blue-700 border border-blue-400/40 font-semibold"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  😴 Clientes Inactivos (Últimos 30 dias)
                </button>

                <button
                  onClick={() => setSubSeccionClientes("nuevos")}
                  className={`px-4 py-2 rounded-md text-sm transition ${
                    subSeccionClientes === "nuevos"
                      ? "bg-blue-500/20 text-blue-700 border border-blue-400/40 font-semibold"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  🆕 Nuevos Clientes (Últimas 2 semanas)
                </button>
              </div>

              {/* CONTENIDO TEMPORAL */}
              <div className="bg-gray-50 p-4 rounded-md border space-y-6">
                {/* 🏆 CLIENTES ACTIVOS */}
                {subSeccionClientes === "activos" && (
                  <>
                    <h4 className="font-semibold text-lg mb-1">
                      🏆 Clientes Más Activos (Últimos 3 meses)
                    </h4>

                    <p className="text-gray-600 text-sm ">
                      Basado en cantidad total de reservas confirmadas.
                    </p>

                    <div className="mt-4 space-y-3">
                      {topClientes.length === 0 && (
                        <p className="text-gray-400 text-sm">
                          No hay reservas suficientes en los últimos 3 meses.
                        </p>
                      )}

                      {topClientes.map((item, index) => (
                        <div
                          key={item.telefono}
                          className={`bg-white p-4 rounded-md shadow-sm border flex items-center ${
                            index < 3
                              ? "border-green-400/40 bg-green-500/5"
                              : ""
                          }`}
                        >
                          {/* NOMBRE */}
                          <div className="font-semibold text-sm flex-1">
                            #{index + 1} {item.nombre} {item.apellido}
                          </div>

                          {/* CANTIDAD */}
                          <div className="text-sm font-bold text-gray-700 mr-7">
                            🏆 {item.cantidad} reservas
                          </div>

                          {/* TELEFONO */}
                          <div className="text-sm font-semibold text-gray-600 mr-7">
                            📲 {item.telefono}
                          </div>

                          {/* BOTÓN */}
                          <a
                            href={`https://wa.me/54${item.telefono}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-9 h-9 bg-green-500 hover:bg-green-600 text-white rounded-full transition shadow-sm"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-5 h-5"
                            >
                              <path d="M20.52 3.48A11.94 11.94 0 0012.03 0C5.41 0 .03 5.38.03 12c0 2.11.55 4.16 1.6 5.97L0 24l6.22-1.63A11.96 11.96 0 0012.03 24c6.62 0 12-5.38 12-12 0-3.2-1.25-6.21-3.51-8.52zM12.03 21.82a9.78 9.78 0 01-4.98-1.37l-.36-.21-3.69.97.98-3.6-.23-.37A9.78 9.78 0 012.22 12c0-5.42 4.39-9.81 9.81-9.81 2.62 0 5.09 1.02 6.94 2.87a9.75 9.75 0 012.87 6.94c0 5.42-4.39 9.82-9.81 9.82zm5.39-7.32c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.8-1.49-1.79-1.66-2.09-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.5-.17 0-.37-.02-.57-.02-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.49s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.71.23 1.35.2 1.86.12.57-.08 1.77-.72 2.02-1.41.25-.69.25-1.28.17-1.41-.08-.12-.27-.2-.57-.35z" />
                            </svg>
                          </a>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* 😴 CLIENTES INACTIVOS */}
                {subSeccionClientes === "inactivos" && (
                  <>
                    <h4 className="font-semibold text-lg mb-2">
                      😴 Clientes Inactivos (Últimos 30 días)
                    </h4>

                    <p className="text-gray-600 text-sm">
                      Clientes que no realizaron reservas en los últimos 30
                      días.
                    </p>

                    <div className="mt-4 space-y-3">
                      {clientesInactivos.length === 0 && (
                        <p className="text-gray-400 text-sm">
                          No hay clientes inactivos 🎉
                        </p>
                      )}

                      {clientesInactivos.map((item) => (
                        <div
                          key={item.telefono}
                          className="bg-red-500/5 border-red-400/30 p-4 rounded-md shadow-sm border flex justify-between items-center"
                        >
                          {/* NOMBRE */}
                          <div className="font-semibold text-sm flex-1">
                            {item.nombre} {item.apellido}
                          </div>

                          {/* FECHA + TELEFONO */}
                          <div className="flex flex-col text-sm  text-gray-600 mr-6">
                            <span>
                              📅 Última reserva:{" "}
                              {item.ultimaReserva.toLocaleDateString("es-AR")}
                            </span>
                          </div>
                          <div className="flex flex-col text-sm font-semibold text-gray-600 mr-6">
                            <span>📲 {item.telefono}</span>
                          </div>

                          {/* BOTÓN */}
                          <a
                            href={`https://wa.me/54${item.telefono}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-9 h-9 bg-green-500 hover:bg-green-600 text-white rounded-full transition shadow-sm"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-5 h-5"
                            >
                              <path d="M20.52 3.48A11.94 11.94 0 0012.03 0C5.41 0 .03 5.38.03 12c0 2.11.55 4.16 1.6 5.97L0 24l6.22-1.63A11.96 11.96 0 0012.03 24c6.62 0 12-5.38 12-12 0-3.2-1.25-6.21-3.51-8.52zM12.03 21.82a9.78 9.78 0 01-4.98-1.37l-.36-.21-3.69.97.98-3.6-.23-.37A9.78 9.78 0 012.22 12c0-5.42 4.39-9.81 9.81-9.81 2.62 0 5.09 1.02 6.94 2.87a9.75 9.75 0 012.87 6.94c0 5.42-4.39 9.82-9.81 9.82zm5.39-7.32c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.8-1.49-1.79-1.66-2.09-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.5-.17 0-.37-.02-.57-.02-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.49s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.71.23 1.35.2 1.86.12.57-.08 1.77-.72 2.02-1.41.25-.69.25-1.28.17-1.41-.08-.12-.27-.2-.57-.35z" />
                            </svg>
                          </a>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* 🆕 NUEVOS CLIENTES */}
                {subSeccionClientes === "nuevos" && (
                  <>
                    <h4 className="font-semibold text-lg mb-2">
                      🆕 Nuevos Clientes (Últimas 2 semanas)
                    </h4>

                    <p className="text-gray-600 text-sm">
                      Clientes cuya primera reserva fue en los últimos 14 días.
                    </p>

                    <div className="mt-4 space-y-3">
                      {nuevosClientes.length === 0 && (
                        <p className="text-gray-400 text-sm">
                          No hay nuevos clientes en los últimos 14 días.
                        </p>
                      )}

                      {nuevosClientes.map((item) => (
                        <div
                          key={item.telefono}
                          className="bg-blue-500/5 border-blue-400/30 p-4 rounded-md shadow-sm border flex justify-between items-center"
                        >
                          {/* NOMBRE */}
                          <div className="font-semibold text-sm flex-1">
                            {item.nombre} {item.apellido}
                          </div>

                          {/* FECHA PRIMERA RESERVA */}
                          <div className="text-sm text-gray-600 mr-6">
                            📅 1era reserva:{" "}
                            {item.primeraReserva.toLocaleDateString("es-AR")}
                          </div>

                          {/* TELEFONO */}
                          <div className="text-sm font-semibold text-gray-600 mr-6">
                            📲 {item.telefono}
                          </div>

                          {/* BOTÓN WHATSAPP */}
                          <a
                            href={`https://wa.me/54${item.telefono}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-9 h-9 bg-green-500 hover:bg-green-600 text-white rounded-full transition shadow-sm"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-5 h-5"
                            >
                              <path d="M20.52 3.48A11.94 11.94 0 0012.03 0C5.41 0 .03 5.38.03 12c0 2.11.55 4.16 1.6 5.97L0 24l6.22-1.63A11.96 11.96 0 0012.03 24c6.62 0 12-5.38 12-12 0-3.2-1.25-6.21-3.51-8.52zM12.03 21.82a9.78 9.78 0 01-4.98-1.37l-.36-.21-3.69.97.98-3.6-.23-.37A9.78 9.78 0 012.22 12c0-5.42 4.39-9.81 9.81-9.81 2.62 0 5.09 1.02 6.94 2.87a9.75 9.75 0 012.87 6.94c0 5.42-4.39 9.82-9.81 9.82zm5.39-7.32c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.8-1.49-1.79-1.66-2.09-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.5-.17 0-.37-.02-.57-.02-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.49s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.71.23 1.35.2 1.86.12.57-.08 1.77-.72 2.02-1.41.25-.69.25-1.28.17-1.41-.08-.12-.27-.2-.57-.35z" />
                            </svg>
                          </a>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {seccionActiva === "ocupacion" && (
            <div className="space-y-3 text-sm">
              {/* HOY */}
              <div className="bg-gray-50 p-3 rounded-md border">
                <h4 className="font-semibold mb-1">📅 Hoy</h4>
                <p>
                  Reservas:
                  <span className="font-semibold ml-1">
                    {reservasHoy.length}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  Ocupación:
                  <span className="font-mono text-sm">{barraOcupacionHoy}</span>
                  <span className="font-semibold">{ocupacionHoy}%</span>
                </p>
                <p className="text-xs text-red-600 mt-1">
                  ❌ Canceladas: {canceladasHoy}
                </p>
              </div>

              {/* MES ACTUAL */}
              <div className="bg-gray-50 p-4 rounded-md border">
                <h4 className="font-semibold mb-1">📅 Mes actual</h4>
                <p>
                  Reservas:
                  <span className="font-semibold ml-1">
                    {reservasMesActual.length}
                  </span>
                </p>
                <p>
                  Ocupación:
                  <span className="font-semibold ml-1">
                    {ocupacionMesActual}%
                  </span>
                </p>
                <p className="text-xs text-red-600 mt-1">
                  ❌ Canceladas: {canceladasMesActual}
                </p>
              </div>

              {/* MES ANTERIOR */}
              <div className="bg-gray-50 p-4 rounded-md border">
                <h4 className="font-semibold mb-1">📅 Mes anterior</h4>
                <p>
                  Reservas:
                  <span className="font-semibold ml-1">
                    {reservasMesAnterior.length}
                  </span>
                </p>
                <p>
                  Ocupación:
                  <span className="font-semibold ml-1">
                    {ocupacionMesAnterior}%
                  </span>
                </p>
                <p className="text-xs text-red-600 mt-1">
                  ❌ Canceladas: {canceladasMesAnterior}
                </p>
              </div>

              {/* HORARIOS */}
              <div className="bg-gray-50 p-4 rounded-md border">
                <h4 className="font-semibold mb-1">Ocupación de Horarios:</h4>

                <p>
                  🔥 Hora más fuerte del mes pasado:{" "}
                  <strong>{horaMasFuerte || "-"}</strong>
                </p>

                <p>
                  📉 Hora más floja del mes pasado:{" "}
                  <strong>{horaMasFloja || "-"}</strong>
                </p>

                <p className="text-green-600 font-semibold">
                  💡 Sugerencia promoción → {sugerenciaPromo || "-"}
                </p>
              </div>
            </div>
          )}

          {seccionActiva === "ingresos" && !subSeccionIngresos && (
            <div className="space-y-4 text-sm">
              {/* PENDIENTE */}
              <div className="bg-red-50 p-4 rounded-md border border-red-200">
                <h4 className="font-semibold mb-1 text-red-700">
                  💸 Dinero pendiente
                </h4>

                <p className="text-base font-semibold text-red-700">
                  ${new Intl.NumberFormat("es-AR").format(ingresosPendientes)}
                </p>

                <p className="text-xs text-gray-600 mt-1">
                  {turnosPendientes > 0 && (
                    <>⚠️ {turnosPendientes} turno(s) sin pagar</>
                  )}
                  {turnosPendientes > 0 && turnosConSenia > 0 && " • "}
                  {turnosConSenia > 0 && (
                    <> 👥 {turnosConSenia} clientes con seña</>
                  )}
                </p>

                {/**boton VER DEUDORES**/}
                {deudores.length > 0 && (
                  <button
                    onClick={() => setSubSeccionIngresos("deudores")}
                    className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-xs"
                  >
                    Ver deudores ({deudores.length})
                  </button>
                )}
              </div>

              {/* HOY */}
              <div className="bg-gray-50 p-4 rounded-md border">
                <h4 className="font-semibold mb-1">📅 Hoy</h4>
                <p>
                  Ingreso total:
                  <span className="font-semibold ml-1">
                    ${new Intl.NumberFormat("es-AR").format(ingresosHoy)}
                  </span>
                </p>
                {ingresosCanceladasHoy > 0 && (
                  <p className="text-xs text-red-600 mt-1">
                    💸 De cancelaciones: $
                    {new Intl.NumberFormat("es-AR").format(
                      ingresosCanceladasHoy
                    )}{" "}
                    ({porcentajeCancelacionesHoy}%)
                  </p>
                )}
              </div>

              {/* MES ACTUAL */}
              <div className="bg-gray-50 p-4 rounded-md border">
                <h4 className="font-semibold mb-1">📅 Mes actual</h4>
                <p>
                  Ingreso total:
                  <span className="font-semibold ml-1">
                    ${new Intl.NumberFormat("es-AR").format(ingresosMesActual)}
                  </span>
                </p>

                {ingresosCanceladasMesActual > 0 && (
                  <p className="text-xs text-red-600 mt-1">
                    💸 De cancelaciones: $
                    {new Intl.NumberFormat("es-AR").format(
                      ingresosCanceladasMesActual
                    )}{" "}
                    ({porcentajeCancelacionesMesActual}%)
                  </p>
                )}
              </div>

              {/* MES ANTERIOR */}
              <div className="bg-gray-50 p-4 rounded-md border">
                <h4 className="font-semibold mb-1">📅 Mes anterior</h4>
                <p>
                  Ingreso total:
                  <span className="font-semibold ml-1">
                    $
                    {new Intl.NumberFormat("es-AR").format(ingresosMesAnterior)}
                  </span>
                </p>

                {ingresosCanceladasMesAnterior > 0 && (
                  <p className="text-xs text-red-600 mt-1">
                    💸 De cancelaciones: $
                    {new Intl.NumberFormat("es-AR").format(
                      ingresosCanceladasMesAnterior
                    )}{" "}
                    ({porcentajeCancelacionesMesAnterior}%)
                  </p>
                )}
              </div>
            </div>
          )}
          {seccionActiva === "ingresos" &&
            subSeccionIngresos === "deudores" && (
              <div className="space-y-2 text-sm">
                <button
                  onClick={() => setSubSeccionIngresos(null)}
                  className="mb-2 px-3 py-1 bg-gray-400 text-white rounded text-xs"
                >
                  ← Volver atras
                </button>

                <h4 className="font-semibold mb-2">💸 Deudores</h4>

                {deudores.length === 0 ? (
                  <p className="text-gray-500 text-xs">No hay deudas</p>
                ) : (
                  deudores.map((r) => {
                    const fecha = new Date(r.fechaHoraInicio);
                    const dia = fecha.toLocaleDateString("es-AR");

                    // calcular deuda
                    const montoDebe =
                      r.estadoPago === "PENDIENTE"
                        ? r.precioTotal || 0
                        : (r.precioTotal || 0) - (r.seniaTotal || 0);

                    // mensaje de WhatsApp
                    const mensaje = `Hola ${r.nombre} 👋
Te recordamos que tenés pendiente una deuda del día ${dia} por $${montoDebe}.

Podés cancelarlo enviando el pago a nuestro alias:
TU_ALIAS`;

                    return (
                      <div
                        key={r.id}
                        className="flex items-center justify-between border-b pb-2"
                      >
                        {/* IZQUIERDA */}
                        <span>
                          {dia} - {r.nombre} {r.apellido}
                        </span>

                        {/* DERECHA */}
                        <div className="flex items-center gap-2">
                          {/* 📲 WHATSAPP */}
                          <a
                            href={`https://wa.me/54${
                              r.telefono
                            }?text=${encodeURIComponent(mensaje)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-7 h-7 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-sm"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-4 h-4"
                            >
                              <path d="M20.52 3.48A11.94 11.94 0 0012.03 0C5.41 0 .03 5.38.03 12c0 2.11.55 4.16 1.6 5.97L0 24l6.22-1.63A11.96 11.96 0 0012.03 24c6.62 0 12-5.38 12-12 0-3.2-1.25-6.21-3.51-8.52zM12.03 21.82a9.78 9.78 0 01-4.98-1.37l-.36-.21-3.69.97.98-3.6-.23-.37A9.78 9.78 0 012.22 12c0-5.42 4.39-9.81 9.81-9.81 2.62 0 5.09 1.02 6.94 2.87a9.75 9.75 0 012.87 6.94c0 5.42-4.39 9.82-9.81 9.82zm5.39-7.32c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.8-1.49-1.79-1.66-2.09-.17-.3-.02-.46.13-.61.14-.14.30-.35.45-.52.15-.17.20-.30.3-.5.10-.20.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.5-.17 0-.37-.02-.57-.02-.20 0-.52.07-.80.37-.27.30-1.05 1.02-1.05 2.49s1.07 2.90 1.22 3.10c.15.20 2.10 3.20 5.09 4.49.71.31 1.27.49 1.70.63.71.23 1.35.20 1.86.12.57-.08 1.77-.72 2.02-1.41.25-.69.25-1.28.17-1.41-.08-.12-.27-.20-.57-.35z" />
                            </svg>
                          </a>

                          {/* ESTADO */}
                          <span
                            className={`text-xs font-semibold ${
                              r.estadoPago === "PENDIENTE"
                                ? "text-red-600"
                                : "text-orange-600"
                            }`}
                          >
                            {r.estadoPago === "PENDIENTE"
                              ? "Debe completo"
                              : "Señó (falta pagar)"}
                          </span>

                          {/* ✔ PAGAR */}
                          <button
                            onClick={() => marcarComoPagado(r.id)}
                            className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
                          >
                            ✔ Pagar
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default EstadisticasModal;
