import { Resend } from "resend";
import sanitizeHtml from "sanitize-html";

// SANITIZE
const sanitizeInput = (value) => {
  if (!value) return "";
  return sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
};

// VALIDATION
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

// EMAIL TEMPLATE
const emailTemplate = ({ name, phone, message }) => `
  <div>
    <h2>New Inquiry</h2>
    <p><b>Name:</b> ${name}</p>
    <p><b>Phone:</b> ${phone}</p>
    <p><b>Message:</b><br/>${message.replace(/\n/g, "<br/>")}</p>
  </div>
`;

// POST HANDLER
export async function POST(req) {
  try {
    // MOVE INSIDE HANDLER (THIS IS THE FIX)
    const resend = new Resend(process.env.RESEND_API_KEY);

    if (!process.env.RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY");
    }

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