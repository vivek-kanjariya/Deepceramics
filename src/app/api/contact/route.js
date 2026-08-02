import { Resend } from "resend";

export async function POST(req) {
  try {
    const resend = new Resend("re_your_actual_api_key");

    const body = await req.json();

    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "your@email.com",
      subject: "New Contact",
      html: `
        <h2>New Contact Message</h2>
        <p>${body.message}</p>
      `,
    });

    return Response.json(data);

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}