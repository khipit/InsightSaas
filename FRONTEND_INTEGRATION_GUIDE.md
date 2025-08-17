# Frontend Integration Guide for News Article Detail Pages

This guide provides instructions for integrating the news article detail functionality into frontend applications.

## Overview

The news article detail feature provides:
- Detailed article metadata retrieval
- View count tracking and aggregation  
- Rich content display with metadata
- Error handling and loading states

## API Endpoints

### Get Article Details
```
GET /news/{articleId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "article": {
      "id": "news_123",
      "title": "Korean Tech Giants Report Strong Q4 Earnings",
      "summary": "Major Korean technology companies show robust growth...",
      "content": "Full article content here...",
      "url": "https://example.com/news/123",
      "publishedAt": "2024-01-01T00:00:00Z",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "source": "Korea Economic Daily",
      "author": "John Kim",
      "companyId": "company_456",
      "sentiment": "positive",
      "category": "earnings",
      "tags": ["technology", "earnings", "Q4", "Korean companies"],
      "viewCount": 1245,
      "imageUrl": "https://example.com/images/news_123.jpg",
      "readTime": 3
    }
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Increment View Count
```
POST /news/{articleId}/view
```

**Response:**
```json
{
  "success": true,
  "data": {
    "viewCount": 1246,
    "success": true
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Frontend Service Integration

### Using the NewsService

```typescript
import { newsService } from '@/lib/news-service'
import type { NewsArticle } from '@/lib/api-types'

// Fetch article details
const fetchArticleDetails = async (articleId: string): Promise<NewsArticle> => {
  try {
    const article = await newsService.getNewsDetail(articleId)
    return article
  } catch (error) {
    console.error('Failed to fetch article:', error)
    throw error
  }
}

// Increment view count
const trackArticleView = async (articleId: string): Promise<number> => {
  try {
    const newViewCount = await newsService.incrementViewCount(articleId)
    return newViewCount
  } catch (error) {
    console.error('Failed to track view:', error)
    throw error
  }
}
```

### React Component Implementation

A complete example is available at `/app/news/[id]/page.tsx`. Key implementation patterns:

1. **Page Load Flow:**
   ```typescript
   useEffect(() => {
     async function loadArticle() {
       // 1. Fetch article details
       const article = await newsService.getNewsDetail(articleId)
       setArticle(article)
       
       // 2. Increment view count
       await newsService.incrementViewCount(articleId)
       
       // 3. Update local state with new view count
       setArticle(prev => ({ ...prev, viewCount: (prev.viewCount || 0) + 1 }))
     }
     
     loadArticle()
   }, [articleId])
   ```

2. **Error Handling:**
   ```typescript
   try {
     const article = await newsService.getNewsDetail(articleId)
     setArticle(article)
   } catch (error) {
     if (error.response?.status === 404) {
       setError('Article not found')
     } else {
       setError('Failed to load article')
     }
   }
   ```

3. **Loading States:**
   ```typescript
   if (loading) return <ArticleSkeletonLoader />
   if (error) return <ErrorDisplay message={error} />
   if (!article) return <NotFoundDisplay />
   ```

## Metadata Display Components

### Article Header
Display core metadata prominently:
- Title
- Summary
- Author
- Source
- Publication date
- Category and sentiment badges
- Read time estimate
- View count

### Content Section
- Full article content (if available)
- Featured image
- Link to original source

### Tags and Categories
- Render tags as badges/chips
- Make them clickable for filtering
- Group by category if needed

### Engagement Metrics
- View count display
- Reading time estimation
- Social sharing buttons (if applicable)

## Styling Guidelines

### Responsive Design
```css
/* Mobile-first responsive layout */
.article-container {
  max-width: 4xl; /* 896px */
  margin: 0 auto;
  padding: 1rem;
}

@media (md) {
  .article-container {
    padding: 2rem;
  }
}
```

### Typography Hierarchy
```css
.article-title {
  font-size: 1.875rem; /* 30px */
  line-height: 1.2;
}

@media (md) {
  .article-title {
    font-size: 2.25rem; /* 36px */
  }
}

.article-content {
  font-size: 1.125rem; /* 18px */
  line-height: 1.7;
}
```

### Status Indicators
```typescript
const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case 'positive': return 'bg-green-100 text-green-800'
    case 'negative': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}
```

## Performance Optimization

### 1. Image Optimization
```typescript
// Use Next.js Image component for optimized loading
import Image from 'next/image'

<Image
  src={article.imageUrl}
  alt={article.title}
  width={800}
  height={400}
  className="rounded-lg"
  priority={true} // For above-the-fold images
/>
```

### 2. Content Streaming
```typescript
// Load article metadata first, content second
const [metadata, setMetadata] = useState(null)
const [content, setContent] = useState(null)

useEffect(() => {
  // Load metadata immediately
  loadArticleMetadata(articleId).then(setMetadata)
  
  // Load full content separately
  loadArticleContent(articleId).then(setContent)
}, [articleId])
```

### 3. View Count Debouncing
```typescript
// Debounce view tracking to avoid excessive API calls
import { useCallback } from 'react'
import { debounce } from 'lodash'

const debouncedTrackView = useCallback(
  debounce((articleId: string) => {
    newsService.incrementViewCount(articleId)
  }, 1000),
  []
)
```

## Error Handling Best Practices

### 1. Network Errors
```typescript
const handleApiError = (error: any) => {
  if (!navigator.onLine) {
    return 'No internet connection. Please check your network.'
  }
  
  if (error.response?.status === 404) {
    return 'Article not found.'
  }
  
  if (error.response?.status >= 500) {
    return 'Server error. Please try again later.'
  }
  
  return 'Failed to load article. Please try again.'
}
```

### 2. Graceful Degradation
```typescript
// Show basic info even if enhanced metadata fails
const [basicArticle, setBasicArticle] = useState(null)
const [enrichedData, setEnrichedData] = useState(null)

useEffect(() => {
  // Always try to load basic article data
  loadBasicArticle(articleId)
    .then(setBasicArticle)
    .catch(handleError)
  
  // Enhance with additional metadata (optional)
  loadEnrichedMetadata(articleId)
    .then(setEnrichedData)
    .catch(() => {
      // Silently fail - basic article is still functional
      console.warn('Enhanced metadata unavailable')
    })
}, [articleId])
```

## Accessibility Considerations

### 1. Semantic HTML
```tsx
<article className="news-article">
  <header className="article-header">
    <h1 className="article-title">{article.title}</h1>
    <div className="article-meta">
      <time dateTime={article.publishedAt}>
        {formatDate(article.publishedAt)}
      </time>
      <address className="article-author">{article.author}</address>
    </div>
  </header>
  
  <main className="article-content">
    {/* Article content */}
  </main>
</article>
```

### 2. Screen Reader Support
```tsx
<div aria-label={`Article has ${article.viewCount} views`}>
  <Eye className="h-4 w-4" aria-hidden="true" />
  <span>{article.viewCount.toLocaleString()} views</span>
</div>
```

### 3. Keyboard Navigation
```tsx
<nav aria-label="Article navigation">
  <button 
    onClick={goToPrevious}
    aria-label="Go to previous article"
  >
    Previous
  </button>
  <button 
    onClick={goToNext}
    aria-label="Go to next article"
  >
    Next
  </button>
</nav>
```

## Integration Checklist

- [ ] Install and configure the NewsService
- [ ] Create article detail page component
- [ ] Implement loading and error states
- [ ] Add metadata display components
- [ ] Implement view count tracking
- [ ] Test responsive design
- [ ] Add accessibility features
- [ ] Optimize for performance
- [ ] Handle edge cases and errors
- [ ] Test with various article types and metadata

## Common Issues and Solutions

### Issue: View count not updating
**Solution:** Ensure view tracking happens after article load and update local state:
```typescript
const article = await newsService.getNewsDetail(articleId)
setArticle(article)

const newViewCount = await newsService.incrementViewCount(articleId)
setArticle(prev => ({ ...prev, viewCount: newViewCount }))
```

### Issue: Missing metadata fields
**Solution:** Provide fallbacks and optional rendering:
```typescript
{article.author && (
  <span className="author">By {article.author}</span>
)}

{article.readTime ? (
  <span>{article.readTime} min read</span>
) : (
  <span>Quick read</span>
)}
```

### Issue: Long loading times
**Solution:** Implement progressive loading:
```typescript
// Load critical data first
const criticalData = await loadCriticalArticleData(articleId)
setArticle(criticalData)

// Load enhanced data in background
loadEnhancedData(articleId).then(enhancedData => {
  setArticle(prev => ({ ...prev, ...enhancedData }))
})
```

For additional support or questions, refer to the API documentation or contact the development team.