import { companies } from "../data/companies";
import LeadPipeline from "../components/LeadPipeline";

export default function Leads() {
  return (
    <div>
      <div className="page-intro-row"><div><span className="eyebrow">PIPELINE MANAGEMENT</span><h2>Your donor leads</h2><p>Track every potential corporate partnership from discovery to conversion.</p></div><button className="primary-btn">+ Add lead</button></div>
      <div className="lead-summary"><div><span>Total leads</span><strong>24</strong></div><div><span>New this month</span><strong>8</strong></div><div><span>In discussion</span><strong>7</strong></div><div><span>Converted</span><strong>5</strong></div><div><span>Pipeline value</span><strong>₹680 Cr</strong></div></div>
      <LeadPipeline companies={companies} />
    </div>
  );
}