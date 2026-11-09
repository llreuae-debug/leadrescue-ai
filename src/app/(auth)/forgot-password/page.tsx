"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { forgotPasswordAction, AuthActionResult } from "@/app/actions/auth";
import { FormField } from "@/components/ui/FormField";
import { ArrowLeft, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(
    forgotPasswordAction,
    null
  );

  return (
    <div className="card-white p-6 sm:p-8 space-y-6">
      <div className="space-y-1.5 text-center">
        <span className="badge-dark text-[10px] uppercase font-bold">Password Recovery</span>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#101113]">
          Reset your password
        </h1>
        <p className="text-xs text-[#777D77] font-medium">
          Enter your registered email and we will send you a secure recovery link.
        </p>
      </div>

      {state?.success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-xs text-emerald-950 space-y-2">
          <div className="flex items-center gap-2 font-black text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Reset Link Dispatched</span>
          </div>
          <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
            {state.message}
          </p>
        </div>
      )}

      {state?.error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border-2 border-red-500 text-xs text-red-950 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-red-800 font-medium">{state.error}</p>
        </div>
      )}

      {!state?.success && (
        <form action={formAction} className="space-y-4">
          <FormField label="Registered Business Email" required>
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

          <button
            type="submit"
            disabled={isPending}
            className="btn-primary text-xs font-black w-full h-11 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <span>Sending reset link...</span>
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4 text-[#B7FF3C]" />
              </>
            )}
          </button>
        </form>
      )}

      <div className="pt-2 text-center text-xs font-medium text-[#777D77] border-t-2 border-[#DCDDDA]">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 font-black text-[#101113] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to login</span>
        </Link>
      </div>
    </div>
  );
}
