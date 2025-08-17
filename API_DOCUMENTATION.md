# Backend API Documentation
This document outlines the expected API structure for the InsightSaaS backend server that should run on http://localhost:4000.

## Base Configuration

- **Base URL**: `http://localhost:4000`
- **Authentication**: JWT Bearer tokens
- **Content-Type**: `application/json`

## Authentication Endpoints

### POST /auth/signup
Register a new user with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "avatar": "https://example.com/avatar.jpg",
      "hasActiveSubscription": false,
      "role": "user",
      "emailVerified": false,
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "token": "jwt_token_here",
    "expiresIn": 3600
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### POST /auth/login
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "avatar": "https://example.com/avatar.jpg",
      "hasActiveSubscription": true,
      "role": "user",
      "emailVerified": true,
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "token": "jwt_token_here",
    "expiresIn": 3600
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### POST /auth/forgot-password
Request password reset email.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Password reset email sent successfully"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### POST /auth/reset-password
Reset password using token from email.

**Request:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Password reset successfully"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### POST /auth/google
Google OAuth authentication.

**Request:**
```json
{
  "token": "google_oauth_token"
}
```

**Response:** Same as /auth/login

### POST /auth/logout
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

# Email Configuration (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=no-reply@insightsaas.com

## Implementation Notes

### Authentication & Authorization
- All protected endpoints require a valid JWT token in the Authorization header
- JWT tokens should include user role and permissions
- Password reset tokens should expire within 1 hour
- Email verification tokens should expire within 24 hours

### Password Security
- Passwords should be hashed using bcrypt with at least 12 rounds
- Implement password strength requirements (minimum 6 characters)
- Store password reset tokens securely with expiration

### User Roles & Permissions
- **Admin Role (`admin`)**: Full access to all endpoints, can manage users and purchases
- **User Role (`user`)**: Limited access to user-specific data and operations

#### Admin-only Endpoints:
- `GET /purchases` - View all purchases
- `POST /purchases/{id}/status` - Update purchase status
- `POST /news/crawl` - Trigger news crawling
- `GET /admin/*` - All admin dashboard endpoints

#### User Endpoints:
- `GET /purchases/me` - View own purchases only
- `GET /auth/me` - View own profile
- `POST /purchases` - Create new purchase

### Email Integration
- Implement SMTP configuration for password reset emails
- Email templates should be professional and branded
- Include proper unsubscribe links and privacy notices

### Rate Limiting
Consider implementing rate limiting, especially for:
- Authentication endpoints (prevent brute force attacks)
- Password reset requests (prevent abuse)
- News crawler endpoints

### Security Headers
- Implement CORS properly for frontend domain
- Use secure JWT signing algorithms (RS256 recommended)
- Implement request rate limiting and validation

### Database Schema
```sql
-- User table updates
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NOT NULL;

-- Password reset tokens table
CREATE TABLE password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Email verification tokens table
CREATE TABLE email_verification_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Caching
News data should be cached to reduce external API calls.

### Error Handling
All endpoints should return consistent error response format.

### Logging
Implement comprehensive logging for debugging and monitoring.

### Data Validation
Validate all incoming request data using a validation library like Joi or Zod.