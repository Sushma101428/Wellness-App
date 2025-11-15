// api.js

async function loadJSON(file) {
  const res = await fetch("./" + file, { cache: "no-store" });
  if (!res.ok) {
    console.error("Failed to load", file, res.status);
    return [];
  }
  return res.json();
}

// Patients

export async function getAllPatients() {
  const base = await loadJSON("mock-patients.json");
  const localPatients = Object.keys(localStorage)
    .filter(k => k.startsWith("patient_"))
    .map(k => JSON.parse(localStorage.getItem(k)));

  // merge without duplicates
  const byId = new Map();
  for (const p of [...base, ...localPatients]) {
    if (p && p.patient_id) byId.set(String(p.patient_id), p);
  }
  return Array.from(byId.values());
}

export async function getPatient(patientId) {
  const local = localStorage.getItem(`patient_${patientId}`);
  if (local) return JSON.parse(local);
  const all = await getAllPatients();
  return all.find(p => String(p.patient_id) === String(patientId)) || null;
}

// Providers

export async function getAllProviders() {
  const base = await loadJSON("mock-providers.json");
  const localProviders = Object.keys(localStorage)
    .filter(k => k.startsWith("provider_"))
    .map(k => JSON.parse(localStorage.getItem(k)));

  const byId = new Map();
  for (const p of [...base, ...localProviders]) {
    if (p && p.provider_id) byId.set(String(p.provider_id), p);
  }
  return Array.from(byId.values());
}

export async function getProvider(providerId) {
  const local = localStorage.getItem(`provider_${providerId}`);
  if (local) return JSON.parse(local);
  const all = await getAllProviders();
  return all.find(p => String(p.provider_id) === String(providerId)) || null;
}

// Assignments (provider -> patients)

export async function getAssignedPatients(providerId) {
  const rows = await loadJSON("mock-assignments.json");
  const row = rows.find(r => String(r.provider_id) === String(providerId));
  if (row && Array.isArray(row.patient_ids)) return row.patient_ids;
  // Fallback: all patients
  const patients = await getAllPatients();
  return patients.map(p => p.patient_id);
}

// Readings

export async function getReadings(patientId) {
  const base = await loadJSON("mock-readings.json");
  const localKey = `readings_${patientId}`;
  const local = JSON.parse(localStorage.getItem(localKey) || "[]");
  return [...base, ...local].filter(
    r => String(r.patient_id) === String(patientId)
  );
}

export function seedDemoReadings(patientId) {
  const today = new Date();
  const fmt = d =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  const d0 = fmt(today);
  const d1Date = new Date(today);
  d1Date.setDate(d1Date.getDate() - 1);
  const d1 = fmt(d1Date);

  const sample = [
    {
      patient_id: String(patientId),
      date: d1,
      bp_systolic: 128,
      bp_diastolic: 82,
      hr: 78,
      glucose: 112,
      steps: 5600
    },
    {
      patient_id: String(patientId),
      date: d0,
      bp_systolic: 145,
      bp_diastolic: 92,
      hr: 112,
      glucose: 190,
      steps: 6100
    }
  ];

  const key = `readings_${patientId}`;
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  localStorage.setItem(key, JSON.stringify([...existing, ...sample]));
}

// Symptom logs

export function saveSymptom(patientId, entry) {
  const key = `symptoms_${patientId}`;
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  existing.push(entry);
  localStorage.setItem(key, JSON.stringify(existing));
}

export function getSymptoms(patientId) {
  return JSON.parse(
    localStorage.getItem(`symptoms_${patientId}`) || "[]"
  ).reverse();
}
