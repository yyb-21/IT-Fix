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

export const acceptTicketRequest = async (id) => {
  const { data } = await api.put(`/tickets/${id}/accept`);
  return data;
};

export const refuseTicketRequest = async (id) => {
  const { data } = await api.put(`/tickets/${id}/refuse`);
  return data;
};

export const deleteTicketRequest = async (id) => {
  const { data } = await api.delete(`/tickets/${id}`);
  return data;
};
