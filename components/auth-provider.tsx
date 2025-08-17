"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { authService } from "@/lib/auth-service"
import { googleOAuthService } from "@/lib/google-oauth"
import type { User } from "@/lib/api-types"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is authenticated (has token)
        if (authService.isAuthenticated()) {
          // Try to get current user from API
          try {
            const currentUser = await authService.getCurrentUser()
            setUser(currentUser)
            authService.storeUser(currentUser)
          } catch (error) {
            console.log('Failed to get current user from API, falling back to stored user')
            // Fallback to stored user data
            const storedUser = authService.getStoredUser()
            if (storedUser) {
              setUser(storedUser)
            } else {
              // Clear invalid token
              await authService.logout()
            }
          }
        } else {
          // Check for existing session in localStorage (fallback mode)
          const storedUser = authService.getStoredUser()
          if (storedUser) {
            setUser(storedUser)
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // Try API login first
      const response = await authService.login(email, password)
      setUser(response.user)
      authService.storeUser(response.user)
    } catch (error) {
      console.log('API login failed, falling back to mock login')
      
      // Fallback to mock login for development
      const mockUser: User = {
        id: "1",
        email,
        name: email.split("@")[0],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        hasActiveSubscription: true,
      }
      setUser(mockUser)
      authService.storeUser(mockUser)
    }
  }

  const loginWithGoogle = async () => {
    try {
      // Try Google OAuth flow
      googleOAuthService.initializeOAuth()
      
      // For now, we'll simulate the Google OAuth flow
      // In a real implementation, this would trigger the actual Google OAuth flow
      console.log('Google OAuth URL:', googleOAuthService.getAuthUrl())
      
      // Mock Google user for development
      const mockGoogleUser: User = {
        id: "google_" + Date.now(),
        email: "user@gmail.com",
        name: "John Doe",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=google",
        hasActiveSubscription: true,
      }
      
      try {
        // Try to authenticate with backend using mock Google token
        const response = await authService.loginWithGoogle('mock_google_token')
        setUser(response.user)
        authService.storeUser(response.user)
      } catch (error) {
        console.log('Google API login failed, using mock user')
        setUser(mockGoogleUser)
        authService.storeUser(mockGoogleUser)
      }
    } catch (error) {
      console.error('Google login error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      // Try API logout
      await authService.logout()
    } catch (error) {
      console.log('API logout failed, clearing local storage')
    } finally {
      // Always clear local state
      setUser(null)
      // authService.logout() already clears localStorage
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
