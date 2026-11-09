import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Target, HeartHandshake, Sparkles, ArrowUpRight } from "lucide-react";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Daniyal Qureshi",
      role: "Founder & Lead Architect",
      bio: "10+ years scaling performance marketing and enterprise software architectures across Pakistan and the UAE.",
    },
    {
      name: "Zainab Fatima",
      role: "Head of AI & NLP",
      bio: "Specialist in multilingual prompt grounding, Urdu semantic fine-tuning, and anti-hallucination guardrails.",
    },
    {
      name: "Bilal Tariq",
      role: "Head of Agency Operations",
      bio: "Ex-media buyer who managed PKR 500M+ in Meta & Google ad spend for top tier regional commerce brands.",
    },
    {
      name: "Maryam Noman",
      role: "Lead Product Designer",
      bio: "Passionate about neo-minimalism, creative agency aesthetics, and high-velocity workflow interfaces.",
    },
  ];

  return (
    <div className="space-y-24 py-16 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2">
          <span className="badge-lime text-xs font-black uppercase tracking-wider">
            Our Mission
          </span>
          <span className="text-xs font-bold text-[#777D77]">Why We Built LeadRescue AI</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#101113] leading-tight">
          Every Lead Deserves a Follow-Up.
        </h1>
        <p className="text-base sm:text-lg text-[#202320] font-medium leading-relaxed">
          LeadRescue AI was created with a clear thesis: most performance agencies fail not from lack of traffic,
          but from catastrophic follow-up leakage.
        </p>
      </div>

      {/* Narrative Card */}
      <div className="card-white p-8 sm:p-14 space-y-6 text-sm text-[#202320] leading-relaxed">
        <h2 className="text-2xl font-black text-[#101113]">The Problem We Set Out to Solve</h2>
        <p className="font-medium text-base text-[#777D77]">
          In fast-moving digital advertising markets like Pakistan and MENA, digital agencies spend enormous effort
          crafting high-converting Meta, TikTok, and Google ad campaigns for clients. Yet when enquiries arrive via WhatsApp or lead forms,
          they get buried across scattered chat groups, private staff phones, or neglected spreadsheets.
        </p>
        <p className="font-medium text-base text-[#777D77]">
          Without disciplined tracking and 15-minute response SLAs, over 40% of leads go cold without a second touchpoint. Clients blame the agency
          for poor lead quality, when in reality, the conversion failure occurred due to neglected follow-ups.
        </p>

        <h2 className="text-2xl font-black text-[#101113] pt-6 border-t-2 border-[#DCDDDA]">Our Core Philosophy</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div className="p-6 rounded-3xl bg-[#F3F4F2] border-2 border-[#101113] space-y-2 shadow-[0_3px_0_0_#101113]">
            <div className="flex items-center gap-2.5 font-black text-[#101113] text-sm">
              <div className="w-8 h-8 rounded-full bg-[#101113] text-[#B7FF3C] flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <span>Specialized, Not Generic</span>
            </div>
            <p className="text-xs text-[#777D77] font-medium leading-relaxed">
              We do not build generic, bloated enterprise CRMs. Every screen exists to enforce lead recovery, WhatsApp velocity, and follow-up accountability.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#F3F4F2] border-2 border-[#101113] space-y-2 shadow-[0_3px_0_0_#101113]">
            <div className="flex items-center gap-2.5 font-black text-[#101113] text-sm">
              <div className="w-8 h-8 rounded-full bg-[#101113] text-[#B7FF3C] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>Grounded AI with Human Consent</span>
            </div>
            <p className="text-xs text-[#777D77] font-medium leading-relaxed">
              AI should draft, recommend, and structure facts — it must never send autonomous messages without human review.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#F3F4F2] border-2 border-[#101113] space-y-2 shadow-[0_3px_0_0_#101113]">
            <div className="flex items-center gap-2.5 font-black text-[#101113] text-sm">
              <div className="w-8 h-8 rounded-full bg-[#101113] text-[#B7FF3C] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>Client Data Isolation</span>
            </div>
            <p className="text-xs text-[#777D77] font-medium leading-relaxed">
              Client workspaces are isolated at the database level with PostgreSQL RLS. Cross-client data leaks are strictly impossible.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#F3F4F2] border-2 border-[#101113] space-y-2 shadow-[0_3px_0_0_#101113]">
            <div className="flex items-center gap-2.5 font-black text-[#101113] text-sm">
              <div className="w-8 h-8 rounded-full bg-[#101113] text-[#B7FF3C] flex items-center justify-center">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <span>Built for Local Realities</span>
            </div>
            <p className="text-xs text-[#777D77] font-medium leading-relaxed">
              Native support for Urdu (RTL), WhatsApp conversational workflows, and direct Pakistani commercial payment methods (IBFT).
            </p>
          </div>
        </div>
      </div>

      {/* Team Cards Section from Reference Image */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-[#101113]">
          <div className="space-y-2">
            <span className="badge-lime text-xs uppercase tracking-wider">Team</span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#101113]">
              Leadership & Engineering
            </h2>
          </div>
          <p className="text-sm font-medium text-[#777D77] max-w-sm">
            Meet the engineers and growth specialists building LeadRescue AI.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, i) => (
            <div
              key={i}
              className="card-white p-6 flex flex-col justify-between min-h-[260px] relative hover:bg-[#F3FDE1] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b-2 border-[#101113]">
                  <div className="w-14 h-14 rounded-2xl bg-[#B7FF3C] border-2 border-[#101113] flex items-center justify-center font-black text-xl text-[#101113] shadow-[0_3px_0_0_#101113]">
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="circle-badge-dark">
                    <ArrowUpRight className="w-5 h-5 text-[#B7FF3C]" />
                  </div>
                </div>

                <h3 className="text-lg font-black text-[#101113] mt-4">
                  {member.name}
                </h3>
                <p className="text-xs font-bold text-[#777D77] mt-0.5">
                  {member.role}
                </p>

                <p className="text-xs text-[#202320] mt-3 font-medium leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pilot CTA */}
      <div className="card-lime p-8 sm:p-14 text-center space-y-6">
        <span className="badge-dark text-xs uppercase tracking-wider">
          Early Access
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-[#101113]">
          Join the LeadRescue AI Pilot
        </h2>
        <p className="text-sm sm:text-base text-[#101113]/90 font-bold max-w-xl mx-auto">
          Equip your agency with the tools to organize, follow up, and double client conversion rates.
        </p>
        <div className="pt-2 flex justify-center">
          <Link
            href="/signup"
            className="btn-base btn-primary text-xs font-black px-8 h-12 shadow-[0_4px_0_0_#101113]"
          >
            <span>Start 14-Day Free Trial</span>
            <ArrowRight className="w-4 h-4 text-[#B7FF3C]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
