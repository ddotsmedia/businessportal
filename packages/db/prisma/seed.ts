import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.tenant.deleteMany();

  await prisma.tenant.create({
    data: {
      name: 'Ddotsmedia',
      slug: 'ddotsmedia',
    },
  });

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
