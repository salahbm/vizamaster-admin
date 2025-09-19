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
  useCodeDetail,
  useCreateCode,
  useUpdateCodeById,
} from '@/hooks/settings/codes';
import { useGroupCodes } from '@/hooks/settings/group-codes';
import { TCodesDto, codesDto } from '@/server/common/dto/codes.dto';

import { codesDefaultValues } from './defaults';

interface IUpsertGroupCodeProps {
  id?: string;
}

const UpsertCode: React.FC<IUpsertGroupCodeProps> = ({ id }) => {
  const t = useTranslations('groupCodes');
  const router = useRouter();

  // ───────────────── QUERIES ────────────────── //
  const { data: codes, isLoading: isLoadingDetail } = useCodeDetail(id);
  const { data: groupCodes, isLoading: isLoadingGroupCodes } = useGroupCodes({
    page: 1,
    size: 100,
    search: '',
    sort: [{ id: 'createdAt', desc: false }],
  });

  // ───────────────── MUTATIONS ────────────────── //
  const { mutateAsync: createCode } = useCreateCode();
  const { mutateAsync: updateCodeById } = useUpdateCodeById();

  // Initialize form with default values
  const form = useForm<TCodesDto>({
    resolver: zodResolver(codesDto),
    defaultValues: codesDefaultValues(),
  });

  // Update form values when sidebar data is loaded (for edit mode)
  useEffect(() => {
    if (codes) form.reset(codesDefaultValues(codes));
  }, [codes, form]);

  const codeOptions = useMemo(() => {
    return (
      groupCodes?.data?.map((item) => ({
        value: item.id,
        label: item.labelEn,
      })) || []
    );
  }, [groupCodes]);

  if (isLoadingDetail && id) return <Loader />;

  // Handle form submission
  const onSubmit = async (values: TCodesDto) => {
    if (id) {
      await updateCodeById({ ...values, id });
    } else {
      await createCode(values);
    }
    router.back();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, handleFormError)}
        className="space-y-6 py-6"
      >
        {/* Group Code */}
        <FormFields
          name="groupCodeId"
          label={t('form.groupCode')}
          required
          control={form.control}
          loading={isLoadingGroupCodes}
          render={({ field }) => (
            <Combobox
              placeholder={t('form.groupCodePlaceholder')}
              options={codeOptions}
              {...field}
            />
          )}
          message={t('form.groupCodeMessage')}
        />

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
            <Input
              placeholder={t('form.codePlaceholder')}
              {...field}
              disabled={!!id}
            />
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

export default UpsertCode;
