'use client';

import { useEffect, useMemo } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { FormFields } from '@/components/shared/form-fields';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Loader from '@/components/ui/loader';

import { handleFormError } from '@/lib/utils';

import {
  useCreateSidebar,
  useSidebar,
  useSidebarDetail,
  useUpdateSidebarById,
} from '@/hooks/settings/sidebar';
import { createSidebarDto } from '@/server/common/dto';

import { sidebarDefaultValues } from './defaults';

interface IUpsertSidebarProps {
  id?: string;
}

// Define the form schema using Zod

// Infer the form values type from the schema
type SidebarFormValues = z.infer<typeof createSidebarDto>;

const UpsertSidebar: React.FC<IUpsertSidebarProps> = ({ id }) => {
  const t = useTranslations('sidebar');
  const router = useRouter();
  const { data: sidebarData, isLoading: isLoadingDetail } =
    useSidebarDetail(id);
  const { data: allSidebars, isLoading: isLoadingSidebars } = useSidebar();

  const { mutateAsync: createSidebar } = useCreateSidebar();
  const { mutateAsync: updateSidebarById } = useUpdateSidebarById();

  // Initialize form with default values
  const form = useForm<SidebarFormValues>({
    resolver: zodResolver(createSidebarDto) as any, // Type assertion to fix incompatible resolver types
    defaultValues: sidebarDefaultValues(),
  });

  // Update form values when sidebar data is loaded (for edit mode)
  useEffect(() => {
    if (sidebarData?.data) form.reset(sidebarDefaultValues(sidebarData.data));
  }, [sidebarData, form]);

  // Prepare parent sidebar options for dropdown
  const parentOptions = useMemo(() => {
    if (!allSidebars?.data || isLoadingSidebars) return [];

    const sidebarItems = Array.isArray(allSidebars.data)
      ? allSidebars.data
      : [];

    return sidebarItems
      .filter((item) => item.id !== id) // Filter out current sidebar to prevent self-reference
      .map((item) => ({
        value: item.id,
        label: `${item.labelEn} (${item.href})`,
      }));
  }, [allSidebars, id, isLoadingSidebars]);

  // Handle form submission
  const onSubmit = form.handleSubmit(async (values) => {
    try {
      // Ensure values are properly formatted
      const formattedValues = {
        labelEn: values.labelEn,
        labelRu: values.labelRu,
        href: values.href,
        order: values.order,
        // Convert empty strings to undefined for optional fields
        parentId: values.parentId || undefined,
        icon: values.icon || undefined,
      };

      console.log('Submitting values:', formattedValues);

      if (id) {
        // Pass as an array of parameters [id, data]
        await updateSidebarById([id, formattedValues]);
      } else {
        await createSidebar(formattedValues);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  });

  if (isLoadingDetail && id) return <Loader />;
  console.log(form.getValues());
  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="flex items-center justify-between">
        <h1 className="font-header">
          {id ? t('edit.title') : t('create.title')}
        </h1>
      </div>

      <div className="card-md">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              onSubmit as any,
              handleFormError as any,
            )}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              {/* English Label */}
              <FormFields<SidebarFormValues>
                name="labelEn"
                label={t('form.labelEn')}
                required
                control={form.control}
                render={({ field }) => (
                  <Input
                    placeholder={t('form.labelEnPlaceholder')}
                    {...field}
                  />
                )}
              />

              {/* Russian Label */}
              <FormFields<SidebarFormValues>
                name="labelRu"
                label={t('form.labelRu')}
                required
                control={form.control}
                render={({ field }) => (
                  <Input
                    placeholder={t('form.labelRuPlaceholder')}
                    {...field}
                  />
                )}
              />
            </div>

            {/* URL Path */}
            <FormFields<SidebarFormValues>
              name="href"
              label={t('form.href')}
              required
              control={form.control}
              render={({ field }) => (
                <Input placeholder="/dashboard" {...field} />
              )}
            />

            <div className="grid gap-6 md:grid-cols-2">
              {/* Icon */}
              <FormFields<SidebarFormValues>
                name="icon"
                label={t('form.icon')}
                control={form.control}
                render={({ field }) => (
                  <Input
                    placeholder="lucide-home"
                    {...field}
                    value={field.value || ''}
                  />
                )}
              />

              {/* Order */}
              <FormFields<SidebarFormValues>
                name="order"
                label={t('form.order')}
                required
                control={form.control}
                render={({ field }) => (
                  <Input type="number" min={0} placeholder="0" {...field} />
                )}
              />
            </div>

            {/* Parent Sidebar */}
            <FormFields<SidebarFormValues>
              name="parentId"
              label={t('form.parentId')}
              control={form.control}
              render={({ field }) => (
                <Combobox
                  placeholder={t('form.parentIdPlaceholder')}
                  options={parentOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  searchable
                />
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                {t('form.cancel')}
              </Button>
              <Button type="submit">
                {id ? t('form.update') : t('form.create')}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpsertSidebar;
