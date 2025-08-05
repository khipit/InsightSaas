"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { usePurchases } from "@/components/purchase-provider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ReportStatusCard } from "@/components/report-status-card"
import { FileText, ShoppingCart, Clock, CheckCircle, Calendar } from "lucide-react"

export default function MyReportsPage() {
  const { user, loading } = useAuth()
  const { getPurchasesByUser, getSubscriptionEndDate } = usePurchases()
  const router = useRouter()
  const [userPurchases, setUserPurchases] = useState<any[]>([])
  const [subscriptionEndDate, setSubscriptionEndDate] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/my-reports")
      return
    }

    if (user) {
      const purchases = getPurchasesByUser(user.id)
      console.log("My Reports - User purchases:", purchases)
      setUserPurchases(purchases)

      // Get subscription end date
      const endDate = getSubscriptionEndDate(user.id)
      setSubscriptionEndDate(endDate)
    }
  }, [user, loading, router, getPurchasesByUser, getSubscriptionEndDate])

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  const totalReports = userPurchases.length
  const pendingReports = userPurchases.filter((p) => p.status === "pending").length
  const deliveredReports = userPurchases.filter((p) => p.status === "delivered").length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reports</h1>
            <p className="text-gray-600">Track your Korean corporate intelligence reports and delivery status</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalReports}</div>
                <p className="text-xs text-muted-foreground">All time orders</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Processing</CardTitle>
                <Clock className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{pendingReports}</div>
                <p className="text-xs text-muted-foreground">Within 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">{deliveredReports}</div>
                <p className="text-xs text-muted-foreground">Ready to download</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subscription</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                {subscriptionEndDate ? (
                  <>
                    <div className="text-lg font-bold text-blue-600">Active</div>
                    <p className="text-xs text-muted-foreground">
                      Until {new Date(subscriptionEndDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-blue-600">
                      {Math.ceil(
                        (new Date(subscriptionEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                      )}{" "}
                      days left
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-lg font-bold text-gray-600">None</div>
                    <p className="text-xs text-muted-foreground">No active subscription</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Reports List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Reports</CardTitle>
              <CardDescription>All your Korean corporate intelligence reports with delivery status</CardDescription>
            </CardHeader>
            <CardContent>
              {userPurchases.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports yet</h3>
                  <p className="text-gray-600 mb-6">
                    You haven't ordered any reports yet. Start by ordering your first Korean corporate intelligence
                    report.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild>
                      <Link href="/order/single-report">Order Single Report</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/order/snapshot-plan">Subscribe to Snapshot Plan</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {userPurchases.map((purchase) => (
                    <ReportStatusCard key={purchase.id} purchase={purchase} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Debug Info (Development Only) */}
          {process.env.NODE_ENV === "development" && (
            <Card className="mt-8 border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-yellow-800">Debug Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-yellow-700">
                  <p>User ID: {user.id}</p>
                  <p>Total Purchases Found: {userPurchases.length}</p>
                  <pre className="mt-2 text-xs bg-yellow-100 p-2 rounded">{JSON.stringify(userPurchases, null, 2)}</pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
