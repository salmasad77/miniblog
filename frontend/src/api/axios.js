import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Ajouter automatiquement le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  profile: () => api.get("/auth/profile"),
};

// Posts API
export const postAPI = {
  getAll: (params) => api.get("/posts", { params }),
  getById: (id) => api.get(`/posts/${id}`),

  // ✅ IMPORTANT : axios détecte FormData automatiquement
  create: (data) => api.post("/posts/create", data),

  like: (id) => api.post(`/posts/${id}/like`),
  comment: (id, data) => api.post(`/posts/${id}/comment`, data),
  deletePost: (id) => api.delete(`/posts/${id}`),
};

export const categoriesAPI = {
  getAll: () => api.get("/categories"),
  create: (data) => api.post("/categories", data),
};

export const contactAPI = {
  sendMessage: (data) => api.post("/contact", data),
};

export default api;
