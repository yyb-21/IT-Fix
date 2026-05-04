import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Archive,
  CheckCircle2,
  CircleDot,
  Layers,
  Loader2,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTickets } from "../hooks/useTickets";
import { useUsers } from "../hooks/useUsers";
import Spinner from "../components/Spinner";
import StatusBadge from "../components/StatusBadge";
import { STATUS_OPTIONS } from "../utils/status";
import { canEditTickets } from "../utils/roleRedirect";

const ITDashboardPage = () => {
  const { role, user } = useAuth();
  const { tickets, loading, updateTicket, acceptTicket, refetchTickets, deleteTicket } = useTickets(true);
  const { users } = useUsers(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingId, setDeletingId] = useState(null);

  const userMap = useMemo(() => Object.fromEntries(users.map((u) => [u.id, u])), [users]);
  const itMembers = useMemo(() => users.filter((u) => u.role === "it_support"), [users]);

  // Removed assignedTickets; now filtering all tickets
  const filtered = useMemo(
    () => tickets.filter((ticket) => (statusFilter === "all" ? true : ticket.status === statusFilter)),
    [tickets, statusFilter]
  );

  const stats = useMemo(
    () => ({
      total: filtered.length,
      open: filtered.filter((t) => t.status === "open").length,
      in_progress: filtered.filter((t) => t.status === "in_progress").length,
      resolved: filtered.filter((t) => t.status === "resolved").length,
      closed: filtered.filter((t) => t.status === "closed").length,
    }),
    [filtered]
  );

  const handleUpdate = async (ticketId, payload) => {
    try {
      await updateTicket(ticketId, payload);
      toast.success("Ticket updated");
    } catch (error) {
      const apiError = error?.response?.data;
      const message =
        apiError?.message ||
        apiError?.error_description ||
        apiError?.msg ||
        apiError?.error ||
        error?.message ||
        "Update failed";
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

  const handleAccept = async (ticketId) => {
    try {
      await acceptTicket(ticketId);
      toast.success("Ticket accepted");
    } catch (error) {
      const apiError = error?.response?.data;
      const message =
        apiError?.message ||
        apiError?.error_description ||
        apiError?.msg ||
        apiError?.error ||
        error?.message ||
        "Could not accept ticket";
      toast.error(message);
    }
  };

  if (loading) return <Spinner />;

  const filterItems = ["all", ...STATUS_OPTIONS];

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Layers size={18} strokeWidth={1.75} className="text-[var(--accent-bright)]" />
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">Queue</p>
      </div>
      <h2 className="mb-8 text-2xl font-semibold tracking-tight">IT dashboard</h2>

      <div className="fade-up-stagger mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <article className="glass-card kpi-card kpi-card--accent-left" style={{ animationDelay: "0ms" }}>
          <Layers className="kpi-card__icon" size={18} strokeWidth={1.5} />
          <p className="kpi-card__value">{stats.total}</p>
          <p className="kpi-card__label">Total</p>
        </article>
        <article className="glass-card kpi-card kpi-card--warning-left" style={{ animationDelay: "80ms" }}>
          <CircleDot className="kpi-card__icon" size={18} strokeWidth={1.5} />
          <p className="kpi-card__value">{stats.open}</p>
          <p className="kpi-card__label">Open</p>
        </article>
        <article className="glass-card kpi-card kpi-card--accent-left" style={{ animationDelay: "160ms" }}>
          <Loader2 className="kpi-card__icon" size={18} strokeWidth={1.5} />
          <p className="kpi-card__value">{stats.in_progress}</p>
          <p className="kpi-card__label">In progress</p>
        </article>
        <article className="glass-card kpi-card kpi-card--success-left" style={{ animationDelay: "240ms" }}>
          <CheckCircle2 className="kpi-card__icon" size={18} strokeWidth={1.5} />
          <p className="kpi-card__value">{stats.resolved}</p>
          <p className="kpi-card__label">Resolved</p>
        </article>
        <article className="glass-card kpi-card kpi-card--muted-left" style={{ animationDelay: "320ms" }}>
          <Archive className="kpi-card__icon" size={18} strokeWidth={1.5} />
          <p className="kpi-card__value">{stats.closed}</p>
          <p className="kpi-card__label">Closed</p>
        </article>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filterItems.map((key) => (
          <button
            key={key}
            type="button"
            className={`filter-pill ${statusFilter === key ? "filter-pill--active" : ""}`}
            onClick={() => setStatusFilter(key)}
          >
            {key === "all" ? "All" : key.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="glass-card overflow-hidden p-0">
        <div className="data-grid-scroll">
          <div className="data-grid-scroll-inner">
            <div className="data-grid-header data-grid--tickets-expanded" style={{ gridTemplateColumns: '80px 2fr 1fr 1fr 1fr 100px 150px' }}>
              <span>ID</span>
              <span>Title</span>
              <span>Category</span>
              <span>Priority</span>
              <span>Reporter</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            <div className="divide-y divide-[var(--border-glass)]">
              {filtered.map((ticket, index) => (
                <div
                  key={ticket.id}
                  className="group data-grid-row ticket-feed-item"
                  style={{ animationDelay: `${index * 45}ms`, gridTemplateColumns: '80px 2fr 1fr 1fr 1fr 100px 150px', display: 'grid', alignItems: 'center', gap: '1rem', padding: '1rem' }}
                >
                  <span className="font-mono text-[12px] text-[var(--text-muted)]">#{ticket.id}</span>
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-medium text-[var(--text-primary)]">{ticket.title}</p>
                    <p className="line-clamp-1 text-[12px] text-[var(--text-secondary)]">{ticket.description}</p>
                  </div>
                  <span className="truncate text-[13px] text-[var(--text-secondary)]">
                    {ticket.category || "Other"}
                  </span>
                  <span className={`w-fit rounded px-2 py-0.5 text-[11px] font-medium border border-[var(--border-glass)] ${
                    ticket.priority === 'Critical' ? 'bg-red-500/10 text-red-400' :
                    ticket.priority === 'High' ? 'bg-orange-500/10 text-orange-400' :
                    ticket.priority === 'Low' ? 'bg-green-500/10 text-green-400' :
                    'bg-[var(--bg-glass)] text-[var(--text-secondary)]'
                  }`}>
                    {ticket.priority || "Medium"}
                  </span>
                  <span className="truncate text-[13px] text-[var(--text-secondary)]">
                    {userMap[ticket.user_id]?.email || ticket.user_id}
                  </span>
                  <StatusBadge status={ticket.status} />
                  <div className="flex items-center gap-2">
                    <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex items-center">
                      <button
                        type="button"
                        onClick={() => handleDelete(ticket.id)}
                        disabled={deletingId === ticket.id}
                        className="btn-ghost-icon text-[var(--text-muted)] hover:text-red-500"
                        aria-label="Delete ticket"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                    </span>
                    {canEditTickets(role) ? (
                      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row">
                        <select
                          defaultValue={ticket.status}
                          onChange={(e) =>
                            handleUpdate(ticket.id, { status: e.target.value })
                          }
                          className="!py-2 !text-[12px]"
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        {ticket.assigned_to ? (
                          <p className="self-center text-[12px] text-[var(--text-muted)]">
                            {ticket.assigned_to === user?.id ? "Accepted by you" : "Accepted"}
                          </p>
                        ) : role === "it_support" ? (
                          <button
                            type="button"
                            className="btn-secondary !py-2 !text-[12px]"
                            onClick={() => handleAccept(ticket.id)}
                          >
                            Accept
                          </button>
                        ) : (
                          <p className="self-center text-[12px] text-[var(--text-muted)]">Unassigned</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-[12px] text-[var(--text-muted)]">Read-only</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ITDashboardPage;