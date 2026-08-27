export default function LoadingState({ label = "Loading intelligence…" }) { return <div className="loading-state"><span className="spinner"/><p>{label}</p></div>; }
