import { format } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/routing';

export default function Home({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations();

  // Get the full locale code for date-fns

  // Get the date-fns locale object
  const dateFnsLocale = locale === 'ru' ? ru : enUS;

  // Format the current date using date-fns with the appropriate locale
  const formattedDate = format(new Date(), 'PPP', { locale: dateFnsLocale });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4">{t('Metadata.title')}</h1>
        <p className="mb-4">{t('Metadata.description')}</p>

        <div className="mb-8">
          <p>Current date: {formattedDate}</p>
          <p>Current locale: {locale}</p>
          <p>Full locale for date-fns: {locale}</p>
        </div>

        <div className="flex gap-4 mb-8">
          <Link href="/" locale="en" className="text-blue-500 hover:underline">
            Switch to English
          </Link>
          <Link href="/" locale="ru" className="text-blue-500 hover:underline">
            Switch to Russian
          </Link>
        </div>

        <nav className="flex gap-4">
          <Link href="/" locale={locale} className="text-blue-500 hover:underline">
            {t('Navigation.home')}
          </Link>
          <Link href="/dashboard" locale={locale} className="text-blue-500 hover:underline">
            {t('Navigation.dashboard')}
          </Link>
          <Link href="/" locale={locale} className="text-blue-500 hover:underline">
            {t('Navigation.settings')}
          </Link>
        </nav>
      </div>
    </main>
  );
}
