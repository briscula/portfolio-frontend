/**
 * API utility for making authenticated requests to the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

/**
 * Get access token for API requests
 */
async function getAccessToken(): Promise<string> {
  const tokenResponse = await fetch('/api/auth/token');
  if (!tokenResponse.ok) {
    throw new Error('Failed to get access token');
  }
  
  const tokenData = await tokenResponse.json();
  if (!tokenData.accessToken) {
    throw new Error('No access token available');
  }
  
  return tokenData.accessToken;
}

/**
 * Make authenticated API request
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const accessToken = await getAccessToken();
  
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
}

/**
 * Dividend Analytics API endpoints
 */
export const dividendApi = {
  /**
   * Get monthly dividend overview
   */
  getMonthlyOverview: async (params: {
    startYear: number;
    endYear: number;
    portfolioId: number;
    stockSymbol?: string;
  }) => {
    const searchParams = new URLSearchParams({
      startYear: params.startYear.toString(),
      endYear: params.endYear.toString(),
      portfolioId: params.portfolioId.toString(),
      ...(params.stockSymbol && { stockSymbol: params.stockSymbol }),
    });

    return apiRequest(`/dividend-analytics/monthly-overview?${searchParams}`);
  },

  /**
   * Add more dividend API endpoints here as needed
   */
  // getDividendHistory: async (portfolioId: number) => {
  //   return apiRequest(`/dividend-analytics/history/${portfolioId}`);
  // },
  
  // getPortfolioSummary: async (portfolioId: number) => {
  //   return apiRequest(`/portfolio/${portfolioId}/summary`);
  // },
};

/**
 * API configuration
 */
export const apiConfig = {
  baseUrl: API_BASE_URL,
  endpoints: {
    dividendAnalytics: '/dividend-analytics',
    portfolio: '/portfolio',
    // Add more endpoint groups as needed
  },
};