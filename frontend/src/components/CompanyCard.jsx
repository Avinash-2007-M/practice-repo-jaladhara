import { Link } from "react-router-dom";
import DonorScore from "./DonorScore";
import StatusBadge from "./StatusBadge";

export default function CompanyCard({ company, onSave }) {
  return (
    <article className="company-card">
      <div className="company-card-top">
        <div className="company-logo">{company.shortName.slice(0, 2)}</div>
        <div className="company-title">
          <Link to={`/company/${company.id}`}><h3>{company.name}</h3></Link>
          <span>{company.industry} · {company.location}</span>
        </div>
        <button className="save-btn" onClick={() => onSave?.(company.id)} aria-label="Save lead">
          ♡
        </button>
      </div>

      <div className="card-divider" />
      <DonorScore score={company.donorScore} />

      <div className="company-stats">
        <div>
          <span>CSR spending</span>
          <strong>₹{company.csrSpending} Cr</strong>
        </div>
        <div>
          <span>Focus areas</span>
          <strong>{company.focusAreas.length} areas</strong>
        </div>
      </div>

      <div className="tag-list">
        {company.focusAreas.map((area) => <span key={area}>{area}</span>)}
      </div>

      <div className="company-card-footer">
        <StatusBadge status={company.status} />
        <Link className="view-link" to={`/company/${company.id}`}>View details →</Link>
      </div>
    </article>
  );
}