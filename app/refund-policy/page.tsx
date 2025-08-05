import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Refund Policy</CardTitle>
              <p className="text-gray-600">Last updated: December 22, 2024</p>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h2>1. Refund Eligibility</h2>
              <p>
                We offer refunds for reports that are not delivered within 48 hours of purchase or contain significant
                factual errors.
              </p>

              <h2>2. Subscription Refunds</h2>
              <p>
                Monthly subscriptions can be cancelled at any time. Refunds for the current billing period are provided
                on a pro-rated basis.
              </p>

              <h2>3. Custom Research Refunds</h2>
              <p>Custom research projects may be eligible for partial refunds if cancelled before work begins.</p>

              <h2>4. Refund Process</h2>
              <p>To request a refund, contact our support team at support@khip.co with your order details.</p>

              <h2>5. Processing Time</h2>
              <p>Approved refunds will be processed within 5-10 business days to your original payment method.</p>

              <h2>6. Contact Us</h2>
              <p>For refund requests or questions, email us at support@khip.co</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
