'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AppLayout from '../../../components/AppLayout';
import { usePortfolios } from '../../../hooks/usePortfolio';
import { Card, CardHeader, CardTitle, CardContent, DividendCalendar } from '../../../components/ui';

export default function DividendsPage() {
  const { user, isLoading } = useUser();
  const { portfolios, loading: portfoliosLoading, error: portfoliosError } = usePortfolios();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    redirect('/api/auth/login');
  }

  // Mock dividend data - this would come from API
  const mockUpcomingDividends = [
    {
      id: '1',
      symbol: 'AAPL',
      companyName: 'Apple Inc.',
      dividendAmount: 0.24,
      exDividendDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      paymentDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      shares: 50,
      estimatedPayout: 12.00,
      frequency: 'quarterly' as const,
    },
    {
      id: '2',
      symbol: 'MSFT',
      companyName: 'Microsoft Corporation',
      dividendAmount: 0.68,
      exDividendDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      paymentDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      shares: 25,
      estimatedPayout: 17.00,
      frequency: 'quarterly' as const,
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Dividends</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track dividend payments and upcoming distributions across all portfolios
          </p>
        </div>

        {/* Error handling */}
        {portfoliosError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">Error loading portfolios: {portfoliosError}</p>
          </div>
        )}

        {/* Portfolio Selection */}
        {portfoliosLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading portfolios...</p>
          </div>
        ) : portfolios.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Portfolio Dividend Links */}
            <Card>
              <CardHeader>
                <CardTitle>Dividends by Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {portfolios.map((portfolio) => (
                    <Link
                      key={portfolio.id}
                      href={`/en/dividends/${portfolio.id}`}
                      className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{portfolio.name}</h3>
                          <p className="text-sm text-gray-600">
                            {portfolio.currency.name} ({portfolio.currency.symbol})
                          </p>
                        </div>
                        <div className="text-blue-600">
                          →
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Dividend Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Portfolios:</span>
                    <span className="font-medium">{portfolios.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Upcoming Payments:</span>
                    <span className="font-medium">{mockUpcomingDividends.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next Payment:</span>
                    <span className="font-medium">
                      {mockUpcomingDividends.length > 0 
                        ? mockUpcomingDividends[0].exDividendDate.toLocaleDateString()
                        : 'None scheduled'
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Upcoming Dividends - All Portfolios */}
        <DividendCalendar
          dividends={mockUpcomingDividends}
          title="Upcoming Dividends - All Portfolios"
          maxItems={10}
          showViewAll={false}
        />

        {/* Empty state */}
        {portfolios.length === 0 && !portfoliosLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">💰</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No portfolios found
            </h3>
            <p className="text-gray-600 mb-6">
              Create a portfolio to start tracking dividends.
            </p>
            <Link
              href="/en/portfolio"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Portfolios
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}