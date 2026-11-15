import "./style.css";
import { API_URL, GOOGLE_CLIENT_ID } from "./config";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface UserProfile {
  name: string;
  email: string;
  role: string;
  picture?: string;
}

interface GoogleCredentialResponse {
  credential: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize(config: {
            client_id: string;
            callback: (r: GoogleCredentialResponse) => void;
          }): void;
          renderButton(el: HTMLElement, options: Record<string, unknown>): void;
          disableAutoSelect(): void;
        };
      };
    };
  }
}

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const googleTokenBox = $<HTMLTextAreaElement>("googleToken");
const accessTokenBox = $<HTMLTextAreaElement>("accessToken");
const statusEl = $<HTMLParagraphElement>("status");

function setStatus(msg: string, type: "" | "ok" | "err" = "") {
  statusEl.textContent = msg;
  statusEl.className =
    "mt-4 min-h-5 text-sm animate-fade " +
    (type === "ok"
      ? "text-teal-600 dark:text-teal-300"
      : type === "err"
        ? "text-red-600 dark:text-red-400"
        : "text-slate-500 dark:text-slate-400");
}

function fillBox(box: HTMLTextAreaElement, value: string) {
  box.value = value;
  box.classList.remove("filled");
  if (value) {
    void box.offsetWidth; // restart animation
    box.classList.add("filled");
  }
}

function show(el: HTMLElement) {
  el.hidden = false;
  el.classList.remove("animate-fade");
  void el.offsetWidth;
  el.classList.add("animate-fade");
}

function showUser(user: UserProfile) {
  $("uName").textContent = user.name;
  $("uEmail").textContent = user.email;
  $("uRole").textContent = user.role;
  const avatar = $<HTMLImageElement>("avatar");
  if (user.picture) avatar.src = user.picture;
  else avatar.removeAttribute("src");
  $("loginView").hidden = true;
  show($("userView"));
}

function showLogin() {
  $("userView").hidden = true;
  show($("loginView"));
}

async function api<T>(path: string, init: RequestInit = {}): Promise<ApiResponse<T>> {
  const res = await fetch(API_URL + path, {
    credentials: "include",
    ...init,
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
  });
  const body = (await res.json().catch(() => ({}))) as Partial<ApiResponse<T>>;
  if (!res.ok || body.success === false) {
    throw new Error(body.message ?? `Request failed (${res.status})`);
  }
  return body as ApiResponse<T>;
}

// Decodes the Google JWT only to display the avatar; the backend does the real verification.
function decodeJwt(token: string): { picture?: string } {
  try {
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(part)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    );
    return JSON.parse(json);
  } catch {
    return {};
  }
}

async function handleCredential({ credential: idToken }: GoogleCredentialResponse) {
  fillBox(googleTokenBox, idToken); // Google ID token shown in the text box
  localStorage.setItem("googleIdToken", idToken);
  setStatus("Verifying with MediNexus backend…");

  try {
    const login = await api<{ accessToken: string; refreshToken: string }>(
      "/auth/google",
      { method: "POST", body: JSON.stringify({ idToken }) },
    );
    const { accessToken } = login.data;
    fillBox(accessTokenBox, accessToken);
    localStorage.setItem("accessToken", accessToken);

    const me = await api<UserProfile>("/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    showUser({ ...me.data, picture: decodeJwt(idToken).picture });
    setStatus("Logged in successfully.", "ok");
  } catch (err) {
    setStatus(err instanceof Error ? err.message : "Login failed", "err");
  }
}

function initGoogle() {
  const g = window.google;
  if (!g) {
    setTimeout(initGoogle, 100);
    return;
  }
  g.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleCredential });
  g.accounts.id.renderButton($("googleBtn"), {
    theme: "outline",
    size: "large",
    text: "continue_with",
    shape: "pill",
    width: 300,
  });
}

$("logout").addEventListener("click", () => {
  localStorage.removeItem("googleIdToken");
  localStorage.removeItem("accessToken");
  fillBox(googleTokenBox, "");
  fillBox(accessTokenBox, "");
  window.google?.accounts.id.disableAutoSelect();
  showLogin();
  setStatus("Signed out.");
});

document.querySelectorAll<HTMLButtonElement>("[data-copy]").forEach((btn) =>
  btn.addEventListener("click", async () => {
    const box = $<HTMLTextAreaElement>(btn.dataset.copy!);
    if (!box.value) return;
    await navigator.clipboard.writeText(box.value);
    btn.textContent = "Copied ✓";
    setTimeout(() => (btn.textContent = "Copy"), 1200);
  }),
);

// Restore session on reload
(async function restore() {
  const gt = localStorage.getItem("googleIdToken");
  const at = localStorage.getItem("accessToken");
  if (gt) googleTokenBox.value = gt;
  if (at) accessTokenBox.value = at;
  if (!at) return;
  try {
    const me = await api<UserProfile>("/auth/me", {
      headers: { Authorization: `Bearer ${at}` },
    });
    showUser({ ...me.data, picture: gt ? decodeJwt(gt).picture : undefined });
  } catch {
    localStorage.removeItem("accessToken");
    accessTokenBox.value = "";
  }
})();

initGoogle();
