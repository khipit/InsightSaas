import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, AlertTriangle, Users, Building } from "lucide-react"
import Link from "next/link"

export default function SampleReportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Report Header */}
        <Card className="mb-8 border-emerald-200">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-white">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl text-emerald-800 mb-2">Samsung Electronics Co., Ltd.</CardTitle>
                <CardDescription className="text-lg text-emerald-600">
                  삼성전자주식회사 • KOSPI: 005930 • Technology Hardware
                </CardDescription>
                <div className="flex items-center gap-4 mt-4">
                  <Badge className="bg-emerald-100 text-emerald-800">Market Cap: ₩441.2T</Badge>
                  <Badge className="bg-blue-100 text-blue-800">KOSPI Large Cap</Badge>
                  <Badge className="bg-purple-100 text-purple-800">Global Leader</Badge>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-emerald-600 text-white mb-2">Single Insight Report</Badge>
                <p className="text-sm text-gray-500">Generated: Dec 22, 2024</p>
                <p className="text-sm text-gray-500">Report ID: KHIP-SE-20241222</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Company Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 text-emerald-600 mr-2" />
                  Company Profile & History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Basic Information</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Korean Name</span>
                          <span>삼성전자주식회사</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">English Name</span>
                          <span>Samsung Electronics Co., Ltd.</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Founded</span>
                          <span>January 13, 1969</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Listed</span>
                          <span>June 11, 1975 (KOSPI)</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Headquarters</span>
                          <span>Suwon, South Korea</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Website</span>
                          <span>www.samsung.com</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Employees</span>
                          <span>267,937</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Business Year</span>
                          <span>January - December</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Main Business</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Samsung Electronics is a global leader in technology, opening new possibilities for people
                      everywhere. Through relentless innovation and discovery, we are transforming the worlds of TVs,
                      smartphones, wearable devices, tablets, digital appliances, network systems, and memory, system
                      LSI, foundry and LED solutions.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Key Milestones</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex gap-3">
                        <span className="text-gray-500 w-16">1969</span>
                        <span>Founded as Samsung Electronics</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-gray-500 w-16">1988</span>
                        <span>Launched first mobile phone</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-gray-500 w-16">2010</span>
                        <span>Became world's largest smartphone manufacturer</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-gray-500 w-16">2017</span>
                        <span>Became world's largest semiconductor company</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Consolidated Financial Statements (2024)</CardTitle>
                <CardDescription>Key financial metrics from latest annual report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Metric (KRW Trillion)</th>
                        <th className="text-right py-2">2024</th>
                        <th className="text-right py-2">2023</th>
                        <th className="text-right py-2">Change</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-2">
                      <tr className="border-b">
                        <td className="py-2 font-medium">Revenue</td>
                        <td className="text-right py-2">₩258.9</td>
                        <td className="text-right py-2">₩302.2</td>
                        <td className="text-right py-2 text-red-600">-14.3%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium">Operating Profit</td>
                        <td className="text-right py-2">₩15.8</td>
                        <td className="text-right py-2">₩43.4</td>
                        <td className="text-right py-2 text-red-600">-63.6%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium">Net Income</td>
                        <td className="text-right py-2">₩15.0</td>
                        <td className="text-right py-2">₩34.4</td>
                        <td className="text-right py-2 text-red-600">-56.4%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium">Operating Margin</td>
                        <td className="text-right py-2">6.1%</td>
                        <td className="text-right py-2">14.4%</td>
                        <td className="text-right py-2 text-red-600">-8.3%p</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Board of Directors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 text-emerald-600 mr-2" />
                  Board of Directors & Key Executives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3">Inside Directors</h4>
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium">Han Jong-hee (한종희)</h5>
                          <Badge variant="outline">CEO & Vice Chairman</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Education: Seoul National University (Electronics Engineering)
                          <br />
                          Career: Samsung Electronics (1985-present), Former President of Visual Display Business
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium">Kyung Kye-hyun (경계현)</h5>
                          <Badge variant="outline">CEO & President</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Education: Seoul National University (Materials Science)
                          <br />
                          Career: Samsung Electronics (1985-present), Former Head of Device Solutions Division
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Major Shareholders (5%+)</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>National Pension Service</span>
                        <span className="font-semibold">8.51%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Samsung Life Insurance</span>
                        <span className="font-semibold">8.51%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Samsung Electronics Employee Stock Ownership</span>
                        <span className="font-semibold">5.21%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Factors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  Risk Factors & Legal Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">Major Litigation</h4>
                    <div className="text-sm text-red-700 space-y-2">
                      <p>• Patent dispute with Apple Inc. - Ongoing since 2011, multiple jurisdictions</p>
                      <p>• Antitrust investigation by EU Commission regarding semiconductor pricing</p>
                      <p>• Class action lawsuit regarding Galaxy Note 7 battery issues - Settled 2019</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">Regulatory Actions</h4>
                    <div className="text-sm text-yellow-700 space-y-2">
                      <p>• KFTC fine of ₩103.9B for unfair business practices (2020)</p>
                      <p>• US export restrictions on advanced semiconductor technology</p>
                      <p>• Environmental compliance issues at Austin, Texas facility</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Recent Material Changes</h4>
                    <div className="text-sm text-blue-700 space-y-2">
                      <p>• Announced $17B investment in Taylor, Texas semiconductor facility (2024)</p>
                      <p>• Spin-off consideration for foundry business under review</p>
                      <p>• Strategic partnership with Google for AI chip development</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* News Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>News Analysis (3 Months)</CardTitle>
                <CardDescription>
                  Total articles analyzed: 847 | Risk-related articles: 23 | Overall sentiment: Cautiously Optimistic
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Market Performance & Strategy</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Samsung Electronics faces headwinds from memory chip downturn but shows resilience through
                      diversification into AI chips and foundry services. Q3 2024 results exceeded expectations with
                      memory recovery signs.
                    </p>
                    <div className="space-y-2">
                      <div className="text-xs">
                        <a href="#" className="text-blue-600 hover:underline">
                          "Samsung Electronics Q3 profit jumps 277% on memory chip recovery" - Reuters, Oct 31, 2024
                        </a>
                      </div>
                      <div className="text-xs">
                        <a href="#" className="text-blue-600 hover:underline">
                          "Samsung announces $17B Texas chip plant expansion" - Bloomberg, Nov 15, 2024
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">Risk Issues</h4>
                    <p className="text-sm text-red-700 mb-3">
                      Geopolitical tensions affecting China business, US export controls on advanced chips, and
                      competitive pressure from TSMC in foundry business remain key concerns.
                    </p>
                    <div className="space-y-2">
                      <div className="text-xs">
                        <a href="#" className="text-red-600 hover:underline">
                          "Samsung's China revenue drops 60% amid geopolitical tensions" - Financial Times, Dec 5, 2024
                        </a>
                      </div>
                      <div className="text-xs">
                        <a href="#" className="text-red-600 hover:underline">
                          "US considers tighter chip export controls affecting Samsung" - Wall Street Journal, Nov 28,
                          2024
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Innovation & Growth</h4>
                    <p className="text-sm text-green-700 mb-3">
                      Strong progress in AI chip development, successful Galaxy S24 launch with AI features, and
                      expanding partnerships in autonomous driving and 6G technology development.
                    </p>
                    <div className="space-y-2">
                      <div className="text-xs">
                        <a href="#" className="text-green-600 hover:underline">
                          "Samsung's AI chip orders surge 40% in Q4" - Korea Economic Daily, Dec 18, 2024
                        </a>
                      </div>
                      <div className="text-xs">
                        <a href="#" className="text-green-600 hover:underline">
                          "Galaxy AI features drive smartphone market share gains" - TechCrunch, Dec 10, 2024
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Investment Themes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <h4 className="font-semibold text-emerald-800">Memory Recovery</h4>
                    <p className="text-sm text-emerald-700 mt-1">
                      Signs of memory chip market recovery driving optimism
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <h4 className="font-semibold text-blue-800">AI Chip Leadership</h4>
                    <p className="text-sm text-blue-700 mt-1">Strong positioning in AI semiconductor market</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-lg">
                    <h4 className="font-semibold text-red-800">Geopolitical Risk</h4>
                    <p className="text-sm text-red-700 mt-1">China exposure and US export controls remain concerns</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Card */}
            <Card className="border-emerald-200 bg-emerald-50">
              <CardHeader>
                <CardTitle className="text-emerald-800">Get Your Own Report</CardTitle>
                <CardDescription className="text-emerald-600">
                  This is a sample. Order comprehensive analysis for any Korean company.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700" asChild>
                    <Link href="/order/single-report">
                      <FileText className="mr-2 h-4 w-4" />
                      Order Single Report
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-100"
                    asChild
                  >
                    <Link href="/custom-request">Custom Research</Link>
                  </Button>
                </div>
                <p className="text-xs text-emerald-600 mt-3 text-center">Expert review included • 24hr delivery</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA */}
        <Card className="mt-12 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Need Comprehensive Korean Corporate Analysis?</h2>
            <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
              This sample shows our Single Insight Report format. Get expert-reviewed analysis with risk assessment and
              news analysis for any Korean company.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100" asChild>
                <Link href="/order/single-report">Order Report - $149</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-emerald-800" asChild>
                <Link href="/custom-request">Custom Research</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
