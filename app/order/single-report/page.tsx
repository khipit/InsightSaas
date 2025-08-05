"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { usePurchases } from "@/components/purchase-provider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CreditCard, CheckCircle, Clock, Shield, AlertCircle } from "lucide-react"
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

declare global {
  interface Window {
    paypal?: any
  }
}

export default function SingleReportOrderPage() {
  const { user, loading } = useAuth()
  const { addPurchase } = usePurchases()
  const router = useRouter()
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [processing, setProcessing] = useState(false)
  const [paypalStatus, setPaypalStatus] = useState<"loading" | "ready" | "error">("loading")
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  const addDebugInfo = (info: string) => {
    setDebugInfo((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${info}`])
    console.log("PayPal Debug:", info)
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signup?redirect=/order/single-report")
    }
  }, [user, loading, router])

  useEffect(() => {
    // Load PayPal SDK dynamically
    const loadPayPalSDK = () => {
      addDebugInfo("Starting PayPal SDK load...")

      // Check if already loaded
      if (window.paypal) {
        addDebugInfo("PayPal SDK already loaded!")
        setPaypalStatus("ready")
        renderPayPalButton()
        return
      }

      // Check if script already exists
      const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]')
      if (existingScript) {
        addDebugInfo("PayPal script already exists, waiting for load...")
        // Wait for it to load
        const checkInterval = setInterval(() => {
          if (window.paypal) {
            clearInterval(checkInterval)
            addDebugInfo("PayPal SDK loaded from existing script!")
            setPaypalStatus("ready")
            renderPayPalButton()
          }
        }, 100)
        return
      }

      // Create and load script
      addDebugInfo("Creating PayPal script element...")
      const script = document.createElement("script")
      script.src =
        "https://www.paypal.com/sdk/js?client-id=BAANhpJJBDMKaJYxQ2C7NIdJ5oJoZfZnPEqmKvA8nX1C1WjG_kP0KIYKS_ERvJWV0JsY-sEtV1fHMTPJMQ&components=hosted-buttons&disable-funding=venmo&currency=USD"
      script.async = true

      script.onload = () => {
        addDebugInfo("✅ PayPal SDK script loaded successfully!")
        if (window.paypal) {
          setPaypalStatus("ready")
          renderPayPalButton()
        } else {
          addDebugInfo("❌ PayPal SDK loaded but window.paypal not available")
          setPaypalStatus("error")
        }
      }

      script.onerror = () => {
        addDebugInfo("❌ PayPal SDK script failed to load")
        setPaypalStatus("error")
      }

      document.head.appendChild(script)
      addDebugInfo("PayPal script added to document head")
    }

    const renderPayPalButton = () => {
      if (!selectedCompany) {
        addDebugInfo("No company selected, skipping PayPal button render")
        return
      }

      if (!window.paypal) {
        addDebugInfo("window.paypal not available for rendering")
        return
      }

      addDebugInfo("Attempting to render PayPal button...")

      try {
        const container = document.getElementById("paypal-container-3MQXSCA287GD6")
        if (!container) {
          addDebugInfo("❌ PayPal container not found")
          return
        }

        // Clear existing content
        container.innerHTML = ""

        window.paypal
          .HostedButtons({
            hostedButtonId: "3MQXSCA287GD6",
          })
          .render("#paypal-container-3MQXSCA287GD6")
          .then(() => {
            addDebugInfo("✅ PayPal button rendered successfully!")
          })
          .catch((error: any) => {
            addDebugInfo(`❌ PayPal render error: ${error.message || error}`)
            setPaypalStatus("error")
          })
      } catch (error: any) {
        addDebugInfo(`❌ PayPal integration error: ${error.message || error}`)
        setPaypalStatus("error")
      }
    }

    loadPayPalSDK()
  }, [])

  useEffect(() => {
    // Re-render PayPal button when company is selected
    if (selectedCompany && paypalStatus === "ready") {
      addDebugInfo(`Company selected: ${selectedCompany.nameKorean}, re-rendering PayPal button`)
      const renderPayPalButton = () => {
        if (!window.paypal) return

        try {
          const container = document.getElementById("paypal-container-3MQXSCA287GD6")
          if (!container) return

          container.innerHTML = ""

          window.paypal
            .HostedButtons({
              hostedButtonId: "3MQXSCA287GD6",
            })
            .render("#paypal-container-3MQXSCA287GD6")
            .then(() => {
              addDebugInfo("✅ PayPal button re-rendered for selected company!")
            })
            .catch((error: any) => {
              addDebugInfo(`❌ PayPal re-render error: ${error.message || error}`)
            })
        } catch (error: any) {
          addDebugInfo(`❌ PayPal re-render integration error: ${error.message || error}`)
        }
      }

      renderPayPalButton()
    }
  }, [selectedCompany, paypalStatus])

  const handleStripePayment = async () => {
    if (!selectedCompany || !user) return

    setProcessing(true)
    console.log("Starting Stripe payment process for:", { selectedCompany, user: user.id })

    // Simulate payment processing
    setTimeout(() => {
      const purchase = addPurchase({
        userId: user.id,
        type: "single-report",
        companyId: selectedCompany.id,
        companyName: `${selectedCompany.nameKorean} (${selectedCompany.nameEnglish})`,
        status: "pending",
        amount: 149,
      })

      console.log("Purchase created:", purchase)
      const successUrl = `/order/success?type=single-report&purchaseId=${purchase.id}&company=${selectedCompany.id}`
      router.push(successUrl)
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
              <Link href="/sample-report">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Single Insight Report</h1>
              <p className="text-gray-600">Complete analysis package delivered within 24 hours</p>
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
                        <h4 className="font-medium text-blue-800">What You Get Immediately</h4>
                        <ul className="text-sm text-blue-700 mt-1 space-y-1">
                          <li>• Immediate access to snapshot overview</li>
                          <li>• Basic DART disclosure summary</li>
                          <li>• Financial overview and key metrics</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-emerald-800">Full Report (Within 24 Hours)</h4>
                        <ul className="text-sm text-emerald-700 mt-1 space-y-1">
                          <li>• Comprehensive DART analysis</li>
                          <li>• News sentiment and risk assessment</li>
                          <li>• Professional English translation</li>
                          <li>• Executive summary and recommendations</li>
                        </ul>
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

            {/* Company Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Company Selection</CardTitle>
                <CardDescription>Search and select the Korean company you want to analyze</CardDescription>
              </CardHeader>
              <CardContent>
                <CompanySelector
                  onCompanySelect={setSelectedCompany}
                  selectedCompany={selectedCompany}
                  disabled={processing}
                />
              </CardContent>
            </Card>

            {/* Payment Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Options
                </CardTitle>
                <CardDescription>Choose your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Debug Info */}
                <div className="bg-yellow-50 p-3 rounded text-sm">
                  <strong>Debug Info:</strong>
                  <br />
                  PayPal SDK Loaded: {window.paypal ? "✅ Yes" : "❌ No"}
                  <br />
                  Company Selected: {selectedCompany ? `✅ ${selectedCompany.nameKorean}` : "❌ No"}
                  <br />
                  PayPal Button Ready: {paypalStatus === "ready" ? "✅ Yes" : "❌ No"}
                  <br />
                  Status: {paypalStatus}
                </div>

                {/* PayPal Debug Logs */}
                <div className="bg-gray-50 p-3 rounded text-xs max-h-32 overflow-y-auto">
                  <strong>PayPal Logs:</strong>
                  {debugInfo.slice(-8).map((info, index) => (
                    <div key={index} className="text-gray-700">
                      {info}
                    </div>
                  ))}
                </div>

                {/* Stripe Payment */}
                <div>
                  <h4 className="font-medium mb-3">Pay with Credit Card (Stripe - Demo)</h4>
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6"
                    onClick={handleStripePayment}
                    disabled={!selectedCompany || processing}
                  >
                    {processing ? "Processing..." : "Pay $149 with Credit Card (Demo)"}
                  </Button>
                </div>

                {/* PayPal Payment */}
                <div>
                  <h4 className="font-medium mb-3">Pay with PayPal (Real Payment)</h4>
                  <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg min-h-[80px] flex items-center justify-center">
                    {paypalStatus === "loading" && (
                      <div className="text-blue-600 text-sm flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        Loading PayPal SDK...
                      </div>
                    )}

                    {paypalStatus === "error" && (
                      <div className="text-red-600 text-sm flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        PayPal failed to load. Please try refreshing the page.
                      </div>
                    )}

                    {paypalStatus === "ready" && !selectedCompany && (
                      <p className="text-sm text-gray-500 text-center">
                        Please select a company first to enable PayPal payment
                      </p>
                    )}

                    <div
                      id="paypal-container-3MQXSCA287GD6"
                      className={`w-full ${paypalStatus !== "ready" || !selectedCompany ? "hidden" : ""}`}
                    />
                  </div>
                </div>

                {/* Security Note */}
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <Shield className="h-4 w-4" />
                  <span>Secure payment processing powered by Stripe and PayPal</span>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  You'll get immediate access to the snapshot overview. The full comprehensive report will be delivered
                  within 24 hours.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
