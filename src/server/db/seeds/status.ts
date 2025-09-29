import { ApplicantStatus, PrismaClient, VisaStatus } from '@/generated/prisma';

const prisma = new PrismaClient();

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  const statuses = [
    ApplicantStatus.NEW,
    ApplicantStatus.IN_PROGRESS,
    ApplicantStatus.CONFIRMED_PROGRAM,
    ApplicantStatus.HIRED,
    ApplicantStatus.HOTEL_REJECTED,
    ApplicantStatus.APPLICANT_REJECTED,
    ApplicantStatus.FIRED,
  ];

  const visaStatuses = [
    VisaStatus.DEPARTED,
    VisaStatus.RETURNED,
    VisaStatus.STILL_WORKING,
    VisaStatus.NOT_APPLIED,
  ];

  const applicants = await prisma.applicant.findMany({
    include: { visa: true },
  });

  // parallelized updates
  await Promise.all(
    applicants.map((applicant) => {
      return prisma.applicant.update({
        where: { id: applicant.id },
        data: {
          status: randomItem(statuses),
          visa: applicant.visa.length
            ? {
                updateMany: {
                  where: {},
                  data: { status: randomItem(visaStatuses) },
                },
              }
            : {
                create: {
                  status: randomItem(visaStatuses),
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              },
        },
      });
    }),
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
