# 뉴스 카테고리 및 태그 관리 시스템 - 프론트엔드 연동 가이드

## 개요

이 가이드는 뉴스 카테고리 및 태그 관리 시스템의 프론트엔드 연동 방법을 설명합니다. React/Next.js 환경에서 TypeScript를 사용하여 카테고리와 태그 기능을 활용하는 방법을 안내합니다.

## 설치 및 설정

### 1. 서비스 모듈 import

```typescript
import { categoryService } from '@/lib/category-service'
import { tagService } from '@/lib/tag-service'
import { newsService } from '@/lib/news-service'
```

### 2. TypeScript 타입 import

```typescript
import type { 
  Category, 
  Tag, 
  NewsArticle,
  CreateCategoryRequest,
  CreateTagRequest,
  NewsSearchRequest 
} from '@/lib/api-types'
```

## 카테고리 관리

### 카테고리 조회

```typescript
const loadCategories = async () => {
  try {
    const response = await categoryService.getCategories()
    setCategories(response.categories)
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}
```

### 카테고리 생성

```typescript
const createCategory = async () => {
  const categoryData: CreateCategoryRequest = {
    name: '경제',
    description: '경제 관련 뉴스',
    color: '#3B82F6'
  }
  
  try {
    const newCategory = await categoryService.createCategory(categoryData)
    // 카테고리 목록 갱신
    setCategories(prev => [...prev, newCategory])
  } catch (error) {
    console.error('Failed to create category:', error)
  }
}
```

### 카테고리 수정

```typescript
const updateCategory = async (id: string) => {
  const updateData = {
    name: '업데이트된 경제',
    description: '수정된 설명'
  }
  
  try {
    const updatedCategory = await categoryService.updateCategory(id, updateData)
    setCategories(prev => prev.map(cat => 
      cat.id === id ? updatedCategory : cat
    ))
  } catch (error) {
    console.error('Failed to update category:', error)
  }
}
```

### 카테고리 삭제

```typescript
const deleteCategory = async (id: string) => {
  try {
    await categoryService.deleteCategory(id)
    setCategories(prev => prev.filter(cat => cat.id !== id))
  } catch (error) {
    console.error('Failed to delete category:', error)
  }
}
```

## 태그 관리

### 태그 조회 및 검색

```typescript
// 전체 태그 조회
const loadTags = async () => {
  try {
    const response = await tagService.getTags()
    setTags(response.tags)
  } catch (error) {
    console.error('Failed to load tags:', error)
  }
}

// 태그 검색
const searchTags = async (query: string) => {
  try {
    const response = await tagService.searchTags(query, 20)
    setTags(response.tags)
  } catch (error) {
    console.error('Failed to search tags:', error)
  }
}
```

### 태그 생성

```typescript
const createTag = async () => {
  const tagData: CreateTagRequest = {
    name: '긴급',
    color: '#EF4444'
  }
  
  try {
    const newTag = await tagService.createTag(tagData)
    setTags(prev => [...prev, newTag])
  } catch (error) {
    console.error('Failed to create tag:', error)
  }
}
```

## 뉴스 기사 관리

### 카테고리 및 태그와 함께 뉴스 검색

```typescript
const searchNewsWithFilters = async () => {
  const searchParams: NewsSearchRequest = {
    query: '삼성',
    categoryId: 'category_123',
    tagIds: ['tag_456', 'tag_789'],
    limit: 20,
    offset: 0
  }
  
  try {
    const response = await newsService.searchNews(searchParams)
    setNews(response.articles)
  } catch (error) {
    console.error('Failed to search news:', error)
  }
}
```

### 뉴스 기사 생성 (카테고리 및 태그 포함)

```typescript
const createNewsArticle = async () => {
  const articleData: CreateNewsArticleRequest = {
    title: '새로운 뉴스 기사',
    summary: '기사 요약',
    url: 'https://example.com/news',
    source: '뉴스 소스',
    sentiment: 'positive',
    categoryId: 'category_123',
    tagIds: ['tag_456', 'tag_789']
  }
  
  try {
    const newArticle = await newsService.createNewsArticle(articleData)
    // 뉴스 목록에 추가
    setNews(prev => [newArticle, ...prev])
  } catch (error) {
    console.error('Failed to create news article:', error)
  }
}
```

### 카테고리별 뉴스 조회

```typescript
const loadNewsByCategory = async (categoryId: string) => {
  try {
    const articles = await newsService.getNewsByCategory(categoryId, 20)
    setNews(articles)
  } catch (error) {
    console.error('Failed to load news by category:', error)
  }
}
```

### 태그별 뉴스 조회

```typescript
const loadNewsByTag = async (tagId: string) => {
  try {
    const articles = await newsService.getNewsByTag(tagId, 20)
    setNews(articles)
  } catch (error) {
    console.error('Failed to load news by tag:', error)
  }
}
```

## UI 컴포넌트 사용법

### CategoryManager 컴포넌트

```tsx
import { CategoryManager } from '@/components/category-manager'

function MyComponent() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  
  return (
    <CategoryManager 
      onCategorySelect={setSelectedCategory}
      selectedCategoryId={selectedCategory?.id}
    />
  )
}
```

