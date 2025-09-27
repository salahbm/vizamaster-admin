'use client';

import { format } from 'date-fns';
import { Archive, Download, FolderOpenDot, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { FormSkeleton } from '@/components/skeletons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { downloadCsv } from '@/utils/helpers';

import { Applicant } from '@/generated/prisma';
import { useDeleteApplicant } from '@/hooks/applicant';
import {
  useArchiveApplicant,
  useUnarchiveApplicant,
} from '@/hooks/applicant/use-archive';
import { useGetSingleCsv } from '@/hooks/csv';
import { useAlert } from '@/providers/alert';
import { useAuthStore } from '@/store/use-auth-store';

interface ApplicantAuditsProps {
  applicant?: Applicant;
  isLoading: boolean;
}

const ApplicantAudits: React.FC<ApplicantAuditsProps> = ({
  applicant,
  isLoading,
}) => {
  const alert = useAlert();
  const t = useTranslations();
  const { user } = useAuthStore();

  // Mutations
  const { mutateAsync: deleteApplicant, isPending: isPendingDelete } =
    useDeleteApplicant();
  const { mutateAsync: archiveApplicants, isPending: isPendingArchive } =
    useArchiveApplicant();
  const { mutateAsync: unarchiveApplicants, isPending: isPendingUnarchive } =
    useUnarchiveApplicant();

  const { mutateAsync: getSingleCsv, isPending: isPendingGetSingleCsv } =
    useGetSingleCsv();

  if (isLoading || !applicant) return <FormSkeleton />;

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {/* Created Info */}
        <div className="space-y-2">
          <h3 className="font-body-2 text-muted-foreground">
            {t('applicant.audit.created')}
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="font-caption text-muted-foreground">
                {t('applicant.audit.by')}
              </p>
              <p className="font-body">{applicant.createdBy}</p>
            </div>
            <div>
              <p className="font-caption text-muted-foreground">
                {t('applicant.audit.at')}
              </p>
              <p className="font-body">
                {format(new Date(applicant.createdAt), 'PPpp')}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Updated Info */}
        <div className="space-y-2">
          <h3 className="font-body-2 text-muted-foreground">
            {t('applicant.audit.lastUpdated')}
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="font-caption text-muted-foreground">
                {t('applicant.audit.by')}
              </p>
              <p className="font-body">{applicant.updatedBy}</p>
            </div>
            <div>
              <p className="font-caption text-muted-foreground">
                {t('applicant.audit.at')}
              </p>
              <p className="font-body">
                {format(new Date(applicant.updatedAt), 'PPpp')}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Archive Status */}
        <div className="flex items-center gap-6">
          <h3 className="font-body-2 text-muted-foreground">
            {t('applicant.audit.status')}
          </h3>
          <Badge
            variant={applicant.isArchived ? 'destructive' : 'secondary'}
            className="font-body-2"
          >
            {applicant.isArchived ? t('Common.archived') : t('Common.active')}
          </Badge>
        </div>
      </div>

      <div className="border- flex flex-wrap justify-between gap-4 border-t pt-4">
        <Button
          variant="outline"
          className="w-36"
          disabled={isPendingGetSingleCsv}
          onClick={async () =>
            await getSingleCsv(applicant.id).then((res) =>
              downloadCsv((res as { data: string }).data),
            )
          }
        >
          {t('Common.download')}
          <Download className="size-4" />
        </Button>
        {/* Action Buttons */}
        {user?.role !== 'EDITOR' ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="px-4"
              disabled={isPendingArchive || isPendingUnarchive}
              onClick={async () =>
                applicant?.isArchived
                  ? await unarchiveApplicants([applicant.id])
                  : alert({
                      title: t('Common.archive'),
                      description: t('Common.messages.archiveDescription'),
                      onConfirm: async () =>
                        await archiveApplicants([applicant.id]),
                      confirmText: t('Common.archive'),
                    })
              }
            >
              {applicant.isArchived
                ? t('Common.unarchive')
                : t('Common.archive')}
              {applicant.isArchived ? (
                <FolderOpenDot className="size-4" />
              ) : (
                <Archive className="size-4" />
              )}
            </Button>

            <Button
              variant="destructive"
              className="w-36"
              disabled={isPendingDelete}
              onClick={async () =>
                alert({
                  title: t('Common.delete'),
                  description: t('Common.messages.deleteDescription'),
                  onConfirm: async () => await deleteApplicant([applicant.id]),
                  confirmText: t('Common.delete'),
                })
              }
            >
              {t('Common.delete')}
              <Trash className="size-4" />
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ApplicantAudits;
