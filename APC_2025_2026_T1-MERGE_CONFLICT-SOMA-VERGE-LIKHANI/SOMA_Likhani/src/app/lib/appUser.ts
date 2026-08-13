import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export async function ensureAppUser(user: User) {
  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === "string"
        ? user.user_metadata.name
        : "";

  const { error } = await supabase.from("app_users").upsert(
    {
      id: user.id,
      email: user.email?.toLowerCase() ?? "",
      full_name: fullName || user.email?.split("@")[0] || "APC User",
      role: "student",
      status: "active",
      is_email_verified: !!user.email_confirmed_at,
    },
    { onConflict: "id", ignoreDuplicates: true }
  );

  if (error && error.code !== "23505") {
    throw new Error(error.message);
  }
}
