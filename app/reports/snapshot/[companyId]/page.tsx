"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { usePurchases } from "@/components/purchase-provider"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Download,
  TrendingUp,
  Calendar,
  Home,
  Lock,
  AlertTriangle,
  CheckCircle,
  Newspaper,
} from "lucide-react"

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
    newsStats: {
      totalArticles: 247,
      negativeArticles: 23,
      neutralArticles: 189,
      positiveArticles: 35,
    },
  },
  celltrion: {
    nameKorean: "셀트리온",
    nameEnglish: "Celltrion",
    ticker: "068270",
    sector: "Biotechnology",
    marketCap: "₩18.9T",
    exchange: "KOSPI",
    ceo: "Seo Jin-seok (서진석)",
    founded: "2002",
    employees: "4,892",
    headquarters: "Incheon, South Korea",
    businessSegments: {
      Biosimilars: "78%",
      "Chemical Drugs": "15%",
      Others: "7%",
    },
    financials: {
      revenue: { q3_2024: "₩2.1T", q3_2023: "₩1.8T", change: "+16.7%" },
      operatingProfit: { q3_2024: "₩456B", q3_2023: "₩389B", change: "+17.2%" },
      netIncome: { q3_2024: "₩398B", q3_2023: "₩334B", change: "+19.2%" },
      operatingMargin: { q3_2024: "21.7%", q3_2023: "21.6%", change: "+0.1%p" },
    },
    keywords: ["Biosimilar Leadership", "Global Expansion", "R&D Innovation"],
    color: "blue",
    newsStats: {
      totalArticles: 134,
      negativeArticles: 8,
      neutralArticles: 112,
      positiveArticles: 14,
    },
  },
  "samsung-electro-mechanics": {
    nameKorean: "삼성전기",
    nameEnglish: "Samsung Electro-Mechanics",
    ticker: "009150",
    sector: "Electronic Components",
    marketCap: "₩12.8T",
    exchange: "KOSPI",
    ceo: "Chang Duck-hyun (장덕현)",
    founded: "1973",
    employees: "23,456",
    headquarters: "Suwon, South Korea",
    businessSegments: {
      "Component Solutions": "65%",
      "Substrate Solutions": "25%",
      "Module Solutions": "10%",
    },
    financials: {
      revenue: { q3_2024: "₩2.8T", q3_2023: "₩2.4T", change: "+16.7%" },
      operatingProfit: { q3_2024: "₩234B", q3_2023: "₩189B", change: "+23.8%" },
      netIncome: { q3_2024: "₩198B", q3_2023: "₩156B", change: "+26.9%" },
      operatingMargin: { q3_2024: "8.4%", q3_2023: "7.9%", change: "+0.5%p" },
    },
    keywords: ["MLCC Leadership", "Automotive Electronics", "5G Components"],
    color: "emerald",
    newsStats: {
      totalArticles: 167,
      negativeArticles: 15,
      neutralArticles: 138,
      positiveArticles: 14,
    },
  },
  "samsung-sdi": {
    nameKorean: "삼성SDI",
    nameEnglish: "Samsung SDI",
    ticker: "006400",
    sector: "Battery & Materials",
    marketCap: "₩58.7T",
    exchange: "KOSPI",
    ceo: "Choi Yoon-ho (최윤호)",
    founded: "1970",
    employees: "28,456",
    headquarters: "Yongin, South Korea",
    businessSegments: {
      "Battery Business": "72%",
      "Electronic Materials": "28%",
    },
    financials: {
      revenue: { q3_2024: "₩5.2T", q3_2023: "₩4.8T", change: "+8.3%" },
      operatingProfit: { q3_2024: "₩312B", q3_2023: "₩278B", change: "+12.2%" },
      netIncome: { q3_2024: "₩267B", q3_2023: "₩234B", change: "+14.1%" },
      operatingMargin: { q3_2024: "6.0%", q3_2023: "5.8%", change: "+0.2%p" },
    },
    keywords: ["EV Battery", "Solid State Battery", "ESS Solutions"],
    color: "blue",
    newsStats: {
      totalArticles: 189,
      negativeArticles: 22,
      neutralArticles: 145,
      positiveArticles: 22,
    },
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
    newsStats: {
      totalArticles: 156,
      negativeArticles: 8,
      neutralArticles: 132,
      positiveArticles: 16,
    },
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
    newsStats: {
      totalArticles: 89,
      negativeArticles: 31,
      neutralArticles: 45,
      positiveArticles: 13,
    },
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
    newsStats: {
      totalArticles: 198,
      negativeArticles: 12,
      neutralArticles: 167,
      positiveArticles: 19,
    },
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
    newsStats: {
      totalArticles: 134,
      negativeArticles: 18,
      neutralArticles: 98,
      positiveArticles: 18,
    },
  },
}

