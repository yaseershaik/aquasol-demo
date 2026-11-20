# AQUASOL PureGrid Systems

A modern, production-grade Web Platform for **Commercial RO Water Treatment Plants**, **Genuine Spare Parts E-Commerce**, and **Residential Rooftop Solar EPC Installations**.

Built with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS**, and **Prisma ORM with SQLite**.

---

## 🌟 Key Features

### 1. Storefront & Component Commerce
- **Genuine Parts Catalog**: Commercial RO membranes, high-pressure multistage pumps, solar PV bifacial panels, and on-grid solar inverters.
- **Cart & Dynamic Pricing**: Subtotal, 12%/18% GST automatic tax calculation, free shipping threshold (above ₹2,500), and checkout receipt generation.
- **Atomic Checkout**: Cash on Delivery (COD) and Online Payment readiness with live stock decrements and unique order codes (`ORD-XXXX`).

### 2. Services & Engineering EPC
- **Commercial RO Solutions**: Turnkey brackish water and sea water reverse osmosis plants (500 LPH to 50,000 LPH) with live quote lead generation.
- **Rooftop Solar EPC**: On-grid, off-grid, and hybrid solar systems with subsidy assistance.
- **Site Inspection Booking**: Select service vertical, preferred inspection date, and time slot with reference tracking (`INS-XXXX`).

### 3. Order & Booking Tracking
- Real-time reference lookup at `/track-order` using order/booking number and mobile phone.
- Multi-step timeline tracking (Placed → Confirmed → Dispatched → Delivered).

### 4. Admin Management Console
- Secure admin management portal at `/admin` (desktop & mobile optimized).
- Manage inventory & products, review customer leads, dispatch orders, and schedule inspections.
- Unified CMS settings for business info, shipping rates, and payment gateway toggles.

### 5. Demo Credentials
- **Admin Portal (`/admin/login`)**:
  - Email: `admin@puregridsystems.in`
  - Password: `Admin@12345`
- **Customer Account (`/auth/login`)**:
  - Email: `customer@example.com`
  - Password: `password123`
  - *(Alternate)*: `customer@puregridsystems.in` / `Customer@12345`

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Clone repository
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

# 2. Install dependencies
npm install

# 3. Generate Prisma client & database
npx prisma generate

# 4. Start Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ 1-Click Vercel Deployment

This project is configured out-of-the-box for zero-configuration Vercel deployment:
1. Push this repository to your **GitHub** account.
2. Go to [Vercel](https://vercel.com) and click **"Add New..." > "Project"**.
3. Import your GitHub repository.
4. Set the following **Environment Variables** (or leave defaults):
   - `JWT_SECRET`: `aquasol_puregrid_master_secure_production_key_2026`
   - `ADMIN_EMAIL`: `admin@puregridsystems.in`
   - `ADMIN_PASSWORD`: `Admin@12345`
5. Click **Deploy**. Vercel will build the Next.js app and deploy it on free cloud infrastructure.
