'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import DividendChart from '../../components/dividend-chart';
import LanguageSwitcher from '../../components/language-switcher-wrapper';
import { useTranslation } from '../../lib/hooks/useTranslation';

export default function LocalePage() {
  const { user, isLoading } = useUser();
  const { t, locale } = useTranslation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                {t('home.appName')}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              {user ? (
                <>
                  <span className="text-gray-700">
                    {t('common.welcome')}, {user.name || user.email}
                  </span>
                  <Link
                    href="/api/auth/logout"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                  >
                    {t('common.logout')}
                  </Link>
                </>
              ) : (
                <Link
                  href={`/${locale}/login`}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                >
                  {t('common.login')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {user ? (
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('dashboard.title')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('dashboard.welcomeMessage')}
              </p>
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t('dashboard.userInformation')}
                </h3>
                <p className="text-gray-600">{t('dashboard.email')}: {user.email}</p>
                <p className="text-gray-600">{t('dashboard.name')}: {user.name}</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {t('dividends.overview')}
                </h3>
                <DividendChart />
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                {t('home.title')}
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                {t('home.subtitle')}
              </p>
              <div className="space-x-4">
                <Link
                  href={`/${locale}/login`}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-md text-lg font-medium transition duration-150 ease-in-out"
                >
                  {t('common.getStarted')}
                </Link>
                <Link
                  href={`/${locale}/demo`}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md text-lg font-medium transition duration-150 ease-in-out"
                >
                  {t('common.viewDemo')}
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}