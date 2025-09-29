// prisma/seed.ts
import { Gender, PrismaClient } from '@/generated/prisma';
import { generateUserId } from '@/server/common/utils';

const prisma = new PrismaClient();

function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomString(length: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join('');
}

async function main() {
  const today = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(today.getMonth() - 3);

  const firstNames = ['Ali', 'John', 'Sara', 'Nina', 'David', 'Aziz', 'Rustam'];
  const lastNames = [
    'Smith',
    'Khan',
    'Rahimov',
    'Ivanov',
    'Lee',
    'Kim',
    'Patel',
  ];
  const countries = ['UZ', 'IN', 'RU', 'KZ', 'KG', 'TM', 'TJ'];
  const partners = ['nomad', 'Inter', 'ASSA', 'NELLYAN'];

  const applicants = Array.from({ length: 50 }).map(() => {
    const createdAt = randomDate(threeMonthsAgo, today);
    return {
      userId: generateUserId(),
      firstName: randomItem(firstNames),
      lastName: randomItem(lastNames),
      gender: randomItem([Gender.MALE, Gender.FEMALE]),
      passportNumber: randomString(8),
      phoneNumber: `+998${Math.floor(100000000 + Math.random() * 900000000)}`,
      email: `${Math.random().toString(36).substring(2, 7)}@example.com`,
      countryOfResidence: randomItem(countries),
      addressLine1: `Street ${Math.floor(Math.random() * 100)}`,
      city: `City${Math.floor(Math.random() * 50)}`,
      countryOfEmployment: randomItem(countries),
      partner: randomItem(partners),
      languages: [randomItem(['EN', 'RU', 'UZ'])],
      createdAt,
      updatedAt: createdAt,
    };
  });

  await prisma.applicant.createMany({ data: applicants });
  console.log('✅ 50 applicants created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
