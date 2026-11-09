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
    <div className="linear-card p-6 sm:p-8 space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Reset your password
        </h1>
        <p className="text-xs text-slate-500">
          Enter your registered email and we will send you a secure recovery link.
        </p>
      </div>

      {state?.success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Reset Link Dispatched</span>
          </div>
          <p className="text-[11px] text-emerald-700 leading-relaxed">
            {state.message}
          </p>
        </div>
      )}

      {state?.error && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">{state.error}</p>
        </div>
      )}

      {!state?.success && (
        <form action={formAction} className="space-y-4">
          <FormField label="Registered Email" required>
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

          <button
            type="submit"
            disabled={isPending}
            className="btn-base bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold w-full shadow-xs disabled:opacity-50 h-10"
          >
            {isPending ? (
              <span>Sending reset link...</span>
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>
      )}

      <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
        <Link
          href="/login"
          className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to login</span>
        </Link>
      </div>
    </div>
  );
}
