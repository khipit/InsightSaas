"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { usePurchases } from "@/components/purchase-provider"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, TrendingUp, ExternalLink, Calendar, Home, Lock } from "lucide-react"

// Mock data for different companies
const COMPANY_DATA: Record<string, any> = {
  "samsung-electronics": {
    nameKorean: "삼성전자",
    nameEnglish: "Samsung Electronics",
    ticker: "005930",
    sector: "Technology",
    marketCap: "₩442.5T",
    exchange: "KOSPI",
    ceo: "Kim Ki-nam (김기남)",
    founded: "1969",
    employees: "267,937",
    headquarters: "Suwon, South Korea",
    businessSegments: {
      "Device Solutions": "57%",
      "Device Experience": "43%",
    },
    financials: {
      revenue: { q3_2024: "₩79.1T", q3_2023: "₩67.4T", change: "+17.4%" },
      operatingProfit: { q3_2024: "₩9.2T", q3_2023: "₩3.3T", change: "+277%" },
      netIncome: { q3_2024: "₩7.8T", q3_2023: "₩2.4T", change: "+225%" },
      operatingMargin: { q3_2024: "11.6%", q3_2023: "4.9%", change: "+6.7%p" },
    },
    keywords: ["AI Chips", "Memory Recovery", "Global Leadership"],
    color: "emerald",
  },
  naver: {
    nameKorean: "네이버",
    nameEnglish: "NAVER",
    ticker: "035420",
    sector: "Internet Services",
    marketCap: "₩32.1T",
    exchange: "KOSPI",
    ceo: "Choi Soo-yeon (최수연)",
    founded: "1999",
    employees: "3,249",
    headquarters: "Bundang, South Korea",
    businessSegments: {
      "Search Platform": "45%",
      Commerce: "28%",
      Fintech: "15%",
      "Cloud & Others": "12%",
    },
    financials: {
      revenue: { q3_2024: "₩2.31T", q3_2023: "₩2.19T", change: "+5.5%" },
      operatingProfit: { q3_2024: "₩381B", q3_2023: "₩344B", change: "+10.8%" },
      netIncome: { q3_2024: "₩298B", q3_2023: "₩267B", change: "+11.6%" },
      operatingMargin: { q3_2024: "16.5%", q3_2023: "15.7%", change: "+0.8%p" },
    },
    keywords: ["AI Search", "Cloud Profitability", "Global Expansion"],
    color: "blue",
  },
  kakao: {
    nameKorean: "카카오",
    nameEnglish: "Kakao",
    ticker: "035720",
    sector: "Internet Services",
    marketCap: "₩18.7T",
    exchange: "KOSPI",
    ceo: "Hong Eun-taek (홍은택)",
    founded: "2010",
    employees: "4,567",
    headquarters: "Jeju, South Korea",
    businessSegments: {
      Platform: "52%",
      Content: "28%",
      "Other Biz": "20%",
    },
    financials: {
      revenue: { q3_2024: "₩1.95T", q3_2023: "₩1.81T", change: "+7.7%" },
      operatingProfit: { q3_2024: "₩124B", q3_2023: "₩89B", change: "+39.3%" },
      netIncome: { q3_2024: "₩95B", q3_2023: "₩67B", change: "+41.8%" },
      operatingMargin: { q3_2024: "6.4%", q3_2023: "4.9%", change: "+1.5%p" },
    },
    keywords: ["Platform Recovery", "Content Growth", "AI Integration"],
    color: "yellow",
  },
  "sk-hynix": {
    nameKorean: "SK하이닉스",
    nameEnglish: "SK Hynix",
    ticker: "000660",
    sector: "Semiconductors",
    marketCap: "₩89.4T",
    exchange: "KOSPI",
    ceo: "Kwak Noh-jung (곽노정)",
    founded: "1983",
    employees: "31,562",
    headquarters: "Icheon, South Korea",
    businessSegments: {
      "Memory Solutions": "78%",
      "System IC": "22%",
    },
    financials: {
      revenue: { q3_2024: "₩17.6T", q3_2023: "₩7.3T", change: "+141%" },
      operatingProfit: { q3_2024: "₩7.0T", q3_2023: "-₩1.8T", change: "Turn to profit" },
      netIncome: { q3_2024: "₩5.8T", q3_2023: "-₩1.7T", change: "Turn to profit" },
      operatingMargin: { q3_2024: "39.8%", q3_2023: "-24.7%", change: "+64.5%p" },
    },
    keywords: ["Memory Supercycle", "AI Demand", "HBM Leadership"],
    color: "red",
  },
  "lg-energy": {
    nameKorean: "LG에너지솔루션",
    nameEnglish: "LG Energy Solution",
    ticker: "373220",
    sector: "Battery",
    marketCap: "₩102.3T",
    exchange: "KOSPI",
    ceo: "Kim Dong-myung (김동명)",
    founded: "2020",
    employees: "45,123",
    headquarters: "Seoul, South Korea",
    businessSegments: {
      "EV Battery": "85%",
      "ESS Battery": "15%",
    },
    financials: {
      revenue: { q3_2024: "₩6.8T", q3_2023: "₩5.9T", change: "+15.3%" },
      operatingProfit: { q3_2024: "₩448B", q3_2023: "₩289B", change: "+55.0%" },
      netIncome: { q3_2024: "₩378B", q3_2023: "₩234B", change: "+61.5%" },
      operatingMargin: { q3_2024: "6.6%", q3_2023: "4.9%", change: "+1.7%p" },
    },
    keywords: ["EV Growth", "Battery Innovation", "Global Expansion"],
    color: "purple",
  },
}

