import { PrismaPg } from '@prisma/adapter-pg';
import { defineConfig, type PrismaConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
            seed: 'bun @/src/prisma/prisma.seed.ts',
      },
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
} as PrismaConfig);