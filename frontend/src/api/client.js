import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

// ---- Auth helpers ----
export async function loginRequest(username, password) {
  const { data } = await api.post('/auth/login', { username, password });
  return data; // { token, username, role }
}

export async function registerRequest(username, email, password) {
  const { data } = await api.post('/auth/register', { username, email, password });
  return data;
}

// ---- Places ----
export async function searchPlaces(params = {}) {
  const { data } = await api.get('/places', { params });
  return data;
}

export async function getFeaturedPlaces() {
  const { data } = await api.get('/places/featured');
  return data;
}

export async function getPlace(id) {
  const { data } = await api.get(`/places/${id}`);
  return data;
}

export async function createPlace(payload) {
  const { data } = await api.post('/places', payload);
  return data;
}

// ---- Reviews ----
export async function getReviewsForPlace(placeId) {
  const { data } = await api.get(`/reviews/place/${placeId}`);
  return data;
}

export async function createReview(payload) {
  const { data } = await api.post('/reviews', payload);
  return data;
}

// ---- Admin (ADMIN role only) ----
export async function getPendingPlaces() {
  const { data } = await api.get('/admin/places/pending');
  return data;
}

export async function approvePlace(id) {
  const { data } = await api.patch(`/admin/places/${id}/approve`);
  return data;
}

export async function rejectPlace(id) {
  const { data } = await api.patch(`/admin/places/${id}/reject`);
  return data;
}

export async function getPendingReviews() {
  const { data } = await api.get('/admin/reviews/pending');
  return data;
}

export async function approveReview(id) {
  const { data } = await api.patch(`/admin/reviews/${id}/approve`);
  return data;
}

export async function rejectReview(id) {
  const { data } = await api.patch(`/admin/reviews/${id}/reject`);
  return data;
}
