import { useState, useEffect } from 'react';
import { clientApi } from '../lib/api';

export interface Position {
  userId: number;
  portfolioId: number;
  portfolioName: string;
  stockSymbol: string;
  companyName: string;
  sector: string | null;
  currentQuantity: number;
  totalCost: number;
  totalDividends: number;
  dividendCount: number;
  lastTransactionDate: string;
  portfolioPercentage: number;
  // Calculated fields (we'll compute these)
  averagePrice?: number;
  currentPrice?: number;
  totalValue?: number;
  unrealizedGain?: number;
  unrealizedGainPercent?: number;
  dividendYield?: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PositionsResponse {
  data: Position[];
  pagination: PaginationInfo;
}

export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalGain: number;
  totalGainPercent: number;
  dividendYield: number;
  monthlyDividends: number;
}

/**
 * Hook to fetch portfolios
 */
export function usePortfolios() {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPortfolios() {
      try {
        setLoading(true);
        setError(null);
        const response = await clientApi.getPortfolios();
        console.log('Portfolios Response:', response);
        setPortfolios(Array.isArray(response) ? response : response.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch portfolios');
        console.error('Error fetching portfolios:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolios();
  }, []);

  return { portfolios, loading, error };
}

/**
 * Hook to fetch portfolio positions with pagination
 */
export function usePositions(portfolioId?: number, page: number = 1, pageSize: number = 50) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPositions = async (pageNum: number = page) => {
    if (!portfolioId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await clientApi.getPositions(portfolioId, pageNum, pageSize);
      console.log('Positions API Response:', response); // Debug log
      
      if (response && response.data && Array.isArray(response.data)) {
        setPositions(response.data);
        setPagination(response.pagination);
      } else {
        // Fallback for non-paginated response
        setPositions(Array.isArray(response) ? response : []);
        setPagination(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch positions');
      console.error('Error fetching positions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions(page);
  }, [portfolioId, page, pageSize]);

  return { 
    positions, 
    pagination, 
    loading, 
    error, 
    refetch: () => fetchPositions(page),
    fetchPage: (pageNum: number) => fetchPositions(pageNum)
  };
}

/**
 * Hook to calculate portfolio summary from positions
 */
export function usePortfolioSummary(positions: Position[]): PortfolioSummary {
  const totalCost = Math.abs(positions.reduce((sum, pos) => sum + Math.abs(pos.totalCost), 0));
  const totalDividends = positions.reduce((sum, pos) => sum + pos.totalDividends, 0);
  
  return {
    totalValue: totalCost, // We don't have current market value yet, so use cost
    totalCost: totalCost,
    totalGain: totalDividends, // Use dividends received as gain for now
    totalGainPercent: totalCost > 0 ? (totalDividends / totalCost) * 100 : 0,
    dividendYield: 0, // Would need current prices to calculate
    monthlyDividends: totalDividends / 12, // Rough estimate
  };
}