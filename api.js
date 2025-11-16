// API MODULE — Fetch JSON & combine with new localStorage accounts

async function getPatients() {
    let base = await fetch("mock-patients.json").then(r => r.json());
    let extra = JSON.parse(localStorage.getItem("newPatients") || "[]");
    return base.concat(extra);
}

async function getProviders() {
    let base = await fetch("mock-providers.json").then(r => r.json());
    let extra = JSON.parse(localStorage.getItem("newProviders") || "[]");
    return base.concat(extra);
}

async function getPatientById(id) {
    let all = await getPatients();
    return all.find(p => p.id == id);
}

async function getVitals(patientId) {
    const data = await fetch("mock-readings.json").then(r => r.json());
    return data[patientId] || [];
}

async function getAssignedPatients(providerId) {
    let map = await fetch("mock-assignments.json").then(r => r.json());
    let ids = map[providerId] || [];
    let allPatients = await getPatients();
    return allPatients.filter(p => ids.includes(p.id));
}
