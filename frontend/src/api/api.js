// Base URL of the PHP backend running under XAMPP htdocs
// Adjust the folder name if you place the backend elsewhere
const BASE_URL = "http://localhost/sme-digi/backend/api";

async function request(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  registerSme: (data) =>
    request("register_sme.php", { method: "POST", body: JSON.stringify(data) }),

  getSmes: () => request("get_smes.php"),

  getQuestions: (businessType) =>
    request(`get_questions.php?business_type=${encodeURIComponent(businessType)}`),

  submitAssessment: (smeId, answers) =>
    request("submit_assessment.php", {
      method: "POST",
      body: JSON.stringify({ sme_id: smeId, answers }),
    }),

  getInventory: (smeId) => request(`inventory.php?sme_id=${smeId}`),
  addInventoryItem: (data) =>
    request("inventory.php", { method: "POST", body: JSON.stringify(data) }),
  updateInventoryItem: (data) =>
    request("inventory.php", { method: "PUT", body: JSON.stringify(data) }),
  deleteInventoryItem: (id) =>
    request(`inventory.php?id=${id}`, { method: "DELETE" }),

  getSales: (smeId) => request(`sales.php?sme_id=${smeId}`),
  addSale: (data) =>
    request("sales.php", { method: "POST", body: JSON.stringify(data) }),
  deleteSale: (id) => request(`sales.php?id=${id}`, { method: "DELETE" }),

  getDashboard: (smeId) => request(`dashboard.php?sme_id=${smeId}`),
};