export default function SnapshotReportPage() {
  const { user, loading } = useAuth()
  const { hasSnapshotPlan, hasAccessToCompany, getPurchasesByUser } = usePurchases()
  const router = useRouter()
  const params = useParams()
  const companyId = params.companyId as string

  const [companyData, setCompanyData] = useState<any>(null)
  const [reportLoading, setReportLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const [accessType, setAccessType] = useState<"snapshot-plan" | "single-report" | "trial" | null>(null)

  useEffect(() => {
    console.log("SnapshotReportPage - Effect running", { user, loading, companyId })

    if (!loading && !user) {
      console.log("No user, redirecting to login")
      router.push("/login?redirect=/reports/snapshot/" + companyId)
      return
    }

    if (user && companyId) {
      console.log("Checking access for user:", user.id, "company:", companyId)
      setReportLoading(true)

      // Check if user has snapshot plan (gives access to all companies)
      const hasSnapshot = hasSnapshotPlan(user.id)
      console.log("User has snapshot plan:", hasSnapshot)

      // Check if user has specific company access (single report purchase)
      const hasCompanyAccess = hasAccessToCompany(user.id, companyId)
      console.log("User has company access:", hasCompanyAccess)

      // Get user purchases to determine access type
      const userPurchases = getPurchasesByUser(user.id)
      const companyPurchase = userPurchases.find((p) => p.companyId === companyId && p.type === "single-report")
      const trialPurchase = userPurchases.find((p) => p.type === "trial" && p.status === "completed")

      console.log("User purchases:", userPurchases)
      console.log("Company purchase:", companyPurchase)
      console.log("Trial purchase:", trialPurchase)

      if (hasSnapshot) {
        setHasAccess(true)
        setAccessType("snapshot-plan")
        console.log("Access granted via snapshot plan")
      } else if (trialPurchase) {
        const now = new Date()
        const trialEnd = trialPurchase.trialEndDate ? new Date(trialPurchase.trialEndDate) : null
        if (trialEnd && trialEnd > now) {
          setHasAccess(true)
          setAccessType("trial")
          console.log("Access granted via active trial")
        } else {
          console.log("Trial expired")
          setHasAccess(false)
          setAccessType(null)
        }
      } else if (hasCompanyAccess || companyPurchase) {
        setHasAccess(true)
        setAccessType("single-report")
        console.log("Access granted via single report purchase")
      } else {
        console.log("No access found")
        setHasAccess(false)
        setAccessType(null)
      }

      // Get company data - 중요: companyId에 해당하는 데이터가 없으면 에러 표시
      const companyInfo = COMPANY_DATA[companyId]
      if (!companyInfo) {
        console.error("Company data not found for:", companyId)
        setCompanyData(null)
      } else {
        setCompanyData(companyInfo)
        console.log("Company data loaded:", companyInfo)
      }

      setReportLoading(false)
    }
  }, [user, loading, router, companyId, hasSnapshotPlan, hasAccessToCompany, getPurchasesByUser])

  if (loading || reportLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading snapshot report...</p>
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
            <CardTitle>Access Required</CardTitle>
            <CardDescription>You need access to view this company's snapshot report.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              This report is available with a Snapshot Plan subscription or by purchasing a Single Insight Report for
              this company.
            </p>
            <div className="space-y-2 mb-4">
              <p className="text-xs text-gray-500">Company ID: {companyId}</p>
              <p className="text-xs text-gray-500">User ID: {user?.id}</p>
            </div>
            <div className="flex flex-col gap-2 justify-center">
              <Button asChild>
                <Link href="/order/single-report">Order Single Report - $149</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/order/snapshot-plan">Subscribe to Snapshot Plan - $49/month</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/my-reports">Back to My Reports</Link>
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
            <CardTitle>Company Data Not Available</CardTitle>
            <CardDescription>
              The snapshot report for "{companyId}" is not yet available. Our team is working on adding this company's
              data.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Please contact support if you need this report urgently, or try again later.
            </p>
            <div className="space-y-2 mb-4">
              <p className="text-xs text-gray-500">Requested Company: {companyId}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/my-reports">Back to My Reports</Link>
              </Button>
            </div>
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

  const negativePercentage = Math.round(
    (companyData.newsStats.negativeArticles / companyData.newsStats.totalArticles) * 100,
  )

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
              Back to My Reports
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Snapshot Report</h1>
            <p className="text-gray-600">
              {accessType === "snapshot-plan"
                ? "Available with your Snapshot Plan subscription"
                : accessType === "trial"
                  ? "Available with your Free Trial"
                  : "Available with your Single Insight Report purchase"}
            </p>
          </div>
        </div>

        {/* Access Type Banner */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-800">
                  {accessType === "snapshot-plan"
                    ? "Snapshot Plan Access"
                    : accessType === "trial"
                      ? "Free Trial Access"
                      : "Single Report Access"}
                </h3>
                <p className="text-sm text-blue-700">
                  {accessType === "snapshot-plan"
                    ? "You have unlimited access to all company snapshot reports with your subscription."
                    : accessType === "trial"
                      ? "You have unlimited access to all company snapshot reports during your 7-day trial."
                      : "You have access to this company's snapshot report through your Single Insight Report purchase."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

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
                <Badge className={`${colors.badge} text-white mb-2`}>Snapshot Report</Badge>
                <p className="text-sm text-gray-500">Generated: {new Date().toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">Company ID: {companyId}</p>
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

            {/* News Headlines with Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Newspaper className="h-5 w-5 text-emerald-600 mr-2" />
                  Recent News Headlines
                </CardTitle>
                <CardDescription>Key news from the past month</CardDescription>
              </CardHeader>
              <CardContent>
                {/* News Statistics - Eye-catching display */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{companyData.newsStats.totalArticles}</div>
                    <div className="text-sm font-medium text-blue-800">Total Articles</div>
                    <div className="text-xs text-blue-600">Past 30 days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-1">{companyData.newsStats.negativeArticles}</div>
                    <div className="text-sm font-medium text-red-800">Negative</div>
                    <div className="text-xs text-red-600">{negativePercentage}% of total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-600 mb-1">{companyData.newsStats.neutralArticles}</div>
                    <div className="text-sm font-medium text-gray-800">Neutral</div>
                    <div className="text-xs text-gray-600">
                      {Math.round((companyData.newsStats.neutralArticles / companyData.newsStats.totalArticles) * 100)}%
                      of total
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {companyData.newsStats.positiveArticles}
                    </div>
                    <div className="text-sm font-medium text-green-800">Positive</div>
                    <div className="text-xs text-green-600">
                      {Math.round((companyData.newsStats.positiveArticles / companyData.newsStats.totalArticles) * 100)}
                      % of total
                    </div>
                  </div>
                </div>

                {/* Sentiment Alert */}
                {negativePercentage > 15 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <h4 className="font-semibold text-red-800">High Negative Sentiment Alert</h4>
                    </div>
                    <p className="text-red-700 text-sm mt-1">
                      {negativePercentage}% of recent news articles have negative sentiment. Monitor closely for
                      potential risks.
                    </p>
                  </div>
                )}

                {negativePercentage < 10 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-green-800">Positive News Environment</h4>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      Only {negativePercentage}% negative sentiment in recent coverage. Strong media perception.
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  {[
                    {
                      title: `${companyData.nameEnglish} Reports Strong Q3 Performance`,
                      description: "Company exceeds analyst expectations with robust growth across key business areas",
                      date: "Dec 18, 2024",
                      source: "Korea Economic Daily",
                      sentiment: "positive",
                    },
                    {
                      title: `${companyData.nameEnglish} Expands Global Operations`,
                      description: "Strategic investments in international markets drive future growth prospects",
                      date: "Dec 10, 2024",
                      source: "Maeil Business",
                      sentiment: "positive",
                    },
                    {
                      title: `Innovation Leadership in ${companyData.sector}`,
                      description: "Company maintains competitive edge through continued R&D investments",
                      date: "Nov 28, 2024",
                      source: "Digital Times",
                      sentiment: "neutral",
                    },
                    {
                      title: `${companyData.nameEnglish} Faces Market Challenges`,
                      description: "Industry headwinds create pressure on quarterly performance",
                      date: "Nov 15, 2024",
                      source: "The Korea Herald",
                      sentiment: "negative",
                    },
                  ].map((news, index) => (
                    <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400 mt-1" />
                        <Badge
                          className={
                            news.sentiment === "positive"
                              ? "bg-green-100 text-green-800"
                              : news.sentiment === "negative"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                          }
                        >
                          {news.sentiment}
                        </Badge>
                      </div>
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

            {/* Actions */}
            <Card className={`${colors.border} ${colors.bg}`}>
              <CardHeader>
                <CardTitle className={colors.text}>Report Actions</CardTitle>
                <CardDescription className={colors.accent}>Download or generate new report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className={`w-full ${colors.badge} hover:${colors.badge}/90`}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                  {(accessType === "snapshot-plan" || accessType === "trial") && (
                    <Button variant="outline" className={`w-full border-${colors.accent} ${colors.accent}`} asChild>
                      <Link href="/dashboard/snapshot">Generate Another</Link>
                    </Button>
                  )}
                  {accessType === "single-report" && (
                    <Button variant="outline" className={`w-full border-${colors.accent} ${colors.accent}`} asChild>
                      <Link href="/order/single-report">Order Another Report</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
