import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await register(form);
      toast.success("Registration successful. You can now login.");
      navigate("/login");
    } catch (error) {
      const apiError = error?.response?.data;
      const message =
        apiError?.message ||
        apiError?.error_description ||
        apiError?.msg ||
        apiError?.error ||
        error?.message ||
        "Registration failed";
      toast.error(message);
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
      <p className="auth-tagline">Create an account. You will pick up your role after the first sync.</p>
      <h1 className="mb-6 text-xl font-semibold tracking-tight">Register</h1>
      <div className="mb-4">
        <label className="form-label" htmlFor="reg-username">
          Username
        </label>
        <input id="reg-username" type="text" required placeholder="johndoe" value={form.username} onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))} />
      </div>
      <div className="mb-4">
        <label className="form-label" htmlFor="reg-email">
          Email
        </label>
        <input id="reg-email" type="email" required placeholder="you@company.com" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
      </div>
      <div className="mb-4">
        <label className="form-label" htmlFor="reg-password">
          Password
        </label>
        <input id="reg-password" type="password" required placeholder="••••••••" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
      </div>
      <div className="mb-6">
        <label className="form-label" htmlFor="reg-role">
          Role
        </label>
        <select id="reg-role" value={form.role} onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}>
          <option value="user">user</option>
          <option value="it_support">it_support</option>
          <option value="admin">admin</option>
        </select>
      </div>
      <button disabled={submitting} type="submit" className="btn-primary w-full">
        {submitting ? "Creating..." : "Create Account"}
      </button>
      <p className="mt-6 text-center text-[13px] text-[var(--text-secondary)]">
        Have an account?{" "}
        <Link to="/login" className="font-medium text-[var(--accent-bright)]">
          Login
        </Link>
      </p>
    </form>
  );
};

export default RegisterPage;
