"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { resetPasswordAction, AuthActionResult } from "@/app/actions/auth";
import { FormField } from "@/components/ui/FormField";
import { ArrowRight, AlertCircle, Lock } from "lucide-react";

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(
    resetPasswordAction,
    null
  );

  return (
    <div className="card-white p-6 sm:p-8 space-y-6">
      <div className="space-y-1.5 text-center">
        <span className="badge-dark text-[10px] uppercase font-bold">Account Security</span>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#101113]">
          Set a new password
        </h1>
        <p className="text-xs text-[#777D77] font-medium">
          Please enter your new password to regain access to your agency workspace.
        </p>
      </div>

      {state?.error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border-2 border-red-500 text-xs text-red-950 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-red-800 font-medium">{state.error}</p>
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
            className="w-full text-xs font-bold border-2 border-[#101113] rounded-xl p-3 bg-[#F3F4F2] focus:bg-white focus:outline-none text-[#101113]"
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
            className="w-full text-xs font-bold border-2 border-[#101113] rounded-xl p-3 bg-[#F3F4F2] focus:bg-white focus:outline-none text-[#101113]"
            disabled={isPending}
          />
        </FormField>

        <button
          type="submit"
          disabled={isPending}
          className="btn-primary text-xs font-black w-full h-11 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <span>Updating password...</span>
          ) : (
            <>
              <span>Update Password & Sign In</span>
              <ArrowRight className="w-4 h-4 text-[#B7FF3C]" />
            </>
          )}
        </button>
      </form>

      <div className="pt-2 text-center text-xs font-medium text-[#777D77] border-t-2 border-[#DCDDDA]">
        Remember your password?{" "}
        <Link href="/login" className="font-black text-[#101113] hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
