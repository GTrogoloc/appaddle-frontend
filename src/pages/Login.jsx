import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8080/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, contraseña }),
    });

    if (!response.ok) {
      alert("Usuario o contraseña incorrectos");
      return;
    }

    const data = await response.json();

    localStorage.setItem("token", data.data.token);
    localStorage.setItem(
      "admin",
      JSON.stringify(data.data.administrador)
    );

    navigate("/dashboard");
  };

  return (
    <div className="relative min-h-screen flex">

      {/* LOGIN */}
      <div className="
         relative z-10
         flex w-full items-center justify-center
         bg-transparent md:bg-white
         md:w-1/2
        
      ">
        
        <form
          onSubmit={handleSubmit}
          className="
            w-full max-w-sm
            rounded-xl
            bg-white/90
            p-6
            shadow-xl
            md:shadow-none
          "
        >

          <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
            Iniciar sesión
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Usuario
            </label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="
                mt-1 w-full rounded-md
                border border-gray-300
                px-3 py-2
                focus:outline-none
                focus:ring-2 focus:ring-red-600
              "
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600">
              Contraseña
            </label>
            <input
              type="password"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              className="
                mt-1 w-full rounded-md
                border border-gray-300
                px-3 py-2
                focus:outline-none
                focus:ring-2 focus:ring-red-600
              "
              required
            />
          </div>

          <button
            type="submit"
            className="
              w-full rounded-md
              bg-red-700
              py-2
              text-white font-semibold
              hover:bg-red-800
              transition
            "
          >
            Ingresar
          </button>
        </form>
      </div>

      {/* IMAGEN DESKTOP */}
      <div
        className="
          hidden md:block
          md:w-1/2
          bg-cover bg-center
        "
        style={{ backgroundImage: "url('/Cancha.JPG')" }}
      />

      {/* FONDO MOBILE */}
      <div
        className="
          absolute inset-0
          bg-cover bg-center
          md:hidden
          -z-10
        "
        style={{ backgroundImage: "url('/Cancha.JPG')" }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur"></div>
      </div>

    </div>
  );
}

export default Login;