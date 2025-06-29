/**
 * API service for communicating with wiggle-service
 * 
 * Centralized HTTP client with proper error handling and type safety
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  Opportunity,
  MultiExchangeOpportunity,
  Token,
  Exchange,
  AnalyticsOverview,
  TokenPerformance,
  ExchangePairAnalytics,
  HealthStatus,
  PaginatedResponse,
  OpportunityFilters,
  TokenFilters,
  ExchangeFilters,
} from '../types';

class ApiService {
  private client: AxiosInstance;

  constructor(baseURL: string = '/api/v1') {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        
        if (error.response?.status === 503) {
          throw new Error('Service temporarily unavailable. Please try again later.');
        }
        
        if (error.response?.status >= 500) {
          throw new Error('Server error. Please contact support if the problem persists.');
        }
        
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
        
        throw new Error(error.message || 'An unexpected error occurred');
      }
    );
  }

  // Health endpoints
  async getHealth(): Promise<HealthStatus> {
    const response = await this.client.get('/health');
    return response.data;
  }

  async getDetailedHealth(): Promise<HealthStatus> {
    const response = await this.client.get('/health/detailed');
    return response.data;
  }

  // Opportunity endpoints
  async getOpportunities(
    page: number = 1,
    pageSize: number = 20,
    filters: OpportunityFilters = {}
  ): Promise<PaginatedResponse<Opportunity>> {
    const params = {
      page,
      page_size: pageSize,
      ...filters,
    };

    const response = await this.client.get('/opportunities', { params });
    return {
      items: response.data.opportunities,
      total: response.data.total,
      page: response.data.page,
      page_size: response.data.page_size,
      has_next: response.data.has_next,
    };
  }

  async getOpportunity(id: string): Promise<Opportunity> {
    const response = await this.client.get(`/opportunities/${id}`);
    return response.data;
  }

  async getMultiExchangeOpportunities(
    page: number = 1,
    pageSize: number = 20,
    filters: { symbol?: string; priority?: string; min_return?: number } = {}
  ): Promise<PaginatedResponse<MultiExchangeOpportunity>> {
    const params = {
      page,
      page_size: pageSize,
      ...filters,
    };

    const response = await this.client.get('/opportunities/multi-exchange', { params });
    return {
      items: response.data.opportunities,
      total: response.data.total,
      page: response.data.page,
      page_size: response.data.page_size,
      has_next: response.data.has_next,
    };
  }

  async getOpportunityStats(): Promise<any> {
    const response = await this.client.get('/opportunities/stats/summary');
    return response.data;
  }

  // Token endpoints
  async getTokens(
    page: number = 1,
    pageSize: number = 50,
    filters: TokenFilters = {}
  ): Promise<PaginatedResponse<Token>> {
    const params = {
      page,
      page_size: pageSize,
      ...filters,
    };

    const response = await this.client.get('/tokens', { params });
    return {
      items: response.data.tokens,
      total: response.data.total,
      page: response.data.page,
      page_size: response.data.page_size,
      has_next: response.data.has_next,
    };
  }

  async getToken(id: string): Promise<Token> {
    const response = await this.client.get(`/tokens/${id}`);
    return response.data;
  }

  async searchTokens(symbol: string, limit: number = 10): Promise<Token[]> {
    const response = await this.client.get(`/tokens/search/${symbol}`, {
      params: { limit },
    });
    return response.data;
  }

  // Exchange endpoints
  async getExchanges(
    page: number = 1,
    pageSize: number = 20,
    filters: ExchangeFilters = {}
  ): Promise<PaginatedResponse<Exchange>> {
    const params = {
      page,
      page_size: pageSize,
      ...filters,
    };

    const response = await this.client.get('/exchanges', { params });
    return {
      items: response.data.exchanges,
      total: response.data.total,
      page: response.data.page,
      page_size: response.data.page_size,
      has_next: response.data.has_next,
    };
  }

  async getExchange(id: string): Promise<Exchange> {
    const response = await this.client.get(`/exchanges/${id}`);
    return response.data;
  }

  async getExchangeHealthSummary(): Promise<any> {
    const response = await this.client.get('/exchanges/health/summary');
    return response.data;
  }

  // Analytics endpoints
  async getAnalyticsOverview(days: number = 30): Promise<AnalyticsOverview> {
    const response = await this.client.get('/analytics/overview', {
      params: { days },
    });
    return response.data;
  }

  async getTokenPerformance(
    days: number = 30,
    limit: number = 20
  ): Promise<{ tokens: TokenPerformance[]; total_tokens: number }> {
    const response = await this.client.get('/analytics/tokens/performance', {
      params: { days, limit },
    });
    return response.data;
  }

  async getExchangePairAnalytics(
    days: number = 30,
    limit: number = 20
  ): Promise<{ exchange_pairs: ExchangePairAnalytics[]; total_pairs: number }> {
    const response = await this.client.get('/analytics/exchange-pairs', {
      params: { days, limit },
    });
    return response.data;
  }

  async getAnalysisHistory(
    days: number = 30,
    limit: number = 10
  ): Promise<any> {
    const response = await this.client.get('/analytics/analysis-history', {
      params: { days, limit },
    });
    return response.data;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;