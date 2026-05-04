import { useMemo } from "react";
import { Users } from "lucide-react";
import { useUsers } from "../hooks/useUsers";
import { useTickets } from "../hooks/useTickets";
import Spinner from "../components/Spinner";

const workload = (count) => {
  if (count >= 8) return { label: "heavy", percent: 100 };
  if (count >= 4) return { label: "moderate", percent: 60 };
  return { label: "light", percent: 30 };
};

const ITTeamPage = () => {
  const { users, loading: usersLoading } = useUsers(true, true);
  const { tickets, loading: ticketsLoading } = useTickets(true);
  const loading = usersLoading || ticketsLoading;

  const members = useMemo(() => users.filter((u) => ["it_support", "admin"].includes(u.role)), [users]);

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Users size={18} strokeWidth={1.75} className="text-[var(--accent-bright)]" />
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">Team</p>
      </div>
      <h2 className="mb-8 text-2xl font-semibold tracking-tight">IT roster</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {members.map((member, index) => {
          const assignedOpen = tickets.filter(
            (t) => t.assigned_to === member.id && ["open", "in_progress"].includes(t.status)
          ).length;
          const meta = workload(assignedOpen);
          const initials = member.email?.split("@")[0]?.slice(0, 2)?.toUpperCase() || "—";
          return (
            <article
              key={member.id}
              className="glass-card glass-card--lift p-5 ticket-feed-item"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="mb-4 flex items-start gap-3">
                <div className={`avatar-circle avatar-circle--${meta.label} h-11 w-11 text-[13px]`}>{initials}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold tracking-tight text-[var(--text-primary)]">
                    {member.email?.split("@")[0]}
                  </p>
                  <p className="truncate text-[13px] text-[var(--text-secondary)]">{member.email}</p>
                </div>
              </div>
              <div className="mb-2 flex items-baseline justify-between gap-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--text-muted)]">Open queue</span>
                <span className="font-mono text-[20px] font-semibold text-[var(--text-primary)]">{assignedOpen}</span>
              </div>
              <div className="workload-bar">
                <div className="workload-bar-fill" style={{ width: `${meta.percent}%` }} />
              </div>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{meta.label}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default ITTeamPage;
