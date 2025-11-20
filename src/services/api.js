import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Shared axios instance for all API calls
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // send and receive cookies
});

// Authentication related calls
export const authApi = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  verifyOtp: (data) => api.post("/auth/verify-otp", data),
  resendOtp: (data) => api.post("/auth/resend-otp", data),
  getMe: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
  getGoogleUrl: () => `${API_URL}/auth/google`,
};

// Book CRUD endpoints
export const booksApi = {
  getAll: () => api.get("/books"),
  create: (data) => api.post("/books", data),
  getMine: () => api.get("/books/mine"),
  getOne: (id) => api.get(`/books/${id}`),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`),
};

// User-book related endpoints (reading list, progress, etc.)
export const userBooksApi = {
  getList: () => api.get("/userbooks"),
  getSummary: () => api.get("/userbooks/summary"),
  create: (data) => api.post("/userbooks", data),
  update: (id, data) => api.put(`/userbooks/${id}`, data),
  delete: (id) => api.delete(`/userbooks/${id}`),
};
