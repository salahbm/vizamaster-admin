import { NextRequest, NextResponse } from 'next/server';

import { handleApiError } from '@/server/common/errors';
import { ApplicantService } from '@/server/modules/applicant/csv/csv.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const applicantService = new ApplicantService();
    const xml = await applicantService.getApplicantCsv(id);

    return NextResponse.json(xml);
  } catch (error) {
    handleApiError(error);
  }
}
