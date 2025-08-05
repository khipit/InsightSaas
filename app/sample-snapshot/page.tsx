import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, FileText, Calendar, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function SampleSnapshotPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Report Header */}
        <Card className="mb-8 border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl text-blue-800 mb-2">NAVER Corporation</CardTitle>
                <CardDescription className="text-lg text-blue-600">
                  네이버 주식회사 • KOSPI: 035420 • Internet Services
                </CardDescription>
                <div className="flex items-center gap-4 mt-4">
                  <Badge className="bg-blue-100 text-blue-800">Market Cap: ₩32.1T</Badge>
                  <Badge className="bg-green-100 text-green-800">KOSPI Large Cap</Badge>
                  <Badge className="bg-purple-100 text-purple-800">Tech Platform</Badge>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-blue-600 text-white mb-2">Snapshot Report</Badge>
                <p className="text-sm text-gray-500">Generated: Dec 22, 2024</p>
                <p className="text-sm text-gray-500">Report ID: KHIP-NV-20241222</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Negative News Alert - Prominently Displayed */}
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardHeader>
            <div className="flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
              <div className="text-center">
                <CardTitle className="text-4xl font-bold text-red-800 mb-2">2</CardTitle>
                <CardDescription className="text-xl text-red-600 font-semibold">
                  Negative News Articles (Past 3 Months)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Company Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                  Company Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">CEO</span>
                        <span>Choi Soo-yeon (최수연)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Founded</span>
                        <span>1999</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Employees</span>
                        <span>3,249</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Headquarters</span>
                        <span>Bundang, South Korea</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Business Segments</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Search Platform</span>
                        <span className="font-semibold">45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Commerce</span>
                        <span className="font-semibold">28%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fintech</span>
                        <span className="font-semibold">15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cloud & Others</span>
                        <span className="font-semibold">12%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Snapshot */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Snapshot (Q3 2024)</CardTitle>
                <CardDescription>Key financial metrics at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Metric</th>
                        <th className="text-right py-2">Q3 2024</th>
                        <th className="text-right py-2">Q3 2023</th>
                        <th className="text-right py-2">Change</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-2">
                      <tr className="border-b">
                        <td className="py-2 font-medium">Revenue</td>
                        <td className="text-right py-2">₩2.31T</td>
                        <td className="text-right py-2">₩2.19T</td>
                        <td className="text-right py-2 text-green-600">+5.5%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium">Operating Profit</td>
                        <td className="text-right py-2">₩381B</td>
                        <td className="text-right py-2">₩344B</td>
                        <td className="text-right py-2 text-green-600">+10.8%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium">Net Income</td>
                        <td className="text-right py-2">₩298B</td>
                        <td className="text-right py-2">₩267B</td>
                        <td className="text-right py-2 text-green-600">+11.6%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium">Operating Margin</td>
                        <td className="text-right py-2">16.5%</td>
                        <td className="text-right py-2">15.7%</td>
                        <td className="text-right py-2 text-green-600">+0.8%p</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Disclosure Summary (3-Line) */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Disclosure Summary (3-Line)</CardTitle>
                <CardDescription>Key regulatory filings from the past 3 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-blue-800">Q3 2024 Earnings Report</h4>
                      <span className="text-xs text-blue-600">Oct 31, 2024</span>
                    </div>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>• Revenue increased 5.5% YoY to ₩2.31T driven by search advertising recovery</p>
                      <p>• Commerce platform showed strong growth with 28% increase in transaction volume</p>
                      <p>• Cloud business achieved profitability for the first time with ₩45B operating profit</p>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-green-800">Strategic Partnership Announcement</h4>
                      <span className="text-xs text-green-600">Nov 20, 2024</span>
                    </div>
                    <div className="text-sm text-green-700 space-y-1">
                      <p>• Signed ₩500B cloud infrastructure deal with Samsung Electronics</p>
                      <p>• Partnership includes AI model development and data center services</p>
                      <p>• Expected to contribute ₩150B annually to cloud revenue starting 2025</p>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-purple-800">Dividend Declaration</h4>
                      <span className="text-xs text-purple-600">Dec 15, 2024</span>
                    </div>
                    <div className="text-sm text-purple-700 space-y-1">
                      <p>• Board approved interim dividend of ₩30 per share (vs ₩25 last year)</p>
                      <p>• Total dividend payout of ₩49.2B reflecting strong cash position</p>
                      <p>• Ex-dividend date set for December 30, 2024</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* News Headlines with Negative News Highlighted */}
            <Card>
              <CardHeader>
                <CardTitle>Recent News Headlines (3 Months)</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-red-600 font-semibold">2 Negative Articles Identified</span>
                  <span className="text-gray-500">• Top 3 Recent Headlines</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 pb-3 border-b">
                    <Calendar className="h-4 w-4 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">NAVER's AI Search Engine Gains Market Share</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        New AI-powered search features attract younger users, increasing daily active users by 12%
                      </p>
                      <span className="text-xs text-gray-500">Dec 18, 2024 • Korea Economic Daily</span>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium text-red-900">Privacy Concerns Over Data Collection Practices</h4>
                        <p className="text-sm text-red-700 mt-1">
                          Consumer groups raise concerns about user data collection and storage policies amid regulatory
                          scrutiny
                        </p>
                        <span className="text-xs text-red-600">Nov 28, 2024 • Digital Times</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium text-red-900">Antitrust Investigation into Search Dominance</h4>
                        <p className="text-sm text-red-700 mt-1">
                          Korea Fair Trade Commission launches preliminary investigation into NAVER's search market
                          practices
                        </p>
                        <span className="text-xs text-red-600">Dec 5, 2024 • Yonhap News</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Keywords */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Keywords</CardTitle>
                <CardDescription>3 most important themes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <h4 className="font-semibold text-blue-800">AI Search</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Next-generation search technology driving user engagement
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <h4 className="font-semibold text-green-800">Cloud Profitability</h4>
                    <p className="text-sm text-green-700 mt-1">First profitable quarter marks business model success</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800">Regulatory Risk</h4>
                    <p className="text-sm text-red-700 mt-1">Privacy and antitrust concerns emerging</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Card */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800">Get Your Own Snapshot</CardTitle>
                <CardDescription className="text-blue-600">
                  This is just a sample. Get instant snapshots for any Korean company.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                    <Link href="/start-trial">
                      <FileText className="mr-2 h-4 w-4" />
                      Start Free Trial
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-100" asChild>
                    <Link href="/order/snapshot-plan">Snapshot Plan ($29/mo)</Link>
                  </Button>
                </div>
                <p className="text-xs text-blue-600 mt-3 text-center">Choose from 2,000+ Korean listed companies</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA */}
        <Card className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Instant Korean Corporate Snapshots?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              This sample shows what you get with our Snapshot Plan. Get quick automated summaries for any Korean
              company in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                <Link href="/start-trial">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-800" asChild>
                <Link href="/order/snapshot-plan">Subscribe - $29/month</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
