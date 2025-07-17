"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  Building2,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Settings,
  BarChart3,
  Home,
  AlertTriangle,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { useExportPdfQuery, useExportExcelQuery,useListDealsQuery } from "@/lib/redux/api/deal.api"
import AnalyzeDealDialog from "../analyze/_components/DoAnalysis"

interface IDeal {
  id: number
  analysis_result: {
    id?: number
    cap_rate: number | null
    cash_on_cash: number | null
    irr: number | null
    pass_status: boolean
    recommendations: string[] | null
    created_at?: string
    risk_explanation?: string | null
    risk_flags?: string[] | null
    risk_score?: string
    deal?: number
  } | null
  pass_status: boolean
  address: string
  city: string
  state: string
  zip_code: string
  property_type: string
  created_at: string
  asking_price: number
  fetched_data: {
    bedrooms: number
    bathrooms: number
    sqft: number
    price: number
    zestimate?: number
    rent: number
    cap_rate: number
    year_built: number
  }
  user: number
}

export default function DashboardPage() {
  const {data:deals, isLoading, error} = useListDealsQuery(undefined) as {data: IDeal[], isLoading: boolean, error: any}
  const [selectedDeal, setSelectedDeal] = useState<IDeal | null>(null)
  const [numberOfDeals, setNumberOfDeals] = useState(5)
  const [exportPdf, setExportPdf] = useState(false)
  const [exportExcel, setExportExcel] = useState(false)
  const {data, isLoading: pdfExporting} = useExportPdfQuery("",{
    skip: !exportPdf,
    })
  const {data:excelData, isLoading: excelExporting} = useExportExcelQuery("", {
    skip: !exportExcel
  })

    useEffect(() => {
    if (excelData && exportExcel) {
      console.log("Exporting PDF", excelData)
      const link = document.createElement('a')
      link.href = excelData.file_url
      link.download = 'deal_analysis.xlsx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(excelData.file_url)
      setExportExcel(false)
    }
  }, [excelData, exportExcel])

  if (isLoading) 
    return <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  

  if (error) 
   return  (<div className="flex items-center justify-center min-h-screen">
      <AlertCircle className="h-8 w-8 text-red-600" />
      <p className="text-red-600">Failed to load deals. Please try again later.</p>
    </div>
  )

  // if (!deals || deals.length === 0) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <p className="text-gray-600">No deals found. Start analyzing new properties!</p>
  //     </div>
  //   )
  // }
  const totalDeals = deals?.length || 0
  const passedDeals = deals?.filter((deal) => deal.analysis_result?.pass_status).length
  const passRate = totalDeals > 0 ? Math.round((passedDeals / totalDeals) * 100) : 0
  const avgDealSize =
    totalDeals > 0 ? Math.round(deals?.reduce((sum, deal) => sum + deal.asking_price, 0) / totalDeals) : 0
  const hoursSaved = totalDeals * 0.5 // Assuming 30 minutes saved per deal

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">PropPulls AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/settings">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your deals today.</p>
        </div>

        {/* Stats Cards */}
        {
          deals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDeals}</div>
              <p className="text-xs text-muted-foreground">Properties analyzed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{passRate}%</div>
              <Progress value={passRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(avgDealSize)}</div>
              <p className="text-xs text-muted-foreground">Average asking price</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hours Saved</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hoursSaved}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>
          ) : (
            <div className="text-center h-40 text-gray-500 py-8">
              <p>No deals found. Start analyzing new properties!</p>
            </div>
          )
        }

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link href="/analyze">
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="h-5 w-5 mr-2" />
              Analyze New Deal
            </Button>
          </Link>
          <Link href="/integrations">
            <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
              <Settings className="h-5 w-5 mr-2" />
              Manage Integrations
            </Button>
          </Link>
        </div>

        {/* Recent Deals */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Deals</CardTitle>
            <CardDescription>Your latest property analyses</CardDescription>
            <div className="flex self-end items-center justify-end pr-4">
              
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={() => setExportExcel(true)}
                disabled={excelExporting}
              >
                {excelExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Export Excel
                  </>
                )}  
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deals.slice(0, numberOfDeals).map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {deal.analysis_result?.pass_status ? (
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      ) : (
                        <XCircle className="h-8 w-8 text-red-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {deal.address}, {deal.city}, {deal.state} {deal.zip_code}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {deal.fetched_data.bedrooms > 0 && deal.fetched_data.bathrooms > 0 ? (
                          <>
                            {deal.fetched_data.bedrooms} bed • {deal.fetched_data.bathrooms} bath •{" "}
                            {deal.fetched_data.sqft.toLocaleString()} sqft • Built {deal.fetched_data.year_built}
                          </>
                        ) : (
                          <>
                            {deal.fetched_data.sqft.toLocaleString()} sqft • Built {deal.fetched_data.year_built}
                          </>
                        )}
                      </p>
                      <p className="text-xs text-gray-400">Analyzed on {formatDate(deal.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {deal.analysis_result?.cap_rate
                          ? `Cap Rate: ${formatPercentage(deal.analysis_result.cap_rate)}`
                          : `Fetched Cap: ${formatPercentage(deal.fetched_data.cap_rate)}`}
                      </div>
                      <div className="text-sm text-gray-500">Asking: {formatCurrency(deal.asking_price)}</div>
                      {deal.analysis_result?.cash_on_cash && (
                        <div className="text-sm text-gray-500">
                          CoC: {formatPercentage(deal.analysis_result.cash_on_cash)}
                        </div>
                      )}
                    </div>
                    <Badge variant={deal.analysis_result?.pass_status ? "default" : "destructive"}>
                      {deal.analysis_result?.pass_status ? "Pass" : "Fail"}
                    </Badge>
                    {/* <AnalyzeDealDialog dealId={deal.id} /> */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedDeal(deal)}>
                          <FileText className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-5xl min-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Deal Analysis Details</DialogTitle>
                          <DialogDescription>
                            Complete analysis for {deal.address}, {deal.city}, {deal.state}
                          </DialogDescription>
                        </DialogHeader>

                        {selectedDeal && (
                          <div className="space-y-6">
                            {/* Property Overview */}
                            <div>
                              <h3 className="text-lg font-semibold mb-3 flex items-center">
                                <Home className="h-5 w-5 mr-2" />
                                Property Overview
                              </h3>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                  <Label className="text-sm text-gray-600">Address</Label>
                                  <p className="font-medium">{selectedDeal.address}</p>
                                </div>
                                <div>
                                  <Label className="text-sm text-gray-600">City, State</Label>
                                  <p className="font-medium">
                                    {selectedDeal.city}, {selectedDeal.state}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm text-gray-600">ZIP Code</Label>
                                  <p className="font-medium">{selectedDeal.zip_code || "N/A"}</p>
                                </div>
                                <div>
                                  <Label className="text-sm text-gray-600">Bedrooms</Label>
                                  <p className="font-medium">{selectedDeal.fetched_data.bedrooms}</p>
                                </div>
                                <div>
                                  <Label className="text-sm text-gray-600">Bathrooms</Label>
                                  <p className="font-medium">{selectedDeal.fetched_data.bathrooms}</p>
                                </div>
                                <div>
                                  <Label className="text-sm text-gray-600">Square Feet</Label>
                                  <p className="font-medium">{selectedDeal.fetched_data.sqft.toLocaleString()}</p>
                                </div>
                                <div>
                                  <Label className="text-sm text-gray-600">Year Built</Label>
                                  <p className="font-medium">{selectedDeal.fetched_data.year_built}</p>
                                </div>
                                <div>
                                  <Label className="text-sm text-gray-600">Asking Price</Label>
                                  <p className="font-medium">{formatCurrency(selectedDeal.asking_price)}</p>
                                </div>
                                <div>
                                  <Label className="text-sm text-gray-600">Analysis Date</Label>
                                  <p className="font-medium">{formatDate(selectedDeal.created_at)}</p>
                                </div>
                              </div>
                            </div>

                            <Separator />

                            {/* Fetched Market Data */}
                            <div>
                              <h3 className="text-lg font-semibold mb-3 flex items-center">
                                <BarChart3 className="h-5 w-5 mr-2" />
                                Market Data
                              </h3>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                  <Label className="text-sm text-gray-600">Market Price</Label>
                                  <p className="font-medium">{formatCurrency(selectedDeal.fetched_data.price)}</p>
                                </div>
                                <div>
                                  <Label className="text-sm text-gray-600">Zestimate</Label>
                                  <p className="font-medium">{formatCurrency(selectedDeal.fetched_data.zestimate || 0)}</p>
                                </div>
                                <div>
                                  <Label className="text-sm text-gray-600">Monthly Rent</Label>
                                  <p className="font-medium">{formatCurrency(selectedDeal.fetched_data.rent)}</p>
                                </div>
                                <div>
                                  <Label className="text-sm text-gray-600">Fetched Cap Rate</Label>
                                  <p className="font-medium">{formatPercentage(selectedDeal.fetched_data.cap_rate)}</p>
                                </div>
                                <div>
                                  <Label className="text-sm text-gray-600">Annual Rent</Label>
                                  <p className="font-medium">{formatCurrency(selectedDeal.fetched_data.rent * 12)}</p>
                                </div>
                                <div>
                                  <Label className="text-sm text-gray-600">Price per SqFt</Label>
                                  <p className="font-medium">
                                    {formatCurrency(selectedDeal.fetched_data.price / selectedDeal.fetched_data.sqft)}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <Separator />

                            {/* Analysis Results */}
                            <div>
                              <h3 className="text-lg font-semibold mb-3 flex items-center">
                                <TrendingUp className="h-5 w-5 mr-2" />
                                Analysis Results
                              </h3>
                              {selectedDeal.analysis_result && selectedDeal.analysis_result.cap_rate !== null ? (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                      <div className="text-2xl font-bold text-blue-600">
                                        {formatPercentage(selectedDeal.analysis_result.cap_rate || 0)}
                                      </div>
                                      <div className="text-sm text-gray-600">Cap Rate</div>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                      <div className="text-2xl font-bold text-green-600">
                                        {formatPercentage(selectedDeal.analysis_result.cash_on_cash || 0)}
                                      </div>
                                      <div className="text-sm text-gray-600">Cash on Cash</div>
                                    </div>
                                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                                      <div className="text-2xl font-bold text-purple-600">
                                        {selectedDeal.analysis_result.irr
                                          ? formatPercentage(selectedDeal.analysis_result.irr)
                                          : "N/A"}
                                      </div>
                                      <div className="text-sm text-gray-600">IRR</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                      <Badge
                                        variant={selectedDeal.analysis_result.pass_status ? "default" : "destructive"}
                                        className="text-lg px-4 py-2"
                                      >
                                        {selectedDeal.analysis_result.pass_status ? "PASS" : "FAIL"}
                                      </Badge>
                                      <div className="text-sm text-gray-600 mt-2">Status</div>
                                    </div>
                                  </div>

                                  {/* Risk Assessment */}
                                  {selectedDeal.analysis_result.risk_score &&
                                    selectedDeal.analysis_result.risk_score !== "Unknown" && (
                                      <div className="mt-4">
                                        <h4 className="font-medium mb-2 flex items-center">
                                          <AlertTriangle className="h-4 w-4 mr-2" />
                                          Risk Assessment
                                        </h4>
                                        <div className="flex items-center space-x-2 mb-2">
                                          <Badge
                                            variant={
                                              selectedDeal.analysis_result.risk_score === "Low"
                                                ? "default"
                                                : selectedDeal.analysis_result.risk_score === "Medium"
                                                  ? "secondary"
                                                  : "destructive"
                                            }
                                          >
                                            {selectedDeal.analysis_result.risk_score} Risk
                                          </Badge>
                                        </div>
                                        {selectedDeal.analysis_result.risk_flags &&
                                          selectedDeal.analysis_result.risk_flags.length > 0 && (
                                            <div className="space-y-2">
                                              {selectedDeal.analysis_result.risk_flags.map((flag, index) => (
                                                <div
                                                  key={index}
                                                  className="flex items-start space-x-2 p-3 bg-yellow-50 rounded-lg"
                                                >
                                                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                                  <span className="text-sm">{flag}</span>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                      </div>
                                    )}

                                  {/* Recommendations */}
                                  {selectedDeal.analysis_result.recommendations &&
                                    selectedDeal.analysis_result.recommendations.length > 0 && (
                                      <div>
                                        <h4 className="font-medium mb-2">AI Recommendations</h4>
                                        <div className="space-y-2">
                                          {selectedDeal.analysis_result.recommendations.map((rec, index) => (
                                            <div
                                              key={index}
                                              className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg"
                                            >
                                              <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                              <span className="text-sm">{rec}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                </div>
                              ) : (
                                <div className="text-center py-8 text-gray-500">
                                  <p>No detailed analysis available for this property.</p>
                                  <p className="text-sm mt-1">Only basic market data was fetched.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>

            {deals.length > numberOfDeals  && (
              <div className="mt-4 text-center">
                <Button onClick={() => setNumberOfDeals(prev => prev + 5)} variant="outline" className="bg-transparent">
                  Show more
                </Button>
              </div>
            )}
            {
              deals.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <p>No recent deals found. Start analyzing new properties!</p>
                </div>
              )
            }
            {
              deals.length > 0 && deals.length <= numberOfDeals && (
                <div className="text-center text-gray-500 py-8">
                  <p>Showing {deals.length} recent deals.</p>
                </div>
              )
            }
            {
              numberOfDeals  > 5 && (
                <div className="text-center text-gray-500 py-8">
                  <Button variant="outline" className="bg-transparent" onClick={() => setNumberOfDeals(5)}>
                    Show less
                  </Button>
                </div>
              )
            }
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
