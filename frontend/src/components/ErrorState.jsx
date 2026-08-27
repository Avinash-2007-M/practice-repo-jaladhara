import { AlertTriangle } from "lucide-react";
export default function ErrorState({ message, retry }) { return <div className="error-state glass"><AlertTriangle size={25}/><div><h3>Unable to load this data</h3><p>{message}</p></div>{retry && <button className="button secondary" onClick={retry}>Try again</button>}</div>; }
