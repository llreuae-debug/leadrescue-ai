import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  translations,
  formatBilingualPhone,
  formatBilingualCurrency,
} from "../src/lib/i18n/translations.ts";
import type {
  SupportedLanguage,
  TranslationDictionary,
} from "../src/lib/i18n/translations.ts";

describe("Stage 15: Urdu Localization & Accessibility (a11y) Test Suite", () => {
  test("Dictionary Parity: English and Urdu dictionaries contain identical keys", () => {
    const enKeys = Object.keys(translations.en).sort();
    const urKeys = Object.keys(translations.ur).sort();

    assert.deepStrictEqual(enKeys, urKeys, "All English translation keys must have an authentic Urdu equivalent");

    // Ensure no empty or missing translations
    for (const key of enKeys) {
      const enVal = translations.en[key as keyof TranslationDictionary];
      const urVal = translations.ur[key as keyof TranslationDictionary];

      assert.ok(enVal && enVal.trim().length > 0, `English key [${key}] must not be empty`);
      assert.ok(urVal && urVal.trim().length > 0, `Urdu key [${key}] must not be empty`);
    }
  });

  test("Authentic Pakistani Terminology: Uses natural Urdu phrasing for financial and SLA terms", () => {
    assert.strictEqual(translations.ur.brandName, "لیڈ ریسکیو اے آئی");
    assert.strictEqual(translations.ur.tagline, "ہر لیڈ کی فالو اپ ضروری ہے۔");
    assert.strictEqual(translations.ur.currencyPKR, "روپے");
    assert.strictEqual(translations.ur.paymentMethodIBFT, "بینک ٹرانسفر (IBFT)");
    assert.strictEqual(translations.ur.bankMeezan, "میزان بینک لمیٹڈ");
    assert.strictEqual(translations.ur.bankHBL, "حبیب بینک لمیٹڈ (HBL)");
    assert.strictEqual(translations.ur.depositSlipRef, "ٹرانزیکشن ریفرنس نمبر (UTR/RRN)");
    assert.strictEqual(translations.ur.statusWon, "کامیاب سودا");
    assert.strictEqual(translations.ur.statusQualified, "اہل قرار");
  });

  test("Direction Mapping: Maps language codes to correct document directions", () => {
    const getDirection = (lang: SupportedLanguage): "ltr" | "rtl" => {
      return lang === "ur" ? "rtl" : "ltr";
    };

    assert.strictEqual(getDirection("en"), "ltr");
    assert.strictEqual(getDirection("ur"), "rtl");
  });

  test("Bi-directional Phone Formatting: Enforces LTR isolation to prevent reversed digits in RTL", () => {
    const rawPakistaniPhone = "+92 300 1234567";
    const formatted = formatBilingualPhone(rawPakistaniPhone);

    // Must be wrapped in Unicode LTR mark (\u202A) and Pop Directional Formatting (\u202C)
    assert.ok(formatted.startsWith("\u202A"));
    assert.ok(formatted.endsWith("\u202C"));
    assert.ok(formatted.includes("+92 300 1234567"));

    // Handles empty phone gracefully
    assert.strictEqual(formatBilingualPhone(null), "");
    assert.strictEqual(formatBilingualPhone(undefined), "");
    assert.strictEqual(formatBilingualPhone(""), "");
  });

  test("Bi-directional Currency Formatting: Formats currency according to linguistic convention", () => {
    const amount = 6999;
    const formattedEn = formatBilingualCurrency(amount, "en");
    const formattedUr = formatBilingualCurrency(amount, "ur");

    assert.strictEqual(formattedEn, "PKR 6,999");
    assert.strictEqual(formattedUr, "6,999 روپے");
  });

  test("Accessibility Landmarks: Skip to content and language switcher text are defined", () => {
    assert.ok(translations.en.skipToContent.length > 0);
    assert.ok(translations.ur.skipToContent.length > 0);
    assert.strictEqual(translations.ur.skipToContent, "براہ راست مواد پر جائیں");

    assert.ok(translations.en.switchLanguage.length > 0);
    assert.ok(translations.ur.switchLanguage.length > 0);
  });
});
