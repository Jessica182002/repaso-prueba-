const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = async ({ email, password }) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const text = await res.text(); // lee como texto primero
  const data = text ? JSON.parse(text) : {}; // parsea solo si hay contenido

  if (!res.ok) throw new Error(data.error || "Error al registrar");
  return data;
};
export const loginUser = async ({ email, password }) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Credenciales incorrectas");

  // Guarda el token para usarlo en requests futuros
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getToken = () => localStorage.getItem("token");
export const getUser  = () => JSON.parse(localStorage.getItem("user"));