# Frontend Integration Guide for Enhanced Authentication

This guide explains how to integrate with the enhanced authentication system in the InsightSaaS frontend application.

## Overview

The authentication system now supports:
- Email/password registration and login
- Role-based access control (admin vs user)
- Password reset functionality
- JWT-based session management
- Google OAuth integration

## Authentication Flow

### 1. User Registration

```typescript
import { useAuth } from '@/components/auth-provider'

function SignupForm() {
  const { signup } = useAuth()
  
  const handleSignup = async (email: string, password: string, name: string) => {
    try {
      await signup(email, password, name)
      // User is automatically logged in after successful registration
      router.push('/my-reports')
    } catch (error) {
      // Handle signup error
      console.error('Signup failed:', error)
    }
  }
}
```

### 2. User Login

```typescript
import { useAuth } from '@/components/auth-provider'

function LoginForm() {
  const { login } = useAuth()
  
  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password)
      router.push('/my-reports')
    } catch (error) {
      // Handle login error
      console.error('Login failed:', error)
    }
  }
}
```

### 3. Password Reset

```typescript
import { authService } from '@/lib/auth-service'

function ForgotPasswordForm() {
  const handlePasswordReset = async (email: string) => {
    try {
      await authService.requestPasswordReset(email)
      // Show success message
      setSuccess(true)
    } catch (error) {
      // Handle error
      console.error('Password reset failed:', error)
    }
  }
}

function ResetPasswordForm() {
  const handlePasswordReset = async (token: string, newPassword: string) => {
    try {
      await authService.confirmPasswordReset(token, newPassword)
      // Redirect to login
      router.push('/login')
    } catch (error) {
      // Handle error
      console.error('Password reset confirmation failed:', error)
    }
  }
}
```

## Role-Based Access Control

### Using the Authentication Context

```typescript
import { useAuth } from '@/components/auth-provider'

function ProtectedComponent() {
  const { user, isAdmin } = useAuth()
  
  if (!user) {
    return <div>Please log in</div>
  }
  
  if (isAdmin) {
    return <AdminDashboard />
  }
  
  return <UserDashboard />
}
```

### Using Auth Service Helpers

```typescript
import { authService } from '@/lib/auth-service'
import { useAuth } from '@/components/auth-provider'

function ComponentWithPermissions() {
  const { user } = useAuth()
  
  const canViewAdminDashboard = authService.hasPermission(user, 'view_admin_dashboard')
  const canManagePurchases = authService.hasPermission(user, 'manage_purchases')
  
  return (
    <div>
      {canViewAdminDashboard && <AdminPanel />}
      {canManagePurchases && <PurchaseManager />}
    </div>
  )
}
```

### Route Protection

Create a higher-order component for route protection:

```typescript
// components/ProtectedRoute.tsx
import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
  permission?: string
}

export function ProtectedRoute({ children, requireAdmin, permission }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
        return
      }
      
      if (requireAdmin && !isAdmin) {
        router.push('/')
        return
      }
      
      if (permission && !authService.hasPermission(user, permission)) {
        router.push('/')
        return
      }
    }
  }, [user, loading, isAdmin, router, requireAdmin, permission])
  
  if (loading) {
    return <div>Loading...</div>
  }
  
  if (!user) {
    return null
  }
  
  if (requireAdmin && !isAdmin) {
    return <div>Access denied</div>
  }
  
  if (permission && !authService.hasPermission(user, permission)) {
    return <div>Access denied</div>
  }
  
  return <>{children}</>
}
```

Usage in pages:

```typescript
// app/admin/page.tsx
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminDashboard />
    </ProtectedRoute>
  )
}
```

## User Interface Components

### User Profile Display

```typescript
import { useAuth } from '@/components/auth-provider'

function UserProfile() {
  const { user } = useAuth()
  
  if (!user) return null
  
  return (
    <div className="user-profile">
      <img src={user.avatar} alt={user.name} />
      <div>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        <span className={`role-badge ${user.role}`}>
          {user.role === 'admin' ? 'Administrator' : 'User'}
        </span>
      </div>
    </div>
  )
}
```

### Navigation with Role-based Visibility

