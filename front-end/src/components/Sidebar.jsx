import { NavLink, useNavigate } from "react-router-dom";
import {
  Headset,
  LayoutDashboard,
  LogOut,
  MonitorSmartphone,
  PlusCircle,
  Shield,
  User,
  Users,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { requestDesktopNotificationPermission } from "../hooks/useITNewTicketNotifications";

const linksByRole = {
  user: [
    { to: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
    { to: "/tickets/new", label: "New Ticket", Icon: PlusCircle },
    { to: "/profile", label: "Profile", Icon: User },
  ],
  it_support: [
    { to: "/it/dashboard", label: "IT Dashboard", Icon: MonitorSmartphone },
    { to: "/it/team", label: "IT Team", Icon: Users },
    { to: "/profile", label: "Profile", Icon: User },
  ],
  admin: [
    { to: "/admin", label: "Admin Panel", Icon: Shield },
    { to: "/it/dashboard", label: "IT Dashboard", Icon: MonitorSmartphone },
    { to: "/it/team", label: "IT Team", Icon: Users },
    { to: "/profile", label: "Profile", Icon: User },
  ],
};

const Sidebar = ({ open, onNavigate }) => {
  const { role, user, logout } = useAuth();
  const navigate = useNavigate();
  const links = linksByRole[role] || [];

  const initials =
    user?.email
      ?.split("@")[0]
      ?.slice(0, 2)
      ?.toUpperCase() || "—";

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  const onEnableDesktopAlerts = async () => {
    const result = await requestDesktopNotificationPermission();
    if (result === "granted") {
      toast.success("Desktop alerts enabled for new tickets");
    } else if (result === "denied") {
      toast.error("Notifications blocked — allow them in your browser settings");
    } else if (result === "unsupported") {
      toast.error("This browser does not support desktop notifications");
    } else {
      toast("Notification permission not granted");
    }
  };

  const showAlertOptIn = role === "it_support" || role === "admin";

  return (
    <aside className={`sidebar-shell ${open ? "sidebar-shell--open" : ""}`}>
      <div className="flex items-center gap-2 border-b border-[var(--border-glass)] px-4 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[var(--border-glass)] bg-[var(--bg-glass)]">
          <Headset size={18} strokeWidth={1.75} className="text-[var(--accent-bright)]" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[15px] font-semibold tracking-tight text-[var(--text-primary)]">HelpDesk</span>
            <span className="auth-brand-dot h-2 w-2" />
          </div>
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--text-muted)]">Operations</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        {links.map((item) => {
          const Icon = item.Icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `sidebar-nav-link ${isActive ? "sidebar-nav-link--active" : ""}`
              }
            >
              <Icon size={18} strokeWidth={1.75} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-[var(--border-glass)] p-3">
        <div className="glass-card mb-3 flex items-center gap-3 px-3 py-2.5">
          <div className="avatar-circle h-10 w-10 text-[12px]">{initials}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-[var(--text-primary)]">{user?.email || "Signed in"}</p>
            <p className="truncate font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)]">{role || "—"}</p>
          </div>
        </div>
        {showAlertOptIn ? (
          <button
            type="button"
            onClick={onEnableDesktopAlerts}
            className="btn-secondary mb-2 w-full justify-center !py-2 text-[12px]"
          >
            Enable desktop alerts
          </button>
        ) : null}
        <button type="button" onClick={onLogout} className="btn-secondary w-full justify-center gap-2 text-[13px]">
          <LogOut size={16} strokeWidth={1.75} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
