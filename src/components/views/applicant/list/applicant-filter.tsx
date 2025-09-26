'use client';

import { Fragment } from 'react';

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

import { useCodesStore } from '@/store/use-codes-store';

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

const statusOptions = [
  { value: 'all', label: 'Common.all' },
  { value: 'NEW', label: 'Common.statuses.new' },
  {
    value: 'IN_PROGRESS',
    label: 'Common.statuses.inProgress',
  },
  {
    value: 'CONFIRMED_PROGRAM',
    label: 'Common.statuses.confirmedProgram',
  },
  { value: 'HIRED', label: 'Common.statuses.hired' },
  {
    value: 'HOTEL_REJECTED',
    label: 'Common.statuses.hotelRejected',
  },
  { value: 'FIRED', label: 'Common.statuses.fired' },
  {
    value: 'APPLICANT_REJECTED',
    label: 'Common.statuses.applicantRejected',
  },
];

const ApplicantFilter: React.FC<IApplicantFilterProps> = ({
  form,
  onSubmit,
  handleReset,
  country,
}) => {
  const locale = useLocale();
  const t = useTranslations();

  // QUERIES
  const { options: countryOptions } = useCodesStore();
  const { options: partnerOptions } = useCodesStore();
  const { options: vacancyOptions } = useCodesStore();

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
            className="shrink-0 md:w-[30rem]"
            render={({ field }) => (
              <Input
                id="search"
                type="search"
                placeholder={t('Common.searchIdName')}
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
                className="shrink-0 md:w-[30rem]"
                render={({ field }) => (
                  <Combobox
                    id="country"
                    placeholder={t('Common.country')}
                    options={countryOptions('group-countries', locale)}
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
                className="shrink-0 md:w-[30rem]"
                render={({ field }) => (
                  <Combobox
                    id="partner"
                    placeholder={t('Common.partner')}
                    options={partnerOptions('group-partners', locale)}
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
            className="shrink-0 md:w-[30rem]"
            control={form.control}
            render={({ field }) => (
              <Combobox
                id="jobTitle"
                placeholder={t('Common.jobTitle')}
                options={vacancyOptions('group-vacancies', locale)}
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
            render={({ field }) => (
              <RadioGroup
                {...field}
                defaultValue="all"
                className="font-body-2 flex flex-wrap items-center justify-start gap-4"
              >
                {statusOptions.map((option) => (
                  <div key={option.value} className="flex items-center gap-2">
                    <RadioGroupItem id={option.value} value={option.value} />
                    <Label className="font-body-2" htmlFor={option.value}>
                      {t(option.label)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        </fieldset>
        <div className="border-border flex flex-wrap justify-end gap-2 border-t pt-4">
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
