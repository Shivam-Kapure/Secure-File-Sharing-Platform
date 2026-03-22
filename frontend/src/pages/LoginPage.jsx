import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import SplitLayout from "../components/SplitLayout";
import Reveal from "../components/Reveal";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { markAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from || "/app/files";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setSubmitting(true);
    try {
      const data = await api.login({ email, password });
      markAuthenticated(data.user?.id);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const mainContent = (
    <div>
      <Reveal>
        <h1 className="huge-title">Access your secure file library.</h1>
      </Reveal>
      <Reveal delay={150}>
        <p className="subtitle">Sign in to manage your vault, upload documents, and control permissions.</p>
      </Reveal>
    </div>
  );

  const sidebarContent = (
    <>
      <h2>Welcome back</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </div>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#FDFDFD', color: '#1A1A1A', marginTop: '1rem' }} disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p style={{ marginTop: '2rem', opacity: 0.8, fontSize: '0.875rem' }}>
        New here? <Link to="/register" style={{ textDecoration: 'underline' }}>Create an account</Link>
      </p>
    </>
  );

  return (
    <SplitLayout
      mainContent={mainContent}
      sidebarContent={sidebarContent}
    />
  );
}

export default LoginPage;
