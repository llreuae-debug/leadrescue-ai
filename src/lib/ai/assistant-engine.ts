import type {
  AssistantIntent,
  AssistantLanguage,
  AssistantResponse,
  AssistantTone,
  LeadContextSnapshot,
  ObjectionCategory,
} from "../../types/ai-assistant.ts";

/**
 * Sanitizes untrusted user inputs (such as lead notes or custom prompts)
 * against prompt injection, control characters, and directive overrides.
 */
export function sanitizeUntrustedInput(input?: string | null): string {
  if (!input) return "";

  // Remove control characters and non-printable bytes
  let sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // Defuse known prompt injection markers and directive overrides
  const injectionPatterns = [
    /system\s*override/gi,
    /ignore\s+(all\s+)?(previous|prior)\s+instructions/gi,
    /disregard\s+(all\s+)?guidelines/gi,
    /you\s+are\s+now\s+(a|an)/gi,
    /jailbreak/gi,
    /system\s*prompt/gi,
  ];

  for (const pattern of injectionPatterns) {
    sanitized = sanitized.replace(pattern, "[BLOCKED_DIRECTIVE]");
  }

  return sanitized.trim();
}

/**
 * Extracts verifiable database facts from the lead context.
 */
export function extractGroundedFacts(lead: LeadContextSnapshot): string[] {
  const facts: string[] = [];

  facts.push(`Lead Name: ${lead.name}`);
  facts.push(`Client Workspace: ${lead.clientName}`);
  if (lead.clientIndustry) facts.push(`Industry: ${lead.clientIndustry}`);
  facts.push(`Pipeline Status: ${lead.status.replace(/_/g, " ").toUpperCase()}`);
  facts.push(`Priority: ${lead.priority.toUpperCase()}`);
  facts.push(`Inbound Source: ${lead.source}`);
  if (lead.campaign) facts.push(`Campaign: ${lead.campaign}`);

  if (lead.dealValue > 0) {
    facts.push(`Estimated Deal Value: PKR ${lead.dealValue.toLocaleString()}`);
  } else {
    facts.push(`Deal Value: Not specified (PKR 0)`);
  }

  if (lead.phone) facts.push(`Phone: ${lead.phone}`);
  if (lead.email) facts.push(`Email: ${lead.email}`);
  if (lead.company) facts.push(`Company: ${lead.company}`);

  if (lead.lastContactedAt) {
    facts.push(`Last Contacted: ${new Date(lead.lastContactedAt).toLocaleDateString("en-GB")}`);
  } else {
    facts.push(`Last Contacted: Never contacted`);
  }

  if (lead.pendingTasks.length > 0) {
    facts.push(`Pending Follow-ups: ${lead.pendingTasks.length} task(s) active`);
  }

  if (lead.activities.length > 0) {
    facts.push(`Recorded Activity Touchpoints: ${lead.activities.length} event(s)`);
  }

  return facts;
}

/**
 * Identifies crucial missing information to prevent false assumptions.
 */
export function identifyMissingInformation(lead: LeadContextSnapshot): string[] {
  const missing: string[] = [];

  if (!lead.email) missing.push("Email address not recorded");
  if (!lead.phone) missing.push("Phone number missing for direct WhatsApp/call");
  if (!lead.company) missing.push("Company name / business entity not specified");
  if (lead.dealValue === 0) missing.push("Budget / Expected deal value not confirmed");
  if (!lead.notes || lead.notes.trim() === "") missing.push("No qualitative notes or conversation pain points logged");
  if (!lead.lastContactedAt) missing.push("Initial outreach has not yet occurred");

  return missing;
}

/**
 * Formats tone guidance for synthesized copy.
 */
