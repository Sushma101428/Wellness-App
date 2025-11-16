// ==========================================================
//  LOAD JSON FILE (used for mock data)
// ==========================================================
async function loadJSON(file) {
  const res = await fetch(`./${file}`);
  if (!res.ok) {
    console.error("Failed to load:", file, res.status);
    return [];
  }
  return res.json();
}

// ==========================================================
//  PATIENT DATA (MOCK)
// ==========================================================
export async function getPatients() {
  return loadJSON("mock-patients.json");
}

export async function getPatientById(id) {
  const list = await getPatients();
  return list.find((p) => p.id == id);
}

// ==========================================================
//  PROVIDER DATA (MOCK)
// ==========================================================
export async function getProviders() {
  return loadJSON("mock-providers.json");
}

export async function getProviderById(id) {
  const list = await getProviders();
  return list.find((p) => p.id == id);
}

// ==========================================================
//  PROVIDER → PATIENT ASSIGNMENTS (MOCK)
//  (Optional – used if you want mapping later)
// ==========================================================
export async function getAssignments() {
  return loadJSON("mock-assignments.json");
}

// ==========================================================
//  AUTO-GENERATED VITALS FOR NEW PATIENTS
//  (for patients that are NOT in mock-readings.json)
// ==========================================================
function generateVitals(id) {
  return {
    patient_id: id,
    date: new Date().toISOString().split("T")[0], // today's date
    bp_systolic: Math.floor(Math.random() * 20) + 115, // 115–135
    bp_diastolic: Math.floor(Math.random() * 10) + 70, // 70–85
    hr: Math.floor(Math.random() * 20) + 65, // 65–85
    glucose: Math.floor(Math.random() * 40) + 90, // 90–130
    steps: Math.floor(Math.random() * 5000) + 3000 // 3000–8000
  };
}

// ==========================================================
//  GET READINGS FOR A PATIENT (MOCK + NEW)
// ==========================================================
export async function getReadingsById(id) {
  // 1) Load mock readings from JSON
  const mock = await loadJSON("mock-readings.json");

  // 2) Filter mock readings for this patient
  const fromMock = mock.filter((r) => r.patient_id == id);

  // 3) Load any readings stored in localStorage (for new patients)
  let stored = JSON.parse(localStorage.getItem(`readings_${id}`) || "[]");

  // 4) If there is NO mock data and NO stored data, generate one healthy reading
  if (stored.length === 0 && fromMock.length === 0) {
    const newReading = generateVitals(id);
    stored = [newReading];
    localStorage.setItem(`readings_${id}`, JSON.stringify(stored));
  }

  // 5) Return combined readings
  return [...fromMock, ...stored];
}

// ==========================================================
//  SAVE NEW READING (for future forms / provider entry)
// ==========================================================
export function saveVitals(id, reading) {
  let stored = JSON.parse(localStorage.getItem(`readings_${id}`) || "[]");
  stored.push(reading);
  localStorage.setItem(`readings_${id}`, JSON.stringify(stored));
}
