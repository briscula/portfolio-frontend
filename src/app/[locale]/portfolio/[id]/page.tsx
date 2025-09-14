'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { redirect, useParams } from 'next/navigation';
import Link from 'next/link';
import AppLayout from '../../../../components/AppLayout';
import { usePortfolios, usePositions, usePortfolioSummary } from '../../../../hooks/usePortfolio';
import { Card, CardHeader, CardTitle, CardContent, MetricCard, MetricCardsGrid, DollarSignIcon, TrendingUpIcon, TrendingDownIcon } from '../../../../components/ui';

export default function PortfolioDetailPage() {
  const { user, isLoading } = useUser();
  const params = useParams();
  const portfolioId = params.id as string;
  
  const { portfolios, loading: portfoliosLoading, error: portfoliosError } = usePortfolios();
  const selectedPortfolio = portfolios.find(p => p.id === portfolioId);
  const { positions, pagination, loading: positionsLoading, error: positionsError, fetchPage } = usePositions(portfolioId);
  const portfolioSummary = usePortfolioSummary(positions);

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

  if (!selectedPortfolio && !portfoliosLoading) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Portfolio Not Found</h1>
          <p className="text-gray-600 mb-6">The portfolio you're looking for doesn't exist.</p>
          <Link href="/en/portfolio" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            Back to Portfolios
          </Link>
        </div>
      </AppLayout>
    );
  }

  const formatCurrency = (amount: number) => {
    const currencyCode = selectedPortfolio?.currencyCode || 'USD';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${Number(percent).toFixed(2)}%`;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Link href="/en/portfolio" className="text-blue-600 hover:text-blue-500">
                  ← Back to Portfolios
                </Link>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
                {selectedPortfolio?.name || 'Loading...'}
                {selectedPortfolio && (
                  <span className="ml-3 text-lg text-blue-600">
                    {selectedPortfolio.currency.symbol}
                  </span>
                )}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                {selectedPortfolio?.description || 'Manage your dividend investments'}
              </p>
            </div>
          </div>
        </div>

        {/* Error handling */}
        {(portfoliosError || positionsError) && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">
              Error loading portfolio data: {portfoliosError || positionsError}
            </p>
          </div>
        )}

        {/* Portfolio Summary Cards */}
        {portfoliosLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading portfolio...</p>
          </div>
        ) : selectedPortfolio ? (
          <MetricCardsGrid>
            <MetricCard
              title="Total Value"
              value={formatCurrency(portfolioSummary.totalValue)}
              change={{
                value: Math.abs(portfolioSummary.totalGainPercent),
                type: portfolioSummary.totalGainPercent >= 0 ? 'increase' : 'decrease',
                period: 'total return'
              }}
              icon={DollarSignIcon}
              iconColor="blue"
            />

            <MetricCard
              title="Total Cost"
              value={formatCurrency(portfolioSummary.totalCost)}
              icon={DollarSignIcon}
              iconColor="gray"
            />

            <MetricCard
              title="Unrealized P&L"
              value={formatCurrency(portfolioSummary.totalGain)}
              change={{
                value: Math.abs(portfolioSummary.totalGainPercent),
                type: portfolioSummary.totalGain >= 0 ? 'increase' : 'decrease',
                period: 'return'
              }}
              icon={portfolioSummary.totalGain >= 0 ? TrendingUpIcon : TrendingDownIcon}
              iconColor={portfolioSummary.totalGain >= 0 ? 'green' : 'red'}
            />
          </MetricCardsGrid>
        ) : null}

        {/* Positions Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Positions ({pagination ? `${positions.length} of ${pagination.totalItems}` : positions.length})
              </CardTitle>
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {positionsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-sm text-gray-600">Loading positions...</p>
              </div>
            ) : positions.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  No positions found
                </h3>
                <p className="text-sm text-gray-600">
                  Start investing to see your positions here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Symbol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Shares
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg Price
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Price
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Cost
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dividends
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dividend Yield
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Portfolio %
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {positions.map((position) => (
                      <tr key={position.stockSymbol} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {position.stockSymbol}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {position.companyName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                          {position.currentQuantity?.toLocaleString() || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                          {position.currentQuantity > 0 ? formatCurrency(Math.abs(position.totalCost) / position.currentQuantity) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                          N/A
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                          {formatCurrency(Math.abs(position.totalCost))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <span className={position.totalDividends >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {formatCurrency(position.totalDividends)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <span className={position.totalDividends >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {position.totalCost !== 0 ? formatPercent((position.totalDividends / Math.abs(position.totalCost)) * 100) : 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                          <div className="flex items-center justify-end">
                            <span className="mr-2">{formatPercent(position.portfolioPercentage)}</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${Math.min(position.portfolioPercentage, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {!positionsLoading && pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                  {pagination.totalItems} positions
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => fetchPage(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    {pagination.currentPage} / {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => fetchPage(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}