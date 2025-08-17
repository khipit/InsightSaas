# KHIP Backend

A TypeScript-based backend API for the Korean Corporate Intelligence Platform (KHIP) using Express, Prisma, and PostgreSQL.

## Features

- **Authentication**: JWT-based authentication with bcrypt password hashing
- **News API**: Endpoints for fetching and managing news articles
- **BigKinds Crawler**: Automated news crawler for Korean business news
- **Database**: Prisma ORM with PostgreSQL for data persistence
- **Type Safety**: Full TypeScript implementation with Zod validation

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with bcrypt hashing
- **Validation**: Zod schema validation
- **Development**: tsx for hot reloading

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/khip_db"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=3001
   NODE_ENV=development
   BIGKINDS_API_KEY="your-bigkinds-api-key"
   FRONTEND_URL="http://localhost:3000"
   ```

3. **Database Setup**:
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push database schema
   npm run db:push
   
   # Or run migrations (for production)
   npm run db:migrate
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/logout` - Logout user

### News

- `GET /api/news` - Get latest news articles (with pagination and filters)
- `GET /api/news/:id` - Get specific news article
- `GET /api/news/meta/sources` - Get available news sources
- `GET /api/news/meta/categories` - Get news categories
- `GET /api/news/company/:companyId` - Get company-specific news (requires auth)

### Query Parameters for News

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `category` - Filter by category
- `source` - Filter by news source
- `companyId` - Filter by company ID
- `startDate` - Filter by start date (ISO format)
- `endDate` - Filter by end date (ISO format)
- `search` - Search in title, content, and summary

## News Crawler

The BigKinds crawler can be run in several modes:

### Crawl Latest News
```bash
npm run crawler latest [maxArticles]
```

### Crawl Company-Specific News
```bash
npm run crawler company <companyId> [days]
```

### Crawl All Companies
```bash
npm run crawler all-companies
```

### Available Company IDs
- `samsung` - 삼성전자
- `lg-electronics` - LG전자
- `lg-chem` - LG화학
- `naver` - 네이버
- `kakao` - 카카오
- `coupang` - 쿠팡
- `hyundai-motor` - 현대자동차
- `kia` - 기아
- `sk-hynix` - SK하이닉스
- `lg-energy` - LG에너지솔루션

## Database Schema

### User Model
- `id` - Unique identifier
- `email` - User email (unique)
- `name` - User display name
- `password` - Hashed password
- `avatar` - Profile picture URL
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

### Purchase Model
- `id` - Unique identifier
- `userId` - Reference to user
- `type` - Purchase type (SINGLE_REPORT, SNAPSHOT_PLAN, CUSTOM_REPORT, TRIAL)
- `companyId` - Related company ID
- `companyName` - Company name
- `status` - Purchase status (PENDING, UNDER_REVIEW, DELIVERED, FAILED, COMPLETED)
- `amount` - Purchase amount
- `subscriptionEndDate` - Subscription expiry (optional)
- `trialEndDate` - Trial expiry (optional)

### News Model
- `id` - Unique identifier
- `title` - Article title
- `content` - Full article content
- `summary` - Article summary
- `url` - Original article URL (unique)
- `source` - News source
- `author` - Article author
- `publishedAt` - Publication timestamp
- `category` - News category
- `tags` - Article tags array
- `sentiment` - Sentiment analysis result
- `companyIds` - Related company IDs array
- `crawledAt` - Crawl timestamp

## Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Database Commands

- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## Production Deployment

1. **Environment Variables**: Ensure all production environment variables are set
2. **Database**: Set up PostgreSQL instance and run migrations
3. **Build**: Run `npm run build` to compile TypeScript
4. **Start**: Use `npm start` or process manager like PM2

## Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT token authentication with configurable expiry
- CORS protection with configurable origins
- Helmet.js for security headers
- Input validation with Zod schemas
- SQL injection protection via Prisma ORM

## Error Handling

The API implements comprehensive error handling:
- Validation errors return 400 with specific field errors
- Authentication errors return 401/403 with clear messages
- Resource not found errors return 404
- Server errors return 500 with sanitized messages (production)

## Logging

All requests are logged with timestamp, method, and path. Errors are logged with full details for debugging.

## License

MIT License - see LICENSE file for details.