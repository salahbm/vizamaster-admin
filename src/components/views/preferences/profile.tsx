'use client';

import { useState } from 'react';

import Image from 'next/image';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, LogOut, Save, Trash2, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormFields } from '@/components/shared/form-fields';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { generateGradientThumbnail } from '@/utils/gradient-bg';

import { useAlert } from '@/providers/alert';

// Define the form schema
const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phoneNumber: z.string().optional(),
});

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

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

interface IProfileProps {}

const Profile: React.FC<IProfileProps> = () => {
  const t = useTranslations('preferences');
  const alert = useAlert();
  const [activeTab, setActiveTab] = useState('profile');

  // Mock user data - replace with actual data fetching
  const userData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1 234 567 8900',
    avatar: '',
    role: 'Administrator',
  };

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
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
  const onProfileSubmit = async (data: ProfileFormValues) => {
    // Here you would implement the API call to update the profile

    // Mock success
    alert({
      title: t('success'),
      description: t('profileUpdated'),
      confirmText: t('ok'),
    });
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    // Here you would implement the API call to change the password

    // Mock success
    alert({
      title: t('success'),
      description: t('passwordChanged'),
      confirmText: t('ok'),
    });
    passwordForm.reset();
  };

  const handleLogout = () => {
    // Here you would implement the logout logic
    alert({
      title: t('logout'),
      description: t('logoutConfirmation'),
      onConfirm: () => {
        // Redirect to login page or call logout API
      },
      confirmText: t('logout'),
    });
  };

  const handleDeleteAccount = () => {
    alert({
      title: t('deleteAccount'),
      description: t('deleteAccountConfirmation'),
      onConfirm: () => {
        // Call account deletion API
      },
      confirmText: t('delete'),
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

        <section className="mx-auto flex flex-col items-center space-y-4 rounded-full md:w-1/2 lg:w-1/3">
          <div className="bg-muted relative h-24 w-24 overflow-hidden rounded-full">
            {userData.avatar ? (
              <Image
                src={userData.avatar}
                alt={`${userData.firstName} ${userData.lastName}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="bg-primary text-primary-foreground flex h-full w-full items-center justify-center text-2xl">
                <Image
                  src={generateGradientThumbnail(
                    userData.firstName[0] + userData.lastName[0],
                  )}
                  alt={`${userData.firstName} ${userData.lastName}`}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
          <div className="space-y-1 text-center">
            <h3 className="font-medium">{userData.email}</h3>
            <p className="text-muted-foreground text-sm">
              {userData.phoneNumber}
            </p>
          </div>
        </section>

        {/* Settings tabs */}
        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
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
              <div className="card-md">
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
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormFields
                          name="firstName"
                          label={t('firstName')}
                          required
                          control={profileForm.control}
                          render={({ field }) => (
                            <Input placeholder={t('firstName')} {...field} />
                          )}
                        />
                        <FormFields
                          name="lastName"
                          label={t('lastName')}
                          required
                          control={profileForm.control}
                          render={({ field }) => (
                            <Input placeholder={t('lastName')} {...field} />
                          )}
                        />
                      </div>
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
                      <FormFields
                        name="phoneNumber"
                        label={t('phoneNumber')}
                        control={profileForm.control}
                        render={({ field }) => (
                          <Input placeholder={t('phoneNumber')} {...field} />
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={profileForm.formState.isSubmitting}
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
              <div className="card-md">
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
                        render={({ field }) => (
                          <Input
                            placeholder="••••••••"
                            type="password"
                            {...field}
                          />
                        )}
                      />
                      <FormFields
                        name="newPassword"
                        label={t('newPassword')}
                        required
                        control={passwordForm.control}
                        render={({ field }) => (
                          <Input
                            placeholder="••••••••"
                            type="password"
                            {...field}
                          />
                        )}
                      />
                      <FormFields
                        name="confirmPassword"
                        label={t('confirmPassword')}
                        required
                        control={passwordForm.control}
                        render={({ field }) => (
                          <Input
                            placeholder="••••••••"
                            type="password"
                            {...field}
                          />
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={passwordForm.formState.isSubmitting}
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

              <div className="card-md border-destructive">
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
                  <div>
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t('deleteAccount')}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export { Profile };
