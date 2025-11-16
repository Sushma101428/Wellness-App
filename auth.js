// ===============================
//   LOAD MOCK USERS
// ===============================
import { getPatients, getProviders } from "./api.js";

// save current user in localStorage
export function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

// read current user
export function currentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

// logout
export function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

// ===============================
//   LOGIN FUNCTION
// ===============================
export async function loginUser(id, password, role) {
  // 1) MOCK USERS FROM JSON
  let mockUsers = [];

  if (role === "patient") {
    mockUsers = await getPatients();
  } else {
    mockUsers = await getProviders();
  }

  // 2) NEW USERS CREATED (LOCALSTORAGE)
  let newUsers = JSON.parse(localStorage.getItem("users") || "[]");

  // Only include new users of the same role
  newUsers = newUsers.filter((u) => u.role === role);

  // 3) COMBINE USERS
  const allUsers = [...mockUsers, ...newUsers];

  // 4) FIND USER
  const user = allUsers.find((u) => u.id == id && u.password == password);

  if (!user) return null;

  // 5) LOGIN SUCCESS → save & redirect
  setCurrentUser(user);
  return user;
}

// ===============================
//   REGISTER NEW USER
// ===============================
export function registerUser(newUser) {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
}

