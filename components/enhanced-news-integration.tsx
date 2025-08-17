'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Newspaper, Calendar, ExternalLink, Search, Filter, Tag as TagIcon } from 'lucide-react'
import { newsService } from '@/lib/news-service'
import { categoryService } from '@/lib/category-service'
import { tagService } from '@/lib/tag-service'
import type { NewsArticle, Category, Tag, NewsSearchRequest } from '@/lib/api-types'

interface EnhancedNewsIntegrationProps {
  companyId?: string
  companyName?: string
  onArticleSelect?: (article: NewsArticle) => void
}

export function EnhancedNewsIntegration({ 
  companyId, 
  companyName, 
  onArticleSelect 
}: EnhancedNewsIntegrationProps) {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all')
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<string>('latest')

  // Load initial data
  useEffect(() => {
    loadCategories()
    loadTags()
    loadLatestNews()
  }, [])

  // Search when filters change
  useEffect(() => {
    if (searchQuery || (selectedCategoryId && selectedCategoryId !== 'all') || selectedTagIds.length > 0) {
      handleSearch()
    }
  }, [searchQuery, selectedCategoryId, selectedTagIds])

  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategories()
      setCategories(response.categories)
    } catch (error) {
      console.error('Failed to load categories:', error)
      // Mock data
      setCategories([
        {
          id: 'cat1',
          name: '경제',
          description: '경제 관련 뉴스',
          color: '#3B82F6',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'cat2',
          name: '기술',
          description: '기술 및 IT 뉴스',
          color: '#10B981',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ])
    }
  }

  const loadTags = async () => {
    try {
      const response = await tagService.getTags()
      setTags(response.tags)
    } catch (error) {
      console.error('Failed to load tags:', error)
      // Mock data
      setTags([
        {
          id: 'tag1',
          name: '긴급',
          color: '#EF4444',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'tag2',
          name: '속보',
          color: '#F59E0B',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ])
    }
  }

  const loadLatestNews = async () => {
    setLoading(true)
    setError(null)
    setActiveTab('latest')
    
    try {
      const latestNews = await newsService.getLatestNews(10)
      setNews(latestNews)
    } catch (error) {
      console.log('API latest news failed, using enhanced mock data')
      setError('API 연결 실패, 모의 데이터를 표시합니다')
      // Enhanced mock data with categories and tags
      setNews([
        {
          id: 'enhanced1',
          title: 'Samsung Electronics 3분기 실적 발표',
          summary: '삼성전자가 3분기 매출 67조원을 기록하며 전년 동기 대비 17% 증가했다고 발표했습니다.',
          url: 'https://example.com/samsung-q3',
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          source: '한국경제',
          companyId: 'samsung',
          sentiment: 'positive',
          categoryId: 'cat1',
          category: categories.find(c => c.id === 'cat1'),
          tagIds: ['tag1', 'tag2'],
          tags: tags.filter(t => ['tag1', 'tag2'].includes(t.id))
        },
        {
          id: 'enhanced2',
          title: 'LG전자 AI 스마트홈 기술 공개',
          summary: 'LG전자가 차세대 AI 기반 스마트홈 솔루션을 공개하며 IoT 시장 확대에 나섰습니다.',
          url: 'https://example.com/lg-ai-home',
          publishedAt: new Date(Date.now() - 7200000).toISOString(),
          source: '테크크런치 코리아',
          companyId: 'lg',
          sentiment: 'positive',
          categoryId: 'cat2',
          category: categories.find(c => c.id === 'cat2'),
          tagIds: ['tag1'],
          tags: tags.filter(t => ['tag1'].includes(t.id))
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    setLoading(true)
    setError(null)
    setActiveTab('search')

    const searchParams: NewsSearchRequest = {
      query: searchQuery || undefined,
      companyId: companyId,
      categoryId: selectedCategoryId === 'all' ? undefined : selectedCategoryId || undefined,
      tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
      limit: 20
    }

    try {
      const response = await newsService.searchNews(searchParams)
      setNews(response.articles)
    } catch (error) {
      console.log('API search failed, filtering mock data')
      setError('API 연결 실패, 필터링된 모의 데이터를 표시합니다')
      
      // Filter mock data based on search criteria
      let filteredNews = [
        {
          id: 'enhanced1',
          title: 'Samsung Electronics 3분기 실적 발표',
          summary: '삼성전자가 3분기 매출 67조원을 기록하며 전년 동기 대비 17% 증가했다고 발표했습니다.',
          url: 'https://example.com/samsung-q3',
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          source: '한국경제',
          companyId: 'samsung',
          sentiment: 'positive',
          categoryId: 'cat1',
          category: categories.find(c => c.id === 'cat1'),
          tagIds: ['tag1', 'tag2'],
          tags: tags.filter(t => ['tag1', 'tag2'].includes(t.id))
        },
        {
          id: 'enhanced2',
          title: 'LG전자 AI 스마트홈 기술 공개',
          summary: 'LG전자가 차세대 AI 기반 스마트홈 솔루션을 공개하며 IoT 시장 확대에 나섰습니다.',
          url: 'https://example.com/lg-ai-home',
          publishedAt: new Date(Date.now() - 7200000).toISOString(),
          source: '테크크런치 코리아',
          companyId: 'lg',
          sentiment: 'positive',
          categoryId: 'cat2',
          category: categories.find(c => c.id === 'cat2'),
          tagIds: ['tag1'],
          tags: tags.filter(t => ['tag1'].includes(t.id))
        }
      ]

      // Apply filters
      if (searchQuery) {
        filteredNews = filteredNews.filter(article => 
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.summary.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      
      if (selectedCategoryId && selectedCategoryId !== 'all') {
        filteredNews = filteredNews.filter(article => article.categoryId === selectedCategoryId)
      }
      
      if (selectedTagIds.length > 0) {
        filteredNews = filteredNews.filter(article => 
          article.tagIds?.some(tagId => selectedTagIds.includes(tagId))
        )
      }

      setNews(filteredNews)
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategoryId('all')
    setSelectedTagIds([])
    loadLatestNews()
  }

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)
    
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`
    return `${Math.floor(diffInMinutes / 1440)}일 전`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          향상된 뉴스 통합 (카테고리 & 태그)
        </CardTitle>
        <CardDescription>
          카테고리와 태그로 필터링하여 맞춤형 뉴스를 검색하세요
          {error && <span className="text-orange-600 block mt-1">⚠️ {error}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and filters */}
        <div className="space-y-3">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="뉴스 검색..."
              className="pl-10"
            />
          </div>

          {/* Category and Tag filters */}
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">카테고리</label>
              <Select value={selectedCategoryId || undefined} onValueChange={setSelectedCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="모든 카테고리" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 카테고리</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">태그</label>
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    style={{ 
                      backgroundColor: selectedTagIds.includes(tag.id) ? tag.color : '#E5E7EB',
                      color: selectedTagIds.includes(tag.id) ? 'white' : '#6B7280'
                    }}
                    className="cursor-pointer text-xs transition-all hover:scale-105"
                    onClick={() => handleTagToggle(tag.id)}
                  >
                    {tag.name}
                    {selectedTagIds.includes(tag.id) && <span className="ml-1">✓</span>}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button onClick={loadLatestNews} variant="outline" size="sm">
              최신 뉴스
            </Button>
            <Button onClick={clearFilters} variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              필터 초기화
            </Button>
          </div>
        </div>

        {/* Active filters display */}
        {(selectedCategoryId && selectedCategoryId !== 'all' || selectedTagIds.length > 0 || searchQuery) && (
          <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium">활성 필터:</span>
            {searchQuery && (
              <Badge variant="outline">검색: {searchQuery}</Badge>
            )}
            {selectedCategoryId && selectedCategoryId !== 'all' && (
              <Badge style={{ backgroundColor: categories.find(c => c.id === selectedCategoryId)?.color }}>
                {categories.find(c => c.id === selectedCategoryId)?.name}
              </Badge>
            )}
            {selectedTagIds.map(tagId => {
              const tag = tags.find(t => t.id === tagId)
              return tag ? (
                <Badge key={tagId} style={{ backgroundColor: tag.color }} className="text-white">
                  {tag.name}
                </Badge>
              ) : null
            })}
          </div>
        )}

        {/* News articles */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-4">뉴스를 불러오는 중...</div>
          ) : news.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              {activeTab === 'search' ? '검색 결과가 없습니다.' : '뉴스 기사가 없습니다.'}
            </div>
          ) : (
            news.map((article) => (
              <Card 
                key={article.id} 
                className={`hover:shadow-md transition-shadow cursor-pointer ${
                  onArticleSelect ? 'hover:bg-gray-50' : ''
                }`}
                onClick={() => onArticleSelect?.(article)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-medium line-clamp-2">{article.title}</h3>
                      <Badge 
                        variant={article.sentiment === 'positive' ? 'default' : 
                                article.sentiment === 'negative' ? 'destructive' : 'secondary'}
                        className="text-xs shrink-0"
                      >
                        {article.sentiment === 'positive' ? '긍정' : 
                         article.sentiment === 'negative' ? '부정' : '중립'}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2">{article.summary}</p>
                    
                    {/* Category and Tags */}
                    <div className="flex flex-wrap gap-1">
                      {article.category && (
                        <Badge 
                          style={{ backgroundColor: article.category.color }}
                          className="text-white text-xs"
                        >
                          {article.category.name}
                        </Badge>
                      )}
                      {article.tags?.map((tag) => (
                        <Badge
                          key={tag.id}
                          style={{ backgroundColor: tag.color }}
                          className="text-white text-xs"
                        >
                          <TagIcon className="h-2 w-2 mr-1" />
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <div className="flex items-center gap-3">
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
                        onClick={(e) => e.stopPropagation()}
                      >
                        자세히 보기
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
          <p className="font-medium text-blue-800 mb-1">향상된 뉴스 API 통합</p>
          <p className="text-blue-700">
            이 컴포넌트는 카테고리와 태그 기반 필터링이 가능한 뉴스 크롤러 API와 통합됩니다.
            현재는 API 연결 실패 시 모의 데이터를 표시합니다.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}