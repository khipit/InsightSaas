"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Download, Clock, CheckCircle, AlertCircle, Eye } from "lucide-react"

interface Purchase {
  id: string
  userId: string
  type: "single-report" | "snapshot-plan"
  companyId: string
  companyName: string
  status: "pending" | "delivered" | "failed"
  purchaseDate: string
  deliveryDate?: string
  reportUrl?: string
  amount: number
}

interface ReportStatusCardProps {
  purchase: Purchase
}

export function ReportStatusCard({ purchase }: ReportStatusCardProps) {
  const getStatusBadge = () => {
    switch (purchase.status) {
      case "pending":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-700 bg-yellow-50">
            <Clock className="mr-1 h-3 w-3" />
            Processing
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
            <CheckCircle className="mr-1 h-3 w-3" />
            Delivered
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="border-red-500 text-red-700 bg-red-50">
            <AlertCircle className="mr-1 h-3 w-3" />
            Failed
          </Badge>
        )
      default:
        return null
    }
  }

  const getDeliveryInfo = () => {
    if (purchase.status === "delivered" && purchase.deliveryDate) {
      return `Delivered on ${new Date(purchase.deliveryDate).toLocaleDateString()}`
    }
    if (purchase.status === "pending") {
      const orderDate = new Date(purchase.purchaseDate)
      const expectedDelivery = new Date(orderDate.getTime() + 24 * 60 * 60 * 1000) // 24 hours later
      return `Expected delivery: ${expectedDelivery.toLocaleDateString()}`
    }
    return null
  }

  const isOverdue = () => {
    if (purchase.status !== "pending") return false
    const orderDate = new Date(purchase.purchaseDate)
    const now = new Date()
    const hoursSinceOrder = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60)
    return hoursSinceOrder > 24
  }

  return (
    <Card className={`${isOverdue() ? "border-red-200 bg-red-50" : ""}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{purchase.companyName}</CardTitle>
            <CardDescription>
              {purchase.type === "single-report" ? "Single Insight Report" : "Snapshot Plan"} • Ordered on{" "}
              {new Date(purchase.purchaseDate).toLocaleDateString()}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            <Badge variant="outline">${purchase.amount}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Delivery Information */}
          <div className="text-sm text-gray-600">
            {getDeliveryInfo()}
            {isOverdue() && (
              <div className="text-red-600 font-medium mt-1">⚠️ This order is overdue (over 24 hours)</div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {/* Always show snapshot access for single reports */}
            {purchase.type === "single-report" && (
              <Button size="sm" variant="outline" asChild>
                <Link href={`/reports/snapshot/${purchase.companyId}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Snapshot
                </Link>
              </Button>
            )}

            {/* Show download button if delivered */}
            {purchase.status === "delivered" && purchase.reportUrl && (
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" asChild>
                <Link href={purchase.reportUrl}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Link>
              </Button>
            )}

            {/* Show pending message */}
            {purchase.status === "pending" && (
              <div className="text-sm text-gray-500 flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Full report will be ready within 24 hours
              </div>
            )}
          </div>

          {/* Progress indicator for pending orders */}
          {purchase.status === "pending" && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Processing...</span>
                <span>Within 24 hours</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, ((new Date().getTime() - new Date(purchase.purchaseDate).getTime()) / (24 * 60 * 60 * 1000)) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
