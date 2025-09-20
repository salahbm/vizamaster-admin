'use client';

import { useEffect, useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { FormFields } from '@/components/shared/form-fields';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Loader from '@/components/ui/loader';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { handleFormError } from '@/lib/utils';

import { useCodes } from '@/hooks/settings/codes';
import {
  useCreateSidebar,
  useSidebar,
  useSidebarDetail,
  useUpdateSidebarById,
} from '@/hooks/settings/sidebar';

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
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations();

  const [tab, setTab] = useState<'dependent' | 'independent'>('dependent');

  // ───────────────── QUERIES ────────────────── //
  const { data: sidebarData, isLoading: isLoadingDetail } =
    useSidebarDetail(id);
  const { data: allSidebars, isLoading: isLoadingSidebars } = useSidebar();

  const { data: partners, isLoading: isLoadingPartners } = useCodes({
    page: 1,
    size: 100,
    groupCode: 'group-partners',
  });

  // ───────────────── MUTATIONS ────────────────── //
  const { mutateAsync: createSidebar } = useCreateSidebar();
  const { mutateAsync: updateSidebarById } = useUpdateSidebarById();

  // Initialize form with default values
  const form = useForm<TSidebarFormSchema>({
    resolver: zodResolver(sidebarFormSchema),
    defaultValues: sidebarDefaultValues(),
  });

  // Update form values when sidebar data is loaded (for edit mode)
  useEffect(() => {
    if (sidebarData) form.reset(sidebarDefaultValues(sidebarData));
  }, [sidebarData, form]);

  const parentOptions = useMemo(() => {
    if (!allSidebars || isLoadingSidebars) return [];

    const sidebarItems = Array.isArray(allSidebars) ? allSidebars : [];

    return sidebarItems
      .filter((item) => item.id !== id)
      .map((item) => ({
        value: item.id,
        label: locale === 'en' ? item.labelEn : item.labelRu,
        className: 'capitalize',
      }));
  }, [allSidebars, id, isLoadingSidebars, locale]);

  // ───────────────── HANDLERS ────────────────── //

  const partnerOptions = useMemo(() => {
    if (!partners || isLoadingPartners) return [];

    const partnerItems = Array.isArray(partners?.data) ? partners.data : [];

    return partnerItems.map((item) => ({
      value: item.code,
      label: locale === 'en' ? item.labelEn : item.labelRu,
      className: 'capitalize',
    }));
  }, [partners, isLoadingPartners, locale]);

  // Handle form submission
  const onSubmit = async (values: TSidebarFormSchema) => {
    const mapped = mapFormIntoSubmitData(values);
    if (id) {
      await updateSidebarById({ ...mapped, id, order: Number(values.order) });
    } else {
      await createSidebar({ ...mapped, order: Number(values.order) });
    }
    router.back();
  };

  const handleTab = (tab: string) => {
    if (tab === 'dependent') {
      form.setValue('independent', false);
      form.setValue('href', '');
      form.setValue('parentId', '');
      setTab('dependent');
      form.clearErrors();
    } else {
      form.setValue('independent', true);
      form.setValue('country', '');
      form.setValue('partner', '');
      setTab('independent');
      form.clearErrors();
    }
  };

  // Helper function to get ID from code
  const getHrefFromId = (id: string) => {
    return allSidebars?.find((item) => item.id === id)?.href;
  };

  if (isLoadingDetail && id) return <Loader />;
  console.log(form.getValues());

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, handleFormError)}
        className="space-y-8 py-6"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* English Label */}
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

          {/* Russian Label */}
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

        <div className="grid gap-6 md:grid-cols-2">
          {/* Icon */}
          <FormFields
            name="icon"
            label={t('sidebar.form.icon')}
            control={form.control}
            render={({ field }) => (
              <Input placeholder="LayoutDashboard" {...field} />
            )}
          />

          {/* Order */}
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
        <Separator />
        <div className="space-y-4">
          <Tabs value={tab} onValueChange={handleTab} className="w-full">
            <TabsList className="mb-2">
              <TabsTrigger value="dependent" className="font-body-1">
                {t('sidebar.form.dependent')}
              </TabsTrigger>
              <TabsTrigger value="independent" className="font-body-1">
                {t('sidebar.form.independent')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dependent" className="space-y-6 pt-2">
              <FormFields
                name="child"
                label={t('sidebar.form.routeType') || 'Route Type'}
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

              <FormFields
                name="country"
                label={t('sidebar.form.country')}
                control={form.control}
                render={({ field }) => (
                  <Combobox
                    placeholder={t('sidebar.form.countryPlaceholder')}
                    options={parentOptions}
                    searchable
                    label={
                      parentOptions.find(
                        (item) => item.value === form.watch('parentId'),
                      )?.label
                    }
                    {...field}
                    onChange={(val) => {
                      field.onChange(val);
                      form.setValue('parentId', val as string);
                      const country = getHrefFromId(val as string);
                      if (country) {
                        form.setValue('country', country);
                      }
                    }}
                  />
                )}
              />
              <FormFields
                name="partner"
                label={t('sidebar.form.partner')}
                control={form.control}
                render={({ field }) => (
                  <Combobox
                    placeholder={t('sidebar.form.partnerPlaceholder')}
                    options={partnerOptions}
                    searchable
                    disabled={form.watch('child') === 'false'}
                    {...field}
                  />
                )}
                message={t('sidebar.form.availableForChildOnly')}
              />
            </TabsContent>

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

                {/* Parent Sidebar */}
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
        </div>

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
