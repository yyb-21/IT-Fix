import { useCallback, useEffect, useState } from "react";
import {
  acceptTicketRequest,
  createTicketRequest,
  getTicketsRequest,
  refuseTicketRequest,
  updateTicketRequest,
  deleteTicketRequest,
} from "../api/tickets";

export const useTickets = (autoload = true) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(autoload);
  const [error, setError] = useState("");

  const fetchTickets = useCallback(async (background = false) => {
    if (!background) setLoading(true);
    setError("");
    try {
      const data = await getTicketsRequest();
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch tickets");
    } finally {
      if (!background) setLoading(false);
    }
  }, []);

  const createTicket = async (payload) => {
    await createTicketRequest(payload);
    await fetchTickets(true);
    window.dispatchEvent(new Event("ticketsUpdated"));
  };

  const updateTicket = async (id, payload) => {
    await updateTicketRequest(id, payload);
    await fetchTickets(true);
    window.dispatchEvent(new Event("ticketsUpdated"));
  };

  const acceptTicket = async (id) => {
    await acceptTicketRequest(id);
    await fetchTickets(true);
    window.dispatchEvent(new Event("ticketsUpdated"));
  };

  const refuseTicket = async (id) => {
    await refuseTicketRequest(id);
    await fetchTickets(true);
    window.dispatchEvent(new Event("ticketsUpdated"));
  };

  const deleteTicket = async (id) => {
    await deleteTicketRequest(id);
    await fetchTickets(true);
    window.dispatchEvent(new Event("ticketsUpdated"));
  };

  useEffect(() => {
    if (autoload) fetchTickets();

    const handleUpdate = () => fetchTickets(true);
    window.addEventListener("ticketsUpdated", handleUpdate);
    return () => window.removeEventListener("ticketsUpdated", handleUpdate);
  }, [autoload, fetchTickets]);

  return { tickets, loading, error, createTicket, updateTicket, acceptTicket, refuseTicket, deleteTicket, refetchTickets: fetchTickets };
};
