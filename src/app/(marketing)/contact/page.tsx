"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { FormField } from "@/components/ui/FormField";
import { Mail, Phone, MapPin, CheckCircle2, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="py-16 px-4 sm:px-6 max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Get in Touch with Our Team
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Have questions about the Pakistan pilot, custom agency plans, or setup support? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Info */}
        <div className="md:col-span-5 linear-card p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Pilot Headquarters
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Serving digital marketing agencies across Lahore, Karachi, Islamabad, and nationwide.
            </p>
          </div>

          <div className="space-y-4 text-xs text-slate-700">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">Email Enquiries</p>
                <p className="text-slate-500">support@leadrescue.ai</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">WhatsApp Pilot Desk</p>
                <p className="text-slate-500">+92 300 0000000 (Mon–Fri 9am–6pm PKT)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">Offices</p>
                <p className="text-slate-500">Lahore & Islamabad, Pakistan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7 linear-card p-6 sm:p-8">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Message Received</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Thank you for reaching out. A LeadRescue AI team member will follow up via email or WhatsApp within 4 business hours.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-4"
            >
              <FormField label="Full Name" required>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Mahmood"
                  className="input-base w-full"
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Work Email" required>
                  <input
                    type="email"
                    required
                    placeholder="name@agency.pk"
                    className="input-base w-full"
                  />
                </FormField>
                <FormField label="WhatsApp / Phone" required>
                  <input
                    type="tel"
                    required
                    placeholder="+92 3XX XXXXXXX"
                    className="input-base w-full"
                  />
                </FormField>
              </div>

              <FormField label="Agency Name" required>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Performance Media"
                  className="input-base w-full"
                />
              </FormField>

              <FormField label="How can we assist your agency?" required>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us about the number of clients you manage and your current follow-up challenges..."
                  className="input-base w-full h-auto py-2 text-xs"
                />
              </FormField>

              <button
                type="submit"
                className="btn-base bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold w-full shadow-xs"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
