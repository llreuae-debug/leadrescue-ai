import { NextRequest, NextResponse } from "next/server";
import {
  checkIdempotency,
  recordIdempotency,
  validateInboundLeadPayload,
  verifyWebhookSignature,
} from "@/lib/integrations/webhook-validator";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-leadrescue-signature");
    const idempotencyKey = req.headers.get("idempotency-key");
    const webhookSecret = process.env.LEADRESCUE_WEBHOOK_SECRET || "demo-signing-secret-key-2026";

    // 1. Signature Verification (if secret configured or signature provided)
    if (signature) {
      const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid HMAC SHA-256 signature in 'x-leadrescue-signature' header." },
          { status: 401 }
        );
      }
    }

    // 2. Idempotency Check (Prevents duplicate leads on client network retry)
    if (idempotencyKey) {
      const { isReplay, leadId } = checkIdempotency(idempotencyKey);
      if (isReplay) {
        return NextResponse.json(
          {
            success: true,
            isIdempotentReplay: true,
            leadId,
            message: "Idempotent request previously processed. No duplicate lead created.",
          },
          { status: 200 }
        );
      }
    }

    // 3. Payload Parsing & Schema Validation
    let parsedBody: any;
    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Malformed JSON payload in request body." }, { status: 400 });
    }

    const validation = validateInboundLeadPayload(parsedBody);
    if (!validation.valid || !validation.data) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 422 }
      );
    }

    const leadData = validation.data;
    const generatedLeadId = `lead-wh-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    // 4. Persistence
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isPlaceholder = !supabaseUrl || supabaseUrl.includes("placeholder-project");

    if (!isPlaceholder) {
      const supabase = await createClient();
      const { data, error } = await supabase.from("leads").insert({
        client_id: leadData.clientId,
        name: leadData.name,
        phone: leadData.phone,
        email: leadData.email,
        company: leadData.company,
        source: leadData.source || "Website Lead Form",
        campaign: leadData.campaign,
        deal_value: leadData.dealValue || 0,
        notes: leadData.notes,
        status: "new",
        priority: "medium",
      }).select("id").single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      if (idempotencyKey && data?.id) {
        recordIdempotency(idempotencyKey, data.id);
      }

      return NextResponse.json(
        {
          success: true,
          leadId: data?.id,
          message: "Lead successfully ingested and assigned to client workspace.",
        },
        { status: 201 }
      );
    }

    // Demo Mode Response
    if (idempotencyKey) {
      recordIdempotency(idempotencyKey, generatedLeadId);
    }

    return NextResponse.json(
      {
        success: true,
        leadId: generatedLeadId,
        message: "Lead accepted (Demo Workspace Mode).",
        lead: leadData,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

// CORS Preflight handler for website form submissions
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-leadrescue-signature, idempotency-key",
    },
  });
}
