'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { DataTable } from '@/components/shared/data-table';
import { DatePicker } from '@/components/shared/date-pickers';
import { FormFields } from '@/components/shared/form-fields';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Form } from '@/components/ui/form';
import { Input, PasswordInput, TelephoneInput } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const columns = [
  {
    accessorKey: 'username',
    header: 'Username',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'password',
    header: 'Password',
  },
];

const data = [
  {
    username: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password',
  },
  {
    username: 'Jane Doe',
    email: 'jane.doe@example.com',
    password: 'password',
  },
];

const schema = z.object({
  username: z.string().refine((value) => value.trim() !== '', {
    params: { i18nKey: 'required' },
  }),
  email: z.email(),
  password: z.string().min(6),
  description: z.string().optional(),
  telephone: z.string().optional(),
  gender: z.string().optional(),
  returnYear: z.string().optional(),
  returnMonth: z.string().optional(),
  returnDay: z.string().optional(),
  country: z.string().min(2),
  address: z.string().min(10),
  postalCode: z.string().min(5),
  city: z.string().min(2),
  province: z.string().min(2),
  photo: z.string().optional(),
  interests: z.array(z.string()).optional(),
  birthday: z.date().optional(),
  customFormatDate: z.date().optional(),
  minMaxDate: z.date().optional(),
  errorDate: z.date().optional(),
  birthDate: z.date().optional(),
  appointmentDate: z.date().optional(),
  interval: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
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
      interval: {
        from: undefined,
        to: undefined,
      },
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    console.log(data);
  };

  console.log(form.getValues());

  return (
    <div className="">
      <h1 className="mb-6 text-3xl font-bold">Theme Demo</h1>

      <h2>{t('Metadata.title')}</h2>
      <p>{t('Metadata.description')}</p>

      <div className="grid gap-8">
        <section className="space-y-4">
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="card">
                  <h4 className="font-semibold">Card Title</h4>
                  <p className="text-muted-foreground text-sm">
                    Card description goes here
                  </p>
                </div>
                <div className="card-md">
                  <h4 className="font-semibold">Card Title</h4>
                  <p className="text-muted-foreground text-sm">
                    Card description goes here
                  </p>
                </div>
                <div className="card-lg">
                  <h4 className="font-semibold">Card Title</h4>
                  <p className="text-muted-foreground text-sm">
                    Card description goes here
                  </p>
                </div>
              </div>
            </div>
            <div className="grid gap-4">
              <h3 className="text-xl font-medium">FONTS</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
              render={({ field }) => (
                <Input placeholder="Enter username" {...field} />
              )}
            />
            <FormFields
              name="email"
              label="Email"
              required
              control={form.control}
              render={({ field }) => (
                <Input placeholder="Enter email" type="email" {...field} />
              )}
            />
            <FormFields
              name="password"
              label="Password"
              control={form.control}
              render={({ field }) => (
                <PasswordInput placeholder="Enter password" {...field} />
              )}
            />
            <FormFields
              name="description"
              label="Description"
              control={form.control}
              render={({ field }) => (
                <Textarea placeholder="Enter description" {...field} />
              )}
            />
            <FormFields
              name="telephone"
              label="Telephone"
              control={form.control}
              render={({ field }) => (
                <TelephoneInput placeholder="Enter telephone" {...field} />
              )}
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
                    { value: '1', label: 'Male' },
                    { value: '2', label: 'Female' },
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
              render={({ field }) => (
                <Input placeholder="Enter country" {...field} />
              )}
            />
            <FormFields
              name="address"
              label="Address"
              control={form.control}
              render={({ field }) => (
                <Input placeholder="Enter address" {...field} />
              )}
            />
            <FormFields
              name="postalCode"
              label="Postal Code"
              control={form.control}
              render={({ field }) => (
                <Input
                  type="number"
                  placeholder="Enter postal code"
                  {...field}
                />
              )}
            />
            <FormFields
              name="city"
              label="City"
              control={form.control}
              render={({ field }) => (
                <Input placeholder="Enter city" {...field} />
              )}
            />
            <FormFields
              name="province"
              label="Province"
              control={form.control}
              render={({ field }) => (
                <Input placeholder="Enter province" {...field} />
              )}
            />
            <FormFields
              name="photo"
              label="Photo"
              control={form.control}
              render={({ field }) => (
                <Input placeholder="Enter photo" {...field} />
              )}
            />

            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-lg font-medium">DatePicker Examples</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground mb-2 text-sm">
                      Basic DatePicker
                    </p>
                    <FormFields
                      name="birthday"
                      label="Birthday"
                      control={form.control}
                      render={({ field }) => (
                        <DatePicker
                          value={field.value}
                          onValueChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-2 text-sm">
                      With custom date format
                    </p>
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
                    <p className="text-muted-foreground mb-2 text-sm">
                      With min/max date
                    </p>
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
                    <p className="text-muted-foreground mb-2 text-sm">
                      With error state
                    </p>
                    <FormFields
                      name="errorDate"
                      control={form.control}
                      render={({ field, formState }) => (
                        <DatePicker
                          value={field.value}
                          onValueChange={field.onChange}
                          error={formState.errors.errorDate}
                          errorMessage="Please select a valid date"
                        />
                      )}
                    />
                  </div>
                </div>

                <h3 className="mt-8 text-lg font-medium">
                  DatePicker Variants
                </h3>
                <FormFields
                  name="appointmentDate"
                  label="Date-Time Picker"
                  control={form.control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onValueChange={field.onChange}
                      variant="date-time"
                      placeholder="Select appointment date and time"
                    />
                  )}
                />
                <FormFields
                  name="appointmentDate"
                  label="Time Picker"
                  control={form.control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onValueChange={field.onChange}
                      variant="time"
                      placeholder="Select time"
                    />
                  )}
                />
                <FormFields
                  name="birthDate"
                  label="Month Picker"
                  control={form.control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onValueChange={field.onChange}
                      variant="month"
                      placeholder="Select month"
                    />
                  )}
                />
                <FormFields
                  name="birthDate"
                  label="Year Picker"
                  control={form.control}
                  render={({ field }) => (
                    <DatePicker
                      onValueChange={field.onChange}
                      variant="year"
                      placeholder="Select year"
                      {...field}
                    />
                  )}
                />
                <FormFields
                  name="interval"
                  label="Date Range Picker"
                  control={form.control}
                  render={({ field }) => (
                    <DatePicker
                      onValueChange={field.onChange}
                      variant="range"
                      placeholder="Select date range"
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </Form>

        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
