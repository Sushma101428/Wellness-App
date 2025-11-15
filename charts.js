import { currentUser } from "./auth.js";
import { getReadingsById } from "./api.js";

const params = new URLSearchParams(location.search);
const pidURL = params.get("pid");

const user = currentUser();

// PATIENT → use own ID
// PROVIDER → must have pid in URL
let targetId = user.role === "patient" ? user.id : pidURL;

// PROVIDER ERROR HANDLING
if (user.role === "provider" && !pidURL) {
  document.getElementById("chartArea").innerHTML =
    "Please open trends from Dashboard → View.";
  throw new Error("Provider missing patient ID");
}

// LOAD READINGS
let readings = await getReadingsById(targetId);

const chartArea = document.getElementById("chartArea");

// NO DATA
if (!readings || readings.length === 0) {
  chartArea.innerHTML = "No readings available.";
  return;
}

// RENDER CHARTS
function render(type) {
  if (type === "bp") {
    chartArea.innerHTML = `
      <h3>Blood Pressure</h3>
      <p>${readings.map(r => `${r.sbp}/${r.dbp}`).join(", ")}</p>`;
  }

  if (type === "hr") {
    chartArea.innerHTML = `
      <h3>Heart Rate</h3>
      <p>${readings.map(r => r.hr).join(", ")}</p>`;
  }

  if (type === "glucose") {
    chartArea.innerHTML = `
      <h3>Glucose</h3>
      <p>${readings.map(r => r.glucose).join(", ")}</p>`;
  }

  if (type === "steps") {
    chartArea.innerHTML = `
      <h3>Steps</h3>
      <p>${readings.map(r => r.steps).join(", ")}</p>`;
  }
}

// INITIAL LOAD
render("bp");

// BUTTON SWITCHING
document.querySelectorAll(".trend-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelector(".trend-btn.active")?.classList.remove("active");
    btn.classList.add("active");
    render(btn.dataset.type);
  };
});
