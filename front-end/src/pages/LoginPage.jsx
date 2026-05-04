import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const path = await login(email, password);
      navigate(path, { replace: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="auth-card glass-card">
      <div className="auth-brand-mark">
        <span className="auth-brand-dot" />
        <span className="auth-brand-title">HelpDesk</span>
      </div>
      <p className="auth-tagline">Sign in to manage tickets with a calm, fast console.</p>
      <h1 className="mb-6 text-xl font-semibold tracking-tight">Login</h1>
      <div className="mb-4">
        <label className="form-label" htmlFor="login-email">
          Email
        </label>
        <input id="login-email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@company.com" />
      </div>
      <div className="mb-6">
        <label className="form-label" htmlFor="login-password">
          Password
        </label>
        <div className="relative">
          <input
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            required
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>
      </div>
      <button disabled={submitting} type="submit" className="btn-primary w-full">
        {submitting ? "Signing in..." : "Sign In"}
      </button>
      <p className="mt-6 text-center text-[13px] text-[var(--text-secondary)]">
        Need an account?{" "}
        <Link to="/register" className="font-medium text-[var(--accent-bright)]">
          Register
        </Link>
      </p>
    </form>
  );
};

export default LoginPage;
