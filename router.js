// router.js
import { requireAuth, logout } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  requireAuth();
  const btn = document.getElementById("logoutBtn");
  if (btn) btn.addEventListener("click", logout);
});




