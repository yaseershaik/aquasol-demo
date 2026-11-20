export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  company_name?: string | null;
  gstin?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  role: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserProfile;
}

const TOKEN_KEY = "aquasol_user_token";
const USER_KEY = "aquasol_user_profile";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

export function setAuthData(data: AuthResponse) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, data.access_token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  // Set cookie for SSR/middleware if needed
  document.cookie = `aquasol_user_token=${data.access_token}; path=/; max-age=604800; SameSite=Lax`;
  window.dispatchEvent(new Event("aquasol-auth-change"));
}

export function clearAuthData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = `aquasol_user_token=; path=/; max-age=0; SameSite=Lax`;
  window.dispatchEvent(new Event("aquasol-auth-change"));
}

export interface UnifiedAuthResponse extends AuthResponse {
  role?: string;
  redirectUrl?: string;
}

export async function loginUser(email: string, password: string): Promise<UnifiedAuthResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || data.detail || "Failed to sign in. Please verify your credentials.");
  }

  setAuthData({
    access_token: data.access_token || "session_token",
    token_type: data.token_type || "bearer",
    user: data.user,
  });

  return data;
}

export async function registerUser(userData: {
  name: string;
  email: string;
  phone: string;
  password: string;
  company_name?: string;
  gstin?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}): Promise<AuthResponse> {
  // Try Next.js native API first
  let res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  // If 404 (e.g. running in legacy mode), fallback to FastAPI
  if (res.status === 404) {
    res = await fetch("/api/py/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.detail || "Failed to create account. Please check your details.");
  }

  setAuthData(data);
  return data;
}

export async function fetchCurrentProfile(): Promise<UserProfile | null> {
  const token = getStoredToken();
  if (!token) return null;

  try {
    let res = await fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 404) {
      res = await fetch("/api/py/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    if (!res.ok) {
      if (res.status === 401) {
        clearAuthData();
      }
      return null;
    }
    const user: UserProfile = await res.json();
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  } catch {
    return null;
  }
}
