import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  APP_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(1),
  EMAIL_PROVIDER: z.string(),
});

describe('env validation', () => {
  it('should throw when required env variables are missing in production', () => {
    const testEnv = {
      NODE_ENV: 'production' as const,
    };

    expect(() => envSchema.parse(testEnv)).toThrow();
  });

  it('should parse valid env variables', () => {
    const testEnv = {
      NODE_ENV: 'development' as const,
      APP_URL: 'http://localhost:3100',
      DATABASE_URL: 'postgresql://user:pass@localhost/db',
      AUTH_SECRET: 'secret',
      EMAIL_PROVIDER: 'log',
    };

    const result = envSchema.parse(testEnv);
    expect(result.NODE_ENV).toBe('development');
  });
});
