// Load JSON file (mock data)
async function loadJSON(file) {
  const res = await fetch(`./${file}`);
  if (!res.ok) {
    console.error("Failed to load:", file, res.status);
    return [];
  }
  return res.json();
}

// -------------------------
//   PATIENT / PROVIDER DATA
// -------------------------
export async function getPatients() {
  return loadJSON("mock-patients.json");
}

export async function getPatientById(id) {
  const list = await getPatients();
  return list.find(p => p.id == id);
}

export async function getProviders() {
  return loadJSON("mock-providers.json");
}

export async function getProviderById(id) {
  const list = await getProviders();
  return list.find(p => p.id == id);
}

export async function getAssignments() {
  return loadJSON("mock-assignments.json");
}

// -------------------------
//   AUTO VITAL GENERATOR
// -------------------------
function generateVitals() {
  return {
    date: new Date().toISOString().split("T")[0],
    bp_systolic: Math.floor(Math.random() * 20) + 115,  // 115–135
    bp_diastolic: Math.floor(Math.random() * 10) + 70, // 70–85
    hr: Math.floor(Math.random() * 20) + 65,           // 65–85
    glucose: Math.floor(Math.random() * 40) + 90,      // 90–130
    steps: Math.floor(Math.random() * 5000) + 3000     // 3000–8000
  };
}

// -------------------------
//   READING LOOKUP (MOCK + NEW PATIENTS)
// -------------------------
export async function getReadingsById(id) {
  const mock = await loadJSON("mock-readings.json");

  const fromMock = mock.filter(r => r.patient_id == id);

  // NEW PATIENT → use LocalStorage
  let ls = JSON.parse(localStorage.getItem(`readings_${id}`) || "[]");

  // If localStorage empty, auto-generate 1 reading
  if (ls.length === 0 && fromMock.length === 0) {
    const newVitals = generateVitals();
    ls = [{
      patient_id: id,
      ...newVitals
    }];
    localStorage.setItem(`readings_${id}`, JSON.stringify(ls));
  }

  return [...fromMock, ...ls];
}

// Save new vitals (if you want provider/manual entry later)
export function saveVitals(id, reading) {
  let ls = JSON.parse(localStorage.getItem(`readings_${id}`) || "[]");
  ls.push(reading);
  localStorage.setItem(`readings_${id}`, JSON.stringify(ls));
}
