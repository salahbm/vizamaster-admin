'use client';

import { useEffect, useMemo } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

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
import { TUpdateSidebarDto, updateSidebarDto } from '@/server/common/dto';

import { sidebarDefaultValues } from './defaults';

interface IUpsertSidebarProps {
  id?: string;
}

const UpsertSidebar: React.FC<IUpsertSidebarProps> = ({ id }) => {
  const t = useTranslations('sidebar');
  const router = useRouter();
  const { data: sidebarData, isLoading: isLoadingDetail } =
    useSidebarDetail(id);
  const { data: allSidebars, isLoading: isLoadingSidebars } = useSidebar();

  const { mutateAsync: createSidebar } = useCreateSidebar();
  const { mutateAsync: updateSidebarById } = useUpdateSidebarById();

  // Initialize form with default values
  const form = useForm<TUpdateSidebarDto>({
    resolver: zodResolver(updateSidebarDto),
    defaultValues: sidebarDefaultValues(),
  });

  // Update form values when sidebar data is loaded (for edit mode)
  useEffect(() => {
    if (sidebarData) form.reset(sidebarDefaultValues(sidebarData));
  }, [sidebarData, form]);

  // Prepare parent sidebar options for dropdown
  const parentOptions = useMemo(() => {
    if (!allSidebars || isLoadingSidebars) return [];

    const sidebarItems = Array.isArray(allSidebars) ? allSidebars : [];

    return sidebarItems
      .filter((item) => item.id !== id) // Filter out current sidebar to prevent self-reference
      .map((item) => ({
        value: item.id,
        label: `${item.labelEn} (${item.href})`,
      }));
  }, [allSidebars, id, isLoadingSidebars]);

  // Handle form submission
  const onSubmit = async (values: TUpdateSidebarDto) => {
    console.info('Submitting values:', values);

    if (id) {
      // Pass as an array of parameters [id, data]
      await updateSidebarById(values);
    } else {
      await createSidebar(values);
    }
  };

  if (isLoadingDetail && id) return <Loader />;

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
            onSubmit={form.handleSubmit(onSubmit, handleFormError)}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              {/* English Label */}
              <FormFields
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
              <FormFields
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
            <FormFields
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
              <FormFields
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
              <FormFields
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
            <FormFields
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
