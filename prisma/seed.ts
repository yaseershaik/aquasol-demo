import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding PureGrid Systems database...");

  // 1. Seed Default Admin
  const adminEmail = process.env.ADMIN_EMAIL || "admin@puregridsystems.in";
  const rawPassword = process.env.ADMIN_PASSWORD || "Admin@12345";
  const passwordHash = await bcrypt.hash(rawPassword, 10);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: "Lead Systems Administrator",
    },
    create: {
      email: adminEmail,
      name: "Lead Systems Administrator",
      passwordHash,
    },
  });
  console.log(`Admin account confirmed: ${admin.email}`);

  // 2. Seed Default SiteConfig
  const siteConfig = await prisma.siteConfig.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      businessName: "PureGrid Systems",
      tagline: "Commercial RO Water Plants & Residential Rooftop Solar Solutions",
      phone: "+91 98765 43210",
      whatsapp: "919876543210",
      email: "contact@puregridsystems.in",
      address: "Plot 42, Green Utility Infrastructure Park, Industrial Area, India",
      serviceCities: "Visakhapatnam, Vijayawada, Guntur, Tirupati & Pan-India Spares Delivery",
      heroTitle: "Pure Water for Enterprise. Clean Solar for Your Home.",
      heroSubtitle:
        "Order genuine commercial RO spare parts across India with live stock tracking, book a professional site inspection, or request an immediate installation quote.",
      heroBannerUrl: null,
      roBannerUrl: null,
      solarBannerUrl: null,
      codEnabled: true,
      onlinePayEnabled: true,
      shippingFlatFee: 99,
      freeShippingAbove: 2500,
    },
  });
  console.log(`SiteConfig confirmed for: ${siteConfig.businessName}`);

  // 3. Seed Categories
  const categoriesData = [
    {
      slug: "ro-membranes-filters",
      name: "RO Membranes & Filters",
      vertical: "RO",
      description: "High-rejection brackish water membranes, spun sediment cartridges, and block carbon filters.",
    },
    {
      slug: "ro-pumps-valves",
      name: "Booster Pumps, SMPS & Valves",
      vertical: "RO",
      description: "Heavy-duty commercial vertical multistage pumps, power supplies, and multiport valves.",
    },
    {
      slug: "commercial-ro-units",
      name: "Commercial RO Skid & UV",
      vertical: "RO",
      description: "Pre-fabricated stainless steel RO skids, sand/carbon pre-treatment vessels, and UV disinfection units.",
    },
    {
      slug: "solar-panels-inverters",
      name: "Solar Panels & Inverters",
      vertical: "SOLAR",
      description: "Tier-1 monocrystalline bifacial panels, grid-tied solar inverters, and net-metering bundles.",
    },
    {
      slug: "solar-mounting-bos",
      name: "Mounting Structures & AC/DC DB",
      vertical: "SOLAR",
      description: "Galvanized rooftop mounting elevated frames, DC combiner boxes, lightning arrestors, and cables.",
    },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, vertical: cat.vertical, description: cat.description },
      create: cat,
    });
    categoryMap.set(cat.slug, createdCat.id);
  }
  console.log(`Seeded ${categoriesData.length} categories.`);

  // 4. Seed Realistic Products (Including Out-of-Stock test item)
  const productsData = [
    {
      name: "Dow Filmtec BW30-4040 Commercial RO Membrane",
      slug: "dow-filmtec-bw30-4040-membrane",
      sku: "RO-MEM-4040-DOW",
      vertical: "RO",
      categorySlug: "ro-membranes-filters",
      shortSummary: "Industrial standard 2,400 GPD brackish water membrane with 99.5% stabilized salt rejection.",
      description:
        "The Dow Filmtec BW30-4040 element is the industry standard for reliable operation and maximum water quality in commercial reverse osmosis systems. Delivers exceptional salt rejection at low operating pressure, drastically reducing power consumption while handling severe borewell TDS up to 3,500 ppm.",
      price: 11499,
      compareAtPrice: 13500,
      gstPercent: 18,
      stockQuantity: 18,
      isFeatured: true,
      isPublished: true,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80"
      ]),
      specifications: JSON.stringify([
        { key: "Flow Rate", value: "2,400 Gallons / Day (~380 LPH)" },
        { key: "Stabilized Salt Rejection", value: "99.5%" },
        { key: "Max Operating Pressure", value: "600 psi (41 bar)" },
        { key: "Feed TDS Capability", value: "Up to 3,500 PPM" },
        { key: "Dimensions", value: "4.0 Inch Diameter x 40 Inch Length" },
        { key: "Manufacturer", value: "Dow Chemical / DuPont Water Solutions" }
      ]),
    },
    {
      name: "Toray TM720D-400 High Surface 8040 Membrane",
      slug: "toray-tm720d-400-8040-membrane",
      sku: "RO-MEM-8040-TORAY",
      vertical: "RO",
      categorySlug: "ro-membranes-filters",
      shortSummary: "Heavy-duty 400 sq.ft membrane element for industrial water plants and bottling units.",
      description:
        "Toray TM720D-400 is an ultra-high performance reverse osmosis membrane engineered for high recovery industrial plants (1,000 to 50,000 LPH). Features an advanced cross-linked polyamide composite chemistry that resists fouling and handles harsh groundwater.",
      price: 24500,
      compareAtPrice: 28000,
      gstPercent: 18,
      stockQuantity: 9,
      isFeatured: true,
      isPublished: true,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80"
      ]),
      specifications: JSON.stringify([
        { key: "Active Area", value: "400 sq. ft." },
        { key: "Permeate Flow", value: "11,000 GPD" },
        { key: "Salt Rejection", value: "99.8%" },
        { key: "Feed Spacer Thickness", value: "34 mil" },
        { key: "Dimensions", value: "8 Inch Diameter x 40 Inch Length" }
      ]),
    },
    {
      name: "Grundfos CRI 1-17 Vertical Multistage High Pressure Pump",
      slug: "grundfos-cri-1-17-vertical-pump",
      sku: "RO-PUMP-GRUNDFOS-CRI1-17",
      vertical: "RO",
      categorySlug: "ro-pumps-valves",
      shortSummary: "Three-phase continuous duty vertical booster pump for 500-1000 LPH commercial RO skids.",
      description:
        "The Grundfos CRI vertical multistage centrifugal pump is built with grade 304 stainless steel fluid-contact parts for maximum durability. Ideal for feeding reverse osmosis membranes that require continuous high operating pressure with minimal vibration.",
      price: 36200,
      compareAtPrice: 41000,
      gstPercent: 18,
      stockQuantity: 6,
      isFeatured: true,
      isPublished: true,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=800&auto=format&fit=crop&q=80"
      ]),
      specifications: JSON.stringify([
        { key: "Motor Power", value: "1.5 kW / 2.0 HP" },
        { key: "Voltage", value: "415V Three Phase, 50 Hz" },
        { key: "Rated Head", value: "85 meters (8.5 bar)" },
        { key: "Material", value: "SS 304 / Cast Iron Base" },
        { key: "Duty Cycle", value: "Continuous 24x7 Rated" }
      ]),
    },
    {
      name: "Pentair 1054 Structural FRP Composite Pressure Vessel",
      slug: "pentair-1054-frp-vessel",
      sku: "RO-VES-1054-PENTAIR",
      vertical: "RO",
      categorySlug: "commercial-ro-units",
      shortSummary: "Heavy-gauge composite pressure vessel with seamless inner polyethylene shell for sand/carbon media.",
      description:
        "Engineered for commercial pre-treatment stages. Filled with activated carbon, quartz sand, or ion exchange resin to protect RO membranes from physical turbidity and free chlorine.",
      price: 4950,
      compareAtPrice: 5600,
      gstPercent: 18,
      stockQuantity: 24,
      isFeatured: false,
      isPublished: true,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop&q=80"
      ]),
      specifications: JSON.stringify([
        { key: "Dimensions", value: "10 Inch Diameter x 54 Inch Height" },
        { key: "Volume Capacity", value: "62 Liters" },
        { key: "Top Opening", value: "2.5 Inch NPSM Thread" },
        { key: "Max Operating Pressure", value: "150 psi (10.5 bar)" },
        { key: "Tested Pressure", value: "300 psi" }
      ]),
    },
    {
      name: "Waaree 540W Monocrystalline Bifacial Solar Panel",
      slug: "waaree-540w-bifacial-solar-panel",
      sku: "SOL-MOD-540-WAAREE",
      vertical: "SOLAR",
      categorySlug: "solar-panels-inverters",
      shortSummary: "Tier-1 ALMM & BIS approved dual-glass monocrystalline panel generating up to 25% extra rear yield.",
      description:
        "High efficiency 540W bifacial solar module approved for PM Surya Ghar subsidy installations. Dual-glass construction delivers exceptional resistance against coastal Andhra humidity, cyclonic wind loads, and thermal degradation.",
      price: 13999,
      compareAtPrice: 16500,
      gstPercent: 12,
      stockQuantity: 32,
      isFeatured: true,
      isPublished: true,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1509391365260-2e82b43b67e8?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1508873696983-2df570464756?w=800&auto=format&fit=crop&q=80"
      ]),
      specifications: JSON.stringify([
        { key: "Rated Output Power", value: "540 Watts Peak" },
        { key: "Module Efficiency", value: "21.2%" },
        { key: "Cell Type", value: "Mono PERC 144 Half-Cut Cells" },
        { key: "Bifaciality Factor", value: "70% ± 5%" },
        { key: "Performance Warranty", value: "25-Year Linear Power Warranty" },
        { key: "Certification", value: "ALMM, BIS, IEC 61215 / 61730" }
      ]),
    },
    {
      name: "Growatt 5kW 3-Phase Grid-Tied Solar Inverter (Out of Stock Item)",
      slug: "growatt-5kw-three-phase-solar-inverter",
      sku: "SOL-INV-5KW-GROWATT",
      vertical: "SOLAR",
      categorySlug: "solar-panels-inverters",
      shortSummary: "High-efficiency transformerless solar inverter with dual MPPT and WiFi telemetry.",
      description:
        "Engineered for residential three-phase rooftop installations. Synchronizes seamlessly with APEPDCL and APSPDCL bi-directional net meters. Features remote cloud monitoring and IP65 weatherproof casing.",
      price: 48500,
      compareAtPrice: 54000,
      gstPercent: 12,
      stockQuantity: 0, // Explicit 0-stock test item
      isFeatured: false,
      isPublished: true,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1548611716-3047b198c257?w=800&auto=format&fit=crop&q=80"
      ]),
      specifications: JSON.stringify([
        { key: "AC Output Power", value: "5,000 Watts" },
        { key: "Max Efficiency", value: "98.3%" },
        { key: "Number of MPPT Trackers", value: "2 Independent Trackers" },
        { key: "Grid Connection", value: "415V Three Phase, 50Hz" },
        { key: "Warranty", value: "5 Years Standard Replacement" }
      ]),
    },
  ];

  for (const item of productsData) {
    const categoryId = categoryMap.get(item.categorySlug);
    if (!categoryId) continue;

    await prisma.product.upsert({
      where: { sku: item.sku },
      update: {
        name: item.name,
        slug: item.slug,
        vertical: item.vertical,
        shortSummary: item.shortSummary,
        description: item.description,
        price: item.price,
        compareAtPrice: item.compareAtPrice,
        gstPercent: item.gstPercent,
        stockQuantity: item.stockQuantity,
        isFeatured: item.isFeatured,
        isPublished: item.isPublished,
        images: item.images,
        specifications: item.specifications,
        categoryId,
      },
      create: {
        name: item.name,
        slug: item.slug,
        sku: item.sku,
        vertical: item.vertical,
        shortSummary: item.shortSummary,
        description: item.description,
        price: item.price,
        compareAtPrice: item.compareAtPrice,
        gstPercent: item.gstPercent,
        stockQuantity: item.stockQuantity,
        isFeatured: item.isFeatured,
        isPublished: item.isPublished,
        images: item.images,
        specifications: item.specifications,
        categoryId,
      },
    });
  }
  console.log(`Seeded ${productsData.length} products (including out-of-stock item).`);

  // 5. Seed Sample Completed Projects
  const portfolioData = [
    {
      title: "2,000 LPH Pure Water System for Multispeciality Hospital",
      vertical: "RO",
      location: "Guntur, Andhra Pradesh",
      capacity: "2,000 Liters / Hour",
      summary: "Turnkey RO installation treating 1,850 PPM borewell water down to 80 PPM for dialysis, ICU, and campus drinking water.",
      imageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80",
    },
    {
      title: "10 kW Rooftop Solar Net-Metered Villa Installation",
      vertical: "SOLAR",
      location: "Visakhapatnam, Andhra Pradesh",
      capacity: "10 kW On-Grid Bifacial System",
      summary: "Tier-1 bifacial panels with elevated HDG framework. Successfully sanctioned under PM Surya Ghar with APEPDCL net-metering.",
      imageUrl: "https://images.unsplash.com/photo-1509391365260-2e82b43b67e8?w=800&auto=format&fit=crop&q=80",
    },
  ];

  for (const proj of portfolioData) {
    const existing = await prisma.portfolioProject.findFirst({
      where: { title: proj.title },
    });
    if (!existing) {
      await prisma.portfolioProject.create({ data: proj });
    }
  }
  console.log("Seeded portfolio projects.");

  // 6. Seed Demo Customers
  const customerHash = await bcrypt.hash("Customer@12345", 10);
  const demoUsers = [
    { name: "Praveen Kumar (Demo Customer)", email: "customer@puregridsystems.in", phone: "9876543210", passwordHash: customerHash },
    { name: "Demo Customer Account", email: "customer@aquasol.com", phone: "9876543211", passwordHash: customerHash },
    { name: "Demo Evaluator", email: "demo@puregridsystems.in", phone: "9876543212", passwordHash: customerHash },
    { name: "Demo Evaluator User", email: "demo@aquasol.com", phone: "9876543213", passwordHash: customerHash },
  ];

  for (const u of demoUsers) {
    await prisma.customerUser.upsert({
      where: { email: u.email },
      update: { passwordHash: u.passwordHash, name: u.name, isActive: true },
      create: { ...u, city: "Visakhapatnam", state: "Andhra Pradesh", pincode: "530012" },
    });
  }
  console.log("Seeded demo customer accounts.");
  console.log("Database seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
