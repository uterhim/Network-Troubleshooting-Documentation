const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4100/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  getIncidents: (filters = {}) => {
    const qs = new URLSearchParams(filters).toString();
    return request(`/incidents${qs ? `?${qs}` : ''}`);
  },
  createIncident: (data) => request('/incidents', { method: 'POST', body: JSON.stringify(data) }),
  updateIncident: (id, data) => request(`/incidents/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getRunbooks: () => request('/runbooks'),
  getRunbook: (slug) => request(`/runbooks/${slug}`),
};
