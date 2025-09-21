import { ApplicantStatus, Prisma } from '@/generated/prisma';

export class ApplicantHelper {
  buildWhereClause({
    search,
    country,
    partner,
    isArchived,
    status,
    jobTitle,
  }: {
    search?: string;
    country?: string;
    partner?: string;
    isArchived?: boolean;
    status?: string;
    jobTitle?: string;
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

    if (
      status &&
      Object.values(ApplicantStatus).includes(status as ApplicantStatus)
    ) {
      where.status = status as ApplicantStatus;
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
