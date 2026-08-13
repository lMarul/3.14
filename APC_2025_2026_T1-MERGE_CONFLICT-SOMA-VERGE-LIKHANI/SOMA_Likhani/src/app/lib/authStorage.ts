import type { User } from "@supabase/supabase-js";

export function setGuestStorage() {
  localStorage.setItem("isGuest", "true");
  localStorage.setItem("isLoggedIn", "false");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
  localStorage.removeItem("authMode");
}

export function setAuthedStorage(user: User) {
  localStorage.setItem("isGuest", "false");
  localStorage.setItem("isLoggedIn", "true");
  localStorage.removeItem("authMode");

  if (user.email) {
    localStorage.setItem("userEmail", user.email);
  }

  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === "string"
        ? user.user_metadata.name
        : "";

  if (fullName) {
    localStorage.setItem("userName", fullName);
  } else {
    localStorage.removeItem("userName");
  }
}

export function clearAuthStorage() {
  localStorage.removeItem("isGuest");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
  localStorage.removeItem("authMode");
}
