import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">KHIP</h3>
            <p className="text-gray-400 mb-4">
              AI-powered Korean corporate intelligence platform providing instant insights on Korean companies.
            </p>
            <p className="text-sm text-gray-500">© 2025 KHIP. All rights reserved.</p>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/sample-snapshot" className="hover:text-white transition-colors">
                  Snapshot Reports
                </Link>
              </li>
              <li>
                <Link href="/sample-report" className="hover:text-white transition-colors">
                  Single Insight
                </Link>
              </li>
              <li>
                <Link href="/custom-request" className="hover:text-white transition-colors">
                  Custom Research
                </Link>
              </li>
              <li>
                <Link href="/start-trial" className="hover:text-white transition-colors">
                  Free Trial
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/tax-information" className="hover:text-white transition-colors">
                  Tax Information
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/my-reports" className="hover:text-white transition-colors">
                  My Reports
                </Link>
              </li>
              <li>
                <a href="mailto:support@khip.co" className="hover:text-white transition-colors">
                  support@khip.co
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />

        <div className="text-center text-sm text-gray-500">
          <p>Data sourced from official Korean disclosure systems. Not investment advice.</p>
        </div>
      </div>
    </footer>
  )
}
