import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="glass-card max-w-lg p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-[var(--border-glass)] bg-[var(--bg-glass)]">
          <User size={20} strokeWidth={1.75} className="text-[var(--accent-bright)]" />
        </div>
        <div>
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">Account</p>
          <h2 className="text-xl font-semibold tracking-tight">Profile</h2>
        </div>
      </div>
      <div className="mb-6 space-y-3 rounded-[14px] border border-[var(--border-glass)] bg-[rgba(255,255,255,0.02)] p-4">
        <div>
          <p className="form-label !mb-1">Email</p>
          <p className="text-[14px] text-[var(--text-primary)]">{user?.email || "Unknown"}</p>
        </div>
        <div>
          <p className="form-label !mb-1">Role</p>
          <p className="font-mono text-[13px] uppercase tracking-wider text-[var(--text-secondary)]">{role || "Unknown"}</p>
        </div>
      </div>
      <button type="button" onClick={onLogout} className="btn-danger gap-2">
        <LogOut size={16} strokeWidth={1.75} />
        Logout
      </button>
    </div>
  );
};

export default ProfilePage;
