import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
async function run() {
  const { data, error } = await supabaseAdmin
    .from("tickets")
    .update({ assigned_to: null })
    .neq("status", "closed"); // Just update all non-closed tickets
  console.log("Updated tickets:", error ? error : "Success");
}
run();
