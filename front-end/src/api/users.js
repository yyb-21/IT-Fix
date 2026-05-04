import api from "./client";

export const getUsersRequest = async () => {
  const { data } = await api.get("/users");
  return data;
};

export const getITTeamRequest = async () => {
  const { data } = await api.get("/users/it-team");
  return data;
};
