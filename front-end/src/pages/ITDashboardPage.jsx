import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Archive,
  CheckCircle2,
  CircleDot,
  Layers,
  Loader2,
  SlidersHorizontal,
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
  const { tickets, loading, updateTicket, acceptTicket } = useTickets(true);
  const { users } = useUsers(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const userMap = useMemo(() => Object.fromEntries(users.map((u) => [u.id, u])), [users]);
  const itMembers = useMemo(() => users.filter((u) => u.role === "it_support"), [users]);

  const filtered = useMemo(
    () => tickets.filter((ticket) => (statusFilter === "all" ? true : ticket.status === statusFilter)),
    [tickets, statusFilter]
  );

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
      toast.error(message);
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
            <div className="data-grid-header data-grid--tickets">
              <span>ID</span>
              <span>Title</span>
              <span>Reporter</span>
              <span>Status</span>
              <span>Assigned</span>
              <span>Actions</span>
            </div>
            <div className="divide-y divide-[var(--border-glass)]">
              {filtered.map((ticket, index) => (
                <div
                  key={ticket.id}
                  className="group data-grid-row data-grid--tickets ticket-feed-item"
                  style={{ animationDelay: `${index * 45}ms` }}
                >
                  <span className="font-mono text-[12px] text-[var(--text-muted)]">#{ticket.id}</span>
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-medium text-[var(--text-primary)]">{ticket.title}</p>
                    <p className="line-clamp-1 text-[12px] text-[var(--text-secondary)]">{ticket.description}</p>
                  </div>
                  <span className="truncate text-[13px] text-[var(--text-secondary)]">
                    {userMap[ticket.user_id]?.email || ticket.user_id}
                  </span>
                  <StatusBadge status={ticket.status} />
                  <span className="truncate font-mono text-[12px] text-[var(--text-muted)]">
                    {userMap[ticket.assigned_to]?.email || "—"}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <SlidersHorizontal size={16} strokeWidth={1.5} className="text-[var(--text-muted)]" aria-hidden />
                    </span>
                    {canEditTickets(role) ? (
                      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row">
                        <select
                          defaultValue={ticket.status}
                          onChange={(e) =>
                            handleUpdate(ticket.id, { status: e.target.value, assigned_to: ticket.assigned_to || null })
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
