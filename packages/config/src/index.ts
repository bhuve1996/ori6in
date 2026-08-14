import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3001),
  WEB_URL: z.string().default('http://localhost:3000'),
  API_URL: z.string().default('http://localhost:3001'),
  DATABASE_DRIVER: z.enum(['postgres', 'mongo']).default('postgres'),
  DATABASE_URL: z.string().default('postgresql://ori6in:ori6in@localhost:5432/ori6in'),
  MONGO_URL: z.string().default('mongodb://localhost:27017/ori6in'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  JWT_SECRET: z.string().min(8).default('change-me-in-production'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  /** Temporary demo accounts for stakeholder walkthroughs. Set false to disable. */
  ENABLE_DEMO_LOGINS: z
    .enum(['true', 'false'])
    .default('true')
    .transform((v) => v === 'true'),
  GOOGLE_CLIENT_ID: z.string().optional().default(''),
  GOOGLE_CLIENT_SECRET: z.string().optional().default(''),
  S3_ENDPOINT: z.string().optional().default(''),
  S3_BUCKET: z.string().default('ori6in'),
  S3_ACCESS_KEY: z.string().optional().default(''),
  S3_SECRET_KEY: z.string().optional().default(''),
  PAYMENT_PROVIDER: z.enum(['razorpay', 'stripe']).default('razorpay'),
  RAZORPAY_KEY_ID: z.string().optional().default(''),
  RAZORPAY_KEY_SECRET: z.string().optional().default(''),
  STRIPE_SECRET_KEY: z.string().optional().default(''),
  OPENAI_API_KEY: z.string().optional().default(''),
});

export type AppConfig = z.infer<typeof envSchema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return envSchema.parse(env);
}
