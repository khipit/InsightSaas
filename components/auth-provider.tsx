"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  hasActiveSubscription?: boolean
}

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
    // Check for existing session
    const savedUser = localStorage.getItem("khip_user")
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("khip_user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Simulate login - in real app, this would call your auth API
    const mockUser = {
      id: "1",
      email,
      name: email.split("@")[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      hasActiveSubscription: true, // Mock active subscription
    }
    setUser(mockUser)
    localStorage.setItem("khip_user", JSON.stringify(mockUser))
  }

  const loginWithGoogle = async () => {
    // Simulate Google OAuth - in real app, this would use Google OAuth
    const mockUser = {
      id: "google_" + Date.now(),
      email: "user@gmail.com",
      name: "John Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=google",
      hasActiveSubscription: true, // Mock active subscription
    }
    setUser(mockUser)
    localStorage.setItem("khip_user", JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("khip_user")
    // Clear any other auth-related data
    localStorage.removeItem("khip_session")
  }

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, loading }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
