import { UnauthorizedError } from '@/server/common/errors';
import { withHandler } from '@/server/common/interceptors/handle.interceptor';
import { applicantService } from '@/server/modules/applicant';

export const GET = withHandler(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    if (!id) throw new UnauthorizedError('Unauthorized');
    return applicantService.getApplicantFiles(id);
  },
);
