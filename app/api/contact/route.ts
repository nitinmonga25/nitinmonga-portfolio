import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, service, budget, message } = await req.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // TODO: replace with Nodemailer / Resend when SMTP credentials are set up
    // For now, log the submission server-side and store in DB when Prisma is configured
    console.log("[Contact Form]", { name, email, service, budget, message });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Contact API]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
