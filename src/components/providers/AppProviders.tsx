"use client";

import React from "react";
import { LanguageProvider, useLanguage } from "@/lib/i18n/context";

function SkipToContentLink() {
  const { t } = useLanguage();
  return (
    <a href="#main-content" className="skip-link">
      {t("skipToContent")}
    </a>
  );
}

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <LanguageProvider>
      <SkipToContentLink />
      {children}
    </LanguageProvider>
  );
};
