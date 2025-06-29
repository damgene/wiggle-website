import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';

import apiService from '../services/api';
import { formatCurrency, formatPercentage } from '../utils/formatters';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState(30);

  const { data: overview, isLoading: overviewLoading } = useQuery(
    ['analytics-overview', timeRange],
    () => apiService.getAnalyticsOverview(timeRange),
    { refetchInterval: 300000 }
  );

  const { data: tokenPerformance, isLoading: tokenLoading } = useQuery(
    ['token-performance', timeRange],
    () => apiService.getTokenPerformance(timeRange, 10),
    { refetchInterval: 300000 }
  );

  const { data: exchangePairs, isLoading: pairsLoading } = useQuery(
    ['exchange-pairs', timeRange],
    () => apiService.getExchangePairAnalytics(timeRange, 10),
    { refetchInterval: 300000 }
  );

  const isLoading = overviewLoading || tokenLoading || pairsLoading;

  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  // Prepare data for charts
  const tokenChartData = tokenPerformance?.tokens?.map((token) => ({
    name: token.symbol,
    opportunities: token.total_opportunities,
    avgReturn: token.average_return,
    maxReturn: token.max_return,
    volume: token.total_volume_usd,
  })) || [];

  const exchangePairChartData = exchangePairs?.exchange_pairs?.map((pair) => ({
    name: pair.pair_name.replace('→', ' → '),
    opportunities: pair.total_opportunities,
    avgReturn: pair.average_return,
    successRate: pair.success_rate,
  })) || [];

  // Pie chart data for opportunity distribution by class
  const opportunityTypeData = overview ? [
    { name: 'Multi-Exchange', value: overview.opportunities.total, color: COLORS[0] },
  ] : [];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">
          Analytics
        </Typography>
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as number)}
            label="Time Range"
          >
            <MenuItem value={7}>7 Days</MenuItem>
            <MenuItem value={30}>30 Days</MenuItem>
            <MenuItem value={90}>90 Days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Overview Cards */}
      {overview && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="primary">
                  {overview.opportunities.total}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Opportunities
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="success.main">
                  {overview.opportunities.executed}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Executed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="secondary">
                  {formatPercentage(overview.opportunities.average_return)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Avg Return
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="info.main">
                  {overview.tokens.unique_count}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Unique Tokens
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Token Performance Chart */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Tokens by Opportunities
              </Typography>
              
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={tokenChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'avgReturn' || name === 'maxReturn') {
                        return [formatPercentage(value as number), name];
                      }
                      if (name === 'volume') {
                        return [formatCurrency(value as number), name];
                      }
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar dataKey="opportunities" fill={COLORS[0]} name="Opportunities" />
                  <Bar dataKey="avgReturn" fill={COLORS[1]} name="Avg Return %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Exchange Pair Performance Chart */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Exchange Pairs
              </Typography>
              
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={exchangePairChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'avgReturn') {
                        return [formatPercentage(value as number), 'Avg Return'];
                      }
                      if (name === 'successRate') {
                        return [formatPercentage(value as number), 'Success Rate'];
                      }
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar dataKey="opportunities" fill={COLORS[2]} name="Opportunities" />
                  <Bar dataKey="successRate" fill={COLORS[3]} name="Success Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Token Performance Table */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Token Performance Details
              </Typography>
              
              {tokenPerformance?.tokens?.slice(0, 5).map((token, index) => (
                <Box key={token.symbol} sx={{ mb: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" fontWeight="bold">
                      {token.symbol}
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      {formatPercentage(token.average_return)}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" sx={{ mt: 0.5 }}>
                    <Typography variant="caption" color="textSecondary">
                      {token.total_opportunities} opportunities
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Max: {formatPercentage(token.max_return)}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" sx={{ mt: 0.5 }}>
                    <Typography variant="caption" color="textSecondary">
                      Volume: {formatCurrency(token.total_volume_usd)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Exchange Pair Performance Table */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Exchange Pair Details
              </Typography>
              
              {exchangePairs?.exchange_pairs?.slice(0, 5).map((pair) => (
                <Box key={pair.pair_name} sx={{ mb: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" fontWeight="bold">
                      {pair.pair_name.replace('→', ' → ')}
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      {formatPercentage(pair.average_return)}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" sx={{ mt: 0.5 }}>
                    <Typography variant="caption" color="textSecondary">
                      {pair.total_opportunities} opportunities
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Success: {formatPercentage(pair.success_rate)}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" sx={{ mt: 0.5 }}>
                    <Typography variant="caption" color="textSecondary">
                      Max Return: {formatPercentage(pair.max_return)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;