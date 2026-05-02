import { useMemo } from "react";
import { BarChart3, Shield } from "lucide-react";
import { useUsers } from "../hooks/useUsers";
import { useTickets } from "../hooks/useTickets";
import Spinner from "../components/Spinner";
import { formatDate } from "../utils/formatDate";

const roleBadgeClass = (role) => {
  if (role === "admin") return "role-badge role-badge--admin";
  if (role === "it_support") return "role-badge role-badge--it_support";
  return "role-badge role-badge--user";
};

const AdminPage = () => {
  const { users, loading: usersLoading } = useUsers(true);
  const { tickets, loading: ticketsLoading } = useTickets(true);
  const loading = usersLoading || ticketsLoading;

  const stats = useMemo(
    () => ({
      total: tickets.length,
      open: tickets.filter((t) => t.status === "open").length,
      in_progress: tickets.filter((t) => t.status === "in_progress").length,
      resolved: tickets.filter((t) => t.status === "resolved").length,
      closed: tickets.filter((t) => t.status === "closed").length,
    }),
    [tickets]
  );

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Shield size={18} strokeWidth={1.75} className="text-[var(--accent-bright)]" />
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">Admin</p>
      </div>
      <h2 className="mb-8 text-2xl font-semibold tracking-tight">Control room</h2>

      <div className="fade-up-stagger mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {Object.entries(stats).map(([key, value], i) => (
          <article
            key={key}
            className="glass-card kpi-card kpi-card--accent-left"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <BarChart3 className="kpi-card__icon" size={18} strokeWidth={1.5} />
            <p className="kpi-card__value">{value}</p>
            <p className="kpi-card__label">{key.replace("_", " ")}</p>
          </article>
        ))}
      </div>

      <div className="glass-card overflow-hidden p-0">
        <div className="data-grid-scroll">
          <div className="data-grid-scroll-inner">
            <div className="data-grid-header data-grid--users">
              <span>Email</span>
              <span>Role</span>
              <span>Joined</span>
            </div>
            <div className="divide-y divide-[var(--border-glass)]">
              {users.map((user, index) => (
                <div
                  key={user.id}
                  className="data-grid-row data-grid--users ticket-feed-item"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <span className="truncate text-[14px] text-[var(--text-primary)]">{user.email}</span>
                  <span className={roleBadgeClass(user.role || "user")}>{user.role || "user"}</span>
                  <span className="font-mono text-[12px] text-[var(--text-muted)]">
                    {formatDate(user.created_at || user.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
