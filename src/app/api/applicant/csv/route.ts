import { NextRequest, NextResponse } from 'next/server';

import { handleApiError } from '@/server/common/errors';
import { ApplicantService } from '@/server/modules/applicant/csv/csv.service';

export async function GET(request: NextRequest) {
  try {
    const applicantService = new ApplicantService();
    const xml = await applicantService.getAllApplicantsCsv();

    return NextResponse.json(xml);
  } catch (error) {
    handleApiError(error);
  }
}
