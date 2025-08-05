"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { usePurchases } from "@/components/purchase-provider"
import { useRouter } from "next/navigation"
import { Upload, Clock, CheckCircle, AlertTriangle, Edit } from "lucide-react"

export default function AdminPage() {
  const { user, loading } = useAuth()
  const { getPendingPurchases, updatePurchaseStatus, purchases } = usePurchases()
  const router = useRouter()
  const [pendingReports, setPendingReports] = useState<any[]>([])
  const [uploadingId, setUploadingId] = useState<string | null>(null)

  // 디버깅을 위한 상태 표시
  const [debugInfo, setDebugInfo] = useState({
    userEmail: "",
    isAdmin: false,
    loadingState: true,
  })

  useEffect(() => {
    console.log("=== ADMIN PAGE DEBUG ===")
    console.log("Loading:", loading)
    console.log("User:", user)
    console.log("User email:", user?.email)
    console.log("Is admin?", user?.email === "admin@khip.com")

    setDebugInfo({
      userEmail: user?.email || "No user",
      isAdmin: user?.email === "admin@khip.com",
      loadingState: loading,
    })

    if (!loading && !user) {
      console.log("No user found, redirecting to login")
      router.push("/login")
      return
    }

    if (!loading && user && user.email !== "admin@khip.com") {
      console.log("User is not admin:", user.email)
      return
    }

    if (user && user.email === "admin@khip.com") {
      console.log("Admin user confirmed, loading pending purchases")
      const pending = getPendingPurchases()
      console.log("Pending purchases:", pending)
      setPendingReports(pending)
    }
  }, [user, loading, router, getPendingPurchases, purchases])

  const handleGenerateReport = async (purchaseId: string) => {
    setUploadingId(purchaseId)

    setTimeout(() => {
      updatePurchaseStatus(purchaseId, "under_review")
      const pending = getPendingPurchases()
      setPendingReports(pending)
      setUploadingId(null)
      alert("Report auto-generated! You can now edit and review it.")
    }, 3000)
  }

  const handleEditReport = (purchaseId: string) => {
    router.push(`/admin/edit-report/${purchaseId}`)
  }

  const handleApproveReport = async (purchaseId: string) => {
    setUploadingId(purchaseId)

    setTimeout(() => {
      const reportUrl = `/reports/${purchaseId}-full-report.pdf`
      updatePurchaseStatus(purchaseId, "delivered", reportUrl)
      const pending = getPendingPurchases()
      setPendingReports(pending)
      setUploadingId(null)
      alert("Report approved and delivered!")
    }, 1000)
  }

  const getTimeSincePurchase = (purchaseDate: string) => {
    const now = new Date()
    const purchase = new Date(purchaseDate)
    const diffInHours = Math.floor((now.getTime() - purchase.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Less than 1 hour ago"
    if (diffInHours === 1) return "1 hour ago"
    if (diffInHours < 24) return `${diffInHours} hours ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return "1 day ago"
    return `${diffInDays} days ago`
  }

  const isOverdue = (purchaseDate: string) => {
    const now = new Date()
    const purchase = new Date(purchaseDate)
    const diffInHours = (now.getTime() - purchase.getTime()) / (1000 * 60 * 60)
    return diffInHours > 24
  }

  // 강제로 어드민 로그인하는 버튼 (개발용)
  const handleForceAdminLogin = () => {
    localStorage.setItem(
      "khip_user",
      JSON.stringify({
        id: "admin",
        email: "admin@khip.com",
        name: "Admin User",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
        hasActiveSubscription: true,
      }),
    )
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  // 디버깅 정보 표시
  if (!user || user.email !== "admin@khip.com") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>Admin Access Debug</CardTitle>
            <CardDescription>Debugging admin access issues</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg text-sm">
              <h4 className="font-semibold mb-2">Debug Information:</h4>
              <p>
                <strong>Loading:</strong> {debugInfo.loadingState ? "Yes" : "No"}
              </p>
              <p>
                <strong>User Email:</strong> {debugInfo.userEmail}
              </p>
              <p>
                <strong>Is Admin:</strong> {debugInfo.isAdmin ? "Yes" : "No"}
              </p>
              <p>
                <strong>Required Email:</strong> admin@khip.com
              </p>
            </div>

            {!user && (
              <div>
                <p className="text-red-600 mb-4">No user logged in</p>
                <Button onClick={() => router.push("/login")} className="w-full mb-2">
                  Go to Login
                </Button>
              </div>
            )}

            {user && user.email !== "admin@khip.com" && (
              <div>
                <p className="text-red-600 mb-4">Current user ({user.email}) is not admin</p>
                <Button onClick={() => router.push("/")} className="w-full mb-2">
                  Go to Homepage
                </Button>
              </div>
            )}

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-2">Development Helper:</p>
              <Button onClick={handleForceAdminLogin} variant="outline" className="w-full">
                Force Admin Login (Dev Only)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage report deliveries and customer orders</p>
            <p className="text-sm text-green-600 mt-1">✅ Logged in as: {user.email}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingReports.length}</div>
                <p className="text-xs text-muted-foreground">Awaiting processing</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Under Review</CardTitle>
                <Edit className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {pendingReports.filter((p) => p.status === "under_review").length}
                </div>
                <p className="text-xs text-muted-foreground">Ready for editing</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {pendingReports.filter((p) => isOverdue(p.purchaseDate)).length}
                </div>
                <p className="text-xs text-muted-foreground">Over 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {purchases.filter((p) => p.status === "delivered").length}
                </div>
                <p className="text-xs text-muted-foreground">Completed</p>
              </CardContent>
            </Card>
          </div>

          {/* Pending Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Report Management</CardTitle>
              <CardDescription>Generate, edit, and deliver reports to customers</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingReports.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
                  <p className="text-gray-600">No pending reports to process.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingReports.map((purchase) => (
                    <div
                      key={purchase.id}
                      className={`border rounded-lg p-4 ${
                        isOverdue(purchase.purchaseDate)
                          ? "border-red-200 bg-red-50"
                          : purchase.status === "under_review"
                            ? "border-blue-200 bg-blue-50"
                            : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{purchase.companyName}</h3>
                            {isOverdue(purchase.purchaseDate) && purchase.status === "pending" && (
                              <Badge className="bg-red-100 text-red-800">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Overdue
                              </Badge>
                            )}
                            {purchase.status === "under_review" && (
                              <Badge className="bg-blue-100 text-blue-800">
                                <Edit className="w-3 h-3 mr-1" />
                                Ready to Edit
                              </Badge>
                            )}
                            <Badge variant="outline">
                              {purchase.type === "single-report" ? "Single Report" : "Custom Report"}
                            </Badge>
                            <Badge className="bg-blue-100 text-blue-800">${purchase.amount}</Badge>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>
                              <strong>Customer:</strong> {purchase.userId}
                            </p>
                            <p>
                              <strong>Ordered:</strong> {getTimeSincePurchase(purchase.purchaseDate)} (
                              {new Date(purchase.purchaseDate).toLocaleString()})
                            </p>
                            <p>
                              <strong>Purchase ID:</strong> {purchase.id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right text-sm">
                            <div className="font-medium">
                              {purchase.status === "pending"
                                ? "Generate Draft"
                                : purchase.status === "under_review"
                                  ? "Edit & Review"
                                  : "Approve"}
                            </div>
                            <div className="text-gray-500">
                              {purchase.status === "pending"
                                ? "Create initial report"
                                : purchase.status === "under_review"
                                  ? "Customize content"
                                  : "Final delivery"}
                            </div>
                          </div>
                          {purchase.status === "pending" ? (
                            <Button
                              onClick={() => handleGenerateReport(purchase.id)}
                              disabled={uploadingId === purchase.id}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {uploadingId === purchase.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Upload className="mr-2 h-4 w-4" />
                                  Generate Draft
                                </>
                              )}
                            </Button>
                          ) : purchase.status === "under_review" ? (
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleEditReport(purchase.id)}
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Report
                              </Button>
                              <Button
                                onClick={() => handleApproveReport(purchase.id)}
                                disabled={uploadingId === purchase.id}
                                className="bg-emerald-600 hover:bg-emerald-700"
                              >
                                {uploadingId === purchase.id ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Delivering...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Approve & Deliver
                                  </>
                                )}
                              </Button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Workflow Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Generate Draft Report</h4>
                    <p className="text-gray-600">
                      Click "Generate Draft" to create an AI-powered initial report with sample-level content including
                      DART filings, financial data, and news analysis.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Edit & Customize</h4>
                    <p className="text-gray-600">
                      Use the "Edit Report" button to review and customize the generated content. Modify financial data,
                      add insights, update risk assessments, and refine the English translation.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Approve & Deliver</h4>
                    <p className="text-gray-600">
                      Once satisfied with the report quality, click "Approve & Deliver" to send the final report to the
                      customer with automatic email notification.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
