'use client';

import { useEffect, useMemo } from 'react';

import { useRouter } from 'next/navigation';

// Form and validation
import { zodResolver } from '@hookform/resolvers/zod';
// Internationalization
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

// UI Components
import { FormFields } from '@/components/shared/form-fields';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Loader from '@/components/ui/loader';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Utilities
import { handleFormError, mapOptions } from '@/lib/utils';

// Data fetching hooks
import { useCodes } from '@/hooks/settings/codes';
import {
  useCreateSidebar,
  useSidebarDetail,
  useSidebarTable,
  useUpdateSidebarById,
} from '@/hooks/settings/sidebar';

// Form schema and utilities
import {
  TSidebarFormSchema,
  mapFormIntoSubmitData,
  sidebarDefaultValues,
  sidebarFormSchema,
} from './defaults';

interface IUpsertSidebarProps {
  id?: string;
}

const UpsertSidebar: React.FC<IUpsertSidebarProps> = ({ id }) => {
  // ───────────────── HOOKS & STATE ────────────────── //
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations();

  // ───────────────── DATA FETCHING ────────────────── //

  const { data: countries } = useCodes({
    page: 1,
    size: 100,
    groupCode: 'group-countries',
  });
  const { data: partners } = useCodes({
    page: 1,
    size: 100,
    groupCode: 'group-partners',
  });
  const { data: allSidebars } = useSidebarTable({
    sort: [{ id: 'createdAt', desc: true }],
  });
  const { data: sidebarData, isLoading: isLoadingDetail } =
    useSidebarDetail(id);

  // ───────────────── MUTATIONS ────────────────── //
  const { mutateAsync: createSidebar } = useCreateSidebar();
  const { mutateAsync: updateSidebarById } = useUpdateSidebarById();

  // ───────────────── FORM SETUP ────────────────── //
  const form = useForm<TSidebarFormSchema>({
    resolver: zodResolver(sidebarFormSchema),
    defaultValues: sidebarDefaultValues(),
  });

  // Load existing data when in edit mode
  useEffect(() => {
    if (sidebarData) {
      form.reset(sidebarDefaultValues(sidebarData));
    }
  }, [sidebarData, form]);

  // ───────────────── DERIVED DATA ────────────────── //
  const parentOptions = useMemo(() => {
    return (
      allSidebars
        ?.filter((item) => item.id !== id) // Filter out current sidebar to prevent self-reference
        ?.filter((item) => !item.parentId) // Filter out child sidebars
        ?.map((item) => ({
          id: item.href,
          value: item.id,
          label: locale === 'en' ? item.labelEn : item.labelRu,
          className: 'capitalize',
        })) ?? []
    );
  }, [allSidebars, id, locale]);

  const { memoCountries, memoPartners } = useMemo(() => {
    return {
      memoCountries: mapOptions(countries?.data, locale),
      memoPartners: mapOptions(partners?.data, locale),
    };
  }, [countries, partners, locale]);

  const independent = form.watch('independent');
  const currentTab = independent ? 'independent' : 'dependent';

  // ───────────────── EVENT HANDLERS ────────────────── //
  /**
   * Handles tab change between dependent and independent routes
   * Resets relevant form fields based on selected tab
   */
  const handleTab = (tab: string) => {
    if (tab === 'dependent') {
      form.setValue('independent', false);
      form.setValue('href', '');
      form.setValue('parentId', '');
      form.setValue('independent', false);
    } else {
      form.setValue('independent', true);
      form.setValue('country', '');
      form.setValue('partner', '');
      form.setValue('independent', true);
    }
    form.clearErrors();
  };

  /**
   * Handles form submission
   * Maps form data to API format and calls create/update mutation
   */
  const onSubmit = async (values: TSidebarFormSchema) => {
    const mapped = mapFormIntoSubmitData(values);
    const orderValue = Number(values.order);

    if (id) {
      await updateSidebarById({ ...mapped, id, order: orderValue });
    } else {
      await createSidebar({ ...mapped, order: orderValue });
    }

    router.back();
  };

  // Show loader while fetching sidebar data in edit mode
  if (isLoadingDetail && id) return <Loader />;

  // ───────────────── RENDER ────────────────── //
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, handleFormError)}
        className="space-y-8 py-6"
      >
        {/* Basic Information Section */}
        <section aria-labelledby="basic-info-section">
          {/* Labels (English/Russian) */}
          <div className="grid gap-6 md:grid-cols-2">
            <FormFields
              name="labelEn"
              label={t('sidebar.form.labelEn')}
              required
              control={form.control}
              render={({ field }) => (
                <Input
                  placeholder={t('sidebar.form.labelEnPlaceholder')}
                  {...field}
                />
              )}
            />

            <FormFields
              name="labelRu"
              label={t('sidebar.form.labelRu')}
              required
              control={form.control}
              render={({ field }) => (
                <Input
                  placeholder={t('sidebar.form.labelRuPlaceholder')}
                  {...field}
                />
              )}
            />
          </div>

          {/* Icon and Order */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <FormFields
              name="icon"
              label={t('sidebar.form.icon')}
              control={form.control}
              render={({ field }) => (
                <Input placeholder="LayoutDashboard" {...field} />
              )}
            />

            <FormFields
              name="order"
              label={t('sidebar.form.order')}
              required
              control={form.control}
              render={({ field }) => (
                <Input type="number" min={0} placeholder="0" {...field} />
              )}
            />
          </div>
        </section>

        <Separator />

        {/* Route Configuration Section */}
        <section aria-labelledby="route-config-section" className="space-y-4">
          <Tabs value={currentTab} onValueChange={handleTab} className="w-full">
            <TabsList className="mb-2">
              <TabsTrigger value="dependent" className="font-body-1">
                {t('sidebar.form.dependent')}
              </TabsTrigger>
              <TabsTrigger value="independent" className="font-body-1">
                {t('sidebar.form.independent')}
              </TabsTrigger>
            </TabsList>

            {/* Dependent Route Tab */}
            <TabsContent value="dependent" className="space-y-6 pt-2">
              {/* Route Type Selection */}
              <FormFields
                name="child"
                label={t('sidebar.form.routeType')}
                control={form.control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    className="mt-2 flex items-center justify-normal gap-6"
                    onChange={(val) => {
                      field.onChange(val);
                      if (val === 'false') form.setValue('partner', '');
                    }}
                  >
                    <div className="flex items-center gap-x-3">
                      <RadioGroupItem value="false" id="parent-dependent" />
                      <label htmlFor="parent-dependent" className="font-body-2">
                        {t('sidebar.form.parentRoute')}
                      </label>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <RadioGroupItem value="true" id="child-dependent" />
                      <label htmlFor="child-dependent" className="font-body-2">
                        {t('sidebar.form.childRoute')}
                      </label>
                    </div>
                  </RadioGroup>
                )}
              />

              {/* Country Selection */}
              <FormFields
                name="country"
                label={t('sidebar.form.country')}
                control={form.control}
                render={({ field }) => (
                  <Combobox
                    placeholder={t('sidebar.form.countryPlaceholder')}
                    options={memoCountries}
                    searchable
                    {...field}
                    onChange={(val) => {
                      field.onChange(val);
                      const findParentId = parentOptions?.find((item) => {
                        const segments = item.id.split('/');
                        const country = segments[2];
                        return country === val;
                      })?.value;
                      if (findParentId && form.watch('child') === 'true') {
                        form.setValue('parentId', findParentId);
                      }
                    }}
                  />
                )}
              />

              {/* Partner Selection */}
              <FormFields
                name="partner"
                label={t('sidebar.form.partner')}
                control={form.control}
                render={({ field }) => (
                  <Combobox
                    placeholder={t('sidebar.form.partnerPlaceholder')}
                    options={memoPartners}
                    searchable
                    disabled={form.watch('child') === 'false'}
                    {...field}
                  />
                )}
                message={t('sidebar.form.availableForChildOnly')}
              />
            </TabsContent>

            {/* Independent Route Tab */}
            <TabsContent value="independent" className="space-y-6 pt-2">
              {/* URL Path */}
              <FormFields
                name="href"
                label={t('sidebar.form.href')}
                required={form.watch('independent')}
                control={form.control}
                render={({ field }) => (
                  <Input placeholder="/dashboard" {...field} />
                )}
                message={t('sidebar.form.hrefMessage')}
              />

              <div className="space-y-4">
                {/* Route Type Selection */}
                <FormFields
                  name="child"
                  label={t('sidebar.form.routeType')}
                  control={form.control}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      className="mt-2 flex items-center justify-normal gap-6"
                      onChange={(val) => {
                        field.onChange(val);
                        if (val === 'false') form.setValue('parentId', '');
                      }}
                    >
                      <div className="flex items-center gap-x-3">
                        <RadioGroupItem value="false" id="parent-independent" />
                        <label
                          htmlFor="parent-independent"
                          className="font-body-2"
                        >
                          {t('sidebar.form.parentRoute')}
                        </label>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <RadioGroupItem value="true" id="child-independent" />
                        <label
                          htmlFor="child-independent"
                          className="font-body-2"
                        >
                          {t('sidebar.form.childRoute')}
                        </label>
                      </div>
                    </RadioGroup>
                  )}
                />

                {/* Parent Sidebar Selection */}
                <FormFields
                  name="parentId"
                  label={t('sidebar.form.parentId')}
                  control={form.control}
                  render={({ field }) => (
                    <Combobox
                      placeholder={t('sidebar.form.parentIdPlaceholder')}
                      options={parentOptions}
                      searchable
                      disabled={form.watch('child') === 'false'}
                      {...field}
                    />
                  )}
                  message={t('sidebar.form.availableForChildOnly')}
                />
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            {t('Common.cancel')}
          </Button>
          <Button type="submit">
            {id ? t('sidebar.form.update') : t('sidebar.form.create')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpsertSidebar;
