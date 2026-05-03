import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { AlertCircle, CheckCircle2, Ticket, UserCircle2, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTickets } from "../hooks/useTickets";
import StatusBadge from "../components/StatusBadge";
import TicketModal from "../components/TicketModal";
import Spinner from "../components/Spinner";
import { formatDate } from "../utils/formatDate";

const UserDashboardPage = () => {
  const { user } = useAuth();
  const { tickets, loading, createTicket, deleteTicket } = useTickets(true);
  const [openModal, setOpenModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

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
    try {
      await createTicket(payload);
      toast.success("Ticket created");
    } catch (error) {
      const apiError = error?.response?.data;
      const message =
        apiError?.message || apiError?.error_description || apiError?.error || error?.message || "Could not create ticket";
      toast.error(message);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    setDeletingId(id);
    try {
      await deleteTicket(id);
      toast.success("Ticket deleted");
    } catch (error) {
      const apiError = error?.response?.data;
      const message =
        apiError?.message || apiError?.error_description || apiError?.error || error?.message || "Could not delete ticket";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
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
              <div className="flex items-center gap-2">
                <StatusBadge status={ticket.status} />
                <button
                  type="button"
                  onClick={() => handleDelete(ticket.id)}
                  disabled={deletingId === ticket.id}
                  className="btn-ghost-icon text-[var(--text-muted)] hover:text-red-500"
                  aria-label="Delete ticket"
                >
                  <Trash2 size={16} strokeWidth={1.5} />
                </button>
                <StatusBadge status={ticket.status} />
              </div>
            </div>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded bg-[var(--bg-glass)] px-2 py-0.5 text-xs font-medium text-[var(--text-secondary)] border border-[var(--border-glass)]">
                {ticket.category || "Other"}
              </span>
              <span className={`rounded px-2 py-0.5 text-xs font-medium border border-[var(--border-glass)] ${
                ticket.priority === 'Critical' ? 'bg-red-500/10 text-red-400' :
                ticket.priority === 'High' ? 'bg-orange-500/10 text-orange-400' :
                ticket.priority === 'Low' ? 'bg-green-500/10 text-green-400' :
                'bg-[var(--bg-glass)] text-[var(--text-secondary)]'
              }`}>
                {ticket.priority || "Medium"}
              </span>
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
