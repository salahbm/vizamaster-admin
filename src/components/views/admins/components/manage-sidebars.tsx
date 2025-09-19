'use client';

import { useEffect, useMemo } from 'react';

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

import { Users } from '@/generated/prisma';
import {
  useSidebar,
  useSidebarTable,
  useUpdateAdminSidebars,
} from '@/hooks/settings/sidebar';

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
  const { data: sidebars = [], isLoading } = useSidebarTable({
    sort: { id: 'createdAt', desc: true },
  });
  const { data: adminSidebars = [], isLoading: adminSidebarsLoading } =
    useSidebar();
  const { mutateAsync: updateSidebars, isPending } = useUpdateAdminSidebars();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      sidebarIds: [],
    },
  });

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

  useEffect(() => {
    if (adminSidebars) {
      form.reset({
        sidebarIds: adminSidebars.map((sidebar) => sidebar?.id),
      });
    }
  }, [form, adminSidebars]);

  if (isLoading) return null;

  const onSubmit = async (data: z.infer<typeof schema>) => {
    await updateSidebars({ id: user.id, data });
    onClose();
  };

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
              loading={adminSidebarsLoading}
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
