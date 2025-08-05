import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Building, Database, AlertTriangle, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function SampleCustomPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Report Header */}
        <Card className="mb-8 border-emerald-200">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-white">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl text-emerald-800 mb-2">LG Group Comprehensive Analysis</CardTitle>
                <CardDescription className="text-lg text-emerald-600">
                  Multi-Company Analysis • Electronics, Chemicals, Energy • 4 Major Subsidiaries
                </CardDescription>
                <div className="flex items-center gap-4 mt-4">
                  <Badge className="bg-emerald-100 text-emerald-800">Combined Revenue: ₩186.7T</Badge>
                  <Badge className="bg-emerald-200 text-emerald-900">Global Conglomerate</Badge>
                  <Badge className="bg-emerald-300 text-emerald-900">ESG Leader</Badge>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-emerald-600 text-white mb-2">Custom Insight Report</Badge>
                <p className="text-sm text-gray-500">Generated: Dec 22, 2024</p>
                <p className="text-sm text-gray-500">Report ID: KHIP-LG-20241222</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Group Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 text-emerald-600 mr-2" />
                  LG Group Structure & Analysis Scope
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Analysis Coverage</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                          <h5 className="font-medium text-emerald-800">LG Electronics (066570)</h5>
                          <p className="text-sm text-emerald-600">Home appliances, mobile, automotive components</p>
                          <p className="text-xs text-emerald-500">Revenue: ₩84.5T (2023)</p>
                        </div>
                        <div className="bg-emerald-100 p-3 rounded-lg border border-emerald-300">
                          <h5 className="font-medium text-emerald-800">LG Chem (051910)</h5>
                          <p className="text-sm text-emerald-600">Chemicals, batteries, advanced materials</p>
                          <p className="text-xs text-emerald-500">Revenue: ₩50.2T (2023)</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-emerald-200 p-3 rounded-lg border border-emerald-400">
                          <h5 className="font-medium text-emerald-800">LG Energy Solution (373220)</h5>
                          <p className="text-sm text-emerald-600">EV batteries, energy storage systems</p>
                          <p className="text-xs text-emerald-500">Revenue: ₩31.2T (2023)</p>
                        </div>
                        <div className="bg-emerald-300 p-3 rounded-lg border border-emerald-500">
                          <h5 className="font-medium text-emerald-800">LG Display (034220)</h5>
                          <p className="text-sm text-emerald-600">OLED, LCD panels, flexible displays</p>
                          <p className="text-xs text-emerald-500">Revenue: ₩20.8T (2023)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advanced DART Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 text-emerald-600 mr-2" />
                  Advanced DART Disclosure Analysis
                </CardTitle>
                <CardDescription>Comprehensive regulatory filing analysis beyond basic summaries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-emerald-800 mb-3">Corporate Governance Structure</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium mb-2">Board Composition (LG Corp)</h5>
                        <ul className="space-y-1 text-emerald-700">
                          <li>• Total Directors: 9 (5 Independent, 4 Internal)</li>
                          <li>• Independent Director Ratio: 55.6%</li>
                          <li>• Average Tenure: 3.2 years</li>
                          <li>• Female Directors: 2 (22.2%)</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Executive Compensation</h5>
                        <ul className="space-y-1 text-emerald-700">
                          <li>• CEO Total Compensation: ₩3.2B (2023)</li>
                          <li>• Performance-linked: 65%</li>
                          <li>• ESG Metrics Weight: 20%</li>
                          <li>• Long-term Incentive: 40%</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-emerald-800 mb-3">Related Party Transactions</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-emerald-300">
                            <th className="text-left py-2">Transaction Type</th>
                            <th className="text-right py-2">Amount (₩B)</th>
                            <th className="text-right py-2">% of Revenue</th>
                            <th className="text-right py-2">Approval Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-emerald-200">
                            <td className="py-2">Inter-company Sales</td>
                            <td className="text-right py-2">12,450</td>
                            <td className="text-right py-2">6.7%</td>
                            <td className="text-right py-2 text-emerald-600">Board Approved</td>
                          </tr>
                          <tr className="border-b border-emerald-200">
                            <td className="py-2">Shared Services</td>
                            <td className="text-right py-2">2,890</td>
                            <td className="text-right py-2">1.5%</td>
                            <td className="text-right py-2 text-emerald-600">Audit Committee</td>
                          </tr>
                          <tr className="border-b border-emerald-200">
                            <td className="py-2">Technology Licensing</td>
                            <td className="text-right py-2">1,230</td>
                            <td className="text-right py-2">0.7%</td>
                            <td className="text-right py-2 text-emerald-600">Independent Valuation</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-emerald-200 p-4 rounded-lg">
                    <h4 className="font-semibold text-emerald-800 mb-3">Capital Allocation & Investment Plans</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium mb-2">2024-2026 CAPEX Plan</h5>
                        <div className="space-y-2 text-sm text-emerald-700">
                          <div className="flex justify-between">
                            <span>Battery Manufacturing</span>
                            <span className="font-semibold">₩15.2T</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Display Technology</span>
                            <span className="font-semibold">₩8.9T</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Chemical Plants</span>
                            <span className="font-semibold">₩6.7T</span>
                          </div>
                          <div className="flex justify-between">
                            <span>R&D Facilities</span>
                            <span className="font-semibold">₩4.1T</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Debt Structure Analysis</h5>
                        <div className="space-y-2 text-sm text-emerald-700">
                          <div className="flex justify-between">
                            <span>Total Debt</span>
                            <span className="font-semibold">₩28.4T</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Net Debt/EBITDA</span>
                            <span className="font-semibold">1.8x</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Average Maturity</span>
                            <span className="font-semibold">4.2 years</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Credit Rating</span>
                            <span className="font-semibold">A+ (S&P)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Public Data Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 text-emerald-600 mr-2" />
                  Public Data Integration & Industry Analysis
                </CardTitle>
                <CardDescription>Government and regulatory data analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-emerald-800 mb-3">
                      🏛️ Ministry of Trade, Industry & Energy (MOTIE) Data
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium text-emerald-700 mb-2">K-Battery Initiative Participation</h5>
                        <p className="text-sm text-emerald-600 mb-2">
                          LG Energy Solution selected as core partner in Korea's ₩40T battery ecosystem development plan
                          (2021-2030). Government commitment includes:
                        </p>
                        <ul className="text-sm text-emerald-600 space-y-1 ml-4">
                          <li>• R&D tax credits: 40% for battery technology development</li>
                          <li>• Infrastructure support: ₩8.2T for supply chain development</li>
                          <li>• Raw material security: Strategic partnerships with Australia, Chile</li>
                          <li>• Workforce development: 40,000 skilled workers by 2030</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-emerald-700 mb-2">Green New Deal Alignment</h5>
                        <p className="text-sm text-emerald-600">
                          LG Group companies allocated ₩12.4T in government green financing programs. Key projects
                          include carbon-neutral manufacturing facilities and renewable energy integration.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-emerald-800 mb-3">
                      📊 Korea Development Bank (KDB) Industrial Analysis
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-emerald-700 mb-2">Battery Industry Outlook</h5>
                        <div className="text-sm text-emerald-600 space-y-1">
                          <p>• Global market size: $120B (2023) → $279B (2030)</p>
                          <p>• Korean market share target: 40% by 2030</p>
                          <p>• LG Energy Solution position: #2 globally (23.7%)</p>
                          <p>• Key risk: Chinese competition intensifying</p>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-emerald-700 mb-2">Chemical Industry Transition</h5>
                        <div className="text-sm text-emerald-600 space-y-1">
                          <p>• Traditional petrochemicals: -3.2% CAGR (2024-2030)</p>
                          <p>• Specialty chemicals: +8.9% CAGR (2024-2030)</p>
                          <p>• LG Chem specialty ratio: 45% (target: 60% by 2027)</p>
                          <p>• Bio-based materials investment: ₩3.2T committed</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-200 p-4 rounded-lg">
                    <h4 className="font-semibold text-emerald-800 mb-3">🏢 Fair Trade Commission (FTC) Monitoring</h4>
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-emerald-700 mb-2">Conglomerate Regulation Compliance</h5>
                        <p className="text-sm text-emerald-600 mb-2">
                          LG Group subject to enhanced monitoring under revised Fair Trade Act. Key compliance areas:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4 text-sm text-emerald-600">
                          <div>
                            <p>• Cross-shareholding ratio: 23.4% (limit: 25%)</p>
                            <p>• Circular shareholding: Prohibited (compliant)</p>
                            <p>• Related party transaction disclosure: Enhanced</p>
                          </div>
                          <div>
                            <p>• Independent director ratio: 55.6% (min: 50%)</p>
                            <p>• Audit committee independence: 100%</p>
                            <p>• Executive compensation disclosure: Full</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-yellow-100 p-3 rounded border border-yellow-300">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                          <div>
                            <h6 className="font-medium text-yellow-800">Regulatory Watch</h6>
                            <p className="text-sm text-yellow-700">
                              FTC reviewing cross-shareholding structure following 2024 regulation updates. Potential
                              restructuring required by 2026.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-300 p-4 rounded-lg">
                    <h4 className="font-semibold text-emerald-800 mb-3">🌍 Export-Import Bank Trade Data</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-emerald-500">
                            <th className="text-left py-2">Company</th>
                            <th className="text-right py-2">Export Value (₩T)</th>
                            <th className="text-right py-2">Top Market</th>
                            <th className="text-right py-2">Growth Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-emerald-400">
                            <td className="py-2">LG Electronics</td>
                            <td className="text-right py-2">28.4</td>
                            <td className="text-right py-2">North America</td>
                            <td className="text-right py-2 text-emerald-700">+8.2%</td>
                          </tr>
                          <tr className="border-b border-emerald-400">
                            <td className="py-2">LG Energy Solution</td>
                            <td className="text-right py-2">18.9</td>
                            <td className="text-right py-2">North America</td>
                            <td className="text-right py-2 text-emerald-700">+34.5%</td>
                          </tr>
                          <tr className="border-b border-emerald-400">
                            <td className="py-2">LG Chem</td>
                            <td className="text-right py-2">15.2</td>
                            <td className="text-right py-2">China</td>
                            <td className="text-right py-2 text-red-600">-12.1%</td>
                          </tr>
                          <tr>
                            <td className="py-2">LG Display</td>
                            <td className="text-right py-2">12.7</td>
                            <td className="text-right py-2">China</td>
                            <td className="text-right py-2 text-red-600">-18.3%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comprehensive News Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Comprehensive News Analysis by Category</CardTitle>
                <CardDescription>
                  Total articles analyzed: 2,847 across all subsidiaries | Risk articles: 89 | Sentiment: Mixed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-emerald-800 mb-2">🔋 EV Battery & Energy (LG Energy Solution)</h4>
                    <p className="text-sm text-emerald-700 mb-3">
                      Strong momentum in North American market with major OEM partnerships. New gigafactory
                      announcements in Michigan and Arizona. However, pricing pressure from Chinese competitors
                      intensifying.
                    </p>
                    <div className="space-y-2">
                      <div className="text-xs">
                        <a href="#" className="text-emerald-600 hover:underline flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          "LG Energy Solution wins $7B GM battery contract extension" - Reuters, Dec 15, 2024
                        </a>
                      </div>
                      <div className="text-xs">
                        <a href="#" className="text-emerald-600 hover:underline flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          "Michigan gigafactory to create 2,600 jobs, production starts 2025" - Detroit News, Nov 28,
                          2024
                        </a>
                      </div>
                      <div className="text-xs">
                        <a href="#" className="text-red-600 hover:underline flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          "Chinese battery makers cut prices 20%, pressure on Korean suppliers" - Nikkei, Dec 8, 2024
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-emerald-800 mb-2">📱 Consumer Electronics (LG Electronics)</h4>
                    <p className="text-sm text-emerald-700 mb-3">
                      Premium appliance strategy showing results with strong margins in North America and Europe. OLED
                      TV market leadership maintained despite increased competition.
                    </p>
                    <div className="space-y-2">
                      <div className="text-xs">
                        <a href="#" className="text-emerald-600 hover:underline flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          "LG OLED TV sales up 25% in premium segment" - Korea Herald, Dec 12, 2024
                        </a>
                      </div>
                      <div className="text-xs">
                        <a href="#" className="text-emerald-600 hover:underline flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          "LG appliances gain market share in US premium segment" - Appliance Magazine, Nov 30, 2024
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-2">⚠️ Group-Wide Risk Issues</h4>
                    <p className="text-sm text-red-700 mb-3">
                      ESG concerns around battery supply chain, trade tensions affecting China operations, and
                      regulatory scrutiny on conglomerate governance structure.
                    </p>
                    <div className="space-y-2">
                      <div className="text-xs">
                        <a href="#" className="text-red-600 hover:underline flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          "LG Energy faces supply chain audit over Congo cobalt sourcing" - Financial Times, Dec 10,
                          2024
                        </a>
                      </div>
                      <div className="text-xs">
                        <a href="#" className="text-red-600 hover:underline flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          "Korea Fair Trade Commission reviews LG Group cross-shareholding" - Yonhap, Nov 22, 2024
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
            {/* Investment Thesis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Investment Thesis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <h4 className="font-semibold text-emerald-800">EV Megatrend</h4>
                    <p className="text-sm text-emerald-700 mt-1">
                      Well-positioned across EV value chain from batteries to components
                    </p>
                  </div>
                  <div className="bg-emerald-200 p-3 rounded-lg">
                    <h4 className="font-semibold text-emerald-800">Premium Strategy</h4>
                    <p className="text-sm text-emerald-700 mt-1">
                      Successful premiumization in appliances and displays
                    </p>
                  </div>
                  <div className="bg-emerald-300 p-3 rounded-lg">
                    <h4 className="font-semibold text-emerald-800">Technology Leadership</h4>
                    <p className="text-sm text-emerald-700 mt-1">OLED, battery chemistry, and smart home innovations</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800">Execution Risk</h4>
                    <p className="text-sm text-red-700 mt-1">Complex group structure and cyclical end markets</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Card */}
            <Card className="border-emerald-200 bg-emerald-50">
              <CardHeader>
                <CardTitle className="text-emerald-800">Custom Research</CardTitle>
                <CardDescription className="text-emerald-600">
                  This is a sample custom analysis. Get tailored research for your specific needs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700" asChild>
                    <Link href="/custom-request">
                      <FileText className="mr-2 h-4 w-4" />
                      Request Custom Analysis
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-100"
                    asChild
                  >
                    <Link href="/order/single-report">Single Company Report</Link>
                  </Button>
                </div>
                <p className="text-xs text-emerald-600 mt-3 text-center">
                  Multi-company • Industry analysis • Public data integration
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA */}
        <Card className="mt-12 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Need Multi-Company or Industry Analysis?</h2>
            <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
              This sample shows our Custom Insight capabilities. Get comprehensive analysis covering multiple companies,
              industry trends, and public data integration tailored to your research needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100" asChild>
                <Link href="/custom-request">Request Custom Research</Link>
              </Button>
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100" asChild>
                <Link href="/order/single-report">Single Company - $149</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
