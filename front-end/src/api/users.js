import api from "./client";

export const getUsersRequest = async () => {
  const { data } = await api.get("/users");
  return data;
};
