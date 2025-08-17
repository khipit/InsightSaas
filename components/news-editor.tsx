'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Save, X, Plus } from 'lucide-react'
import { newsService } from '@/lib/news-service'
import { categoryService } from '@/lib/category-service'
import { tagService } from '@/lib/tag-service'
import type { 
  NewsArticle, 
  CreateNewsArticleRequest, 
  UpdateNewsArticleRequest, 
  Category, 
  Tag 
} from '@/lib/api-types'

interface NewsEditorProps {
  article?: NewsArticle
  onSave?: (article: NewsArticle) => void
  onCancel?: () => void
}

export function NewsEditor({ article, onSave, onCancel }: NewsEditorProps) {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<CreateNewsArticleRequest>({
    title: '',
    summary: '',
    url: '',
    source: '',
    sentiment: 'neutral',
    companyId: '',
    categoryId: '',
    tagIds: []
  })

  // Load data on mount
  useEffect(() => {
    loadCategories()
    loadTags()
    if (article) {
      setFormData({
        title: article.title,
        summary: article.summary,
        url: article.url,
        source: article.source,
        sentiment: article.sentiment,
        companyId: article.companyId || '',
        categoryId: article.categoryId || '',
        tagIds: article.tagIds || []
      })
    }
  }, [article])

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

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.summary.trim() || !formData.url.trim()) {
      setError('제목, 요약, URL은 필수 입력 항목입니다.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      let savedArticle: NewsArticle
      
      if (article) {
        // Update existing article
        savedArticle = await newsService.updateNewsArticle(article.id, formData)
      } else {
        // Create new article
        savedArticle = await newsService.createNewsArticle(formData)
      }

      onSave?.(savedArticle)
    } catch (error) {
      console.error('Failed to save article:', error)
      setError('기사 저장에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleTagToggle = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds?.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...(prev.tagIds || []), tagId]
    }))
  }

  const getSelectedTags = () => {
    return tags.filter(tag => formData.tagIds?.includes(tag.id))
  }

  const getSelectedCategory = () => {
    return categories.find(cat => cat.id === formData.categoryId)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{article ? '기사 수정' : '새 기사 작성'}</CardTitle>
        <CardDescription>
          카테고리와 태그를 지정하여 뉴스 기사를 관리하세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">제목 *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="기사 제목을 입력하세요"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">출처 *</label>
            <Input
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              placeholder="예: 한국경제, 조선일보"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL *</label>
          <Input
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="https://..."
            type="url"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">요약 *</label>
          <Textarea
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            placeholder="기사 요약을 입력하세요"
            rows={3}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">회사 ID</label>
            <Input
              value={formData.companyId}
              onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
              placeholder="선택사항"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">감정</label>
            <Select 
              value={formData.sentiment} 
              onValueChange={(value) => setFormData({ ...formData, sentiment: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="positive">긍정적</SelectItem>
                <SelectItem value="neutral">중립</SelectItem>
                <SelectItem value="negative">부정적</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">카테고리</label>
            <Select 
              value={formData.categoryId || undefined} 
              onValueChange={(value) => setFormData({ ...formData, categoryId: value === 'none' ? '' : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">카테고리 없음</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Selected category display */}
        {getSelectedCategory() && (
          <div>
            <label className="block text-sm font-medium mb-1">선택된 카테고리</label>
            <Badge 
              style={{ backgroundColor: getSelectedCategory()?.color }}
              className="text-white"
            >
              {getSelectedCategory()?.name}
            </Badge>
          </div>
        )}

        {/* Tag selection */}
        <div>
          <label className="block text-sm font-medium mb-2">태그 (복수 선택 가능)</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                style={{ 
                  backgroundColor: formData.tagIds?.includes(tag.id) ? tag.color : '#E5E7EB',
                  color: formData.tagIds?.includes(tag.id) ? 'white' : '#6B7280'
                }}
                className="cursor-pointer transition-all hover:scale-105"
                onClick={() => handleTagToggle(tag.id)}
              >
                {tag.name}
                {formData.tagIds?.includes(tag.id) && <span className="ml-1">✓</span>}
              </Badge>
            ))}
          </div>
          
          {/* Selected tags display */}
          {getSelectedTags().length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-1">선택된 태그</label>
              <div className="flex flex-wrap gap-1">
                {getSelectedTags().map((tag) => (
                  <Badge
                    key={tag.id}
                    style={{ backgroundColor: tag.color }}
                    className="text-white text-xs"
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-4">
          <Button onClick={handleSubmit} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? '저장 중...' : article ? '수정' : '생성'}
          </Button>
          <Button onClick={onCancel} variant="outline">
            <X className="h-4 w-4 mr-2" />
            취소
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}