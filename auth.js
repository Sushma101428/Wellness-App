// AUTH MODULE — Handles login, logout, create account

// Save new patient into localStorage
function registerPatient(name, email, password) {
    let list = JSON.parse(localStorage.getItem("newPatients") || "[]");
    const newId = "P" + Math.floor(1000 + Math.random() * 9000);

    list.push({
        id: newId,
        name,
        email,
        password,
        age: "",
        gender: "",
        condition: "Not provided"
    });

    localStorage.setItem("newPatients", JSON.stringify(list));
    return newId;
}

// Save new provider
function registerProvider(name, email, password, specialization) {
    let list = JSON.parse(localStorage.getItem("newProviders") || "[]");
    const newId = "D" + Math.floor(1000 + Math.random() * 9000);

    list.push({
        id: newId,
        name,
        email,
        password,
        specialization
    });

    localStorage.setItem("newProviders", JSON.stringify(list));
    return newId;
}

async function login(email, password, role) {
    // 1. Check mock JSON
    let users = [];

    if (role === "patient") {
        users = await fetch("mock-patients.json").then(r => r.json());
        users = users.concat(JSON.parse(localStorage.getItem("newPatients") || "[]"));
    } else {
        users = await fetch("mock-providers.json").then(r => r.json());
        users = users.concat(JSON.parse(localStorage.getItem("newProviders") || "[]"));
    }

    const found = users.find(u => u.email === email && u.password === password);

    if (found) {
        localStorage.setItem("activeUser", JSON.stringify(found));
        localStorage.setItem("role", role);

        if (role === "patient") {
            window.location.href = "dashboard.html";
        } else {
            window.location.href = "dashboard.html";
        }
    } else {
        alert("Invalid credentials");
    }
}

function logout() {
    localStorage.removeItem("activeUser");
    localStorage.removeItem("role");
    window.location.href = "index.html";
}
