import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
async function run() {
  const { data, error } = await supabaseAdmin
    .from("tickets")
    .insert([
      {
        title: "test ticket null",
        description: "test",
        status: "open",
        user_id: "64929fc8-361d-4177-b1bc-dead29d09f60",
        assigned_to: null
      },
    ]).select();
  console.log(JSON.stringify(data, null, 2));
}
run();
