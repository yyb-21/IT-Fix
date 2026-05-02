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
      const resolvedRole = await resolveRole(userId, email);
      setUser({ id: userId, email });
      setRole(resolvedRole);
      localStorage.setItem("role", resolvedRole);
    } catch {
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
    if (!accessToken) throw new Error("Missing access token");

    localStorage.setItem("access_token", accessToken);
    setToken(accessToken);
    const resolvedRole = await resolveRole(sessionUser?.id, sessionUser?.email || email);
    setRole(resolvedRole);
    setUser(sessionUser || { email, id: sessionUser?.id });
    localStorage.setItem("role", resolvedRole);
    return roleRedirect(resolvedRole);
  };

  const register = async ({ email, password, role: selectedRole }) => {
    await registerRequest({ email, password });
    localStorage.setItem("selected_role", selectedRole);
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
