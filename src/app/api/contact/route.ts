import { NextResponse } from "next/server";
import { Resend } from "resend";
import companyjson from "@/data/company.json";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { name, email, message, token } = await request.json();

        // 1. CLOUDFARE VERIFICATION
        const formData = new FormData();
        formData.append("secret", process.env.TURNSTILE_SECRET_KEY!);
        formData.append("response", token);

        const verifyResponse = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
                method: "POST",
                body: formData,
            }
        );

        const outcome = await verifyResponse.json();

        if (!outcome.success) {
            return NextResponse.json(
                { message: "Security protocol failed. Verification denied." },
                { status: 400 }
            );
        }

        // 2. EMAIL TRANSMISSION (Using Resend)
        // Note: On the free tier, you can only send TO the email you signed up with 
        // until you verify your own domain.

        const isDev = process.env.NODE_ENV === 'development';
        const fromAddress = isDev ? "Dev Mode <onboarding@resend.dev>" : "Shashank Seeds <contact@shashankseeds.in>";
        const toAddress = isDev ? ["rahulirajpapu5@gmail.com"] : [companyjson.contactInfo.email];

        const { data, error } = await resend.emails.send({
            from: fromAddress,
            to: toAddress,
            subject:`${isDev ? '[DEV_TEST] ' : ''}NEW ENQUIRY: ${name}`,
            replyTo: email,
            html: `
                <div style="font-family: monospace; border: 1px solid #10b981; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #10b981;">[SYSTEM_NOTIFICATION]: NEW SEED ENQUIRY</h2>
                    <p><strong>Sender:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <hr style="border: 0.5px solid #eee" />
                    <p><strong>Message Payload:</strong></p>
                    <p style="white-space: pre-wrap;">${message}</p>
                    <hr style="border: 0.5px solid #eee" />
                    <p style="font-size: 10px; color: #888;">Security Status: Verified Human (Cloudflare Turnstile)</p>
                </div>
            `,
        });

        if (error) {
            return NextResponse.json({ message: "Email delivery failed." + error.message }, { status: 400 });
        }

        return NextResponse.json({ message: "Data packet transmitted successfully!" });

    } catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}