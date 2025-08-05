"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { usePurchases } from "@/components/purchase-provider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Home, Lock, Search, Building2, TrendingUp, FileText, Clock } from "lucide-react"
import { CompanySelector } from "@/components/company-selector"

interface Company {
  id: string
  nameKorean: string
  nameEnglish: string
  ticker: string
  sector: string
  marketCap: string
  exchange: "KOSPI" | "KOSDAQ"
}

export default function SnapshotDashboardPage() {
  const { user, loading } = useAuth()
  const { hasSnapshotPlan, hasActiveTrial, getTrialEndDate } = usePurchases()
  const router = useRouter()
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const [hasActiveTrialState, setHasActiveTrialState] = useState(false)
  const [trialEndDate, setTrialEndDate] = useState<string | null>(null)
  const [subscriptionLoading, setSubscriptionLoading] = useState(true)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/dashboard/snapshot")
      return
    }

    if (user) {
      console.log("Checking access for user:", user.id)
      const hasSnapshot = hasSnapshotPlan(user.id)
      const hasTrial = hasActiveTrial(user.id)
      const trialEnd = getTrialEndDate(user.id)

      console.log("Access status:", { hasSnapshot, hasTrial, trialEnd })
      setHasActiveSubscription(hasSnapshot)
      setHasActiveTrialState(hasTrial)
      setTrialEndDate(trialEnd)
      setSubscriptionLoading(false)
    }
  }, [user, loading, router, hasSnapshotPlan, hasActiveTrial, getTrialEndDate])

  const handleCompanySelect = (company: Company | null) => {
    setSelectedCompany(company)
  }

  const handleGenerateReport = () => {
    if (selectedCompany) {
      router.push(`/reports/snapshot/${selectedCompany.id}`)
    }
  }

  const formatTimeRemaining = (endDate: string) => {
    const now = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays > 1) {
      return `${diffDays} days remaining`
    } else if (diffDays === 1) {
      return "1 day remaining"
    } else {
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
      return diffHours > 0 ? `${diffHours} hours remaining` : "Expires soon"
    }
  }

  if (loading || subscriptionLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!hasActiveSubscription && !hasActiveTrialState) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
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
            </div>

            <Card className="border-amber-200 bg-amber-50">
              <CardHeader className="text-center">
                <Lock className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                <CardTitle className="text-amber-800">Access Required</CardTitle>
                <CardDescription className="text-amber-600">
                  You need an active subscription or trial to access this dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-4">
                  <p className="text-amber-700">
                    Choose from our available options to start generating snapshot reports.
                  </p>
                  <div className="grid gap-4">
                    <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">🎁 Free Trial</h4>
                      <p className="text-sm text-blue-700 mb-3">7 days of unlimited snapshot reports</p>
                      <Button className="bg-blue-600 hover:bg-blue-700 w-full" asChild>
                        <Link href="/start-trial">Start Free Trial</Link>
                      </Button>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-semibold text-emerald-800 mb-2">📊 Snapshot Plan</h4>
                      <p className="text-sm text-emerald-700 mb-3">Monthly subscription - unlimited reports</p>
                      <Button className="bg-emerald-600 hover:bg-emerald-700 w-full" asChild>
                        <Link href="/order/snapshot-plan">Subscribe - $29/month</Link>
                      </Button>
                    </div>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href="/my-reports">View My Reports</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // If user has snapshot plan or active trial, show the actual dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
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
                <h1 className="text-3xl font-bold text-gray-900">Snapshot Dashboard</h1>
                <p className="text-gray-600">Generate instant DART snapshot reports</p>
              </div>
            </div>
            <div className="flex gap-2">
              {hasActiveTrialState && trialEndDate && (
                <Badge className="bg-blue-100 text-blue-800 px-4 py-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Free Trial - {formatTimeRemaining(trialEndDate)}
                </Badge>
              )}
              {hasActiveSubscription && (
                <Badge className="bg-emerald-100 text-emerald-800 px-4 py-2">Active Subscription</Badge>
              )}
            </div>
          </div>

          {/* Trial Warning */}
          {hasActiveTrialState && trialEndDate && (
            <Card className="mb-8 border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-800">Free Trial Active</p>
                      <p className="text-sm text-blue-600">{formatTimeRemaining(trialEndDate)} of unlimited access</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
                    <Link href="/order/snapshot-plan">Upgrade to Full Plan</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Company Search Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 text-emerald-600 mr-2" />
                Generate Snapshot Report
              </CardTitle>
              <CardDescription>
                Search and select a Korean company to generate an instant snapshot report
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <CompanySelector
                    onCompanySelect={handleCompanySelect}
                    selectedCompany={selectedCompany}
                    placeholder="Search for a Korean company..."
                  />
                </div>
                <Button
                  onClick={handleGenerateReport}
                  disabled={!selectedCompany}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
              {selectedCompany && (
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <p className="text-emerald-800 font-medium">
                    Selected: {selectedCompany.nameKorean} ({selectedCompany.ticker})
                  </p>
                  <p className="text-emerald-600 text-sm">Click "Generate Report" to create your snapshot</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Companies Analyzed</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Unique companies</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Access Status</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">{hasActiveTrialState ? "Trial" : "Active"}</div>
                <p className="text-xs text-muted-foreground">
                  {hasActiveTrialState ? "Free trial active" : "Unlimited reports"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Your latest snapshot reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Samsung Electronics</h4>
                    <p className="text-sm text-gray-600">Generated 2 days ago</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/reports/snapshot/samsung-electronics">View Report</Link>
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">LG Energy Solution</h4>
                    <p className="text-sm text-gray-600">Generated 5 days ago</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/reports/snapshot/lg-energy">View Report</Link>
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">NAVER Corporation</h4>
                    <p className="text-sm text-gray-600">Generated 1 week ago</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/reports/snapshot/naver">View Report</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
