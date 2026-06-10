import { z } from "zod";

const serverSchema = z.object({
  // Database
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),

  // NextAuth
  NEXTAUTH_SECRET: z.string().min(32, "NEXTAUTH_SECRET must be at least 32 characters"),
  NEXTAUTH_URL: z.string().url().default("http://localhost:3000"),

  // Anthropic (Claude AI)
  ANTHROPIC_API_KEY: z.string().optional(),

  // Resend (Email)
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().default("noreply@thevisaghar.com"),

  // Cloudinary (Image Upload)
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // Admin notification email (defaults to admin@thevisaghar.com)
  ADMIN_NOTIFICATION_EMAIL: z.string().email().optional(),

  // Admin IP Allowlist (comma-separated, optional)
  ADMIN_IP_ALLOWLIST: z.string().optional(),

  // Node environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_GOOGLE_MAPS_KEY: z.string().optional(),
});

// Validate server-side environment variables
function validateServerEnv() {
  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("❌ Invalid server environment variables:", parsed.error.flatten().fieldErrors);
    // Don't throw in development to allow partial setup
    if (process.env.NODE_ENV === "production") {
      throw new Error("Invalid server environment variables");
    }
    // Return partial with defaults for development
    return process.env as unknown as z.infer<typeof serverSchema>;
  }
  return parsed.data;
}

function validateClientEnv() {
  const parsed = clientSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_GOOGLE_MAPS_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
  });
  if (!parsed.success) {
    console.error("❌ Invalid client environment variables:", parsed.error.flatten().fieldErrors);
    return {} as z.infer<typeof clientSchema>;
  }
  return parsed.data;
}

export const serverEnv = validateServerEnv();
export const clientEnv = validateClientEnv();
