"use client";

import React, { useState } from "react";
import { FormField } from "@/components/ui/FormField";
import { Mail, Phone, MapPin, CheckCircle2, ArrowRight } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-16">
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2">
          <span className="badge-lime text-xs font-black uppercase tracking-wider">
            Contact & Support
          </span>
          <span className="text-xs font-bold text-[#777D77]">Pakistani Pilot Desk</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#101113] leading-tight">
          Let’s Make Things Happen
        </h1>
        <p className="text-base sm:text-lg text-[#202320] font-medium leading-relaxed">
          Have questions about the agency pilot, custom WhatsApp setup, or corporate billing? Our team responds within 4 business hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info (Deep Charcoal Card) */}
        <div className="lg:col-span-5 card-charcoal p-8 sm:p-10 space-y-8">
          <div>
            <span className="badge-lime text-[11px] uppercase tracking-wider">
              Pilot Headquarters
            </span>
            <h3 className="text-2xl font-black text-white mt-3">
              Agency Operations Desk
            </h3>
            <p className="text-xs text-[#DCDDDA] mt-2 font-medium leading-relaxed">
              Serving digital marketing agencies across Lahore, Karachi, Islamabad, Dubai, and nationwide.
            </p>
          </div>

          <div className="space-y-6 text-xs text-[#DCDDDA] pt-4 border-t border-[#2A2E33]">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#202327] border border-[#2A2E33] text-[#B7FF3C] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-white text-sm">Email Enquiries</p>
                <p className="text-[#DCDDDA] font-medium mt-0.5">support@leadrescue.ai</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#202327] border border-[#2A2E33] text-[#B7FF3C] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-white text-sm">WhatsApp Pilot Desk</p>
                <p className="text-[#DCDDDA] font-medium mt-0.5">+92 300 0000000 (Mon–Fri 9am–6pm PKT)</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#202327] border border-[#2A2E33] text-[#B7FF3C] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-white text-sm">Regional Offices</p>
                <p className="text-[#DCDDDA] font-medium mt-0.5">Level 4, Tech Innovation Hub, Gulberg III, Lahore, Pakistan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (Crisp White Card) */}
        <div className="lg:col-span-7 card-white p-8 sm:p-12">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#B7FF3C] text-[#101113] border-2 border-[#101113] mx-auto flex items-center justify-center shadow-[0_4px_0_0_#101113]">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h3 className="text-2xl font-black text-[#101113]">Message Received</h3>
              <p className="text-sm text-[#777D77] max-w-sm mx-auto font-medium">
                Thank you for reaching out. A LeadRescue AI team specialist will follow up via email or WhatsApp within 4 business hours.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Your Name" name="name" required>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    placeholder="e.g. Ali Daniyal"
                    className="input-base w-full"
                  />
                </FormField>

                <FormField label="Work Email" name="email" required>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    placeholder="ali@agency.com"
                    className="input-base w-full"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="WhatsApp Number" name="phone" required>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                    placeholder="+92 300 1234567"
                    className="input-base w-full"
                  />
                </FormField>

                <FormField label="Agency Name" name="agency">
                  <input
                    type="text"
                    name="agency"
                    id="agency"
                    placeholder="e.g. HyperScale Media"
                    className="input-base w-full"
                  />
                </FormField>
              </div>

              <FormField label="How can we help your agency?" name="message" required>
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  required
                  placeholder="Tell us about your client lead volume and current follow-up challenges..."
                  className="w-full rounded-xl border-1.5 border-[#DCDDDA] p-3.5 text-sm text-[#202320] focus:border-[#101113] focus:ring-2 focus:ring-[#B7FF3C]/40 outline-none"
                />
              </FormField>

              <div className="pt-2">
                <button
                  type="submit"
                  className="btn-base btn-primary w-full text-xs font-black h-12 shadow-[0_4px_0_0_#101113]"
                >
                  <span>Send Agency Enquiry</span>
                  <ArrowRight className="w-4 h-4 text-[#B7FF3C]" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
