'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AppLayout from '../../../components/AppLayout';
import { usePortfolios } from '../../../hooks/usePortfolio';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui';

export default function PortfolioListPage() {
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

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Portfolios</h1>
          <p className="mt-1 text-sm text-gray-600">
            Select a portfolio to view details and manage positions
          </p>
        </div>

        {/* Error handling */}
        {portfoliosError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">Error loading portfolios: {portfoliosError}</p>
          </div>
        )}

        {/* Portfolios List */}
        {portfoliosLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Loading portfolios...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {portfolios.map((portfolio) => (
            <Link key={portfolio.id} href={`/en/portfolio/${portfolio.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{portfolio.name}</span>
                    <span className="text-lg font-bold text-blue-600">
                      {portfolio.currency.symbol}
                    </span>
                  </CardTitle>
                  {portfolio.description && (
                    <p className="text-sm text-gray-600">{portfolio.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Currency:</span>
                      <span className="font-medium">
                        {portfolio.currency.name} ({portfolio.currency.code})
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">
                        {new Date(portfolio.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-center">
                      View Portfolio →
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            ))}
          </div>
        )}

        {/* Empty state */}
        {portfolios.length === 0 && !portfoliosLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">📁</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No portfolios found
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first portfolio to start tracking your investments.
            </p>
            <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
              Create Portfolio
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}