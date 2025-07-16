"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Save, User, DollarSign, Bell } from "lucide-react"

interface FilterSettings {
  minCapRate: number
  minCashOnCash: number
  maxPrice: number
  minYearBuilt: number
  propertyTypes: string[]
}

interface ProfileSettings {
  firstName: string
  lastName: string
  email: string
  company: string
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    dealAlerts: true,
    weeklyReports: true,
    marketUpdates: false,
  })

  const {
    handleSubmit: handleFilterSubmit,
    register: registerFilter,
    formState: { errors: filterErrors },
  } = useForm<FilterSettings>({
    defaultValues: {
      minCapRate: 7.0,
      minCashOnCash: 7.0,
      maxPrice: 5000000,
      minYearBuilt: 1980,
    },
  })

  const {
    handleSubmit: handleProfileSubmit,
    register: registerProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileSettings>({
    defaultValues: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      company: "Real Estate Investments LLC",
    },
  })

  const onFilterSubmit = (data: FilterSettings) => {
    console.log("Filter settings:", data)
    // Save to backend
  }

  const onProfileSubmit = (data: ProfileSettings) => {
    console.log("Profile settings:", data)
    // Save to backend
  }

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
              <span className="ml-2 text-2xl font-bold text-gray-900">Settings</span>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="filters" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="filters" className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Deal Filters
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="filters">
            <Card>
              <CardHeader>
                <CardTitle>Investment Criteria</CardTitle>
                <CardDescription>
                  Set your default deal filtering criteria. These will be used to automatically evaluate deals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFilterSubmit(onFilterSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="minCapRate">Minimum Cap Rate (%)</Label>
                      <Input
                        id="minCapRate"
                        type="number"
                        step="0.1"
                        {...registerFilter("minCapRate", {
                          required: "Cap rate is required",
                          min: { value: 0, message: "Must be positive" },
                        })}
                      />
                      {filterErrors.minCapRate && (
                        <p className="text-sm text-red-600">{filterErrors.minCapRate.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="minCashOnCash">Minimum Cash-on-Cash (%)</Label>
                      <Input
                        id="minCashOnCash"
                        type="number"
                        step="0.1"
                        {...registerFilter("minCashOnCash", {
                          required: "Cash-on-cash is required",
                          min: { value: 0, message: "Must be positive" },
                        })}
                      />
                      {filterErrors.minCashOnCash && (
                        <p className="text-sm text-red-600">{filterErrors.minCashOnCash.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxPrice">Maximum Price ($)</Label>
                      <Input
                        id="maxPrice"
                        type="number"
                        {...registerFilter("maxPrice", {
                          required: "Max price is required",
                          min: { value: 100000, message: "Must be at least $100,000" },
                        })}
                      />
                      {filterErrors.maxPrice && <p className="text-sm text-red-600">{filterErrors.maxPrice.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="minYearBuilt">Minimum Year Built</Label>
                      <Input
                        id="minYearBuilt"
                        type="number"
                        {...registerFilter("minYearBuilt", {
                          required: "Year built is required",
                          min: { value: 1900, message: "Must be after 1900" },
                        })}
                      />
                      {filterErrors.minYearBuilt && (
                        <p className="text-sm text-red-600">{filterErrors.minYearBuilt.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Property Types</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {["Multi-Family", "Office", "Retail", "Industrial", "Mixed Use", "Hotel"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={type}
                            className="rounded border-gray-300"
                            defaultChecked={["Multi-Family", "Office"].includes(type)}
                          />
                          <Label htmlFor={type} className="text-sm">
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" className="w-full md:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    Save Filter Settings
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal and company information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" {...registerProfile("firstName", { required: "First name is required" })} />
                      {profileErrors.firstName && (
                        <p className="text-sm text-red-600">{profileErrors.firstName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" {...registerProfile("lastName", { required: "Last name is required" })} />
                      {profileErrors.lastName && (
                        <p className="text-sm text-red-600">{profileErrors.lastName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...registerProfile("email", {
                          required: "Email is required",
                          pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                        })}
                      />
                      {profileErrors.email && <p className="text-sm text-red-600">{profileErrors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" {...registerProfile("company")} />
                    </div>
                  </div>

                  <Button type="submit" className="w-full md:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what notifications you'd like to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dealAlerts">Deal Alerts</Label>
                    <p className="text-sm text-gray-500">Get notified when deals match your criteria</p>
                  </div>
                  <Switch
                    id="dealAlerts"
                    checked={notifications.dealAlerts}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, dealAlerts: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weeklyReports">Weekly Reports</Label>
                    <p className="text-sm text-gray-500">Receive weekly analysis summaries</p>
                  </div>
                  <Switch
                    id="weeklyReports"
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, weeklyReports: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketUpdates">Market Updates</Label>
                    <p className="text-sm text-gray-500">Get updates on market trends</p>
                  </div>
                  <Switch
                    id="marketUpdates"
                    checked={notifications.marketUpdates}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, marketUpdates: checked }))}
                  />
                </div>

                <Button className="w-full md:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
