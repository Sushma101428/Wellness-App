// ui.js
import { currentUser } from "./auth.js";
import {
  getReadings,
  getAssignedPatients,
  getPatient
} from "./api.js";

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
}

function latestReading(rows) {
  const sorted = [...rows].sort((a, b) => a.date.localeCompare(b.date));
  return sorted[sorted.length - 1];
}

function renderPatientDashboard(user) {
  (async () => {
    const root = document.getElementById("app");
    const rows = await getReadings(user.id);
    if (!rows.length) {
      root.innerHTML = `
        <section class="card">
          <h2>Welcome, ${user.name}</h2>
          <p class="muted">No readings found. For demo, click the button to generate sample readings.</p>
          <button id="seedBtn" class="btn-primary mt-12">Generate sample readings</button>
        </section>
      `;
      document.getElementById("seedBtn").onclick = async () => {
        const { seedDemoReadings } = await import("./api.js");
        seedDemoReadings(user.id);
        location.reload();
      };
      return;
    }

    const today = todayStr();
    const todayRow =
      rows.find(r => r.date === today) || latestReading(rows) || {};

    const kpis = `
      <section class="card">
        <h2>Today's Health Summary</h2>
        <div class="grid-kpi mt-12">
          <div class="kpi">
            <div class="kpi-title">Blood Pressure</div>
            <div class="kpi-value">
              ${
                todayRow.bp_systolic
                  ? `${todayRow.bp_systolic}/${todayRow.bp_diastolic} mmHg`
                  : "—"
              }
            </div>
          </div>
          <div class="kpi">
            <div class="kpi-title">Heart Rate</div>
            <div class="kpi-value">${
              todayRow.hr ? todayRow.hr + " bpm" : "—"
            }</div>
          </div>
          <div class="kpi">
            <div class="kpi-title">Steps</div>
            <div class="kpi-value">${
              todayRow.steps ? todayRow.steps : "—"
            }</div>
          </div>
        </div>
      </section>
    `;

    const menu = `
      <section class="card mt-16">
        <h3>Quick Actions</h3>
        <div class="menu-grid">
          <a class="menu-item" href="trends.html">Trends</a>
          <a class="menu-item" href="alerts.html">Alerts</a>
          <a class="menu-item" href="profile.html">Profile</a>
          <a class="menu-item" href="log-symptom.html">Log Symptom</a>
        </div>
      </section>
    `;

    root.innerHTML = kpis + menu;
  })();
}

function renderProviderDashboard(user) {
  (async () => {
    const root = document.getElementById("app");
    const patientIds = await getAssignedPatients(user.id);

    let rowsHtml = "";

    for (const pid of patientIds) {
      const readings = await getReadings(pid);
      if (!readings.length) continue;
      const latest = latestReading(readings);
      rowsHtml += `
        <tr>
          <td>${pid}</td>
          <td>${
            latest.bp_systolic
              ? `${latest.bp_systolic}/${latest.bp_diastolic}`
              : "—"
          }</td>
          <td>${latest.hr ?? "—"}</td>
          <td>${latest.steps ?? "—"}</td>
          <td>${latest.date}</td>
          <td><a href="patient-detail.html?pid=${encodeURIComponent(
            pid
          )}">View</a></td>
        </tr>
      `;
    }

    if (!rowsHtml) {
      rowsHtml = `<tr><td colspan="6">No patients or no readings.</td></tr>`;
    }

    root.innerHTML = `
      <section class="card">
        <div class="row between">
          <h2>Patient Updates</h2>
          <a class="btn-ghost" href="dashboard.html">Home</a>
        </div>
        <div class="table-wrap mt-12">
          <table>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>BP (S/D)</th>
                <th>Heart Rate</th>
                <th>Steps</th>
                <th>Date</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>
      </section>
    `;
  })();
}

export function initDashboard() {
  const user = currentUser();
  if (!user) return;
  if (user.role === "patient") renderPatientDashboard(user);
  else renderProviderDashboard(user);
}
