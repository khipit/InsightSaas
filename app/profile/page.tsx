"use client"

import { useAuth } from "@/components/auth-provider"
import { usePurchases } from "@/components/purchase-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Calendar, CreditCard, FileText, Settings, Shield } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { InvoiceGenerator } from "@/components/invoice-generator"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const { getPurchasesByUser, getSubscriptionEndDate } = usePurchases()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
  })
  const [userPurchases, setUserPurchases] = useState([])
  const [activeSubscriptions, setActiveSubscriptions] = useState([])
  const [completedReports, setCompletedReports] = useState([])
  const [subscriptionEndDate, setSubscriptionEndDate] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      const purchases = getPurchasesByUser(user.id)
      setUserPurchases(purchases)
      setActiveSubscriptions(purchases.filter((p) => p.type === "snapshot-plan" && p.status === "delivered"))
      setCompletedReports(purchases.filter((p) => p.status === "delivered"))

      // Get subscription end date
      const endDate = getSubscriptionEndDate(user.id)
      setSubscriptionEndDate(endDate)
    }
  }, [user, getPurchasesByUser, getSubscriptionEndDate])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please log in to view your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-emerald-900">{user.name}</CardTitle>
                    <CardDescription className="text-emerald-700 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm text-emerald-600">Member since {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
            </CardHeader>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Account Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-emerald-600" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={formData.name || user.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email || user.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="company">Company</Label>
                          <Input
                            id="company"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            placeholder="Enter your company name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="Enter your phone number"
                          />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Button className="bg-emerald-600 hover:bg-emerald-700">Save Changes</Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                          <p className="text-gray-900">{user.name}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Email Address</Label>
                          <p className="text-gray-900">{user.email}</p>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Company</Label>
                          <p className="text-gray-900">Not specified</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Phone Number</Label>
                          <p className="text-gray-900">Not specified</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Purchase History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-600" />
                    Purchase History
                  </CardTitle>
                  <CardDescription>Your report orders and subscriptions</CardDescription>
                </CardHeader>
                <CardContent>
                  {userPurchases.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No purchases yet</p>
                      <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
                        <Link href="/start-trial">Start Free Trial</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userPurchases.map((purchase) => (
                        <div
                          key={purchase.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <div>
                            <h4 className="font-medium">{purchase.companyName}</h4>
                            <p className="text-sm text-gray-600">
                              {purchase.type === "snapshot-plan"
                                ? "Snapshot Plan Subscription"
                                : purchase.type === "single-report"
                                  ? "Single Insight Report"
                                  : "Custom Research"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(purchase.purchaseDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right flex items-center gap-3">
                            <div>
                              <Badge
                                className={
                                  purchase.status === "delivered"
                                    ? "bg-green-100 text-green-800"
                                    : purchase.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : purchase.status === "under_review"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-red-100 text-red-800"
                                }
                              >
                                {purchase.status === "under_review" ? "Under Review" : purchase.status}
                              </Badge>
                              <p className="text-sm font-medium mt-1">${purchase.amount}</p>
                            </div>
                            <InvoiceGenerator
                              purchase={purchase}
                              userInfo={{
                                name: user.name,
                                email: user.email,
                                company: formData.company || undefined,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-emerald-600" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Password</h4>
                        <p className="text-sm text-gray-600">Last updated 30 days ago</p>
                      </div>
                      <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                        Change Password
                      </Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                        Enable 2FA
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Account Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Account Type</span>
                      <Badge className="bg-emerald-100 text-emerald-800">
                        {activeSubscriptions.length > 0 ? "Premium" : "Free"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Reports Generated</span>
                      <span className="font-medium">{completedReports.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Subscriptions</span>
                      <span className="font-medium">{activeSubscriptions.length}</span>
                    </div>
                    {subscriptionEndDate && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Subscription Until</span>
                          <span className="font-medium text-blue-600">
                            {new Date(subscriptionEndDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Days Remaining</span>
                          <span className="font-medium text-emerald-600">
                            {Math.ceil(
                              (new Date(subscriptionEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                            )}{" "}
                            days
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700" asChild>
                      <Link href="/dashboard/snapshot">
                        <FileText className="mr-2 h-4 w-4" />
                        View Dashboard
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                      asChild
                    >
                      <Link href="/order/single-report">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Order New Report
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                      asChild
                    >
                      <Link href="/my-reports">
                        <FileText className="mr-2 h-4 w-4" />
                        My Reports
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Support */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/help">Help Center</Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/contact">Contact Support</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
