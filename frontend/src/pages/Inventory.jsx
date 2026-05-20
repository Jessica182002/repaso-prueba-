import { useState } from "react";
import { Field } from "../components/Field";
import { Button } from "../components/Button";

const INITIAL_PRODUCTS = [
  { id: 1, name: "Teclado mecánico", price: 89.99, stock: 12 },
  { id: 2, name: "Monitor 27\"",     price: 320.00, stock: 4  },
  { id: 3, name: "Mouse inalámbrico", price: 45.50, stock: 0  },
];

const EMPTY_FORM = { name: "", price: "", stock: "" };

export default function Inventory() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [errors, setErrors]     = useState({});
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch]     = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())              e.name  = "Requerido";
    if (!form.price || form.price <= 0) e.price = "Precio inválido";
    if (form.stock === "" || form.stock < 0) e.stock = "Stock inválido";
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});

    if (editingId !== null) {
      setProducts((p) => p.map((prod) =>
        prod.id === editingId
          ? { ...prod, name: form.name, price: parseFloat(form.price), stock: parseInt(form.stock) }
          : prod
      ));
      setEditingId(null);
    } else {
      setProducts((p) => [...p, {
        id: Date.now(),
        name: form.name,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
      }]);
    }
    setForm(EMPTY_FORM);
  };

  const handleEdit = (prod) => {
    setEditingId(prod.id);
    setForm({ name: prod.name, price: String(prod.price), stock: String(prod.stock) });
    setErrors({});
  };

  const handleDelete = (id) => setProducts((p) => p.filter((prod) => prod.id !== id));

  const handleCancel = () => { setEditingId(null); setForm(EMPTY_FORM); setErrors({}); };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const stockBadge = (stock) => {
    if (stock === 0)  return <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">Sin stock</span>;
    if (stock <= 5)   return <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">Bajo ({stock})</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">{stock} und.</span>;
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">Inventario</h1>
          <p className="text-sm text-zinc-400 mt-1">{products.length} productos registrados</p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-4">
            {editingId ? "Editar producto" : "Agregar producto"}
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field type="text"   label="Nombre"  placeholder="Ej: Teclado mecánico" value={form.name}  onChange={set("name")}  error={errors.name}  clearable />
            <div className="grid grid-cols-2 gap-4">
              <Field type="number" label="Precio" placeholder="0.00" value={form.price} onChange={set("price")} error={errors.price} prefix="$" inputProps={{ min: 0, step: "0.01" }} />
              <Field type="number" label="Stock"  placeholder="0"    value={form.stock} onChange={set("stock")} error={errors.stock} suffix="und" inputProps={{ min: 0 }} />
            </div>
            <div className="flex gap-2 justify-end">
              {editingId && <Button variant="ghost" onClick={handleCancel} type="button">Cancelar</Button>}
              <Button type="submit">{editingId ? "Guardar cambios" : "Agregar"}</Button>
            </div>
          </form>
        </div>

        {/* Search */}
        <Field type="search" placeholder="Buscar producto…" value={search} onChange={(e) => setSearch(e.target.value)} clearable />

        {/* Table */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
          {filtered.length === 0 ? (
            <p className="text-sm text-zinc-400 text-center py-12">No hay productos</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 text-left">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">Nombre</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">Precio</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">Stock</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((prod, i) => (
                  <tr
                    key={prod.id}
                    className={`border-b border-zinc-50 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors ${editingId === prod.id ? "bg-indigo-50 dark:bg-indigo-900/10" : ""}`}
                  >
                    <td className="px-5 py-3.5 font-medium text-zinc-700 dark:text-zinc-200">{prod.name}</td>
                    <td className="px-5 py-3.5 text-zinc-600 dark:text-zinc-400">${prod.price.toFixed(2)}</td>
                    <td className="px-5 py-3.5">{stockBadge(prod.stock)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => handleEdit(prod)} className="text-xs text-indigo-500 hover:text-indigo-700 font-medium">Editar</button>
                        <button onClick={() => handleDelete(prod.id)} className="text-xs text-red-400 hover:text-red-600 font-medium">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}