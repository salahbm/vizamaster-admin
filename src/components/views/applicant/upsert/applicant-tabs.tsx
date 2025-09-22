'use client';

import { useTranslations } from 'next-intl';
import { parseAsString, useQueryState } from 'nuqs';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    </Tabs>
  );
};

export default UpsertApplicant;
