# Backend API Documentation
This document outlines the expected API structure for the InsightSaaS backend server that should run on http://localhost:4000.

## Base Configuration

- **Base URL**: `http://localhost:4000`
- **Authentication**: JWT Bearer tokens
- **Content-Type**: `application/json`
Authentication Endpoints
POST /auth/login
Login with email and password.

Request:

JSON
{
  "email": "user@example.com",
  "password": "password123"
}
Response:

JSON
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "avatar": "https://example.com/avatar.jpg",
      "hasActiveSubscription": true
    },
    "token": "jwt_token_here",
    "expiresIn": 3600
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
POST /auth/google
Google OAuth authentication.

Request:

JSON
{
  "token": "google_oauth_token"
}
Response: Same as /auth/login

POST /auth/logout
Logout and invalidate token.

Headers: Authorization: Bearer {token}

Response:

JSON
{
  "success": true,
  "timestamp": "2024-01-01T00:00:00Z"
}
GET /auth/me
Get current user information.

Headers: Authorization: Bearer {token}

Response:

JSON
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://example.com/avatar.jpg",
    "hasActiveSubscription": true
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
POST /auth/refresh
Refresh authentication token.

Headers: Authorization: Bearer {token}

Response: Same as /auth/login

Purchase Management Endpoints
GET /purchases
Get all purchases (admin only).

Headers: Authorization: Bearer {token}

Response:

