import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, TrendingUp, Users, Zap, FileText, BarChart3, Settings } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <Building2 className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-2xl font-bold text-gray-900">PropPulls AI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="#pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="/login">
            Login
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary" className="mb-4">
                  AI-Powered Commercial Real Estate Analysis
                </Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Underwrite Any Commercial Real Estate Deal in <span className="text-blue-600">30 Seconds</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  AI-powered deal analysis that pulls property data, analyzes financials, and delivers instant
                  investment decisions with institutional-grade accuracy.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/login">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="#demo">
                  <Button variant="outline" size="lg">
                    Watch Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-blue-600">30 sec</div>
                <div className="text-sm text-gray-500">Average Analysis Time</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-blue-600">100x</div>
                <div className="text-sm text-gray-500">Faster Than Manual Analysis</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-blue-600">95%</div>
                <div className="text-sm text-gray-500">Accuracy Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Everything You Need for Deal Analysis
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl mt-4">
                From property data to financial modeling, we've got you covered.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Zap className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle>Instant Data Fetching</CardTitle>
                  <CardDescription>
                    Automatically pull property data from CoStar, Zillow, and other integrated platforms
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <FileText className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle>Document Processing</CardTitle>
                  <CardDescription>Upload T12 financials and rent rolls for AI-powered analysis</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <BarChart3 className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle>Financial Modeling</CardTitle>
                  <CardDescription>Get cap rates, cash-on-cash returns, and IRR calculations instantly</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle>Market Analysis</CardTitle>
                  <CardDescription>Comprehensive market comps and neighborhood analysis</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Settings className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle>Custom Criteria</CardTitle>
                  <CardDescription>Set your own deal criteria and investment parameters</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle>Export & Share</CardTitle>
                  <CardDescription>Generate PDF reports, Excel models, and LOI documents</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to 100x Your Deal Analysis?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl">
                  Join thousands of real estate professionals who are already using AI to analyze deals faster.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Link href="/login" className="w-full">
                  <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                    Start Free Trial
                  </Button>
                </Link>
                <p className="text-xs text-gray-500">No credit card required. 14-day free trial.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2024 PropPulls AI. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
