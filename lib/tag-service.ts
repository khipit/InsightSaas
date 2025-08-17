import { apiClient } from './api-client'
import type { 
  Tag, 
  TagResponse, 
  CreateTagRequest, 
  UpdateTagRequest,
  ApiResponse 
} from './api-types'

class TagService {
  // Get all tags
  async getTags(limit?: number, offset?: number): Promise<TagResponse> {
    try {
      const params = new URLSearchParams()
      if (limit) params.append('limit', limit.toString())
      if (offset) params.append('offset', offset.toString())

      const response = await apiClient.get<ApiResponse<TagResponse>>(
        `/tags${params.toString() ? '?' + params.toString() : ''}`
      )
      return response.data!
    } catch (error) {
      console.error('Failed to get tags:', error)
      throw error
    }
  }

  // Get a single tag by ID
  async getTag(id: string): Promise<Tag> {
    try {
      const response = await apiClient.get<ApiResponse<Tag>>(`/tags/${id}`)
      return response.data!
    } catch (error) {
      console.error('Failed to get tag:', error)
      throw error
    }
  }

  // Create a new tag
  async createTag(tagData: CreateTagRequest): Promise<Tag> {
    try {
      const response = await apiClient.post<ApiResponse<Tag>>('/tags', tagData)
      return response.data!
    } catch (error) {
      console.error('Failed to create tag:', error)
      throw error
    }
  }

  // Update an existing tag
  async updateTag(id: string, tagData: UpdateTagRequest): Promise<Tag> {
    try {
      const response = await apiClient.put<ApiResponse<Tag>>(`/tags/${id}`, tagData)
      return response.data!
    } catch (error) {
      console.error('Failed to update tag:', error)
      throw error
    }
  }

  // Delete a tag
  async deleteTag(id: string): Promise<void> {
    try {
      await apiClient.delete<ApiResponse<void>>(`/tags/${id}`)
    } catch (error) {
      console.error('Failed to delete tag:', error)
      throw error
    }
  }

  // Search tags by name
  async searchTags(query: string, limit?: number): Promise<TagResponse> {
    try {
      const params = new URLSearchParams()
      params.append('query', query)
      if (limit) params.append('limit', limit.toString())

      const response = await apiClient.get<ApiResponse<TagResponse>>(
        `/tags/search?${params.toString()}`
      )
      return response.data!
    } catch (error) {
      console.error('Failed to search tags:', error)
      throw error
    }
  }
}

export const tagService = new TagService()