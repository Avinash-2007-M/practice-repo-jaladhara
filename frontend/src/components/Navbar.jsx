import { LogIn, LogOut, Menu, UserPlus } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAnalysis } from "../context/AnalysisContext";
import { logout } from "../services/authService";

const names = { "/": "Command center", "/upload": "Dataset intelligence", "/analysis": "Analysis results", "/companies": "Company directory", "/leads": "Lead discovery", "/recommendations": "AI insights" };

export default function Navbar({ onMenu }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { notify } = useAnalysis();
  const title = pathname.startsWith("/companies/") ? "Company intelligence" : names[pathname] || "CSR Lens";

  const handleLogout = async () => {
    try {
      await logout();
      notify("Logged out successfully.", "success");
      navigate("/login");
    } catch (error) {
      notify("Could not log out. Please try again.", "error");
    }
  };

  return (
    <header className="navbar">
      <button className="menu-button" onClick={onMenu} aria-label="Open navigation">
        <Menu />
      </button>
      <div>
        <p className="eyebrow">CSR DONOR INTELLIGENCE</p>
        <h1>{title}</h1>
      </div>
      <div className="navbar-actions">
        <Link className="nav-auth-button nav-auth-button--ghost" to="/login">
          <LogIn size={16} />
          <span>Log in</span>
        </Link>
        <Link className="nav-auth-button nav-auth-button--primary" to="/signup">
          <UserPlus size={16} />
          <span>Sign up</span>
        </Link>
        <button className="nav-auth-button nav-auth-button--danger" type="button" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
