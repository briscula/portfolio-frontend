import { getAccessToken } from '@auth0/nextjs-auth0';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

/**
 * Get access token for API calls
 */
async function getToken() {
  try {
    const { accessToken } = await getAccessToken();
    return accessToken;
  } catch (error) {
    console.error('Failed to get access token:', error);
    throw new Error('Authentication required');
  }
}

/**
 * Make authenticated API request
 */
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = await getToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Portfolio API functions
 */
export const portfolioApi = {
  /**
   * Get all positions
   */
  async getPositions() {
    return apiRequest('/transactions/positions');
  },

  /**
   * Get portfolio summary/metrics
   */
  async getPortfolioSummary() {
    // This endpoint might not exist yet, but we can prepare for it
    try {
      return apiRequest('/portfolio/summary');
    } catch (error) {
      // Return mock data if endpoint doesn't exist
      return {
        totalValue: 24500.00,
        totalChange: 5.2,
        dividendYield: 4.2,
        monthlyDividends: 85.50
      };
    }
  },

  /**
   * Get recent transactions/activity
   */
  async getRecentActivity() {
    // This endpoint might not exist yet, but we can prepare for it
    try {
      return apiRequest('/transactions/recent');
    } catch (error) {
      // Return mock data if endpoint doesn't exist
      return [];
    }
  },

  /**
   * Get upcoming dividends
   */
  async getUpcomingDividends() {
    // This endpoint might not exist yet, but we can prepare for it
    try {
      return apiRequest('/dividends/upcoming');
    } catch (error) {
      // Return mock data if endpoint doesn't exist
      return [];
    }
  }
};

/**
 * Make authenticated API request from client-side
 */
async function clientApiRequest(endpoint: string, params?: Record<string, string>) {
  try {
    // Get access token from Auth0
    const tokenResponse = await fetch('/api/auth/token');
    if (!tokenResponse.ok) {
      throw new Error('Failed to get access token');
    }
    const { accessToken } = await tokenResponse.json();

    if (!accessToken) {
      throw new Error('No access token available');
    }

    // Build URL with parameters
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error making client API request:', error);
    throw error;
  }
}

/**
 * Client-side API functions (for use in components)
 */
export const clientApi = {
  /**
   * Get portfolios list
   */
  async getPortfolios() {
    return clientApiRequest('/portfolios');
  },

  /**
   * Get positions for a specific portfolio
   */
  async getPositions(portfolioId: number, page: number = 1, pageSize: number = 50) {
    return clientApiRequest(`/portfolios/${portfolioId}/positions`, {
      page: page.toString(),
      limit: pageSize.toString(),
    });
  }
};

/**
 * Dividend API functions (for dividend chart component)
 */
export const dividendApi = {
  /**
   * Get monthly dividend overview
   */
  async getMonthlyOverview(params: { startYear: number; endYear: number }) {
    // This would call your dividend analytics endpoint
    // For now, return mock data to prevent errors
    return {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      years: Array.from({ length: params.endYear - params.startYear + 1 }, (_, i) => (params.startYear + i).toString()),
      data: []
    };
  }
};