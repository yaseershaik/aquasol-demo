import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSessionToken, setAdminSessionCookie } from "@/lib/auth";
import { SignJWT } from "jose";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "aquasol_puregrid_master_secure_production_key_2026"
);

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);

    // Rate Limiting: 10 login attempts per IP per 15 minutes
    const rateCheck = checkRateLimit(`login:${clientIp}`, { limit: 10, windowMs: 15 * 60 * 1000 });
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: `Too many login attempts. For security, please wait ${rateCheck.resetInSeconds} seconds before retrying.` },
        { status: 429 }
      );
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Check if the user is an Enterprise Admin
    const admin = await prisma.admin.findUnique({
      where: { email: cleanEmail },
    });

    if (admin) {
      const isValid = await bcrypt.compare(password, admin.passwordHash);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
      }

      // Create Admin Session Token & secure HTTP-only Cookie
      const token = await createSessionToken({
        id: admin.id,
        email: admin.email,
        name: admin.name,
      });

      await setAdminSessionCookie(token);

      return NextResponse.json({
        success: true,
        role: "admin",
        redirectUrl: "/admin",
        access_token: token,
        token_type: "bearer",
        user: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: "admin",
        },
      });
    }

    // 2. Check if the user is a Customer in Prisma
    const customer = await prisma.customerUser.findUnique({
      where: { email: cleanEmail },
    });

    if (customer) {
      if (!customer.isActive) {
        return NextResponse.json({ error: "This account has been deactivated. Please contact support." }, { status: 403 });
      }

      const isCustomerValid = await bcrypt.compare(password, customer.passwordHash);
      if (!isCustomerValid) {
        return NextResponse.json({ error: "Invalid email or password. Please verify your credentials." }, { status: 401 });
      }

      // Generate Customer JWT token
      const token = await new SignJWT({
        id: customer.id,
        email: customer.email,
        name: customer.name,
        role: customer.role,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(JWT_SECRET);

      const userPayload = {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        company_name: customer.companyName,
        gstin: customer.gstin,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,
        role: customer.role,
        is_active: customer.isActive,
        created_at: customer.createdAt.toISOString(),
      };

      const response = NextResponse.json({
        success: true,
        role: "customer",
        redirectUrl: "/account",
        access_token: token,
        token_type: "bearer",
        user: userPayload,
      });

      // Set cookie for browser session persistence
      response.cookies.set("aquasol_user_token", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });

      return response;
    }

    // 3. Fallback: Check legacy FastAPI accounts if running
    try {
      const pyRes = await fetch("http://127.0.0.1:8000/api/py/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      if (pyRes.ok) {
        const pyData = await pyRes.json();
        if (pyData.access_token) {
          return NextResponse.json({
            success: true,
            role: "customer",
            redirectUrl: "/account",
            access_token: pyData.access_token,
            token_type: pyData.token_type || "bearer",
            user: {
              ...pyData.user,
              role: pyData.user?.role || "customer",
            },
          });
        }
      }
    } catch {}

    return NextResponse.json(
      { error: "Invalid email or password. Please verify your credentials." },
      { status: 401 }
    );
  } catch (error) {
    console.error("Unified login error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
