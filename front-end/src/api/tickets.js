import api from "./client";

export const getTicketsRequest = async () => {
  const { data } = await api.get("/tickets");
  return data;
};

export const createTicketRequest = async (payload) => {
  const { data } = await api.post("/tickets", payload);
  return data;
};

export const updateTicketRequest = async (id, payload) => {
  const { data } = await api.put(`/tickets/${id}`, payload);
  return data;
};
