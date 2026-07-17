"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, User as UserIcon } from "lucide-react";
import Link from "next/link";
import AuthTabs from "@/components/(auth)/authTabs";
import GoogleButton from "@/components/(auth)/googleButton";

async function fetchCsrfToken(): Promise<string> {
  const res = await fetch("/api/auth/csrf", { method: "GET" });
  if (!res.ok) throw new Error("Failed to fetch CSRF token.");
  const data = await res.json();
  return data.csrfToken as string;
}

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
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
    setFieldErrors({});

    if (!csrfToken) {
      setError("Security token not ready. Please refresh and try again.");
      return;
    }

    if (!agreedToTerms) {
      setFieldErrors({ terms: "You must agree to the Terms & Conditions and Privacy Policy." });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Registration failed. Please try again.");
        setFieldErrors(data.fields ?? {});
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
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-8 pt-8 pb-6 text-center">
          <div className="leading-none">
            <span className="text-4xl font-extrabold text-[var(--color-primary)] tracking-tight">
              SOGI
            </span>
          </div>
          <p className="text-sm font-bold text-gray-900 mt-1">Pvt Ltd.</p>

          <h1 className="font-serif italic text-2xl text-[var(--color-primary)] mt-4">
            Create your account
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            join us and get started in seconds
          </p>
        </div>

        <AuthTabs active="register" />

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

          <form onSubmit={handleSubmit} noValidate className="space-y-4 mt-5">
            <div>
              <div className="relative">
                <UserIcon
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter Your Full Name"
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
              {fieldErrors.name && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.name}</p>
              )}
            </div>

            <div>
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
                    focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
                    disabled:opacity-60 disabled:cursor-not-allowed
                    transition-shadow
                  "
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
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
                    focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
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
              {fieldErrors.password && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.password}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="Confirm Your Password"
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
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-xs text-red-600 mt-1">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                <span>
                  I agree to the{" "}
                  <Link
                    href="/terms-conditions"
                    className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium"
                  >
                    Terms &amp; Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              {fieldErrors.terms && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.terms}</p>
              )}
            </div>

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
              {isLoading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
