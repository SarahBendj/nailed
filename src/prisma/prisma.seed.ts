import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

async function main() {
  const hallServiceTypes = [
    { name: 'Parking', slug: 'parking' },
    { name: 'Pas d’enfants', slug: 'no-children' },
    { name: 'Climatisation', slug: 'air-conditioning' },
    { name: 'DJ', slug: 'dj' },
    { name: 'All Inclusive', slug: 'all-inclusive' },
    { name: 'Semi Inclusive (Goûter)', slug: 'semi-inclusive-snack' },
    { name: 'Dîner inclus', slug: 'dinner-included' },
    { name: 'Décoration incluse', slug: 'decoration-included' },
    { name: 'Service traiteur', slug: 'catering' },
    { name: 'Piscine', slug: 'pool' },
  ];

  for (const service of hallServiceTypes) {
    await prisma.hallServiceType.upsert({
      where: { name: service.name },
      update: {},
      create: service,
    });
  }

  console.log('Hall services seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });