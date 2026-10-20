import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  APP_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(1),
  EMAIL_PROVIDER: z.string(),
  EMAIL_FROM: z.string().email().optional(),
  S3_ENDPOINT: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),
  LOG_LEVEL: z
    .enum(['debug', 'info', 'warn', 'error'])
    .default('info'),
  SENTRY_DSN: z.string().optional(),
});

const env = envSchema.parse(process.env);

if (process.env.NODE_ENV === 'production') {
  envSchema.parse(process.env);
}

export { env };
