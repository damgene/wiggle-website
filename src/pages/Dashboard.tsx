import React from 'react';
import { useQuery } from 'react-query';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  SwapHoriz as SwapHorizIcon,
  Token as TokenIcon,
} from '@mui/icons-material';

import apiService from '../services/api';
import { formatCurrency, formatPercentage } from '../utils/formatters';

const Dashboard: React.FC = () => {
  // Fetch health status
  const { data: health, isLoading: healthLoading } = useQuery(
    'health',
    () => apiService.getDetailedHealth(),
    { refetchInterval: 30000 } // Refresh every 30 seconds
  );

  // Fetch opportunity stats
  const { data: opportunityStats, isLoading: statsLoading } = useQuery(
    'opportunity-stats',
    () => apiService.getOpportunityStats(),
    { refetchInterval: 60000 } // Refresh every minute
  );

  // Fetch analytics overview
  const { data: analytics, isLoading: analyticsLoading } = useQuery(
    'analytics-overview',
    () => apiService.getAnalyticsOverview(7), // Last 7 days
    { refetchInterval: 300000 } // Refresh every 5 minutes
  );

  // Fetch exchange health
  const { data: exchangeHealth, isLoading: exchangeLoading } = useQuery(
    'exchange-health',
    () => apiService.getExchangeHealthSummary(),
    { refetchInterval: 60000 }
  );

  const isLoading = healthLoading || statsLoading || analyticsLoading || exchangeLoading;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {/* System Health Status */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">System Status</Typography>
                <Chip
                  label={health?.status === 'healthy' ? 'Healthy' : 'Degraded'}
                  color={health?.status === 'healthy' ? 'success' : 'warning'}
                  size="small"
                />
              </Box>
              <Box mt={2}>
                <Typography variant="body2" color="textSecondary">
                  Environment: {health?.environment}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Version: {health?.version}
                </Typography>
                {health?.database && (
                  <Typography variant="body2" color="textSecondary">
                    Database: {health.database.collections} collections, {formatCurrency(health.database.dataSize / 1024 / 1024, 0)}MB
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Total Opportunities */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUpIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">
                    {opportunityStats?.total_opportunities || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Opportunities
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Executed Opportunities */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AssessmentIcon color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">
                    {opportunityStats?.executed_opportunities || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Executed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Average Return */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUpIcon color="secondary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">
                    {formatPercentage(opportunityStats?.return_statistics?.average_return_percent || 0)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Avg Return
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Exchanges */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <SwapHorizIcon color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">
                    {exchangeHealth?.active_exchanges || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Active Exchanges
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity and Analytics */}
      <Grid container spacing={3}>
        {/* 7-Day Analytics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                7-Day Summary
              </Typography>
              
              {analytics ? (
                <Box>
                  <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Total Opportunities:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {analytics.opportunities.total}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Executed:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {analytics.opportunities.executed}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Max Return:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {formatPercentage(analytics.opportunities.max_return)}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Unique Tokens:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {analytics.tokens.unique_count}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No analytics data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Exchange Health */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Exchange Health
              </Typography>
              
              {exchangeHealth ? (
                <Box>
                  <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Total Exchanges:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {exchangeHealth.total_exchanges}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Healthy:</Typography>
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      {exchangeHealth.healthy_exchanges}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Error Rate:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {formatPercentage(exchangeHealth.error_rate_percent)}
                    </Typography>
                  </Box>
                  
                  {exchangeHealth.unhealthy_exchanges?.length > 0 && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      {exchangeHealth.unhealthy_exchanges.length} exchanges need attention
                    </Alert>
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No exchange health data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;