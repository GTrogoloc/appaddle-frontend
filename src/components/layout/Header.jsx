import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import { LogOut, HelpCircle, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import ConfigModal from "./ConfigModal";

const COLOR_TEXTO_DEFAULT = "#ffffff";

function Header() {
  const navigate = useNavigate();
  const [nombreClub, setNombreClub] = useState("Molino Pádel");
  const [mostrarConfig, setMostrarConfig] = useState(false);

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
  
    const colorTextoGuardado = localStorage.getItem("colorHeaderTexto") || COLOR_TEXTO_DEFAULT;
    if (colorTextoGuardado) {
      document.documentElement.style.setProperty(
        "--color-header-texto",
        colorTextoGuardado
      );
    }
  }, []);

  function cerrarSesion() {
    const confirmar = window.confirm("¿Seguro desea cerrar sesión?");
    if (!confirmar) return;

    logout();
    navigate("/");
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
        <Settings size={18} style={{ color: "var(--color-header-texto)" }} />
      </button>

      <button
        className="p-2 rounded-md hover:bg-white/10 transition"
        title="Ayuda"
      >
        <HelpCircle size={18} style={{ color: "var(--color-header-texto)" }} />
      </button>

      <button
        onClick={cerrarSesion}
        className="p-2 rounded-md hover:bg-red-700 transition"
        title="Cerrar sesión"
      >
        <LogOut size={18} style={{ color: "var(--color-header-texto)" }} />
      </button>
    </div>

  </div>
</header>
  
      {mostrarConfig && (
        <ConfigModal
          nombreClub={nombreClub}
          setNombreClub={setNombreClub}
          cerrar={() => setMostrarConfig(false)}
        />
      )}
    </>
  );
}

export default Header;