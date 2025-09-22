'use client';

import { Fragment, useMemo } from 'react';

import { RefreshCw, Search } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';

import { FormFields } from '@/components/shared/form-fields';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { mapOptions } from '@/lib/utils';

import { useCodes } from '@/hooks/settings/codes';

import { applicantQueries } from '../create/applicant.helpers';

export type TApplicantFilter = {
  search: string;
  country: string;
  partner: string;
  status: string;
  jobTitle: string;
};

interface IApplicantFilterProps {
  form: UseFormReturn<TApplicantFilter>;
  onSubmit: (data: TApplicantFilter) => void;
  handleReset: () => void;
  country?: string;
}

const ApplicantFilter: React.FC<IApplicantFilterProps> = ({
  form,
  onSubmit,
  handleReset,
  country,
}) => {
  const locale = useLocale();
  const t = useTranslations();

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

  const { memoCountries, memoPartners, memoVacancies } = useMemo(() => {
    return {
      memoCountries: mapOptions(countries?.data, locale),
      memoPartners: mapOptions(partners?.data, locale),
      memoVacancies: mapOptions(vacancies?.data, locale),
    };
  }, [countries, partners, vacancies, locale]);
  return (
    <Form {...form}>
      <form
        className="card my-5 space-y-6 md:my-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <fieldset className="filter-box">
          <label htmlFor="search" className="filter-label">
            {t('Common.search')}
          </label>
          <FormFields
            name="search"
            control={form.control}
            className="w-full"
            render={({ field }) => (
              <Input
                id="search"
                type="search"
                placeholder={t('Common.searchIdName')}
                className="shrink-0 md:w-[30rem]"
                maxLength={100}
                value={field.value || ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
        </fieldset>
        {country === 'all' ? (
          <Fragment>
            <fieldset className="filter-box">
              <label htmlFor="country" className="filter-label">
                {t('Common.country')}
              </label>
              <FormFields
                name="country"
                control={form.control}
                className="w-full"
                loading={isLoadingCountries}
                render={({ field }) => (
                  <Combobox
                    id="country"
                    placeholder={t('Common.country')}
                    className="shrink-0 md:w-[30rem]"
                    options={memoCountries}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </fieldset>
            <fieldset className="filter-box">
              <label htmlFor="partner" className="filter-label">
                {t('Common.partner')}
              </label>
              <FormFields
                name="partner"
                control={form.control}
                className="w-full"
                loading={isLoadingPartners}
                render={({ field }) => (
                  <Combobox
                    id="partner"
                    placeholder={t('Common.partner')}
                    className="shrink-0 md:w-[30rem]"
                    options={memoPartners}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </fieldset>
          </Fragment>
        ) : null}
        <fieldset className="filter-box">
          <label htmlFor="jobTitle" className="filter-label">
            {t('Common.jobTitle')}
          </label>
          <FormFields
            name="jobTitle"
            className="w-full"
            control={form.control}
            loading={isLoadingVacancies}
            render={({ field }) => (
              <Combobox
                id="jobTitle"
                placeholder={t('Common.jobTitle')}
                className="shrink-0 md:w-[30rem]"
                options={memoVacancies}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
        </fieldset>
        <fieldset className="filter-box">
          <label htmlFor="status" className="filter-label">
            {t('Common.status')}
          </label>
          <FormFields
            name="status"
            control={form.control}
            className="w-full"
            render={({ field }) => (
              <RadioGroup
                {...field}
                defaultValue="all"
                className="font-body-2 flex flex-wrap items-center justify-start gap-4"
              >
                {[
                  { value: 'all', label: t('Common.all') },
                  { value: 'NEW', label: t('Common.statuses.new') },
                  {
                    value: 'IN_PROGRESS',
                    label: t('Common.statuses.inProgress'),
                  },
                  {
                    value: 'CONFIRMED_PROGRAM',
                    label: t('Common.statuses.confirmedProgram'),
                  },
                  { value: 'HIRED', label: t('Common.statuses.hired') },
                  {
                    value: 'HOTEL_REJECTED',
                    label: t('Common.statuses.hotelRejected'),
                  },
                  { value: 'FIRED', label: t('Common.statuses.fired') },
                  {
                    value: 'APPLICANT_REJECTED',
                    label: t('Common.statuses.applicantRejected'),
                  },
                ].map((option) => (
                  <div key={option.value} className="flex items-center gap-2">
                    <RadioGroupItem id={option.value} value={option.value} />
                    <Label className="font-body-2" htmlFor={option.value}>
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        </fieldset>
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            variant="outline"
            className="w-32 max-w-fit"
            type="button"
            onClick={handleReset}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {t('Common.reset')}
          </Button>
          <Button className="w-32 max-w-fit" type="submit">
            <Search className="mr-2 h-4 w-4" />
            {t('Common.search')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ApplicantFilter;
