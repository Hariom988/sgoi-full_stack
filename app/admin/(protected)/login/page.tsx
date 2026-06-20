"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";

// ─── CSRF helper ──────────────────────────────────────────────────────────────

async function fetchCsrfToken(): Promise<string> {
  const res = await fetch("/api/admin/auth/csrf", { method: "GET" });
  if (!res.ok) throw new Error("Failed to fetch CSRF token.");
  const data = await res.json();
  return data.csrfToken as string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch CSRF token on mount
  const loadCsrf = useCallback(async () => {
    try {
      const token = await fetchCsrfToken();
      setCsrfToken(token);
    } catch {
      setError("Failed to initialize security token. Please refresh the page.");
    }
  }, []);

  // Prevents React Strict Mode's double-invocation of effects in development
  // from firing this fetch twice on a single mount.
  const hasFetchedCsrf = useRef(false);

  useEffect(() => {
    if (hasFetchedCsrf.current) return;
    hasFetchedCsrf.current = true;
    loadCsrf();
  }, [loadCsrf]);

  // ── Form submission ──────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!csrfToken) {
      setError("Security token not ready. Please refresh and try again.");
      return;
    }

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Login failed. Please try again.");
        // Refresh CSRF token after a failed attempt
        await loadCsrf();
        return;
      }

      // Success — redirect to intended destination
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("A network error occurred. Please check your connection.");
      await loadCsrf();
    } finally {
      setIsLoading(false);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-[var(--color-primary)] px-8 py-8 text-center">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              SGOI Admin
            </h1>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Error banner */}
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
                >
                  <span className="shrink-0 mt-0.5">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    placeholder="admin@example.com"
                    className="
                      w-full pl-9 pr-4 py-2.5
                      rounded-lg border border-gray-300
                      text-sm text-gray-900
                      placeholder:text-gray-400
                      focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
                      disabled:opacity-60 disabled:cursor-not-allowed
                      transition-shadow
                    "
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    placeholder="••••••••"
                    className="
                      w-full pl-9 pr-10 py-2.5
                      rounded-lg border border-gray-300
                      text-sm text-gray-900
                      placeholder:text-gray-400
                      focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
                      disabled:opacity-60 disabled:cursor-not-allowed
                      transition-shadow
                    "
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || !csrfToken}
                className="
                  w-full py-2.5 px-4
                  rounded-lg
                  bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]
                  text-white text-sm font-semibold tracking-wide
                  transition-colors duration-200
                  disabled:opacity-60 disabled:cursor-not-allowed
                  focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2
                "
              >
                {isLoading ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          This area is restricted. Unauthorized access attempts may be
          prosecuted.
        </p>
      </div>
    </main>
  );
}