function getTonePrefix(tone: AssistantTone, lang: AssistantLanguage): string {
  if (lang === "ur") {
    switch (tone) {
      case "friendly":
        return "دوستانہ اور خوش اخلاق انداز:";
      case "concise":
        return "مختصر اور جامع انداز:";
      case "professional":
      default:
        return "پیشہ ورانہ اور باوقار انداز:";
    }
  }

  switch (tone) {
    case "friendly":
      return "Warm & Approachable Tone:";
    case "concise":
      return "Direct & Action-Oriented Tone:";
    case "professional":
    default:
      return "Professional & Consultative Tone:";
  }
}

/**
 * Generates an English response strictly bounded by grounded lead context.
 */
function generateEnglishResponse(
  intent: AssistantIntent,
  tone: AssistantTone,
  lead: LeadContextSnapshot,
  customPrompt?: string,
  objectionType?: ObjectionCategory
): { content: string; nextSteps: string[] } {
  const sanitizedNotes = sanitizeUntrustedInput(lead.notes);
  const leadGreeting = lead.name.split(" ")[0] || lead.name;
  const companyRef = lead.company ? ` at ${lead.company}` : "";

  switch (intent) {
    case "summarize_history": {
      const activitySummary =
        lead.activities.length > 0
          ? lead.activities
              .slice(0, 3)
              .map((a) => `• ${a.action} (${new Date(a.timestamp).toLocaleDateString("en-GB")})`)
              .join("\n")
          : "• No previous interactions logged.";

      const pendingSummary =
        lead.pendingTasks.length > 0
          ? lead.pendingTasks.map((t) => `• ${t.taskType.toUpperCase()} scheduled for ${new Date(t.dueAt).toLocaleDateString("en-GB")}`).join("\n")
          : "• No pending follow-up tasks currently scheduled.";

      const content = `### Lead History Summary: ${lead.name}${companyRef}
**Client Workspace:** ${lead.clientName}
**Current Stage:** ${lead.status.replace(/_/g, " ").toUpperCase()} | **Priority:** ${lead.priority.toUpperCase()}
**Inbound Source:** ${lead.source}${lead.campaign ? ` (Campaign: ${lead.campaign})` : ""}
**Estimated Value:** ${lead.dealValue > 0 ? `PKR ${lead.dealValue.toLocaleString()}` : "Budget Unverified"}

#### Recorded Touchpoints
${activitySummary}

#### Scheduled Follow-ups
${pendingSummary}

#### Qualitative Notes from File
${sanitizedNotes ? `"${sanitizedNotes}"` : "_No qualitative notes recorded yet._"}`;

      const nextSteps = [
        lead.status === "new" ? "Reach out via WhatsApp or Phone within SLA window" : "Review pending tasks and log outcome",
        lead.dealValue === 0 ? "Qualify project budget and scope" : "Verify decision maker timeline",
      ];

      return { content, nextSteps };
    }

    case "draft_whatsapp": {
      let message = "";
      if (tone === "concise") {
        message = `Hi ${leadGreeting}, reaching out from ${lead.clientName} regarding your recent inquiry via ${lead.source}. Do you have 2 minutes for a quick chat today? Let me know when suits you.`;
      } else if (tone === "friendly") {
        message = `Hello ${leadGreeting}! 😊 Hope your week is going great. We noticed your inquiry for ${lead.clientName} through ${lead.source} and wanted to personally connect. Would you be open to a quick 5-minute WhatsApp call or message exchange to see how we can assist? Looking forward to hearing from you!`;
      } else {
        // professional
        message = `Assalam-o-Alaikum ${leadGreeting}, I hope this message finds you well. I am following up on your inquiry with ${lead.clientName} via ${lead.source}. We would be glad to share more details and understand your specific requirements. Could you please let us know a convenient time for a brief discussion? Thank you.`;
      }

      const content = `### Recommended WhatsApp Follow-up Draft
${getTonePrefix(tone, "en")}

> ${message}

*Note: Clean phone number on file: ${lead.phone || "Not recorded (add before sending)"}*`;

      const nextSteps = [
        "Review draft copy above and modify with any specific prospect details",
        "Click 'Open in WhatsApp' to launch official chat dialog",
        "Log interaction outcome in Activity log after sending",
      ];

      return { content, nextSteps };
    }

    case "draft_email": {
      let subject = `Following up regarding your ${lead.clientName} inquiry`;
      let body = "";

      if (tone === "concise") {
        body = `Hi ${leadGreeting},\n\nFollowing up on your inquiry with ${lead.clientName} via ${lead.source}.\n\nWhen would be a good time this week for a brief 10-minute introductory call to explore how we can support your goals?\n\nBest regards,\n[Your Name]\n${lead.clientName}`;
      } else if (tone === "friendly") {
        body = `Dear ${leadGreeting},\n\nI hope you're having a wonderful week!\n\nThank you for reaching out to ${lead.clientName} through ${lead.source}. We're excited to learn more about your objectives${companyRef} and explore how we can deliver the best results for you.\n\nCould we schedule a quick call or would you prefer a brief proposal overview sent right here?\n\nWarm regards,\n[Your Name]\n${lead.clientName}`;
      } else {
        body = `Dear ${leadGreeting},\n\nI hope this email finds you well.\n\nI am reaching out regarding your recent inquiry concerning ${lead.clientName} services. We have helped numerous organizations in the ${lead.clientIndustry || "relevant"} space achieve measurable growth.\n\nI would welcome the opportunity to discuss your specific requirements and demonstrate how our team can assist. Please let me know if you are available for a brief conversation this Wednesday or Thursday.\n\nSincerely,\n[Your Name]\n${lead.clientName}`;
      }

      const content = `### Email Outreach Draft
**Recipient:** ${lead.email || "[Missing Email Address — Please verify]"}
**Subject:** ${subject}

\`\`\`text
${body}
\`\`\``;

      const nextSteps = [
        "Copy template to your corporate email client",
        "Replace '[Your Name]' placeholder with your account identity",
        "Schedule follow-up task for 48 hours if no response is received",
      ];

      return { content, nextSteps };
    }

    case "suggest_questions": {
      const industry = lead.clientIndustry || "business";
      const content = `### Grounded Discovery & Qualification Questions
Tailored for **${lead.name}** (${lead.clientName} — ${industry}):

1. **Timeline & Urgency:**
   - *"What is your expected timeline to launch or resolve this campaign requirement?"*
2. **Current Solution & Frustrations:**
   - *"What marketing or lead generation channels are you currently testing, and where are you experiencing the biggest bottlenecks?"*
3. **Decision & Authority:**
   - *"Besides yourself, who else will be involved in evaluating this proposal and making the final sign-off?"*
4. **Budget Alignment:**
   - *"Have you allocated a monthly budget for this initiative (e.g. within our standard range of PKR 50,000 to 200,000+)?"*
5. **Success Metrics:**
   - *"What would constitute an outstanding outcome for your team over the next 90 days?"*`;

      const nextSteps = [
        "Use 2 of these questions during your initial phone or WhatsApp qualification call",
        "Log the budget and timeline directly into the Lead Profile notes",
      ];

      return { content, nextSteps };
    }

    case "suggest_next_action": {
      let recommendation = "";
      if (lead.status === "new") {
        recommendation = `The lead is currently in **NEW** stage without any verified contact logged. The SLA benchmark for inbound leads is under 15 minutes. Initiate a WhatsApp or phone touchpoint immediately.`;
      } else if (lead.status === "contacted") {
        recommendation = `Contact has been established. Next best action is scheduling a structured 15-minute qualification call to clarify budget and move stage to **QUALIFIED**.`;
      } else if (lead.status === "follow_up_required") {
        recommendation = `Lead has requested follow-up. Check pending tasks and send personalized check-in addressing their previously raised inquiries.`;
      } else if (lead.status === "proposal_sent") {
        recommendation = `Proposal has been delivered. Initiate decision-check call or WhatsApp touchpoint to address questions before the proposal expires.`;
      } else {
        recommendation = `Review lead engagement history and ensure next scheduled task date is populated.`;
      }

      const content = `### Recommended Next-Best Action for ${lead.name}
**Priority:** ${lead.priority.toUpperCase()}
**Status:** ${lead.status.replace(/_/g, " ").toUpperCase()}

${recommendation}

#### Suggested Operational Check:
- Verify if phone number has WhatsApp active.
- Confirm if lead profile contains valid deal value.`;

      const nextSteps = [
        "Execute the recommended outreach action",
        "Update lead status once prospect responds",
      ];

      return { content, nextSteps };
    }

    case "handle_objection": {
      let objectionHeading = "General Objection";
      let objectionRebuttal = "";

      if (objectionType === "price_too_high") {
        objectionHeading = "Price / Budget Sensitivity";
        objectionRebuttal = `"I completely understand budget considerations, ${leadGreeting}. When clients evaluate our pricing with ${lead.clientName}, it's usually because they've seen cheaper alternatives deliver zero qualified inquiries. We focus on recovered leads that directly generate revenue. Would it help to start with our core starter phase to prove return on investment before scaling?"`;
      } else if (objectionType === "send_proposal_first") {
        objectionHeading = "Requesting Proposal Before Qualification";
        objectionRebuttal = `"I would be glad to share a proposal, ${leadGreeting}! However, because we customize our campaigns to your exact target audience and budget, a 5-minute call will ensure we don't send you a generic document that misses your goals. Can we do a quick call at 3 PM today or 11 AM tomorrow?"`;
      } else if (objectionType === "already_bought") {
        objectionHeading = "Already Working with Another Vendor";
        objectionRebuttal = `"That's great to hear that you are already actively investing in this area, ${leadGreeting}. Many of our happiest clients came to ${lead.clientName} after experiencing slow lead follow-ups or low closing rates with other vendors. May I stay in touch with an occasional industry insight, in case you need a second opinion down the line?"`;
      } else if (objectionType === "need_partner_approval") {
        objectionHeading = "Requires Business Partner / Director Approval";
        objectionRebuttal = `"That makes complete sense, ${leadGreeting}. To make it as easy as possible for you to present this to your partner, would it be helpful if I prepared a 1-page summary highlighting ROI, deliverables, and timelines so you have all the facts readily available?"`;
      } else {
        objectionHeading = "Timing / Follow Up Next Month";
        objectionRebuttal = `"Understood, ${leadGreeting}. Timing is key to getting the best results. What will have changed between now and next month? Let's tentatively set a reminder for the 1st of next month, and in the meantime, I'll send over a relevant case study."`;
      }

      const content = `### Grounded Objection Handling: ${objectionHeading}
**Lead:** ${lead.name} (${lead.clientName})

#### Suggested Response:
> ${objectionRebuttal}

#### Sales Guidance:
- Acknowledge their concern first without becoming defensive.
- Re-anchor value around lost opportunities rather than raw costs.
- Secure a concrete follow-up date rather than an open-ended "later".`;

      const nextSteps = [
        "Use this response script on your next call or message",
        "Set a follow-up task with the agreed rescheduled date",
      ];

      return { content, nextSteps };
    }

    case "custom_prompt":
    default: {
      const sanitizedPrompt = sanitizeUntrustedInput(customPrompt) || "Analyze this lead and suggest next steps.";
      const content = `### Response to Custom Query
**Prompt:** "${sanitizedPrompt}"

Based strictly on the verified records for **${lead.name}** in client workspace **${lead.clientName}**:
- **Current Stage:** ${lead.status.replace(/_/g, " ").toUpperCase()}
- **Priority:** ${lead.priority.toUpperCase()}
- **Recorded Phone:** ${lead.phone || "Not on file"}
- **Deal Value:** ${lead.dealValue > 0 ? `PKR ${lead.dealValue.toLocaleString()}` : "Not logged"}
- **Last Touchpoint:** ${lead.lastContactedAt ? new Date(lead.lastContactedAt).toLocaleDateString("en-GB") : "None"}

**Evaluation:**
The prospect entered via ${lead.source}${lead.campaign ? ` under campaign "${lead.campaign}"` : ""}. To advance this opportunity effectively, contact should be prioritized using the verified contact coordinates.`;

      const nextSteps = ["Verify next follow-up task is scheduled", "Update lead notes with recent conversation details"];
      return { content, nextSteps };
    }
  }
}

