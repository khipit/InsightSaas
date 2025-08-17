# News Backend Integration Guide

This document provides a guide for integrating with the InsightSaaS news backend API.

## Setup and Installation

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r ../requirements.txt

# Run migrations
python manage.py migrate

# Create sample data (optional)
python manage.py create_sample_news --count 20

# Run the development server
python manage.py runserver 4000
```

The backend will be available at `http://localhost:4000`

### 2. Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/insightsaas

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=3600

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# News Crawler
NEWS_API_KEY=your_news_api_key
CRAWLER_USER_AGENT=InsightSaaS/1.0

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

## API Endpoints

All endpoints return data in the following format:

```json
{
  "success": true|false,
  "data": {
    // Response data
  },
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### News Query Endpoints

#### GET /api/news/latest/
Get latest news articles

**Query Parameters:**
- `limit` (optional): Number of results (1-100, default: 10)

**Example:**
```bash
curl "http://localhost:4000/api/news/latest/?limit=5"
```

#### GET /api/news/search/
Search news articles with filters

**Query Parameters:**
- `query` (optional): Search query string
- `company_id` (optional): Filter by company ID
- `start_date` (optional): Start date (ISO format)
- `end_date` (optional): End date (ISO format)
- `sentiment` (optional): positive, negative, or neutral
- `category` (optional): Category slug
- `limit` (optional): Number of results (1-100, default: 10)
- `offset` (optional): Pagination offset (default: 0)
- `sort_by` (optional): latest, popularity, or relevance (default: latest)

**Example:**
```bash
curl "http://localhost:4000/api/news/search/?query=삼성&sentiment=positive&limit=10"
```

#### GET /api/news/company/{company_id}/
Get news for a specific company

**Parameters:**
- `company_id`: Company identifier

**Query Parameters:**
- `limit` (optional): Number of results (1-100, default: 20)

**Example:**
```bash
curl "http://localhost:4000/api/news/company/samsung_001/?limit=10"
```

#### GET /api/news/trending/
Get trending news articles (sorted by popularity)

**Query Parameters:**
- `limit` (optional): Number of results (1-100, default: 10)

**Example:**
```bash
curl "http://localhost:4000/api/news/trending/?limit=5"
```

#### GET /api/news/sentiment/
Get news by sentiment

**Query Parameters:**
- `sentiment` (required): positive, negative, or neutral
- `companyId` (optional): Filter by company ID (camelCase for frontend compatibility)
- `limit` (optional): Number of results (1-100, default: 10)

**Example:**
```bash
curl "http://localhost:4000/api/news/sentiment/?sentiment=positive&limit=10"
```

### News Management Endpoints (Authenticated)

#### POST /api/news/crawl/
Trigger news crawling for a company

**Headers:**
- `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "company_id": "company_456",
  "company_name": "Company Name"
}
```

#### GET /api/news/crawl/status/{job_id}/
Get crawl job status

**Headers:**
- `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "completed",
    "progress": 100,
    "message": "Crawl completed successfully"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Data Models

### NewsArticle
- `id`: Unique article identifier
- `title`: Article title
- `summary`: Article summary
- `url`: Original article URL
- `published_at`: Publication date
- `source`: News source
- `company_id`: Associated company ID
- `company_name`: Associated company name
- `sentiment`: positive, negative, or neutral
- `category`: News category
- `tags`: Article tags
- `view_count`: Number of views
- `popularity_score`: Popularity metric
- `is_active`: Whether article is active

### NewsCategory
- `name`: Category name
- `slug`: URL-friendly identifier
- `description`: Category description

### NewsTag
- `name`: Tag name
- `slug`: URL-friendly identifier

## Frontend Integration

### API Client Configuration

Update your API client base URL to point to the backend:

```typescript
// lib/api-client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api'
```

### Example Usage

The existing frontend news service (`lib/news-service.ts`) is already configured to work with these endpoints:

```typescript
import { newsService } from '@/lib/news-service'

// Get latest news
const articles = await newsService.getLatestNews(10)

// Search news
const searchResults = await newsService.searchNews({
  query: '삼성',
  sentiment: 'positive',
  limit: 20
})

// Get company news
const companyNews = await newsService.getCompanyNews('samsung_001', 15)
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

Common error codes:
- `UNAUTHORIZED` (401): Invalid or missing token
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Invalid request data
- `INTERNAL_ERROR` (500): Server error

## Performance Considerations

### Indexing
The database includes optimized indexes for:
- Published date
- Company ID + Published date
- Sentiment + Published date
- Popularity score
- Search vectors

### Caching
Consider implementing Redis caching for:
- Latest news (cache for 5-10 minutes)
- Trending news (cache for 15-30 minutes)
- Popular search queries

### Rate Limiting
Implement rate limiting for:
- Search endpoints: 100 requests/minute
- Crawl endpoints: 10 requests/hour

## Testing

Run the test suite:

```bash
cd backend
python manage.py test news_api
```

The test suite covers:
- Model functionality
- API endpoints
- Search and filtering
- Pagination
- Error handling
- Data validation

## Database Migrations

When making model changes:

```bash
# Create migrations
python manage.py makemigrations news_api

# Apply migrations
python manage.py migrate
```

## Production Deployment

### Database
- Use PostgreSQL for production
- Configure connection pooling
- Set up read replicas for heavy read workloads

### Security
- Use environment variables for sensitive data
- Configure CORS properly
- Use HTTPS in production
- Implement proper authentication

### Monitoring
- Set up logging for API requests
- Monitor response times
- Track error rates
- Monitor database performance

## Sample Data

Create sample data for testing:

```bash
python manage.py create_sample_news --count 50
```

This creates sample Korean news articles with various sentiments, companies, and categories for testing the API functionality.