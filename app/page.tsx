import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  ArrowRight,
  Users,
  Shield,
  TrendingUp,
  FileText,
  Zap,
  Sparkles,
  Database,
  Newspaper,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-emerald-100 text-emerald-800 px-4 py-2">
            🚀 AI-Powered Korean Corporate Intelligence
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Get Instant Insights on
            <span className="text-emerald-600"> Korean Companies</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Access comprehensive analysis of Korean corporations through official disclosure systems, enhanced with AI
            and expert review for accurate, actionable intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-4" asChild>
              <Link href="/start-trial">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Data Sources Banner */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8 mb-16 text-white">
            <h2 className="text-2xl font-bold mb-6">Powered by Official Korean Data Sources</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">DART System</h3>
                <p className="text-emerald-100 text-sm">
                  Official corporate disclosures, financial statements, and regulatory filings from Korea's electronic
                  disclosure system
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Newspaper className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Verified Media</h3>
                <p className="text-emerald-100 text-sm">
                  Curated news from Korea Herald, Yonhap, Chosun Biz, and other trusted Korean business media sources
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Government Data</h3>
                <p className="text-emerald-100 text-sm">
                  Statistics and reports from MOTIE, KDB, Fair Trade Commission, and Export-Import Bank of Korea
                </p>
              </div>
            </div>
          </div>

          {/* Sample Reports Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Our Analysis Samples</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See the depth and quality of our corporate intelligence reports across different analysis levels
            </p>
          </div>

          {/* Sample Report Cards - Professional B2B Design */}
          <div id="samples" className="grid md:grid-cols-3 gap-8 mb-16">
            <Card
              className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-emerald-50 to-emerald-100 cursor-pointer"
              asChild
            >
              <Link href="/sample-snapshot">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                </div>
                <CardHeader className="pb-4 relative z-10">
                  <div className="w-full h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-500">
                    <FileText className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-xl text-emerald-900 group-hover:text-emerald-700 transition-colors">
                    Snapshot Report
                  </CardTitle>
                  <CardDescription className="text-emerald-700">NAVER Corporation</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <Badge className="bg-emerald-200 text-emerald-800 text-xs mb-3">Automated Analysis</Badge>
                  <p className="text-sm text-emerald-700 leading-relaxed">
                    Quick DART summaries with financial snapshots and news monitoring for instant corporate overview
                  </p>
                </CardContent>
              </Link>
            </Card>

            <Card
              className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-emerald-100 to-emerald-200 cursor-pointer"
              asChild
            >
              <Link href="/sample-report">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-emerald-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Sparkles className="h-5 w-5 text-emerald-700" />
                </div>
                <CardHeader className="pb-4 relative z-10">
                  <div className="w-full h-24 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-500">
                    <TrendingUp className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-xl text-emerald-900 group-hover:text-emerald-800 transition-colors">
                    Single Insight
                  </CardTitle>
                  <CardDescription className="text-emerald-800">Samsung Electronics</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <Badge className="bg-emerald-300 text-emerald-900 text-xs mb-3">Expert Review</Badge>
                  <p className="text-sm text-emerald-800 leading-relaxed">
                    Comprehensive analysis with risk assessment, executive profiles, and detailed news analysis
                  </p>
                </CardContent>
              </Link>
            </Card>

            <Card
              className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-emerald-200 to-emerald-300 cursor-pointer"
              asChild
            >
              <Link href="/sample-custom">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Sparkles className="h-5 w-5 text-emerald-800" />
                </div>
                <CardHeader className="pb-4 relative z-10">
                  <div className="w-full h-24 bg-gradient-to-br from-emerald-700 to-emerald-800 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-500">
                    <Shield className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-xl text-emerald-900 group-hover:text-emerald-800 transition-colors">
                    Custom Insight
                  </CardTitle>
                  <CardDescription className="text-emerald-900">LG Group Analysis</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <Badge className="bg-emerald-400 text-emerald-900 text-xs mb-3">Tailored Research</Badge>
                  <p className="text-sm text-emerald-900 leading-relaxed">
                    Multi-company analysis with public data integration and comprehensive industry research
                  </p>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* News Analysis Feature */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced News Analysis</h2>
            <p className="text-xl text-gray-600">
              AI-powered sentiment analysis and risk detection from Korean business media
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-white">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-emerald-900 mb-4">Real-time Monitoring</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                        <span className="text-gray-700">24/7 monitoring of 50+ Korean business media sources</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                        <span className="text-gray-700">AI sentiment analysis with 94% accuracy rate</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                        <span className="text-gray-700">Automatic risk alert detection and categorization</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                        <span className="text-gray-700">Executive mention tracking and reputation monitoring</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-emerald-100 p-6 rounded-lg">
                    <h4 className="font-semibold text-emerald-800 mb-3">Sample Analysis Output</h4>
                    <div className="space-y-3 text-sm">
                      <div className="bg-white p-3 rounded border-l-4 border-green-500">
                        <p className="text-green-700 font-medium">Positive: Samsung Q4 earnings beat expectations</p>
                        <p className="text-gray-600 text-xs">Korea Herald • 2 hours ago</p>
                      </div>
                      <div className="bg-white p-3 rounded border-l-4 border-red-500">
                        <p className="text-red-700 font-medium">Risk Alert: LG Display faces panel oversupply</p>
                        <p className="text-gray-600 text-xs">Maeil Business • 4 hours ago</p>
                      </div>
                      <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                        <p className="text-blue-700 font-medium">Neutral: Hyundai Motor announces EV expansion</p>
                        <p className="text-gray-600 text-xs">Yonhap News • 6 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Redesigned */}
      <section className="bg-gradient-to-br from-emerald-50 to-emerald-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-emerald-900 mb-4">Why Leading Analysts Choose KHIP</h2>
            <p className="text-xl text-emerald-700">
              Unmatched depth, speed, and accuracy in Korean corporate intelligence
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-emerald-50 group">
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-emerald-900 text-xl mb-3">Lightning-Fast Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-emerald-700 leading-relaxed mb-4">
                  Our AI-powered system processes thousands of DART filings and news articles in real-time, delivering
                  comprehensive snapshots in under 5 minutes and full analysis reports within 24 hours. No more waiting
                  weeks for critical corporate intelligence.
                </p>
                <div className="bg-emerald-100 p-3 rounded-lg">
                  <p className="text-sm text-emerald-800 font-medium">Average delivery: 3.2 minutes for snapshots</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-emerald-50 group">
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-emerald-900 text-xl mb-3">Expert-Validated Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-emerald-700 leading-relaxed mb-4">
                  Every report undergoes rigorous review by our team of Korean market specialists and former investment
                  analysts. We combine AI efficiency with human expertise to ensure accuracy, context, and actionable
                  insights you can trust for critical decisions.
                </p>
                <div className="bg-emerald-100 p-3 rounded-lg">
                  <p className="text-sm text-emerald-800 font-medium">94% client satisfaction rate</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-emerald-50 group">
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-700 to-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-emerald-900 text-xl mb-3">Official Source Guarantee</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-emerald-700 leading-relaxed mb-4">
                  All data sourced exclusively from official Korean government systems including DART, MOTIE, Fair Trade
                  Commission, and verified business media. No speculation, no rumors - only verified information from
                  authoritative sources with full traceability.
                </p>
                <div className="bg-emerald-100 p-3 rounded-lg">
                  <p className="text-sm text-emerald-800 font-medium">100% official source verification</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-600">From quick snapshots to comprehensive analysis</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Free Trial */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-center">Free Trial</CardTitle>
                <div className="text-center">
                  <span className="text-3xl font-bold">$0</span>
                </div>
                <CardDescription className="text-center">Try 1 snapshot report</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">1 snapshot report</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Basic disclosure summary</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Recent news headlines</span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/start-trial">Start Free Trial</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Snapshot Plan */}
            <Card className="border-2 border-emerald-500 relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white">
                Most Popular
              </Badge>
              <CardHeader>
                <CardTitle className="text-center text-emerald-900">Snapshot Plan</CardTitle>
                <div className="text-center">
                  <span className="text-3xl font-bold">$29</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <CardDescription className="text-center">Unlimited snapshot viewing</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">1 new report generation/month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Unlimited snapshot viewing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">2,000+ company access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">DART summaries</span>
                  </li>
                </ul>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700" asChild>
                  <Link href="/order/snapshot-plan">Subscribe Now</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Single Insight */}
            <Card className="border-2 border-emerald-500">
              <CardHeader>
                <CardTitle className="text-center text-emerald-900">Single Insight</CardTitle>
                <div className="text-center">
                  <span className="text-3xl font-bold">$149</span>
                  <span className="text-gray-600">/report</span>
                </div>
                <CardDescription className="text-center">Comprehensive analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">All snapshot features</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Expert review included</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Risk assessment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">News analysis + sources</span>
                  </li>
                </ul>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700" asChild>
                  <Link href="/order/single-report">Order Report</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Custom Insight */}
            <Card className="border-2 border-emerald-500">
              <CardHeader>
                <CardTitle className="text-center text-emerald-900">Custom Insight</CardTitle>
                <div className="text-center">
                  <span className="text-3xl font-bold">$490</span>
                  <span className="text-gray-600">+</span>
                </div>
                <CardDescription className="text-center">Tailored research</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Unlimited snapshots</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Multi-company analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Public data integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Category-wise news analysis</span>
                  </li>
                </ul>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700" asChild>
                  <Link href="/custom-request">Request Quote</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of investors and analysts who trust KHIP for Korean corporate intelligence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100" asChild>
              <Link href="/start-trial">Start Free Trial</Link>
            </Button>
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100" asChild>
              <Link href="#samples">View Samples</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Disclaimer</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              The information provided by KHIP is for informational purposes only and should not be considered as
              investment advice, financial advice, trading advice, or any other sort of advice. KHIP does not recommend
              that any security should be bought, sold, or held by you. Do conduct your own due diligence and consult
              your financial advisor before making any investment decisions. Past performance is not indicative of
              future results. All data is sourced from official Korean disclosure systems and public sources, but
              accuracy cannot be guaranteed.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
