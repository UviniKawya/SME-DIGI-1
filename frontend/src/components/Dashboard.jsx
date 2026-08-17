import React, { useEffect, useState } from "react";
import { Radar, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS, RadialLinearScale, CategoryScale, LinearScale,
  PointElement, LineElement, BarElement, Filler, Tooltip, Legend
} from "chart.js";
import { api } from "../api/api.js";

ChartJS.register(
  RadialLinearScale, CategoryScale, LinearScale,
  PointElement, LineElement, BarElement, Filler, Tooltip, Legend
);

export default function Dashboard({ activeSme }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!activeSme) return;
    api.getDashboard(activeSme.id).then(setData).catch((e) => setError(e.message));
  }, [activeSme]);

  if (!activeSme) {
    return (
      <div className="card">
        <p>No SME selected yet. Go to <strong>SME Registration</strong> to get started.</p>
      </div>
    );
  }

  if (error) return <div className="card"><p style={{ color: "#dc2626" }}>{error}</p></div>;
  if (!data) return <div className="card"><p>Loading dashboard...</p></div>;

  const dimensions = data.readiness_by_dimension.map((r) => r.dimension);
  const scores = data.readiness_by_dimension.map((r) => r.avg_score);

  const radarData = {
    labels: dimensions,
    datasets: [{
      label: "Digital Readiness (1-5)",
      data: scores,
      backgroundColor: "rgba(41,82,227,0.2)",
      borderColor: "#2952e3",
      pointBackgroundColor: "#2952e3",
    }],
  };

  const inventoryData = {
    labels: data.inventory.map((i) => i.item_name),
    datasets: [{
      label: "Stock Quantity",
      data: data.inventory.map((i) => i.quantity),
      backgroundColor: "#2952e3",
    }],
  };

  const salesData = {
    labels: data.sales_trend.map((s) => s.month),
    datasets: [{
      label: "Revenue (LKR)",
      data: data.sales_trend.map((s) => s.total_revenue),
      borderColor: "#16a34a",
      backgroundColor: "rgba(22,163,74,0.15)",
      fill: true,
      tension: 0.3,
    }],
  };

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">{activeSme.sme_name} &middot; {activeSme.business_type}</p>

      <div className="grid-2">
        <div className="card">
          <div className="stat-value">{data.overall_score || "-"} / 5</div>
          <div className="stat-label">Overall Digital Readiness Score</div>
        </div>
        <div className="card">
          <div className="stat-value" style={{ color: data.low_stock_count > 0 ? "#dc2626" : "#16a34a" }}>
            {data.low_stock_count}
          </div>
          <div className="stat-label">Items at/below reorder level</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Digital Readiness by Dimension</h2>
          {dimensions.length > 0
            ? <Radar data={radarData} options={{ scales: { r: { min: 0, max: 5 } } }} />
            : <p>No assessment submitted yet.</p>}
        </div>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Inventory Levels</h2>
          {data.inventory.length > 0
            ? <Bar data={inventoryData} />
            : <p>No inventory items yet.</p>}
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Sales Revenue Trend</h2>
        {data.sales_trend.length > 0
          ? <Line data={salesData} />
          : <p>No sales recorded yet.</p>}
      </div>
    </div>
  );
}
