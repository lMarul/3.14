import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Manually parse .env
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

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing environment variables!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Simulating approve -> upload -> reject -> re-approve lifecycle...");

  // Find student ID from existing tickets
  const { data: ticketsSample } = await supabase.from('submission_tickets').select('student_user_id').limit(1);
  if (!ticketsSample || ticketsSample.length === 0) {
    console.error("No tickets found to grab a student ID!");
    process.exit(1);
  }
  const studentId = ticketsSample[0].student_user_id;
  console.log("Using student user ID:", studentId);

  const ticketId = '9b2c9a12-8888-4444-9999-293586c40417'; // hardcoded test UUID
  
  // Clean up any existing test ticket
  await supabase.from('submission_tickets').delete().eq('id', ticketId);

  console.log("Creating new draft ticket...");
  const { error: insertErr } = await supabase.from('submission_tickets').insert({
    id: ticketId,
    student_user_id: studentId,
    status: 'draft',
    project_title: 'SIMULATION TEST TICKET',
    synopsis: 'Simulation test synopsis',
    agree_to_policy: true
  });
  if (insertErr) {
    console.error("Error creating ticket:", insertErr);
    process.exit(1);
  }

  // 2. Set status to pending (Submitted)
  console.log("Submitting ticket...");
  await supabase.from('submission_tickets').update({ status: 'pending' }).eq('id', ticketId);

  // 3. Approve ticket
  console.log("Approving ticket...");
  const { error: approveErr } = await supabase.rpc('set_ticket_status', {
    p_ticket_id: ticketId,
    p_new_status: 'accepted',
    p_notes: 'Initial approval'
  });
  if (approveErr) {
    console.error("Error approving ticket:", approveErr);
    process.exit(1);
  }

  // Check can_upload
  let { data: canUpload } = await supabase.rpc('can_upload_for_ticket', {
    p_ticket_id: ticketId,
    p_user_id: studentId
  });
  console.log("Can upload after initial approval:", canUpload); // Should be true

  // 4. Upload media
  console.log("Simulating media upload...");
  const { error: uploadErr } = await supabase.rpc('submit_ticket_media_once', {
    p_ticket_id: ticketId,
    p_video: {
      provider: 'supabase_storage',
      bucket_name: 'submission-ticket-media',
      object_path: `tickets/${studentId}/${ticketId}/video_test.mp4`,
      public_url: 'https://example.com/video.mp4',
      mime_type: 'video/mp4'
    },
    p_image: {
      provider: 'supabase_storage',
      bucket_name: 'submission-ticket-media',
      object_path: `tickets/${studentId}/${ticketId}/poster_test.jpg`,
      public_url: 'https://example.com/image.jpg',
      mime_type: 'image/jpeg'
    }
  });
  if (uploadErr) {
    console.error("Error submitting media:", uploadErr);
    process.exit(1);
  }

  // Check can_upload after upload
  ({ data: canUpload } = await supabase.rpc('can_upload_for_ticket', {
    p_ticket_id: ticketId,
    p_user_id: studentId
  }));
  console.log("Can upload after media upload:", canUpload); // Should be false

  // 5. Reject ticket (revision)
  console.log("Rejecting ticket (Revision)...");
  const { error: rejectErr } = await supabase.rpc('set_ticket_status', {
    p_ticket_id: ticketId,
    p_new_status: 'rejected',
    p_notes: 'Need revision'
  });
  if (rejectErr) {
    console.error("Error rejecting ticket:", rejectErr);
    process.exit(1);
  }

  // Check can_upload after rejection
  ({ data: canUpload } = await supabase.rpc('can_upload_for_ticket', {
    p_ticket_id: ticketId,
    p_user_id: studentId
  }));
  console.log("Can upload after rejection:", canUpload); // Should be false

  // 6. Re-approve ticket
  console.log("Re-approving ticket...");
  const { error: reapproveErr } = await supabase.rpc('set_ticket_status', {
    p_ticket_id: ticketId,
    p_new_status: 'accepted',
    p_notes: 'Re-approved'
  });
  if (reapproveErr) {
    console.error("Error re-approving ticket:", reapproveErr);
    process.exit(1);
  }

  // Check can_upload after re-approval
  ({ data: canUpload } = await supabase.rpc('can_upload_for_ticket', {
    p_ticket_id: ticketId,
    p_user_id: studentId
  }));
  console.log("Can upload after re-approval:", canUpload); // Is this true or false?

  // Clean up
  await supabase.from('submission_tickets').delete().eq('id', ticketId);
  console.log("Done!");
}

run().catch(console.error);
