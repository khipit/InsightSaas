import { apiClient } from './api-client'
import type { 
  Category, 
  CategoryResponse, 
  CreateCategoryRequest, 
  UpdateCategoryRequest,
  ApiResponse 
} from './api-types'

class CategoryService {
  // Get all categories
  async getCategories(limit?: number, offset?: number): Promise<CategoryResponse> {
    try {
      const params = new URLSearchParams()
      if (limit) params.append('limit', limit.toString())
      if (offset) params.append('offset', offset.toString())

      const response = await apiClient.get<ApiResponse<CategoryResponse>>(
        `/categories${params.toString() ? '?' + params.toString() : ''}`
      )
      return response.data!
    } catch (error) {
      console.error('Failed to get categories:', error)
      throw error
    }
  }

  // Get a single category by ID
  async getCategory(id: string): Promise<Category> {
    try {
      const response = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`)
      return response.data!
    } catch (error) {
      console.error('Failed to get category:', error)
      throw error
    }
  }

  // Create a new category
  async createCategory(categoryData: CreateCategoryRequest): Promise<Category> {
    try {
      const response = await apiClient.post<ApiResponse<Category>>('/categories', categoryData)
      return response.data!
    } catch (error) {
      console.error('Failed to create category:', error)
      throw error
    }
  }

  // Update an existing category
  async updateCategory(id: string, categoryData: UpdateCategoryRequest): Promise<Category> {
    try {
      const response = await apiClient.put<ApiResponse<Category>>(`/categories/${id}`, categoryData)
      return response.data!
    } catch (error) {
      console.error('Failed to update category:', error)
      throw error
    }
  }

  // Delete a category
  async deleteCategory(id: string): Promise<void> {
    try {
      await apiClient.delete<ApiResponse<void>>(`/categories/${id}`)
    } catch (error) {
      console.error('Failed to delete category:', error)
      throw error
    }
  }
}

export const categoryService = new CategoryService()