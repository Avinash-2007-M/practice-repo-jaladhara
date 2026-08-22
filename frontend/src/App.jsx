import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import FindDonors from "./pages/FindDonors";
import CompanyDetails from "./pages/CompanyDetails";
import Leads from "./pages/Leads";
import Outreach from "./pages/Outreach";
import Analytics from "./pages/Analytics";

function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <Navbar />
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
      <Route path="/find-donors" element={<AppLayout><FindDonors /></AppLayout>} />
      <Route path="/company/:id" element={<AppLayout><CompanyDetails /></AppLayout>} />
      <Route path="/leads" element={<AppLayout><Leads /></AppLayout>} />
      <Route path="/outreach" element={<AppLayout><Outreach /></AppLayout>} />
      <Route path="/analytics" element={<AppLayout><Analytics /></AppLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}