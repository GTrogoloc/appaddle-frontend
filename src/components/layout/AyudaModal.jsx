import React from "react";

function AyudaModal({ mostrarAyuda, setMostrarAyuda }) {
  if (!mostrarAyuda) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white w-[95%] max-w-3xl rounded-xl shadow-xl p-6 max-h-[80vh] flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-lg">❓ Centro de ayuda</h3>

          <button
            onClick={() => setMostrarAyuda(false)}
            className="text-red-600 font-bold text-lg hover:scale-110 transition"
          >
            ✕
          </button>
        </div>
        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded-md text-sm mb-4">
          <p className="leading-relaxed">
            Bienvenido al centro de ayuda. Aquí encontrarás información para
            utilizar el sistema.
          </p>
        </div>
        {/* CONTENIDO */}
        <div className="flex-1 overflow-y-auto space-y-5 text-sm border-t pt-4">
          {/* SOBRE EL SISTEMA */}
          <div className="bg-gray-50 p-4 rounded-md border">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              🎾 Sobre el sistema
            </h4>
            <p className="text-gray-700">
              Sistema de gestión de reservas diseñado para clubes de pádel.
            </p>

            <p className="text-gray-700 mt-1">
              Permite organizar turnos, administrar clientes y analizar
              estadísticas de ocupación para mejorar la planificación y el
              rendimiento de tu club en un solo lugar.
            </p>

            <p className="text-gray-700 mt-1">
              Desarrollado con el objetivo de simplificar la gestión diaria del
              club y brindar herramientas útiles para tomar mejores decisiones.
            </p>

            <div className="mt-3 text-xs text-gray-500 space-y-1">
              <p>Versión 1.0 • 2026</p>
              <p>Desarrollado por PCG Developer</p>
            </div>
          </div>

          {/* GUIA RAPIDA */}
          <div className="bg-gray-50 p-4 rounded-md border">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              📘 Guía rápida
            </h4>

            <ul className="space-y-1">
              <li>
                📅 En el calendario clickeando una fecha podés ver
                disponibilidad de canchas y horarios del día.
              </li>
              <li>➕ Hacé click en un horario libre para crear una reserva.</li>
              <li>
                🗑 En reservas podes cancelarla si es necesario y volver a
                crearla.
              </li>
              <li>
                📊 En estadísticas podés ver ocupación, comportamiento de
                clientes y pagos.
              </li>
            </ul>
          </div>

          {/* CONSEJOS */}
          <div className="bg-gray-50 p-4 rounded-md border">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              💡 Consejos de uso
            </h4>

            <ul className="space-y-1">
              <li>📉 Revisá los horarios flojos para aplicar promociones.</li>
              <li>🏆 Los clientes más activos pueden recibir beneficios.</li>
              <li>😴 Contactá clientes inactivos para recuperar reservas.</li>
              <li>📊 Mirá la ocupación mensual para entender la demanda.</li>
            </ul>
          </div>

          {/* PROBLEMAS COMUNES */}
          <div className="bg-gray-50 p-4 rounded-md border">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              ⚠️ Problemas comunes
            </h4>

            <ul className="space-y-1">
              <li>
                ❌ No puedo reservar un horario → probablemente ya esté ocupado
                o fuera de horario.
              </li>
              <li>👤 No encuentro un cliente → buscá por teléfono.</li>
              <li>
                🗑 Una reserva desapareció → puede haber sido cancelada o
                finalizada.
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-md border">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              📱 Contacto de Soporte
            </h4>

            <p className="mb-3">
              Si detectás un error o algo no funciona correctamente, podés
              comunicarte con soporte.
            </p>

            <div className="space-y-1 text-sm">
              <p>
                📞 Teléfono:{" "}
                <a
                  href="tel:+5491112345678"
                  className="font-semibold hover:underline"
                >
                  +54 3491 414782
                </a>
              </p>

              <p>
                📧 Email:{" "}
                <a
                  href="mailto:soporte@pcgdeveloper.com"
                  className="font-semibold hover:underline"
                >
                  gastomt@hotmail.com
                </a>
              </p>
            </div>

            <div className="mt-4">
              <a
                href="https://wa.me/5493491414782"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm"
              >
                Contactar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AyudaModal;
