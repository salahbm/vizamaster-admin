'use client';

import { useTranslations } from 'next-intl';
import { parseAsString, useQueryState } from 'nuqs';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { cn } from '@/lib/utils';

import { useApplicantDetail } from '@/hooks/applicant';

import ApplicantAudits from './applicant-audits';
import ApplicantComments from './applicant-comments';
import ApplicantFiles from './user-files';
import ApplicantUserInfo from './user-info';
import ApplicantVisaInfo from './visa-info';
import ApplicantWorkInfo from './work-info';

interface IUpsertApplicantProps {
  id?: string;
  countryOfEmployment: string;
  partner: string;
}

export const UpsertApplicant: React.FC<IUpsertApplicantProps> = ({
  id,
  countryOfEmployment,
  partner,
}) => {
  const t = useTranslations();

  const [step, setStep] = useQueryState(
    'step',
    parseAsString.withDefault('user-info'),
  );

  const { data: applicant, isLoading } = useApplicantDetail(id);

  return (
    <Tabs defaultValue="user-info" value={step} onValueChange={setStep}>
      {id && (
        <TabsList
          variant="outline"
          className={cn(
            'no-scrollbar mb-4 flex items-center justify-start overflow-x-auto lg:mb-10',
            step === 'comments' && 'mb-0',
            isLoading && 'animate-pulse',
          )}
        >
          <TabsTrigger
            value="user-info"
            variant="outline"
            className="w-auto lg:max-w-fit lg:min-w-32"
          >
            {t('Common.userInfo')}
          </TabsTrigger>
          <TabsTrigger
            value="professional-info"
            variant="outline"
            className="w-auto lg:max-w-fit lg:min-w-32"
          >
            {t('Common.professionalInfo')}
          </TabsTrigger>
          <TabsTrigger
            value="visa-info"
            variant="outline"
            className="w-auto lg:max-w-fit lg:min-w-32"
          >
            {t('Common.visaInfo')}
          </TabsTrigger>
          <TabsTrigger
            value="files"
            variant="outline"
            className="w-auto lg:max-w-fit lg:min-w-32"
          >
            {t('Common.files')}
          </TabsTrigger>
          <TabsTrigger
            value="comments"
            variant="outline"
            className="w-auto lg:max-w-fit lg:min-w-32"
          >
            {t('Common.comments')}
          </TabsTrigger>
          <TabsTrigger
            value="audits"
            variant="outline"
            className="w-auto lg:max-w-fit lg:min-w-32"
          >
            {t('Common.audits')}
          </TabsTrigger>
        </TabsList>
      )}
      <TabsContent value="user-info">
        <ApplicantUserInfo
          id={id}
          applicant={applicant}
          countryOfEmployment={countryOfEmployment}
          partner={partner}
        />
      </TabsContent>
      <TabsContent value="professional-info">
        <ApplicantWorkInfo
          id={id!}
          works={applicant?.work}
          isLoading={isLoading}
        />
      </TabsContent>
      <TabsContent value="visa-info">
        <ApplicantVisaInfo
          id={id}
          visa={applicant?.visa}
          isLoading={isLoading}
        />
      </TabsContent>
      <TabsContent value="comments">
        <ApplicantComments id={id} />
      </TabsContent>
      <TabsContent value="files">
        <ApplicantFiles
          id={id!}
          files={applicant?.files}
          isLoading={isLoading}
        />
      </TabsContent>
      <TabsContent value="audits">
        <ApplicantAudits applicant={applicant} isLoading={isLoading} />
      </TabsContent>
    </Tabs>
  );
};

export default UpsertApplicant;
