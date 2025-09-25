import { NextRequest, NextResponse } from 'next/server';

import { TWorkArraySchema } from '@/server/common/dto/work.dto';
import { UnauthorizedError, handleApiError } from '@/server/common/errors';
import { WorkService } from '@/server/modules/applicant/work/work.service';

const workService = new WorkService();

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  if (!id) throw new UnauthorizedError('Unauthorized');

  try {
    const body = (await req.json()) as TWorkArraySchema;
    const work = await workService.upsertWorkExperiences(
      body.workExperiences,
      id,
    );
    return NextResponse.json(work);
  } catch (error) {
    return handleApiError(error);
  }
};

// ───────────────── DELETE ────────────────── //
// not used as update is used instead to track removed work experiences
export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const searchParams = new URL(req.url).searchParams;
  const applicantId = searchParams.get('applicantId');
  if (!id || !applicantId) throw new UnauthorizedError('Unauthorized');

  try {
    const work = await workService.deleteWorkExperience(applicantId, id);
    return NextResponse.json(work);
  } catch (error) {
    return handleApiError(error);
  }
};
