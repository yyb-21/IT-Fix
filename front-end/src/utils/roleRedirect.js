export const roleRedirect = (role) => {
  if (role === "it_support") return "/it/dashboard";
  if (role === "admin") return "/admin";
  return "/dashboard";
};

export const canEditTickets = (role) => role === "it_support";
