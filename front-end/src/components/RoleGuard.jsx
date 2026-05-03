import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleGuard = ({ allowedRoles }) => {
  const { role, loading } = useAuth();
  if (loading || !role) return null; // Don't redirect while loading or if role is not set
  if (!allowedRoles.includes(role)) return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
};

export default RoleGuard;
