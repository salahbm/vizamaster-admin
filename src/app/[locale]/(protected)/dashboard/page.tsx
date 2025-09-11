'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { DatePicker } from '@/components/shared/date-pickers';
import { FormFields } from '@/components/shared/form-fields';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Combobox } from '@/components/ui/combobox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Form } from '@/components/ui/form';
import { Input, PasswordInput, TelephoneInput } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Uploader } from '@/components/ui/uploader';

const schema = z.object({
  // Basic Information
  username: z.string().refine((value) => value.trim() !== '', {
    params: { i18nKey: 'required' },
  }),
  email: z.email(),
  password: z.string().min(6),
  description: z.string().optional(),
  telephone: z.string().optional(),

  // Preferences
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

  // Date Pickers
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

  // Advanced Form Components
  subscriptionPlan: z.string().optional(),
  emailNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
  advancedSetting: z.boolean().optional(),
  emergencyName: z.string().optional(),
  emergencyPhone: z.string().optional(),
});

export default function DashboardPage() {
  const t = useTranslations();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      // Basic Information
      username: '',
      email: '',
      password: '',
      description: '',
      telephone: '',

      // Preferences
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

      // Date Pickers
      birthday: undefined,
      customFormatDate: undefined,
      minMaxDate: undefined,
      errorDate: undefined,
      birthDate: undefined,
      appointmentDate: undefined,
      interval: {
        from: undefined,
        to: undefined,
      },

      // Advanced Form Components
      subscriptionPlan: 'free',
      emailNotifications: false,
      smsNotifications: false,
      advancedSetting: false,
      emergencyName: '',
      emergencyPhone: '',
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    console.info(data);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Theme Demo</h1>

      <h2 className="text-primary text-xl font-semibold">
        {t('Metadata.title')}
      </h2>
      <p className="text-muted-foreground mb-8">{t('Metadata.description')}</p>

      <Tabs defaultValue="components" className="w-full">
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="components">UI Components</TabsTrigger>
          <TabsTrigger value="forms">Form Components</TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="space-y-8">
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
                <h3 className="text-xl font-medium">Radio Group</h3>
                <div className="card p-4">
                  <RadioGroup defaultValue="option-one">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <label htmlFor="option-one">Option One</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <label htmlFor="option-two">Option Two</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-three" id="option-three" />
                      <label htmlFor="option-three">Option Three</label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="grid gap-4">
                <h3 className="text-xl font-medium">Checkbox</h3>
                <div className="card p-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <label
                        htmlFor="terms"
                        className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Accept terms and conditions
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="newsletter" defaultChecked />
                      <label
                        htmlFor="newsletter"
                        className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Subscribe to newsletter
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="disabled" disabled />
                      <label
                        htmlFor="disabled"
                        className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Disabled option
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <h3 className="text-xl font-medium">Sheet</h3>
                <div className="card p-4">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline">Open Sheet</Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Sheet Title</SheetTitle>
                        <SheetDescription>
                          This is a description for the sheet dialog.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="py-4">
                        <p>Sheet content goes here</p>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              <div className="grid gap-4">
                <h3 className="text-xl font-medium">Tooltip</h3>
                <div className="card flex justify-center p-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline">Hover Me</Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This is a tooltip</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="grid gap-4">
                <h3 className="text-xl font-medium">Accordion</h3>
                <div className="card p-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Is it accessible?</AccordionTrigger>
                      <AccordionContent>
                        Yes. It adheres to the WAI-ARIA design pattern.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Is it styled?</AccordionTrigger>
                      <AccordionContent>
                        Yes. It comes with default styles that match your theme.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Is it animated?</AccordionTrigger>
                      <AccordionContent>
                        Yes. It's animated by default, but you can disable it if
                        you prefer.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>

              <div className="grid gap-4">
                <h3 className="text-xl font-medium">Command</h3>
                <div className="card p-4">
                  <Command className="rounded-lg border shadow-md">
                    <CommandInput placeholder="Type a command or search..." />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup heading="Suggestions">
                        <CommandItem>Calendar</CommandItem>
                        <CommandItem>Search</CommandItem>
                        <CommandItem>Settings</CommandItem>
                      </CommandGroup>
                      <CommandGroup heading="Actions">
                        <CommandItem>New File</CommandItem>
                        <CommandItem>New Project</CommandItem>
                        <CommandItem>New Task</CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
              </div>

              <div className="grid gap-4">
                <h3 className="text-xl font-medium">Popover</h3>
                <div className="card flex justify-center p-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">Open Popover</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="leading-none font-medium">
                            Dimensions
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            Set the dimensions for the layer.
                          </p>
                        </div>
                        <div className="grid gap-2">
                          <div className="grid grid-cols-3 items-center gap-4">
                            <label htmlFor="width">Width</label>
                            <Input
                              id="width"
                              defaultValue="100%"
                              className="col-span-2 h-8"
                            />
                          </div>
                          <div className="grid grid-cols-3 items-center gap-4">
                            <label htmlFor="height">Height</label>
                            <Input
                              id="height"
                              defaultValue="25px"
                              className="col-span-2 h-8"
                            />
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid gap-4">
                <h3 className="text-xl font-medium">Tabs Variants</h3>
                <div className="grid gap-6">
                  <div className="card p-4">
                    <h4 className="font-body-1 mb-4">Default Tabs</h4>
                    <Tabs defaultValue="account">
                      <TabsList>
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="password">Password</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                      </TabsList>
                      <TabsContent value="account" className="p-4">
                        Account tab content
                      </TabsContent>
                      <TabsContent value="password" className="p-4">
                        Password tab content
                      </TabsContent>
                      <TabsContent value="settings" className="p-4">
                        Settings tab content
                      </TabsContent>
                    </Tabs>
                  </div>

                  <div className="card p-4">
                    <h4 className="mb-4 font-medium">Outline Tabs</h4>
                    <Tabs defaultValue="profile">
                      <TabsList variant="outline" className="w-full">
                        <TabsTrigger variant="outline" value="profile">
                          Profile
                        </TabsTrigger>
                        <TabsTrigger variant="outline" value="notifications">
                          Notifications
                        </TabsTrigger>
                        <TabsTrigger variant="outline" value="appearance">
                          Appearance
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent variant="outline" value="profile">
                        Profile tab content
                      </TabsContent>
                      <TabsContent variant="outline" value="notifications">
                        Notifications tab content
                      </TabsContent>
                      <TabsContent variant="outline" value="appearance">
                        Appearance tab content
                      </TabsContent>
                    </Tabs>
                  </div>
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
                  </div>
                </div>
              </div>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="forms" className="space-y-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information Section */}
              <div className="card p-6">
                <h2 className="mb-6 text-xl font-semibold">
                  Basic Information
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
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
                      <Input
                        placeholder="Enter email"
                        type="email"
                        {...field}
                      />
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
                    name="telephone"
                    label="Telephone"
                    control={form.control}
                    render={({ field }) => (
                      <TelephoneInput
                        placeholder="Enter telephone"
                        {...field}
                      />
                    )}
                  />
                </div>
                <div className="mt-4">
                  <FormFields
                    name="description"
                    label="Description"
                    control={form.control}
                    render={({ field }) => (
                      <Textarea
                        placeholder="Enter description"
                        className="min-h-[120px]"
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Preferences Section */}
              <div className="card-md p-6">
                <h2 className="mb-6 text-xl font-semibold">Preferences</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <FormFields
                    name="gender"
                    label="Gender"
                    control={form.control}
                    render={({ field }) => (
                      <Combobox
                        placeholder="Select gender"
                        searchable
                        options={[
                          { value: '1', label: 'Male' },
                          { value: '2', label: 'Female' },
                          { value: '3', label: 'Non-binary' },
                          { value: '4', label: 'Prefer not to say' },
                        ]}
                        {...field}
                        onValueChange={field.onChange}
                        value={field.value}
                      />
                    )}
                  />
                  <FormFields
                    name="birthday"
                    label="Birthday"
                    control={form.control}
                    render={({ field }) => <DatePicker {...field} />}
                  />
                </div>
                <div className="mt-4">
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
                          { value: 'typescript', label: 'TypeScript' },
                          { value: 'javascript', label: 'JavaScript' },
                          { value: 'python', label: 'Python' },
                          { value: 'java', label: 'Java' },
                        ]}
                        onValueChange={field.onChange}
                        value={field.value}
                      />
                    )}
                    message="Select technologies you're interested in"
                    messageClassName="text-muted-foreground text-xs"
                  />
                </div>
                <div className="mt-4">
                  <FormFields
                    name="photo"
                    label="Profile Photo"
                    control={form.control}
                    render={({ field }) => <Uploader {...field} />}
                  />
                </div>
              </div>

              {/* Date Picker Examples */}
              <div className="card-lg p-6">
                <h2 className="mb-6 text-xl font-semibold">
                  Date Picker Examples
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-lg border p-4 shadow-sm">
                    <h3 className="mb-4 text-lg font-medium">Basic Examples</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="mb-2 text-sm font-medium">
                          Basic DatePicker
                        </p>
                        <FormFields
                          name="birthday"
                          control={form.control}
                          render={({ field }) => <DatePicker {...field} />}
                        />
                      </div>
                      <div>
                        <p className="mb-2 text-sm font-medium">
                          Custom Format (yyyy-MM-dd)
                        </p>
                        <FormFields
                          name="customFormatDate"
                          control={form.control}
                          render={({ field }) => (
                            <DatePicker {...field} dateFormat="yyyy-MM-dd" />
                          )}
                        />
                      </div>
                      <div>
                        <p className="mb-2 text-sm font-medium">
                          With Min/Max Constraints
                        </p>
                        <FormFields
                          name="minMaxDate"
                          control={form.control}
                          render={({ field }) => (
                            <DatePicker
                              {...field}
                              minDate={new Date(2023, 0, 1)}
                              maxDate={new Date(2025, 11, 31)}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4 shadow-sm">
                    <h3 className="mb-4 text-lg font-medium">
                      Specialized Variants
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="mb-2 text-sm font-medium">
                          Date-Time Picker
                        </p>
                        <FormFields
                          name="appointmentDate"
                          control={form.control}
                          render={({ field }) => (
                            <DatePicker {...field} variant="date-time" />
                          )}
                        />
                      </div>
                      <div>
                        <p className="mb-2 text-sm font-medium">Time Picker</p>
                        <FormFields
                          name="appointmentDate"
                          control={form.control}
                          render={({ field }) => (
                            <DatePicker {...field} variant="time" />
                          )}
                        />
                      </div>
                      <div>
                        <p className="mb-2 text-sm font-medium">Month Picker</p>
                        <FormFields
                          name="birthDate"
                          control={form.control}
                          render={({ field }) => (
                            <DatePicker {...field} variant="month" />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-medium">Advanced Date Pickers</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <p className="mb-2 text-sm font-medium">Year Picker</p>
                      <FormFields
                        name="birthDate"
                        control={form.control}
                        render={({ field }) => (
                          <DatePicker {...field} variant="year" />
                        )}
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-medium">
                        Date Range Picker
                      </p>
                      <FormFields
                        name="interval"
                        control={form.control}
                        render={({ field }) => (
                          <DatePicker {...field} variant="range" />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced Form Components */}
              <div className="card p-6">
                <h2 className="mb-6 text-xl font-semibold">
                  Advanced Form Components
                </h2>

                <div className="space-y-6">
                  {/* Radio Group Form Example */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Subscription Plan</h3>
                    <FormFields
                      name="subscriptionPlan"
                      control={form.control}
                      render={({ field }) => (
                        <RadioGroup
                          className="grid grid-cols-1 gap-4 md:grid-cols-3"
                          {...field}
                        >
                          <div className="hover:bg-accent rounded-lg border p-4">
                            <div className="flex items-start space-x-3">
                              <RadioGroupItem value="free" id="free" />
                              <div>
                                <label htmlFor="free" className="font-medium">
                                  Free
                                </label>
                                <p className="text-muted-foreground text-sm">
                                  Basic features for personal use
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="hover:bg-accent rounded-lg border p-4">
                            <div className="flex items-start space-x-3">
                              <RadioGroupItem value="pro" id="pro" />
                              <div>
                                <label htmlFor="pro" className="font-medium">
                                  Pro
                                </label>
                                <p className="text-muted-foreground text-sm">
                                  Advanced features for professionals
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="hover:bg-accent rounded-lg border p-4">
                            <div className="flex items-start space-x-3">
                              <RadioGroupItem
                                value="enterprise"
                                id="enterprise"
                              />
                              <div>
                                <label
                                  htmlFor="enterprise"
                                  className="font-medium"
                                >
                                  Enterprise
                                </label>
                                <p className="text-muted-foreground text-sm">
                                  Custom solutions for organizations
                                </p>
                              </div>
                            </div>
                          </div>
                        </RadioGroup>
                      )}
                    />
                  </div>

                  {/* Checkbox Form Example */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">
                      Notification Preferences
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormFields
                        name="emailNotifications"
                        control={form.control}
                        render={({ field }) => (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="emailNotifications"
                              checked={field.value}
                              onChange={field.onChange}
                            />
                            <div className="space-y-1">
                              <label
                                htmlFor="emailNotifications"
                                className="font-medium"
                              >
                                Email Notifications
                              </label>
                              <p className="text-muted-foreground text-xs">
                                Receive updates, newsletters, and important
                                announcements
                              </p>
                            </div>
                          </div>
                        )}
                      />
                      <FormFields
                        name="smsNotifications"
                        control={form.control}
                        render={({ field }) => (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="smsNotifications"
                              checked={field.value}
                              onChange={field.onChange}
                            />
                            <div className="space-y-1">
                              <label
                                htmlFor="smsNotifications"
                                className="font-medium"
                              >
                                SMS Notifications
                              </label>
                              <p className="text-muted-foreground text-xs">
                                Receive text messages for urgent updates
                              </p>
                            </div>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
                <Button type="submit">Submit Form</Button>
              </div>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
