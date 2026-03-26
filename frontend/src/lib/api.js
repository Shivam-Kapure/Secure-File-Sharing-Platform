const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || "Request failed");
  }

  return data;
}

export const api = {
  register: (payload) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  me: () => request("/auth/me"),
  logout: () => request("/auth/logout", { method: "POST" }),
  listFiles: () => request("/files"),
  createFile: (payload) => request("/files", { method: "POST", body: JSON.stringify(payload) }),
  deleteFile: (id) => request(`/files/${id}`, { method: "DELETE" }),
  getUploadURL: (payload) =>
    request("/files/upload-url", { method: "POST", body: JSON.stringify(payload) }),
  createShare: (fileId, payload) =>
    request(`/share/files/${fileId}/share`, { method: "POST", body: JSON.stringify(payload) }),
  getShare: (token) => request(`/share/${token}`)
};

export function buildShareUrl(token) {
  return `${window.location.origin}/share/${token}`;
}