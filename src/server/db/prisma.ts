import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import 'dotenv/config';
import ws from 'ws';

import { PrismaClient } from '@/generated/prisma';

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true;

// Type definitions
declare global {
  var prisma: PrismaClient | undefined;
}

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaNeon({ connectionString });
const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export default prisma;
