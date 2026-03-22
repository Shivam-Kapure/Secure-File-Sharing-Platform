import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import SplitLayout from "../components/SplitLayout";
import Reveal from "../components/Reveal";

function RegisterPage() {
  const navigate = useNavigate();
  const { markAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const data = await api.register({ email, password });
      markAuthenticated(data.user?.id);
      navigate("/app/files", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const mainContent = (
    <div>
      <Reveal>
        <h1 className="huge-title">Start secure sharing in minutes.</h1>
      </Reveal>
      <Reveal delay={150}>
        <p className="subtitle">Create your vaultline account to securely manage, trace, and permission your files safely.</p>
      </Reveal>
    </div>
  );

  const sidebarContent = (
    <>
      <h2>Create account</h2>
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
            autoComplete="new-password"
            placeholder="••••••••"
          />
          <span style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.5rem' }}>Use 6+ characters.</span>
        </div>
        
        {error && <p className="form-error">{error}</p>}
        
        <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#FDFDFD', color: '#1A1A1A', marginTop: '1rem' }} disabled={submitting}>
          {submitting ? "Creating..." : "Create account"}
        </button>
      </form>
      <p style={{ marginTop: '2rem', opacity: 0.8, fontSize: '0.875rem' }}>
        Already have an account? <Link to="/login" style={{ textDecoration: 'underline' }}>Sign in</Link>
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

export default RegisterPage;
