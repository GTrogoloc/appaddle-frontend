import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import { LogOut, HelpCircle, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import ConfigModal from "./ConfigModal";
import AyudaModal from "./AyudaModal";

const COLOR_TEXTO_DEFAULT = "#ffffff";

function Header({ cargarCanchas, canchas }) {
  const navigate = useNavigate();
  const [nombreClub, setNombreClub] = useState("Molino Pádel");
  const [mostrarConfig, setMostrarConfig] = useState(false);
  const [mostrarAyuda, setMostrarAyuda] = useState(false);
  const [confirmarLogout, setConfirmarLogout] = useState(false);

  useEffect(() => {
    const guardado = localStorage.getItem("nombreClub");
    if (guardado) setNombreClub(guardado);

    const colorGuardado = localStorage.getItem("colorHeader");
    if (colorGuardado) {
      document.documentElement.style.setProperty(
        "--color-header",
        colorGuardado
      );
    }

    const colorTextoGuardado =
      localStorage.getItem("colorHeaderTexto") || COLOR_TEXTO_DEFAULT;
    if (colorTextoGuardado) {
      document.documentElement.style.setProperty(
        "--color-header-texto",
        colorTextoGuardado
      );
    }
  }, []);

  //FUNCION CERRAR SESION
  function cerrarSesion() {
    setConfirmarLogout(true);
  }

  return (
    <>
      <header
        className="fixed top-0 left-0 w-full h-12 z-50 shadow-md"
        style={{ backgroundColor: "var(--color-header)" }}
      >
        <div className="relative flex items-center justify-between h-full pl-0 pr-6">
          {/* LOGO DESARROLLADOR */}
          <div className="flex items-center">
            <img
              src="/pcgredo.png"
              alt="PCG Developer"
              className="h-16 w-16 rounded-full object-contain shadow-lg"
            />
          </div>

          {/* TITULO CENTRADO */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1
              className="text-lg font-semibold"
              style={{ color: "var(--color-header-texto)" }}
            >
              {nombreClub}
            </h1>
          </div>

          {/* BOTONES DERECHA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMostrarConfig(true)}
              className="p-2 rounded-md hover:bg-white/10 transition"
              title="Configuración"
            >
              <Settings
                size={18}
                style={{ color: "var(--color-header-texto)" }}
              />
            </button>

            <button
              onClick={() => setMostrarAyuda(true)}
              className="p-2 rounded-md hover:bg-white/10 transition"
              title="Ayuda"
            >
              <HelpCircle
                size={18}
                style={{ color: "var(--color-header-texto)" }}
              />
            </button>

            <button
              onClick={cerrarSesion}
              className="p-2 rounded-md hover:bg-red-700 transition"
              title="Cerrar sesión"
            >
              <LogOut
                size={18}
                style={{ color: "var(--color-header-texto)" }}
              />
            </button>
          </div>
        </div>
      </header>

      {mostrarConfig && (
        <ConfigModal
          nombreClub={nombreClub}
          setNombreClub={setNombreClub}
          cerrar={() => setMostrarConfig(false)}
          cargarCanchas={cargarCanchas}
          canchas={canchas}
        />
      )}

      {mostrarAyuda && (
        <AyudaModal
          mostrarAyuda={mostrarAyuda}
          setMostrarAyuda={setMostrarAyuda}
        />
      )}

      {confirmarLogout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-[90%] max-w-sm">
            <p className="mb-4 font-semibold text-lg">
              ¿Seguro desea cerrar sesión?
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                  setConfirmarLogout(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Sí, salir
              </button>

              <button
                onClick={() => setConfirmarLogout(false)}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
