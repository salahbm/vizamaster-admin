import { ApplicantStatus, Prisma } from '@/generated/prisma';

export class ApplicantHelper {
  buildWhereClause({
    search,
    country,
    partner,
    isArchived,
    isAlert,
    status,
    workplace,
    jobTitle,
    userId,
  }: {
    search?: string;
    country?: string;
    partner?: string;
    isArchived?: boolean;
    isAlert?: boolean;
    status?: string;
    workplace?: string;
    jobTitle?: string;
    userId?: string;
  }): Prisma.ApplicantWhereInput {
    const where: Prisma.ApplicantWhereInput = {};

    // Validate and sanitize inputs
    if (country && typeof country === 'string' && country.length <= 100) {
      where.countryOfEmployment = country.trim();
    }

    if (partner && typeof partner === 'string' && partner.length <= 100) {
      where.partner = partner.trim();
    }

    if (isArchived !== undefined && typeof isArchived === 'boolean') {
      where.isArchived = isArchived;
    }

    if (isAlert !== undefined && typeof isAlert === 'boolean' && userId) {
      where.alerts = {
        some: {
          userId: userId,
          isRead: false,
        },
      };
    }

    if (
      status &&
      Object.values(ApplicantStatus).includes(status as ApplicantStatus)
    ) {
      where.status = status as ApplicantStatus;
    }

    if (workplace && typeof workplace === 'string' && workplace.length <= 100) {
      where.workplace = workplace.trim();
    }

    if (jobTitle && typeof jobTitle === 'string' && jobTitle.length <= 100) {
      where.preferredJobTitle = jobTitle.trim();
    }

    if (search && typeof search === 'string' && search.length <= 100) {
      where.OR = [
        { firstName: { contains: search.trim(), mode: 'insensitive' } },
        { lastName: { contains: search.trim(), mode: 'insensitive' } },
        { userId: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    return where;
  }
}
