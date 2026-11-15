// Public values only (a Google client ID is not a secret).
export const API_URL: string =
  import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

export const GOOGLE_CLIENT_ID: string =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ??
  "745663137254-stjrbd8em0mj68qsd4b59ibntrh99kmv.apps.googleusercontent.com";
