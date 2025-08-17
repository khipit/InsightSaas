"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authService } from "@/lib/auth-service"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, AlertCircle, Key } from "lucide-react"

function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [tokenError, setTokenError] = useState("")
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) {
      setTokenError("Invalid or missing reset token. Please request a new password reset link.")
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    // Validate password strength
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long")
      setLoading(false)
      return
    }

    if (!token) {
      setError("Invalid reset token")
      setLoading(false)
      return
    }
    
    try {
      await authService.confirmPasswordReset(token, newPassword)
      setSuccess(true)
    } catch (error: any) {
      console.error("Password reset failed:", error)
      setError(error.message || "Failed to reset password. Please try again or request a new reset link.")
    } finally {
      setLoading(false)
    }
  }

  if (tokenError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Invalid Reset Link</CardTitle>
            <CardDescription>
              {tokenError}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/forgot-password" className="block">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                Request New Reset Link
              </Button>
            </Link>
            <Link href="/login" className="block">
              <Button variant="outline" className="w-full">
                Back to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Password Reset Successful</CardTitle>
            <CardDescription>
              Your password has been successfully updated. You can now login with your new password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => router.push("/login")} 
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              Continue to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl">Set New Password</CardTitle>
          <CardDescription>
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password"
                className={error ? "border-red-500" : ""}
              />
            </div>
            
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
                className={error ? "border-red-500" : ""}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="text-sm text-gray-600">
              <p>Password requirements:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>At least 6 characters long</li>
                <li>Should contain a mix of letters and numbers</li>
              </ul>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700" 
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>

          <div className="text-center">
            <Link href="/login" className="text-sm text-emerald-600 hover:text-emerald-500">
              Back to login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}