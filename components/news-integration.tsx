"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Newspaper, Search, TrendingUp, Calendar, ExternalLink } from "lucide-react"
import { newsService } from "@/lib/news-service"
import type { NewsArticle } from "@/lib/api-types"

interface NewsIntegrationProps {
  companyId?: string
  companyName?: string
}

export function NewsIntegration({ companyId, companyName }: NewsIntegrationProps) {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'latest' | 'trending' | 'company' | 'search'>('latest')
  const [error, setError] = useState<string | null>(null)

  // Load latest news on component mount
  useEffect(() => {
    loadLatestNews()
  }, [])

  const loadLatestNews = async () => {
    setLoading(true)
    setError(null)
    try {
      const latestNews = await newsService.getLatestNews(10)
      setNews(latestNews)
      setActiveTab('latest')
    } catch (error) {
      console.log('API news failed, using mock data')
      setError('API connection failed, showing mock data')
      // Mock news data for demonstration
      setNews([
        {
          id: '1',
          title: 'Korean Tech Giants Report Strong Q4 Earnings',
          summary: 'Major Korean technology companies show robust growth in the fourth quarter, driven by AI and semiconductor demand.',
          url: 'https://example.com/news/1',
          publishedAt: new Date().toISOString(),
          source: 'Korea Economic Daily',
          sentiment: 'positive'
        },
        {
          id: '2',
          title: 'New AI Regulations Impact Korean Startups',
          summary: 'Government announces new AI governance framework affecting local technology companies.',
          url: 'https://example.com/news/2',
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          source: 'TechKorea',
          sentiment: 'neutral'
        },
        {
          id: '3',
          title: 'Market Volatility Affects Korean Stock Prices',
          summary: 'Korean stock market experiences fluctuations amid global economic uncertainty.',
          url: 'https://example.com/news/3',
          publishedAt: new Date(Date.now() - 7200000).toISOString(),
          source: 'Financial Times Korea',
          sentiment: 'negative'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const loadTrendingNews = async () => {
    setLoading(true)
    setError(null)
    try {
      const trendingNews = await newsService.getTrendingNews(10)
      setNews(trendingNews)
      setActiveTab('trending')
    } catch (error) {
      console.log('API trending news failed, using mock data')
      setError('API connection failed, showing mock data')
      // Mock trending news
      setNews([
        {
          id: 'trending1',
          title: 'Samsung Announces Revolutionary AI Chip Architecture',
          summary: 'Samsung reveals next-generation AI processing chip that could transform mobile computing.',
          url: 'https://example.com/trending/1',
          publishedAt: new Date().toISOString(),
          source: 'Samsung Newsroom',
          sentiment: 'positive'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const loadCompanyNews = async () => {
    if (!companyId) return
    
    setLoading(true)
    setError(null)
    try {
      const companyNews = await newsService.getCompanyNews(companyId, 10)
      setNews(companyNews)
      setActiveTab('company')
    } catch (error) {
      console.log('API company news failed, using mock data')
      setError('API connection failed, showing mock data')
      // Mock company news
      setNews([
        {
          id: 'company1',
          title: `${companyName || 'Company'} Quarterly Results Beat Expectations`,
          summary: `${companyName || 'The company'} reports strong quarterly performance with revenue growth exceeding analyst forecasts.`,
          url: 'https://example.com/company/1',
          publishedAt: new Date().toISOString(),
          source: 'Company Press Release',
          companyId,
          sentiment: 'positive'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const searchNews = async () => {
    if (!searchQuery.trim()) return
    
    setLoading(true)
    setError(null)
    try {
      const searchResults = await newsService.searchNews({
        query: searchQuery,
        limit: 10
      })
      setNews(searchResults.articles)
      setActiveTab('search')
    } catch (error) {
      console.log('API news search failed, using mock data')
      setError('API connection failed, showing mock data')
      // Mock search results
      setNews([
        {
          id: 'search1',
          title: `Search Results for "${searchQuery}"`,
          summary: `Mock search result related to ${searchQuery} in Korean business news.`,
          url: 'https://example.com/search/1',
          publishedAt: new Date().toISOString(),
          source: 'News Search',
          sentiment: 'neutral'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800'
      case 'negative': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          News Integration (Demo)
        </CardTitle>
        <CardDescription>
          Real-time news crawler integration with API fallback to mock data
          {error && <span className="text-orange-600 block mt-1">⚠️ {error}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={activeTab === 'latest' ? 'default' : 'outline'} 
            size="sm"
            onClick={loadLatestNews}
            disabled={loading}
          >
            Latest News
          </Button>
          <Button 
            variant={activeTab === 'trending' ? 'default' : 'outline'} 
            size="sm"
            onClick={loadTrendingNews}
            disabled={loading}
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            Trending
          </Button>
          {companyId && (
            <Button 
              variant={activeTab === 'company' ? 'default' : 'outline'} 
              size="sm"
              onClick={loadCompanyNews}
              disabled={loading}
            >
              {companyName || 'Company'} News
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <Input
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchNews()}
          />
          <Button onClick={searchNews} disabled={loading || !searchQuery.trim()}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* News List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading news...</div>
          ) : news.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No news articles found</div>
          ) : (
            news.map((article) => (
              <Card key={article.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm leading-5 flex-1">
                        {article.title}
                      </h3>
                      <Badge className={getSentimentColor(article.sentiment)}>
                        {article.sentiment}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {article.summary}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatTimeAgo(article.publishedAt)}
                        </span>
                        <span>{article.source}</span>
                      </div>
                      
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                      >
                        Read more
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* API Information */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg text-sm">
          <p className="font-medium text-blue-800 mb-1">News Crawler API Integration</p>
          <p className="text-blue-700">
            This component demonstrates integration with a news crawler API. 
            It attempts to fetch real news data from <code className="bg-blue-100 px-1 rounded">
              {process.env.NEXT_PUBLIC_API_BASE_URL}/news/*
            </code> endpoints and falls back to mock data when the API is unavailable.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}