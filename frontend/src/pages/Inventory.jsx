import { useState, useEffect } from "react";
import { Field } from "../components/Field";
import { Button } from "../components/Button";
import { getProducts, createProduct, deleteProduct } from "../services/productService";

const EMPTY_FORM = { name: "", description: "", price: "", quantity: "" };

export default function Inventory() {
  const [products, setProducts]   = useState([]);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [errors, setErrors]       = useState({});
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(false);
  const [fetching, setFetching]   = useState(true);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // Cargar productos al montar
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setFetching(false);
      }
    };
    load();
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim())                    e.name     = "Requerido";
    if (!form.price || form.price <= 0)       e.price    = "Precio inválido";
    if (form.quantity === "" || form.quantity < 0) e.quantity = "Cantidad inválida";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    try {
      const newProduct = await createProduct({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
      });
      setProducts((p) => [newProduct, ...p]);
      setForm(EMPTY_FORM);
    } catch (err) {
      setErrors({ name: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setProducts((p) => p.filter((prod) => prod.id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleCancel = () => { setEditingId(null); setForm(EMPTY_FORM); setErrors({}); };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const stockBadge = (quantity) => {
    if (quantity === 0)  return <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">Sin stock</span>;
    if (quantity <= 5)   return <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">Bajo ({quantity})</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">{quantity} und.</span>;
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
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-4">Agregar producto</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field type="text"   label="Nombre"      placeholder="Ej: Mermelada de mango"  value={form.name}        onChange={set("name")}        error={errors.name}     clearable />
            <Field type="text"   label="Descripción" placeholder="Opcional"               value={form.description} onChange={set("description")}                          clearable />
            <div className="grid grid-cols-2 gap-4">
              <Field type="number" label="Precio"    placeholder="0.00"  value={form.price}    onChange={set("price")}    error={errors.price}    prefix="$" inputProps={{ min: 0, step: "0.01" }} />
              <Field type="number" label="Cantidad"  placeholder="0"     value={form.quantity} onChange={set("quantity")} error={errors.quantity} suffix="und" inputProps={{ min: 0 }} />
            </div>
            <div className="flex gap-2 justify-end">
              {editingId && <Button variant="ghost" onClick={handleCancel} type="button">Cancelar</Button>}
              <Button type="submit" loading={loading}>{loading ? "Guardando…" : "Agregar"}</Button>
            </div>
          </form>
        </div>

        {/* Search */}
        <Field type="search" placeholder="Buscar producto…" value={search} onChange={(e) => setSearch(e.target.value)} clearable />

        {/* Table */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
          {fetching ? (
            <p className="text-sm text-zinc-400 text-center py-12">Cargando productos…</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-zinc-400 text-center py-12">No hay productos</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 text-left">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">Nombre</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">Descripción</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">Precio</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">Stock</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((prod) => (
                  <tr key={prod.id} className="border-b border-zinc-50 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-zinc-700 dark:text-zinc-200">{prod.name}</td>
                    <td className="px-5 py-3.5 text-zinc-400 dark:text-zinc-500">{prod.description || "—"}</td>
                    <td className="px-5 py-3.5 text-zinc-600 dark:text-zinc-400">${parseFloat(prod.price).toFixed(2)}</td>
                    <td className="px-5 py-3.5">{stockBadge(prod.quantity)}</td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => handleDelete(prod.id)} className="text-xs text-red-400 hover:text-red-600 font-medium">Eliminar</button>
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