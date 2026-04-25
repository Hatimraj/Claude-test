import { z } from "zod";

const envSchema = z.object({
  KIE_API_KEY: z.string().min(1, "KIE_API_KEY is required"),
  KIE_BASE_URL: z.string().url().default("https://api.kie.ai"),
  DATABASE_URL: z.string().min(1)
});

export const env = envSchema.parse({
  KIE_API_KEY: process.env.KIE_API_KEY,
  KIE_BASE_URL: process.env.KIE_BASE_URL,
  DATABASE_URL: process.env.DATABASE_URL
});
