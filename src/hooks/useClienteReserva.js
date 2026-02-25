import { useState } from "react";

export function useClienteReserva(reservas) {

  const [cliente, setCliente] = useState({
    nombre: "",
    apellido: "",
    telefono: ""
  });

  const [sugerencias, setSugerencias] = useState([]);

  // ======================
  // BUSCAR SUGERENCIAS
  // ======================
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

  // ======================
  // HANDLE CHANGE
  // ======================
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

      if (name === "nombre" || name === "apellido") {
        const lista = buscarSugerencias(
          actualizado.nombre,
          actualizado.apellido
        );
        setSugerencias(lista.slice(0, 5));
      }

      return actualizado;
    });
  }

  function limpiarCliente() {
    setCliente({ nombre: "", apellido: "", telefono: "" });
    setSugerencias([]);
  }

  return {
    cliente,
    setCliente,
    sugerencias,
    handleClienteChange,
    limpiarCliente
  };
}