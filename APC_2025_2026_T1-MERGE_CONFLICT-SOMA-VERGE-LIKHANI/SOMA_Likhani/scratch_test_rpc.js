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
  const ticketId = "cdd78bca-1bf8-447a-bcc4-9770f861bd2d";
  
  // We need to sign in or emulate the user
  // Let's call RPC first using the client (note: since we don't have auth, let's see if we get authentication required)
  const { error } = await supabase.rpc("submit_ticket_media_once", {
    p_ticket_id: ticketId,
    p_video: {
      provider: "external_url",
      bucket_name: null,
      object_path: null,
      public_url: "https://drive.google.com/file/d/test-link",
      mime_type: "video/mp4",
      file_size_bytes: 0
    },
    p_image: null,
    p_stills: null
  });
  
  console.log("RPC Error Output:");
  console.log(error);
}

run();
