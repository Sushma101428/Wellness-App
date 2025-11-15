// charts.js
import { currentUser } from "./auth.js";
import { getReadingsById } from "./api.js";

const params = new URLSearchParams(location.search);
const pidFromUrl = params.get("pid");

const user = currentUser();
let targetId = user.role === "patient" ? user.id : pidFromUrl;

// Provider opened trends without selecting a patient
if (user.role === "provider" && !pidFromUrl) {
  document.getElementById("chartArea").innerHTML =
    "Select a patient from Dashboard → View → Trends.";
  throw new Error("No patient ID provided for provider");
}

// Load data
let readings = await getReadingsById(targetId);

// UI element
const chartArea = document.getElementById("chartArea");

// If no readings
if (!readings || readings.length === 0) {
  chartArea.innerHTML = "No readings available.";
}

// Render chart
function renderChart(type) {
  if (!readings.length) {
    chartArea.innerHTML = "No readings available.";
    return;
  }

  if (type === "bp") {
    chartArea.innerHTML = `
      <h3>Blood Pressure Trends</h3>
      <p>Systolic: ${readings.map(r => r.sbp).join(", ")}</p>
      <p>Diastolic: ${readings.map(r => r.dbp).join(", ")}</p>
    `;
  }

  if (type === "hr") {
    chartArea.innerHTML = `
      <h3>Heart Rate Trends</h3>
      <p>${readings.map(r => r.hr).join(", ")}</p>
    `;
  }

  if (type === "glucose") {
    chartArea.innerHTML = `
      <h3>Glucose Trends</h3>
      <p>${readings.map(r => r.glucose).join(", ")}</p>
    `;
  }

  if (type === "steps") {
    chartArea.innerHTML = `
      <h3>Steps Trends</h3>
      <p>${readings.map(r => r.steps).join(", ")}</p>
    `;
  }
}

// Default chart
renderChart("bp");

// Handle button clicks
document.querySelectorAll(".trend-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelector(".trend-btn.active")?.classList.remove("active");
    btn.classList.add("active");
    renderChart(btn.dataset.type);
  };
});







