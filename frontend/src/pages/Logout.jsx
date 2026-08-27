import { useNavigate } from "react-router-dom";
import { useAnalysis } from "../context/AnalysisContext";
import { logout } from "../services/authService";

export default function Logout() {
  const navigate = useNavigate();
  const { notify } = useAnalysis();

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
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}
