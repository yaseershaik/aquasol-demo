import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendEmail, buildOtpEmailHtml } from "@/lib/email";

// OTP memory store
const otpStore = new Map<string, { code: string; expires: number }>();

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const { action, email, otp, newPassword } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Action: Request OTP
    if (action === "request_otp") {
      // Rate limiting: 5 OTP requests per IP per 15 minutes
      const rateCheck = checkRateLimit(`otp:${clientIp}`, { limit: 5, windowMs: 15 * 60 * 1000 });
      if (!rateCheck.success) {
        return NextResponse.json(
          { error: `Too many password reset requests. Please wait ${rateCheck.resetInSeconds} seconds before trying again.` },
          { status: 429 }
        );
      }

      // Check if email exists in Admin or Customer database
      const admin = await prisma.admin.findUnique({ where: { email: cleanEmail } });
      const customer = await prisma.customerUser.findUnique({ where: { email: cleanEmail } });

      let isCustomer = !!customer;
      if (!admin && !customer) {
        // Fallback check to legacy FastAPI
        try {
          const pyRes = await fetch("http://127.0.0.1:8000/api/py/auth/users/admin");
          if (pyRes.ok) {
            const pyData = await pyRes.json();
            isCustomer = (pyData.users || []).some((u: any) => u.email.toLowerCase() === cleanEmail);
          }
        } catch {}
      }

      if (!admin && !isCustomer) {
        return NextResponse.json(
          { error: "No account found with this email address. Please check your spelling or sign up." },
          { status: 404 }
        );
      }

      // Generate 6-digit verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      otpStore.set(cleanEmail, {
        code,
        expires: Date.now() + 15 * 60 * 1000, // 15 mins expiry
      });

      // Send via transactional email
      const recipientName = admin ? admin.name : (customer ? customer.name : "Valued Customer");
      await sendEmail({
        to: cleanEmail,
        subject: "Your AQUASOL Security Verification Code",
        html: buildOtpEmailHtml(code, recipientName),
      });

      return NextResponse.json({
        success: true,
        accountType: admin ? "admin" : "customer",
        message: "A 6-digit security verification code has been dispatched to your email.",
        demoCode: code, // Kept for immediate local testing if no SMTP/API key is configured
      });
    }

    // 2. Action: Verify OTP & Reset Password
    if (action === "reset_password") {
      if (!otp || !newPassword) {
        return NextResponse.json(
          { error: "Security code and new password are required." },
          { status: 400 }
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters in length." },
          { status: 400 }
        );
      }

      const stored = otpStore.get(cleanEmail);
      if (!stored || stored.expires < Date.now() || stored.code !== otp.trim()) {
        return NextResponse.json(
          { error: "Invalid or expired 6-digit security code. Please request a new code." },
          { status: 400 }
        );
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);

      // Check if Admin
      const admin = await prisma.admin.findUnique({ where: { email: cleanEmail } });
      if (admin) {
        await prisma.admin.update({
          where: { email: cleanEmail },
          data: { passwordHash },
        });
        otpStore.delete(cleanEmail);
        return NextResponse.json({
          success: true,
          role: "admin",
          message: "Admin password successfully reset! You can now sign in with your new credentials.",
        });
      }

      // Check if Customer in Prisma
      const customer = await prisma.customerUser.findUnique({ where: { email: cleanEmail } });
      if (customer) {
        await prisma.customerUser.update({
          where: { email: cleanEmail },
          data: { passwordHash },
        });
        otpStore.delete(cleanEmail);
        return NextResponse.json({
          success: true,
          role: "customer",
          message: "Customer account password successfully reset! You can now sign in.",
        });
      }

      // Fallback Customer: update via FastAPI if legacy
      try {
        const pyRes = await fetch("http://127.0.0.1:8000/api/py/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: cleanEmail, new_password: newPassword }),
        });

        if (pyRes.ok) {
          otpStore.delete(cleanEmail);
          return NextResponse.json({
            success: true,
            role: "customer",
            message: "Customer account password successfully reset! You can now sign in.",
          });
        }
      } catch {}

      return NextResponse.json(
        { error: "Failed to update password. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: "Invalid action requested." }, { status: 400 });
  } catch (error: any) {
    console.error("Forgot password API error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
