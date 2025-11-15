// auth.js

export function login(user) {
  localStorage.setItem("rpm_user", JSON.stringify(user));
}

export function currentUser() {
  const raw = localStorage.getItem("rpm_user");
  return raw ? JSON.parse(raw) : null;
}

export function logout() {
  localStorage.removeItem("rpm_user");
  location.href = "index.html";
}

export function requireAuth() {
  const path = location.pathname;
  const isLogin =
    path.endsWith("/") ||
    path.endsWith("/index.html") ||
    path.endsWith("index.html");

  if (!isLogin && !currentUser()) {
    location.href = "index.html";
  }
}
