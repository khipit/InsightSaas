'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Save, X, Search } from 'lucide-react'
import { tagService } from '@/lib/tag-service'
import type { Tag, CreateTagRequest, UpdateTagRequest } from '@/lib/api-types'

interface TagManagerProps {
  onTagSelect?: (tag: Tag) => void
  selectedTagIds?: string[]
  multiSelect?: boolean
}

export function TagManager({ onTagSelect, selectedTagIds = [], multiSelect = false }: TagManagerProps) {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState<CreateTagRequest>({
    name: '',
    color: '#6B7280'
  })

  // Load tags on mount
  useEffect(() => {
    loadTags()
  }, [])

  // Search tags when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      searchTags()
    } else {
      loadTags()
    }
  }, [searchQuery])

  const loadTags = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await tagService.getTags()
      setTags(response.tags)
    } catch (error) {
      console.error('Failed to load tags:', error)
      setError('태그를 불러오는데 실패했습니다.')
      // Mock data for demonstration
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
        },
        {
          id: 'tag3',
          name: '분석',
          color: '#8B5CF6',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const searchTags = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await tagService.searchTags(searchQuery)
      setTags(response.tags)
    } catch (error) {
      console.error('Failed to search tags:', error)
      setError('태그 검색에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!formData.name.trim()) return

    try {
      const newTag = await tagService.createTag(formData)
      setTags(prev => [...prev, newTag])
      setFormData({ name: '', color: '#6B7280' })
      setIsCreating(false)
    } catch (error) {
      console.error('Failed to create tag:', error)
      setError('태그 생성에 실패했습니다.')
    }
  }

  const handleUpdate = async (id: string) => {
    if (!formData.name.trim()) return

    try {
      const updatedTag = await tagService.updateTag(id, formData)
      setTags(prev => prev.map(tag => tag.id === id ? updatedTag : tag))
      setEditingId(null)
      setFormData({ name: '', color: '#6B7280' })
    } catch (error) {
      console.error('Failed to update tag:', error)
      setError('태그 수정에 실패했습니다.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 태그를 삭제하시겠습니까?')) return

    try {
      await tagService.deleteTag(id)
      setTags(prev => prev.filter(tag => tag.id !== id))
    } catch (error) {
      console.error('Failed to delete tag:', error)
      setError('태그 삭제에 실패했습니다.')
    }
  }

  const startEdit = (tag: Tag) => {
    setEditingId(tag.id)
    setFormData({
      name: tag.name,
      color: tag.color || '#6B7280'
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setIsCreating(false)
    setFormData({ name: '', color: '#6B7280' })
  }

  const handleTagClick = (tag: Tag) => {
    if (onTagSelect) {
      onTagSelect(tag)
    }
  }

  const isSelected = (tagId: string) => selectedTagIds.includes(tagId)

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>태그 관리</CardTitle>
            <CardDescription>뉴스 태그를 추가, 수정, 삭제할 수 있습니다.</CardDescription>
          </div>
          <Button onClick={() => setIsCreating(true)} size="sm" disabled={isCreating}>
            <Plus className="h-4 w-4 mr-2" />
            태그 추가
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="태그 검색..."
            className="pl-10"
          />
        </div>

        {/* Create form */}
        {isCreating && (
          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            <h4 className="font-medium">새 태그 생성</h4>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">태그 이름</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="예: 긴급, 속보, 분석..."
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

        {/* Tags grid */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-4">태그를 불러오는 중...</div>
          ) : tags.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              {searchQuery ? '검색 결과가 없습니다.' : '등록된 태그가 없습니다.'}
            </div>
          ) : (
            <>
              {/* Tags display */}
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div key={tag.id} className="relative group">
                    {editingId === tag.id ? (
                      // Edit form inline
                      <div className="border border-gray-200 rounded-lg p-3 space-y-2 bg-white">
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="태그 이름"
                            size={30}
                          />
                          <Input
                            type="color"
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          />
                        </div>
                        <div className="flex gap-1">
                          <Button onClick={() => handleUpdate(tag.id)} size="sm" className="h-6 px-2 text-xs">
                            저장
                          </Button>
                          <Button onClick={cancelEdit} variant="outline" size="sm" className="h-6 px-2 text-xs">
                            취소
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Display badge
                      <div className="flex items-center gap-1">
                        <Badge
                          style={{ backgroundColor: tag.color }}
                          className={`text-white cursor-pointer transition-all hover:scale-105 ${
                            isSelected(tag.id) ? 'ring-2 ring-blue-500 ring-offset-1' : ''
                          }`}
                          onClick={() => handleTagClick(tag)}
                        >
                          {tag.name}
                          {isSelected(tag.id) && multiSelect && (
                            <span className="ml-1">✓</span>
                          )}
                        </Badge>
                        {/* Edit/Delete buttons - show on hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Button
                            onClick={() => startEdit(tag)}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(tag.id)}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Tags list view for detailed management */}
              <div className="mt-6">
                <h4 className="font-medium text-sm text-gray-700 mb-2">상세 관리</h4>
                <div className="space-y-2">
                  {tags.map((tag) => (
                    <div key={`detail-${tag.id}`} className="flex justify-between items-center p-2 border border-gray-100 rounded text-sm">
                      <div className="flex items-center gap-2">
                        <Badge style={{ backgroundColor: tag.color }} className="text-white text-xs">
                          {tag.name}
                        </Badge>
                        <span className="text-gray-500">
                          생성: {new Date(tag.createdAt).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          onClick={() => startEdit(tag)}
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(tag.id)}
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}