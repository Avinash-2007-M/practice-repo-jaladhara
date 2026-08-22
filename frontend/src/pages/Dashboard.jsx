import { Link } from "react-router-dom";
import DonorScore from "../components/DonorScore";
import StatusBadge from "../components/StatusBadge";
import { companies } from "../data/companies";

export default function Dashboard() {
  const topCompanies = [...companies].sort((a, b) => b.donorScore - a.donorScore).slice(0, 3);

  return (
    <div>
      <div className="welcome-row">
        <div>
          <span className="eyebrow">TUESDAY, 18 AUGUST 2026</span>
          <h2>Good evening, NGO Team 👋</h2>
          <p>Here’s an overview of your CSR donor discovery activity.</p>
        </div>
        <Link className="primary-btn" to="/find-donors">+ Find new donors</Link>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card"><span className="kpi-icon green">◎</span><div><span>Potential donors</span><strong>1,240</strong><small>+12.5% this month</small></div></div>
        <div className="kpi-card"><span className="kpi-icon blue">✦</span><div><span>High-match companies</span><strong>86</strong><small>Score 80 or higher</small></div></div>
        <div className="kpi-card"><span className="kpi-icon orange">▣</span><div><span>Active leads</span><strong>24</strong><small>8 need follow-up</small></div></div>
        <div className="kpi-card"><span className="kpi-icon purple">↗</span><div><span>Outreach success</span><strong>68%</strong><small>+4.2% this month</small></div></div>
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header"><div><h3>Top donor matches</h3><p>Companies with the strongest fit for your WASH programs</p></div><Link to="/find-donors">View all →</Link></div>
          <div className="top-matches">
            {topCompanies.map((company) => (
              <Link to={`/company/${company.id}`} className="match-row" key={company.id}>
                <div className="company-logo small">{company.shortName.slice(0, 2)}</div>
                <div className="match-name"><strong>{company.name}</strong><span>{company.location} · {company.industry}</span></div>
                <DonorScore score={company.donorScore} size="compact" />
              </Link>
            ))}
          </div>
        </section>

        <section className="panel impact-panel">
          <div className="panel-header"><div><h3>CSR focus snapshot</h3><p>What companies are funding</p></div></div>
          <div className="focus-bars">
            <div><div><span>Water</span><b>72%</b></div><i style={{width:"72%"}} /></div>
            <div><div><span>Sanitation</span><b>61%</b></div><i style={{width:"61%"}} /></div>
            <div><div><span>Education</span><b>55%</b></div><i style={{width:"55%"}} /></div>
            <div><div><span>Healthcare</span><b>48%</b></div><i style={{width:"48%"}} /></div>
          </div>
          <Link className="insight-link" to="/analytics">Explore analytics →</Link>
        </section>
      </div>

      <section className="panel recent-panel">
        <div className="panel-header"><div><h3>Recent outreach</h3><p>Your latest donor engagement activity</p></div><Link to="/outreach">View outreach →</Link></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Company</th><th>Activity</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {companies.slice(0, 4).map((company, index) => (
                <tr key={company.id}>
                  <td><div className="table-company"><div className="mini-logo">{company.shortName.slice(0,2)}</div><strong>{company.name}</strong></div></td>
                  <td>{["WASH Partnership Proposal","Introductory CSR Discussion","Program Alignment Discussion","Water Program Proposal"][index]}</td>
                  <td>{["18 Aug 2026","16 Aug 2026","14 Aug 2026","12 Aug 2026"][index]}</td>
                  <td><StatusBadge status={index === 1 ? "Contacted" : index === 2 ? "Interested" : "New Lead"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}