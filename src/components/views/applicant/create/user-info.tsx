'use client';

import { useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { DatePicker } from '@/components/shared/date-pickers';
import { FormFields } from '@/components/shared/form-fields';
import { FormSkeleton } from '@/components/skeletons';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Form } from '@/components/ui/form';
import { Input, TelephoneInput } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Uploader } from '@/components/ui/uploader';

import { mapOptions } from '@/lib/utils';

import { getCountries, getLanguages } from '@/utils/intl';

import { useApplicantDetail, useCreateApplicant } from '@/hooks/applicant';
import { useCodes } from '@/hooks/settings/codes';
import { ApplicantDto, TApplicantDto } from '@/server/common/dto/applicant.dto';

import { applicantDefaults, applicantQueries } from './applicant.helpers';

interface IApplicantUserInfoProps {
  id?: string;
  countryOfEmployment: string;
  partner: string;
}

const ApplicantUserInfo: React.FC<IApplicantUserInfoProps> = ({
  id,
  countryOfEmployment,
  partner,
}) => {
  const locale = useLocale();
  const t = useTranslations('applicant.form');

  const { data: applicant, isLoading } = useApplicantDetail(id);

  // QUERIES
  const { data: countries, isLoading: isLoadingCountries } = useCodes(
    applicantQueries('group-countries'),
  );
  const { data: partners, isLoading: isLoadingPartners } = useCodes(
    applicantQueries('group-partners'),
  );
  const { data: vacancies, isLoading: isLoadingVacancies } = useCodes(
    applicantQueries('group-vacancies'),
  );

  // MUTATIONS
  const { mutateAsync: createApplicant, isPending: isPendingCreateApplicant } =
    useCreateApplicant();

  // MEMOS
  const countryOfResidenceOptions = useMemo(() => getCountries(), []);
  const languagesOptions = useMemo(() => getLanguages(), []);
  const { memoCountries, memoPartners, memoVacancies } = useMemo(() => {
    return {
      memoCountries: mapOptions(countries?.data, locale),
      memoPartners: mapOptions(partners?.data, locale),
      memoVacancies: mapOptions(vacancies?.data, locale),
    };
  }, [countries, partners, vacancies, locale]);

  const form = useForm<TApplicantDto>({
    resolver: zodResolver(ApplicantDto),
    defaultValues: applicantDefaults(countryOfEmployment, partner),
  });

  if (isLoading) return <FormSkeleton />;

  const onSubmit = (data: TApplicantDto) => {
    if (id) {
      // updateApplicant(id, data);
    } else {
      createApplicant(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {!id && <Separator />}
        {/* Personal Information */}
        <div>
          <h2 className="font-header text-xl">
            {t('sections.personalInfo.title')}
          </h2>
          <p className="font-body-2 text-muted-foreground mb-6">
            {t('sections.personalInfo.description')}
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FormFields
              name="firstName"
              label={t('fields.firstName.label')}
              required
              control={form.control}
              render={({ field }) => (
                <Input
                  placeholder={t('fields.firstName.placeholder')}
                  {...field}
                />
              )}
            />
            <FormFields
              name="lastName"
              label={t('fields.lastName.label')}
              required
              control={form.control}
              render={({ field }) => (
                <Input
                  placeholder={t('fields.lastName.placeholder')}
                  {...field}
                />
              )}
            />
            <FormFields
              name="middleName"
              label={t('fields.middleName.label')}
              control={form.control}
              render={({ field }) => (
                <Input
                  placeholder={t('fields.middleName.placeholder')}
                  {...field}
                />
              )}
            />
            <FormFields
              name="gender"
              label={t('fields.gender.label')}
              required
              control={form.control}
              render={({ field }) => (
                <Combobox
                  placeholder={t('fields.gender.placeholder')}
                  options={[
                    { value: 'MALE', label: t('fields.gender.options.male') },
                    {
                      value: 'FEMALE',
                      label: t('fields.gender.options.female'),
                    },
                  ]}
                  {...field}
                />
              )}
            />
            <FormFields
              name="dateOfBirth"
              label={t('fields.dateOfBirth.label')}
              control={form.control}
              render={({ field }) => <DatePicker {...field} />}
            />
            <FormFields
              name="passportNumber"
              label={t('fields.passportNumber.label')}
              required
              control={form.control}
              render={({ field }) => (
                <Input
                  placeholder={t('fields.passportNumber.placeholder')}
                  {...field}
                />
              )}
            />
          </div>
          <div className="mt-6">
            <FormFields
              name="passportPhoto"
              label={t('fields.passportPhoto.label')}
              control={form.control}
              render={({ field }) => <Uploader {...field} maxFiles={1} />}
              message={t('fields.passportPhoto.message')}
              messageClassName="text-muted-foreground text-xs"
            />
          </div>
        </div>
        <Separator />
        {/* Contact Information */}
        <div>
          <h2 className="font-header text-xl">
            {t('sections.contactInfo.title')}
          </h2>
          <p className="font-body-2 text-muted-foreground mb-6">
            {t('sections.contactInfo.description')}
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FormFields
              name="email"
              label={t('fields.email.label')}
              required
              control={form.control}
              render={({ field }) => (
                <Input placeholder={t('fields.email.placeholder')} {...field} />
              )}
            />
            <FormFields
              name="phoneNumber"
              label={t('fields.phoneNumber.label')}
              required
              control={form.control}
              render={({ field }) => (
                <TelephoneInput
                  placeholder={t('fields.phoneNumber.placeholder')}
                  {...field}
                />
              )}
            />
            <FormFields
              name="phoneNumberAdditional"
              label={t('fields.phoneNumberAdditional.label')}
              control={form.control}
              render={({ field }) => (
                <TelephoneInput
                  placeholder={t('fields.phoneNumberAdditional.placeholder')}
                  {...field}
                />
              )}
            />
          </div>
        </div>
        <Separator />
        {/* Address Information */}
        <div>
          <h2 className="font-header text-xl">
            {t('sections.addressInfo.title')}
          </h2>
          <p className="font-body-2 text-muted-foreground mb-6">
            {t('sections.addressInfo.description')}
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormFields
              name="countryOfResidence"
              label={t('fields.countryOfResidence.label')}
              required
              control={form.control}
              render={({ field }) => (
                <Combobox
                  searchable
                  options={countryOfResidenceOptions}
                  placeholder={t('fields.countryOfResidence.placeholder')}
                  {...field}
                />
              )}
            />
            <FormFields
              name="addressLine1"
              label={t('fields.addressLine1.label')}
              required
              control={form.control}
              render={({ field }) => (
                <Input
                  placeholder={t('fields.addressLine1.placeholder')}
                  {...field}
                />
              )}
            />
            <FormFields
              name="addressLine2"
              label={t('fields.addressLine2.label')}
              control={form.control}
              render={({ field }) => (
                <Input
                  placeholder={t('fields.addressLine2.placeholder')}
                  {...field}
                />
              )}
            />
            <FormFields
              name="city"
              label={t('fields.city.label')}
              control={form.control}
              render={({ field }) => (
                <Input placeholder={t('fields.city.placeholder')} {...field} />
              )}
            />
            <FormFields
              name="state"
              label={t('fields.state.label')}
              control={form.control}
              render={({ field }) => (
                <Input placeholder={t('fields.state.placeholder')} {...field} />
              )}
            />
            <FormFields
              name="zipCode"
              label={t('fields.zipCode.label')}
              control={form.control}
              render={({ field }) => (
                <Input
                  placeholder={t('fields.zipCode.placeholder')}
                  {...field}
                />
              )}
            />
          </div>
        </div>
        <Separator />
        {/* Employment & Nationality */}
        <div>
          <h2 className="font-header text-xl">
            {t('sections.employmentInfo.title')}
          </h2>
          <p className="font-body-2 text-muted-foreground mb-6">
            {t('sections.employmentInfo.description')}
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormFields
              name="countryOfEmployment"
              label={t('fields.countryOfEmployment.label')}
              required
              control={form.control}
              loading={isLoadingCountries}
              render={({ field }) => (
                <Combobox
                  searchable
                  disabled={!id && countryOfEmployment !== 'all'}
                  options={memoCountries}
                  placeholder={t('fields.countryOfEmployment.placeholder')}
                  {...field}
                />
              )}
            />
            <FormFields
              name="partner"
              label={t('fields.partner.label')}
              required
              control={form.control}
              loading={isLoadingPartners}
              render={({ field }) => (
                <Combobox
                  searchable
                  disabled={!id && partner !== 'all'}
                  options={memoPartners}
                  placeholder={t('fields.partner.placeholder')}
                  {...field}
                />
              )}
            />
            <FormFields
              name="nationality"
              label={t('fields.nationality.label')}
              control={form.control}
              render={({ field }) => (
                <Combobox
                  searchable
                  options={countryOfResidenceOptions}
                  placeholder={t('fields.nationality.placeholder')}
                  {...field}
                />
              )}
            />
            <FormFields
              name="preferredJobTitle"
              label={t('fields.preferredJobTitle.label')}
              control={form.control}
              loading={isLoadingVacancies}
              render={({ field }) => (
                <Combobox
                  searchable
                  options={memoVacancies}
                  placeholder={t('fields.preferredJobTitle.placeholder')}
                  {...field}
                />
              )}
            />
            <FormFields
              name="languages"
              label={t('fields.languages.label')}
              control={form.control}
              render={({ field }) => (
                <Combobox
                  multiple
                  searchable
                  options={languagesOptions}
                  placeholder={t('fields.languages.placeholder')}
                  {...field}
                />
              )}
            />
          </div>
        </div>
        <Separator />
        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button">
            {t('buttons.cancel')}
          </Button>
          <Button type="submit" disabled={isPendingCreateApplicant}>
            {t('buttons.submit')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ApplicantUserInfo;
