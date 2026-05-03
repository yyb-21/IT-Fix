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

  // Validate assigned_to if provided
  if (assigned_to !== null && assigned_to !== undefined && assigned_to !== "") {
    // Verify the assigned_to user exists and has it_support or admin role
    try {
      const { data: assignedUser, error: userError } = await supabase.auth.admin.getUserById(assigned_to);
      
      if (userError || !assignedUser) {
        return res.status(400).json({ error: "Assigned user not found" });
      }

      const assignedUserRole = assignedUser.user_metadata?.role || 'user';
      if (assignedUserRole !== 'it_support' && assignedUserRole !== 'admin') {
        return res.status(400).json({ 
          error: "Can only assign tickets to IT support or admin users" 
        });
      }
    } catch (error) {
      console.error('Error validating assigned_to user:', error);
      return res.status(500).json({ error: "Failed to validate assigned user" });
    }
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
    .update({ status, assigned_to: assigned_to || null })
    .eq("id", id);

  if (error) return res.status(400).json(error);

  res.json(data);
};