import { currentUser } from "./auth.js";
import { getReadingsById } from "./api.js";

const user = currentUser();
const params = new URLSearchParams(location.search);
const pid = user.role === "patient" ? user.id : params.get("pid");

const noData = document.getElementById("noDataMsg");
const canvas = document.getElementById("trendChart");

let chart;

// If provider opened Trends directly without pid
if (user.role === "provider" && !pid) {
  noData.textContent = "Open trends from Dashboard → View for a patient.";
  canvas.style.display = "none";
} else {
  loadTrends();
}

async function loadTrends() {
  const readings = await getReadingsById(pid);

  if (!readings || readings.length === 0) {
    noData.textContent = "No readings available for this patient.";
    canvas.style.display = "none";
    return;
  }

  // sort by date
  readings.sort((a, b) => a.date.localeCompare(b.date));

  const labels = readings.map((r) => r.date);
  const series = {
    bp: readings.map((r) => r.bp_systolic),
    hr: readings.map((r) => r.hr),
    glu: readings.map((r) => r.glucose),
    steps: readings.map((r) => r.steps)
  };

  noData.textContent = "";

  const ctx = canvas.getContext("2d");

  function render(metricKey, label) {
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label,
            data: series[metricKey],
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: "Date" } },
          y: { beginAtZero: false }
        }
      }
    });
  }

  // initial chart
  render("bp", "Systolic BP");

  // buttons
  document.getElementById("btnBP").onclick = () => {
    setActive("btnBP");
    render("bp", "Systolic BP");
  };
  document.getElementById("btnHR").onclick = () => {
    setActive("btnHR");
    render("hr", "Heart Rate");
  };
  document.getElementById("btnGlucose").onclick = () => {
    setActive("btnGlucose");
    render("glu", "Glucose");
  };
  document.getElementById("btnSteps").onclick = () => {
    setActive("btnSteps");
    render("steps", "Steps");
  };
}

function setActive(id) {
  ["btnBP", "btnHR", "btnGlucose", "btnSteps"].forEach((btnId) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    if (btnId === id) btn.classList.add("active");
    else btn.classList.remove("active");
  });
}
