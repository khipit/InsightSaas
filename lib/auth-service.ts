import { apiClient } from './api-client'
import type { 
  User, 
  LoginRequest, 
  LoginResponse, 
  GoogleAuthRequest, 
  GoogleAuthResponse 
} from './api-types'

class AuthService {
  // Login with email and password
  async login(email: string, password: string): Promise<LoginResponse> {
    const request: LoginRequest = { email, password }
    
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', request)
      
      // Store the auth token
      apiClient.setAuthToken(response.token)
      
      return response
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  // Google OAuth login
  async loginWithGoogle(googleToken: string): Promise<GoogleAuthResponse> {
    const request: GoogleAuthRequest = { token: googleToken }
    
    try {
      const response = await apiClient.post<GoogleAuthResponse>('/auth/google', request)
      
      // Store the auth token
      apiClient.setAuthToken(response.token)
      
      return response
    } catch (error) {
      console.error('Google login failed:', error)
      throw error
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      // Clear local storage regardless of API response
      if (typeof window !== 'undefined') {
        localStorage.removeItem('khip_auth_token')
        localStorage.removeItem('khip_user')
        localStorage.removeItem('khip_session')
      }
    }
  }

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<User>('/auth/me')
      return response
    } catch (error) {
      console.error('Failed to get current user:', error)
      throw error
    }
  }

  // Refresh token
  async refreshToken(): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/refresh')
      
      // Update the auth token
      apiClient.setAuthToken(response.token)
      
      return response
    } catch (error) {
      console.error('Token refresh failed:', error)
      throw error
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem('khip_auth_token')
  }

  // Get stored user from localStorage (for offline access)
  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null
    
    const savedUser = localStorage.getItem('khip_user')
    if (!savedUser) return null
    
    try {
      return JSON.parse(savedUser)
    } catch (error) {
      console.error('Error parsing stored user:', error)
      localStorage.removeItem('khip_user')
      return null
    }
  }

  // Store user data locally
  storeUser(user: User): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('khip_user', JSON.stringify(user))
  }
}

export const authService = new AuthService()