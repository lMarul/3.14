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
  const { data, error } = await supabase
    .from('submission_tickets')
    .select('id, project_title, status, upload_expired_at, request_note, student_user_id')
    .order('created_at', { ascending: false })
    .limit(10);
    
  if (error) {
    console.error("Error:", error);
    return;
  }
  
  console.log("Recent tickets:");
  console.log(JSON.stringify(data, null, 2));
}

run();
