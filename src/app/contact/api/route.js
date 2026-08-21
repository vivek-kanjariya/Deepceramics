// src/app/api/contact/route.js

import { Resend } from "resend";
import sanitizeHtml from "sanitize-html";

// ----- Rate limiting (in-memory) -----
const rateLimitMap = new Map();

// ----- Sanitization -----
const sanitizeInput = (value) => {
  if (!value) return "";
  return sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
};

// ----- Validation -----
const validateForm = ({ name, phone, message }) => {
  const errors = {};

  if (!name || name.length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!phone || !/^[0-9+\-\s()]+$/.test(phone)) {
    errors.phone = "Invalid phone number";
  }

  if (!message || message.length < 10) {
    errors.message = "Message too short";
  }

  return errors;
};

// ----- Email template -----
const emailTemplate = ({ name, phone, message }) => `
  <div>
    <h2>New Inquiry</h2>
    <p><b>Name:</b> ${name}</p>
    <p><b>Phone:</b> ${phone}</p>
    <p><b>Message:</b><br/>${message.replace(/\n/g, "<br/>")}</p>
  </div>
`;

// ----- POST handler -----
export async function POST(req) {
  try {
    // ── Rate limiting ──────────────────────────────────────────
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    const now = Date.now();
    const windowMs = 60_000; // 1 minute
    const maxRequests = 3;

    const record = rateLimitMap.get(ip) ?? { count: 0, start: now };
    if (now - record.start > windowMs) {
      record.count = 0;
      record.start = now;
    }
    record.count++;
    rateLimitMap.set(ip, record);

    if (record.count > maxRequests) {
      return Response.json(
        { success: false, message: "Too many requests" },
        { status: 429 }
      );
    }

    // ── Resend client (moved inside handler) ──────────────────
    const resend = new Resend(process.env.RESEND_API_KEY);

    if (!process.env.RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY");
    }

    // ── Parse & sanitize ──────────────────────────────────────
    const body = await req.json();

    const cleanData = {
      name: sanitizeInput(body.name),
      phone: sanitizeInput(body.phone),
      message: sanitizeInput(body.message),
    };

    const errors = validateForm(cleanData);

    if (Object.keys(errors).length > 0) {
      return Response.json({ success: false, errors }, { status: 400 });
    }

    // ── Send email ────────────────────────────────────────────
    const response = await resend.emails.send({
      from: "Deep Trading <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL,
      subject: `New Inquiry from ${cleanData.name}`,
      replyTo: process.env.CONTACT_EMAIL,
      html: emailTemplate(cleanData),
    });

    return Response.json({
      success: true,
      id: response.data?.id,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}