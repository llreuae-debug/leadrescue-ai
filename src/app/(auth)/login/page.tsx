"use client";

import React, { useActionState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { loginAction, AuthActionResult } from "@/app/actions/auth";
import { FormField } from "@/components/ui/FormField";
import { ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get("redirectedFrom");
  const isReset = searchParams.get("reset") === "success";

  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(
    loginAction,
    null
  );

  return (
    <div className="linear-card p-6 sm:p-8 space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Sign in to your agency
        </h1>
        <p className="text-xs text-slate-500">
          Enter your agency email credentials to access your workspace.
        </p>
      </div>

      {isReset && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Your password has been successfully updated. Please log in.</span>
        </div>
      )}

      {redirectedFrom && (
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Please sign in to access that protected page.</span>
        </div>
      )}

      {state?.error && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Authentication Error</p>
            <p className="text-[11px] leading-relaxed">{state.error}</p>
          </div>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <FormField label="Business Email" required>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="admin@agency.pk"
            className="input-base w-full"
            disabled={isPending}
          />
        </FormField>

        <FormField label="Password" required>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            placeholder="••••••••••••"
            className="input-base w-full"
            disabled={isPending}
          />
        </FormField>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
            <input type="checkbox" name="remember" className="rounded text-blue-600" />
            <span>Remember for 30 days</span>
          </label>
          <Link
            href="/forgot-password"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="btn-base bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold w-full shadow-xs disabled:opacity-50 h-10"
        >
          {isPending ? (
            <span>Signing in...</span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </form>

      <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
        Don&apos;t have an agency account yet?{" "}
        <Link href="/signup" className="font-bold text-blue-600 hover:text-blue-700">
          Start 14-day free trial
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading form...</div>}>
      <LoginForm />
    </Suspense>
  );
}
