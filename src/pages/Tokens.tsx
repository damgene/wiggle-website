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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';

import apiService from '../services/api';
import { Token, TokenFilters } from '../types';

const Tokens: React.FC = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<TokenFilters>({});

  const pageSize = 20;

  const { data, isLoading, error } = useQuery(
    ['tokens', page, filters],
    () => apiService.getTokens(page, pageSize, filters),
    {
      keepPreviousData: true,
      refetchInterval: 120000, // Refresh every 2 minutes
    }
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleFilterChange = (field: keyof TokenFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
    setPage(1);
  };

  const getChainColor = (chain: string) => {
    switch (chain) {
      case 'ethereum': return 'primary';
      case 'bitcoin': return 'warning';
      case 'bsc': return 'secondary';
      case 'polygon': return 'info';
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
          Error loading tokens: {(error as Error).message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tokens
      </Typography>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Symbol"
                value={filters.symbol || ''}
                onChange={(e) => handleFilterChange('symbol', e.target.value || undefined)}
                fullWidth
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Chain</InputLabel>
                <Select
                  value={filters.chain || ''}
                  onChange={(e) => handleFilterChange('chain', e.target.value || undefined)}
                  label="Chain"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="ethereum">Ethereum</MenuItem>
                  <MenuItem value="bitcoin">Bitcoin</MenuItem>
                  <MenuItem value="bsc">BSC</MenuItem>
                  <MenuItem value="polygon">Polygon</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={filters.is_active !== false}
                    onChange={(e) => handleFilterChange('is_active', e.target.checked ? undefined : false)}
                  />
                }
                label="Active Only"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Token List */}
      <Typography variant="h6" gutterBottom>
        Tokens ({data?.total || 0})
      </Typography>
      
      <Grid container spacing={2}>
        {data?.items?.map((token: Token) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={token.id}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="h6">{token.symbol}</Typography>
                  <Chip
                    label={token.is_active ? 'Active' : 'Inactive'}
                    color={token.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {token.name}
                </Typography>
                
                <Chip
                  label={token.chain.toUpperCase()}
                  color={getChainColor(token.chain) as any}
                  size="small"
                  sx={{ mb: 1 }}
                />
                
                {token.address && (
                  <Typography variant="caption" display="block" sx={{ wordBreak: 'break-all', mt: 1 }}>
                    {token.address.substring(0, 10)}...{token.address.substring(token.address.length - 8)}
                  </Typography>
                )}
                
                {token.tags.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    {token.tags.slice(0, 3).map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                    {token.tags.length > 3 && (
                      <Typography variant="caption" color="textSecondary">
                        +{token.tags.length - 3} more
                      </Typography>
                    )}
                  </Box>
                )}
                
                {token.notes && (
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                    {token.notes.length > 100 ? `${token.notes.substring(0, 100)}...` : token.notes}
                  </Typography>
                )}
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

export default Tokens;