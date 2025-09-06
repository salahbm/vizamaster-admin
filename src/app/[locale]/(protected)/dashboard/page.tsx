'use client';

import { Laptop, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Theme Demo</h1>

      <div className="grid gap-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Current Theme: {theme}</h2>
          <p className="text-muted-foreground">
            This page demonstrates the theme switching functionality using next-themes and
            shadcn/ui.
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <Button
              onClick={() => setTheme('light')}
              variant={theme === 'light' ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <Sun className="h-4 w-4" />
              Light
            </Button>

            <Button
              onClick={() => setTheme('dark')}
              variant={theme === 'dark' ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <Moon className="h-4 w-4" />
              Dark
            </Button>

            <Button
              onClick={() => setTheme('system')}
              variant={theme === 'system' ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <Laptop className="h-4 w-4" />
              System
            </Button>
            <ThemeToggle />
          </div>
        </section>

        <section className="space-y-4 mt-10">
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
                <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                  <h4 className="font-semibold">Card Title</h4>
                  <p className="text-sm text-muted-foreground">Card description goes here</p>
                </div>
                <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                  <h4 className="font-semibold">Card Title</h4>
                  <p className="text-sm text-muted-foreground">Card description goes here</p>
                </div>
                <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                  <h4 className="font-semibold">Card Title</h4>
                  <p className="text-sm text-muted-foreground">Card description goes here</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
