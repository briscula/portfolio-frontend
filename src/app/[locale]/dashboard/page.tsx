'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { redirect } from 'next/navigation';
import AppLayout from '../../../components/AppLayout';
import { MetricCard, MetricCardsGrid, DollarSignIcon, PercentIcon, CalendarIcon, ActivityList, DividendCalendar, type ActivityItem, type DividendEvent } from '../../../components/ui';
import { usePortfolios, usePositions, usePortfolioSummary, type Portfolio } from '../../../hooks/usePortfolio';
import { DividendProgressView } from '../../../components/DividendProgressView/DividendProgressView';

// Mock data for recent activities
const mockActivities: ActivityItem[] = [
    {
        id: '1',
        type: 'dividend_received',
        title: 'AAPL Dividend Received',
        description: 'Apple Inc.',
        amount: '$12.50',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
        id: '2',
        type: 'stock_added',
        title: 'Added MSFT to Portfolio',
        description: 'Microsoft Corp.',
        amount: '10 shares',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    },
    {
        id: '3',
        type: 'dividend_received',
        title: 'JNJ Dividend Received',
        description: 'Johnson & Johnson',
        amount: '$8.25',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    },
    {
        id: '4',
        type: 'dividend_announced',
        title: 'KO Dividend Announced',
        description: 'The Coca-Cola Company',
        amount: '$0.44/share',
        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 3 weeks ago
    },
    {
        id: '5',
        type: 'stock_added',
        title: 'Added PG to Portfolio',
        description: 'Procter & Gamble Co.',
        amount: '5 shares',
        date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), // 4 weeks ago
    },
];

// Mock data for upcoming dividends
const mockDividends: DividendEvent[] = [
    {
        id: '1',
        symbol: 'AAPL',
        companyName: 'Apple Inc.',
        dividendAmount: 0.24,
        exDividendDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        paymentDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        shares: 50,
        estimatedPayout: 12.00,
        frequency: 'quarterly',
    },
    {
        id: '2',
        symbol: 'MSFT',
        companyName: 'Microsoft Corporation',
        dividendAmount: 0.68,
        exDividendDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        paymentDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        shares: 25,
        estimatedPayout: 17.00,
        frequency: 'quarterly',
    },
    {
        id: '3',
        symbol: 'JNJ',
        companyName: 'Johnson & Johnson',
        dividendAmount: 1.13,
        exDividendDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
        paymentDate: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000), // 19 days from now
        shares: 15,
        estimatedPayout: 16.95,
        frequency: 'quarterly',
    },
    {
        id: '4',
        symbol: 'KO',
        companyName: 'The Coca-Cola Company',
        dividendAmount: 0.44,
        exDividendDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
        paymentDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 4 weeks from now
        shares: 30,
        estimatedPayout: 13.20,
        frequency: 'quarterly',
    },
];

export default function DashboardPage() {
    const { user, isLoading } = useUser();
    const { portfolios, loading: portfoliosLoading } = usePortfolios();
    const selectedPortfolio = portfolios.length > 0 ? portfolios[0] : null;
    const selectedPortfolioId = selectedPortfolio?.id;
    const { positions, loading: positionsLoading, error: positionsError } = usePositions(selectedPortfolioId);
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

    return (
        <AppLayout>
            <div className="space-y-6">
                {/* Page header */}
                <div className="border-b border-gray-200 pb-4">
                    <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Welcome back, {user.name || user.email}
                    </p>
                </div>

                {/* Metric cards */}
                {positionsError ? (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <p className="text-red-800">Error loading portfolio data: {positionsError}</p>
                    </div>
                ) : portfoliosLoading || positionsLoading ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-8">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                            <p className="text-sm text-gray-600">Loading portfolio metrics...</p>
                        </div>
                    </div>
                ) : (
                    <MetricCardsGrid>
                        <MetricCard
                            title="Total Portfolio Value"
                            value={`$${portfolioSummary.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            change={{
                                value: Math.abs(portfolioSummary.totalGainPercent),
                                type: portfolioSummary.totalGainPercent >= 0 ? 'increase' : 'decrease',
                                period: 'total return'
                            }}
                            icon={DollarSignIcon}
                            iconColor="green"
                        />

                        <MetricCard
                            title="Annual Dividend Yield"
                            value={`${portfolioSummary.dividendYield.toFixed(1)}%`}
                            change={{ value: 0.3, type: 'increase', period: 'vs last quarter' }}
                            icon={PercentIcon}
                            iconColor="blue"
                        />

                        <MetricCard
                            title="Unrealized Gain/Loss"
                            value={`$${portfolioSummary.totalGain.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            change={{
                                value: Math.abs(portfolioSummary.totalGainPercent),
                                type: portfolioSummary.totalGain >= 0 ? 'increase' : 'decrease',
                                period: 'total return'
                            }}
                            icon={CalendarIcon}
                            iconColor={portfolioSummary.totalGain >= 0 ? 'green' : 'red'}
                        />
                    </MetricCardsGrid>
                )}

                {/* Recent activity */}
                {portfoliosLoading ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
                        </div>
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                            <p className="text-sm text-gray-600">Loading recent activity...</p>
                        </div>
                    </div>
                ) : (
                    <ActivityList
                        activities={mockActivities}
                        maxItems={5}
                        showViewAll
                        onViewAll={() => {
                            // TODO: Navigate to full activity page
                            console.log('Navigate to activity page');
                        }}
                    />
                )}

                {/* Upcoming dividends */}
                {portfoliosLoading ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Upcoming Dividends</h3>
                        </div>
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                            <p className="text-sm text-gray-600">Loading upcoming dividends...</p>
                        </div>
                    </div>
                ) : (
                    <DividendCalendar
                        dividends={mockDividends}
                        maxItems={4}
                        showViewAll
                        onViewAll={() => {
                            // TODO: Navigate to full dividends page
                            console.log('Navigate to dividends page');
                        }}
                    />
                )}

                {/* Dividend Progress View */}
                <DividendProgressView 
                    userId={user.sub}
                    defaultPeriod="quarter"
                    className="mt-6"
                />
            </div>
        </AppLayout>
    );
}