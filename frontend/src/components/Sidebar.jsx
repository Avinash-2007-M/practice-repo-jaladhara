import { NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "⌂" },
  { to: "/find-donors", label: "Find Donors", icon: "⌕" },
  { to: "/leads", label: "Leads", icon: "▣" },
  { to: "/outreach", label: "Outreach", icon: "↗" },
  { to: "/analytics", label: "Analytics", icon: "▥" }
];

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">C</div>
        <div>
          <strong>CSR Donor</strong>
          <span>CONNECT</span>
        </div>
      </div>

      <div className="workspace-label">WORKSPACE</div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="help-card">
          <div className="help-icon">?</div>
          <div>
            <strong>Need help?</strong>
            <p>View platform guidance</p>
          </div>
        </div>
        <button className="logout-btn" onClick={() => navigate("/")}>
          <span>↪</span> Sign out
        </button>
      </div>
    </aside>
  );
}