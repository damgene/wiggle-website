/**
 * Type definitions for the Wiggle Dashboard
 * 
 * Enhanced from EventScanner with multi-exchange support and improved analytics
 */

export interface Opportunity {
  id: string;
  opportunity_class: 'EVENT_DRIVEN_OPPORTUNITY' | 'FEE_EXPLOITATION' | 'STRUCTURED_LOOP_ARBITRAGE' | 'MULTI_EXCHANGE_ARBITRAGE';
  estimated_return_percent: number;
  capital_required_usd: number;
  net_return_percent?: number;
  duration_hours: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  source_exchanges: string[];
  token_symbol?: string;
  confidence_score: number;
  is_executed: boolean;
  created_at: string;
  updated_at: string;
}

export interface MultiExchangeOpportunity {
  id: string;
  symbol: string;
  name: string;
  total_opportunities: number;
  best_overall_return: number;
  priority: 'high' | 'medium' | 'low';
  supported_exchanges: string[];
  analysis_timestamp: string;
  next_scan_at?: string;
}

export interface Token {
  id: string;
  symbol: string;
  name: string;
  address?: string;
  chain: 'ethereum' | 'bitcoin' | 'bsc' | 'polygon';
  is_active: boolean;
  tags: string[];
  notes: string;
}

export interface Exchange {
  id: string;
  name: string;
  exchange_type: 'CEX' | 'DEX';
  is_active: boolean;
  rate_limit_per_minute: number;
  supports_historical_data: boolean;
  supports_websocket: boolean;
  supported_chains: string[];
  total_requests: number;
  total_errors: number;
  consecutive_errors: number;
  last_successful_request?: string;
  average_response_time_ms?: number;
}

export interface AnalyticsOverview {
  time_range: {
    start_date: string;
    end_date: string;
    days: number;
  };
  opportunities: {
    total: number;
    executed: number;
    pending: number;
    average_return: number;
    max_return: number;
  };
  tokens: {
    unique_count: number;
  };
  exchanges: {
    unique_count: number;
  };
}

export interface TokenPerformance {
  symbol: string;
  total_opportunities: number;
  average_return: number;
  max_return: number;
  total_volume_usd: number;
}

export interface ExchangePairAnalytics {
  pair_name: string;
  total_opportunities: number;
  average_return: number;
  max_return: number;
  success_rate: number;
}

export interface HealthStatus {
  status: string;
  timestamp: string;
  version: string;
  environment: string;
  uptime_seconds: number;
  components?: {
    database: {
      status: string;
      connected: boolean;
    };
  };
  database?: {
    status: string;
    database: string;
    collections: number;
    dataSize: number;
    storageSize: number;
  };
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
}

// Chart data types
export interface ChartDataPoint {
  name: string;
  value: number;
  timestamp?: string;
}

export interface TimeSeriesDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

// Filter and search types
export interface OpportunityFilters {
  token_symbol?: string;
  opportunity_class?: string;
  risk_level?: string;
  min_return?: number;
  is_executed?: boolean;
  sort_by?: string;
  sort_desc?: boolean;
}

export interface TokenFilters {
  symbol?: string;
  chain?: string;
  is_active?: boolean;
}

export interface ExchangeFilters {
  exchange_type?: 'CEX' | 'DEX';
  is_active?: boolean;
}

// Dashboard state types
export interface DashboardState {
  loading: boolean;
  error?: string;
  lastUpdated?: string;
}