// Core dividend data types
export interface DividendDataPoint {
  date: string;
  amount: number;
  symbol?: string;
  company?: string;
  paymentType: 'regular' | 'special' | 'interim';
}

// Time period types
export type TimePeriod = 'month' | 'quarter' | 'year' | 'all';

// Trend analysis types
export interface TrendData {
  direction: 'up' | 'down' | 'stable';
  percentage: number;
  confidence: 'high' | 'medium' | 'low';
}

// Dividend metrics interface
export interface DividendMetrics {
  totalIncome: number;
  paymentCount: number;
  averagePayment: number;
  growthRate: number;
  yearOverYearChange?: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

// Period summary interface
export interface PeriodSummary {
  period: TimePeriod;
  startDate: string;
  endDate: string;
  totalPayments: number;
  totalAmount: number;
}

// Processed dividend data combining all metrics
export interface ProcessedDividendData {
  dataPoints: DividendDataPoint[];
  metrics: DividendMetrics;
  trends: TrendData;
  periodSummary: PeriodSummary;
}

// Chart configuration types
export interface ChartDimensions {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface ChartConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    trend: {
      positive: string;
      negative: string;
      neutral: string;
    };
  };
  responsive: {
    mobile: ChartDimensions;
    tablet: ChartDimensions;
    desktop: ChartDimensions;
  };
}

// Component prop interfaces
export interface DividendProgressViewProps {
  userId?: string;
  className?: string;
  defaultPeriod?: TimePeriod;
}

export interface ProgressChartProps {
  data: DividendDataPoint[];
  period: TimePeriod;
  chartType: 'line' | 'bar' | 'area';
  onDataPointHover: (point: DividendDataPoint | null) => void;
}

export interface MetricsPanelProps {
  metrics: DividendMetrics;
  period: TimePeriod;
  isLoading: boolean;
}

export interface TimeFilterProps {
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
  availablePeriods: TimePeriod[];
}

export interface TrendIndicatorProps {
  trend: TrendData;
  metrics: DividendMetrics;
  className?: string;
}

// Type guards for runtime validation
export const isDividendDataPoint = (obj: any): obj is DividendDataPoint => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.date === 'string' &&
    typeof obj.amount === 'number' &&
    ['regular', 'special', 'interim'].includes(obj.paymentType)
  );
};

export const isTimePeriod = (value: any): value is TimePeriod => {
  return ['month', 'quarter', 'year', 'all'].includes(value);
};

export const isDividendMetrics = (obj: any): obj is DividendMetrics => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.totalIncome === 'number' &&
    typeof obj.paymentCount === 'number' &&
    typeof obj.averagePayment === 'number' &&
    typeof obj.growthRate === 'number' &&
    ['increasing', 'decreasing', 'stable'].includes(obj.trend)
  );
};

// Default chart configuration
export const DEFAULT_CHART_CONFIG: ChartConfig = {
  colors: {
    primary: '#6366f1', // Indigo-500
    secondary: '#8b5cf6', // Violet-500
    accent: '#06b6d4', // Cyan-500
    trend: {
      positive: '#10b981', // Emerald-500
      negative: '#ef4444', // Red-500
      neutral: '#6b7280', // Gray-500
    },
  },
  responsive: {
    mobile: {
      width: 320,
      height: 200,
      margin: { top: 20, right: 20, bottom: 40, left: 40 },
    },
    tablet: {
      width: 600,
      height: 300,
      margin: { top: 30, right: 60, bottom: 50, left: 60 },
    },
    desktop: {
      width: 800,
      height: 400,
      margin: { top: 50, right: 130, bottom: 50, left: 60 },
    },
  },
};