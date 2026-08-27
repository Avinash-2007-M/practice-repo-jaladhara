import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { useAnalysis } from "../context/AnalysisContext";
import { apiErrorMessage } from "../services/api";
import { signup } from "../services/authService";

export default function Signup() {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    terms: false,
  });
  const [error, setError] = useState("");
  const { notify } = useAnalysis();
  const navigate = useNavigate();

  const set = (key, value) => setForm((x) => ({ ...x, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      setError("Complete each field to continue.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (form.password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }

    if (!form.terms) {
      setError("Accept the terms before continuing.");
      return;
    }

    setError("");

    try {
      await signup({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      notify("Sign-up successful.", "success");
      navigate("/companies");
    } catch (error) {
      setError(apiErrorMessage(error));
    }
  };

  return (
    <AuthLayout
      title="Create your workspace"
      subtitle="Set up access to your team’s CSR donor intelligence."
      footer={
        <>
          Already have an account? <Link to="/login">Sign in</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={submit}>
        <label>
          Full name
          <div className="input-wrap">
            <UserRound size={17} />
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />
          </div>
        </label>

        <label>
          Work email
          <div className="input-wrap">
            <Mail size={17} />
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@organization.org"
              autoComplete="email"
            />
          </div>
        </label>

        <label>
          Create password
          <div className="input-wrap">
            <LockKeyhole size={17} />
            <input
              type={show ? "text" : "password"}
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
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

        <label className="check terms">
          <input
            type="checkbox"
            checked={form.terms}
            onChange={(e) => set("terms", e.target.checked)}
          />
          I agree to the terms of use and privacy policy.
        </label>

        {error && <p className="form-error">{error}</p>}

        <button className="button auth-submit" type="submit">
          Create account
        </button>
      </form>
    </AuthLayout>
  );
}
