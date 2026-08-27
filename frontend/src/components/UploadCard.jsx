import { FileText, UploadCloud, X } from "lucide-react";
import { useRef, useState } from "react";
const formatBytes = (bytes) => `${(bytes / 1024 / 1024).toFixed(bytes < 1024 * 1024 ? 2 : 1)} MB`;
export default function UploadCard({ onAnalyze, loading }) {
  const input = useRef(); const [file, setFile] = useState(null); const [error, setError] = useState("");
  const choose = (next) => { if (!next) return; if (!next.name.toLowerCase().endsWith(".csv")) { setError("Please select a CSV file."); return; } setFile(next); setError(""); };
  const submit = () => { if (!file) { setError("Choose a CSV file before continuing."); return; } onAnalyze(file); };
  return <div className="upload-card glass" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); choose(e.dataTransfer.files[0]); }}>
    <input ref={input} type="file" accept=".csv,text/csv" hidden onChange={(e) => choose(e.target.files[0])}/>
    {!file ? <><div className="upload-orb"><UploadCloud size={34}/></div><h2>Drop your CSR dataset here</h2><p>CSV files only. Your file is sent securely to the Express analysis service.</p><button className="button secondary" onClick={() => input.current.click()}>Browse CSV file</button></> : <div className="file-selected"><span className="file-icon"><FileText/></span><div><strong>{file.name}</strong><p>{formatBytes(file.size)} · CSV ready to analyze</p></div><button className="icon-button" title="Remove file" onClick={() => setFile(null)}><X/></button></div>}
    {error && <p className="inline-error">{error}</p>}<button className="button analyze-button" disabled={loading} onClick={submit}>{loading ? <><span className="spinner"/>Processing dataset…</> : "Analyze CSR dataset"}</button>
  </div>;
}
