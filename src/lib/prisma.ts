import { PrismaClient } from "@prisma/client";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL;

  // PostgreSQL (Vercel/Production)
  if (dbUrl && (dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://"))) {
    const { PrismaPg } = require("@prisma/adapter-pg");
    const { Pool } = require("pg");
    const pool = new Pool({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  }

  // SQLite (local dev / Cloud Agent)
  const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
  const fileUrl = dbUrl ?? `file:${path.join(process.cwd(), "dev.db")}`;
  const adapter = new PrismaBetterSqlite3({ url: fileUrl });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
