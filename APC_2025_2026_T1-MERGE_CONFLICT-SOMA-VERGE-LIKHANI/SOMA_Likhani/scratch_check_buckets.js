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
  console.log("Fetching storage buckets...");
  
  // Note: we can list buckets if we are authenticated or admin, but let's see if we can select from the storage.buckets table via API
  const { data: buckets, error } = await supabase
    .from('buckets')
    .select('*');
    
  if (error) {
    console.error("Error fetching buckets directly from table:", error);
    
    // Fallback: try storage API
    try {
      const { data: bucketsApi, error: apiError } = await supabase.storage.listBuckets();
      if (apiError) {
        console.error("Error listing buckets via Storage API:", apiError);
      } else {
        console.log("Buckets listed via Storage API successfully:", bucketsApi);
      }
    } catch (e) {
      console.error("Exception listing buckets:", e);
    }
  } else {
    console.log("Buckets retrieved successfully:");
    console.log(JSON.stringify(buckets, null, 2));
  }
}

run();
