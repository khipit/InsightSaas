'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CategoryManager } from '@/components/category-manager'
import { TagManager } from '@/components/tag-manager'
import { NewsEditor } from '@/components/news-editor'
import { EnhancedNewsIntegration } from '@/components/enhanced-news-integration'
import { Button } from '@/components/ui/button'
import { Plus, Settings, FileText, Tags, FolderOpen } from 'lucide-react'
import type { NewsArticle, Category, Tag } from '@/lib/api-types'

export default function NewsManagementPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null)
  const [showNewsEditor, setShowNewsEditor] = useState(false)

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category)
  }

  const handleTagSelect = (tag: Tag) => {
    setSelectedTags(prev => {
      const exists = prev.find(t => t.id === tag.id)
      if (exists) {
        return prev.filter(t => t.id !== tag.id)
      } else {
        return [...prev, tag]
      }
    })
  }

  const handleArticleSelect = (article: NewsArticle) => {
    setEditingArticle(article)
    setShowNewsEditor(true)
  }

  const handleArticleSave = (article: NewsArticle) => {
    setShowNewsEditor(false)
    setEditingArticle(null)
    // Refresh news list if needed
  }

  const handleCreateNew = () => {
    setEditingArticle(null)
    setShowNewsEditor(true)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">뉴스 관리 시스템</h1>
        <p className="text-gray-600">
          뉴스 카테고리, 태그 및 기사를 통합 관리할 수 있는 관리자 페이지입니다.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            개요
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            카테고리
          </TabsTrigger>
          <TabsTrigger value="tags" className="flex items-center gap-2">
            <Tags className="h-4 w-4" />
            태그
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            뉴스 관리
          </TabsTrigger>
          <TabsTrigger value="integration" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            통합 검색
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  카테고리 관리
                </CardTitle>
                <CardDescription>
                  뉴스 카테고리를 추가, 수정, 삭제할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  • 카테고리 생성 및 편집<br/>
                  • 색상 지정<br/>
                  • 설명 추가
                </p>
                <Button 
                  onClick={() => document.querySelector('[value="categories"]')?.click()}
                  className="w-full"
                >
                  카테고리 관리하기
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tags className="h-5 w-5" />
                  태그 관리
                </CardTitle>
                <CardDescription>
                  뉴스 태그를 추가, 수정, 삭제할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  • 태그 생성 및 편집<br/>
                  • 색상 지정<br/>
                  • 태그 검색
                </p>
                <Button 
                  onClick={() => document.querySelector('[value="tags"]')?.click()}
                  className="w-full"
                >
                  태그 관리하기
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  뉴스 기사 관리
                </CardTitle>
                <CardDescription>
                  뉴스 기사를 작성, 수정하고 카테고리/태그를 지정할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  • 기사 작성 및 편집<br/>
                  • 카테고리 지정<br/>
                  • 태그 다중 선택
                </p>
                <Button 
                  onClick={() => document.querySelector('[value="news"]')?.click()}
                  className="w-full"
                >
                  뉴스 관리하기
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Current selections */}
          {(selectedCategory || selectedTags.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>현재 선택</CardTitle>
                <CardDescription>
                  카테고리와 태그 탭에서 선택한 항목들이 표시됩니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedCategory && (
                    <div>
                      <label className="block text-sm font-medium mb-1">선택된 카테고리</label>
                      <div 
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm"
                        style={{ backgroundColor: selectedCategory.color }}
                      >
                        {selectedCategory.name}
                      </div>
                    </div>
                  )}
                  
                  {selectedTags.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium mb-1">선택된 태그</label>
                      <div className="flex flex-wrap gap-2">
                        {selectedTags.map((tag) => (
                          <div
                            key={tag.id}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs"
                            style={{ backgroundColor: tag.color }}
                          >
                            {tag.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManager 
            onCategorySelect={handleCategorySelect}
            selectedCategoryId={selectedCategory?.id}
          />
        </TabsContent>

        <TabsContent value="tags">
          <TagManager 
            onTagSelect={handleTagSelect}
            selectedTagIds={selectedTags.map(t => t.id)}
            multiSelect={true}
          />
        </TabsContent>

        <TabsContent value="news" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">뉴스 기사 관리</h2>
              <p className="text-gray-600">뉴스 기사를 작성하고 관리하세요.</p>
            </div>
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              새 기사 작성
            </Button>
          </div>

          {showNewsEditor ? (
            <NewsEditor
              article={editingArticle || undefined}
              onSave={handleArticleSave}
              onCancel={() => {
                setShowNewsEditor(false)
                setEditingArticle(null)
              }}
            />
          ) : (
            <EnhancedNewsIntegration onArticleSelect={handleArticleSelect} />
          )}
        </TabsContent>

        <TabsContent value="integration">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">통합 뉴스 검색</h2>
              <p className="text-gray-600">
                카테고리와 태그를 활용한 고급 뉴스 검색 및 필터링 기능을 체험하세요.
              </p>
            </div>
            <EnhancedNewsIntegration onArticleSelect={handleArticleSelect} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}