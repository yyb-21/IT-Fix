import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { roleRedirect } from "../utils/roleRedirect";
import Spinner from "../components/Spinner";

const HomeRedirectPage = () => {
  const { token, role, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!token) return <Navigate to="/login" replace />;
  return <Navigate to={roleRedirect(role)} replace />;
};

export default HomeRedirectPage;
