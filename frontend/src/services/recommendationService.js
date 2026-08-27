import api from "./api";
export const getCompanyRecommendation = (id) => api.get(`/csr/companies/${id}/recommendation`);
