import { useLocation } from "react-router-dom";

const titles = {
  "/dashboard": ["Dashboard", "Your CSR donor discovery overview"],
  "/find-donors": ["Find Donors", "Discover companies aligned with your mission"],
  "/leads": ["Leads", "Manage your donor pipeline"],
  "/outreach": ["Outreach", "Track conversations and follow-ups"],
  "/analytics": ["Analytics", "Understand your fundraising pipeline"]
};

export default function Navbar() {
  const { pathname } = useLocation();
  const [title, subtitle] = titles[pathname] || ["CSR Donor Connect", ""];

  return (
    <header className="navbar">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="navbar-right">
        <button type="button" className="notification-btn" aria-label="Notifications">♧</button>
        <div className="user-profile">
          <div className="avatar">NG</div>
          <div>
            <strong>NGO Team</strong>
            <span>Fundraising</span>
          </div>
        </div>
      </div>
    </header>
  );
}