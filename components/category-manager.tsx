'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'
import { categoryService } from '@/lib/category-service'
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/lib/api-types'

interface CategoryManagerProps {
  onCategorySelect?: (category: Category) => void
  selectedCategoryId?: string
}

export function CategoryManager({ onCategorySelect, selectedCategoryId }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    name: '',
    description: '',
    color: '#3B82F6'
  })

  // Load categories on mount
  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await categoryService.getCategories()
      setCategories(response.categories)
    } catch (error) {
      console.error('Failed to load categories:', error)
      setError('카테고리를 불러오는데 실패했습니다.')
      // Mock data for demonstration
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
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!formData.name.trim()) return

    try {
      const newCategory = await categoryService.createCategory(formData)
      setCategories(prev => [...prev, newCategory])
      setFormData({ name: '', description: '', color: '#3B82F6' })
      setIsCreating(false)
    } catch (error) {
      console.error('Failed to create category:', error)
      setError('카테고리 생성에 실패했습니다.')
    }
  }

  const handleUpdate = async (id: string) => {
    if (!formData.name.trim()) return

    try {
      const updatedCategory = await categoryService.updateCategory(id, formData)
      setCategories(prev => prev.map(cat => cat.id === id ? updatedCategory : cat))
      setEditingId(null)
      setFormData({ name: '', description: '', color: '#3B82F6' })
    } catch (error) {
      console.error('Failed to update category:', error)
      setError('카테고리 수정에 실패했습니다.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 카테고리를 삭제하시겠습니까?')) return

    try {
      await categoryService.deleteCategory(id)
      setCategories(prev => prev.filter(cat => cat.id !== id))
    } catch (error) {
      console.error('Failed to delete category:', error)
      setError('카테고리 삭제에 실패했습니다.')
    }
  }

  const startEdit = (category: Category) => {
    setEditingId(category.id)
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color || '#3B82F6'
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setIsCreating(false)
    setFormData({ name: '', description: '', color: '#3B82F6' })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>카테고리 관리</CardTitle>
            <CardDescription>뉴스 카테고리를 추가, 수정, 삭제할 수 있습니다.</CardDescription>
          </div>
          <Button onClick={() => setIsCreating(true)} size="sm" disabled={isCreating}>
            <Plus className="h-4 w-4 mr-2" />
            카테고리 추가
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Create form */}
        {isCreating && (
          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            <h4 className="font-medium">새 카테고리 생성</h4>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">카테고리 이름</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="예: 경제, 기술, 정치..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">색상</label>
                <Input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">설명 (선택사항)</label>
              <Textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="카테고리에 대한 설명을 입력하세요"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} size="sm">
                <Save className="h-4 w-4 mr-2" />
                생성
              </Button>
              <Button onClick={cancelEdit} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                취소
              </Button>
            </div>
          </div>
        )}

        {/* Categories list */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-4">카테고리를 불러오는 중...</div>
          ) : categories.length === 0 ? (
            <div className="text-center py-4 text-gray-500">등록된 카테고리가 없습니다.</div>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                {editingId === category.id ? (
                  // Edit form
                  <div className="space-y-3">
                    <h4 className="font-medium">카테고리 수정</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">카테고리 이름</label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">색상</label>
                        <Input
                          type="color"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">설명</label>
                      <Textarea
                        rows={2}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleUpdate(category.id)} size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        저장
                      </Button>
                      <Button onClick={cancelEdit} variant="outline" size="sm">
                        <X className="h-4 w-4 mr-2" />
                        취소
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Display form
                  <div className="flex justify-between items-start">
                    <div 
                      className={`flex-1 cursor-pointer ${onCategorySelect ? 'hover:bg-gray-50 p-2 rounded' : ''}`}
                      onClick={() => onCategorySelect?.(category)}
                    >
                      <div className="flex items-center gap-3">
                        <Badge 
                          style={{ backgroundColor: category.color }}
                          className="text-white"
                        >
                          {category.name}
                        </Badge>
                        {selectedCategoryId === category.id && (
                          <Badge variant="outline">선택됨</Badge>
                        )}
                      </div>
                      {category.description && (
                        <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        생성: {new Date(category.createdAt).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        onClick={() => startEdit(category)}
                        variant="ghost"
                        size="sm"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(category.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}