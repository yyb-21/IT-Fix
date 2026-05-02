import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const UnauthorizedPage = () => (
  <div className="auth-card glass-card text-center">
    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-[14px] border border-[var(--border-glass)] bg-[var(--bg-glass)]">
      <ShieldAlert size={26} strokeWidth={1.5} className="text-[var(--warning)]" />
    </div>
    <p className="mb-2 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">403</p>
    <h1 className="mb-3 text-2xl font-semibold tracking-tight">Unauthorized</h1>
    <p className="mb-8 text-[14px] leading-relaxed text-[var(--text-secondary)]">You do not have permission to access this page.</p>
    <Link to="/profile" className="btn-primary inline-flex w-full justify-center">
      Go to Profile
    </Link>
  </div>
);

export default UnauthorizedPage;
