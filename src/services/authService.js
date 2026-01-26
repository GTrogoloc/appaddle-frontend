const API_URL = "http://localhost:8080/admin";

// LOGIN
export async function login(usuario, contraseña) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      usuario: usuario,
      contraseña: contraseña,
    }),
  });

  if (!response.ok) {
    throw new Error("Usuario o contraseña incorrectos");
  }

  const data = await response.json();

  // 🔐 Guardamos sesión
  localStorage.setItem("token", data.data.token);
  localStorage.setItem(
    "admin",
    JSON.stringify(data.data.administrador)
  );

  return data;
}

// LOGOUT
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("admin");
}

// SESIÓN ACTIVA?
export function isAuthenticated() {
  return !!localStorage.getItem("token");
}