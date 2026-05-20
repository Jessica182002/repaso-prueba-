import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Field } from "../components/Field";
import { Button } from "../components/Button";
import { loginUser } from "../services/authService";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Completa todos los campos"); return; }
    setError("");

    setLoading(true);
    try {
      await loginUser({ email: form.email, password: form.password });
      navigate("/inventory");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-8 flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">Iniciar sesión</h1>
          <p className="text-sm text-zinc-400 mt-1">Bienvenido de vuelta</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field type="email"    label="Correo electrónico" placeholder="jane@example.com" value={form.email}    onChange={set("email")}    required clearable />
          <Field type="password" label="Contraseña"         placeholder="Tu contraseña"    value={form.password} onChange={set("password")} required />

          {error && <p className="text-xs text-red-500">{error}</p>}

          <Button type="submit" fullWidth loading={loading}>
            {loading ? "Iniciando sesión…" : "Iniciar sesión"}
          </Button>
        </form>

        <p className="text-sm text-center text-zinc-400">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-indigo-600 hover:underline font-medium">Regístrate</a>
        </p>
      </div>
    </div>
  );
}