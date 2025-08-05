"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { usePurchases } from "@/components/purchase-provider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Gift, Clock, FileText, AlertCircle } from "lucide-react"

export default function StartTrialPage() {
  const { user, loading } = useAuth()
  const { addPurchase, hasUsedTrial, hasActiveTrial } = usePurchases()
  const router = useRouter()
  const [processing, setProcessing] = useState(false)
  const [alreadyUsedTrial, setAlreadyUsedTrial] = useState(false)
  const [hasActiveTrialState, setHasActiveTrialState] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signup?redirect=/start-trial")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      const usedTrial = hasUsedTrial(user.id)
      const activeTrial = hasActiveTrial(user.id)
      setAlreadyUsedTrial(usedTrial)
      setHasActiveTrialState(activeTrial)
      console.log("Trial status:", { usedTrial, activeTrial })
    }
  }, [user, hasUsedTrial, hasActiveTrial])

  const handleStartTrial = async () => {
    if (!user || alreadyUsedTrial) return

    setProcessing(true)
    console.log("Starting free trial for:", user.id)

    // Create trial purchase
    setTimeout(() => {
      const purchase = addPurchase({
        userId: user.id,
        type: "trial",
        companyId: "trial-access",
        companyName: "7-Day Free Trial - Unlimited Snapshots",
        status: "completed",
        amount: 0,
      })

      console.log("Trial purchase created:", purchase)
      router.push(`/order/success?purchaseId=${purchase.id}&type=trial`)
    }, 1500)
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  // If user has active trial, redirect to dashboard
  if (hasActiveTrialState) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-green-800">Trial Active!</CardTitle>
                <CardDescription className="text-green-600">Your 7-day free trial is currently active</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-green-700 mb-6">
                  You can generate unlimited snapshot reports until your trial expires.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button className="bg-green-600 hover:bg-green-700" asChild>
                    <Link href="/dashboard/snapshot">Go to Dashboard</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/my-reports">View My Reports</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // If user already used trial
  if (alreadyUsedTrial) {
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

            <Card className="border-amber-200 bg-amber-50">
              <CardHeader className="text-center">
                <AlertCircle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                <CardTitle className="text-amber-800">Trial Already Used</CardTitle>
                <CardDescription className="text-amber-600">You have already used your free trial</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-amber-700 mb-6">
                  Each user can only use the free trial once. To continue using KHIP, please consider our paid plans.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
                    <Link href="/order/snapshot-plan">Subscribe to Snapshot Plan</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/order/single-report">Order Single Report</Link>
                  </Button>
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
              <h1 className="text-2xl font-bold text-gray-900">Start Your Free Trial</h1>
              <p className="text-gray-600">Experience KHIP with 7 days of unlimited snapshots</p>
            </div>
          </div>

          <div className="grid gap-8">
            {/* Trial Details */}
            <Card className="border-blue-200">
              <CardHeader className="bg-blue-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-blue-800 flex items-center">
                      <Gift className="h-5 w-5 mr-2" />
                      7-Day Free Trial
                    </CardTitle>
                    <CardDescription className="text-blue-600">
                      Unlimited snapshot reports for 7 days - no payment required
                    </CardDescription>
                  </div>
                  <Badge className="bg-blue-600 text-white text-lg px-4 py-2">FREE</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>
                      <strong>Unlimited</strong> snapshot reports for 7 days
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>Access to all Korean companies</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>Complete DART disclosure summaries</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>Recent news headlines (3 months)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>Key financial metrics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>Risk indicator summary</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>No credit card required</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What You'll Get */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  What's Included in Your Trial
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Unlimited Access</h4>
                    <p className="text-sm text-blue-700">
                      Generate as many snapshot reports as you want for any Korean public company during your 7-day
                      trial
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Full Feature Access</h4>
                    <p className="text-sm text-green-700">
                      Experience all the features of our Snapshot Plan including financial data, news analysis, and risk
                      indicators
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">No Commitment</h4>
                    <p className="text-sm text-purple-700">
                      Trial automatically expires after 7 days with no charges or obligations
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Activate Your 7-Day Trial</h4>
                      <p className="text-sm text-gray-600">Click the button below to start your free trial</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Generate Unlimited Reports</h4>
                      <p className="text-sm text-gray-600">
                        Access the snapshot dashboard and generate reports for any Korean company
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Explore All Features</h4>
                      <p className="text-sm text-gray-600">Experience the full power of KHIP for 7 days</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Ready to Experience KHIP?</h2>
                <p className="text-blue-100 mb-6">
                  Start your 7-day free trial now and generate unlimited snapshot reports
                </p>
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
                  onClick={handleStartTrial}
                  disabled={processing || alreadyUsedTrial}
                >
                  {processing ? "Activating Trial..." : "Start 7-Day Free Trial"}
                </Button>
                <p className="text-xs text-blue-200 mt-4">No credit card required • Unlimited reports • 7 days free</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
