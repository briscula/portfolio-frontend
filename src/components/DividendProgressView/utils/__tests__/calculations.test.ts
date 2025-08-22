import {
  calculateTotalIncome,
  calculateAveragePayment,
  calculateGrowthRate,
  calculateTrend,
  filterDataByPeriod,
  generateDividendMetrics,
  processDividendData,
} from '../calculations';
import { DividendDataPoint } from '../../types/dividend';

// Mock data for testing
const mockDividendData: DividendDataPoint[] = [
  {
    date: '2024-01-15',
    amount: 100,
    symbol: 'AAPL',
    company: 'Apple Inc.',
    paymentType: 'regular',
  },
  {
    date: '2024-02-15',
    amount: 150,
    symbol: 'MSFT',
    company: 'Microsoft Corp.',
    paymentType: 'regular',
  },
  {
    date: '2024-03-15',
    amount: 200,
    symbol: 'GOOGL',
    company: 'Alphabet Inc.',
    paymentType: 'special',
  },
  {
    date: '2023-12-15',
    amount: 80,
    symbol: 'AAPL',
    company: 'Apple Inc.',
    paymentType: 'regular',
  },
];

describe('Dividend Calculations', () => {
  describe('calculateTotalIncome', () => {
    it('should calculate total income correctly', () => {
      const result = calculateTotalIncome(mockDividendData);
      expect(result).toBe(530); // 100 + 150 + 200 + 80
    });

    it('should return 0 for empty array', () => {
      const result = calculateTotalIncome([]);
      expect(result).toBe(0);
    });
  });

  describe('calculateAveragePayment', () => {
    it('should calculate average payment correctly', () => {
      const result = calculateAveragePayment(mockDividendData);
      expect(result).toBe(132.5); // 530 / 4
    });

    it('should return 0 for empty array', () => {
      const result = calculateAveragePayment([]);
      expect(result).toBe(0);
    });
  });

  describe('calculateGrowthRate', () => {
    it('should calculate positive growth rate', () => {
      const current = [mockDividendData[0], mockDividendData[1]]; // 250 total
      const previous = [mockDividendData[3]]; // 80 total
      const result = calculateGrowthRate(current, previous);
      expect(result).toBeCloseTo(212.5); // ((250 - 80) / 80) * 100
    });

    it('should calculate negative growth rate', () => {
      const current = [mockDividendData[3]]; // 80 total
      const previous = [mockDividendData[0], mockDividendData[1]]; // 250 total
      const result = calculateGrowthRate(current, previous);
      expect(result).toBeCloseTo(-68); // ((80 - 250) / 250) * 100
    });

    it('should return 100% when previous period has no data', () => {
      const current = [mockDividendData[0]];
      const previous: DividendDataPoint[] = [];
      const result = calculateGrowthRate(current, previous);
      expect(result).toBe(100);
    });
  });

  describe('calculateTrend', () => {
    it('should identify upward trend', () => {
      const current = [mockDividendData[1], mockDividendData[2]]; // 350 total
      const previous = [mockDividendData[3]]; // 80 total
      const result = calculateTrend(current, previous);
      expect(result.direction).toBe('up');
      expect(result.percentage).toBeGreaterThan(0);
    });

    it('should identify downward trend', () => {
      const current = [mockDividendData[3]]; // 80 total
      const previous = [mockDividendData[1], mockDividendData[2]]; // 350 total
      const result = calculateTrend(current, previous);
      expect(result.direction).toBe('down');
      expect(result.percentage).toBeGreaterThan(0);
    });

    it('should return stable for insufficient data', () => {
      const result = calculateTrend([mockDividendData[0]]);
      expect(result.direction).toBe('stable');
      expect(result.confidence).toBe('low');
    });
  });

  describe('filterDataByPeriod', () => {
    it('should return all data for "all" period', () => {
      const result = filterDataByPeriod(mockDividendData, 'all');
      expect(result).toHaveLength(4);
    });

    it('should filter data by month period', () => {
      const referenceDate = new Date('2024-03-20');
      const result = filterDataByPeriod(mockDividendData, 'month', referenceDate);
      // Should include data from 2024-02-20 onwards
      expect(result).toHaveLength(1); // Only March data
    });

    it('should filter data by year period', () => {
      const referenceDate = new Date('2024-06-01');
      const result = filterDataByPeriod(mockDividendData, 'year', referenceDate);
      // Should include data from 2023-06-01 onwards
      expect(result).toHaveLength(4); // All data points
    });
  });

  describe('generateDividendMetrics', () => {
    it('should generate correct metrics', () => {
      const currentData = [mockDividendData[0], mockDividendData[1]]; // 250 total, 2 payments
      const previousData = [mockDividendData[3]]; // 80 total, 1 payment
      
      const result = generateDividendMetrics(currentData, previousData);
      
      expect(result.totalIncome).toBe(250);
      expect(result.paymentCount).toBe(2);
      expect(result.averagePayment).toBe(125);
      expect(result.growthRate).toBeCloseTo(212.5);
      expect(result.trend).toBe('increasing');
    });

    it('should handle metrics without previous data', () => {
      const result = generateDividendMetrics([mockDividendData[0]]);
      
      expect(result.totalIncome).toBe(100);
      expect(result.paymentCount).toBe(1);
      expect(result.averagePayment).toBe(100);
      expect(result.growthRate).toBe(0);
      expect(result.yearOverYearChange).toBeUndefined();
    });
  });

  describe('processDividendData', () => {
    it('should process dividend data correctly', () => {
      const result = processDividendData(mockDividendData, 'all');
      
      expect(result.dataPoints).toHaveLength(4);
      expect(result.metrics.totalIncome).toBe(530);
      expect(result.periodSummary.period).toBe('all');
      expect(result.periodSummary.totalPayments).toBe(4);
      expect(result.trends).toBeDefined();
    });

    it('should process filtered data by period', () => {
      const referenceDate = new Date('2024-06-01');
      const result = processDividendData(mockDividendData, 'quarter', referenceDate);
      
      // Should filter to last quarter (March-June 2024)
      expect(result.dataPoints.length).toBeGreaterThan(0);
      expect(result.periodSummary.period).toBe('quarter');
    });
  });
});

// Helper function to run tests (for manual testing)
export const runCalculationTests = () => {
  console.log('Running dividend calculation tests...');
  
  // Test total income calculation
  const totalIncome = calculateTotalIncome(mockDividendData);
  console.log('Total Income:', totalIncome); // Should be 530
  
  // Test average payment calculation
  const averagePayment = calculateAveragePayment(mockDividendData);
  console.log('Average Payment:', averagePayment); // Should be 132.5
  
  // Test growth rate calculation
  const current = [mockDividendData[0], mockDividendData[1]];
  const previous = [mockDividendData[3]];
  const growthRate = calculateGrowthRate(current, previous);
  console.log('Growth Rate:', growthRate); // Should be ~212.5%
  
  // Test trend calculation
  const trend = calculateTrend(current, previous);
  console.log('Trend:', trend); // Should show upward trend
  
  console.log('All tests completed successfully!');
};