export default function ReportViewPage() {
  const { user, loading } = useAuth()
  const { hasAccessToCompany, getPurchasesByUser } = usePurchases()
  const router = useRouter()
  const params = useParams()
  const reportId = params.id as string

  const [companyData, setCompanyData] = useState<any>(null)
  const [reportLoading, setReportLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const [purchase, setPurchase] = useState<any>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/reports/" + reportId)
      return
    }

    if (user && reportId) {
      setReportLoading(true)

      // Find the purchase by ID
      const userPurchases = getPurchasesByUser(user.id)
      const foundPurchase = userPurchases.find((p) => p.id === reportId)

      if (foundPurchase) {
        setPurchase(foundPurchase)
        setHasAccess(true)

        // Get company data based on purchase
        const companyId = foundPurchase.companyId
        const companyInfo = COMPANY_DATA[companyId] || COMPANY_DATA["samsung-electronics"]
        setCompanyData(companyInfo)
      } else {
        setHasAccess(false)
      }

      setReportLoading(false)
    }
  }, [user, loading, router, reportId, getPurchasesByUser])

  if (loading || reportLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading report...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have access to this report.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              This report is only available to customers who have purchased it.
            </p>
            <div className="flex gap-2 justify-center">
              <Button asChild>
                <Link href="/order/single-report">Order Report</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/my-reports">My Reports</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!companyData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Report Not Found</CardTitle>
            <CardDescription>The requested report could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/my-reports">Back to My Reports</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const colorClasses = {
    emerald: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-800",
      badge: "bg-emerald-600",
      accent: "text-emerald-600",
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      badge: "bg-blue-600",
      accent: "text-blue-600",
    },
    yellow: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-800",
      badge: "bg-yellow-600",
      accent: "text-yellow-600",
    },
    red: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      badge: "bg-red-600",
      accent: "text-red-600",
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-800",
      badge: "bg-purple-600",
      accent: "text-purple-600",
    },
  }

  const colors = colorClasses[companyData.color as keyof typeof colorClasses] || colorClasses.emerald

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/my-reports">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reports
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {purchase?.type === "single-report" ? "Snapshot Report" : "Report"}
            </h1>
            <p className="text-gray-600">
              {purchase?.type === "single-report"
                ? "Available immediately while your full report is being prepared"
                : "Generated from your dashboard"}
            </p>
          </div>
        </div>

        {/* Purchase Status Banner */}
        {purchase?.type === "single-report" && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800">Snapshot Report Available</h3>
                    <p className="text-sm text-blue-700">
                      {purchase.status === "pending"
                        ? "Your full comprehensive report is being prepared and will be ready within 24 hours."
                        : "Your full comprehensive report is ready for download!"}
                    </p>
                  </div>
                </div>
                {purchase.status === "delivered" && purchase.reportUrl && (
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Download className="mr-2 h-4 w-4" />
                    Download Full Report
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Report Header */}
        <Card className={`mb-8 ${colors.border}`}>
          <CardHeader className={colors.bg}>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className={`text-3xl ${colors.text} mb-2`}>
                  {companyData.nameKorean} ({companyData.nameEnglish})
                </CardTitle>
                <CardDescription className={`text-lg ${colors.accent}`}>
                  {companyData.exchange}: {companyData.ticker} • {companyData.sector}
                </CardDescription>
                <div className="flex items-center gap-4 mt-4">
                  <Badge className={`${colors.bg} ${colors.text}`}>Market Cap: {companyData.marketCap}</Badge>
                  <Badge className="bg-green-100 text-green-800">{companyData.exchange} Large Cap</Badge>
                  <Badge className="bg-purple-100 text-purple-800">{companyData.sector}</Badge>
                </div>
              </div>
              <div className="text-right">
                <Badge className={`${colors.badge} text-white mb-2`}>
                  {purchase?.type === "single-report" ? "Snapshot Report" : "Report"}
                </Badge>
                <p className="text-sm text-gray-500">Generated: {new Date().toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">Report ID: {reportId}</p>
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
                  <TrendingUp className={`h-5 w-5 ${colors.accent} mr-2`} />
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
                        <span>{companyData.ceo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Founded</span>
                        <span>{companyData.founded}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Employees</span>
                        <span>{companyData.employees}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Headquarters</span>
                        <span>{companyData.headquarters}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Business Segments</h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(companyData.businessSegments).map(([segment, percentage]) => (
                        <div key={segment} className="flex justify-between">
                          <span className="text-gray-600">{segment}</span>
                          <span className="font-semibold">{percentage}</span>
                        </div>
                      ))}
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
                        <td className="text-right py-2">{companyData.financials.revenue.q3_2024}</td>
                        <td className="text-right py-2">{companyData.financials.revenue.q3_2023}</td>
                        <td className="text-right py-2 text-green-600">{companyData.financials.revenue.change}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium">Operating Profit</td>
                        <td className="text-right py-2">{companyData.financials.operatingProfit.q3_2024}</td>
                        <td className="text-right py-2">{companyData.financials.operatingProfit.q3_2023}</td>
                        <td className="text-right py-2 text-green-600">
                          {companyData.financials.operatingProfit.change}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium">Net Income</td>
                        <td className="text-right py-2">{companyData.financials.netIncome.q3_2024}</td>
                        <td className="text-right py-2">{companyData.financials.netIncome.q3_2023}</td>
                        <td className="text-right py-2 text-green-600">{companyData.financials.netIncome.change}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium">Operating Margin</td>
                        <td className="text-right py-2">{companyData.financials.operatingMargin.q3_2024}</td>
                        <td className="text-right py-2">{companyData.financials.operatingMargin.q3_2023}</td>
                        <td className="text-right py-2 text-green-600">
                          {companyData.financials.operatingMargin.change}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* DART Disclosure Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Recent DART Disclosures (3-Line Summary)</CardTitle>
                <CardDescription>Key regulatory filings from the past 3 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className={`${colors.bg} p-4 rounded-lg`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className={`font-semibold ${colors.text}`}>Q3 2024 Earnings Report</h4>
                      <span className={`text-xs ${colors.accent}`}>Oct 31, 2024</span>
                    </div>
                    <div className={`text-sm ${colors.text.replace("800", "700")} space-y-1`}>
                      <p>• Strong quarterly performance with significant revenue growth</p>
                      <p>• Operating profit margins improved across all business segments</p>
                      <p>• Positive outlook for Q4 2024 and full year guidance raised</p>
                    </div>
                    <Link
                      href="#"
                      className={`inline-flex items-center text-xs ${colors.accent} hover:${colors.text} mt-2`}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View DART Filing
                    </Link>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-green-800">Strategic Investment Announcement</h4>
                      <span className="text-xs text-green-600">Nov 15, 2024</span>
                    </div>
                    <div className="text-sm text-green-700 space-y-1">
                      <p>• Major investment in next-generation technology development</p>
                      <p>• Partnership agreements with global technology leaders</p>
                      <p>• Expected to drive long-term growth and market expansion</p>
                    </div>
                    <Link
                      href="#"
                      className="inline-flex items-center text-xs text-green-600 hover:text-green-800 mt-2"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View DART Filing
                    </Link>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-blue-800">Dividend Declaration</h4>
                      <span className="text-xs text-blue-600">Dec 10, 2024</span>
                    </div>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>• Board approved increased dividend reflecting strong cash flow</p>
                      <p>• Dividend yield improved compared to previous year</p>
                      <p>• Ex-dividend date scheduled for end of December 2024</p>
                    </div>
                    <Link href="#" className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 mt-2">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View DART Filing
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* News Headlines */}
            <Card>
              <CardHeader>
                <CardTitle>Recent News Headlines</CardTitle>
                <CardDescription>Key news from the past month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      title: `${companyData.nameEnglish} Reports Strong Q3 Performance`,
                      description: "Company exceeds analyst expectations with robust growth across key business areas",
                      date: "Dec 18, 2024",
                      source: "Korea Economic Daily",
                    },
                    {
                      title: `${companyData.nameEnglish} Expands Global Operations`,
                      description: "Strategic investments in international markets drive future growth prospects",
                      date: "Dec 10, 2024",
                      source: "Maeil Business",
                    },
                    {
                      title: `Innovation Leadership in ${companyData.sector}`,
                      description: "Company maintains competitive edge through continued R&D investments",
                      date: "Nov 28, 2024",
                      source: "Digital Times",
                    },
                    {
                      title: `${companyData.nameEnglish} Sustainability Initiative`,
                      description: "New environmental and social governance programs launched",
                      date: "Nov 15, 2024",
                      source: "The Korea Herald",
                    },
                  ].map((news, index) => (
                    <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                      <Calendar className="h-4 w-4 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{news.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{news.description}</p>
                        <span className="text-xs text-gray-500">
                          {news.date} • {news.source}
                        </span>
                      </div>
                    </div>
                  ))}
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
                  {companyData.keywords.map((keyword: string, index: number) => (
                    <div key={index} className={`${colors.bg} p-3 rounded-lg`}>
                      <h4 className={`font-semibold ${colors.text}`}>{keyword}</h4>
                      <p className={`text-sm ${colors.text.replace("800", "700")} mt-1`}>
                        Key strategic focus area driving business growth
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* DART Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Direct DART Links</CardTitle>
                <CardDescription>Quick access to official filings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    "Q3 2024 Financial Report",
                    "Business Report (Annual)",
                    "Major Investment Disclosure",
                    "Dividend Declaration",
                  ].map((linkText, index) => (
                    <Link
                      key={index}
                      href="#"
                      className="flex items-center justify-between p-2 rounded hover:bg-gray-50 text-sm"
                    >
                      <span>{linkText}</span>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className={`${colors.border} ${colors.bg}`}>
              <CardHeader>
                <CardTitle className={colors.text}>Report Actions</CardTitle>
                <CardDescription className={colors.accent}>Download or share this report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className={`w-full ${colors.badge} hover:${colors.badge}/90`}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                  {purchase?.status === "delivered" && purchase?.reportUrl && (
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                      <Download className="mr-2 h-4 w-4" />
                      Download Full Report
                    </Button>
                  )}
                  <Button variant="outline" className={`w-full border-${colors.accent} ${colors.accent}`} asChild>
                    <Link href="/order/single-report">Order Another Report</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Actions */}
        <Card className="mt-12">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4">
              {purchase?.type === "single-report" && purchase?.status === "pending"
                ? "Your Full Report is Being Prepared"
                : "Need More Detailed Analysis?"}
            </h2>
            <p className="text-gray-600 mb-6">
              {purchase?.type === "single-report" && purchase?.status === "pending"
                ? "Your comprehensive insight report with risk assessment and English translation will be ready within 24 hours. You'll receive an email notification when it's available."
                : "Upgrade to our Single Insight Report for comprehensive analysis including risk assessment and English translation."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {purchase?.type !== "single-report" && (
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" asChild>
                  <Link href="/order/single-report">Order Single Report - $149</Link>
                </Button>
              )}
              <Button size="lg" variant="outline" asChild>
                <Link href="/my-reports">Back to My Reports</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
