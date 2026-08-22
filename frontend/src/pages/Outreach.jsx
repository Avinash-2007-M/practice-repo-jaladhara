import StatusBadge from "../components/StatusBadge";
import { companies, outreachRecords } from "../data/companies";

export default function Outreach() {
  return (
    <div>
      <div className="page-intro-row"><div><span className="eyebrow">RELATIONSHIP TRACKING</span><h2>Outreach activity</h2><p>Keep track of conversations, meetings and follow-ups with CSR teams.</p></div><button className="primary-btn">+ Log activity</button></div>

      <div className="kpi-grid outreach-kpis">
        <div className="kpi-card"><span className="kpi-icon blue">↗</span><div><span>Messages sent</span><strong>42</strong><small>This month</small></div></div>
        <div className="kpi-card"><span className="kpi-icon green">✓</span><div><span>Responses</span><strong>29</strong><small>69% response rate</small></div></div>
        <div className="kpi-card"><span className="kpi-icon orange">◷</span><div><span>Follow-ups due</span><strong>8</strong><small>Next 7 days</small></div></div>
        <div className="kpi-card"><span className="kpi-icon purple">●</span><div><span>Meetings</span><strong>12</strong><small>Scheduled / completed</small></div></div>
      </div>

      <section className="panel">
        <div className="panel-header"><div><h3>Recent activity</h3><p>Your latest outreach touchpoints</p></div><select className="sort-select"><option>All activities</option><option>Emails</option><option>Calls</option><option>Meetings</option></select></div>
        <div className="activity-list">
          {outreachRecords.map((record) => {
            const company = companies.find((c) => c.id === record.companyId);
            return <div className="activity-row" key={record.companyId}><div className="mini-logo">{company.shortName.slice(0,2)}</div><div className="activity-main"><strong>{company.name}</strong><span>{record.type} · {record.subject}</span></div><span className="activity-date">{record.date}</span><StatusBadge status={record.status === "Sent" ? "Contacted" : company.status} /></div>;
          })}
        </div>
      </section>
    </div>
  );
}