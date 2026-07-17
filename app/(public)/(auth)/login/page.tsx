"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import AuthTabs from "@/components/(auth)/authTabs";
import GoogleButton from "@/components/(auth)/googleButton";

async function fetchCsrfToken(): Promise<string> {
  const res = await fetch("/api/auth/csrf", { method: "GET" });
  if (!res.ok) throw new Error("Failed to fetch CSRF token.");
  const data = await res.json();
  return data.csrfToken as string;
}

const GOOGLE_ERROR_MESSAGES: Record<string, string> = {
  google_denied: "Google sign-in was cancelled.",
  google_invalid_state: "Google sign-in session expired. Please try again.",
  google_unverified_email:
    "Your Google account's email isn't verified. Please use another sign-in method.",
  google_unavailable: "Google sign-in is currently unavailable.",
  google_failed: "Google sign-in failed. Please try again.",
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(() => {
    const oauthError = searchParams.get("error");
    return oauthError
      ? (GOOGLE_ERROR_MESSAGES[oauthError] ??
          "Something went wrong. Please try again.")
      : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const loadCsrf = useCallback(async () => {
    try {
      const token = await fetchCsrfToken();
      setCsrfToken(token);
    } catch {
      setError("Failed to initialize security token. Please refresh the page.");
    }
  }, []);

  const hasFetchedCsrf = useRef(false);

  useEffect(() => {
    if (hasFetchedCsrf.current) return;
    hasFetchedCsrf.current = true;
    loadCsrf();
  }, [loadCsrf]);

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
      const res = await fetch("/api/auth/login", {
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
        await loadCsrf();
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("A network error occurred. Please check your connection.");
      await loadCsrf();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto ">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-8 pt-8 pb-6 text-center">
          <div className="leading-none">
            <span className="text-4xl font-extrabold text-primary tracking-tight">
              SOGI
            </span>
          </div>
          <p className="text-sm font-bold text-gray-900 mt-1">Pvt Ltd.</p>

          <h1 className="font-serif italic text-2xl text-primary mt-4">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to continue to your account
          </p>
        </div>

        <AuthTabs active="signin" />
        <div className="px-8 py-8">
          <div className="space-y-4">
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
              >
                <span className="shrink-0 mt-0.5">⚠</span>
                <span>{error}</span>
              </div>
            )}

            <GoogleButton />

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-semibold text-gray-400 tracking-wide">
                OR
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5 mt-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold text-gray-700 tracking-wide uppercase mb-1.5"
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
                  placeholder="Enter Your Email Address"
                  className="
                    w-full pl-9 pr-4 py-2.5
                    rounded-lg border border-gray-300
                    text-sm text-gray-900
                    placeholder:text-gray-400
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                    disabled:opacity-60 disabled:cursor-not-allowed
                    transition-shadow
                  "
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold text-gray-700 tracking-wide uppercase mb-1.5"
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
                  placeholder="Enter Your Password"
                  className="
                    w-full pl-9 pr-10 py-2.5
                    rounded-lg border border-gray-300
                    text-sm text-gray-900
                    placeholder:text-gray-400
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                    disabled:opacity-60 disabled:cursor-not-allowed
                    transition-shadow
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                Remember me
              </label>
              <Link
                href="#"
                className="text-sm font-medium text-primary hover:text-primary-hover"
              >
                Forgot password ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading || !csrfToken}
              className="
                w-full py-2.5 px-4
                rounded-lg
                bg-primary hover:bg-primary-hover
                text-white text-sm font-semibold tracking-wide
                transition-colors duration-200
                disabled:opacity-60 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              "
            >
              {isLoading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:text-primary-hover"
            >
              Create One
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
