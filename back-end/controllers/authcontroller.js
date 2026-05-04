import { supabase } from "../config/supabase.js";


export const register = async (req, res) => {
  const { email, username, password, role } = req.body;

  // Validate all required fields
  if (!email || !username || !password || !role) {
    return res.status(400).json({ message: "email, username, password, and role are required" });
  }

  // Create auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role, username },
    },
  });

  if (error) {
    console.error('Auth signup error:', error);
    return res.status(400).json(error);
  }

  if (!data?.user?.id) {
    return res.status(500).json({ message: "No user ID returned from signup" });
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

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Check if user exists in Supabase
    const { data: users, error: lookupError } = await supabase.auth.admin.listUsers();
    
    if (lookupError) {
      console.error('Error looking up user:', lookupError);
      return res.status(400).json({ message: "Unable to process request" });
    }

    const userExists = users?.users?.some(u => u.email === email);

    if (!userExists) {
      // Don't reveal whether email exists (security best practice)
      return res.json({ message: "If an account exists with this email, you will receive a password reset link" });
    }

    // Generate reset token
    const resetToken = generateResetToken();
    storeResetToken(email, resetToken);

    // Send email
    await sendPasswordResetEmail(email, resetToken);

    res.json({ message: "Password reset link has been sent to your email" });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ message: "Error processing password reset request" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token and new password are required" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    // Verify token
    const tokenData = verifyResetToken(token);
    if (!tokenData) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    const email = tokenData.email;

    // Get user by email to update password
    const { data: users, error: lookupError } = await supabase.auth.admin.listUsers();
    
    if (lookupError) {
      console.error('Error looking up user:', lookupError);
      return res.status(400).json({ message: "Unable to reset password" });
    }

    const user = users?.users?.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Update password
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      password: newPassword,
    });

    if (updateError) {
      console.error('Error updating password:', updateError);
      return res.status(400).json({ message: "Failed to update password" });
    }

    // Clear the used token
    clearResetToken(token);

    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ message: "Error resetting password" });
  }
};
