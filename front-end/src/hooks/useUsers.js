import { useCallback, useEffect, useState } from "react";
import { getUsersRequest, getITTeamRequest } from "../api/users";

export const useUsers = (autoload = true, isTeamOnly = false) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(autoload);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = isTeamOnly ? await getITTeamRequest() : await getUsersRequest();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoload) fetchUsers();
  }, [autoload, fetchUsers]);

  return { users, loading, error, refetchUsers: fetchUsers };
};
