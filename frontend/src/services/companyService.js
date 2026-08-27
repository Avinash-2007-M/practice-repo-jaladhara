import api from "./api";
export const getCompanies = () => api.get("/csr/companies");
export const getCompanyById = (id) => api.get(`/csr/companies/${id}`);
