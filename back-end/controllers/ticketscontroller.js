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
  const userRole = req.user?.user_metadata?.role || 'user';
  const userId = req.user.id;

  let query = supabase.from("tickets").select("*");

  // Filter tickets based on role
  if (userRole === 'user') {
    // Users can only see their own tickets
    query = query.eq('user_id', userId);
  }
  // IT support and admins can see all tickets (no additional filter needed)

  const { data, error } = await query;

  if (error) return res.status(400).json(error);

  res.json(data);
};

export const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { status, assigned_to } = req.body;
  const userRole = req.user?.user_metadata?.role || 'user';
  const userId = req.user.id;

  const allowedStatus = ["open", "in_progress", "resolved", "closed"];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  // First, get the current ticket to check permissions
  const { data: currentTicket, error: fetchError } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  // Check permissions for IT support users
  if (userRole === 'it_support') {
    // IT support can only update tickets assigned to them or unassigned tickets
    if (currentTicket.assigned_to && currentTicket.assigned_to !== userId) {
      return res.status(403).json({
        error: "You can only update tickets assigned to you or unassigned tickets"
      });
    }
  }
  // Admins can update any ticket (no additional checks needed)

  const { data, error } = await supabase
    .from("tickets")
    .update({ status, assigned_to })
    .eq("id", id);

  if (error) return res.status(400).json(error);

  res.json(data);
};