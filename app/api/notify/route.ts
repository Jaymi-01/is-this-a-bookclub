import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, whatsapp, age, favoriteGenre } = body;

    // Load Resend configuration directly from environment variables
    const resendApiKey = process.env.RESEND_API_KEY;
    const resendReceiverEmail = process.env.RESEND_RECEIVER_EMAIL;
    const resendSenderEmail = process.env.RESEND_SENDER_EMAIL;

    // Check if configuration exists
    if (!resendApiKey || !resendReceiverEmail || resendApiKey.includes("your_api_key_here")) {
      console.warn("Resend notification skipped: missing or placeholder credentials in process.env");
      return NextResponse.json({ message: "Resend notifications not configured in environment variables" });
    }

    // Get origin to build absolute asset and page links
    const origin = new URL(request.url).origin;
    const logoUrl = `${origin}/logo.png`;
    const adminUrl = `${origin}/admin`;

    const fromEmail = resendSenderEmail || "onboarding@resend.dev";

    // Call Resend REST API
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: `Is This A Bookclub <${fromEmail}>`,
        to: resendReceiverEmail,
        subject: `📚 New Join Request: ${name}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>New Join Request</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #F4F1EA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F4F1EA; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <!-- Logo and Header -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 550px; margin-bottom: 24px;">
                    <tr>
                      <td align="center">
                        <img src="${logoUrl}" alt="Is This A Bookclub" style="height: 48px; max-width: 200px; display: block;" />
                      </td>
                    </tr>
                  </table>

                  <!-- Main Card -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 550px; background-color: #FFFFFF; border: 3px solid #1A1A1A; border-radius: 16px; box-shadow: 4px 4px 0px #1A1A1A; overflow: hidden; border-collapse: separate;">
                    <!-- Card Header Banner -->
                    <tr>
                      <td style="background-color: #F06595; padding: 24px; border-bottom: 3px solid #1A1A1A; text-align: center;">
                        <h1 style="margin: 0; font-family: Georgia, serif; font-size: 24px; font-weight: bold; color: #1A1A1A;">
                          New Join Request!
                        </h1>
                      </td>
                    </tr>

                    <!-- Card Content -->
                    <tr>
                      <td style="padding: 32px 24px;">
                        <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.5; color: #333333;">
                          Hey there! A new reader just requested to join the book club. Here are their details:
                        </p>

                        <!-- Details Box -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF6EE; border: 2px solid #1A1A1A; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                          <tr>
                            <td style="padding: 8px 0; font-size: 13px; font-weight: bold; color: #666666; text-transform: uppercase; letter-spacing: 0.5px; width: 110px;">Name</td>
                            <td style="padding: 8px 0; font-size: 15px; font-weight: bold; color: #1A1A1A;">${name}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-size: 13px; font-weight: bold; color: #666666; text-transform: uppercase; letter-spacing: 0.5px;">Age</td>
                            <td style="padding: 8px 0; font-size: 15px; color: #1A1A1A;">${age} years old</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-size: 13px; font-weight: bold; color: #666666; text-transform: uppercase; letter-spacing: 0.5px;">Email</td>
                            <td style="padding: 8px 0; font-size: 15px; color: #1A1A1A;">
                              <a href="mailto:${email}" style="color: #F06595; font-weight: bold; text-decoration: underline;">${email}</a>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-size: 13px; font-weight: bold; color: #666666; text-transform: uppercase; letter-spacing: 0.5px;">WhatsApp</td>
                            <td style="padding: 8px 0; font-size: 15px; color: #1A1A1A;">
                              <a href="https://wa.me/${whatsapp.replace(/\D/g, "")}" style="color: #25D366; font-weight: bold; text-decoration: underline;">${whatsapp}</a>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-size: 13px; font-weight: bold; color: #666666; text-transform: uppercase; letter-spacing: 0.5px;">Fav Genre</td>
                            <td style="padding: 8px 0; font-size: 15px; color: #1A1A1A; text-transform: capitalize;">${favoriteGenre}</td>
                          </tr>
                        </table>

                        <!-- Action Button -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td align="center">
                              <a href="${adminUrl}" style="display: inline-block; background-color: #1A1A1A; color: #FAF6EE; text-transform: uppercase; font-size: 12px; font-weight: 900; letter-spacing: 1px; text-decoration: none; padding: 14px 28px; border-radius: 8px; border: 2px solid #1A1A1A; box-shadow: 3px 3px 0px #F06595; transition: transform 0.1s;">
                                Manage Submissions
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Card Footer -->
                    <tr>
                      <td style="background-color: #FAF6EE; padding: 16px; border-top: 2px solid #1A1A1A; text-align: center;">
                        <span style="font-size: 10px; font-weight: bold; color: #999999; text-transform: uppercase; letter-spacing: 1px;">
                          Is This A Bookclub Automated Alert System
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      }),
    });

    const resData = await res.json();
    if (!res.ok) {
      console.error("Resend API error:", resData);
      return NextResponse.json({ error: resData.message || "Failed to send email" }, { status: res.status });
    }

    return NextResponse.json({ success: true, messageId: resData.id });
  } catch (error: unknown) {
    const e = error as Error;
    console.error("Notify API Error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
