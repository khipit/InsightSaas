"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft, Send, CheckCircle, Clock, Star, CreditCard, AlertCircle } from "lucide-react"

declare global {
  interface Window {
    paypal?: any
  }
}

export default function CustomRequestPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    researchScope: "",
    timeline: "",
    budget: "",
    additionalInfo: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [paypalStatus, setPaypalStatus] = useState<"loading" | "ready" | "error">("loading")
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  const addDebugInfo = (info: string) => {
    setDebugInfo((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${info}`])
    console.log("PayPal Debug:", info)
  }

  useEffect(() => {
    // Load PayPal SDK dynamically
    const loadPayPalSDK = () => {
      addDebugInfo("Starting PayPal SDK load for custom report...")

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
      if (!window.paypal) {
        addDebugInfo("window.paypal not available for rendering")
        return
      }

      addDebugInfo("Attempting to render custom report PayPal button...")

      try {
        const container = document.getElementById("paypal-container-BLKS5RT63CQNA")
        if (!container) {
          addDebugInfo("❌ Custom report PayPal container not found")
          return
        }

        // Clear existing content
        container.innerHTML = ""

        window.paypal
          .HostedButtons({
            hostedButtonId: "BLKS5RT63CQNA",
          })
          .render("#paypal-container-BLKS5RT63CQNA")
          .then(() => {
            addDebugInfo("✅ Custom report PayPal button rendered successfully!")
          })
          .catch((error: any) => {
            addDebugInfo(`❌ Custom report PayPal render error: ${error.message || error}`)
            setPaypalStatus("error")
          })
      } catch (error: any) {
        addDebugInfo(`❌ Custom report PayPal integration error: ${error.message || error}`)
        setPaypalStatus("error")
      }
    }

    loadPayPalSDK()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 2000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="border-emerald-200 bg-emerald-50">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-emerald-800">Request Submitted Successfully!</CardTitle>
                <CardDescription className="text-emerald-600">
                  Thank you for your custom research request
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-emerald-700">
                    Our research team will review your request and get back to you within 24 hours with a detailed quote
                    and timeline.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
                      <Link href="/">Back to Home</Link>
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
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Custom Insight Report</h1>
              <p className="text-gray-600">
                Tailored research based on your needs – risk, disclosure, reputation, multi-company comparison, etc.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Tell Us About Your Research Needs</CardTitle>
                  <CardDescription>
                    Provide details about your custom research requirements and we'll create a tailored solution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="company">Company/Organization</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        placeholder="Your company name (optional)"
                      />
                    </div>

                    <div>
                      <Label htmlFor="researchScope">Research Scope & Questions *</Label>
                      <Textarea
                        id="researchScope"
                        value={formData.researchScope}
                        onChange={(e) => handleInputChange("researchScope", e.target.value)}
                        required
                        rows={4}
                        placeholder="Describe the Korean companies you want to research, specific questions you need answered, and the depth of analysis required..."
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="timeline">Preferred Timeline</Label>
                        <Input
                          id="timeline"
                          value={formData.timeline}
                          onChange={(e) => handleInputChange("timeline", e.target.value)}
                          placeholder="e.g., Within 2 weeks"
                        />
                      </div>
                      <div>
                        <Label htmlFor="budget">Budget Range</Label>
                        <Input
                          id="budget"
                          value={formData.budget}
                          onChange={(e) => handleInputChange("budget", e.target.value)}
                          placeholder="e.g., $500-1000"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="additionalInfo">Additional Information</Label>
                      <Textarea
                        id="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                        rows={3}
                        placeholder="Any additional context, specific requirements, or questions..."
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Submitting Request..."
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Submit Research Request (Free Consultation)
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Order Option */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-800 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Quick Order - $490 USD
                  </CardTitle>
                  <CardDescription className="text-blue-600">
                    Skip the consultation and order your custom report now
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <strong>Immediate Benefits:</strong>
                          <ul className="mt-1 space-y-1">
                            <li>• Access to ALL company snapshots</li>
                            <li>• Custom report within 24 hours</li>
                            <li>• Priority research support</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* PayPal Debug Info */}
                    <div className="bg-yellow-50 p-3 rounded-lg text-xs">
                      <div className="font-medium text-yellow-800 mb-2">
                        PayPal Status: {paypalStatus} | SDK: {window.paypal ? "✅" : "❌"}
                      </div>
                      <div className="max-h-24 overflow-y-auto space-y-1">
                        {debugInfo.slice(-3).map((info, index) => (
                          <div key={index} className="text-yellow-700">
                            {info}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* PayPal Button Container */}
                    <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 min-h-[80px] flex items-center justify-center">
                      {paypalStatus === "loading" && (
                        <div className="text-blue-600 text-sm flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          Loading PayPal SDK...
                        </div>
                      )}

                      {paypalStatus === "error" && (
                        <div className="text-red-600 text-sm flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          PayPal failed to load. Please refresh the page.
                        </div>
                      )}

                      <div
                        id="paypal-container-BLKS5RT63CQNA"
                        className={`w-full ${paypalStatus !== "ready" ? "hidden" : ""}`}
                      />
                    </div>

                    <div className="text-xs text-blue-600 text-center">🔒 Secure payment powered by PayPal</div>
                  </div>
                </CardContent>
              </Card>

              {/* Rest of the sidebar content remains the same */}
              <Card className="border-emerald-200 bg-emerald-50">
                <CardHeader>
                  <CardTitle className="text-emerald-800">Custom Research Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-800">$490+</div>
                      <p className="text-sm text-emerald-600">Starting price</p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Basic custom analysis</span>
                        <span className="font-semibold">$490</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Multi-company comparison</span>
                        <span className="font-semibold">$890+</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Industry deep-dive</span>
                        <span className="font-semibold">$1,290+</span>
                      </div>
                    </div>
                    <p className="text-xs text-emerald-600 mt-4">
                      Final quote will be confirmed after consulting your research scope.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* What's Included */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-emerald-600" />
                    What's Included
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm">Custom research questions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm">Manual expert review</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm">Priority delivery (24 hours)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm">Follow-up Q&A session</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm">Multiple format delivery</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Process */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Our Process
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 text-sm font-semibold">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Consultation</h4>
                        <p className="text-sm text-gray-600">We review your request within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 text-sm font-semibold">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Quote & Timeline</h4>
                        <p className="text-sm text-gray-600">Detailed proposal with pricing</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 text-sm font-semibold">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Research & Delivery</h4>
                        <p className="text-sm text-gray-600">Expert analysis and final report</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
