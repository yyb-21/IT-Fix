import { supabase } from "../config/supabase.js";

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No token" });

  const { data, error } = await supabase.auth.getUser(token);

  if (error) return res.status(401).json(error);

  req.user = data.user;
  next();
};

// Role-based access control middleware
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.user_metadata?.role || 'user';

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: "Insufficient permissions",
        required: allowedRoles,
        current: userRole
      });
    }

    next();
  };
};

// Specific role middleware for common use cases
export const requireITSupportOrAdmin = requireRole('it_support', 'admin');
export const requireAdmin = requireRole('admin');