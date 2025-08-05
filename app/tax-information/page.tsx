import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TaxInformationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Tax Information</CardTitle>
              <p className="text-gray-600">Last updated: December 22, 2024</p>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h2>1. Tax Responsibility</h2>
              <p>Customers are responsible for determining and paying any applicable taxes on their purchases.</p>

              <h2>2. VAT/Sales Tax</h2>
              <p>Prices may include applicable VAT or sales tax depending on your location and local tax laws.</p>

              <h2>3. Business Expenses</h2>
              <p>
                KHIP reports may qualify as business expenses for tax purposes. Consult your tax advisor for specific
                guidance.
              </p>

              <h2>4. Tax Documentation</h2>
              <p>Tax receipts and invoices are available in your account dashboard for download.</p>

              <h2>5. International Customers</h2>
              <p>
                International customers may be subject to additional taxes, duties, or fees imposed by their local
                jurisdiction.
              </p>

              <h2>6. Tax Questions</h2>
              <p>For tax-related questions, contact our billing team at billing@khip.co</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
