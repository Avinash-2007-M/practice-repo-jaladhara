import api from "./api";

export const login = (credentials) => api.post("/csr/auth/login", credentials);

export const signup = (details) => api.post("/csr/auth/signup", details);

export const logout = () => api.get("/csr/auth/logout");
