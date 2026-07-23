"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import GoogleButton from "@/components/(auth)/googleButton";

interface LoginFormProps {
  csrfToken: string | null;
  onCsrfRefresh: () => Promise<void>;
  initialError?: string | null;
}

export default function LoginForm({
  csrfToken,
  onCsrfRefresh,
  initialError = null,
}: LoginFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [isLoading, setIsLoading] = useState(false);

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
        await onCsrfRefresh();
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("A network error occurred. Please check your connection.");
      await onCsrfRefresh();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
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
          href="/auth?mode=register"
          className="font-medium text-primary hover:text-primary-hover"
        >
          Create One
        </Link>
      </p>
    </>
  );
}
