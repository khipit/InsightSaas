import { apiClient } from './api-client'
import type { NewsArticle, NewsResponse, NewsSearchRequest } from './api-types'

class NewsService {
  // Get latest news articles
  async getLatestNews(limit: number = 10): Promise<NewsArticle[]> {
    try {
      const response = await apiClient.get<NewsResponse>(`/news/latest?limit=${limit}`)
      return response.articles
    } catch (error) {
      console.error('Failed to get latest news:', error)
      throw error
    }
  }

  // Search news articles
  async searchNews(searchParams: NewsSearchRequest): Promise<NewsResponse> {
    try {
      const params = new URLSearchParams()
      
      if (searchParams.query) params.append('query', searchParams.query)
      if (searchParams.companyId) params.append('companyId', searchParams.companyId)
      if (searchParams.startDate) params.append('startDate', searchParams.startDate)
      if (searchParams.endDate) params.append('endDate', searchParams.endDate)
      if (searchParams.limit) params.append('limit', searchParams.limit.toString())
      if (searchParams.offset) params.append('offset', searchParams.offset.toString())

      const response = await apiClient.get<NewsResponse>(`/news/search?${params.toString()}`)
      return response
    } catch (error) {
      console.error('Failed to search news:', error)
      throw error
    }
  }

  // Get news for a specific company
  async getCompanyNews(companyId: string, limit: number = 20): Promise<NewsArticle[]> {
    try {
      const response = await apiClient.get<NewsResponse>(
        `/news/company/${companyId}?limit=${limit}`
      )
      return response.articles
    } catch (error) {
      console.error('Failed to get company news:', error)
      throw error
    }
  }

  // Get trending news
  async getTrendingNews(limit: number = 10): Promise<NewsArticle[]> {
    try {
      const response = await apiClient.get<NewsResponse>(`/news/trending?limit=${limit}`)
      return response.articles
    } catch (error) {
      console.error('Failed to get trending news:', error)
      throw error
    }
  }

  // Get news by sentiment
  async getNewsBySentiment(
    sentiment: 'positive' | 'negative' | 'neutral',
    companyId?: string,
    limit: number = 10
  ): Promise<NewsArticle[]> {
    try {
      const params = new URLSearchParams()
      params.append('sentiment', sentiment)
      params.append('limit', limit.toString())
      
      if (companyId) {
        params.append('companyId', companyId)
      }

      const response = await apiClient.get<NewsResponse>(`/news/sentiment?${params.toString()}`)
      return response.articles
    } catch (error) {
      console.error('Failed to get news by sentiment:', error)
      throw error
    }
  }

  // Trigger news crawling for a specific company (admin/system function)
  async triggerNewsCrawl(companyId: string): Promise<{ message: string; jobId: string }> {
    try {
      const response = await apiClient.post<{ message: string; jobId: string }>(
        '/news/crawl',
        { companyId }
      )
      return response
    } catch (error) {
      console.error('Failed to trigger news crawl:', error)
      throw error
    }
  }

  // Get crawl job status
  async getCrawlJobStatus(jobId: string): Promise<{ 
    status: 'pending' | 'running' | 'completed' | 'failed'
    progress: number
    message: string
  }> {
    try {
      const response = await apiClient.get<{
        status: 'pending' | 'running' | 'completed' | 'failed'
        progress: number
        message: string
      }>(`/news/crawl/status/${jobId}`)
      return response
    } catch (error) {
      console.error('Failed to get crawl job status:', error)
      throw error
    }
  }
}

export const newsService = new NewsService()