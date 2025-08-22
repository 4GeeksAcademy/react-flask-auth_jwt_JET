// /src/front/lib/api.js

// Normalize the backend base URL (no trailing slash needed in .env)
const RAW = import.meta.env.VITE_BACKEND_URL?.toString().trim();
const FALLBACK = "https://studious-zebra-v6rxgv4wggjw3xwvw-3001.app.github.dev";
const API_BASE = (RAW || FALLBACK).replace(/\/+$/, "");

// IMPORTANT: backend must set app.config["JWT_HEADER_TYPE"] = "JWT"
const AUTH_HEADER_SCHEME = "JWT";

function jsonHeaders(extra = {}) {
  return { "Content-Type": "application/json", ...extra };
}

async function parseJsonOrText(res) {
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* not JSON */
  }
  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) || `HTTP ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

/* ---------- Auth ---------- */
export async function signup({ email, password }) {
  const res = await fetch(`${API_BASE}/api/signup`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify({ email, password }),
  });
  return parseJsonOrText(res);
}

export async function login({ email, password }) {
  const res = await fetch(`${API_BASE}/api/token`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify({ email, password }),
  });
  return parseJsonOrText(res); // { token, user }
}

/* ---------- Private (cars saved under /api/private) ---------- */
const authHeader = (jwt) => ({ Authorization: `${AUTH_HEADER_SCHEME} ${jwt}` });

export async function getCars(jwt) {
  const res = await fetch(`${API_BASE}/api/private`, {
    headers: authHeader(jwt),
  });
  return parseJsonOrText(res); // array
}

export async function addCar(payload, jwt) {
  const res = await fetch(`${API_BASE}/api/private`, {
    method: "POST",
    headers: { ...jsonHeaders(), ...authHeader(jwt) },
    body: JSON.stringify(payload),
  });
  return parseJsonOrText(res); // created car
}

export async function deleteCar(id, jwt) {
  const res = await fetch(`${API_BASE}/api/private/${id}`, {
    method: "DELETE",
    headers: authHeader(jwt),
  });
  if (!res.ok && res.status !== 204) return parseJsonOrText(res);
  return true;
}

export { API_BASE };
