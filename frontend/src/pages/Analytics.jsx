import { companies } from "../data/companies";

export default function Analytics() {
  return (
    <div>
      <div className="page-intro-row"><div><span className="eyebrow">PERFORMANCE INSIGHTS</span><h2>Fundraising analytics</h2><p>See where your donor pipeline is strongest and where to focus next.</p></div><select className="sort-select wide"><option>Last 6 months</option><option>Last 12 months</option></select></div>

      <div className="kpi-grid">
        <div className="kpi-card"><span className="kpi-icon green">₹</span><div><span>Estimated CSR potential</span><strong>₹2.8K Cr</strong><small>Across tracked companies</small></div></div>
        <div className="kpi-card"><span className="kpi-icon blue">◎</span><div><span>Average donor score</span><strong>86</strong><small>+6 points vs last month</small></div></div>
        <div className="kpi-card"><span className="kpi-icon orange">↗</span><div><span>Conversion rate</span><strong>21%</strong><small>From lead to active partner</small></div></div>
        <div className="kpi-card"><span className="kpi-icon purple">◷</span><div><span>Avg. response time</span><strong>4.2d</strong><small>Down 0.8 days</small></div></div>
      </div>

      <div className="analytics-grid">
        <section className="panel chart-panel">
          <div className="panel-header"><div><h3>Lead pipeline trend</h3><p>Monthly leads discovered vs qualified</p></div></div>
          <div className="bar-chart">
            {[42, 58, 48, 72, 66, 84].map((value, i) => <div className="bar-column" key={i}><div className="bar" style={{height:`${value}%`}}></div><span>{["Mar","Apr","May","Jun","Jul","Aug"][i]}</span></div>)}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header"><div><h3>Donor focus areas</h3><p>Share of matched companies</p></div></div>
          <div className="donut-wrap"><div className="donut"><div><strong>72%</strong><span>Water</span></div></div></div>
          <div className="legend-list"><div><i></i><span>Water</span><b>72%</b></div><div><i></i><span>Sanitation</span><b>61%</b></div><div><i></i><span>Education</span><b>55%</b></div><div><i></i><span>Healthcare</span><b>48%</b></div></div>
        </section>
      </div>

      <section className="panel">
        <div className="panel-header"><div><h3>Company opportunity overview</h3><p>Highest-potential prospects in your current dataset</p></div></div>
        <div className="table-wrap"><table><thead><tr><th>Company</th><th>CSR spending</th><th>Focus areas</th><th>Donor score</th></tr></thead><tbody>{companies.slice().sort((a,b)=>b.donorScore-a.donorScore).map(c=><tr key={c.id}><td><div className="table-company"><div className="mini-logo">{c.shortName.slice(0,2)}</div><strong>{c.name}</strong></div></td><td>₹{c.csrSpending} Cr</td><td>{c.focusAreas.join(", ")}</td><td><strong className="score-text">{c.donorScore}/100</strong></td></tr>)}</tbody></table></div>
      </section>
    </div>
  );
}