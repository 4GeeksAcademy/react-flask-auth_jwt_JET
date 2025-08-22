// /src/front/lib/api.js

// Normalize the backend base URL (handle presence/absence of trailing slash)
const RAW = import.meta.env.VITE_BACKEND_URL?.toString().trim();
const FALLBACK = "https://studious-zebra-v6rxgv4wggjw3xwvw-3001.app.github.dev"; // safe default for dev
const BASE = (RAW || FALLBACK).replace(/\/+$/, ""); // remove any trailing slash

function jsonHeaders(extra = {}) {
  return { "Content-Type": "application/json", ...extra };
}

/* ---------- Auth ---------- */
export async function signup({ email, password }) {
  const res = await fetch(`${BASE}/api/signup`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Signup failed");
  return data; // { token, user, message }
}

export async function login({ email, password }) {
  const res = await fetch(`${BASE}/api/token`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Login failed");
  return data; // { token, user }
}

export async function getPrivate(token) {
  const res = await fetch(`${BASE}/api/private`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Unauthorized");
  return data;
}

/* ---------- Cars (Private) ---------- */
export async function getCars(token) {
  const res = await fetch(`${BASE}/api/cars`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to fetch cars");
  return data; // array
}

export async function addCar(payload, token) {
  const res = await fetch(`${BASE}/api/cars`, {
    method: "POST",
    headers: { ...jsonHeaders(), Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to add car");
  return data; // created car
}

export async function deleteCar(id, token) {
  const res = await fetch(`${BASE}/api/cars/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok && res.status !== 204) {
    let data = {};
    try {
      data = await res.json();
    } catch {}
    throw new Error(data?.message || "Failed to delete car");
  }
  return true;
}

// Export normalized base for display/debug
export { BASE as API_BASE };
