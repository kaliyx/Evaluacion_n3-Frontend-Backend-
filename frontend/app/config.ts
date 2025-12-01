export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

export function authHeaders() {
	const token = localStorage.getItem('token');
	return token ? { Authorization: `Bearer ${token}` } : {};
}

export default API_BASE;
