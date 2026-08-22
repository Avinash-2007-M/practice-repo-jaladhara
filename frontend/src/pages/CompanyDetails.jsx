import { Link, useParams } from "react-router-dom";
import { companies } from "../data/companies";
import DonorScore from "../components/DonorScore";
import StatusBadge from "../components/StatusBadge";

export default function CompanyDetails() {
  const { id } = useParams();
  const company = companies.find((item) => item.id === Number(id));

  if (!company) return <div className="empty-state"><h3>Company not found</h3><Link to="/find-donors">Back to donors</Link></div>;

  return (
    <div>
      <Link className="back-link" to="/find-donors">← Back to donor discovery</Link>
      <div className="company-detail-hero">
        <div className="detail-company-info">
          <div className="company-logo large">{company.shortName.slice(0, 2)}</div>
          <div><span className="eyebrow">{company.industry.toUpperCase()}</span><h2>{company.name}</h2><p>{company.location} · {company.employees} employees · {company.website}</p></div>
        </div>
        <div className="detail-actions"><button type="button" className="secondary-btn">♡ Save lead</button><button type="button" className="primary-btn">Start outreach →</button></div>
      </div>

      <div className="detail-grid">
        <main>
          <section className="panel">
            <div className="panel-header"><div><h3>Why this company is a good match</h3><p>AI-style matching explanation based on your current criteria</p></div></div>
            <div className="match-explanation"><div className="big-check">✓</div><div><strong>{company.matchReason}</strong><p>Our matching model considers CSR focus areas, geography, spending capacity and relevance to your NGO's program needs.</p></div></div>
          </section>

          <section className="panel">
            <div className="panel-header"><div><h3>CSR focus areas</h3><p>Known areas of corporate social investment</p></div></div>
            <div className="focus-detail-grid">
              {company.focusAreas.map((area) => <div className="focus-detail" key={area}><span>✓</span><strong>{area}</strong><p>Relevant to potential partnership programs</p></div>)}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header"><div><h3>About the company</h3></div></div>
            <p className="detail-description">{company.description}</p>
          </section>
        </main>

        <aside>
          <section className="panel score-panel"><h3>Donor potential</h3><DonorScore score={company.donorScore} size="large" /><div className="score-factors"><div><span>CSR spending</span><strong>₹{company.csrSpending} Cr</strong></div><div><span>Location fit</span><strong>High</strong></div><div><span>Focus alignment</span><strong>High</strong></div><div><span>Overall potential</span><strong><StatusBadge status={company.status} /></strong></div></div></section>
          <section className="panel contact-panel"><h3>Potential contact</h3><div className="contact-person"><div className="avatar">CS</div><div><strong>{company.contact}</strong><span>Corporate Social Responsibility</span></div></div><button type="button" className="secondary-btn full">Add contact note</button></section>
        </aside>
      </div>
    </div>
  );
}