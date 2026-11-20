import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "aquasol_puregrid_master_secure_production_key_2026"
);

export async function POST(req: Request) {
  try {
    // Anti-abuse rate limiting: 10 registrations per IP per hour
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(`register:${clientIp}`, { limit: 10, windowMs: 60 * 60 * 1000 });
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: `Too many sign-up attempts. Please wait ${rateCheck.resetInSeconds} seconds before trying again.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, phone, password, company_name, gstin, address, city, state, pincode } = body;

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: "Name, email, mobile number, and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone.trim().replace(/\D/g, "");

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Check if email already registered in CustomerUser or Admin
    const existingCustomer = await prisma.customerUser.findUnique({
      where: { email: cleanEmail },
    });

    if (existingCustomer) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please sign in." },
        { status: 409 }
      );
    }

    const existingAdmin = await prisma.admin.findUnique({
      where: { email: cleanEmail },
    });
    if (existingAdmin) {
      return NextResponse.json(
        { error: "This email address is reserved for administrative access. Please use your customer email." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.customerUser.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        passwordHash,
        companyName: company_name ? company_name.trim() : null,
        gstin: gstin ? gstin.trim().toUpperCase() : null,
        address: address ? address.trim() : null,
        city: city ? city.trim() : null,
        state: state ? state.trim() : "Andhra Pradesh",
        pincode: pincode ? pincode.trim() : null,
        role: company_name ? "b2b" : "customer",
      },
    });

    // Generate JWT token
    const token = await new SignJWT({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(JWT_SECRET);

    const userPayload = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      company_name: newUser.companyName,
      gstin: newUser.gstin,
      address: newUser.address,
      city: newUser.city,
      state: newUser.state,
      pincode: newUser.pincode,
      role: newUser.role,
      is_active: newUser.isActive,
      created_at: newUser.createdAt.toISOString(),
    };

    const response = NextResponse.json({
      access_token: token,
      token_type: "bearer",
      user: userPayload,
      message: "Account created successfully!",
    }, { status: 201 });

    // Set cookie as well for seamless session management
    response.cookies.set("aquasol_user_token", token, {
      httpOnly: false, // Accessible to client for unified user state
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("POST /api/auth/register error:", error);
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