/**
 * Generates an authentic Urdu response strictly bounded by grounded lead context.
 * Uses natural Pakistani business Urdu phrasing and RTL Nastaliq conventions.
 */
function generateUrduResponse(
  intent: AssistantIntent,
  tone: AssistantTone,
  lead: LeadContextSnapshot,
  customPrompt?: string,
  objectionType?: ObjectionCategory
): { content: string; nextSteps: string[] } {
  const sanitizedNotes = sanitizeUntrustedInput(lead.notes);
  const leadGreeting = lead.name.split(" ")[0] || lead.name;
  const companyRef = lead.company ? ` (${lead.company})` : "";

  switch (intent) {
    case "summarize_history": {
      const content = `### لیڈ ہسٹری کا خلاصہ: ${lead.name}${companyRef}
**کلائنٹ ورک اسپیس:** ${lead.clientName}
**موجودہ مرحلہ:** ${lead.status} | **ترجیح:** ${lead.priority}
**آمد کا ذریعہ:** ${lead.source}${lead.campaign ? ` (مہم: ${lead.campaign})` : ""}
**متوقع ڈیل ویلیو:** ${lead.dealValue > 0 ? `${lead.dealValue.toLocaleString()} روپے` : "بجٹ درج نہیں"}

#### سابقہ سرگرمیاں اور رابطے:
${lead.activities.length > 0 ? lead.activities.slice(0, 3).map((a) => `• ${a.action}`).join("\n") : "• کوئی سابقہ سرگرمی ریکارڈ میں نہیں ہے۔"}

#### متوقع ٹاسکس:
${lead.pendingTasks.length > 0 ? `• کل ${lead.pendingTasks.length} فالو اپ ٹاسکس زیر التواء ہیں۔` : "• اس وقت کوئی ٹاسک شیڈول نہیں ہے۔"}

#### لیڈ کے نوٹس:
${sanitizedNotes ? `"${sanitizedNotes}"` : "_کوئی اضافی نوٹس درج نہیں ہیں۔_"}`;

      const nextSteps = [
        "واٹس ایپ یا فون کال کے ذریعے فوری رابطہ کریں",
        "لیڈ کے بجٹ اور حتمی تاریخ کی تصدیق کریں",
      ];

      return { content, nextSteps };
    }

    case "draft_whatsapp": {
      let message = "";
      if (tone === "concise") {
        message = `السلام علیکم ${leadGreeting} صاحب، ${lead.clientName} کی جانب سے آپ کی انکوائری کے سلسلے میں رابطہ کیا ہے۔ کیا آج بات چیت کے لیے دو منٹ مل سکتے ہیں؟ شکریہ۔`;
      } else if (tone === "friendly") {
        message = `السلام علیکم ${leadGreeting}! امید ہے آپ خیریت سے ہوں گے۔ ${lead.clientName} سے متعلق آپ کی انکوائری موصول ہوئی تھی۔ کیا ہم واٹس ایپ پر مختصر گفتگو کر سکتے ہیں تاکہ آپ کی ضروریات کے مطابق رہنمائی کی جا سکے؟ آپ کے جواب کا انتظار رہے گا۔`;
      } else {
        message = `السلام علیکم ${leadGreeting} صاحب، امید ہے آپ بخیر و عافیت ہوں گے۔ میں ${lead.clientName} کی جانب سے آپ کی موصول شدہ انکوائری کے حوالے سے رابطہ کر رہا ہوں۔ ہم آپ کے بزنس کے لیے بہترین حل پیش کرنے کے خواہشمند ہیں۔ برائے مہربانی گفتگو کے لیے کوئی مناسب وقت مطلع فرما دیں۔ جزاک اللہ۔`;
      }

      const content = `### تجویز کردہ واٹس ایپ میسج ڈرافٹ (اردو)
${getTonePrefix(tone, "ur")}

> ${message}

*نوٹ: ریکارڈ شدہ فون نمبر: ${lead.phone || "موجود نہیں ہے"}*`;

      const nextSteps = [
        "ڈرافٹ کا جائزہ لیں اور ضرورت کے مطابق ترمیم کریں",
        "'واٹس ایپ پر کھولیں' بٹن پر کلک کر کے محفوظ طور پر میسج بھیجیں",
        "رابطے کے بعد لیڈ ایکٹیویٹی میں اندراج کریں",
      ];

      return { content, nextSteps };
    }

    case "draft_email": {
      const subject = `${lead.clientName} کی سروسز سے متعلق انکوائری`;
      let body = `محترم ${leadGreeting} صاحب،\n\nالسلام علیکم ورحمۃ اللہ،\n\nامید ہے آپ خیریت سے ہوں گے۔ ${lead.clientName} کی سروسز میں آپ کی دلچسپی کا بہت شکریہ۔\n\nہم آپ کے پروجیکٹ کی تفصیلات اور اہداف کو سمجھنے کے لیے آپ کے ساتھ ایک مختصر فون کال کرنا چاہتے ہیں۔ برائے مہربانی مطلع فرمائیں کہ اس ہفتے کون سا دن اور وقت آپ کے لیے زیادہ مناسب رہے گا؟\n\nنیک تمناؤں کے ساتھ،\n[آپ کا نام]\n${lead.clientName}`;

      const content = `### ای میل آؤٹ ریچ ڈرافٹ (اردو)
**وصول کنندہ:** ${lead.email || "[ای میل ریکارڈ میں موجود نہیں ہے]"}
**موضوع:** ${subject}

\`\`\`text
${body}
\`\`\``;

      const nextSteps = [
        "ای میل مواد کو کاپی کر کے اپنے ای میل کلائنٹ میں پیسٹ کریں",
        "[آپ کا نام] کی جگہ اپنا نام لکھیں",
        "48 گھنٹے تک جواب نہ آنے کی صورت میں فالو اپ ٹاسک بنائیں",
      ];

      return { content, nextSteps };
    }

    case "suggest_questions": {
      const content = `### کوالیفیکیشن اور ڈسکوری سوالات (اردو)
برائے **${lead.name}** (${lead.clientName}):

1. **ٹائم فریم:** *"آپ اس سروس یا مہم کو کب تک شروع کرنے کا ارادہ رکھتے ہیں؟"*
2. **بجٹ اور لاگت:** *"کیا آپ نے اس پروجیکٹ کے لیے کوئی ماہانہ بجٹ مختص کیا ہے؟"*
3. **فیصلہ سازی:** *"کیا اس فیصلے میں آپ کے علاوہ کوئی بزنس پارٹنر یا ڈائریکٹر بھی شامل ہیں؟"*
4. **موجودہ مسائل:** *"اس وقت آپ کو لیڈز اور سیلز میں سب سے بڑی رکاوٹ کیا پیش آ رہی ہے؟"*`;

      const nextSteps = [
        "گفتگو کے دوران ان سوالات کے ذریعے معلومات حاصل کریں",
        "معلومات ملنے پر لیڈ پروفائل کو اپ ڈیٹ کریں",
      ];

      return { content, nextSteps };
    }

    case "handle_objection": {
      let objectionHeading = "اعتراض کا ازالہ";
      let rebuttal = "";

      if (objectionType === "price_too_high") {
        objectionHeading = "قیمت زیادہ ہونے کا اعتراض";
        rebuttal = `"میں آپ کی بات بالکل سمجھتا ہوں ${leadGreeting} صاحب۔ ہمارا مقصد سستی سروس دینے کے بجائے ایسی کوالٹی لیڈز فراہم کرنا ہے جو حقیقت میں سیلز میں تبدیل ہوں اور آپ کا منافع بڑھائیں۔ کیا ہم بنیادی پیکج سے شروعات کر کے نتائج کا جائزہ لے سکتے ہیں؟"`;
      } else if (objectionType === "send_proposal_first") {
        objectionHeading = "کال سے قبل پروپوزل مانگنا";
        rebuttal = `"جی بالکل، ہم پروپوزل ضرور بھیجیں گے۔ لیکن چونکہ ہم ہر کلائنٹ کی ضروریات کے مطابق کوٹیشن بناتے ہیں، اس لیے صرف 5 منٹ کی فون کال پر آپ کے تقاضے سمجھنا ضروری ہے تاکہ غیر ضروری تجاویز سے بچا جا سکے۔ کیا آج سہ پہر 4 بجے بات ہو سکتی ہے؟"`;
      } else {
        objectionHeading = "بعد میں رابطہ کرنے کا کہنا";
        rebuttal = `"بہت بہتر ${leadGreeting} صاحب۔ وقت کا درست تعین کامیابی کی ضمانت ہے۔ ہم اگلے ماہ کی پہلی تاریخ کو آپ سے دوبارہ رابطہ کریں گے۔ اس دوران اگر کوئی سوال ہو تو ہم حاضر ہیں۔"`;
      }

      const content = `### اعتراض کا باوقار جواب: ${objectionHeading}
**لیڈ:** ${lead.name} (${lead.clientName})

> ${rebuttal}

#### رہنما اصول:
- کسٹمر کے خدشات کو تسلیم کریں اور احترام سے بات کریں۔
- گفتگو کو قیمت کے بجائے کاروباری فائدے کی طرف موڑیں۔`;

      const nextSteps = [
        "اس جواب کو گفتگو میں اعتماد کے ساتھ استعمال کریں",
        "فالو اپ کی اگلی تاریخ سسٹم میں محفوظ کریں",
      ];

      return { content, nextSteps };
    }

    case "suggest_next_action":
    case "custom_prompt":
    default: {
      const content = `### تجویز کردہ لائحہ عمل برائے ${lead.name}
**کلائنٹ:** ${lead.clientName}
**موجودہ صورتحال:** ${lead.status}

لیڈ کی معلومات کے مطابق فوری طور پر واٹس ایپ یا کال کے ذریعے رابطہ کرنا سب سے مفید رہے گا۔ ریکارڈ کے مطابق ${lead.phone ? `فون نمبر (${lead.phone}) دستیاب ہے` : "فون نمبر موجود نہیں ہے"}۔`;

      const nextSteps = ["فوری رابطہ قائم کریں", "نتائج کو فالو اپ لاگ میں درج کریں"];
      return { content, nextSteps };
    }
  }
}

/**
 * Main grounded generation engine.
 * Pure function: Deterministic, safe, verified data boundaries.
 */
export function generateAssistantResponse(params: {
  lead: LeadContextSnapshot;
  intent: AssistantIntent;
  language: AssistantLanguage;
  tone: AssistantTone;
  customPrompt?: string;
  objectionType?: ObjectionCategory;
}): AssistantResponse {
  const { lead, intent, language, tone, customPrompt, objectionType } = params;

  const groundedFacts = extractGroundedFacts(lead);
  const missingFacts = identifyMissingInformation(lead);

  let result: { content: string; nextSteps: string[] };

  if (language === "ur") {
    result = generateUrduResponse(intent, tone, lead, customPrompt, objectionType);
  } else {
    result = generateEnglishResponse(intent, tone, lead, customPrompt, objectionType);
  }

  return {
    id: `asst-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    intent,
    language,
    tone,
    content: result.content,
    groundedFacts,
    missingFacts,
    suggestedNextSteps: result.nextSteps,
    requiresHumanReview: true,
    generatedAt: new Date().toISOString(),
    leadId: lead.id,
    leadName: lead.name,
  };
}
