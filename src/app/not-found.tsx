import Link from "next/link";
import { ArrowLeft, Home, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F3F4F2] flex flex-col items-center justify-center p-6 text-center">
      <div className="card-white max-w-lg w-full p-8 sm:p-12 space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-[#17191C] text-[#B7FF3C] flex items-center justify-center mx-auto border-2 border-[#101113] shadow-xs">
          <span className="font-black text-2xl font-mono">404</span>
        </div>

        <div className="space-y-2">
          <span className="badge-lime text-[11px] font-bold">Page Not Found</span>
          <h1 className="text-3xl font-black text-[#101113] tracking-tight">
            Lost Opportunity?
          </h1>
          <p className="text-xs sm:text-sm text-[#777D77] font-medium leading-relaxed">
            The route or resource you are looking for has been moved or doesn&apos;t exist.
            Every lead deserves a follow-up, but this page could not be found.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="btn-lime text-xs px-6 py-3 w-full sm:w-auto inline-flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            href="/app/dashboard"
            className="btn-secondary text-xs px-6 py-3 w-full sm:w-auto inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
