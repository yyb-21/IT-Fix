import { useEffect, useRef, useState } from "react";
import { Bell, Check, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTickets } from "../hooks/useTickets";
import { useUsers } from "../hooks/useUsers";
import toast from "react-hot-toast";

const NotificationDropdown = () => {
  const { role } = useAuth();
  const { tickets, refuseTicket, acceptTicket, refetchTickets } = useTickets(false);
  const { users } = useUsers(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const userMap = users.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {});

  // Filter pending tickets: open and unassigned
  const pendingTickets = tickets.filter(
    (ticket) => ticket.status === "open" && !ticket.assigned_to
  );

  const handleAccept = async (ticketId) => {
    try {
      await acceptTicket(ticketId);
      toast.success("Ticket accepted");
      if (pendingTickets.length <= 1) setIsOpen(false);
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

  const handleRefuse = async (ticketId) => {
    try {
      await refuseTicket(ticketId);
      toast.success("Ticket refused");
      if (pendingTickets.length <= 1) setIsOpen(false);
    } catch (error) {
      const apiError = error?.response?.data;
      const message =
        apiError?.message ||
        apiError?.error_description ||
        apiError?.msg ||
        apiError?.error ||
        error?.message ||
        "Could not refuse ticket";
      toast.error(message);
    }
  };

  useEffect(() => {
    if (role === "it_support" ) {
      refetchTickets();
    }
  }, [role, refetchTickets]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Only show for IT support
  if (role !== "it_support") {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="btn-ghost-icon relative"
        aria-label="Notifications"
      >
        <Bell size={20} strokeWidth={1.75} />
        {pendingTickets.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {pendingTickets.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-[var(--border-glass)] bg-[rgba(var(--color-base),0.95)] p-0 shadow-lg backdrop-blur-md">
          <div className="border-b border-[var(--border-glass)] p-4">
            <h3 className="font-medium text-[var(--text-primary)]">Pending Tickets</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              {pendingTickets.length} ticket{pendingTickets.length !== 1 ? "s" : ""} waiting for action
            </p>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {pendingTickets.length === 0 ? (
              <div className="p-4 text-center text-[var(--text-muted)]">
                No pending tickets
              </div>
            ) : (
              pendingTickets.map((ticket) => (
                <div key={ticket.id} className="border-b border-[var(--border-glass)] p-4 last:border-b-0 bg-[rgba(var(--color-base),0.5)] hover:bg-[rgba(var(--color-base),0.7)] transition-colors">
                  <div className="mb-2 flex items-start justify-between">
                    <h4 className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {ticket.title}
                    </h4>
                    <span className="ml-2 font-mono text-xs text-[var(--text-muted)]">
                      #{ticket.id}
                    </span>
                  </div>
                  <p className="mb-3 line-clamp-2 text-xs text-[var(--text-secondary)]">
                    {ticket.description}
                  </p>
                  <div className="mb-2 text-xs text-[var(--text-muted)]">
                    From: {userMap[ticket.user_id]?.email || ticket.user_id}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleAccept(ticket.id)}
                      className="btn-secondary !py-1 !px-3 !text-xs flex items-center gap-1"
                    >
                      <Check size={12} />
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRefuse(ticket.id)}
                      className="btn-danger !py-1 !px-3 !text-xs flex items-center gap-1"
                    >
                      <X size={12} />
                      Refuse
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;