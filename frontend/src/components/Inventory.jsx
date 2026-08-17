import React, { useEffect, useState } from "react";
import { api } from "../api/api.js";

export default function Inventory({ activeSme }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ item_name: "", category: "", quantity: "", unit_price: "", reorder_level: "5" });
  const [error, setError] = useState("");

  const load = () => {
    if (!activeSme) return;
    api.getInventory(activeSme.id).then(setItems).catch((e) => setError(e.message));
  };

  useEffect(load, [activeSme]);

  if (!activeSme) return <div className="card"><p>Please register or select an SME first.</p></div>;

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.item_name || !form.quantity) { setError("Item name and quantity are required."); return; }
    try {
      await api.addInventoryItem({ ...form, sme_id: activeSme.id });
      setForm({ item_name: "", category: "", quantity: "", unit_price: "", reorder_level: "5" });
      setError("");
      load();
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async (id) => {
    await api.deleteInventoryItem(id);
    load();
  };

  return (
    <div>
      <h1 className="page-title">Inventory Management</h1>
      <p className="page-subtitle">{activeSme.sme_name}</p>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Add Item</h2>
        <form onSubmit={handleAdd} className="grid-2">
          <div>
            <label>Item Name *</label>
            <input value={form.item_name} onChange={(e) => update("item_name", e.target.value)} />
          </div>
          <div>
            <label>Category</label>
            <input value={form.category} onChange={(e) => update("category", e.target.value)} />
          </div>
          <div>
            <label>Quantity *</label>
            <input type="number" value={form.quantity} onChange={(e) => update("quantity", e.target.value)} />
          </div>
          <div>
            <label>Unit Price (LKR)</label>
            <input type="number" step="0.01" value={form.unit_price} onChange={(e) => update("unit_price", e.target.value)} />
          </div>
          <div>
            <label>Reorder Level</label>
            <input type="number" value={form.reorder_level} onChange={(e) => update("reorder_level", e.target.value)} />
          </div>
        </form>
        {error && <p style={{ color: "#dc2626" }}>{error}</p>}
        <button className="btn-primary" onClick={handleAdd}>Add Item</button>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Current Stock</h2>
        <table>
          <thead>
            <tr><th>Item</th><th>Category</th><th>Qty</th><th>Unit Price</th><th>Reorder Level</th><th></th></tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td>{it.item_name}</td>
                <td>{it.category}</td>
                <td className={it.quantity <= it.reorder_level ? "low-stock" : ""}>{it.quantity}</td>
                <td>{it.unit_price}</td>
                <td>{it.reorder_level}</td>
                <td><button className="btn-secondary" onClick={() => handleDelete(it.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
