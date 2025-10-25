// lib/prisma.js
import { PrismaClient } from '@prisma/client'

// Создаем новый клиент для КАЖДОГО запроса - это решает проблему с пулом
export function createPrismaClient() {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: ['error'],
  });
}

// Для development можно кэшировать
let cachedPrisma = null;

if (process.env.NODE_ENV !== 'production') {
  cachedPrisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: ['error'],
  });
}

export const prisma = cachedPrisma;