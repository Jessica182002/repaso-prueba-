import { getToken } from "./authService";

const API_URL = import.meta.env.VITE_API_URL;

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const getProducts = async () => {
  const res = await fetch(`${API_URL}/api/products`, {
    headers: authHeaders(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al obtener productos");
  return data.products;
};

export const createProduct = async ({ name, description, quantity, price }) => {
  const res = await fetch(`${API_URL}/api/products`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ name, description, quantity, price }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al crear producto");
  return data.product;
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al eliminar producto");
  return data;
};