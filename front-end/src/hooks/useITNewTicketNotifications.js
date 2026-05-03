import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { getTicketsRequest } from "../api/tickets";

const POLL_MS = 30_000;

const initKeyFor = (userId) => `it_ticket_notify_init_${userId}`;
const seenKeyFor = (userId) => `it_ticket_notify_seen_${userId}`;

export async function requestDesktopNotificationPermission() {
  if (typeof Notification === "undefined") {
    return "unsupported";
  }
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  return Notification.requestPermission();
}

/**
 * Polls ticket list for IT/admin and notifies on genuinely new ticket IDs after per-session bootstrap.
 */
export function useITNewTicketNotifications(enabled, userId) {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!enabled || !userId) return;

    const poll = async () => {
      try {
        const tickets = await getTicketsRequest();
        if (!Array.isArray(tickets)) return;

        const initKey = initKeyFor(userId);
        const seenKey = seenKeyFor(userId);
        const ids = tickets.map((t) => t.id);

        if (!sessionStorage.getItem(initKey)) {
          sessionStorage.setItem(seenKey, JSON.stringify(ids));
          sessionStorage.setItem(initKey, "1");
          return;
        }

        let seenArr = [];
        try {
          seenArr = JSON.parse(sessionStorage.getItem(seenKey) || "[]");
        } catch {
          seenArr = [];
        }
        const seen = new Set(seenArr);

        for (const ticket of tickets) {
          if (seen.has(ticket.id)) continue;
          seen.add(ticket.id);

          const summary = ticket.title || "New ticket";
          const body =
            typeof ticket.description === "string"
              ? ticket.description.slice(0, 160)
              : "";

          toast.success(`New ticket: ${summary}`);

          if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            try {
              new Notification(`New ticket: ${summary}`, {
                body: body ? body : "Open IT dashboard to respond.",
                tag: `ticket-${ticket.id}`,
              });
            } catch {
              /* ignore Notification constructor errors */
            }
          }
        }

        sessionStorage.setItem(seenKey, JSON.stringify([...seen]));
      } catch {
        /* polling errors are non-fatal */
      }
    };

    poll();
    intervalRef.current = setInterval(poll, POLL_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") poll();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [enabled, userId]);
}
