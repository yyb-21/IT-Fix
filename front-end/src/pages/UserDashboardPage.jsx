import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { AlertCircle, CheckCircle2, Ticket, UserCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTickets } from "../hooks/useTickets";
import StatusBadge from "../components/StatusBadge";
import TicketModal from "../components/TicketModal";
import Spinner from "../components/Spinner";
import { formatDate } from "../utils/formatDate";

const UserDashboardPage = () => {
  const { user } = useAuth();
  const { tickets, loading, createTicket } = useTickets(true);
  const [openModal, setOpenModal] = useState(false);

  const myTickets = useMemo(
    () => tickets.filter((ticket) => ticket.user_id === user?.id),
    [tickets, user?.id]
  );

  const stats = useMemo(
    () => ({
      total: myTickets.length,
      open: myTickets.filter((t) => t.status === "open").length,
      resolved: myTickets.filter((t) => t.status === "resolved").length,
    }),
    [myTickets]
  );

  const handleCreate = async (payload) => {
    await createTicket(payload);
    toast.success("Ticket created");
  };

  const displayName = user?.email?.split("@")[0] || "there";

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">Overview</p>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">Welcome back, {displayName}</h2>
          <p className="mt-1 text-[13px] text-[var(--text-secondary)]">Track your requests and open a new ticket when something breaks.</p>
        </div>
        <button type="button" onClick={() => setOpenModal(true)} className="btn-primary shrink-0 gap-2">
          <Ticket size={18} strokeWidth={1.75} />
          New Ticket
        </button>
      </div>

      <div className="fade-up-stagger mb-8 grid gap-3 sm:grid-cols-3">
        <article className="glass-card kpi-card kpi-card--accent-left" style={{ animationDelay: "0ms" }}>
          <Ticket className="kpi-card__icon" size={18} strokeWidth={1.5} />
          <p className="kpi-card__value">{stats.total}</p>
          <p className="kpi-card__label">Total tickets</p>
        </article>
        <article className="glass-card kpi-card kpi-card--warning-left" style={{ animationDelay: "80ms" }}>
          <AlertCircle className="kpi-card__icon" size={18} strokeWidth={1.5} />
          <p className="kpi-card__value">{stats.open}</p>
          <p className="kpi-card__label">Open</p>
        </article>
        <article className="glass-card kpi-card kpi-card--success-left" style={{ animationDelay: "160ms" }}>
          <CheckCircle2 className="kpi-card__icon" size={18} strokeWidth={1.5} />
          <p className="kpi-card__value">{stats.resolved}</p>
          <p className="kpi-card__label">Resolved</p>
        </article>
      </div>

      <div className="space-y-4">
        {myTickets.map((ticket, index) => (
          <article
            key={ticket.id}
            className="glass-card glass-card--lift ticket-feed-item p-5"
            style={{ animationDelay: `${200 + index * 70}ms` }}
          >
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
              <h3 className="text-[15px] font-medium tracking-tight text-[var(--text-primary)]">{ticket.title}</h3>
              <StatusBadge status={ticket.status} />
            </div>
            <p className="line-clamp-2 text-[13px] leading-relaxed text-[var(--text-secondary)]">{ticket.description}</p>
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--border-glass)] pt-4">
              <span className="font-mono text-[12px] text-[var(--text-muted)]">{formatDate(ticket.created_at)}</span>
              <div className="flex items-center gap-2">
                <UserCircle2 size={16} strokeWidth={1.5} className="text-[var(--text-muted)]" />
                <span className="font-mono text-[11px] text-[var(--text-muted)]">
                  {ticket.assigned_to ? `#${ticket.assigned_to}` : "Unassigned"}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <TicketModal open={openModal} onClose={() => setOpenModal(false)} onSubmit={handleCreate} />
    </div>
  );
};

export default UserDashboardPage;
