import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

const columns = [
  { title: "New Lead", key: "New Lead" },
  { title: "Contacted", key: "Contacted" },
  { title: "Interested", key: "Interested" },
  { title: "Converted", key: "Converted" }
];

export default function LeadPipeline({ companies }) {
  return (
    <div className="pipeline">
      {columns.map((column) => {
        const items = companies.filter((company) => company.status === column.key);
        return (
          <section className="pipeline-column" key={column.key}>
            <div className="pipeline-title">
              <span>{column.title}</span>
              <b>{items.length}</b>
            </div>
            <div className="pipeline-items">
              {items.map((company) => (
                <Link to={`/company/${company.id}`} className="pipeline-card" key={company.id}>
                  <div className="mini-logo">{company.shortName.slice(0, 2)}</div>
                  <strong>{company.name}</strong>
                  <span>{company.location}</span>
                  <div className="pipeline-bottom">
                    <span className="mini-score">{company.donorScore}</span>
                    <StatusBadge status={company.status} />
                  </div>
                </Link>
              ))}
              {items.length === 0 && <div className="empty-pipeline">No leads here</div>}
            </div>
          </section>
        );
      })}
    </div>
  );
}