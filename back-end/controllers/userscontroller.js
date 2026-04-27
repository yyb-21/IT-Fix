import { supabase } from "../config/supabase.js";

export const getUsers = async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");

  if (error) return res.status(400).json(error);

  res.json(data);
};