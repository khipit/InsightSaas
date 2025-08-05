"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-provider"
import { usePurchases } from "@/components/purchase-provider"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Eye, Send, Plus, Trash2 } from "lucide-react"

// 확장된 편집 가능한 리포트 데이터 구조
interface EditableReportData {
  companyInfo: {
    nameKorean: string
    nameEnglish: string
    ticker: string
    sector: string
    marketCap: string
    ceo: string
    founded: string
    employees: string
    headquarters: string
    website: string
    description: string
  }
  financials: {
    revenue: { q3_2024: string; q3_2023: string; change: string }
    operatingProfit: { q3_2024: string; q3_2023: string; change: string }
    netIncome: { q3_2024: string; q3_2023: string; change: string }
    operatingMargin: { q3_2024: string; q3_2023: string; change: string }
    totalAssets: { q3_2024: string; q3_2023: string; change: string }
    totalEquity: { q3_2024: string; q3_2023: string; change: string }
    debtToEquity: { q3_2024: string; q3_2023: string; change: string }
    roe: { q3_2024: string; q3_2023: string; change: string }
  }
  dartDisclosures: Array<{
    title: string
    date: string
    summary: string[]
  }>
  newsHeadlines: Array<{
    title: string
    description: string
    date: string
    source: string
    sentiment: "positive" | "neutral" | "negative"
  }>
  keywords: string[]
  riskAssessment: {
    overall: string
    factors: string[]
    opportunities: string[]
    marketRisks: string[]
    operationalRisks: string[]
    financialRisks: string[]
  }
  englishSummary: string
  executiveSummary: string
  businessModel: string
  competitivePosition: string
  futureOutlook: string
}

