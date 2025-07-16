"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Building2, Settings, CheckCircle, AlertCircle, Plus, ExternalLink } from "lucide-react"
import Link from "next/link"

type IntegrationFormData = {
  apiKey: string
  username: string
  password: string
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState([
    {
      id: 1,
      name: "CoStar",
      description: "Commercial real estate data and analytics platform",
      status: "connected",
      features: ["Property data", "Market comps", "Demographics", "Historical data"],
      isEnabled: true,
    },
    {
      id: 2,
      name: "Zillow",
      description: "Residential and commercial property information",
      status: "connected",
      features: ["Property details", "Zestimate", "Market trends", "Photos"],
      isEnabled: true,
    },
    {
      id: 3,
      name: "Neighborhood Scout",
      description: "Crime data, school ratings, and neighborhood analytics",
      status: "connected",
      features: ["Crime scores", "School ratings", "Demographics", "Walkability"],
      isEnabled: false,
    },
    {
      id: 4,
      name: "Yardy Matrix",
      description: "Multifamily market data and analytics",
      status: "disconnected",
      features: ["Rent comps", "Occupancy rates", "Market surveys", "Investment sales"],
      isEnabled: false,
    },
    {
      id: 5,
      name: "LoopNet",
      description: "Commercial real estate listings and market data",
      status: "disconnected",
      features: ["Property listings", "Market data", "Investment opportunities", "Tenant information"],
      isEnabled: false,
    },
    {
      id: 6,
      name: "RealPage",
      description: "Property management and market intelligence",
      status: "disconnected",
      features: ["Market analytics", "Rent surveys", "Occupancy data", "Revenue management"],
      isEnabled: false,
    },
  ])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IntegrationFormData>()

  const handleConnect = (integrationId: number, data: IntegrationFormData) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === integrationId ? { ...integration, status: "connected" as const } : integration,
      ),
    )
    reset()
  }

  const handleDisconnect = (integrationId: number) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === integrationId
          ? { ...integration, status: "disconnected" as const, isEnabled: false }
          : integration,
      ),
    )
  }

  const handleToggle = (integrationId: number, enabled: boolean) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === integrationId ? { ...integration, isEnabled: enabled } : integration,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/dashboard">
              <Building2 className="h-8 w-8 text-blue-600" />
            </Link>
            <span className="text-2xl font-bold text-gray-900">Data Integrations</span>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Source Integrations</h1>
          <p className="text-gray-600">
            Connect your data sources to enhance property analysis with real-time market data.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connected Sources</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Out of 6 available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sources</CardTitle>
              <Settings className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Currently enabled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Quality</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">95%</div>
              <p className="text-xs text-muted-foreground">Coverage accuracy</p>
            </CardContent>
          </Card>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <Card key={integration.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>{integration.name}</span>
                      {integration.status === "connected" ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-gray-400" />
                      )}
                    </CardTitle>
                    <CardDescription className="mt-2">{integration.description}</CardDescription>
                  </div>
                  <Badge variant={integration.status === "connected" ? "default" : "secondary"}>
                    {integration.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Features */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">Features</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {integration.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-3">
                  {integration.status === "connected" && (
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`toggle-${integration.id}`} className="text-sm">
                        Enable for analysis
                      </Label>
                      <Switch
                        id={`toggle-${integration.id}`}
                        checked={integration.isEnabled}
                        onCheckedChange={(checked) => handleToggle(integration.id, checked)}
                      />
                    </div>
                  )}

                  <div className="flex space-x-2">
                    {integration.status === "connected" ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => handleDisconnect(integration.id)}
                        >
                          Disconnect
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" className="flex-1">
                            <Plus className="h-4 w-4 mr-2" />
                            Connect
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Connect to {integration.name}</DialogTitle>
                            <DialogDescription>
                              Enter your {integration.name} credentials to connect this data source.
                            </DialogDescription>
                          </DialogHeader>

                          <form
                            onSubmit={handleSubmit((data) => handleConnect(integration.id, data))}
                            className="space-y-4"
                          >
                            {integration.name === "CoStar" && (
                              <>
                                <div>
                                  <Label htmlFor="username">Username</Label>
                                  <Input
                                    id="username"
                                    placeholder="Your CoStar username"
                                    {...register("username", { required: "Username is required" })}
                                  />
                                  {errors.username && (
                                    <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>
                                  )}
                                </div>
                                <div>
                                  <Label htmlFor="password">Password</Label>
                                  <Input
                                    id="password"
                                    type="password"
                                    placeholder="Your CoStar password"
                                    {...register("password", { required: "Password is required" })}
                                  />
                                  {errors.password && (
                                    <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                                  )}
                                </div>
                              </>
                            )}

                            {integration.name !== "CoStar" && (
                              <div>
                                <Label htmlFor="apiKey">API Key</Label>
                                <Input
                                  id="apiKey"
                                  placeholder={`Your ${integration.name} API key`}
                                  {...register("apiKey", { required: "API key is required" })}
                                />
                                {errors.apiKey && <p className="text-sm text-red-600 mt-1">{errors.apiKey.message}</p>}
                              </div>
                            )}

                            <div className="flex space-x-2">
                              <Button type="submit" className="flex-1">
                                Connect
                              </Button>
                              <DialogTrigger asChild>
                                <Button type="button" variant="outline">
                                  Cancel
                                </Button>
                              </DialogTrigger>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              Having trouble connecting your data sources? Here are some common solutions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">API Key Issues</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Ensure your API key has the correct permissions</li>
                  <li>• Check that your subscription is active</li>
                  <li>• Verify the API key hasn't expired</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Connection Problems</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Check your internet connection</li>
                  <li>• Verify your credentials are correct</li>
                  <li>• Contact support if issues persist</li>
                </ul>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="outline">Contact Support</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
