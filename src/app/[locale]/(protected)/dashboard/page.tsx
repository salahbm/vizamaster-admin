'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormFields } from '@/components/shared/form-fields';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import DatePicker from '@/components/ui/dates-picker';
import { Form } from '@/components/ui/form';
import { Input, PasswordInput, TelephoneInput } from '@/components/ui/input';
import Loader from '@/components/ui/loader';
import { Textarea } from '@/components/ui/textarea';

const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long'),
  email: z.email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  description: z.string().optional(),
  telephone: z.string().optional(),
  gender: z.string().optional(),
  returnYear: z.string().optional(),
  returnMonth: z.string().optional(),
  returnDay: z.string().optional(),
  country: z.string().min(2, 'Country must be at least 2 characters long'),
  address: z.string().min(10, 'Address must be at least 10 characters long'),
  postalCode: z.string().min(5, 'Postal code must be at least 5 characters long'),
  city: z.string().min(2, 'City must be at least 2 characters long'),
  province: z.string().min(2, 'Province must be at least 2 characters long'),
  photo: z.string().optional(),
  interests: z.array(z.string()).optional(),
  birthday: z.date().optional(),
  customFormatDate: z.date().optional(),
  minMaxDate: z.date().optional(),
  errorDate: z.date().optional(),
  birthDate: z.date().optional(),
  appointmentDate: z.date().optional(),
});

export default function DashboardPage() {
  const t = useTranslations();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      description: '',
      telephone: '',
      gender: '',
      returnYear: '',
      returnMonth: '',
      returnDay: '',
      country: '',
      address: '',
      postalCode: '',
      city: '',
      province: '',
      photo: '',
      interests: [],
      birthday: undefined,
      customFormatDate: undefined,
      minMaxDate: undefined,
      errorDate: undefined,
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    console.log(data);
  };

  console.log(form.getValues());

  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-6">Theme Demo</h1>

      <h2>{t('Metadata.title')}</h2>
      <p>{t('Metadata.description')}</p>

      <div className="grid gap-8">
        <section className="space-y-4 ">
          <h2 className="text-2xl font-semibold">UI Components</h2>
          <div className="grid gap-6">
            <div className="grid gap-4">
              <h3 className="text-xl font-medium">Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>

            <div className="grid gap-4">
              <h3 className="text-xl font-medium">Cards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="card">
                  <h4 className="font-semibold">Card Title</h4>
                  <p className="text-sm text-muted-foreground">Card description goes here</p>
                </div>
                <div className="card-md">
                  <h4 className="font-semibold">Card Title</h4>
                  <p className="text-sm text-muted-foreground">Card description goes here</p>
                </div>
                <div className="card-lg">
                  <h4 className="font-semibold">Card Title</h4>
                  <p className="text-sm text-muted-foreground">Card description goes here</p>
                </div>
              </div>
            </div>
            <div className="grid gap-4">
              <h3 className="text-xl font-medium">FONTS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="card p-4">
                  <h4 className="font-header">Header</h4>
                  <p className="font-title">Title</p>
                  <p className="font-subtitle">Subtitle</p>
                  <p className="font-body-1">Body 1</p>
                  <p className="font-body-2">Body 2</p>
                  <p className="font-caption-1">Caption 1</p>
                  <p className="font-caption-2">Caption 2</p>
                  <p className="font-caption-3">Caption 3</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormFields
              name="username"
              label="Username"
              required
              control={form.control}
              render={({ field }) => <Input placeholder="Enter username" {...field} />}
            />
            <FormFields
              name="email"
              label="Email"
              required
              control={form.control}
              render={({ field }) => <Input placeholder="Enter email" type="email" {...field} />}
            />
            <FormFields
              name="password"
              label="Password"
              control={form.control}
              render={({ field }) => <PasswordInput placeholder="Enter password" {...field} />}
            />
            <FormFields
              name="description"
              label="Description"
              control={form.control}
              render={({ field }) => <Textarea placeholder="Enter description" {...field} />}
            />
            <FormFields
              name="telephone"
              label="Telephone"
              control={form.control}
              render={({ field }) => <TelephoneInput placeholder="Enter telephone" {...field} />}
            />
            <FormFields
              name="gender"
              label="Gender"
              control={form.control}
              render={({ field }) => (
                <Combobox
                  placeholder="Enter gender"
                  searchable
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                  ]}
                  {...field}
                  onValueChange={field.onChange}
                  value={field.value}
                />
              )}
            />
            <FormFields
              name="interests"
              label="Interests"
              control={form.control}
              render={({ field }) => (
                <Combobox
                  placeholder="Select interests"
                  searchable
                  multiple
                  options={[
                    { value: 'react', label: 'React' },
                    { value: 'vue', label: 'Vue' },
                    { value: 'angular', label: 'Angular' },
                    { value: 'svelte', label: 'Svelte' },
                    { value: 'nextjs', label: 'Next.js' },
                    { value: 'nuxtjs', label: 'Nuxt.js' },
                    { value: 'gatsby', label: 'Gatsby' },
                  ]}
                  onValueChange={field.onChange}
                  value={field.value}
                />
              )}
              message="Please select at least one interest"
              messageClassName="text-red-500"
            />
            <FormFields
              name="birthday"
              label="Birthday"
              control={form.control}
              render={({ field }) => (
                <DatePicker
                  placeholder="Select birthday"
                  value={field.value}
                  onValueChange={field.onChange}
                />
              )}
            />
            <FormFields
              name="country"
              label="Country"
              control={form.control}
              render={({ field }) => <Input placeholder="Enter country" {...field} />}
            />
            <FormFields
              name="address"
              label="Address"
              control={form.control}
              render={({ field }) => <Input placeholder="Enter address" {...field} />}
            />
            <FormFields
              name="postalCode"
              label="Postal Code"
              control={form.control}
              render={({ field }) => (
                <Input type="number" placeholder="Enter postal code" {...field} />
              )}
            />
            <FormFields
              name="city"
              label="City"
              control={form.control}
              render={({ field }) => <Input placeholder="Enter city" {...field} />}
            />
            <FormFields
              name="province"
              label="Province"
              control={form.control}
              render={({ field }) => <Input placeholder="Enter province" {...field} />}
            />
            <FormFields
              name="photo"
              label="Photo"
              control={form.control}
              render={({ field }) => <Input placeholder="Enter photo" {...field} />}
            />

            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-lg font-medium">DatePicker Examples</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Basic DatePicker</p>
                    <FormFields
                      name="birthday"
                      label="Birthday"
                      control={form.control}
                      render={({ field }) => (
                        <DatePicker value={field.value} onValueChange={field.onChange} />
                      )}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">With custom date format</p>
                    <FormFields
                      name="customFormatDate"
                      control={form.control}
                      render={({ field }) => (
                        <DatePicker
                          value={field.value}
                          onValueChange={field.onChange}
                          dateFormat="yyyy-MM-dd"
                        />
                      )}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">With min/max date</p>
                    <FormFields
                      name="minMaxDate"
                      control={form.control}
                      render={({ field }) => (
                        <DatePicker
                          value={field.value}
                          onValueChange={field.onChange}
                          minDate={new Date(2023, 0, 1)}
                          maxDate={new Date(2025, 11, 31)}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">With error state</p>
                    <FormFields
                      name="errorDate"
                      control={form.control}
                      render={({ field }) => (
                        <DatePicker
                          value={field.value}
                          onValueChange={field.onChange}
                          error={true}
                          errorMessage="Please select a valid date"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </Form>

        <Loader />
      </div>
    </div>
  );
}
