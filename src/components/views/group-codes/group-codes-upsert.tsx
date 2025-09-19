'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { FormFields } from '@/components/shared/form-fields';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Loader from '@/components/ui/loader';

import { handleFormError } from '@/lib/utils';

import {
  useCreateGroupCode,
  useGroupCodeDetail,
  useUpdateGroupCodeById,
} from '@/hooks/settings/group-codes';
import {
  TGroupCodesDto,
  groupCodesDto,
} from '@/server/common/dto/group-codes.dto';

import { groupCodesDefaultValues } from './defaults';

interface IUpsertGroupCodeProps {
  id?: string;
}

const UpsertGroupCode: React.FC<IUpsertGroupCodeProps> = ({ id }) => {
  const t = useTranslations('groupCodes');
  const router = useRouter();

  // ───────────────── QUERIES ────────────────── //
  const { data: groupCodeData, isLoading: isLoadingDetail } =
    useGroupCodeDetail(id);

  // ───────────────── MUTATIONS ────────────────── //
  const { mutateAsync: createGroupCode } = useCreateGroupCode();
  const { mutateAsync: updateGroupCodeById } = useUpdateGroupCodeById();

  // Initialize form with default values
  const form = useForm<TGroupCodesDto>({
    resolver: zodResolver(groupCodesDto),
    defaultValues: groupCodesDefaultValues(),
  });

  // Update form values when sidebar data is loaded (for edit mode)
  useEffect(() => {
    if (groupCodeData) form.reset(groupCodesDefaultValues(groupCodeData));
  }, [groupCodeData, form]);

  if (isLoadingDetail && id) return <Loader />;

  // Handle form submission
  const onSubmit = async (values: TGroupCodesDto) => {
    if (id) {
      await updateGroupCodeById({ ...values, id });
    } else {
      await createGroupCode(values);
    }
    router.back();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, handleFormError)}
        className="space-y-6 py-6"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* English Label */}
          <FormFields
            name="labelEn"
            label={t('form.labelEn')}
            required
            control={form.control}
            render={({ field }) => (
              <Input placeholder={t('form.labelEnPlaceholder')} {...field} />
            )}
          />

          {/* Russian Label */}
          <FormFields
            name="labelRu"
            label={t('form.labelRu')}
            required
            control={form.control}
            render={({ field }) => (
              <Input placeholder={t('form.labelRuPlaceholder')} {...field} />
            )}
          />
        </div>

        {/* URL Path */}
        <FormFields
          name="code"
          label={t('form.code')}
          required
          control={form.control}
          render={({ field }) => (
            <Input placeholder="group-code" {...field} disabled={!!id} />
          )}
          message={t('form.codeMessage')}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            {t('form.cancel')}
          </Button>
          <Button type="submit">
            {id ? t('form.update') : t('form.create')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpsertGroupCode;
