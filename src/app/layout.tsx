import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeadRescue AI — Every Lead Deserves a Follow-Up",
  description:
    "LeadRescue AI helps digital marketing agencies organise client enquiries, identify neglected leads, and execute timely, personalised follow-ups.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
