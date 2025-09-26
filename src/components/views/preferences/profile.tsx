'use client';

import Image from 'next/image';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, LogOut, Save, Trash2, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormFields } from '@/components/shared/form-fields';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input, PasswordInput } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  useDeleteAdmin,
  useUpdateAdminPassword,
  useUpdateAdminProfile,
} from '@/hooks/admins';
import { useLogout } from '@/hooks/auth/use-logout';
import { useAlert } from '@/providers/alert';
import {
  AdminProfileDto,
  TAdminProfileDto,
} from '@/server/common/dto/admin.dto';
import { useAuthStore } from '@/store/use-auth-store';

const passwordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const Profile = () => {
  const t = useTranslations('preferences');
  const alert = useAlert();
  const { user } = useAuthStore();

  const { mutate: updateProfile, isPending: isUpdating } =
    useUpdateAdminProfile();
  const { mutate: updatePassword, isPending: isUpdatingPassword } =
    useUpdateAdminPassword();
  const { mutate: logout } = useLogout();
  const { mutateAsync: deleteAdmin } = useDeleteAdmin();

  // Profile form
  const profileForm = useForm<TAdminProfileDto>({
    resolver: zodResolver(AdminProfileDto),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Form submission handlers

  const onProfileSubmit = async (data: TAdminProfileDto) => {
    updateProfile(data, {
      onSuccess: () => {
        alert({
          title: t('success'),
          description: t('profileUpdated'),
          confirmText: t('ok'),
          cancelButton: null,
        });
      },
    });
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    updatePassword(data, {
      onSuccess: () => {
        alert({
          title: t('success'),
          description: t('passwordChanged'),
          confirmText: t('ok'),
          cancelButton: null,
        });
        passwordForm.reset();
      },
    });
  };

  const handleLogout = () => {
    alert({
      title: t('logout'),
      description: t('logoutConfirmation'),
      onConfirm: () => logout(),
      confirmText: t('logout'),
      cancelText: t('cancel'),
    });
  };

  const handleDeleteAccount = () => {
    alert({
      title: t('deleteAccount'),
      description: t('deleteAccountConfirmation'),
      onConfirm: () => deleteAdmin(user?.id!),
      confirmText: t('delete'),
      cancelText: t('cancel'),
    });
  };

  return (
    <div className="space-y-6">
      <div className="ml-4 flex flex-col space-y-2">
        <h1 className="font-header text-3xl">{t('profile')}</h1>
        <p className="font-body-2 text-muted-foreground">
          {t('manageYourAccount')}
        </p>
      </div>

      <div className="space-y-6">
        {/* User info card */}

        <div className="bg-muted ring-primary/20 relative mx-auto h-32 w-32 overflow-hidden rounded-full ring-2">
          <div className="from-primary/5 to-primary/30 absolute inset-0 bg-gradient-to-br" />
          {user?.image ? (
            <Image
              src={user.image!}
              alt={user.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="from-primary/80 to-primary flex h-full w-full items-center justify-center bg-gradient-to-br text-2xl text-white">
              <User className="h-16 w-16" />
            </div>
          )}
        </div>

        {/* Settings tabs */}

        <Tabs defaultValue="profile">
          <TabsList className="mx-auto md:w-1/2">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              {t('profileInfo')}
            </TabsTrigger>
            <TabsTrigger value="security">
              <LogOut className="mr-2 h-4 w-4" />
              {t('security')}
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="card-md from-card to-card/95 bg-gradient-to-br">
              <div className="mb-6">
                <h3 className="font-header text-lg">{t('profileInfo')}</h3>
                <p className="text-muted-foreground text-sm">
                  {t('updateYourPersonalInformation')}
                </p>
              </div>
              <div className="space-y-6">
                <Form {...profileForm}>
                  <form
                    onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                    className="space-y-4"
                  >
                    <FormFields
                      name="name"
                      label={t('name')}
                      required
                      control={profileForm.control}
                      render={({ field }) => (
                        <Input placeholder={t('name')} {...field} />
                      )}
                    />

                    <FormFields
                      name="email"
                      label={t('email')}
                      required
                      control={profileForm.control}
                      render={({ field }) => (
                        <Input
                          placeholder={t('email')}
                          type="email"
                          {...field}
                        />
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={
                        isUpdating ||
                        profileForm.formState.isSubmitting ||
                        !profileForm.formState.isValid
                      }
                    >
                      {profileForm.formState.isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      <Save className="mr-2 h-4 w-4" />
                      {t('saveChanges')}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="card-md from-card to-card/95 bg-gradient-to-br">
              <div className="mb-6">
                <h3 className="font-header text-lg">{t('changePassword')}</h3>
                <p className="text-muted-foreground text-sm">
                  {t('updateYourPassword')}
                </p>
              </div>
              <div className="space-y-6">
                <Form {...passwordForm}>
                  <form
                    onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                    className="space-y-4"
                  >
                    <FormFields
                      name="currentPassword"
                      label={t('currentPassword')}
                      required
                      control={passwordForm.control}
                      render={({ field }) => <PasswordInput {...field} />}
                    />
                    <FormFields
                      name="newPassword"
                      label={t('newPassword')}
                      required
                      control={passwordForm.control}
                      render={({ field }) => <PasswordInput {...field} />}
                    />
                    <FormFields
                      name="confirmPassword"
                      label={t('confirmPassword')}
                      required
                      control={passwordForm.control}
                      render={({ field }) => <PasswordInput {...field} />}
                    />
                    <Button
                      type="submit"
                      disabled={
                        isUpdatingPassword ||
                        passwordForm.formState.isSubmitting
                      }
                    >
                      {passwordForm.formState.isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {t('updatePassword')}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="card-md border-destructive from-destructive/5 to-destructive/10 bg-gradient-to-br">
              <div className="mb-6">
                <h3 className="font-header text-destructive text-lg">
                  {t('dangerZone')}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t('dangerZoneDescription')}
                </p>
              </div>
              <div className="space-y-6">
                <div className="border-destructive bg-destructive/10 text-destructive rounded-md border p-4">
                  <h4 className="font-medium">{t('deleteAccount')}</h4>
                  <p className="mt-1 text-sm">{t('deleteAccountWarning')}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('deleteAccount')}
                  </Button>
                  <Button
                    variant="outline"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    {t('logout')}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export { Profile };
