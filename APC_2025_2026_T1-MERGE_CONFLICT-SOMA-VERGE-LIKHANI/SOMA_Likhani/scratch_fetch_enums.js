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
  const { data, error } = await supabase.rpc('get_enum_values', { enum_name: 'storage_provider' });
  
  if (error) {
    // If custom RPC doesn't exist, query PG catalog directly
    const { data: enumData, error: pgError } = await supabase.rpc('execute_sql', {
      sql_query: "select enumlabel from pg_enum join pg_type on pg_enum.enumtypid = pg_type.oid where pg_type.typname = 'storage_provider';"
    });
    
    if (pgError) {
      // Let's try select from pg_type/pg_enum directly using a custom query if allowed
      console.log("Unable to query enums via RPC. Let's select standard pg table:");
      const { data: qData, error: qError } = await supabase
        .from('submission_tickets')
        .select('id')
        .limit(1);
      console.log("Connection check:", qError || "OK");
      return;
    }
    console.log("Enum values (PG Catalog):", enumData);
    return;
  }
  console.log("Enum values:", data);
}

run();