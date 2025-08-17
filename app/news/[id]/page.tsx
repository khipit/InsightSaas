'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CalendarDays, User, Building2, Eye, Clock, ExternalLink } from 'lucide-react'
import { newsService } from '@/lib/news-service'
import type { NewsArticle } from '@/lib/api-types'

export default function NewsDetailPage() {
  const params = useParams()
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchArticleDetail() {
      if (!params.id || typeof params.id !== 'string') {
        setError('Invalid article ID')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        // Fetch article details
        const articleData = await newsService.getNewsDetail(params.id)
        setArticle(articleData)
        
        // Increment view count
        await newsService.incrementViewCount(params.id)
        
        // Update local view count to reflect the increment
        setArticle(prev => prev ? { ...prev, viewCount: (prev.viewCount || 0) + 1 } : null)
        
      } catch (err) {
        console.error('Failed to fetch article details:', err)
        setError('Failed to load article details')
      } finally {
        setLoading(false)
      }
    }

    fetchArticleDetail()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="text-center py-12">
                <h2 className="text-xl font-semibold mb-2">Error Loading Article</h2>
                <p className="text-gray-600">{error}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="text-center py-12">
                <h2 className="text-xl font-semibold mb-2">Article Not Found</h2>
                <p className="text-gray-600">The requested article could not be found.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800'
      case 'negative': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Article Header */}
          <Card>
            <CardHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {article.category && (
                    <Badge variant="outline" className="capitalize">
                      {article.category}
                    </Badge>
                  )}
                  <Badge className={getSentimentColor(article.sentiment)}>
                    {article.sentiment}
                  </Badge>
                </div>
                
                <CardTitle className="text-2xl md:text-3xl leading-tight">
                  {article.title}
                </CardTitle>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  {article.summary}
                </p>
                
                {/* Article Metadata */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  {article.author && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{article.author}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    <span>{article.source}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                  
                  {article.readTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{article.readTime} min read</span>
                    </div>
                  )}
                  
                  {article.viewCount !== undefined && (
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{article.viewCount.toLocaleString()} views</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Article Image */}
          {article.imageUrl && (
            <Card>
              <CardContent className="p-0">
                <img 
                  src={article.imageUrl} 
                  alt={article.title}
                  className="w-full h-64 md:h-80 object-cover rounded-lg"
                />
              </CardContent>
            </Card>
          )}

          {/* Article Content */}
          <Card>
            <CardContent className="prose prose-lg max-w-none">
              {article.content ? (
                <div 
                  className="py-6"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              ) : (
                <div className="py-6">
                  <p className="text-gray-600 mb-4">
                    Full content is available at the source website.
                  </p>
                  <a 
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Read full article at {article.source}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Article Footer */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <div>
                  Published: {formatDate(article.publishedAt)}
                  {article.updatedAt && article.updatedAt !== article.publishedAt && (
                    <span className="ml-4">
                      Updated: {formatDate(article.updatedAt)}
                    </span>
                  )}
                </div>
                <a 
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="h-3 w-3" />
                  Original Source
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}