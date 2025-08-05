"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CreditCard, Clock, CheckCircle } from "lucide-react"
import { CompanySelector } from "@/components/company-selector"

interface Company {
  id: string
  nameKorean: string
  nameEnglish: string
  ticker: string
  sector: string
  marketCap: string
  exchange: "KOSPI" | "KOSDAQ"
}

export default function OrderReportPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signup?redirect=/order-report")
    }
  }, [user, loading, router])

  const handlePayment = async () => {
    if (!selectedCompany) return

    setProcessing(true)

    // Simulate Stripe payment processing
    setTimeout(() => {
      router.push(`/order/success?type=single-report&company=${selectedCompany.id}`)
    }, 2000)
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Single Insight Report</h1>
              <p className="text-gray-600">Complete analysis package for $149</p>
            </div>
          </div>

          <div className="grid gap-8">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <h3 className="font-semibold">Single Insight Report</h3>
                      <p className="text-sm text-gray-600">
                        DART + News analysis + Risk assessment + English translation
                      </p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800">$149</Badge>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800">Delivery Information</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Your report will be delivered within 3-5 business days via email in PDF format. You'll also be
                          able to access it in your dashboard immediately after completion.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total</span>
                      <span className="text-emerald-600">$149.00</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What's Included */}
            <Card className="border-emerald-200 bg-emerald-50">
              <CardHeader>
                <CardTitle className="text-emerald-800">What's Included</CardTitle>
                <CardDescription className="text-emerald-600">Comprehensive analysis package</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span>Complete DART disclosure analysis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span>News sentiment and risk factor assessment</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span>Professional English translation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span>Executive summary and key insights</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span>PDF download and unlimited access</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Company Selection</CardTitle>
                <CardDescription>Choose the Korean company you want to analyze</CardDescription>
              </CardHeader>
              <CardContent>
                <CompanySelector
                  onCompanySelect={setSelectedCompany}
                  selectedCompany={selectedCompany}
                  disabled={processing}
                  placeholder="Search for a Korean company (e.g. 삼성전자 or 005930)"
                />
              </CardContent>
            </Card>

            {/* Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment
                </CardTitle>
                <CardDescription>Secure payment powered by Stripe</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6"
                  onClick={handlePayment}
                  disabled={!selectedCompany || processing}
                >
                  {processing ? "Processing Payment..." : "Pay $149 - Order Report"}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-4">
                  Your report will be generated and delivered within 3-5 business days. You'll receive an email
                  confirmation once your order is processed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
