import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

export type TicketStatus = "draft" | "pending" | "accepted" | "rejected";

export interface SubmissionTicketRow {
  id: string;
  ticket_code: string | null;
  status: TicketStatus;
  project_title: string;
  synopsis: string;
  category_label: string | null;
  tags_text: string | null;
  rights_license: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
  upload_expired_at: string | null;
  admin_notes?: string | null;
  program?: string | null;
  course_subject?: string | null;
  section?: string | null;
  school_year?: string | null;
  faculty_advisor_name?: string | null;
}

export interface TicketMediaPreview {
  ticketId: string;
  mediaType: string;
  publicUrl: string;
  mimeType?: string;
  bucketName?: string;
  objectPath?: string;
  createdAt: string;
  isStill?: boolean;
}

function requireSupabase() {
  if (!supabase || !isSupabaseConfigured) throw new Error("Supabase not configured");
  return supabase;
}

export function useMySubmissionTickets() {
  const [tickets, setTickets] = useState<SubmissionTicketRow[]>([]);
  const [mediaByTicketId, setMediaByTicketId] = useState<Map<string, TicketMediaPreview[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const client = requireSupabase();
    setLoading(true);
    setError(null);
    setMediaError(null);

    try {
      const {
        data: { user },
        error: userError,
      } = await client.auth.getUser();

      if (userError) throw userError;
      if (!user) {
        setTickets([]);
        setMediaByTicketId(new Map());
        return;
      }

      const { data: ticketRows, error: ticketsError } = await client
        .from("submission_tickets")
        .select(`
          id, ticket_code, status, project_title, synopsis, category_label, tags_text, rights_license, submitted_at, created_at, updated_at, upload_expired_at,
          program, course_subject, section, school_year, faculty_advisor_name,
          submission_ticket_status_history(notes, changed_at)
        `)
        .eq("student_user_id", user.id)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (ticketsError) throw ticketsError;

      const normalized: SubmissionTicketRow[] = (ticketRows ?? []).map((row: any) => {
        // Get the latest note from history
        const history = row.submission_ticket_status_history || [];
        const latestNote = history
          .filter((h: any) => h.notes)
          .sort((a: any, b: any) => new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime())[0]?.notes;

        return {
          id: row.id,
          ticket_code: row.ticket_code ?? null,
          status: row.status,
          project_title: row.project_title,
          synopsis: row.synopsis,
          category_label: row.category_label ?? null,
          tags_text: row.tags_text ?? null,
          rights_license: row.rights_license ?? null,
          submitted_at: row.submitted_at ?? null,
          created_at: row.created_at,
          updated_at: row.updated_at,
          upload_expired_at: row.upload_expired_at ?? null,
          admin_notes: latestNote ?? null,
          program: row.program ?? null,
          course_subject: row.course_subject ?? null,
          section: row.section ?? null,
          school_year: row.school_year ?? null,
          faculty_advisor_name: row.faculty_advisor_name ?? null,
        };
      });

      setTickets(normalized);

      const ticketIds = normalized.map((t) => t.id);
      if (ticketIds.length === 0) {
        setMediaByTicketId(new Map());
        return;
      }

      let mediaRows: any[] | null = null;
      try {
        const { data, error: rpcError } = await client.rpc("get_ticket_media_previews", {
          p_ticket_ids: ticketIds,
        });
        if (rpcError) throw rpcError;
        mediaRows = (data as any[]) ?? [];
      } catch (err: any) {
        // Fallback if the RPC is missing/blocked: rely on RLS policies for student/admin visibility.
        const { data, error: tableError } = await client
          .from("submission_ticket_media")
          .select("ticket_id, media_type, public_url, mime_type, bucket_name, object_path, created_at, is_still")
          .in("ticket_id", ticketIds)
          .order("created_at", { ascending: true });

        if (tableError) {
          setMediaError(err?.message ?? tableError.message ?? "Failed to load uploaded assets");
          setMediaByTicketId(new Map());
          return;
        }

        mediaRows = (data as any[]) ?? [];
      }

      const next = new Map<string, TicketMediaPreview[]>();
      for (const row of mediaRows ?? []) {
        const item: TicketMediaPreview = {
          ticketId: row.ticket_id,
          mediaType: row.is_still ? "still" : row.media_type,
          publicUrl: row.public_url,
          mimeType: row.mime_type ?? undefined,
          bucketName: row.bucket_name ?? undefined,
          objectPath: row.object_path ?? undefined,
          createdAt: row.created_at,
          isStill: row.is_still,
        };
        const current = next.get(item.ticketId) ?? [];
        next.set(item.ticketId, [...current, item]);
      }
      setMediaByTicketId(next);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load submissions");
      setTickets([]);
      setMediaByTicketId(new Map());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { tickets, mediaByTicketId, loading, error, mediaError, refresh };
}

export function useTicketMediaUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadForTicket = useCallback(
    async (ticketId: string, files: { video?: File | null; poster?: File | null; stills?: File[] }) => {
      const client = requireSupabase();
      setUploading(true);
      setError(null);

      try {
        const {
          data: { user },
          error: userError,
        } = await client.auth.getUser();
        if (userError) throw userError;
        if (!user) throw new Error("You must be logged in");

        const { data: canUpload, error: canUploadError } = await client.rpc("can_upload_for_ticket", {
          p_ticket_id: ticketId,
          p_user_id: user.id,
        });
        if (canUploadError) throw canUploadError;
        if (!canUpload) throw new Error("Upload is not available for this ticket");

        const timestamp = Date.now();
        const bucket = "submission-ticket-media";
        const basePrefix = `tickets/${user.id}/${ticketId}`;

        const uploadedObjectPaths: string[] = [];

        let videoPayload: any = null;
        let posterPayload: any = null;

        if (files.video) {
          const { data: edgeData, error: edgeErr } = await client.functions.invoke('gdrive-upload-link', {
            body: { filename: files.video.name, mimeType: files.video.type }
          });
          if (edgeErr) throw edgeErr;
          if (!edgeData?.uploadUrl) throw new Error("Failed to get Google Drive upload URL.");
          
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', edgeData.uploadUrl, true);
          
          const responseText = await new Promise<string>((resolve, reject) => {
            xhr.onload = () => {
               if (xhr.status >= 200 && xhr.status < 300) {
                 resolve(xhr.responseText);
               } else {
                 console.error("Google Drive upload error response body in hook:", xhr.responseText);
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
            xhr.send(files.video);
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

          const videoUrl = videoId ? `https://drive.google.com/open?id=${videoId}` : "https://drive.google.com/open?id=uploaded_via_api";

          videoPayload = {
            provider: "external_url",
            bucket_name: null,
            object_path: null,
            public_url: videoUrl,
            mime_type: files.video.type,
            file_size_bytes: files.video.size,
          };
        }

        if (files.poster) {
          const objectPath = `${basePrefix}/poster_${timestamp}_${files.poster.name}`;
          const { error: uploadError } = await client.storage.from(bucket).upload(objectPath, files.poster, { upsert: false });
          if (uploadError) throw uploadError;
          uploadedObjectPaths.push(objectPath);
          const { data: urlData } = client.storage.from(bucket).getPublicUrl(objectPath);
          posterPayload = {
            provider: "supabase_storage",
            bucket_name: bucket,
            object_path: objectPath,
            public_url: urlData.publicUrl,
            mime_type: files.poster.type,
            file_size_bytes: files.poster.size,
          };
        }

        if (!videoPayload && !posterPayload) throw new Error("Select at least one file");

        // Step 1: Commit primary video + poster via the one-time RPC
        // (Stills are NOT passed here to avoid touching the old RPC signature)
        const { error: rpcError } = await client.rpc("submit_ticket_media_once", {
          p_ticket_id: ticketId,
          p_video: videoPayload,
          p_image: posterPayload,
        });

        if (rpcError) {
          if (uploadedObjectPaths.length > 0) {
            await client.storage.from(bucket).remove(uploadedObjectPaths);
          }
          throw rpcError;
        }

        // Step 2: Upload stills to storage then insert directly into the table.
        // Stills use is_still=true which is exempt from the unique index, so they
        // don't conflict with the primary video/image rows.
        const stillFiles = (files.stills ?? []).slice(0, 5);
        for (let i = 0; i < stillFiles.length; i++) {
          const still = stillFiles[i];
          const objectPath = `${basePrefix}/still_${timestamp}_${i}_${still.name}`;
          const { error: storageError } = await client.storage
            .from(bucket)
            .upload(objectPath, still, { upsert: false });
          if (storageError) {
            console.warn(`Still ${i + 1} storage upload failed:`, storageError.message);
            continue;
          }
          const { data: urlData } = client.storage.from(bucket).getPublicUrl(objectPath);
          const { error: insertError } = await client
            .from("submission_ticket_media")
            .insert({
              ticket_id: ticketId,
              uploaded_by: user.id,
              media_type: "image",
              provider: "supabase_storage",
              bucket_name: bucket,
              object_path: objectPath,
              public_url: urlData.publicUrl,
              mime_type: still.type,
              file_size_bytes: still.size,
              is_still: true,
            });
          if (insertError) {
            console.warn(`Still ${i + 1} DB insert failed (run 12_stills_support.sql migration if not done):`, insertError.message);
            throw new Error(`Failed to save Still ${i + 1}: ${insertError.message}`);
          }
        }
      } catch (err: any) {
        setError(err?.message ?? "Upload failed");
        throw err;
      } finally {
        setUploading(false);
      }
    },
    []
  );

  return { uploadForTicket, uploading, error };
}
