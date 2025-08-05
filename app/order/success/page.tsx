"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { usePurchases } from "@/components/purchase-provider"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Clock, Eye, ArrowRight, Calendar } from "lucide-react"

export default function OrderSuccessPage() {
  const { user, loading } = useAuth()
  const { getPurchasesByUser } = usePurchases()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [purchase, setPurchase] = useState<any>(null)

  const orderType = searchParams.get("type")
  const purchaseId = searchParams.get("purchaseId")
  const companyId = searchParams.get("company")

  useEffect(() => {
    console.log("OrderSuccess useEffect triggered:", { user, loading, purchaseId, orderType, companyId })

    if (!loading && !user) {
      console.log("No user, redirecting to login")
      router.push("/login")
      return
    }

    if (user && purchaseId) {
      console.log("Looking for purchase:", purchaseId)
      // Find the purchase
      const userPurchases = getPurchasesByUser(user.id)
      console.log("User purchases:", userPurchases)
      const foundPurchase = userPurchases.find((p) => p.id === purchaseId)
      console.log("Found purchase:", foundPurchase)

      if (foundPurchase) {
        setPurchase(foundPurchase)
        setOrderDetails({
          type: foundPurchase.type,
          companyId: foundPurchase.companyId,
          companyName: foundPurchase.companyName,
          amount: foundPurchase.amount,
        })
      } else {
        // If purchase not found, try to create a fallback based on URL params
        console.log("Purchase not found, creating fallback")
        if (orderType && companyId) {
          setOrderDetails({
            type: orderType,
            companyId: companyId,
            companyName: `Company ${companyId}`,
            amount: orderType === "single-report" ? 149 : 29,
          })
        }
      }
    }
  }, [user, loading, router, purchaseId, getPurchasesByUser, orderType, companyId])

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  if (!user || !orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Order Not Found</CardTitle>
            <CardDescription>
              We couldn't find your order details. Please check your reports in the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/my-reports">Go to My Reports</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <Card className="mb-8 border-emerald-200 bg-emerald-50">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-emerald-800">Payment Successful!</CardTitle>
              <CardDescription className="text-emerald-700">
                Your order has been confirmed and is being processed
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Order Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>Confirmation for your Korean corporate intelligence report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <h3 className="font-semibold">{orderDetails.companyName}</h3>
                    <p className="text-sm text-gray-600">
                      {orderType === "single-report" ? "Single Insight Report" : "Snapshot Plan"}
                    </p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800">${orderDetails.amount}</Badge>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <span className="font-medium">Order ID</span>
                  <span className="text-sm font-mono">{purchase?.id}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <span className="font-medium">Order Date</span>
                  <span className="text-sm">
                    {purchase ? new Date(purchase.purchaseDate).toLocaleDateString() : "Today"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="font-medium">Total Paid</span>
                  <span className="text-lg font-semibold text-emerald-600">${orderDetails.amount}.00</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What Happens Next */}
          {orderType === "single-report" && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  What Happens Next
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Immediate Access */}
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-800">Available Now</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        You can immediately access the snapshot overview of your selected company
                      </p>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
                        <Link href={`/reports/snapshot/${orderDetails.companyId}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Snapshot Report
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Full Report */}
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-emerald-800">Within 24 Hours</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Your comprehensive insight report will be prepared and delivered via email in PDF format
                      </p>
                      <div className="bg-emerald-50 p-3 rounded-lg">
                        <h5 className="font-medium text-emerald-800 mb-1">Full Report Includes:</h5>
                        <ul className="text-sm text-emerald-700 space-y-1">
                          <li>• Comprehensive DART analysis and regulatory filings</li>
                          <li>• News sentiment analysis and risk assessment</li>
                          <li>• Professional English translation</li>
                          <li>• Executive summary and investment recommendations</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Email Notification */}
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-purple-800">Email Notification</h4>
                      <p className="text-sm text-gray-600">
                        You'll receive an email notification when your full report is ready for download
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Snapshot Plan Success */}
          {orderType === "snapshot-plan" && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  Your Snapshot Plan is Active
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    You now have unlimited access to generate snapshot reports for any Korean company.
                  </p>
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-emerald-800 mb-2">Plan Benefits:</h4>
                    <ul className="text-sm text-emerald-700 space-y-1">
                      <li>• Unlimited snapshot reports</li>
                      <li>• Instant DART disclosure summaries</li>
                      <li>• Financial overview and key metrics</li>
                      <li>• Recent news headlines</li>
                    </ul>
                  </div>
                  <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
                    <Link href="/dashboard/snapshot">
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Start Generating Reports
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto p-4" asChild>
                  <Link href="/my-reports">
                    <div className="text-left">
                      <div className="font-semibold">View My Reports</div>
                      <div className="text-sm text-gray-600">Access all your reports and track delivery status</div>
                    </div>
                  </Link>
                </Button>

                <Button variant="outline" className="h-auto p-4" asChild>
                  <Link href="/order/single-report">
                    <div className="text-left">
                      <div className="font-semibold">Order Another Report</div>
                      <div className="text-sm text-gray-600">Analyze additional Korean companies</div>
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
