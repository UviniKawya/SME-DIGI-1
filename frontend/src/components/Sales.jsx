import React, { useEffect, useState } from "react";
import { api } from "../api/api.js";

export default function Sales({ activeSme }) {
  const [sales, setSales] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ item_id: "", quantity_sold: "", sale_price: "", sale_date: "" });
  const [error, setError] = useState("");

  const load = () => {
    if (!activeSme) return;
    api.getSales(activeSme.id).then(setSales).catch((e) => setError(e.message));
    api.getInventory(activeSme.id).then(setItems).catch(() => {});
  };

  useEffect(load, [activeSme]);

  if (!activeSme) return <div className="card"><p>Please register or select an SME first.</p></div>;

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.item_id || !form.quantity_sold || !form.sale_price || !form.sale_date) {
      setError("All fields are required."); return;
    }
    try {
      await api.addSale({ ...form, sme_id: activeSme.id });
      setForm({ item_id: "", quantity_sold: "", sale_price: "", sale_date: "" });
      setError("");
      load();
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async (id) => {
    await api.deleteSale(id);
    load();
  };

  return (
    <div>
      <h1 className="page-title">Sales Management</h1>
      <p className="page-subtitle">{activeSme.sme_name}</p>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Record a Sale</h2>
        <form onSubmit={handleAdd} className="grid-2">
          <div>
            <label>Item *</label>
            <select value={form.item_id} onChange={(e) => update("item_id", e.target.value)}>
              <option value="">Select item</option>
              {items.map((it) => (
                <option key={it.id} value={it.id}>{it.item_name} (stock: {it.quantity})</option>
              ))}
            </select>
          </div>
          <div>
            <label>Quantity Sold *</label>
            <input type="number" value={form.quantity_sold} onChange={(e) => update("quantity_sold", e.target.value)} />
          </div>
          <div>
            <label>Sale Price (per unit, LKR) *</label>
            <input type="number" step="0.01" value={form.sale_price} onChange={(e) => update("sale_price", e.target.value)} />
          </div>
          <div>
            <label>Sale Date *</label>
            <input type="date" value={form.sale_date} onChange={(e) => update("sale_date", e.target.value)} />
          </div>
        </form>
        {error && <p style={{ color: "#dc2626" }}>{error}</p>}
        <button className="btn-primary" onClick={handleAdd}>Record Sale</button>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Sales History</h2>
        <table>
          <thead>
            <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th><th>Date</th><th></th></tr>
          </thead>
          <tbody>
            {sales.map((s) => (
              <tr key={s.id}>
                <td>{s.item_name}</td>
                <td>{s.quantity_sold}</td>
                <td>{s.sale_price}</td>
                <td>{(s.quantity_sold * s.sale_price).toFixed(2)}</td>
                <td>{s.sale_date}</td>
                <td><button className="btn-secondary" onClick={() => handleDelete(s.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
