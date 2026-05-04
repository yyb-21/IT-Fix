import { supabase } from "../config/supabase.js";

export const getUsers = async (req, res) => {
  try {
    // Get all users from auth.users via admin API
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error('Error fetching auth users:', authError);
      return res.status(400).json(authError);
    }

    // Transform auth users to include user_metadata
    const users = authUsers.users.map(user => ({
      id: user.id,
      email: user.email,
      role: user.user_metadata?.role || 'user',
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      ...user.user_metadata
    }));

    res.json(users);
  } catch (error) {
    console.error('Error in getUsers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getITTeam = async (req, res) => {
  try {
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error('Error fetching auth users:', authError);
      return res.status(400).json(authError);
    }

    const itTeam = authUsers.users
      .filter(user => ['it_support', 'admin'].includes(user.user_metadata?.role))
      .map(user => ({
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role,
        ...user.user_metadata
      }));

    res.json(itTeam);
  } catch (error) {
    console.error('Error in getITTeam:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};