```typescript
import { useAuth } from '@/components/auth-provider'

function Navigation() {
  const { user, isAdmin } = useAuth()
  
  return (
    <nav>
      <Link href="/">Home</Link>
      
      {user && (
        <>
          <Link href="/my-reports">My Reports</Link>
          <Link href="/profile">Profile</Link>
          
          {isAdmin && (
            <Link href="/admin">Admin Dashboard</Link>
          )}
        </>
      )}
      
      {!user ? (
        <>
          <Link href="/login">Login</Link>
          <Link href="/signup">Sign Up</Link>
        </>
      ) : (
        <LogoutButton />
      )}
    </nav>
  )
}
```

## Error Handling

### Authentication Errors

```typescript
import { useAuth } from '@/components/auth-provider'
import { useState } from 'react'

function LoginForm() {
  const { login } = useAuth()
  const [error, setError] = useState('')
  
  const handleSubmit = async (email: string, password: string) => {
    setError('')
    
    try {
      await login(email, password)
    } catch (err: any) {
      // Handle different error types
      if (err.response?.status === 401) {
        setError('Invalid email or password')
      } else if (err.response?.status === 429) {
        setError('Too many login attempts. Please try again later.')
      } else {
        setError('Login failed. Please try again.')
      }
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {/* form fields */}
    </form>
  )
}
```

## API Integration

### Custom Hooks for Auth Operations

```typescript
// hooks/usePasswordReset.ts
import { useState } from 'react'
import { authService } from '@/lib/auth-service'

export function usePasswordReset() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  
  const requestReset = async (email: string) => {
    setLoading(true)
    setError('')
    
    try {
      await authService.requestPasswordReset(email)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }
  
  const confirmReset = async (token: string, newPassword: string) => {
    setLoading(true)
    setError('')
    
    try {
      await authService.confirmPasswordReset(token, newPassword)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }
  
  return {
    loading,
    success,
    error,
    requestReset,
    confirmReset
  }
}
```

## Testing

### Authentication Service Tests

```typescript
// lib/__tests__/auth-service.test.ts
import { authService } from '../auth-service'

describe('AuthService', () => {
  describe('isAdmin', () => {
    it('should return true for admin users', () => {
      const adminUser = { role: 'admin' } as User
      expect(authService.isAdmin(adminUser)).toBe(true)
    })
    
    it('should return false for regular users', () => {
      const regularUser = { role: 'user' } as User
      expect(authService.isAdmin(regularUser)).toBe(false)
    })
  })
  
  describe('hasPermission', () => {
    it('should grant all permissions to admin users', () => {
      const adminUser = { role: 'admin' } as User
      expect(authService.hasPermission(adminUser, 'any_permission')).toBe(true)
    })
    
    it('should deny admin permissions to regular users', () => {
      const regularUser = { role: 'user' } as User
      expect(authService.hasPermission(regularUser, 'view_admin_dashboard')).toBe(false)
    })
  })
})
```

## Best Practices

1. **Always check authentication state** before rendering protected content
2. **Use the `isAdmin` flag** from the auth context for role-based UI
3. **Handle loading states** to prevent flickering during auth checks
4. **Implement proper error handling** for all auth operations
5. **Use TypeScript** for better type safety with user objects
6. **Test authentication flows** thoroughly, including edge cases
7. **Clear sensitive data** from memory when logging out
8. **Implement proper session timeout** handling
9. **Use environment variables** for API endpoints and configuration
10. **Follow security best practices** for password handling

## Troubleshooting

### Common Issues

1. **"User not authenticated" errors**: Check if JWT token is properly stored and sent with requests
2. **Role-based access not working**: Verify that user object contains the correct `role` field
3. **Password reset emails not being sent**: Check SMTP configuration and email service setup
4. **Infinite redirects**: Ensure auth checks don't create redirect loops
5. **Type errors**: Make sure User interface includes new fields (`role`, `emailVerified`, etc.)

### Debug Tips

1. Use browser developer tools to inspect localStorage for stored auth data
2. Check network tab for API request/response details
3. Use console.log in auth provider to debug authentication state
4. Verify environment variables are properly configured
5. Check backend logs for authentication errors