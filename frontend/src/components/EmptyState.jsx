import { Database } from "lucide-react";
export default function EmptyState({ title = "Nothing here yet", text, action }) { return <div className="empty-state glass"><Database size={30}/><h3>{title}</h3>{text && <p>{text}</p>}{action}</div>; }
