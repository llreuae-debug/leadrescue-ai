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
    <div className="card-white p-6 sm:p-8 space-y-6">
      <div className="space-y-1.5 text-center">
        <span className="badge-dark text-[10px] uppercase font-bold">Secure Access</span>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#101113]">
          Sign in to your agency
        </h1>
        <p className="text-xs text-[#777D77] font-medium">
          Enter your agency email credentials to access your workspace.
        </p>
      </div>

      {isReset && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-xs text-emerald-950 flex items-center gap-2 font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Your password has been successfully updated. Please log in.</span>
        </div>
      )}

      {redirectedFrom && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-500 text-xs text-amber-950 flex items-center gap-2 font-bold">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Please sign in to access that protected page.</span>
        </div>
      )}

      {state?.error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border-2 border-red-500 text-xs text-red-950 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5 font-medium">
            <p className="font-bold text-red-900">Authentication Error</p>
            <p className="text-[11px] leading-relaxed text-red-800">{state.error}</p>
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
            className="w-full text-xs font-bold border-2 border-[#101113] rounded-xl p-3 bg-[#F3F4F2] focus:bg-white focus:outline-none text-[#101113]"
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
            className="w-full text-xs font-bold border-2 border-[#101113] rounded-xl p-3 bg-[#F3F4F2] focus:bg-white focus:outline-none text-[#101113]"
            disabled={isPending}
          />
        </FormField>

        <div className="flex items-center justify-between text-xs font-medium">
          <label className="flex items-center gap-2 text-[#777D77] cursor-pointer">
            <input type="checkbox" name="remember" className="rounded border-2 border-[#101113] text-[#101113]" />
            <span>Remember for 30 days</span>
          </label>
          <Link
            href="/forgot-password"
            className="font-bold text-[#101113] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="btn-primary text-xs font-black w-full h-11 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <span>Signing in...</span>
          ) : (
            <>
              <span>Sign in to Dashboard</span>
              <ArrowRight className="w-4 h-4 text-[#B7FF3C]" />
            </>
          )}
        </button>
      </form>

      <div className="pt-2 text-center text-xs font-medium text-[#777D77] border-t-2 border-[#DCDDDA]">
        Don&apos;t have an agency workspace yet?{" "}
        <Link href="/signup" className="font-black text-[#101113] hover:underline">
          Start 14-day free trial
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="card-white p-8 text-center text-xs font-bold">Loading login...</div>}>
      <LoginForm />
    </Suspense>
  );
}
