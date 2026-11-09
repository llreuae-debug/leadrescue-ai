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
    <div className="card-white p-6 sm:p-8 space-y-6">
      <div className="space-y-1.5 text-center">
        <span className="badge-lime text-[10px] uppercase font-bold">14-Day Free Pilot</span>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#101113]">
          Start your free trial
        </h1>
        <p className="text-xs text-[#777D77] font-medium">
          Create your agency workspace and begin recovering neglected client leads.
        </p>
      </div>

      {state?.success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-xs text-emerald-950 space-y-2">
          <div className="flex items-center gap-2 font-black text-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Registration Submitted Successfully</span>
          </div>
          <p className="leading-relaxed text-[11px] text-emerald-800 font-medium">
            {state.message}
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 font-black text-emerald-900 hover:underline"
            >
              <span>Proceed to Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {state?.error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border-2 border-red-500 text-xs text-red-950 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5 font-medium">
            <p className="font-bold text-red-900">Registration Issue</p>
            <p className="text-[11px] leading-relaxed text-red-800">{state.error}</p>
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
              className="w-full text-xs font-bold border-2 border-[#101113] rounded-xl p-3 bg-[#F3F4F2] focus:bg-white focus:outline-none text-[#101113]"
              disabled={isPending}
            />
          </FormField>

          <FormField label="Digital Agency Name" required>
            <input
              type="text"
              name="agencyName"
              required
              placeholder="e.g. Apex Digital PK"
              className="w-full text-xs font-bold border-2 border-[#101113] rounded-xl p-3 bg-[#F3F4F2] focus:bg-white focus:outline-none text-[#101113]"
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
              className="w-full text-xs font-bold border-2 border-[#101113] rounded-xl p-3 bg-[#F3F4F2] focus:bg-white focus:outline-none text-[#101113]"
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
              className="w-full text-xs font-bold border-2 border-[#101113] rounded-xl p-3 bg-[#F3F4F2] focus:bg-white focus:outline-none text-[#101113]"
              disabled={isPending}
            />
          </FormField>

          <div className="text-[11px] text-[#777D77] font-medium leading-relaxed">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-[#101113] font-bold underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#101113] font-bold underline">
              Privacy Policy
            </Link>
            . No credit card required.
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="btn-lime text-xs font-black w-full h-11 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <span>Creating your agency workspace...</span>
            ) : (
              <>
                <span>Create Workspace & Start Trial</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      <div className="pt-2 text-center text-xs font-medium text-[#777D77] border-t-2 border-[#DCDDDA]">
        Already registered your agency?{" "}
        <Link href="/login" className="font-black text-[#101113] hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
