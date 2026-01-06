import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

// --- Environment validation (fail fast) ---
const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is missing in environment variables");
}

// --- Global caching to avoid multiple instances in dev ---
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// --- Create client only once ---
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });

// Cache in dev mode
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// --- Graceful shutdown (Bun supports this cleanly) ---
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});