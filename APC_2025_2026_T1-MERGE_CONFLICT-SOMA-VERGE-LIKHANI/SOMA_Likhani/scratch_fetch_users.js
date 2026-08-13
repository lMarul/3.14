import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Parse .env
const envFile = fs.readFileSync('.env', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
    env[key] = value;
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const ids = ["3f21aa55-6bfd-43c0-9161-575d54510c62", "122a8a95-6498-4b16-9ab9-80e9ee7951c2"];
  const { data, error } = await supabase
    .from('app_users')
    .select('id, full_name, email, role, status')
    .in('id', ids);
    
  if (error) {
    console.error("Error:", error);
    return;
  }
  
  console.log("Users:");
  console.log(JSON.stringify(data, null, 2));
}

run();
