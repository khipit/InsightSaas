"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, ArrowRight, Mail } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { usePurchases } from "@/components/purchase-provider"

export default function ThankYouPage() {
  const { user } = useAuth()
  const { addPurchase } = usePurchases()
  const [orderProcessed, setOrderProcessed] = useState(false)
  const [orderType, setOrderType] = useState<"single-report" | "custom-report">("single-report")

  useEffect(() => {
    // Detect order type from URL parameters or referrer
    const urlParams = new URLSearchParams(window.location.search)
    const type = urlParams.get("type") || "single-report"
    setOrderType(type as "single-report" | "custom-report")

    // Process PayPal order when page loads
    if (user && !orderProcessed) {
      const purchase = addPurchase({
        userId: user.id,
        type: type as "single-report" | "custom-report",
        companyId: type === "custom-report" ? "custom-research" : "sample-company",
        companyName: type === "custom-report" ? "Custom Research Report" : "Sample Company (PayPal Order)",
        status: "pending",
        amount: type === "custom-report" ? 490 : 149,
      })

      console.log(`PayPal ${type} purchase processed:`, purchase)
      setOrderProcessed(true)
    }
  }, [user, addPurchase, orderProcessed])

  const isCustomReport = orderType === "custom-report"

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600">
              Thank you for your order. {isCustomReport ? "Your custom research" : "Your report"} is being processed.
            </p>
          </div>

          {/* Order Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Confirmation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="font-medium">
                    {isCustomReport ? "Custom Insight Report" : "Single Insight Report"}
                  </span>
                  <Badge className="bg-emerald-100 text-emerald-800">${isCustomReport ? "490.00" : "149.00"}</Badge>
                </div>

                {!isCustomReport && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800">Available Now</h4>
                        <ul className="text-sm text-blue-700 mt-1 space-y-1">
                          <li>• Snapshot overview access</li>
                          <li>• Basic DART disclosure summary</li>
                          <li>• Financial overview and key metrics</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-emerald-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-emerald-800">Delivery Within 24 Hours</h4>
                      <ul className="text-sm text-emerald-700 mt-1 space-y-1">
                        {isCustomReport ? (
                          <>
                            <li>• Tailored research based on your requirements</li>
                            <li>• Risk, disclosure, and reputation analysis</li>
                            <li>• Multi-company comparison (if requested)</li>
                            <li>• Professional recommendations and insights</li>
                          </>
                        ) : (
                          <>
                            <li>• Comprehensive DART analysis</li>
                            <li>• News sentiment and risk assessment</li>
                            <li>• Professional English translation</li>
                            <li>• Executive summary and recommendations</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                What Happens Next?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-sm font-medium text-emerald-600">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">{isCustomReport ? "Research Begins" : "Immediate Access"}</h4>
                    <p className="text-sm text-gray-600">
                      {isCustomReport
                        ? "Our expert team will begin working on your custom research immediately."
                        : "You can access the snapshot overview right now from your dashboard."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-sm font-medium text-emerald-600">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Email Confirmation</h4>
                    <p className="text-sm text-gray-600">
                      You'll receive an email confirmation with your order details shortly.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-sm font-medium text-emerald-600">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Report Delivery</h4>
                    <p className="text-sm text-gray-600">
                      {isCustomReport
                        ? "Your custom research report will be delivered within 24 hours via email."
                        : "Your complete analysis report will be ready within 24 hours and you'll be notified by email."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="flex-1">
              <Link href="/my-reports">
                View My Reports
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