JSON
{
  "success": true,
  "data": {
    "purchases": [
      {
        "id": "purchase_123",
        "userId": "user_123",
        "type": "single-report",
        "companyId": "company_456",
        "companyName": "Samsung Electronics",
        "status": "delivered",
        "purchaseDate": "2024-01-01T00:00:00Z",
        "deliveryDate": "2024-01-01T12:00:00Z",
        "reportUrl": "https://example.com/report.pdf",
        "amount": 49.99,
        "subscriptionEndDate": null,
        "trialEndDate": null
      }
    ],
    "total": 1,
    "hasNextPage": false
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
GET /purchases/user/{userId}
Get purchases for a specific user.

Headers: Authorization: Bearer {token}

Response: Same structure as GET /purchases

POST /purchases
Create a new purchase.

Headers: Authorization: Bearer {token}

Request:

JSON
{
  "type": "single-report",
  "companyId": "company_456",
  "companyName": "Samsung Electronics",
  "amount": 49.99
}
Response:

JSON
{
  "success": true,
  "data": {
    "id": "purchase_123",
    "userId": "user_123",
    "type": "single-report",
    "companyId": "company_456",
    "companyName": "Samsung Electronics",
    "status": "pending",
    "purchaseDate": "2024-01-01T00:00:00Z",
    "amount": 49.99
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
PATCH /purchases/{purchaseId}/status
Update purchase status.

Headers: Authorization: Bearer {token}

Request:

JSON
{
  "status": "delivered",
  "reportUrl": "https://example.com/report.pdf"
}
Response: Purchase object with updated status

GET /purchases/user/{userId}/access/company/{companyId}
Check if user has access to a specific company.

Headers: Authorization: Bearer {token}

Response:

JSON
{
  "success": true,
  "data": {
    "hasAccess": true
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
GET /purchases/user/{userId}/snapshot-plan
Check if user has snapshot plan.

Headers: Authorization: Bearer {token}

Response:

JSON
{
  "success": true,
  "data": {
    "hasSnapshot": true
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
GET /purchases/user/{userId}/active-trial
Check if user has active trial.

Headers: Authorization: Bearer {token}

Response:

JSON
{
  "success": true,
  "data": {
    "hasActiveTrial": false
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
GET /purchases/user/{userId}/used-trial
Check if user has used trial.

Headers: Authorization: Bearer {token}

Response:

JSON
{
  "success": true,
  "data": {
    "hasUsedTrial": true
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
GET /purchases/user/{userId}/custom-report
Check if user has custom report access.

Headers: Authorization: Bearer {token}

Response:

JSON
{
  "success": true,
  "data": {
    "hasCustomReport": false
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
GET /purchases?status=pending,under_review
Get pending purchases.

Headers: Authorization: Bearer {token}

Response: Same structure as GET /purchases

GET /purchases/user/{userId}/subscription-end-date
Get subscription end date.

Headers: Authorization: Bearer {token}

Response:

JSON
{
  "success": true,
  "data": {
    "endDate": "2024-02-01T00:00:00Z"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
GET /purchases/user/{userId}/trial-end-date
Get trial end date.

Headers: Authorization: Bearer {token}

Response:

JSON
{
  "success": true,
  "data": {
    "endDate": null
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
News Crawler Endpoints
GET /news/latest?limit=10
Get latest news articles.

Response:

JSON
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": "news_123",
        "title": "Korean Tech Giants Report Strong Q4 Earnings",
        "summary": "Major Korean technology companies show robust growth...",
        "url": "https://example.com/news/123",
        "publishedAt": "2024-01-01T00:00:00Z",
        "source": "Korea Economic Daily",
        "companyId": "company_456",
        "sentiment": "positive"
      }
    ],
    "total": 1,
    "hasNextPage": false
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
GET /news/search?query=samsung&companyId=company_456&limit=10
Search news articles.

Query Parameters:

query: Search query string
companyId: Filter by company ID
startDate: Filter by start date (ISO format)
endDate: Filter by end date (ISO format)
limit: Number of results to return
offset: Pagination offset
Response: Same structure as /news/latest

GET /news/company/{companyId}?limit=20
Get news for a specific company.

Response: Same structure as /news/latest

GET /news/trending?limit=10
Get trending news articles.

Response: Same structure as /news/latest

GET /news/sentiment?sentiment=positive&companyId=company_456&limit=10
Get news by sentiment.

Query Parameters:

sentiment: positive, negative, or neutral
companyId: Optional company filter
limit: Number of results
Response: Same structure as /news/latest

POST /news/crawl
Trigger news crawling for a company (admin/system function).

Headers: Authorization: Bearer {token}

Request:

JSON
{
  "companyId": "company_456"
}
Response:

JSON
{
  "success": true,
  "data": {
    "message": "News crawl job started",
    "jobId": "job_789"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
GET /news/crawl/status/{jobId}
Get crawl job status.

Headers: Authorization: Bearer {token}

Response:

JSON
{
  "success": true,
  "data": {
    "status": "completed",
    "progress": 100,
    "message": "Crawl completed successfully"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
Error Responses
All endpoints may return error responses in this format:

JSON
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
Common Error Codes:
UNAUTHORIZED (401): Invalid or missing token
FORBIDDEN (403): Insufficient permissions
NOT_FOUND (404): Resource not found
VALIDATION_ERROR (400): Invalid request data
INTERNAL_ERROR (500): Server error
Environment Variables
The backend should use these environment variables:

env
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
Implementation Notes
Authentication: All protected endpoints require a valid JWT token in the Authorization header.

Rate Limiting: Consider implementing rate limiting, especially for news crawler endpoints.

Caching: News data should be cached to reduce external API calls.

Database: Purchase and user data should be persisted in a database (PostgreSQL recommended).

Error Handling: All endpoints should return consistent error response format.

Logging: Implement comprehensive logging for debugging and monitoring.

Data Validation: Validate all incoming request data.

CORS: Configure CORS to allow requests from the frontend domain.

## Category Management Endpoints

GET /categories
Get all categories.

Query Parameters:
- limit: Number of results to return (default: 50)
- offset: Pagination offset (default: 0)

Response:
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "category_123",
        "name": "경제",
        "description": "경제 관련 뉴스",
        "color": "#3B82F6",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 1,
    "hasNextPage": false
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

GET /categories/{id}
Get a specific category by ID.

Response:
```json
{
  "success": true,
  "data": {
    "id": "category_123",
    "name": "경제",
    "description": "경제 관련 뉴스",
    "color": "#3B82F6",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

POST /categories
Create a new category.

Headers: Authorization: Bearer {token}

Request:
```json
{
  "name": "기술",
  "description": "기술 및 IT 뉴스",
  "color": "#10B981"
}
```

Response: Same as GET /categories/{id}

PUT /categories/{id}
Update an existing category.

Headers: Authorization: Bearer {token}

Request:
```json
{
  "name": "기술 업데이트",
  "description": "기술 및 IT 관련 뉴스",
  "color": "#059669"
}
```

Response: Same as GET /categories/{id}

DELETE /categories/{id}
Delete a category.

Headers: Authorization: Bearer {token}

Response:
```json
{
  "success": true,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Tag Management Endpoints

GET /tags
Get all tags.

Query Parameters:
- limit: Number of results to return (default: 50)
- offset: Pagination offset (default: 0)

Response:
```json
{
  "success": true,
  "data": {
    "tags": [
      {
        "id": "tag_123",
        "name": "긴급",
        "color": "#EF4444",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 1,
    "hasNextPage": false
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

GET /tags/{id}
Get a specific tag by ID.

Response: Same structure as categories

GET /tags/search
Search tags by name.

Query Parameters:
- query: Search query string
- limit: Number of results to return (default: 20)

Response: Same as GET /tags

POST /tags
Create a new tag.

Headers: Authorization: Bearer {token}

Request:
```json
{
  "name": "속보",
  "color": "#F59E0B"
}
```

Response: Same as GET /tags/{id}

PUT /tags/{id}
Update an existing tag.

Headers: Authorization: Bearer {token}

Request:
```json
{
  "name": "속보 업데이트",
  "color": "#D97706"
}
```

Response: Same as GET /tags/{id}

DELETE /tags/{id}
Delete a tag.

Headers: Authorization: Bearer {token}

Response:
```json
{
  "success": true,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Enhanced News Endpoints

The following endpoints have been enhanced to support categories and tags:

GET /news/search
Enhanced search with category and tag filtering.

Query Parameters:
- query: Search query string
- companyId: Filter by company ID
- categoryId: Filter by category ID
- tagIds: Filter by tag IDs (can be multiple: tagIds=tag1&tagIds=tag2)
- startDate: Filter by start date (ISO format)
- endDate: Filter by end date (ISO format)
- limit: Number of results to return
- offset: Pagination offset

Response: Enhanced news articles with category and tag information
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": "news_123",
        "title": "Korean Tech Giants Report Strong Q4 Earnings",
        "summary": "Major Korean technology companies show robust growth...",
        "url": "https://example.com/news/123",
        "publishedAt": "2024-01-01T00:00:00Z",
        "source": "Korea Economic Daily",
        "companyId": "company_456",
        "sentiment": "positive",
        "categoryId": "category_123",
        "category": {
          "id": "category_123",
          "name": "경제",
          "description": "경제 관련 뉴스",
          "color": "#3B82F6"
        },
        "tagIds": ["tag_123", "tag_456"],
        "tags": [
          {
            "id": "tag_123",
            "name": "긴급",
            "color": "#EF4444"
          }
        ]
      }
    ],
    "total": 1,
    "hasNextPage": false
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

GET /news/category/{categoryId}
Get news articles by category.

Query Parameters:
- limit: Number of results to return (default: 20)

Response: Same structure as enhanced news search

GET /news/tag/{tagId}
Get news articles by tag.

Query Parameters:
- limit: Number of results to return (default: 20)

Response: Same structure as enhanced news search

POST /news
Create a new news article.

Headers: Authorization: Bearer {token}

Request:
```json
{
  "title": "새로운 뉴스 기사",
  "summary": "뉴스 기사 요약",
  "url": "https://example.com/news",
  "source": "뉴스 소스",
  "companyId": "company_123",
  "sentiment": "positive",
  "categoryId": "category_123",
  "tagIds": ["tag_123", "tag_456"]
}
```

Response: Created news article with full category and tag information

PUT /news/{id}
Update an existing news article.

Headers: Authorization: Bearer {token}

Request: Same as POST /news (all fields optional)

Response: Updated news article with full category and tag information

DELETE /news/{id}
Delete a news article.

Headers: Authorization: Bearer {token}

Response:
```json
{
  "success": true,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

GET /news/{id}
Get a specific news article by ID.

Response: Single news article with full category and tag information