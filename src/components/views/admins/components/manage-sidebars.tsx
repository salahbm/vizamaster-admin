'use client';

import { useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { InfoIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormFields } from '@/components/shared/form-fields';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import Loader from '@/components/ui/loader';

import { Users } from '@/generated/prisma';
import { useUpdateAdminSidebars } from '@/hooks/admins/use-update-sidebars';
import { useSidebarTable } from '@/hooks/settings/sidebar';

const schema = z.object({
  sidebarIds: z.array(z.string()).min(1, 'Please select at least one sidebar'),
});

type ManageSidebarsProps = {
  user: Users;
  isOpen: boolean;
  onClose: () => void;
};

export const ManageSidebars = ({
  user,
  isOpen,
  onClose,
}: ManageSidebarsProps) => {
  const locale = useLocale();
  const t = useTranslations();
  const { data: sidebars = [], isLoading } = useSidebarTable();
  const { mutateAsync: updateSidebars, isPending } = useUpdateAdminSidebars();

  // Prepare routes
  const routes = useMemo(() => {
    if (!sidebars || isLoading) return [];

    const sidebarItems = Array.isArray(sidebars) ? sidebars : [];

    return sidebarItems.map((item) => ({
      value: item.id,
      label: locale === 'en' ? item.labelEn : item.labelRu,
      className: 'capitalize',
    }));
  }, [sidebars, isLoading, locale]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      sidebarIds: sidebars?.map((s) => s.id) || [],
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    await updateSidebars({ id: user.id, data });
    onClose();
  };

  if (isLoading) return <Loader />;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-fit">
        <DialogHeader>
          <DialogTitle>{t('admins.actions.manageSidebars')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-[360px] flex-col justify-between gap-4"
          >
            <FormFields
              name="sidebarIds"
              control={form.control}
              render={({ field }) => (
                <Combobox
                  multiple
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder={t('admins.placeholders.selectSidebars')}
                  options={routes}
                />
              )}
              message={
                <span className="flex items-center gap-2">
                  <InfoIcon className="size-4" />
                  <span>{t('admins.selectSidebars')}</span>
                </span>
              }
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                {t('Common.cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {t('Common.save')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
