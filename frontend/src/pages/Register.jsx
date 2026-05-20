import { useState } from "react";
import { Field } from "../components/Field";
import { Button } from "../components/Button";
import { registerUser } from "../services/authService";

export default function Register() {
  const [form, setForm] = useState({email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Correo inválido";
    if (form.password.length < 4) e.password = "Mínimo 4 caracteres";
    if (form.password !== form.confirm) e.confirm = "Las contraseñas no coinciden";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});

    setLoading(true);
    try {
      await registerUser({ email: form.email, password: form.password });
      window.location.href = "/login";
    } catch (err) {
      setErrors({ email: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-8 flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">Crear cuenta</h1>
          <p className="text-sm text-zinc-400 mt-1">Ingresa tus datos para registrarte</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field type="email"    label="Correo electrónico" placeholder="jane@example.com"    value={form.email}    onChange={set("email")}    error={errors.email}    required clearable />
          <Field type="password" label="Contraseña"         placeholder="Mínimo 4 caracteres" value={form.password} onChange={set("password")} error={errors.password} required />
          <Field type="password" label="Confirmar contraseña" placeholder="Repite tu contraseña" value={form.confirm} onChange={set("confirm")} error={errors.confirm} required success={form.confirm.length > 0 && form.confirm === form.password} />

          <Button type="submit" fullWidth loading={loading} className="mt-2">
            {loading ? "Creando cuenta…" : "Crear cuenta"}
          </Button>
        </form>

        <p className="text-sm text-center text-zinc-400">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-indigo-600 hover:underline font-medium">Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}