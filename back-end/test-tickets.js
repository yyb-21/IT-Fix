import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
async function run() {
  const { data } = await supabase.from('tickets').select('*');
  console.log(JSON.stringify(data, null, 2));
}
run();
