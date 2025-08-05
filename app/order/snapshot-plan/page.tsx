"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { usePurchases } from "@/components/purchase-provider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle, CreditCard, AlertCircle, Clock } from "lucide-react"

export default function SnapshotPlanOrderPage() {
  const { user, loading } = useAuth()
  const { addPurchase, hasSnapshotPlan, getSubscriptionEndDate } = usePurchases()
  const router = useRouter()
  const [processing, setProcessing] = useState(false)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const [subscriptionEndDate, setSubscriptionEndDate] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signup?redirect=/order/snapshot-plan")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      const hasSnapshot = hasSnapshotPlan(user.id)
      const endDate = getSubscriptionEndDate(user.id)
      setHasActiveSubscription(hasSnapshot)
      setSubscriptionEndDate(endDate)
      console.log("Subscription status:", { hasSnapshot, endDate })
    }
  }, [user, hasSnapshotPlan, getSubscriptionEndDate])

  const handlePurchase = async () => {
    if (!user || hasActiveSubscription) return

    setProcessing(true)
    console.log("Processing snapshot plan purchase for:", user.id)

    // Simulate payment processing
    setTimeout(() => {
      const purchase = addPurchase({
        userId: user.id,
        type: "snapshot-plan",
        companyId: "snapshot-plan",
        companyName: "Snapshot Plan - Monthly Subscription",
        status: "completed",
        amount: 29,
      })

      console.log("Snapshot plan purchase created:", purchase)
      router.push(`/order/success?purchaseId=${purchase.id}&type=snapshot-plan`)
    }, 2000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  // If user already has active subscription
  if (hasActiveSubscription && subscriptionEndDate) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>
            </div>

            <Card className="border-green-200 bg-green-50">
              <CardHeader className="text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-green-800">Subscription Active</CardTitle>
                <CardDescription className="text-green-600">
                  You already have an active Snapshot Plan subscription
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-green-700 mb-2">Your subscription is active until:</p>
                    <p className="text-lg font-semibold text-green-800">{formatDate(subscriptionEndDate)}</p>
                  </div>
                  <p className="text-green-700">
                    You can generate unlimited snapshot reports until your subscription expires.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button className="bg-green-600 hover:bg-green-700" asChild>
                      <Link href="/dashboard/snapshot">Go to Dashboard</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/my-reports">View My Reports</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Subscribe to Snapshot Plan</h1>
              <p className="text-gray-600">Unlimited snapshot reports for Korean companies</p>
            </div>
          </div>

          <div className="grid gap-8">
            {/* Plan Details */}
            <Card className="border-emerald-200">
              <CardHeader className="bg-emerald-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-emerald-800">Snapshot Plan</CardTitle>
                    <CardDescription className="text-emerald-600">
                      Monthly subscription with unlimited access
                    </CardDescription>
                  </div>
                  <Badge className="bg-emerald-600 text-white text-2xl px-6 py-3">$29/month</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span>Unlimited snapshot reports</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span>Access to all Korean public companies</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span>Complete DART disclosure summaries</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span>Financial overview and key metrics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span>Recent news headlines and analysis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span>Risk indicator summaries</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span>Monthly billing - cancel anytime</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Why Choose Snapshot Plan?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">Single Reports</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• $15 per report</li>
                      <li>• One company at a time</li>
                      <li>• Pay per use</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-emerald-800">Snapshot Plan</h4>
                    <ul className="space-y-2 text-sm text-emerald-700">
                      <li>• $29 per month</li>
                      <li>• Unlimited companies</li>
                      <li>• Best value for regular users</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
                  <p className="text-emerald-800 font-medium">💡 Break-even at just 2 reports per month!</p>
                  <p className="text-sm text-emerald-600 mt-1">
                    Perfect for investors, analysts, and businesses monitoring multiple Korean companies
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Billing Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Billing Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Monthly Billing</h4>
                      <p className="text-sm text-gray-600">
                        Your subscription will automatically renew every 30 days at $29/month
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Cancel Anytime</h4>
                      <p className="text-sm text-gray-600">
                        You can cancel your subscription at any time from your profile page
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Immediate Access</h4>
                      <p className="text-sm text-gray-600">
                        Start generating unlimited reports immediately after subscription
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-emerald-100 mb-6">
                  Subscribe now and start generating unlimited snapshot reports for Korean companies
                </p>
                <Button
                  size="lg"
                  className="bg-white text-emerald-600 hover:bg-gray-100 text-lg px-8 py-4"
                  onClick={handlePurchase}
                  disabled={processing || hasActiveSubscription}
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  {processing ? "Processing..." : "Subscribe for $29/month"}
                </Button>
                <p className="text-xs text-emerald-200 mt-4">Secure payment • Cancel anytime • Immediate access</p>
              </CardContent>
            </Card>

            {/* Alternative Options */}
            <Card>
              <CardHeader>
                <CardTitle>Other Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Single Report</h4>
                      <p className="text-sm text-gray-600">One-time purchase for a specific company</p>
                    </div>
                    <Button variant="outline" asChild>
                      <Link href="/order/single-report">$15 per report</Link>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Free Trial</h4>
                      <p className="text-sm text-gray-600">7 days of unlimited access</p>
                    </div>
                    <Button variant="outline" asChild>
                      <Link href="/start-trial">Start Free Trial</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
