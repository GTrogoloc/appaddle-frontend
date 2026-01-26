const API_URL = "http://localhost:8080/reservas";

// =======================
// OBTENER RESERVAS
// =======================
export async function obtenerReservas(token) {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener reservas");
  }

  const data = await response.json();
  return data.data;
}

// =======================
// CREAR RESERVA
// =======================
export async function crearReserva(reserva, token) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reserva),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Error al crear la reserva");
  }

  return response.json();
}

// CANCELAR RESERVA (NO BORRAR)
export async function cancelarReserva(id, token) {
  const response = await fetch(`http://localhost:8080/reservas/${id}/cancelar`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Error al cancelar la reserva");
  }

  return response.json();
}