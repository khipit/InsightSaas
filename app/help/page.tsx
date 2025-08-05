import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, FileText, CreditCard, Users } from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
            <p className="text-xl text-gray-600">Find answers to common questions about KHIP</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="h-8 w-8 text-emerald-600 mb-2" />
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>Learn how to use KHIP reports</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• How to start your free trial</li>
                  <li>• Understanding report types</li>
                  <li>• Navigating the dashboard</li>
                  <li>• Downloading reports</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CreditCard className="h-8 w-8 text-emerald-600 mb-2" />
                <CardTitle>Billing & Payments</CardTitle>
                <CardDescription>Payment and subscription help</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Payment methods accepted</li>
                  <li>• Subscription management</li>
                  <li>• Refund policy</li>
                  <li>• Tax information</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-8 w-8 text-emerald-600 mb-2" />
                <CardTitle>Account Management</CardTitle>
                <CardDescription>Manage your KHIP account</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Creating an account</li>
                  <li>• Password reset</li>
                  <li>• Profile settings</li>
                  <li>• Account deletion</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <MessageCircle className="h-8 w-8 text-emerald-600 mb-2" />
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>Get personalized help</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">Need more help? Our support team is here for you.</p>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700" asChild>
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What is included in the free trial?</h3>
                <p className="text-gray-600 text-sm">
                  The free trial includes one Snapshot report for any Korean listed company. You'll get basic company
                  information, financial snapshot, and recent news headlines.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How quickly will I receive my report?</h3>
                <p className="text-gray-600 text-sm">
                  Snapshot reports are generated instantly. Single Insight reports are delivered within 24 hours. Custom
                  reports timing varies based on scope.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I cancel my subscription anytime?</h3>
                <p className="text-gray-600 text-sm">
                  Yes, you can cancel your Snapshot Plan subscription at any time through your account dashboard or by
                  contacting support.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600 text-sm">
                  We accept PayPal for subscriptions and major credit cards through Stripe for one-time purchases.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
                <p className="text-gray-600 text-sm">
                  All payments are final and non-refundable once services are activated. Please review our refund policy
                  for complete details.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