export default function EditReportPage() {
  const { user, loading } = useAuth()
  const { purchases, updatePurchaseStatus } = usePurchases()
  const router = useRouter()
  const params = useParams()
  const purchaseId = params.purchaseId as string

  const [purchase, setPurchase] = useState<any>(null)
  const [reportData, setReportData] = useState<EditableReportData | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (!loading && (!user || user.email !== "admin@khip.com")) {
      router.push("/admin")
      return
    }

    if (user && purchaseId) {
      const foundPurchase = purchases.find((p) => p.id === purchaseId)
      if (foundPurchase) {
        setPurchase(foundPurchase)
        setReportData(generateInitialReportData(foundPurchase))
      }
    }
  }, [user, loading, router, purchaseId, purchases])

  const generateInitialReportData = (purchase: any): EditableReportData => {
    return {
      companyInfo: {
        nameKorean: purchase.companyName,
        nameEnglish: purchase.companyName,
        ticker: "000000",
        sector: "Technology",
        marketCap: "₩10.0T",
        ceo: "김대표 (Kim Daepyo)",
        founded: "2000",
        employees: "5,000",
        headquarters: "Seoul, South Korea",
        website: "www.company.com",
        description:
          "Leading technology company specializing in innovative solutions and digital transformation services.",
      },
      financials: {
        revenue: { q3_2024: "₩2.5T", q3_2023: "₩2.1T", change: "+19.0%" },
        operatingProfit: { q3_2024: "₩350B", q3_2023: "₩280B", change: "+25.0%" },
        netIncome: { q3_2024: "₩280B", q3_2023: "₩220B", change: "+27.3%" },
        operatingMargin: { q3_2024: "14.0%", q3_2023: "13.3%", change: "+0.7%p" },
        totalAssets: { q3_2024: "₩15.2T", q3_2023: "₩14.1T", change: "+7.8%" },
        totalEquity: { q3_2024: "₩8.5T", q3_2023: "₩7.9T", change: "+7.6%" },
        debtToEquity: { q3_2024: "0.79", q3_2023: "0.78", change: "+0.01" },
        roe: { q3_2024: "13.2%", q3_2023: "11.1%", change: "+2.1%p" },
      },
      dartDisclosures: [
        {
          title: "Q3 2024 Earnings Report",
          date: "2024-10-31",
          summary: [
            "Strong quarterly performance with significant revenue growth",
            "Operating profit margins improved across all business segments",
            "Positive outlook for Q4 2024 and full year guidance raised",
          ],
        },
        {
          title: "Strategic Investment Announcement",
          date: "2024-11-15",
          summary: [
            "Major investment in next-generation technology development",
            "Partnership agreements with global technology leaders",
            "Expected to drive long-term growth and market expansion",
          ],
        },
      ],
      newsHeadlines: [
        {
          title: `${purchase.companyName} Reports Strong Q3 Performance`,
          description: "Company exceeds analyst expectations with robust growth across key business areas",
          date: "2024-12-18",
          source: "Korea Economic Daily",
          sentiment: "positive",
        },
        {
          title: `${purchase.companyName} Expands Global Operations`,
          description: "Strategic investments in international markets drive future growth prospects",
          date: "2024-12-10",
          source: "Maeil Business",
          sentiment: "positive",
        },
        {
          title: `Market Challenges for ${purchase.companyName}`,
          description: "Industry headwinds pose challenges for near-term growth expectations",
          date: "2024-12-05",
          source: "Financial News",
          sentiment: "negative",
        },
      ],
      keywords: ["Digital Transformation", "Market Leadership", "Innovation"],
      riskAssessment: {
        overall: "Medium",
        factors: ["Market competition intensification", "Regulatory changes", "Economic uncertainty"],
        opportunities: ["New market expansion", "Technology advancement", "Strategic partnerships"],
        marketRisks: ["Increased competition", "Market saturation", "Economic downturn"],
        operationalRisks: ["Supply chain disruption", "Talent retention", "Technology obsolescence"],
        financialRisks: ["Currency fluctuation", "Interest rate changes", "Credit risk"],
      },
      englishSummary: `${purchase.companyName} demonstrates strong financial performance in Q3 2024 with significant revenue growth and improved profitability. The company continues to invest in innovation and market expansion, positioning itself well for future growth despite market challenges.`,
      executiveSummary: `${purchase.companyName}는 2024년 3분기 강력한 실적을 기록하며 지속적인 성장세를 보여주고 있습니다. 매출 증가와 수익성 개선을 통해 시장 리더십을 강화하고 있으며, 혁신적인 기술 개발과 글로벌 시장 확장을 통해 미래 성장 동력을 확보하고 있습니다.`,
      businessModel:
        "다양한 기술 솔루션과 서비스를 통해 고객에게 가치를 제공하는 종합 기술 기업으로, B2B 및 B2C 시장에서 균형잡힌 포트폴리오를 운영하고 있습니다.",
      competitivePosition:
        "업계 내 기술 혁신 리더로서 강력한 R&D 역량과 글로벌 파트너십을 바탕으로 경쟁 우위를 유지하고 있으며, 시장 점유율 확대를 지속하고 있습니다.",
      futureOutlook:
        "디지털 전환 가속화와 신기술 도입을 통해 2025년에도 지속적인 성장이 예상되며, 새로운 시장 진출과 전략적 투자를 통해 장기적인 가치 창출을 추진할 계획입니다.",
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      alert("Report saved successfully!")
    }, 1000)
  }

  const handleApproveAndDeliver = async () => {
    setIsSaving(true)
    setTimeout(() => {
      const reportUrl = `/reports/${purchaseId}-full-report.pdf`
      updatePurchaseStatus(purchaseId, "delivered", reportUrl)
      setIsSaving(false)
      alert("Report approved and delivered to customer!")
      router.push("/admin")
    }, 1500)
  }

  // DART 공시 추가/삭제 함수
  const addDartDisclosure = () => {
    if (!reportData) return
    setReportData({
      ...reportData,
      dartDisclosures: [
        ...reportData.dartDisclosures,
        {
          title: "New Disclosure",
          date: new Date().toISOString().split("T")[0],
          summary: ["Summary point 1", "Summary point 2"],
        },
      ],
    })
  }

  const removeDartDisclosure = (index: number) => {
    if (!reportData) return
    setReportData({
      ...reportData,
      dartDisclosures: reportData.dartDisclosures.filter((_, i) => i !== index),
    })
  }

  // 뉴스 헤드라인 추가/삭제 함수
  const addNewsHeadline = () => {
    if (!reportData) return
    setReportData({
      ...reportData,
      newsHeadlines: [
        ...reportData.newsHeadlines,
        {
          title: "New News Headline",
          description: "News description",
          date: new Date().toISOString().split("T")[0],
          source: "News Source",
          sentiment: "neutral" as const,
        },
      ],
    })
  }

  const removeNewsHeadline = (index: number) => {
    if (!reportData) return
    setReportData({
      ...reportData,
      newsHeadlines: reportData.newsHeadlines.filter((_, i) => i !== index),
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || user.email !== "admin@khip.com") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!purchase || !reportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Report Not Found</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Preview Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => setShowPreview(false)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Edit
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">Report Preview</h1>
                  <p className="text-gray-600">
                    {purchase.companyName} - {purchase.type}
                  </p>
                </div>
              </div>
              <Button onClick={handleApproveAndDeliver} className="bg-emerald-600 hover:bg-emerald-700">
                <Send className="h-4 w-4 mr-2" />
                Approve & Deliver
              </Button>
            </div>

            {/* Preview Content - 샘플 리포트와 동일한 구조 */}
            <Card className="mb-8">
              <CardHeader className="bg-emerald-50">
                <CardTitle className="text-2xl text-emerald-800">
                  {reportData.companyInfo.nameKorean} ({reportData.companyInfo.nameEnglish})
                </CardTitle>
                <CardDescription className="text-emerald-600">
                  {reportData.companyInfo.ticker} • {reportData.companyInfo.sector}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {/* Executive Summary */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3 text-emerald-700">Executive Summary</h3>
                  <p className="text-gray-700 leading-relaxed">{reportData.executiveSummary}</p>
                </div>

                {/* Company Overview */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-emerald-700">Company Overview</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">CEO</span>
                        <span className="font-medium">{reportData.companyInfo.ceo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Founded</span>
                        <span className="font-medium">{reportData.companyInfo.founded}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Employees</span>
                        <span className="font-medium">{reportData.companyInfo.employees}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Headquarters</span>
                        <span className="font-medium">{reportData.companyInfo.headquarters}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Market Cap</span>
                        <span className="font-medium">{reportData.companyInfo.marketCap}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Website</span>
                        <span className="font-medium text-blue-600">{reportData.companyInfo.website}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-700">{reportData.companyInfo.description}</p>
                  </div>
                </div>

                {/* Financial Performance */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-emerald-700">Financial Performance</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left">Metric</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Q3 2024</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Q3 2023</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">Revenue</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">
                            {reportData.financials.revenue.q3_2024}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-right">
                            {reportData.financials.revenue.q3_2023}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-right text-green-600 font-medium">
                            {reportData.financials.revenue.change}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">Operating Profit</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">
                            {reportData.financials.operatingProfit.q3_2024}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-right">
                            {reportData.financials.operatingProfit.q3_2023}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-right text-green-600 font-medium">
                            {reportData.financials.operatingProfit.change}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">Net Income</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">
                            {reportData.financials.netIncome.q3_2024}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-right">
                            {reportData.financials.netIncome.q3_2023}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-right text-green-600 font-medium">
                            {reportData.financials.netIncome.change}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">Operating Margin</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">
                            {reportData.financials.operatingMargin.q3_2024}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-right">
                            {reportData.financials.operatingMargin.q3_2023}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-right text-green-600 font-medium">
                            {reportData.financials.operatingMargin.change}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* DART Disclosures */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-emerald-700">DART Disclosures</h3>
                  <div className="space-y-4">
                    {reportData.dartDisclosures.map((disclosure, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{disclosure.title}</h4>
                          <span className="text-sm text-gray-500">{disclosure.date}</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                          {disclosure.summary.map((point, pointIndex) => (
                            <li key={pointIndex}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent News Headlines */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-emerald-700">Recent News Headlines</h3>
                  <div className="space-y-4">
                    {reportData.newsHeadlines.map((news, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{news.title}</h4>
                          <div className="flex items-center gap-2">
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
                            <span className="text-sm text-gray-500">{news.date}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{news.description}</p>
                        <p className="text-xs text-gray-500">Source: {news.source}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Themes & Keywords */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-emerald-700">Key Themes & Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {reportData.keywords.map((keyword, index) => (
                      <Badge key={index} className="bg-blue-100 text-blue-800 px-3 py-1">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-emerald-700">Risk Assessment</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="mb-4">
                      <span className="font-medium">Overall Risk Level: </span>
                      <Badge
                        className={
                          reportData.riskAssessment.overall === "Low"
                            ? "bg-green-100 text-green-800"
                            : reportData.riskAssessment.overall === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }
                      >
                        {reportData.riskAssessment.overall}
                      </Badge>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-red-700 mb-2">Risk Factors</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                          {reportData.riskAssessment.factors.map((factor, index) => (
                            <li key={index}>{factor}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-green-700 mb-2">Opportunities</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                          {reportData.riskAssessment.opportunities.map((opportunity, index) => (
                            <li key={index}>{opportunity}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* English Summary */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-emerald-700">English Summary</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">{reportData.englishSummary}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/admin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Admin
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Edit Report</h1>
                <p className="text-gray-600">
                  {purchase.companyName} - {purchase.type === "single-report" ? "Single Insight" : "Custom"} Report
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowPreview(true)}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            {/* Executive Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Executive Summary</CardTitle>
                <CardDescription>Overall company summary in Korean</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={4}
                  value={reportData.executiveSummary}
                  onChange={(e) => setReportData({ ...reportData, executiveSummary: e.target.value })}
                  placeholder="회사의 전반적인 요약을 작성하세요..."
                />
              </CardContent>
            </Card>

            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle>Company Overview</CardTitle>
                <CardDescription>Edit basic company details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Korean Name</label>
                    <Input
                      value={reportData.companyInfo.nameKorean}
                      onChange={(e) =>
                        setReportData({
                          ...reportData,
                          companyInfo: { ...reportData.companyInfo, nameKorean: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">English Name</label>
                    <Input
                      value={reportData.companyInfo.nameEnglish}
                      onChange={(e) =>
                        setReportData({
                          ...reportData,
                          companyInfo: { ...reportData.companyInfo, nameEnglish: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Ticker</label>
                    <Input
                      value={reportData.companyInfo.ticker}
                      onChange={(e) =>
                        setReportData({
                          ...reportData,
                          companyInfo: { ...reportData.companyInfo, ticker: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Sector</label>
                    <Input
                      value={reportData.companyInfo.sector}
                      onChange={(e) =>
                        setReportData({
                          ...reportData,
                          companyInfo: { ...reportData.companyInfo, sector: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Market Cap</label>
                    <Input
                      value={reportData.companyInfo.marketCap}
                      onChange={(e) =>
                        setReportData({
                          ...reportData,
                          companyInfo: { ...reportData.companyInfo, marketCap: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CEO</label>
                    <Input
                      value={reportData.companyInfo.ceo}
                      onChange={(e) =>
                        setReportData({
                          ...reportData,
                          companyInfo: { ...reportData.companyInfo, ceo: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Founded</label>
                    <Input
                      value={reportData.companyInfo.founded}
                      onChange={(e) =>
                        setReportData({
                          ...reportData,
                          companyInfo: { ...reportData.companyInfo, founded: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Employees</label>
                    <Input
                      value={reportData.companyInfo.employees}
                      onChange={(e) =>
                        setReportData({
                          ...reportData,
                          companyInfo: { ...reportData.companyInfo, employees: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Headquarters</label>
                    <Input
                      value={reportData.companyInfo.headquarters}
                      onChange={(e) =>
                        setReportData({
                          ...reportData,
                          companyInfo: { ...reportData.companyInfo, headquarters: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Website</label>
                    <Input
                      value={reportData.companyInfo.website}
                      onChange={(e) =>
                        setReportData({
                          ...reportData,
                          companyInfo: { ...reportData.companyInfo, website: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company Description</label>
                  <Textarea
                    rows={3}
                    value={reportData.companyInfo.description}
                    onChange={(e) =>
                      setReportData({
                        ...reportData,
                        companyInfo: { ...reportData.companyInfo, description: e.target.value },
                      })
                    }
                    placeholder="Brief company description..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Financial Data */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Performance</CardTitle>
                <CardDescription>Edit Q3 2024 vs Q3 2023 financial metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Revenue */}
                  <div>
                    <h4 className="font-medium mb-3">Revenue</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Q3 2024</label>
                        <Input
                          value={reportData.financials.revenue.q3_2024}
                          onChange={(e) =>
                            setReportData({
                              ...reportData,
                              financials: {
                                ...reportData.financials,
                                revenue: { ...reportData.financials.revenue, q3_2024: e.target.value },
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Q3 2023</label>
                        <Input
                          value={reportData.financials.revenue.q3_2023}
                          onChange={(e) =>
                            setReportData({
                              ...reportData,
                              financials: {
                                ...reportData.financials,
                                revenue: { ...reportData.financials.revenue, q3_2023: e.target.value },
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Change</label>
                        <Input
                          value={reportData.financials.revenue.change}
                          onChange={(e) =>
                            setReportData({
                              ...reportData,
                              financials: {
                                ...reportData.financials,
                                revenue: { ...reportData.financials.revenue, change: e.target.value },
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Operating Profit */}
                  <div>
                    <h4 className="font-medium mb-3">Operating Profit</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Q3 2024</label>
                        <Input
                          value={reportData.financials.operatingProfit.q3_2024}
                          onChange={(e) =>
                            setReportData({
                              ...reportData,
                              financials: {
                                ...reportData.financials,
                                operatingProfit: { ...reportData.financials.operatingProfit, q3_2024: e.target.value },
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Q3 2023</label>
                        <Input
                          value={reportData.financials.operatingProfit.q3_2023}
                          onChange={(e) =>
                            setReportData({
                              ...reportData,
                              financials: {
                                ...reportData.financials,
                                operatingProfit: { ...reportData.financials.operatingProfit, q3_2023: e.target.value },
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Change</label>
                        <Input
                          value={reportData.financials.operatingProfit.change}
                          onChange={(e) =>
                            setReportData({
                              ...reportData,
                              financials: {
                                ...reportData.financials,
                                operatingProfit: { ...reportData.financials.operatingProfit, change: e.target.value },
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Net Income */}
                  <div>
                    <h4 className="font-medium mb-3">Net Income</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Q3 2024</label>
                        <Input
                          value={reportData.financials.netIncome.q3_2024}
                          onChange={(e) =>
                            setReportData({
                              ...reportData,
                              financials: {
                                ...reportData.financials,
                                netIncome: { ...reportData.financials.netIncome, q3_2024: e.target.value },
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Q3 2023</label>
                        <Input
                          value={reportData.financials.netIncome.q3_2023}
                          onChange={(e) =>
                            setReportData({
                              ...reportData,
                              financials: {
                                ...reportData.financials,
                                netIncome: { ...reportData.financials.netIncome, q3_2023: e.target.value },
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Change</label>
                        <Input
                          value={reportData.financials.netIncome.change}
                          onChange={(e) =>
                            setReportData({
                              ...reportData,
                              financials: {
                                ...reportData.financials,
                                netIncome: { ...reportData.financials.netIncome, change: e.target.value },
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Operating Margin */}
                  <div>
                    <h4 className="font-medium mb-3">Operating Margin</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Q3 2024</label>
                        <Input
                          value={reportData.financials.operatingMargin.q3_2024}
                          onChange={(e) =>
                            setReportData({
                              ...reportData,
                              financials: {
                                ...reportData.financials,
                                operatingMargin: { ...reportData.financials.operatingMargin, q3_2024: e.target.value },
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Q3 2023</label>
                        <Input
                          value={reportData.financials.operatingMargin.q3_2023}
                          onChange={(e) =>
                            setReportData({
                              ...reportData,
                              financials: {
                                ...reportData.financials,
                                operatingMargin: { ...reportData.financials.operatingMargin, q3_2023: e.target.value },
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Change</label>
                        <Input
                          value={reportData.financials.operatingMargin.change}
                          onChange={(e) =>
                            setReportData({
                              ...reportData,
                              financials: {
                                ...reportData.financials,
                                operatingMargin: { ...reportData.financials.operatingMargin, change: e.target.value },
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* DART Disclosures */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>DART Disclosures</CardTitle>
                    <CardDescription>Edit regulatory filings and disclosures</CardDescription>
                  </div>
                  <Button onClick={addDartDisclosure} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Disclosure
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.dartDisclosures.map((disclosure, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium">Disclosure {index + 1}</h4>
                        <Button
                          onClick={() => removeDartDisclosure(index)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Title</label>
                          <Input
                            value={disclosure.title}
                            onChange={(e) => {
                              const newDisclosures = [...reportData.dartDisclosures]
                              newDisclosures[index].title = e.target.value
                              setReportData({ ...reportData, dartDisclosures: newDisclosures })
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Date</label>
                          <Input
                            type="date"
                            value={disclosure.date}
                            onChange={(e) => {
                              const newDisclosures = [...reportData.dartDisclosures]
                              newDisclosures[index].date = e.target.value
                              setReportData({ ...reportData, dartDisclosures: newDisclosures })
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Summary Points (one per line)</label>
                        <Textarea
                          rows={3}
                          value={disclosure.summary.join("\n")}
                          onChange={(e) => {
                            const newDisclosures = [...reportData.dartDisclosures]
                            newDisclosures[index].summary = e.target.value.split("\n").filter((line) => line.trim())
                            setReportData({ ...reportData, dartDisclosures: newDisclosures })
                          }}
                          placeholder="Enter summary points, one per line"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent News Headlines */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Recent News Headlines</CardTitle>
                    <CardDescription>Edit news articles and sentiment analysis</CardDescription>
                  </div>
                  <Button onClick={addNewsHeadline} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add News
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.newsHeadlines.map((news, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium">News {index + 1}</h4>
                        <Button
                          onClick={() => removeNewsHeadline(index)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Title</label>
                          <Input
                            value={news.title}
                            onChange={(e) => {
                              const newNews = [...reportData.newsHeadlines]
                              newNews[index].title = e.target.value
                              setReportData({ ...reportData, newsHeadlines: newNews })
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <Textarea
                            rows={2}
                            value={news.description}
                            onChange={(e) => {
                              const newNews = [...reportData.newsHeadlines]
                              newNews[index].description = e.target.value
                              setReportData({ ...reportData, newsHeadlines: newNews })
                            }}
                          />
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Date</label>
                            <Input
                              type="date"
                              value={news.date}
                              onChange={(e) => {
                                const newNews = [...reportData.newsHeadlines]
                                newNews[index].date = e.target.value
                                setReportData({ ...reportData, newsHeadlines: newNews })
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Source</label>
                            <Input
                              value={news.source}
                              onChange={(e) => {
                                const newNews = [...reportData.newsHeadlines]
                                newNews[index].source = e.target.value
                                setReportData({ ...reportData, newsHeadlines: newNews })
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Sentiment</label>
                            <select
                              className="w-full p-2 border rounded-md"
                              value={news.sentiment}
                              onChange={(e) => {
                                const newNews = [...reportData.newsHeadlines]
                                newNews[index].sentiment = e.target.value as "positive" | "neutral" | "negative"
                                setReportData({ ...reportData, newsHeadlines: newNews })
                              }}
                            >
                              <option value="positive">Positive</option>
                              <option value="neutral">Neutral</option>
                              <option value="negative">Negative</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Keywords */}
            <Card>
              <CardHeader>
                <CardTitle>Key Themes & Keywords</CardTitle>
                <CardDescription>Edit the most important themes (comma-separated)</CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  value={reportData.keywords.join(", ")}
                  onChange={(e) =>
                    setReportData({
                      ...reportData,
                      keywords: e.target.value.split(",").map((k) => k.trim()),
                    })
                  }
                  placeholder="Digital Transformation, Market Leadership, Innovation"
                />
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
                <CardDescription>Edit comprehensive risk analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Overall Risk Level</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={reportData.riskAssessment.overall}
                    onChange={(e) =>
                      setReportData({
                        ...reportData,
                        riskAssessment: { ...reportData.riskAssessment, overall: e.target.value },
                      })
                    }
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Risk Factors (comma-separated)</label>
                    <Textarea
                      rows={3}
                      value={reportData.riskAssessment.factors.join(", ")}
                      onChange={(e) =>
                        setReportData({
                          ...reportData,
                          riskAssessment: {
                            ...reportData.riskAssessment,
                            factors: e.target.value.split(",").map((f) => f.trim()),
                          },
                        })
                      }
                      placeholder="Market competition, Regulatory changes, Economic uncertainty"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Opportunities (comma-separated)</label>
                    <Textarea
                      rows={3}
                      value={reportData.riskAssessment.opportunities.join(", ")}
                      onChange={(e) =>
                        setReportData({
                          ...reportData,
                          riskAssessment: {
                            ...reportData.riskAssessment,
                            opportunities: e.target.value.split(",").map((o) => o.trim()),
                          },
                        })
                      }
                      placeholder="Market expansion, Technology advancement, Strategic partnerships"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Business Analysis</CardTitle>
                <CardDescription>Edit detailed business insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Business Model</label>
                  <Textarea
                    rows={3}
                    value={reportData.businessModel}
                    onChange={(e) => setReportData({ ...reportData, businessModel: e.target.value })}
                    placeholder="Describe the company's business model..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Competitive Position</label>
                  <Textarea
                    rows={3}
                    value={reportData.competitivePosition}
                    onChange={(e) => setReportData({ ...reportData, competitivePosition: e.target.value })}
                    placeholder="Analyze the company's competitive position..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Future Outlook</label>
                  <Textarea
                    rows={3}
                    value={reportData.futureOutlook}
                    onChange={(e) => setReportData({ ...reportData, futureOutlook: e.target.value })}
                    placeholder="Provide future outlook and projections..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* English Summary */}
            <Card>
              <CardHeader>
                <CardTitle>English Summary</CardTitle>
                <CardDescription>Comprehensive English summary of the analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={6}
                  value={reportData.englishSummary}
                  onChange={(e) => setReportData({ ...reportData, englishSummary: e.target.value })}
                  placeholder="Comprehensive English summary of the company analysis..."
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pb-8">
              <Button variant="outline" onClick={() => setShowPreview(true)}>
                <Eye className="h-4 w-4 mr-2" />
                Preview Report
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </>
                )}
              </Button>
              <Button onClick={handleApproveAndDeliver} className="bg-emerald-600 hover:bg-emerald-700">
                <Send className="h-4 w-4 mr-2" />
                Approve & Deliver
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
