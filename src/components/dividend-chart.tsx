'use client';

import { ResponsiveBar } from '@nivo/bar';
import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { dividendApi } from '../lib/api';
import { useTranslation } from '../lib/hooks/useTranslation';

interface DividendApiResponse {
  months: string[];
  years: string[];
  data: {
    month: string;
    monthName: string;
    yearlyData: {
      year: string;
      totalDividends: number;
      dividendCount: number;
      companies: string[];
    }[];
  }[];
}

interface ChartDataPoint {
  month: string;
  [year: string]: number | string;
}

interface DividendChartProps {
  portfolioId?: string;
  startYear?: number;
  endYear?: number;
}

const colorMap = {
  '2020': '#1e40af', // Blue-800 - Deep, professional
  '2021': '#047857', // Emerald-700 - Rich green
  '2022': '#d97706', // Amber-600 - Warm, muted
  '2023': '#dc2626', // Red-600 - Strong but not harsh
  '2024': '#7c3aed', // Violet-600 - Sophisticated purple
  '2025': '#0891b2', // Cyan-600 - Calm, trustworthy
  '2026': '#ea580c', // Orange-600 - Confident, grounded
};

// Transform API response to chart format
const transformApiDataToChartFormat = (apiResponse: DividendApiResponse, locale: string = 'en'): ChartDataPoint[] => {
  const monthNames = locale === 'es'
    ? ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
    : ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

  return apiResponse.data.map(monthData => {
    const chartPoint: ChartDataPoint = {
      month: monthNames[parseInt(monthData.month) - 1] || monthData.monthName.toLowerCase().slice(0, 3)
    };

    // Add data for each year
    monthData.yearlyData.forEach(yearData => {
      chartPoint[yearData.year] = yearData.totalDividends;
    });

    // Fill missing years with 0
    apiResponse.years.forEach(year => {
      if (!(year in chartPoint)) {
        chartPoint[year] = 0;
      }
    });

    return chartPoint;
  });
};

export default function DividendChart({
  portfolioId,
  startYear,
  endYear
}: DividendChartProps) {
  // Automatically calculate date range: current year and 4 years back
  const currentYear = new Date().getFullYear();
  const defaultEndYear = endYear || currentYear;
  const defaultStartYear = startYear || (defaultEndYear - 4);

  const { user, isLoading } = useUser();
  const { t, locale, formatCurrency } = useTranslation();
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [keys, setKeys] = useState<string[]>([]);

  useEffect(() => {
    const fetchDividendData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Make the API call using the reusable API utility
        console.log(`Making API call to dividend analytics for years ${defaultStartYear}-${defaultEndYear}...`);

        const apiResponse: DividendApiResponse = await dividendApi.getMonthlyOverview({
          startYear: defaultStartYear,
          endYear: defaultEndYear,
          portfolioId,
          stockSymbol: '', // Always empty - we want all stocks in the portfolio
        });

        // Transform the API response to match the chart format
        if (apiResponse.data && apiResponse.data.length > 0) {
          const transformedData = transformApiDataToChartFormat(apiResponse, locale);
          setChartData(transformedData);
          setKeys(apiResponse.years.sort());
        } else {
          setChartData([]);
          setKeys([]);
        }

      } catch (err) {
        console.error('Error fetching dividend data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch dividend data');

        // Fallback to sample data on error
        const fallbackData = [
          { month: 'ene', '2020': 20, '2021': 55, '2022': 85, '2023': 75 },
          { month: 'feb', '2020': 40, '2021': 80, '2022': 140, '2023': 110 },
          { month: 'mar', '2020': 55, '2021': 115, '2022': 105, '2023': 100 },
        ];
        setChartData(fallbackData);
        setKeys(['2020', '2021', '2022', '2023']);
      } finally {
        setLoading(false);
      }
    };

    fetchDividendData();
  }, [user, portfolioId, defaultStartYear, defaultEndYear]);

  if (isLoading || loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">{t('dividends.errorLoadingData')}:</p>
          <p className="text-sm text-gray-600">{error}</p>
          <p className="text-xs text-gray-500 mt-2">{t('dividends.showingFallbackData')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <p className="text-gray-600">{t('auth.pleaseLogin')}</p>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <p className="text-gray-600">{t('dividends.noDataAvailable')}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-96">
      <ResponsiveBar
        data={chartData}
        keys={keys}
        indexBy="month"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        groupMode="grouped"
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={({ id }) => colorMap[id as keyof typeof colorMap] || '#6b7280'}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 1.6]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: t('dividends.month'),
          legendPosition: 'middle',
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: `${t('dividends.dividends')} (${t('dividends.currency')})`,
          legendPosition: 'middle',
          legendOffset: -40,
        }}
        enableLabel={false}
        labelSkipWidth={1000}
        labelSkipHeight={1000}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: 'hover',
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        role="application"
        ariaLabel={t('dividends.monthlyOverview')}
        barAriaLabel={function (e) {
          const value = typeof e.value === 'number' ? formatCurrency(e.value) : e.value;
          return `${e.id}: ${value} ${t('dividends.month').toLowerCase()} ${e.indexValue}`;
        }}
        tooltip={({ id, value, indexValue, color }) => (
          <div
            style={{
              background: 'white',
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: color,
                  marginRight: '8px',
                  borderRadius: '2px',
                }}
              />
              <strong>{id}</strong>
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              <strong>{typeof value === 'number' ? formatCurrency(value) : value}</strong>
            </div>
            <div style={{ fontSize: '12px', color: '#999' }}>
              {indexValue}
            </div>
          </div>
        )}
      />
    </div>
  );
} 