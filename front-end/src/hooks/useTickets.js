import { useCallback, useEffect, useState } from "react";
import {
  createTicketRequest,
  getTicketsRequest,
  updateTicketRequest,
} from "../api/tickets";

export const useTickets = (autoload = true) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(autoload);
  const [error, setError] = useState("");

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getTicketsRequest();
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  }, []);

  const createTicket = async (payload) => {
    await createTicketRequest(payload);
    await fetchTickets();
  };

  const updateTicket = async (id, payload) => {
    await updateTicketRequest(id, payload);
    await fetchTickets();
  };

  useEffect(() => {
    if (autoload) fetchTickets();
  }, [autoload, fetchTickets]);

  return { tickets, loading, error, createTicket, updateTicket, refetchTickets: fetchTickets };
};
