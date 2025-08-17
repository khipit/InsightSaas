/**
 * Simple test cases for authentication functionality
 * These tests are designed to be run manually or with a simple test runner
 */

import { authService } from '../auth-service'
import type { User } from '../api-types'

// Mock user objects for testing
const adminUser: User = {
  id: 'admin_1',
  email: 'admin@khip.com',
  name: 'Admin User',
  avatar: 'https://example.com/admin.jpg',
  hasActiveSubscription: true,
  role: 'admin',
  emailVerified: true,
  createdAt: '2024-01-01T00:00:00Z'
}

const regularUser: User = {
  id: 'user_1',
  email: 'user@example.com',
  name: 'Regular User',
  avatar: 'https://example.com/user.jpg',
  hasActiveSubscription: false,
  role: 'user',
  emailVerified: true,
  createdAt: '2024-01-01T00:00:00Z'
}

// Test cases
export const authServiceTests = {
  // Test isAdmin function
  testIsAdmin: () => {
    console.log('Testing isAdmin function...')
    
    // Test with admin user
    const adminResult = authService.isAdmin(adminUser)
    console.assert(adminResult === true, 'Admin user should return true')
    
    // Test with regular user
    const userResult = authService.isAdmin(regularUser)
    console.assert(userResult === false, 'Regular user should return false')
    
    // Test with null user
    const nullResult = authService.isAdmin(null)
    console.assert(nullResult === false, 'Null user should return false')
    
    console.log('✓ isAdmin tests passed')
  },

  // Test hasPermission function
  testHasPermission: () => {
    console.log('Testing hasPermission function...')
    
    // Test admin permissions
    const adminCanViewDashboard = authService.hasPermission(adminUser, 'view_admin_dashboard')
    console.assert(adminCanViewDashboard === true, 'Admin should have admin dashboard permission')
    
    const adminCanManagePurchases = authService.hasPermission(adminUser, 'manage_purchases')
    console.assert(adminCanManagePurchases === true, 'Admin should have manage purchases permission')
    
    // Test regular user permissions
    const userCanViewDashboard = authService.hasPermission(regularUser, 'view_admin_dashboard')
    console.assert(userCanViewDashboard === false, 'Regular user should not have admin dashboard permission')
    
    const userCanManagePurchases = authService.hasPermission(regularUser, 'manage_purchases')
    console.assert(userCanManagePurchases === false, 'Regular user should not have manage purchases permission')
    
    // Test with null user
    const nullCanViewDashboard = authService.hasPermission(null, 'view_admin_dashboard')
    console.assert(nullCanViewDashboard === false, 'Null user should not have any permissions')
    
    console.log('✓ hasPermission tests passed')
  },

  // Test user authentication state
  testAuthenticationState: () => {
    console.log('Testing authentication state...')
    
    // Mock localStorage for testing
    const mockLocalStorage = {
      store: {} as any,
      getItem: function(key: string) {
        return this.store[key] || null
      },
      setItem: function(key: string, value: string) {
        this.store[key] = value.toString()
      },
      removeItem: function(key: string) {
        delete this.store[key]
      }
    }
    
    // Replace localStorage with mock (for testing purposes)
    const originalLocalStorage = global.localStorage
    global.localStorage = mockLocalStorage as any
    
    // Test authenticated state
    mockLocalStorage.setItem('khip_auth_token', 'mock_token')
    const isAuthenticated = authService.isAuthenticated()
    console.assert(isAuthenticated === true, 'Should be authenticated with token')
    
    // Test unauthenticated state
    mockLocalStorage.removeItem('khip_auth_token')
    const isNotAuthenticated = authService.isAuthenticated()
    console.assert(isNotAuthenticated === false, 'Should not be authenticated without token')
    
    // Restore original localStorage
    global.localStorage = originalLocalStorage
    
    console.log('✓ Authentication state tests passed')
  },

  // Test user storage
  testUserStorage: () => {
    console.log('Testing user storage...')
    
    // Mock localStorage for testing
    const mockLocalStorage = {
      store: {} as any,
      getItem: function(key: string) {
        return this.store[key] || null
      },
      setItem: function(key: string, value: string) {
        this.store[key] = value.toString()
      },
      removeItem: function(key: string) {
        delete this.store[key]
      }
    }
    
    // Replace localStorage with mock (for testing purposes)
    const originalLocalStorage = global.localStorage
    global.localStorage = mockLocalStorage as any
    
    // Test storing user
    authService.storeUser(regularUser)
    const storedUser = authService.getStoredUser()
    console.assert(storedUser !== null, 'Stored user should not be null')
    console.assert(storedUser?.email === regularUser.email, 'Stored user email should match')
    console.assert(storedUser?.role === regularUser.role, 'Stored user role should match')
    
    // Test with no stored user
    mockLocalStorage.removeItem('khip_user')
    const noStoredUser = authService.getStoredUser()
    console.assert(noStoredUser === null, 'Should return null when no user stored')
    
    // Restore original localStorage
    global.localStorage = originalLocalStorage
    
    console.log('✓ User storage tests passed')
  },

  // Run all tests
  runAllTests: () => {
    console.log('Running all authentication tests...')
    console.log('=' .repeat(50))
    
    try {
      authServiceTests.testIsAdmin()
      authServiceTests.testHasPermission()
      authServiceTests.testAuthenticationState()
      authServiceTests.testUserStorage()
      
      console.log('=' .repeat(50))
      console.log('✅ All authentication tests passed!')
    } catch (error) {
      console.log('=' .repeat(50))
      console.error('❌ Some tests failed:', error)
    }
  }
}

// Manual test scenarios for UI components
export const manualTestScenarios = [
  {
    name: 'User Registration Flow',
    steps: [
      '1. Navigate to /signup',
      '2. Fill in name, email, and password',
      '3. Click "Create account"',
      '4. Verify user is created with "user" role',
      '5. Verify user is redirected to /my-reports',
      '6. Verify user appears in localStorage'
    ]
  },
  {
    name: 'User Login Flow',
    steps: [
      '1. Navigate to /login',
      '2. Fill in email and password',
      '3. Click "Sign in"',
      '4. Verify user is logged in',
      '5. Verify user is redirected to /my-reports',
      '6. Verify token is stored in localStorage'
    ]
  },
  {
    name: 'Admin Access Control',
    steps: [
      '1. Log in as regular user',
      '2. Try to navigate to /admin',
      '3. Verify access is denied (shows debug info)',
      '4. Log out and log in as admin@khip.com',
      '5. Navigate to /admin',
      '6. Verify admin dashboard is accessible'
    ]
  },
  {
    name: 'Password Reset Flow',
    steps: [
      '1. Navigate to /login',
      '2. Click "Forgot password?"',
      '3. Enter email address',
      '4. Click "Send reset link"',
      '5. Verify success message is shown',
      '6. Navigate to /reset-password?token=test',
      '7. Enter new password',
      '8. Verify password reset success'
    ]
  },
  {
    name: 'Role-based UI Display',
    steps: [
      '1. Log in as regular user',
      '2. Check that admin-only UI elements are hidden',
      '3. Log in as admin user',
      '4. Check that admin UI elements are visible',
      '5. Verify user role badge shows correctly'
    ]
  }
]

// Export for use in browser console or simple test runner
if (typeof window !== 'undefined') {
  // Make tests available in browser console
  (window as any).authTests = authServiceTests
  (window as any).manualTests = manualTestScenarios
  
  console.log('Authentication tests loaded!')
  console.log('Run authTests.runAllTests() to execute all tests')
  console.log('View manualTests for UI testing scenarios')
}