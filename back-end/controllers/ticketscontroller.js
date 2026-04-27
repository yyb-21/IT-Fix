import { supabase } from "../config/supabase.js";

export const createTicket = async (req, res) => {
  const { title, description } = req.body;

  const { data, error } = await supabase
    .from("tickets")
    .insert([
      {
        title,
        description,
        status: "open",
        user_id: req.user.id,
      },
    ]);

  if (error) return res.status(400).json(error);

  res.json(data);
};

export const getTickets = async (req, res) => {
  const { data, error } = await supabase.from("tickets").select("*");

  if (error) return res.status(400).json(error);

  res.json(data);
};

export const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { status, assigned_to } = req.body;

  const allowedStatus = ["open", "in_progress", "resolved", "closed"];

  if (!allowedStatus.includes(status)) {
  return res.status(400).json({ error: "Invalid status" });
  }

  const { data, error } = await supabase
    .from("tickets")
    .update({ status, assigned_to })
    .eq("id", id);

  if (error) return res.status(400).json(error);

  res.json(data);
};