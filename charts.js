// charts.js
import { currentUser } from "./auth.js";
import { getReadings } from "./api.js";

let chart;

function makeChart(ctx, metric, readings) {
  const labels = readings.map(r => r.date);

  let datasets = [];
  if (metric === "bp") {
    datasets = [
      {
        label: "Systolic",
        data: readings.map(r => r.bp_systolic),
        borderColor: "rgb(37, 99, 235)",
        fill: false
      },
      {
        label: "Diastolic",
        data: readings.map(r => r.bp_diastolic),
        borderColor: "rgb(16, 185, 129)",
        fill: false
      }
    ];
  } else if (metric === "hr") {
    datasets = [
      {
        label: "Heart Rate",
        data: readings.map(r => r.hr),
        borderColor: "rgb(239, 68, 68)",
        fill: false
      }
    ];
  } else if (metric === "glucose") {
    datasets = [
      {
        label: "Glucose",
        data: readings.map(r => r.glucose),
        borderColor: "rgb(234, 179, 8)",
        fill: false
      }
    ];
  } else if (metric === "steps") {
    datasets = [
      {
        label: "Steps",
        data: readings.map(r => r.steps),
        borderColor: "rgb(55, 65, 81)",
        fill: false
      }
    ];
  }

  chart = new Chart(ctx, {
    type: "line",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: { legend: { position: "top" } }
    }
  });
}

async function initTrends() {
  const user = currentUser();
  if (!user) return;

  const params = new URLSearchParams(location.search);
  const pid = params.get("pid");
  const targetId = user.role === "patient" ? user.id : pid;

  const chartArea = document.getElementById("chartArea");
  if (user.role === "provider" && !pid) {
    chartArea.textContent = "Open trends from Dashboard → View for a patient.";
    return;
  }

  const readings = (await getReadings(targetId)).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  if (!readings.length) {
    chartArea.textContent = "No readings available.";
    return;
  }

  chartArea.innerHTML = `<div style="height:260px"><canvas id="trendCanvas"></canvas></div>`;
  const ctx = document.getElementById("trendCanvas").getContext("2d");

  let currentMetric = "bp";
  makeChart(ctx, currentMetric, readings);

  document.querySelectorAll(".trend-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".trend-btn")
        .forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentMetric = btn.dataset.type;
      chart.destroy();
      makeChart(ctx, currentMetric, readings);
    });
  });
}

export { initTrends };
