import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { loginRequest, registerRequest } from "../api/auth";
import { getUsersRequest } from "../api/users";
import { roleRedirect } from "../utils/roleRedirect";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("access_token") || "");
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [loading, setLoading] = useState(true);

  const resolveRole = async (userId, email) => {
    const users = await getUsersRequest();
    const matched = users.find((item) => item.id === userId || item.email === email);
    return matched?.role || localStorage.getItem("selected_role") || "user";
  };

  const bootstrap = async (savedToken) => {
    try {
      const decoded = jwtDecode(savedToken);
      const userId = decoded?.sub;
      const email = decoded?.email;
      // Get role from JWT user_metadata, fallback to localStorage or 'user'
      const userRole = decoded?.user_metadata?.role || localStorage.getItem("role") || "user";
      setUser({ id: userId, email });
      setRole(userRole);
      localStorage.setItem("role", userRole);
    } catch (error) {
      console.error('Bootstrap error:', error);
      localStorage.removeItem("access_token");
      localStorage.removeItem("role");
      setToken("");
      setUser(null);
      setRole("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    bootstrap(token);
  }, [token]);

  const login = async (email, password) => {
    const data = await loginRequest({ email, password });
    const accessToken = data?.session?.access_token;
    const sessionUser = data?.user;
    const userRole = data?.role;
    if (!accessToken) throw new Error("Missing access token");
    if (!userRole) throw new Error("No role returned from login");

    localStorage.setItem("access_token", accessToken);
    setToken(accessToken);
    setRole(userRole);
    setUser(sessionUser || { email, id: sessionUser?.id });
    localStorage.setItem("role", userRole);
    return roleRedirect(userRole);
  };

  const register = async ({ email, username, password, role }) => {
    await registerRequest({ email, username, password, role });
    localStorage.setItem("selected_role", role);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    setToken("");
    setUser(null);
    setRole("");
  };

  const value = useMemo(
    () => ({ token, user, role, loading, login, register, logout }),
    [token, user, role, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
