"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { signupAction, AuthActionResult } from "@/app/actions/auth";
import { FormField } from "@/components/ui/FormField";
import { ArrowRight, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(
    signupAction,
    null
  );

  return (
    <div className="linear-card p-6 sm:p-8 space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Start your 14-day free trial
        </h1>
        <p className="text-xs text-slate-500">
          Create your agency workspace and begin recovering neglected client leads.
        </p>
      </div>

      {state?.success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Registration Submitted Successfully</span>
          </div>
          <p className="leading-relaxed text-[11px] text-emerald-700">
            {state.message}
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 font-bold text-emerald-800 hover:underline"
            >
              <span>Proceed to Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {state?.error && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Registration Issue</p>
            <p className="text-[11px] leading-relaxed">{state.error}</p>
          </div>
        </div>
      )}

      {!state?.success && (
        <form action={formAction} className="space-y-4">
          <FormField label="Your Full Name" required>
            <input
              type="text"
              name="fullName"
              required
              placeholder="e.g. Tariq Mahmood"
              className="input-base w-full"
              disabled={isPending}
            />
          </FormField>

          <FormField label="Digital Agency Name" required>
            <input
              type="text"
              name="agencyName"
              required
              placeholder="e.g. Apex Digital PK"
              className="input-base w-full"
              disabled={isPending}
            />
          </FormField>

          <FormField label="Business Email" required>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="admin@apexdigital.pk"
              className="input-base w-full"
              disabled={isPending}
            />
          </FormField>

          <FormField
            label="Password"
            hint="Minimum 8 characters with a mix of letters and numbers"
            required
          >
            <input
              type="password"
              name="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="••••••••••••"
              className="input-base w-full"
              disabled={isPending}
            />
          </FormField>

          <div className="text-[11px] text-slate-500 leading-tight">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>.
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="btn-base bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold w-full shadow-xs disabled:opacity-50 h-10"
          >
            {isPending ? (
              <span>Creating your workspace...</span>
            ) : (
              <>
                <span>Create Agency Account</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>
      )}

      <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700">
          Sign In
        </Link>
      </div>
    </div>
  );
}
