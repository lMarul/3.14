import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SignJWT, importPKCS8 } from "npm:jose@5.9.6";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { filename, mimeType } = await req.json();

    const gdriveCredsStr = Deno.env.get('GDRIVE_SERVICE_ACCOUNT_KEY');
    const folderId = Deno.env.get('GDRIVE_TARGET_FOLDER_ID');

    const refreshToken = Deno.env.get('GDRIVE_REFRESH_TOKEN');
    const clientId = Deno.env.get('GDRIVE_CLIENT_ID');
    const clientSecret = Deno.env.get('GDRIVE_CLIENT_SECRET');

    if (!folderId) {
      throw new Error("Missing Google Drive Target Folder ID in Edge Function secrets.");
    }

    if (!refreshToken && !gdriveCredsStr) {
      throw new Error("Missing Google Drive credentials (neither Refresh Token nor Service Account key is configured).");
    }

    let accessToken: string;


    if (refreshToken && clientId && clientSecret) {
      console.log("Using OAuth Refresh Token authentication...");
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: "refresh_token"
        })
      });

      if (!tokenRes.ok) {
        const errorText = await tokenRes.text();
        throw new Error(`Google token exchange failed (OAuth): ${tokenRes.status} - ${errorText}`);
      }

      const tokenData = await tokenRes.json();
      accessToken = tokenData.access_token;
    } else {
      console.log("Falling back to Google Service Account authentication...");
      const gdriveCredsStr = Deno.env.get('GDRIVE_SERVICE_ACCOUNT_KEY');
      if (!gdriveCredsStr) {
        throw new Error("Missing Google Drive credentials (neither Refresh Token nor Service Account key is configured).");
      }

      const credentials = JSON.parse(gdriveCredsStr);
      
      // 1. Import PKCS8 private key and sign JWT
      const privateKey = await importPKCS8(credentials.private_key, 'RS256');
      const jwt = await new SignJWT({
        scope: 'https://www.googleapis.com/auth/drive.file'
      })
        .setProtectedHeader({ alg: 'RS256' })
        .setIssuer(credentials.client_email)
        .setAudience('https://oauth2.googleapis.com/token')
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(privateKey);

      // 2. Exchange JWT for Google Access Token
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
      });

      if (!tokenRes.ok) {
        const errorText = await tokenRes.text();
        throw new Error(`Google token exchange failed (Service Account): ${tokenRes.status} - ${errorText}`);
      }

      const tokenData = await tokenRes.json();
      accessToken = tokenData.access_token;
    }


    const origin = req.headers.get("origin") || "http://localhost:5173";

    // 3. Initiate Resumable Upload on Google Drive
    const uploadInitRes = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Type": mimeType,
        "Origin": origin
      },
      body: JSON.stringify({
        name: filename,
        parents: [folderId]
      })
    });


    if (!uploadInitRes.ok) {
      const errorText = await uploadInitRes.text();
      throw new Error(`Google Drive upload initiation failed: ${uploadInitRes.status} - ${errorText}`);
    }

    const uploadUrl = uploadInitRes.headers.get("location");
    if (!uploadUrl) {
      throw new Error("Google Drive did not return a session location header for resumable upload.");
    }

    return new Response(JSON.stringify({ uploadUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
