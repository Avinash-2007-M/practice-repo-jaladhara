import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Analysis from "./pages/Analysis";
import Companies from "./pages/Companies";
import CompanyDetails from "./pages/CompanyDetails";
import Leads from "./pages/Leads";
import Recommendations from "./pages/Recommendations";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";
export default function App() { const [menu, setMenu] = useState(false); return <Routes><Route path="/login" element={<Login/>}/><Route path="/signup" element={<Signup/>}/><Route path="/logout" element={<Logout/>}/><Route path="*" element={<div className="app-shell"><Sidebar open={menu} onClose={() => setMenu(false)}/><main><Navbar onMenu={() => setMenu(true)}/><div className="page"><Routes><Route path="/" element={<Dashboard/>}/><Route path="/upload" element={<Upload/>}/><Route path="/analysis" element={<Analysis/>}/><Route path="/companies" element={<Companies/>}/><Route path="/companies/:id" element={<CompanyDetails/>}/><Route path="/leads" element={<Leads/>}/><Route path="/recommendations" element={<Recommendations/>}/></Routes></div></main></div>}/></Routes>; }
