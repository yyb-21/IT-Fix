import { supabase, supabaseAdmin } from "../config/supabase.js";

export const createTicket = async (req, res) => {
  const { title, description, category = "Other", priority = "Medium" } = req.body;
  const userId = req.user.id;

  console.log('createTicket called by user:', userId, 'with title:', title);

  const { data, error } = await supabaseAdmin
    .from("tickets")
    .insert([
      {
        title,
        description,
        category,
        priority,
        status: "open",
        user_id: userId,
        assigned_to: null,
      },
    ]);

  if (error) {
    console.error('Database error in createTicket:', error);
    if (error.code === "42501") {
      return res.status(403).json({
        message:
          "Ticket creation blocked by Supabase RLS. Configure an insert policy for authenticated users or use a valid service-role key in backend env.",
      });
    }
    return res.status(400).json(error);
  }

  console.log('Ticket created successfully:', data);
  res.json(data);
};

export const getTickets = async (req, res) => {
  const userRole = req.user?.user_metadata?.role || 'user';
  const userId = req.user.id;

  console.log('getTickets called by user:', userId, 'with role:', userRole);

  let query = supabaseAdmin.from("tickets").select("*");

  // Filter tickets based on role
  if (userRole === 'user') {
    // Users can only see their own tickets
    query = query.eq('user_id', userId);
    console.log('Filtering tickets for user:', userId);
  } else {
    console.log('Returning all tickets for role:', userRole);
  }
  // IT support and admins can see all tickets (no additional filter needed)

  const { data, error } = await query;

  if (error) {
    console.error('Database error in getTickets:', error);
    return res.status(400).json(error);
  }

  console.log('Returning', data?.length || 0, 'tickets');
  res.json(data);
};

export const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { status, assigned_to } = req.body;

  const allowedStatus = ["open", "in_progress", "resolved", "closed"];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ error: "Invalid status", message: "Invalid status" });
  }

  const nextAssign =
    assigned_to === null || assigned_to === undefined || assigned_to === ""
      ? null
      : assigned_to;

  const { data: currentTicket, error: fetchError } = await supabaseAdmin
    .from("tickets")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  const prevAssign = currentTicket.assigned_to ?? null;
  const assignUnchanged =
    (nextAssign == null && prevAssign == null) ||
    String(nextAssign) === String(prevAssign);

  // Only validate assignee when it actually changes (getUserById returns { user } on data)
  if (!assignUnchanged && nextAssign) {
    try {
      const { data: userWrap, error: userError } = await supabase.auth.admin.getUserById(nextAssign);
      const targetUser = userWrap?.user;
      if (userError || !targetUser) {
        return res.status(400).json({ error: "Assigned user not found" });
      }

      const assignedUserRole = targetUser.user_metadata?.role || "user";
      if (assignedUserRole !== "it_support" && assignedUserRole !== "admin") {
        return res.status(400).json({
          error: "Can only assign tickets to IT support or admin users",
        });
      }
    } catch (error) {
      console.error("Error validating assigned_to user:", error);
      return res.status(500).json({ error: "Failed to validate assigned user" });
    }
  }

  const { data, error } = await supabaseAdmin
    .from("tickets")
    .update({ status, assigned_to: nextAssign })
    .eq("id", id);

  if (error) {
    if (error.code === "42501") {
      return res.status(403).json({
        message:
          "Ticket update blocked by Supabase RLS. Use a valid service-role key in backend env or adjust policies.",
      });
    }
    return res.status(400).json(error);
  }

  res.json(data);
};

export const acceptTicket = async (req, res) => {
  const { id } = req.params;
  const accepterId = req.user.id;
  const accepterRole = req.user?.user_metadata?.role || "user";

  if (accepterRole !== "it_support" && accepterRole !== "admin") {
    return res.status(403).json({ error: "Only IT support or admin can accept tickets" });
  }

  const { data: currentTicket, error: fetchError } = await supabaseAdmin
    .from("tickets")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !currentTicket) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  if (currentTicket.assigned_to) {
    return res.status(409).json({
      error: "Ticket already accepted",
      message: "This ticket has already been accepted by another IT team member.",
    });
  }

  const { data, error } = await supabaseAdmin
    .from("tickets")
    .update({ assigned_to: accepterId })
    .eq("id", id)
    .is("assigned_to", null)
    .select("*")
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return res.status(409).json({
        error: "Ticket already accepted",
        message: "This ticket has already been accepted by another IT team member.",
      });
    }
    if (error.code === "42501") {
      return res.status(403).json({
        message:
          "Ticket assignment blocked by Supabase RLS. Use a valid service-role key in backend env or adjust policies.",
      });
    }
    return res.status(400).json(error);
  }

  res.json(data);
};

export const refuseTicket = async (req, res) => {
  const { id } = req.params;
  const refuserId = req.user.id;
  const refuserRole = req.user?.user_metadata?.role || "user";

  if (refuserRole !== "it_support" && refuserRole !== "admin") {
    return res.status(403).json({ error: "Only IT support or admin can refuse tickets" });
  }

  const { data: currentTicket, error: fetchError } = await supabaseAdmin
    .from("tickets")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !currentTicket) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  if (currentTicket.assigned_to) {
    return res.status(409).json({
      error: "Ticket already accepted",
      message: "This ticket has already been accepted and cannot be refused.",
    });
  }

  const { data, error } = await supabaseAdmin
    .from("tickets")
    .update({ status: "closed" })
    .eq("id", id)
    .is("assigned_to", null)
    .select("*")
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return res.status(409).json({
        error: "Ticket already accepted",
        message: "This ticket has already been accepted by another IT team member.",
      });
    }
    if (error.code === "42501") {
      return res.status(403).json({
        message:
          "Ticket update blocked by Supabase RLS. Use a valid service-role key in backend env or adjust policies.",
      });
    }
    return res.status(400).json(error);
  }

  res.json(data);
};
export const deleteTicket = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user?.user_metadata?.role || "user";

  const { data: currentTicket, error: fetchError } = await supabaseAdmin
    .from("tickets")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !currentTicket) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  console.log("DELETE CHECK:", {
    ticketUserId: currentTicket.user_id,
    reqUserId: userId,
    reqUserRole: userRole,
    cond1: currentTicket.user_id !== userId,
    cond2: userRole !== "admin",
    cond3: userRole !== "it_support"
  });

  if (currentTicket.user_id !== userId && userRole !== "admin" && userRole !== "it_support") {
    return res.status(403).json({ error: "Not authorized to delete this ticket" });
  }

  const { error } = await supabaseAdmin
    .from("tickets")
    .delete()
    .eq("id", id);

  if (error) {
    return res.status(400).json(error);
  }

  res.json({ message: "Ticket deleted successfully" });
};
