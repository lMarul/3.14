import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, UploadCloud, CheckCircle2, AlertCircle, Lock, FolderOpen, Link2, ExternalLink, HelpCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

const SecureUpload: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<number | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [mainVideo, setMainVideo] = useState<File | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [stillsFiles, setStillsFiles] = useState<FileList | null>(null);
  const [user, setUser] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [showHelper, setShowHelper] = useState(false);

  useEffect(() => {
    console.log("SecureUpload component mounted - Diagnostic Version 1.2 (Google Drive active)");
    validateToken();
  }, [token]);

  const validateToken = async () => {
    if (!token) {
      setError("No token provided");
      setValidating(false);
      return;
    }

    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        setError("AUTH_REQUIRED");
        setValidating(false);
        return;
      }
      setUser(authData.user);

      const { data, error: fetchError } = await supabase
        .from('submission_tickets')
        .select('*')
        .eq('status', 'accepted')
        .order('submitted_at', { ascending: false })
        .limit(100);

      if (fetchError) throw fetchError;

      let validTicket = null;
      let tokenData = null;

      for (const t of data) {
        if (t.request_note) {
          try {
            const parsed = JSON.parse(t.request_note);
            if (parsed && parsed.upload_token === token) {
              validTicket = t;
              tokenData = parsed;
              break;
            }
          } catch (e) {
            // ignore non-json notes
          }
        }
      }

      if (!validTicket || !tokenData) {
        throw new Error("Invalid or expired token");
      }

      const expiresAt = new Date(tokenData.expires_at).getTime();
      if (Date.now() > expiresAt) {
        throw new Error("This secure upload link has expired.");
      }
      
      if (validTicket.student_user_id !== authData.user.id) {
        throw new Error("This secure link belongs to a different user. Please sign in with the correct account.");
      }

      setTicketId(validTicket.id);
    } catch (err: any) {
      setError(err.message || "Invalid upload link");
    } finally {
      setValidating(false);
    }
  };

  const handleUpload = async () => {
    if (!mainVideo || !ticketId || !user) return;

    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      let videoUrl = "PENDING_URL";
      
      console.log("Step 1: Invoking gdrive-upload-link edge function...");
      const { data: edgeData, error: edgeErr } = await supabase.functions.invoke('gdrive-upload-link', {
        body: { filename: mainVideo.name, mimeType: mainVideo.type }
      });
      if (edgeErr) {
        console.error("Edge function invocation failed:", edgeErr);
        throw new Error(`Google Drive Edge Function failed: ${edgeErr.message || JSON.stringify(edgeErr)}`);
      }
      if (!edgeData?.uploadUrl) {
        throw new Error("Failed to retrieve Google Drive upload URL from Edge Function.");
      }
      
      console.log("Step 2: Uploading video directly to Google Drive...");
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', edgeData.uploadUrl, true);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
           setUploadProgress((e.loaded / e.total) * 100);
        }
      };
      
      const responseText = await new Promise<string>((resolve, reject) => {
        xhr.onload = () => {
           if (xhr.status >= 200 && xhr.status < 300) {
             resolve(xhr.responseText);
           } else {
             console.error("Google Drive upload error response body:", xhr.responseText);
             let errMsg = `Google Drive responded with status ${xhr.status}`;
             try {
               const parsedErr = JSON.parse(xhr.responseText);
               if (parsedErr?.error?.message) {
                 errMsg += `: ${parsedErr.error.message}`;
               } else if (xhr.responseText) {
                 errMsg += `: ${xhr.responseText}`;
               }
             } catch (e) {
               if (xhr.responseText) {
                 errMsg += `: ${xhr.responseText}`;
               }
             }
             reject(new Error(errMsg));
           }
        };
        xhr.onerror = () => reject(new Error("Network connection error to Google Drive"));
        xhr.send(mainVideo);
      }).catch(err => {
        console.error("Video file upload failed:", err);
        throw new Error(`Video file upload failed: ${err.message}`);
      });

      
      let videoId = "";
      try {
        const fileMetadata = JSON.parse(responseText);
        if (fileMetadata && fileMetadata.id) {
          videoId = fileMetadata.id;
        }
      } catch (e) {
        console.error("Failed to parse Google Drive metadata response", e);
      }
      
      videoUrl = videoId ? `https://drive.google.com/open?id=${videoId}` : "https://drive.google.com/open?id=";
      console.log("Video uploaded successfully. Resolved URL:", videoUrl);

      const videoPayload = {
        provider: "external_url",
        bucket_name: null,
        object_path: null,
        public_url: videoUrl,
        mime_type: mainVideo.type,
        file_size_bytes: mainVideo.size,
      };

      // Upload Poster if exists
      let posterPayload: any = null;
      if (posterFile) {
        console.log(`Step 3: Uploading poster: ${posterFile.name} (${(posterFile.size / 1024 / 1024).toFixed(2)} MB)`);
        
        // Safety check for size limit
        if (posterFile.size > 50 * 1024 * 1024) {
          throw new Error(`Poster file exceeds the maximum size limit of 50MB (selected file is ${(posterFile.size / 1024 / 1024).toFixed(2)}MB).`);
        }

        const posterExt = posterFile.name.split('.').pop();
        const uuid2 = Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2, '0')).join('');
        const posterPath = `tickets/${user.id}/${ticketId}/poster_${uuid2}.${posterExt}`;
        
        const { error: posterErr } = await supabase.storage.from('submission-ticket-media').upload(posterPath, posterFile);
        if (posterErr) {
          console.error("Supabase Storage Poster upload error:", posterErr);
          throw new Error(`Poster image upload to Supabase Storage failed: ${posterErr.message || JSON.stringify(posterErr)} (File size: ${(posterFile.size / 1024 / 1024).toFixed(2)}MB)`);
        }
        
        const { data: posterUrlData } = supabase.storage.from('submission-ticket-media').getPublicUrl(posterPath);
        posterPayload = {
          provider: "supabase_storage",
          bucket_name: "submission-ticket-media",
          object_path: posterPath,
          public_url: posterUrlData.publicUrl,
          mime_type: posterFile.type,
          file_size_bytes: posterFile.size,
        };
      }

      // Upload Stills if exist
      const stillsPayload: any[] = [];
      if (stillsFiles) {
        console.log("Step 4: Uploading stills to Supabase Storage...");
        const stillFilesArray = Array.from(stillsFiles).slice(0, 5);
        for (let i = 0; i < stillFilesArray.length; i++) {
          const still = stillFilesArray[i];
          console.log(`Uploading still ${i+1}: ${still.name} (${(still.size / 1024 / 1024).toFixed(2)} MB)`);
          
          if (still.size > 50 * 1024 * 1024) {
            throw new Error(`Still image ${i+1} (${still.name}) exceeds the maximum size limit of 50MB (selected file is ${(still.size / 1024 / 1024).toFixed(2)}MB).`);
          }

          const stillExt = still.name.split('.').pop();
          const uuid3 = Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2, '0')).join('');
          const stillPath = `tickets/${user.id}/${ticketId}/still_${uuid3}.${stillExt}`;
          
          const { error: stillUploadError } = await supabase.storage.from('submission-ticket-media').upload(stillPath, still);
          if (stillUploadError) {
            console.error(`Supabase Storage Still ${i+1} upload error:`, stillUploadError);
            throw new Error(`Still image ${i+1} (${still.name}) upload failed: ${stillUploadError.message || JSON.stringify(stillUploadError)}`);
          }
          
          const { data: stillUrlData } = supabase.storage.from('submission-ticket-media').getPublicUrl(stillPath);
          stillsPayload.push({
            provider: "supabase_storage",
            bucket_name: "submission-ticket-media",
            object_path: stillPath,
            public_url: stillUrlData.publicUrl,
            mime_type: still.type,
            file_size_bytes: still.size,
          });
        }
      }

      console.log("Step 5: Invoking submit_ticket_media_once RPC...");
      const { error: rpcError } = await supabase.rpc("submit_ticket_media_once", {
        p_ticket_id: ticketId,
        p_video: videoPayload,
        p_image: posterPayload,
        p_stills: stillsPayload.length > 0 ? stillsPayload : null,
      });
      if (rpcError) {
        console.error("RPC submit_ticket_media_once failed:", rpcError);
        throw new Error(`Database submission failed: ${rpcError.message}`);
      }

      await supabase.from('submission_tickets').update({ request_note: null }).eq('id', ticketId);

      setUploadSuccess(true);
    } catch (err: any) {
      console.error("Upload process encountered error:", err);
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#991B1B]" />
        <span className="ml-2">Validating secure link...</span>
      </div>
    );
  }

  if (error === "AUTH_REQUIRED") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f9fafb] p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
          <Lock className="h-12 w-12 text-[#991B1B] mb-4" />
          <h2 className="text-xl font-bold text-[#1e293b] mb-2">Authentication Required</h2>
          <p className="text-[#64748b] text-sm mb-6">For security reasons, you must be signed in to your Likhani account to use this upload link.</p>
          <Button onClick={() => navigate('/signin')} className="bg-[#991B1B] hover:bg-[#7f1717] text-white">
            Go to Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-red-100 p-8 flex flex-col items-center text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Button onClick={() => navigate('/home')} className="bg-[#991B1B] hover:bg-[#7a1515] text-white">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  if (uploadSuccess) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f9fafb] p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-green-100 p-8 flex flex-col items-center text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-[#1e293b] mb-2">Upload Successful</h2>
          <p className="text-[#64748b] mb-6">Your files have been securely uploaded and the link is now deactivated.</p>
          <Button onClick={() => navigate('/home')} className="bg-[#991B1B] hover:bg-[#7f1717] text-white">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f9fafb] py-12 px-4">
      <div className="max-w-[600px] w-full bg-[#f9fafb] rounded-2xl p-8 border border-transparent shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        
        <h2 className="text-[22px] font-bold text-[#1e293b] mb-4">Uploaded Assets</h2>
        <p className="text-[#64748b] text-[15px] mb-8">No files uploaded yet.</p>

        <h3 className="text-[17px] text-[#475569] mb-6 font-medium">Upload (one-time)</h3>

        <div className="flex flex-col gap-6">

          {/* Main Video Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold tracking-wide uppercase text-[#64748b]">
              MAIN VIDEO FILE <span className="text-[#ef4444]">*</span>
            </label>
            <div className="relative">
              <input 
                type="file" 
                accept="video/*"
                onChange={(e) => setMainVideo(e.target.files?.[0] || null)}
                className="block w-full text-sm text-[#475569] file:mr-4 file:py-3 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:bg-transparent file:text-[#475569] file:cursor-pointer hover:file:bg-gray-50 border border-[#cbd5e1] rounded-lg bg-white cursor-pointer h-[46px]"
              />
            </div>
          </div>

          {/* Thumbnail / Poster Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold tracking-wide uppercase text-[#64748b]">
              UPLOAD THUMBNAIL / POSTER <span className="text-[#94a3b8] font-medium">(Optional)</span>
            </label>
            <div className="relative">
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-[#475569] file:mr-4 file:py-3 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:bg-transparent file:text-[#475569] file:cursor-pointer hover:file:bg-gray-50 border border-[#cbd5e1] rounded-lg bg-white cursor-pointer h-[46px]"
              />
            </div>
          </div>

          {/* Stills Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold tracking-wide uppercase text-[#64748b]">
              STILLS <span className="text-[#94a3b8] font-medium">(Optional)</span>
            </label>
            <div className="relative">
              <input 
                type="file" 
                multiple
                accept="image/*"
                onChange={(e) => setStillsFiles(e.target.files)}
                className="block w-full text-sm text-[#475569] file:mr-4 file:py-3 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:bg-transparent file:text-[#475569] file:cursor-pointer hover:file:bg-gray-50 border border-[#cbd5e1] rounded-lg bg-white cursor-pointer h-[46px]"
              />
            </div>
            <span className="text-[12px] text-[#64748b]">Images shown on video hover. Up to 5 images.</span>
          </div>

          {/* Upload Button Progress */}
          {loading ? (
             <div className="w-full bg-[#cbd5e1] rounded-full h-2.5 mt-4">
                 <div className="bg-[#991B1B] h-2.5 rounded-full" style={{ width: `${uploadProgress || 0}%` }}></div>
             </div>
          ) : (
            <Button onClick={handleUpload} disabled={!mainVideo} className="bg-[#991B1B] hover:bg-[#7f1717] w-full text-white py-6">
              Finalize Upload
            </Button>
          )}

        </div>
      </div>
    </div>
  );
};

export default SecureUpload;
