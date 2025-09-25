import { NextRequest, NextResponse } from 'next/server';

import { UnauthorizedError, handleApiError } from '@/server/common/errors';
import { VisaService } from '@/server/modules/applicant/visa/visa.service';

const visaService = new VisaService();

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  if (!id) throw new UnauthorizedError('Unauthorized');

  try {
    const visa = await visaService.findOne(id);
    return NextResponse.json(visa);
  } catch (error) {
    return handleApiError(error);
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  if (!id) throw new UnauthorizedError('Unauthorized');

  try {
    const body = await req.json();
    const updatedVisa = await visaService.update(body, id);
    return NextResponse.json(updatedVisa);
  } catch (error) {
    return handleApiError(error);
  }
};
