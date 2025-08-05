import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Terms of Service</CardTitle>
              <p className="text-gray-600">Last updated: December 22, 2024</p>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using KHIP services, you accept and agree to be bound by the terms and provision of
                this agreement.
              </p>

              <h2>2. Service Description</h2>
              <p>
                KHIP provides Korean corporate intelligence reports and analysis based on publicly available
                information.
              </p>

              <h2>3. User Responsibilities</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account and for all activities that
                occur under your account.
              </p>

              <h2>4. Disclaimer</h2>
              <p>
                The information provided is for informational purposes only and should not be considered as investment
                advice.
              </p>

              <h2>5. Limitation of Liability</h2>
              <p>KHIP shall not be liable for any indirect, incidental, special, consequential, or punitive damages.</p>

              <h2>6. Contact Information</h2>
              <p>For questions about these Terms of Service, contact us at legal@khip.co</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
