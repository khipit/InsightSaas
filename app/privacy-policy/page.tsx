import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Privacy Policy</CardTitle>
              <p className="text-gray-600">Last updated: December 22, 2024</p>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h2>1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create an account, make a purchase,
                or contact us for support.
              </p>

              <h2>2. How We Use Your Information</h2>
              <p>
                We use the information we collect to provide, maintain, and improve our services, process transactions,
                and communicate with you.
              </p>

              <h2>3. Information Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties without your
                consent, except as described in this policy.
              </p>

              <h2>4. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction.
              </p>

              <h2>5. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at privacy@khip.co</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
