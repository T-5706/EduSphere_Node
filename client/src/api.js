const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// One small fetch helper keeps URL, token and error handling in one place.
export async function api(path, options = {}) {
  const token = localStorage.getItem('edusphere_token');
  const headers = { ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!(options.body instanceof FormData) && options.body) headers['Content-Type'] = 'application/json';
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed.');
  return data;
}
export const uploadUrl = (path) => `${API_URL.replace('/api', '')}${path}`;
