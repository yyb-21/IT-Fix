import { supabase } from "../config/supabase.js";

export const register = async (req, res) => {
  const { email, password, role } = req.body;

  // Validate all required fields
  if (!email || !password || !role) {
    return res.status(400).json({ message: "email, password, and role are required" });
  }

  // Create auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Auth signup error:', error);
    return res.status(400).json(error);
  }

  if (!data?.user?.id) {
    return res.status(500).json({ message: "No user ID returned from signup" });
  }

  // Store role in user metadata
  const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
    data.user.id,
    { user_metadata: { role } }
  );

  if (updateError) {
    console.error('User metadata update error:', updateError);
    return res.status(500).json({ 
      message: "Registration successful but failed to save user role",
      error: updateError.message
    });
  }

  console.log('User successfully created with role:', role);
  res.json({ ...data, role });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(400).json(error);

  // Get role from user metadata, fallback to 'user' if not set
  const role = data.user?.user_metadata?.role || 'user';

  // If role is not set in user_metadata, update it for future logins
  if (!data.user?.user_metadata?.role) {
    try {
      await supabase.auth.admin.updateUserById(data.user.id, {
        user_metadata: { ...data.user.user_metadata, role: 'user' }
      });
    } catch (updateError) {
      console.warn('Failed to update user metadata with default role:', updateError);
    }
  }

  res.json({ ...data, role });
};