import { setAuthTokenGetter } from "@workspace/api-client-react";

export function initApiAuth() {
  setAuthTokenGetter(() => localStorage.getItem("insure_gig_token"));
}

export function getToken(): string | null {
  return localStorage.getItem("insure_gig_token");
}

export function getRole(): string | null {
  return localStorage.getItem("insure_gig_role");
}

export function clearAuth() {
  localStorage.removeItem("insure_gig_token");
  localStorage.removeItem("insure_gig_role");
}
