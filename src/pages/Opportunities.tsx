import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Pagination,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Switch,
  FormControlLabel,
} from '@mui/material';

import apiService from '../services/api';
import { Opportunity, OpportunityFilters } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';

const Opportunities: React.FC = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<OpportunityFilters>({
    sort_by: 'created_at',
    sort_desc: true,
  });

  const pageSize = 20;

  const { data, isLoading, error } = useQuery(
    ['opportunities', page, filters],
    () => apiService.getOpportunities(page, pageSize, filters),
    {
      keepPreviousData: true,
      refetchInterval: 60000, // Refresh every minute
    }
  );

  const { data: multiExchangeData, isLoading: multiExchangeLoading } = useQuery(
    'multi-exchange-opportunities',
    () => apiService.getMultiExchangeOpportunities(1, 10),
    { refetchInterval: 60000 }
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleFilterChange = (field: keyof OpportunityFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
    setPage(1); // Reset to first page when filters change
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'LOW': return 'success';
      case 'MEDIUM': return 'warning';
      case 'HIGH': return 'error';
      case 'VERY_HIGH': return 'error';
      default: return 'default';
    }
  };

  const getClassColor = (opportunityClass: string) => {
    switch (opportunityClass) {
      case 'MULTI_EXCHANGE_ARBITRAGE': return 'primary';
      case 'EVENT_DRIVEN_OPPORTUNITY': return 'secondary';
      case 'FEE_EXPLOITATION': return 'info';
      case 'STRUCTURED_LOOP_ARBITRAGE': return 'warning';
      default: return 'default';
    }
  };

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
          Error loading opportunities: {(error as Error).message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Opportunities
      </Typography>

      {/* Multi-Exchange Opportunities */}
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Multi-Exchange Opportunities
      </Typography>
      
      {multiExchangeLoading ? (
        <CircularProgress size={24} />
      ) : (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {multiExchangeData?.items?.map((opportunity) => (
            <Grid item xs={12} md={6} lg={4} key={opportunity.id}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="h6">{opportunity.symbol}</Typography>
                    <Chip
                      label={opportunity.priority}
                      color={opportunity.priority === 'high' ? 'error' : opportunity.priority === 'medium' ? 'warning' : 'default'}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {opportunity.name}
                  </Typography>
                  
                  <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Best Return:</Typography>
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      {formatPercentage(opportunity.best_overall_return)}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Opportunities:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {opportunity.total_opportunities}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Exchanges:</Typography>
                    <Typography variant="body2">
                      {opportunity.supported_exchanges.length}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Token Symbol"
                value={filters.token_symbol || ''}
                onChange={(e) => handleFilterChange('token_symbol', e.target.value || undefined)}
                fullWidth
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Opportunity Class</InputLabel>
                <Select
                  value={filters.opportunity_class || ''}
                  onChange={(e) => handleFilterChange('opportunity_class', e.target.value || undefined)}
                  label="Opportunity Class"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="MULTI_EXCHANGE_ARBITRAGE">Multi-Exchange Arbitrage</MenuItem>
                  <MenuItem value="EVENT_DRIVEN_OPPORTUNITY">Event Driven</MenuItem>
                  <MenuItem value="FEE_EXPLOITATION">Fee Exploitation</MenuItem>
                  <MenuItem value="STRUCTURED_LOOP_ARBITRAGE">Loop Arbitrage</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Risk Level</InputLabel>
                <Select
                  value={filters.risk_level || ''}
                  onChange={(e) => handleFilterChange('risk_level', e.target.value || undefined)}
                  label="Risk Level"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="LOW">Low</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                  <MenuItem value="VERY_HIGH">Very High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Min Return (%)"
                type="number"
                value={filters.min_return || ''}
                onChange={(e) => handleFilterChange('min_return', e.target.value ? parseFloat(e.target.value) : undefined)}
                fullWidth
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={filters.is_executed || false}
                    onChange={(e) => handleFilterChange('is_executed', e.target.checked || undefined)}
                  />
                }
                label="Executed Only"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Individual Opportunities */}
      <Typography variant="h6" gutterBottom>
        Individual Opportunities ({data?.total || 0})
      </Typography>
      
      <Grid container spacing={2}>
        {data?.items?.map((opportunity: Opportunity) => (
          <Grid item xs={12} key={opportunity.id}>
            <Card variant="outlined">
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {opportunity.token_symbol || 'Unknown Token'}
                    </Typography>
                    <Chip
                      label={opportunity.opportunity_class.replace(/_/g, ' ')}
                      color={getClassColor(opportunity.opportunity_class) as any}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={2}>
                    <Typography variant="body2" color="textSecondary">
                      Return
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      {formatPercentage(opportunity.estimated_return_percent)}
                    </Typography>
                    {opportunity.net_return_percent && (
                      <Typography variant="caption" color="textSecondary">
                        Net: {formatPercentage(opportunity.net_return_percent)}
                      </Typography>
                    )}
                  </Grid>
                  
                  <Grid item xs={12} md={2}>
                    <Typography variant="body2" color="textSecondary">
                      Capital Required
                    </Typography>
                    <Typography variant="body1">
                      {formatCurrency(opportunity.capital_required_usd)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={2}>
                    <Typography variant="body2" color="textSecondary">
                      Risk Level
                    </Typography>
                    <Chip
                      label={opportunity.risk_level}
                      color={getRiskColor(opportunity.risk_level) as any}
                      size="small"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={2}>
                    <Typography variant="body2" color="textSecondary">
                      Exchanges
                    </Typography>
                    <Typography variant="body2">
                      {opportunity.source_exchanges.join(', ')}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={1}>
                    <Chip
                      label={opportunity.is_executed ? 'Executed' : 'Pending'}
                      color={opportunity.is_executed ? 'success' : 'default'}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {data && data.total > pageSize && (
        <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
          <Pagination
            count={Math.ceil(data.total / pageSize)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default Opportunities;