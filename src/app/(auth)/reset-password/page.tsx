"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { resetPasswordAction, AuthActionResult } from "@/app/actions/auth";
import { FormField } from "@/components/ui/FormField";
import { ArrowRight, AlertCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(
    resetPasswordAction,
    null
  );

  return (
    <div className="linear-card p-6 sm:p-8 space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Set a new password
        </h1>
        <p className="text-xs text-slate-500">
          Please enter your new password to regain access to your agency workspace.
        </p>
      </div>

      {state?.error && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">{state.error}</p>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <FormField
          label="New Password"
          hint="Minimum 8 characters"
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

        <FormField label="Confirm New Password" required>
          <input
            type="password"
            name="confirmPassword"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="••••••••••••"
            className="input-base w-full"
            disabled={isPending}
          />
        </FormField>

        <button
          type="submit"
          disabled={isPending}
          className="btn-base bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold w-full shadow-xs disabled:opacity-50 h-10"
        >
          {isPending ? (
            <span>Updating password...</span>
          ) : (
            <>
              <span>Update Password</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </form>

      <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
        Remember your password?{" "}
        <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700">
          Sign In
        </Link>
      </div>
    </div>
  );
}
