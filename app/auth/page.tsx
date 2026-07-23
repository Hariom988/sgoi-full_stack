"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import AuthTabs, { AuthMode } from "@/components/(auth)/authTabs";
import LoginForm from "@/components/(auth)/loginForm";
import RegisterForm from "@/components/(auth)/registerForm";

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

function getMode(searchParams: URLSearchParams): AuthMode {
  return searchParams.get("mode") === "register" ? "register" : "login";
}

function AuthPageContent() {
  const searchParams = useSearchParams();
  const mode = getMode(searchParams);

  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [csrfError, setCsrfError] = useState<string | null>(null);

  const loadCsrf = useCallback(async () => {
    try {
      const token = await fetchCsrfToken();
      setCsrfToken(token);
      setCsrfError(null);
    } catch {
      setCsrfError(
        "Failed to initialize security token. Please refresh the page.",
      );
    }
  }, []);

  const hasFetchedCsrf = useRef(false);
  useEffect(() => {
    if (hasFetchedCsrf.current) return;
    hasFetchedCsrf.current = true;
    loadCsrf();
  }, [loadCsrf]);

  const oauthError = searchParams.get("error");
  const googleErrorMessage =
    mode === "login" && oauthError
      ? (GOOGLE_ERROR_MESSAGES[oauthError] ??
        "Something went wrong. Please try again.")
      : null;

  return (
    <div className="w-full max-w-md my-10">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-8 pt-8 pb-6 text-center">
          <div className="leading-none">
            <span className="text-4xl font-extrabold text-primary tracking-tight">
              SOGI
            </span>
          </div>
          <p className="text-sm font-bold text-gray-900 mt-1">Pvt Ltd.</p>

          <h1 className="font-serif italic text-2xl text-primary mt-4">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {mode === "login"
              ? "Sign in to continue to your account"
              : "join us and get started in seconds"}
          </p>
        </div>

        <AuthTabs active={mode} />

        <div
          id="auth-tabpanel"
          role="tabpanel"
          aria-labelledby={
            mode === "login" ? "auth-tab-login" : "auth-tab-register"
          }
          className="px-8 py-8"
        >
          {csrfError && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
            >
              <span className="shrink-0 mt-0.5">⚠</span>
              <span>{csrfError}</span>
            </div>
          )}

          {mode === "login" ? (
            <LoginForm
              csrfToken={csrfToken}
              onCsrfRefresh={loadCsrf}
              initialError={googleErrorMessage}
            />
          ) : (
            <RegisterForm csrfToken={csrfToken} onCsrfRefresh={loadCsrf} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthPageContent />
    </Suspense>
  );
}
