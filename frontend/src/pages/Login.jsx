import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { useAnalysis } from "../context/AnalysisContext";
import { apiErrorMessage } from "../services/api";
import { login } from "../services/authService";

export default function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { notify } = useAnalysis();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Enter your email address and password.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    setError("");

    try {
      await login({ email, password });
      notify("Login successful.", "success");
      navigate("/companies");
    } catch (error) {
      setError(apiErrorMessage(error));
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to access your CSR donor intelligence workspace."
      footer={
        <>
          New to CSR Lens? <Link to="/signup">Create an account</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={submit}>
        <label>
          Email address
          <div className="input-wrap">
            <Mail size={17} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@organization.org"
              autoComplete="email"
            />
          </div>
        </label>

        <label>
          Password
          <div className="input-wrap">
            <LockKeyhole size={17} />
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />

            <button
              type="button"
              onClick={() => setShow(!show)}
              aria-label="Toggle password visibility"
            >
              {show ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </label>

        <div className="auth-options">
          <label className="check">
            <input type="checkbox" />
            Remember me
          </label>

          <button type="button">Forgot password?</button>
        </div>

        {error && <p className="form-error">{error}</p>}

        <button className="button auth-submit" type="submit">
          Sign in
        </button>
      </form>
    </AuthLayout>
  );
}
