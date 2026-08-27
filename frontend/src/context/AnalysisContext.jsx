import { createContext, useContext, useEffect, useState } from "react";
const AnalysisContext = createContext();
export const AnalysisProvider = ({ children }) => {
  const [analysis, setAnalysisState] = useState(() => { try { return JSON.parse(sessionStorage.getItem("csr-analysis")) || null; } catch { return null; } });
  const [toast, setToast] = useState(null);
  const setAnalysis = (result) => { setAnalysisState(result); sessionStorage.setItem("csr-analysis", JSON.stringify(result)); };
  const notify = (message, kind = "success") => setToast({ message, kind });
  useEffect(() => { if (!toast) return; const id = setTimeout(() => setToast(null), 3500); return () => clearTimeout(id); }, [toast]);
  return <AnalysisContext.Provider value={{ analysis, setAnalysis, notify }}>{children}{toast && <div className={`toast ${toast.kind}`}>{toast.message}</div>}</AnalysisContext.Provider>;
};
export const useAnalysis = () => useContext(AnalysisContext);
