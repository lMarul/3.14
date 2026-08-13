/**
 * Standalone test script to verify Brevo HTTP API email sending.
 * 
 * Usage:
 * 1. Replace 'YOUR_BREVO_API_KEY_HERE' with your actual Brevo API key (v3). 
 *    Note: The Brevo API key usually starts with 'xkeysib-'. 
 * 2. Replace 'YOUR_TEST_EMAIL_HERE' with your actual email address where you want to receive the test.
 * 3. Run the script using Node.js:
 *    node test-email.js
 */

import { createClient } from '@supabase/supabase-js';

const BREVO_API_KEY = 'YOUR_BREVO_API_KEY_HERE';
const TEST_RECIPIENT_EMAIL = 'YOUR_TEST_EMAIL_HERE';

// Found in your .env
const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function sendTestEmail() {
  console.log("⏳ Mocking ticket approval and sending test email via Brevo...");

  // 1. Generate the secure token
  const secureToken = crypto.randomUUID();
  const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

  // 2. Grab a random pending or submitted ticket from the DB to mock the approval on
  console.log("Fetching a ticket from Supabase...");
  const { data: tickets, error: fetchError } = await supabase
    .from('submission_tickets')
    .select('id')
    .limit(1);

  if (fetchError || !tickets || tickets.length === 0) {
    console.error("❌ Could not find any tickets in the database. Please create a submission first.");
    process.exit(1);
  }

  const ticketId = tickets[0].id;
  console.log(`Found ticket ID: ${ticketId}. Injecting secure token...`);

  // 3. Update the ticket using the RPC function, just like the real edge function does
  const { error: rpcError } = await supabase.rpc('set_ticket_status', {
    p_ticket_id: ticketId,
    p_new_status: 'accepted',
    p_notes: JSON.stringify({ upload_token: secureToken, expires_at: expirationTime })
  });

  if (rpcError) {
    console.error("❌ Failed to update ticket status in Supabase:", rpcError.message);
    process.exit(1);
  }

  console.log("✅ Token successfully injected into Supabase ticket!");

  // 4. Send the email with the working token
  const uploadUrl = `http://localhost:5173/secure-upload/${secureToken}`;

  const payload = {
    sender: { name: "Likhani Admin", email: "likhani.soma@gmail.com" },
    to: [{ email: TEST_RECIPIENT_EMAIL, name: "Test User" }],
    subject: "Your Request has been Approved - Secure Upload Link",
    htmlContent: `
      <html>
        <body style="font-family: sans-serif; padding: 20px; background-color: #f9fafb;">
          <div style="max-w-[600px] margin: 0 auto; background: white; padding: 30px; border-radius: 8px; border: 1px solid #E6E1DA;">
            <h2 style="color: #101828;">Upload Request Approved</h2>
            <p style="color: #364153;">Hi Test User,</p>
            <p style="color: #364153;">Your request has been approved. Please use the secure link below to upload your media.</p>
            
            <div style="margin: 30px 0;">
              <a href="${uploadUrl}" style="background-color: #991B1B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Secure Upload Link
              </a>
            </div>
            
            <p style="color: #6A7282; font-size: 14px;">
              <strong style="color: #991B1B;">SECURITY WARNING:</strong> This link works <strong>ONLY ONCE</strong> and will expire in 24 hours.
            </p>
          </div>
        </body>
      </html>
    `
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Success! Email sent.");
      console.log("Message ID:", data.messageId);
      console.log("-----------------------------------------");
      console.log("🎉 The token is now in the database. You can click the link in the new email to test the UI!");
    } else {
      const errorText = await response.text();
      console.error("❌ Failed to send email.");
      console.error("Status:", response.status);
      console.error("Error Response:", errorText);
    }
  } catch (error) {
    console.error("❌ An error occurred during the fetch request:", error.message);
  }
}

sendTestEmail();
