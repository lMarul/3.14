import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY') || ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } })
  }

  try {
    const { ticketId, userEmail, userName } = await req.json()
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    
    // Generate secure cryptographically random token
    const secureToken = crypto.randomUUID()
    const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours

    // Store token in ticket metadata (assuming a JSONB column exists, e.g., request_note or a generic metadata col, or Auth metadata)
    // For this example, we append to the existing request_note as a JSON string to avoid schema changes
    await supabase.rpc('set_ticket_status', {
      p_ticket_id: ticketId,
      p_new_status: 'approved',
      p_notes: JSON.stringify({ upload_token: secureToken, expires_at: expirationTime })
    })

    const uploadUrl = `https://likhani.app/secure-upload/${secureToken}`

    // Use Brevo HTTP API (NO SMTP)
    const emailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: { name: "Likhani Admin", email: "likhani.soma@gmail.com" },
        to: [{ email: userEmail, name: userName }],
        subject: "Your Request has been Approved - Secure Upload Link",
        htmlContent: `
          <html>
            <body style="font-family: sans-serif; padding: 20px;">
              <h2>Upload Request Approved</h2>
              <p>Hi ${userName},</p>
              <p>Your request has been approved. Please use the secure link below to upload your media.</p>
              <div style="margin: 30px 0;">
                <a href="${uploadUrl}" style="background-color: #991B1B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Secure Upload Link</a>
              </div>
              <p><strong>SECURITY WARNING:</strong> This link works <strong>ONLY ONCE</strong> and will expire in 24 hours.</p>
            </body>
          </html>
        `
      })
    })

    if (!emailRes.ok) throw new Error('Brevo API error: ' + await emailRes.text())

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } })
  }
})
