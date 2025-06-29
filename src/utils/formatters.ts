/**
 * Utility functions for formatting data in the UI
 */

import numeral from 'numeral';
import { format, formatDistanceToNow } from 'date-fns';

/**
 * Format currency values
 */
export const formatCurrency = (value: number, decimals: number = 2): string => {
  if (value === 0) return '$0';
  
  if (Math.abs(value) >= 1000000) {
    return numeral(value).format('$0.0a').toUpperCase(); // $1.2M
  }
  
  if (Math.abs(value) >= 1000) {
    return numeral(value).format('$0.0a').toUpperCase(); // $1.2K
  }
  
  return numeral(value).format(`$0,0.${'0'.repeat(decimals)}`);
};

/**
 * Format percentage values
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
  return numeral(value / 100).format(`0,0.${'0'.repeat(decimals)}%`);
};

/**
 * Format large numbers with appropriate suffixes
 */
export const formatNumber = (value: number, decimals: number = 1): string => {
  if (value === 0) return '0';
  
  if (Math.abs(value) >= 1000000000) {
    return numeral(value).format('0.0b').toUpperCase(); // 1.2B
  }
  
  if (Math.abs(value) >= 1000000) {
    return numeral(value).format('0.0a').toUpperCase(); // 1.2M
  }
  
  if (Math.abs(value) >= 1000) {
    return numeral(value).format('0.0a').toUpperCase(); // 1.2K
  }
  
  return numeral(value).format(`0,0.${'0'.repeat(decimals)}`);
};

/**
 * Format dates and times
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMM dd, yyyy HH:mm');
};

export const formatDateShort = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMM dd');
};

export const formatTimeAgo = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

/**
 * Format duration in hours to human readable format
 */
export const formatDuration = (hours: number): string => {
  if (hours < 1) {
    return `${Math.round(hours * 60)}m`;
  }
  
  if (hours < 24) {
    return `${Math.round(hours)}h`;
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = Math.round(hours % 24);
  
  if (remainingHours === 0) {
    return `${days}d`;
  }
  
  return `${days}d ${remainingHours}h`;
};

/**
 * Format bytes to human readable format
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * Format decimal numbers with appropriate precision
 */
export const formatDecimal = (value: number, maxDecimals: number = 8): string => {
  // Remove trailing zeros and unnecessary decimal points
  return parseFloat(value.toFixed(maxDecimals)).toString();
};

/**
 * Get color for percentage values (green for positive, red for negative)
 */
export const getPercentageColor = (value: number): string => {
  if (value > 0) return '#4caf50'; // Green
  if (value < 0) return '#f44336'; // Red
  return '#757575'; // Gray
};