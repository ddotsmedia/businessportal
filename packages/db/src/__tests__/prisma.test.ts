import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '../index';

const hasDatabase = !!process.env.DATABASE_URL;

describe.skipIf(!hasDatabase)('Prisma integration', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.tenant.deleteMany();
    await prisma.$disconnect();
  });

  it('should create and read a tenant', async () => {
    const tenant = await prisma.tenant.create({
      data: {
        name: 'Test Tenant',
        slug: `test-${Date.now()}`,
      },
    });

    expect(tenant.id).toBeDefined();
    expect(tenant.name).toBe('Test Tenant');

    const fetched = await prisma.tenant.findUnique({
      where: { id: tenant.id },
    });

    expect(fetched).toBeDefined();
    expect(fetched?.slug).toMatch(/^test-\d+$/);
  });
});
