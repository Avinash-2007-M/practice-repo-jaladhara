import api from "./api";
const upload = (path, file) => { const data = new FormData(); data.append("file", file); return api.post(path, data); };
export const analyzeCompanies = (file) => upload("/csr/companies/analyze", file);
export const analyzeCSRFile = (file) => upload("/csr/analyze", file);
