# wiggle-website

**Status**: ✅ Complete & Production Ready  
**Version**: 1.0.0

## Overview

The `wiggle-website` is the React-based web dashboard for the Wiggle multi-exchange arbitrage system. It provides real-time monitoring, analytics, and management interfaces for opportunities, tokens, exchanges, and system health.

## Features

### 📊 Real-Time Dashboard
- **Live opportunity monitoring** with automatic refresh
- **Exchange health tracking** with error rates and performance metrics
- **Token performance analytics** with historical data
- **Multi-exchange opportunity visualization** with comprehensive charts

### 🎯 Advanced Analytics
- **Performance metrics** across custom time periods
- **Token and exchange pair analysis** with success rates
- **Opportunity trends** with Recharts visualizations
- **Export functionality** for data analysis

### 🔧 Production Ready
- **TypeScript integration** for type safety
- **Material-UI design system** with responsive layout
- **React Query** for efficient data fetching and caching
- **Docker deployment** with Nginx reverse proxy

### ⚡ Enhanced User Experience
- **Real-time data updates** with configurable refresh intervals
- **Advanced filtering and sorting** for all data views
- **Mobile-responsive design** for monitoring on any device
- **Professional dashboard layout** with comprehensive navigation

## Quick Start

### Prerequisites

- Node.js 18+
- Access to wiggle-service API
- Docker (for containerized deployment)

### Installation

```bash
# Clone and install
git clone <repo-url>
cd wiggle-website
npm install

# Install dependencies
npm ci
```

### Configuration

Create a `.env` file:

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENVIRONMENT=development

# Optional: Polling intervals (milliseconds)
REACT_APP_OPPORTUNITIES_POLL_INTERVAL=60000
REACT_APP_EXCHANGES_POLL_INTERVAL=30000
REACT_APP_ANALYTICS_POLL_INTERVAL=300000
```

### Running the Application

```bash
# Development mode with hot reload
npm start

# Build for production
npm run build

# Run production build locally
npm run serve
```

The application will be available at http://localhost:3000

## Features & Pages

### 🏠 Dashboard (`/`)
- **System overview** with key metrics
- **Recent opportunities** with quick access
- **Exchange health summary** with status indicators
- **Real-time updates** every 30 seconds

### 💰 Opportunities (`/opportunities`)
- **Multi-exchange opportunities** with priority indicators
- **Individual opportunities** with detailed metrics
- **Advanced filtering** by token, class, risk level, return threshold
- **Execution status tracking** for trading activities

### 🪙 Tokens (`/tokens`)
- **Token management** with comprehensive filtering
- **Chain-based organization** with visual indicators
- **Active/inactive status** management
- **Search functionality** by symbol or name

### 🏛️ Exchanges (`/exchanges`)
- **Exchange health monitoring** with real-time status
- **Performance metrics** including response times and error rates
- **Feature support indicators** (WebSocket, historical data)
- **Rate limiting and request tracking**

### 📈 Analytics (`/analytics`)
- **Performance overview** with configurable time ranges
- **Token performance charts** showing top performers
- **Exchange pair analysis** with success rates
- **Historical trends** with interactive charts

## Technology Stack

### Frontend Framework
- **React 18** with functional components and hooks
- **TypeScript** for type safety and better development experience
- **Material-UI (MUI)** for consistent design system
- **React Router** for client-side routing

### Data Management
- **React Query** for server state management and caching
- **Axios** for HTTP client with type safety
- **Custom hooks** for reusable data fetching logic

### Visualization
- **Recharts** for interactive charts and graphs
- **Material-UI components** for data display
- **Custom formatters** for currency, percentages, and time

### Build & Development
- **Create React App** for development and build tooling
- **TypeScript** compilation with strict mode
- **ESLint** and **Prettier** for code quality

## API Integration

The dashboard integrates with the wiggle-service API:

### Core Endpoints
```typescript
// Opportunities
GET /api/v1/opportunities - List opportunities with filtering
GET /api/v1/opportunities/multi-exchange - Multi-exchange opportunities
GET /api/v1/opportunities/stats/summary - Opportunity statistics

// Tokens
GET /api/v1/tokens - List tokens with filtering
GET /api/v1/tokens/search/{symbol} - Search tokens

// Exchanges
GET /api/v1/exchanges - List exchanges with health status
GET /api/v1/exchanges/health/summary - Exchange health summary

// Analytics
GET /api/v1/analytics/overview - Analytics overview
GET /api/v1/analytics/tokens/performance - Token performance
GET /api/v1/analytics/exchange-pairs - Exchange pair analytics
```

### Type Safety
```typescript
// Comprehensive type definitions
interface Opportunity {
  id: string;
  token_symbol: string;
  opportunity_class: OpportunityClass;
  estimated_return_percent: number;
  capital_required_usd: number;
  risk_level: RiskLevel;
  source_exchanges: string[];
  is_executed: boolean;
  created_at: string;
}

interface MultiExchangeOpportunity {
  id: string;
  symbol: string;
  name: string;
  priority: 'low' | 'medium' | 'high';
  best_overall_return: number;
  total_opportunities: number;
  supported_exchanges: string[];
}
```

## Monitoring & Analytics

### Real-Time Updates
- **Automatic polling** with configurable intervals
- **Error handling** with retry logic
- **Loading states** for better user experience
- **Optimistic updates** for responsive interactions

### Performance Features
- **Data caching** with React Query
- **Pagination** for large datasets
- **Lazy loading** for improved performance
- **Memoization** for expensive calculations

## Docker Deployment

### Production Build
```dockerfile
# Multi-stage build for optimized production image
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration
- **API proxy** to wiggle-service
- **Static asset serving** with caching
- **Gzip compression** for performance
- **Security headers** for production safety

## Development

### Setup Development Environment

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

### Code Quality

```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Format code
npm run format

# Run all checks
npm run check-all
```

### Build and Deploy

```bash
# Production build
npm run build

# Analyze bundle size
npm run analyze

# Docker build
docker build -t wiggle-website .
docker run -p 3000:3000 wiggle-website
```

## Production Considerations

### Performance
- **Code splitting** for optimal loading
- **Asset optimization** with Create React App
- **CDN deployment** for static assets
- **Service worker** for offline functionality

### Security
- **Environment variable** management
- **CORS configuration** with API
- **Content Security Policy** headers
- **Secure API communication**

### Monitoring
- **Error boundaries** for graceful error handling
- **Performance monitoring** with React DevTools
- **User analytics** integration ready
- **Health check endpoints** for load balancers

## License

MIT License - See LICENSE file for details.

---

*This web dashboard provides comprehensive monitoring and management for the Wiggle multi-exchange arbitrage system, with real-time updates and professional analytics interfaces.*