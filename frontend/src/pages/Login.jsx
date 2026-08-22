import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="login-page">
      <div className="login-visual">
        <div className="login-brand">
          <div className="brand-mark">C</div>
          <div><strong>CSR Donor</strong><span>CONNECT</span></div>
        </div>
        <div className="login-message">
          <span className="eyebrow">NGO FUNDRAISING PLATFORM</span>
          <h1>Connect your mission with the right corporate partners.</h1>
          <p>Discover, qualify and build meaningful CSR partnerships that create measurable social impact.</p>
          <div className="impact-row">
            <div><strong>1,240+</strong><span>Companies tracked</span></div>
            <div><strong>₹2.8K Cr</strong><span>CSR potential</span></div>
            <div><strong>86%</strong><span>Match accuracy</span></div>
          </div>
        </div>
      </div>

      <div className="login-form-area">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="mobile-logo"><div className="brand-mark">C</div></div>
          <span className="eyebrow">WELCOME BACK</span>
          <h2>Sign in to your workspace</h2>
          <p className="form-intro">Use your NGO account to continue.</p>

          <label>Email address
            <input type="email" placeholder="you@ngo.org" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>Password
            <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <div className="form-options">
            <label className="check-label"><input type="checkbox" /> Remember me</label>
            <button type="button" className="text-btn">Forgot password?</button>
          </div>
          <button className="primary-btn full" type="submit">Sign in <span>→</span></button>
          <p className="demo-note">Demo mode · Any valid email and password will open the dashboard.</p>
        </form>
      </div>
    </div>
  );
}