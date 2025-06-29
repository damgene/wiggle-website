import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  CircularProgress,
} from '@mui/material';

import apiService from '../services/api';
import { formatNumber, formatTimeAgo } from '../utils/formatters';

const Exchanges: React.FC = () => {
  const { data, isLoading, error } = useQuery(
    'exchanges',
    () => apiService.getExchanges(1, 50),
    { refetchInterval: 60000 }
  );

  const { data: healthData, isLoading: healthLoading } = useQuery(
    'exchange-health',
    () => apiService.getExchangeHealthSummary(),
    { refetchInterval: 30000 }
  );

  if (isLoading && !data) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography color="error">
          Error loading exchanges: {(error as Error).message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Exchanges
      </Typography>

      {/* Health Summary */}
      {healthData && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Health Summary
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="textSecondary">
                  Total Exchanges
                </Typography>
                <Typography variant="h5">
                  {healthData.total_exchanges}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="textSecondary">
                  Healthy
                </Typography>
                <Typography variant="h5" color="success.main">
                  {healthData.healthy_exchanges}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="textSecondary">
                  Error Rate
                </Typography>
                <Typography variant="h5">
                  {healthData.error_rate_percent?.toFixed(2)}%
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="textSecondary">
                  Total Requests
                </Typography>
                <Typography variant="h5">
                  {formatNumber(healthData.total_requests)}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Exchange List */}
      <Grid container spacing={3}>
        {data?.items?.map((exchange) => (
          <Grid item xs={12} md={6} lg={4} key={exchange.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                    {exchange.name}
                  </Typography>
                  <Chip
                    label={exchange.is_active ? 'Active' : 'Inactive'}
                    color={exchange.is_active ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
                
                <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    Type:
                  </Typography>
                  <Chip
                    label={exchange.exchange_type}
                    color={exchange.exchange_type === 'CEX' ? 'primary' : 'secondary'}
                    size="small"
                  />
                </Box>
                
                <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    Rate Limit:
                  </Typography>
                  <Typography variant="body2">
                    {exchange.rate_limit_per_minute}/min
                  </Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    Total Requests:
                  </Typography>
                  <Typography variant="body2">
                    {formatNumber(exchange.total_requests)}
                  </Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    Errors:
                  </Typography>
                  <Typography variant="body2" color={exchange.total_errors > 0 ? 'error.main' : 'inherit'}>
                    {exchange.total_errors} ({exchange.consecutive_errors} consecutive)
                  </Typography>
                </Box>
                
                {exchange.average_response_time_ms && (
                  <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      Avg Response:
                    </Typography>
                    <Typography variant="body2">
                      {exchange.average_response_time_ms.toFixed(0)}ms
                    </Typography>
                  </Box>
                )}
                
                {exchange.last_successful_request && (
                  <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      Last Success:
                    </Typography>
                    <Typography variant="body2">
                      {formatTimeAgo(exchange.last_successful_request)}
                    </Typography>
                  </Box>
                )}
                
                {/* Error Rate Progress Bar */}
                <Box sx={{ mt: 2 }}>
                  <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="caption">
                      Error Rate
                    </Typography>
                    <Typography variant="caption">
                      {exchange.total_requests > 0 
                        ? ((exchange.total_errors / exchange.total_requests) * 100).toFixed(2)
                        : 0}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={exchange.total_requests > 0 
                      ? Math.min((exchange.total_errors / exchange.total_requests) * 100, 100)
                      : 0}
                    color={exchange.total_errors === 0 ? 'success' : 
                           (exchange.total_errors / exchange.total_requests) < 0.05 ? 'warning' : 'error'}
                  />
                </Box>
                
                {/* Supported Features */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="textSecondary" gutterBottom>
                    Features:
                  </Typography>
                  <Box>
                    {exchange.supports_historical_data && (
                      <Chip label="Historical" size="small" variant="outlined" sx={{ mr: 0.5, mb: 0.5 }} />
                    )}
                    {exchange.supports_websocket && (
                      <Chip label="WebSocket" size="small" variant="outlined" sx={{ mr: 0.5, mb: 0.5 }} />
                    )}
                  </Box>
                </Box>
                
                {/* Supported Chains */}
                {exchange.supported_chains.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="textSecondary" gutterBottom>
                      Chains:
                    </Typography>
                    <Box>
                      {exchange.supported_chains.slice(0, 3).map((chain) => (
                        <Chip
                          key={chain}
                          label={chain.toUpperCase()}
                          size="small"
                          variant="outlined"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                      {exchange.supported_chains.length > 3 && (
                        <Typography variant="caption" color="textSecondary">
                          +{exchange.supported_chains.length - 3} more
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Exchanges;