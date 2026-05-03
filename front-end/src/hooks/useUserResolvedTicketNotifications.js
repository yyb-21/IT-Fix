import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { getTicketsRequest } from "../api/tickets";
import { useAuth } from "../context/AuthContext";

export const useUserResolvedTicketNotifications = () => {
  const { user, role } = useAuth();
  const prevTicketsRef = useRef([]);

  useEffect(() => {
    // Only normal users should poll for their own resolved tickets
    if (!user || role === "it_support" || role === "admin") return;

    let interval;

    const checkTickets = async () => {
      try {
        const currentTickets = await getTicketsRequest();
        if (!Array.isArray(currentTickets)) return;

        // Filter tickets that belong to the user
        const userTickets = currentTickets.filter((t) => t.user_id === user.id);
        const prevTickets = prevTicketsRef.current;

        if (prevTickets.length > 0) {
          userTickets.forEach((ticket) => {
            const oldTicket = prevTickets.find((t) => t.id === ticket.id);
            if (oldTicket) {
              // Check if status changed to resolved or closed
              if (
                oldTicket.status !== ticket.status &&
                (ticket.status === "resolved" || ticket.status === "closed")
              ) {
                toast.success(`Your ticket "${ticket.title}" has been ${ticket.status}!`, {
                  duration: 5000,
                  icon: "🎉",
                });
                
                // Also trigger a desktop notification if permitted
                if (window.Notification && Notification.permission === "granted") {
                  new Notification(`Ticket ${ticket.status.toUpperCase()}`, {
                    body: `Your ticket "${ticket.title}" is now ${ticket.status}.`,
                  });
                }
              }
            }
          });
        }

        prevTicketsRef.current = userTickets;
      } catch (error) {
        console.error("Error polling user tickets:", error);
      }
    };

    // Request notification permission if not asked yet
    if (window.Notification && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Initial check
    checkTickets();

    // Poll every 10 seconds
    interval = setInterval(checkTickets, 10000);

    return () => clearInterval(interval);
  }, [user, role]);
};
