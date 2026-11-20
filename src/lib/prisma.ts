import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// Support Vercel serverless environment with SQLite in /tmp
if (process.env.VERCEL) {
  const tmpDbPath = path.join("/tmp", "dev.db");
  const sourceDbPath = path.join(process.cwd(), "prisma", "dev.db");
  try {
    if (!fs.existsSync(tmpDbPath) && fs.existsSync(sourceDbPath)) {
      fs.copyFileSync(sourceDbPath, tmpDbPath);
    }
  } catch (e) {
    console.error("Failed to copy SQLite database to /tmp:", e);
  }
}

const getDatabaseUrl = () => {
  if (process.env.VERCEL) {
    return "file:/tmp/dev.db";
  }
  return process.env.DATABASE_URL || "file:./dev.db";
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
