"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building2,
  Download,
  Share2,
  CheckCircle,
  XCircle,
  TrendingUp,
  DollarSign,
  Calendar,
  Users,
  AlertTriangle,
} from "lucide-react"

// Mock data for the analysis result
const mockResult = {
  address: "123 Main St, Atlanta, GA 30309",
  propertyType: "Multi-Family",
  units: 48,
  yearBuilt: 1998,
  askingPrice: 2400000,
  pricePerUnit: 50000,
  capRate: 7.2,
  cashOnCash: 8.5,
  irr: 12.3,
  passStatus: true,
  marketData: {
    avgHouseholdIncome: 68500,
    crimeScore: "B+",
    walkScore: 78,
    rentGrowth: 4.2,
  },
  financials: {
    grossIncome: 384000,
    expenses: 211200,
    noi: 172800,
    cashFlow: 8640,
  },
  recommendations: [
    "Consider unit renovations to increase rent by $50-75/month",
    "Implement utility billing to reduce expenses by 8-12%",
    "Market rent is 5% below comparable properties",
  ],
}

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/dashboard">
                <Building2 className="h-8 w-8 text-blue-600" />
              </Link>
              <span className="ml-2 text-2xl font-bold text-gray-900">Deal Analysis Results</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Property Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{mockResult.address}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <Building2 className="h-4 w-4 mr-1" />
                  {mockResult.propertyType}
                </span>
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {mockResult.units} units
                </span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Built {mockResult.yearBuilt}
                </span>
                <span className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />${mockResult.askingPrice.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="text-right">
              <Badge variant={mockResult.passStatus ? "default" : "destructive"} className="text-lg px-4 py-2">
                {mockResult.passStatus ? (
                  <CheckCircle className="h-5 w-5 mr-2" />
                ) : (
                  <XCircle className="h-5 w-5 mr-2" />
                )}
                {mockResult.passStatus ? "PASS" : "FAIL"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Cap Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{mockResult.capRate}%</div>
              <p className="text-xs text-gray-500 mt-1">Above 7% target</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Cash on Cash</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{mockResult.cashOnCash}%</div>
              <p className="text-xs text-gray-500 mt-1">Above 7% target</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">IRR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{mockResult.irr}%</div>
              <p className="text-xs text-gray-500 mt-1">10-year projection</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Price/Unit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">${mockResult.pricePerUnit.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">Market average</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="market">Market Data</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Property Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Type:</span>
                    <span className="font-medium">{mockResult.propertyType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Units:</span>
                    <span className="font-medium">{mockResult.units}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year Built:</span>
                    <span className="font-medium">{mockResult.yearBuilt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Asking Price:</span>
                    <span className="font-medium">${mockResult.askingPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per Unit:</span>
                    <span className="font-medium">${mockResult.pricePerUnit.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Investment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Net Operating Income:</span>
                    <span className="font-medium">${mockResult.financials.noi.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annual Cash Flow:</span>
                    <span className="font-medium">${mockResult.financials.cashFlow.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cap Rate:</span>
                    <span className="font-medium text-green-600">{mockResult.capRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cash on Cash:</span>
                    <span className="font-medium text-green-600">{mockResult.cashOnCash}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IRR (10-year):</span>
                    <span className="font-medium text-blue-600">{mockResult.irr}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="financials" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Breakdown</CardTitle>
                <CardDescription>Annual figures based on T12 and projections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Income</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gross Rental Income:</span>
                        <span className="font-medium">${mockResult.financials.grossIncome.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Other Income:</span>
                        <span className="font-medium">$12,000</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Total Income:</span>
                        <span className="font-medium">
                          ${(mockResult.financials.grossIncome + 12000).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Expenses</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Property Management:</span>
                        <span className="font-medium">$19,200</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Insurance:</span>
                        <span className="font-medium">$24,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Property Taxes:</span>
                        <span className="font-medium">$36,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Maintenance & Repairs:</span>
                        <span className="font-medium">$48,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Utilities:</span>
                        <span className="font-medium">$84,000</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Total Expenses:</span>
                        <span className="font-medium">${mockResult.financials.expenses.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium text-green-800">Net Operating Income:</span>
                      <span className="font-bold text-green-800">${mockResult.financials.noi.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Neighborhood Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Household Income:</span>
                    <span className="font-medium">${mockResult.marketData.avgHouseholdIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Crime Score:</span>
                    <Badge variant="secondary">{mockResult.marketData.crimeScore}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Walk Score:</span>
                    <span className="font-medium">{mockResult.marketData.walkScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rent Growth (YoY):</span>
                    <span className="font-medium text-green-600">+{mockResult.marketData.rentGrowth}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Market Comparables</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Cap Rate (Market):</span>
                    <span className="font-medium">6.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Price/Unit:</span>
                    <span className="font-medium">$52,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Rent/SF:</span>
                    <span className="font-medium">$1.25</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Occupancy Rate:</span>
                    <span className="font-medium">94%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  AI Recommendations
                </CardTitle>
                <CardDescription>Ways to optimize this investment opportunity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockResult.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">Schedule property tour and inspection</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">Request updated rent roll and financials</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">Prepare Letter of Intent (LOI)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">Conduct due diligence review</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button size="lg" className="flex-1">
            <Download className="h-5 w-5 mr-2" />
            Export PDF Report
          </Button>
          <Button variant="outline" size="lg" className="flex-1 bg-transparent">
            <Download className="h-5 w-5 mr-2" />
            Download Excel Model
          </Button>
          <Button variant="outline" size="lg" className="flex-1 bg-transparent">
            Generate LOI
          </Button>
        </div>
      </div>
    </div>
  )
}
