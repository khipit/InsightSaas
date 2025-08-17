import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'

class ApiClient {
  private client: AxiosInstance
  private baseURL: string

  constructor() {
    // Use backend API URL with /api prefix
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api'
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor to handle Django REST API responses and errors
    this.client.interceptors.response.use(
      (response) => {
        // Handle Django REST API response format
        if (response.data && response.data.success !== undefined) {
          if (response.data.success) {
            // Return the data portion of successful responses
            return { ...response, data: response.data.data || response.data }
          } else {
            // Handle API-level errors
            const error = new Error(response.data.error?.message || 'API request failed')
            ;(error as any).code = response.data.error?.code
            ;(error as any).details = response.data.error?.details
            throw error
          }
        }
        return response
      },
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access - clear token and redirect to login
          this.clearAuthToken()
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      }
    )
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('khip_auth_token')
  }

  private clearAuthToken(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('khip_auth_token')
    localStorage.removeItem('khip_user')
  }

  public setAuthToken(token: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('khip_auth_token', token)
  }

  // Generic request methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }
}

// Export singleton instance
export const apiClient = new ApiClient()