### TagManager 컴포넌트

```tsx
import { TagManager } from '@/components/tag-manager'

function MyComponent() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  
  const handleTagSelect = (tag: Tag) => {
    setSelectedTags(prev => 
      prev.includes(tag.id) 
        ? prev.filter(id => id !== tag.id)
        : [...prev, tag.id]
    )
  }
  
  return (
    <TagManager 
      onTagSelect={handleTagSelect}
      selectedTagIds={selectedTags}
      multiSelect={true}
    />
  )
}
```

### NewsEditor 컴포넌트

```tsx
import { NewsEditor } from '@/components/news-editor'

function MyComponent() {
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null)
  
  const handleSave = (article: NewsArticle) => {
    // 저장 후 처리
    console.log('Article saved:', article)
    setEditingArticle(null)
  }
  
  return (
    <NewsEditor
      article={editingArticle}
      onSave={handleSave}
      onCancel={() => setEditingArticle(null)}
    />
  )
}
```

### EnhancedNewsIntegration 컴포넌트

```tsx
import { EnhancedNewsIntegration } from '@/components/enhanced-news-integration'

function MyComponent() {
  const handleArticleSelect = (article: NewsArticle) => {
    // 기사 선택 시 처리
    console.log('Selected article:', article)
  }
  
  return (
    <EnhancedNewsIntegration 
      companyId="company_123"
      companyName="Samsung Electronics"
      onArticleSelect={handleArticleSelect}
    />
  )
}
```

## 에러 처리

### API 호출 에러 처리

```typescript
const handleApiCall = async () => {
  try {
    // API 호출
    const result = await categoryService.getCategories()
    // 성공 처리
  } catch (error) {
    // 에러 로깅
    console.error('API Error:', error)
    
    // 사용자에게 에러 메시지 표시
    setError('데이터를 불러오는데 실패했습니다.')
    
    // 필요시 모의 데이터 사용
    setCategories(mockCategories)
  }
}
```

### 네트워크 에러 대응

```typescript
const [error, setError] = useState<string | null>(null)
const [isOffline, setIsOffline] = useState(false)

useEffect(() => {
  const handleOnline = () => setIsOffline(false)
  const handleOffline = () => setIsOffline(true)
  
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  
  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}, [])

// API 호출 시 오프라인 상태 확인
if (isOffline) {
  setError('인터넷 연결을 확인해주세요.')
  return
}
```

## 성능 최적화

### 데이터 캐싱

```typescript
import { useMemo } from 'react'

function MyComponent() {
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  
  // 카테고리 맵 캐싱
  const categoryMap = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = category
      return acc
    }, {} as Record<string, Category>)
  }, [categories])
  
  // 태그 맵 캐싱
  const tagMap = useMemo(() => {
    return tags.reduce((acc, tag) => {
      acc[tag.id] = tag
      return acc
    }, {} as Record<string, Tag>)
  }, [tags])
}
```

### 디바운싱 검색

```typescript
import { useCallback, useEffect, useState } from 'react'

function SearchComponent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  
  // 디바운싱 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [searchQuery])
  
  // 디바운싱된 쿼리로 검색
  useEffect(() => {
    if (debouncedQuery) {
      searchTags(debouncedQuery)
    }
  }, [debouncedQuery])
}
```

## 테스팅 가이드

### 단위 테스트 예시

```typescript
// category-service.test.ts
import { categoryService } from '@/lib/category-service'

describe('CategoryService', () => {
  test('should create category', async () => {
    const categoryData = {
      name: '테스트 카테고리',
      description: '테스트 설명',
      color: '#FF0000'
    }
    
    const result = await categoryService.createCategory(categoryData)
    
    expect(result.name).toBe(categoryData.name)
    expect(result.color).toBe(categoryData.color)
  })
})
```

### 컴포넌트 테스트 예시

```typescript
// CategoryManager.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { CategoryManager } from '@/components/category-manager'

describe('CategoryManager', () => {
  test('should render categories', () => {
    render(<CategoryManager />)
    
    expect(screen.getByText('카테고리 관리')).toBeInTheDocument()
    expect(screen.getByText('카테고리 추가')).toBeInTheDocument()
  })
})
```

## 배포 고려사항

### 환경 변수 설정

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

### 빌드 최적화

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 번들 분석 활성화
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false
    }
    return config
  }
}

module.exports = nextConfig
```

## 문제 해결

### 일반적인 문제와 해결방법

1. **API 연결 실패**
   - 백엔드 서버 상태 확인
   - CORS 설정 확인
   - 환경 변수 설정 확인

2. **타입 에러**
   - API 응답 타입과 인터페이스 일치성 확인
   - Optional 필드 처리 확인

3. **컴포넌트 렌더링 이슈**
   - Key prop 설정 확인
   - State 업데이트 로직 검토

이 가이드를 참고하여 뉴스 카테고리 및 태그 관리 시스템을 성공적으로 연동하시기 바랍니다.