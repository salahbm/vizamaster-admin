'use client';

import { useTranslations } from 'next-intl';
import { parseAsString, useQueryState } from 'nuqs';

import { Empty } from '@/components/shared/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import ApplicantFiles from './files';
import ApplicantUserInfo from './user-info';
import ApplicantVisaInfo from './visa-info';
import ApplicantWorkInfo from './work-info';

interface IUpsertApplicantProps {
  id: string;
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

  return (
    <Tabs defaultValue="user-info" value={step} onValueChange={setStep}>
      {id && (
        <TabsList
          variant="outline"
          className="no-scrollbar mb-10 justify-start overflow-x-auto"
        >
          <TabsTrigger
            value="user-info"
            variant="outline"
            className="w-32 max-w-fit"
          >
            {t('Common.userInfo')}
          </TabsTrigger>
          <TabsTrigger
            value="professional-info"
            variant="outline"
            className="w-32 max-w-fit"
          >
            {t('Common.professionalInfo')}
          </TabsTrigger>
          <TabsTrigger
            value="visa-info"
            variant="outline"
            className="w-32 max-w-fit"
          >
            {t('Common.visaInfo')}
          </TabsTrigger>
          <TabsTrigger
            value="files"
            variant="outline"
            className="w-32 max-w-fit"
          >
            {t('Common.files')}
          </TabsTrigger>
          <TabsTrigger
            value="comments"
            variant="outline"
            className="w-32 max-w-fit"
          >
            {t('Common.comments')}
          </TabsTrigger>
        </TabsList>
      )}
      <TabsContent value="user-info">
        <ApplicantUserInfo
          id={id}
          countryOfEmployment={countryOfEmployment}
          partner={partner}
        />
      </TabsContent>
      <TabsContent value="professional-info">
        <ApplicantWorkInfo id={id} />
      </TabsContent>
      <TabsContent value="visa-info">
        <ApplicantVisaInfo id={id} />
      </TabsContent>
      <TabsContent value="comments">
        <div className="flex-center h-[calc(100vh-10rem)] flex-col gap-4">
          <Empty className="mx-auto h-[250px] w-[250px]" />
          <h1 className="font-header text-center">{t('Common.noData')}</h1>
        </div>
      </TabsContent>
      <TabsContent value="files">
        <ApplicantFiles id={id} />
      </TabsContent>
    </Tabs>
  );
};

export default UpsertApplicant;
